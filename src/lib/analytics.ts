import { createHash } from "crypto";
import { connectMongo } from "@/lib/mongodb";
import { PageViewModel } from "@/models/PageView";

const SESSION_GAP_MS = 30 * 60 * 1000; // 30 min d'inactivité = nouvelle session
const MAX_PAGE_MS = 30 * 60 * 1000; // plafond du temps attribué à une page

// --- Détection & parsing ---------------------------------------------------

function isBot(ua: string): boolean {
  return /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|preview|monitor|lighthouse|headless|curl|wget|python-requests|axios|node-fetch/i.test(
    ua
  );
}

function parseUa(ua: string): { device: string; browser: string; os: string } {
  const u = ua.toLowerCase();
  const device = /ipad|tablet/.test(u)
    ? "tablet"
    : /mobile|iphone|android/.test(u)
      ? "mobile"
      : "desktop";
  const browser = u.includes("edg/")
    ? "Edge"
    : u.includes("chrome/") && !u.includes("edg/") && !u.includes("opr/")
      ? "Chrome"
      : u.includes("firefox/")
        ? "Firefox"
        : u.includes("safari/") && !u.includes("chrome")
          ? "Safari"
          : u.includes("opr/") || u.includes("opera")
            ? "Opera"
            : "Autre";
  const os = u.includes("windows")
    ? "Windows"
    : u.includes("mac os")
      ? "macOS"
      : u.includes("android")
        ? "Android"
        : /iphone|ipad|ios/.test(u)
          ? "iOS"
          : u.includes("linux")
            ? "Linux"
            : "Autre";
  return { device, browser, os };
}

function deriveSource(referrer: string, selfHost: string): string {
  if (!referrer) return "Direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    const self = selfHost.replace(/^https?:\/\//, "").replace(/^www\./, "");
    if (self && host === self) return "Direct"; // navigation interne
    if (/google\./.test(host)) return "Google";
    if (/bing\./.test(host)) return "Bing";
    if (/duckduckgo/.test(host)) return "DuckDuckGo";
    if (/yahoo/.test(host)) return "Yahoo";
    if (/t\.co|twitter|x\.com/.test(host)) return "X / Twitter";
    if (/facebook|fb\.com/.test(host)) return "Facebook";
    if (/linkedin/.test(host)) return "LinkedIn";
    if (/reddit/.test(host)) return "Reddit";
    if (/youtube|youtu\.be/.test(host)) return "YouTube";
    if (/instagram/.test(host)) return "Instagram";
    return host;
  } catch {
    return "Direct";
  }
}

function visitorHash(ip: string, ua: string, day: string): string {
  const salt =
    process.env.ANALYTICS_SALT ||
    process.env.AUTH_SECRET ||
    "planeteia-analytics";
  return createHash("sha256")
    .update(`${salt}|${day}|${ip}|${ua}`)
    .digest("hex")
    .slice(0, 32);
}

// --- Collecte --------------------------------------------------------------

export async function recordPageView(input: {
  path: string;
  referrer: string;
  ip: string;
  ua: string;
}): Promise<void> {
  const { referrer, ip, ua } = input;
  if (!ua || isBot(ua)) return;

  // Normalise le chemin (sans query/ancre/trailing slash).
  const path =
    input.path.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";

  // On ne traque pas l'admin ni les routes API.
  if (path.startsWith("/admin") || path.startsWith("/api")) return;

  await connectMongo();
  const day = new Date().toISOString().slice(0, 10);
  const visitorId = visitorHash(ip, ua, day);
  const { device, browser, os } = parseUa(ua);
  const source = deriveSource(referrer, process.env.NEXT_PUBLIC_BASE_URL || "");

  await PageViewModel.create({ visitorId, path, source, device, browser, os });
}

// --- Reporting -------------------------------------------------------------

export type LabelCount = { label: string; count: number };

export type AnalyticsSummary = {
  range: number;
  totalPageviews: number;
  uniqueVisitors: number;
  totalSessions: number;
  pagesPerSession: number;
  avgSessionDurationSec: number;
  avgTimeOnPageSec: number;
  bounceRatePct: number;
  timeseries: { day: string; views: number; visitors: number }[];
  topPages: { path: string; views: number }[];
  sources: LabelCount[];
  devices: LabelCount[];
  browsers: LabelCount[];
};

const ms = (d: Date | string) => new Date(d).getTime();

export async function getAnalyticsSummary(
  days = 30
): Promise<AnalyticsSummary> {
  await connectMongo();
  const start = new Date(Date.now() - days * 86_400_000);

  const rows = await PageViewModel.find({ ts: { $gte: start } })
    .select({ visitorId: 1, path: 1, source: 1, device: 1, browser: 1, ts: 1 })
    .sort({ visitorId: 1, ts: 1 })
    .limit(100_000)
    .lean();

  const totalPageviews = rows.length;
  const uniqueVisitors = new Set(rows.map((r) => r.visitorId)).size;

  let totalSessions = 0;
  let bounceSessions = 0;
  let sumSessionDur = 0;
  let sumPageDur = 0;
  let pageDurCount = 0;
  const sources: Record<string, number> = {};
  const devices: Record<string, number> = {};
  const browsers: Record<string, number> = {};

  // Les lignes sont triées par (visitorId, ts) → sessions reconstituées par gap.
  let i = 0;
  while (i < rows.length) {
    const visitor = rows[i].visitorId;
    const events: typeof rows = [];
    while (i < rows.length && rows[i].visitorId === visitor) {
      events.push(rows[i]);
      i++;
    }

    let s = 0;
    while (s < events.length) {
      let e = s;
      while (
        e + 1 < events.length &&
        ms(events[e + 1].ts!) - ms(events[e].ts!) <= SESSION_GAP_MS
      ) {
        sumPageDur += Math.min(ms(events[e + 1].ts!) - ms(events[e].ts!), MAX_PAGE_MS);
        pageDurCount++;
        e++;
      }
      const pages = e - s + 1;
      totalSessions++;
      sumSessionDur += ms(events[e].ts!) - ms(events[s].ts!);
      if (pages === 1) bounceSessions++;

      const entry = events[s];
      const sKey = entry.source || "Direct";
      const dKey = entry.device || "desktop";
      const bKey = entry.browser || "Autre";
      sources[sKey] = (sources[sKey] || 0) + 1;
      devices[dKey] = (devices[dKey] || 0) + 1;
      browsers[bKey] = (browsers[bKey] || 0) + 1;

      s = e + 1;
    }
  }

  // Séries temporelles + top pages.
  const dayMap: Record<string, { views: number; visitors: Set<string> }> = {};
  const pageMap: Record<string, number> = {};
  for (const r of rows) {
    const day = new Date(r.ts!).toISOString().slice(0, 10);
    if (!dayMap[day]) dayMap[day] = { views: 0, visitors: new Set() };
    dayMap[day].views++;
    dayMap[day].visitors.add(r.visitorId);
    pageMap[r.path] = (pageMap[r.path] || 0) + 1;
  }

  const timeseries: AnalyticsSummary["timeseries"] = [];
  for (let d = days - 1; d >= 0; d--) {
    const day = new Date(Date.now() - d * 86_400_000).toISOString().slice(0, 10);
    const entry = dayMap[day];
    timeseries.push({
      day,
      views: entry?.views || 0,
      visitors: entry ? entry.visitors.size : 0,
    });
  }

  const topPages = Object.entries(pageMap)
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 12);

  const toLabelCount = (m: Record<string, number>): LabelCount[] =>
    Object.entries(m)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

  return {
    range: days,
    totalPageviews,
    uniqueVisitors,
    totalSessions,
    pagesPerSession: totalSessions ? totalPageviews / totalSessions : 0,
    avgSessionDurationSec: totalSessions
      ? Math.round(sumSessionDur / totalSessions / 1000)
      : 0,
    avgTimeOnPageSec: pageDurCount
      ? Math.round(sumPageDur / pageDurCount / 1000)
      : 0,
    bounceRatePct: totalSessions
      ? Math.round((bounceSessions / totalSessions) * 100)
      : 0,
    timeseries,
    topPages,
    sources: toLabelCount(sources),
    devices: toLabelCount(devices),
    browsers: toLabelCount(browsers),
  };
}

export function formatDuration(sec: number): string {
  if (sec <= 0) return "0s";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}
