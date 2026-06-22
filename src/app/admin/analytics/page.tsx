import Link from "next/link";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  getAnalyticsSummary,
  formatDuration,
  type LabelCount,
} from "@/lib/analytics";

export const dynamic = "force-dynamic";

const RANGES = [
  { days: 7, label: "7 j" },
  { days: 30, label: "30 j" },
  { days: 90, label: "90 j" },
];

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const session = await auth();
  const sp = await searchParams;
  const days = [7, 30, 90].includes(Number(sp.days)) ? Number(sp.days) : 30;
  const data = await getAnalyticsSummary(days);

  const maxViews = Math.max(1, ...data.timeseries.map((t) => t.views));

  return (
    <AdminShell active="Analytics" user={session!.user}>
      <header className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span className="font-mono text-[11px] tracking-[2.4px] text-accent uppercase">
            Reporting interne · cookieless
          </span>
          <h1 className="font-serif text-[44px] font-bold tracking-[-0.8px] m-0 mt-3 leading-[1.05]">
            Analytics
          </h1>
        </div>
        <div className="flex gap-2">
          {RANGES.map((r) => (
            <Link
              key={r.days}
              href={`/admin/analytics?days=${r.days}`}
              className={`font-mono text-[12px] px-3 py-2 border no-underline transition-colors ${
                r.days === days
                  ? "bg-ink text-paper border-ink"
                  : "text-ink border-rule hover:border-ink"
              }`}
            >
              {r.label}
            </Link>
          ))}
        </div>
      </header>

      {data.totalPageviews === 0 ? (
        <div className="border border-rule px-6 py-16 text-center">
          <p className="font-serif italic text-[18px] text-ink-2 m-0">
            Aucune donnée sur les {days} derniers jours.
          </p>
          <p className="font-sans text-[13px] text-muted mt-2 m-0">
            Les pages vues apparaîtront ici dès que des visiteurs navigueront sur
            le site (l&apos;admin n&apos;est pas comptabilisé).
          </p>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <Kpi label="Pages vues" value={data.totalPageviews.toLocaleString("fr-FR")} />
            <Kpi label="Visiteurs" value={data.uniqueVisitors.toLocaleString("fr-FR")} />
            <Kpi label="Sessions" value={data.totalSessions.toLocaleString("fr-FR")} />
            <Kpi
              label="Durée moy. / session"
              value={formatDuration(data.avgSessionDurationSec)}
            />
            <Kpi
              label="Temps moy. / page"
              value={formatDuration(data.avgTimeOnPageSec)}
            />
            <Kpi
              label="Pages / session"
              value={data.pagesPerSession.toFixed(1)}
            />
            <Kpi label="Taux de rebond" value={`${data.bounceRatePct} %`} />
          </section>

          {/* Courbe pages vues */}
          <section className="mb-10">
            <SectionTitle>Pages vues par jour</SectionTitle>
            <div className="border border-rule p-5">
              <div className="flex items-end gap-[3px] h-[160px]">
                {data.timeseries.map((t) => (
                  <div
                    key={t.day}
                    className="flex-1 bg-accent/80 hover:bg-accent transition-colors min-h-[2px] rounded-t-[2px]"
                    style={{ height: `${(t.views / maxViews) * 100}%` }}
                    title={`${t.day} · ${t.views} pages · ${t.visitors} visiteurs`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 font-mono text-[10px] text-muted">
                <span>{data.timeseries[0]?.day}</span>
                <span>{data.timeseries[data.timeseries.length - 1]?.day}</span>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top pages */}
            <section>
              <SectionTitle>Pages les plus vues</SectionTitle>
              <RankTable
                rows={data.topPages.map((p) => ({
                  label: p.path,
                  count: p.views,
                }))}
                unit="vues"
                mono
              />
            </section>

            {/* Sources */}
            <section>
              <SectionTitle>Sources de trafic</SectionTitle>
              <RankTable rows={data.sources} unit="sessions" />
            </section>

            {/* Appareils */}
            <section>
              <SectionTitle>Appareils</SectionTitle>
              <RankTable rows={data.devices} unit="sessions" />
            </section>

            {/* Navigateurs */}
            <section>
              <SectionTitle>Navigateurs</SectionTitle>
              <RankTable rows={data.browsers} unit="sessions" />
            </section>
          </div>

          <p className="font-sans text-[11px] text-muted mt-10 leading-[1.6]">
            Mesure first-party, sans cookie : visiteurs pseudonymisés (hash
            rotatif quotidien), aucune donnée personnelle stockée. Les durées
            sont estimées à partir des horodatages de navigation. L&apos;admin
            et les bots ne sont pas comptabilisés.
          </p>
        </>
      )}
    </AdminShell>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-rule px-5 py-5">
      <div className="font-mono text-[10px] tracking-[1.8px] uppercase text-muted mb-2">
        {label}
      </div>
      <div className="font-serif text-[32px] font-bold tracking-[-0.5px] leading-none">
        {value}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-[10px] tracking-[2px] uppercase font-semibold text-ink pb-3 mb-4 border-b border-rule">
      {children}
    </h2>
  );
}

function RankTable({
  rows,
  unit,
  mono = false,
}: {
  rows: LabelCount[];
  unit: string;
  mono?: boolean;
}) {
  if (rows.length === 0) {
    return (
      <p className="font-sans text-[13px] text-muted">Aucune donnée.</p>
    );
  }
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="border border-rule">
      {rows.map((r, i) => (
        <div
          key={r.label}
          className={`relative flex items-center justify-between gap-4 px-4 py-[10px] ${
            i === rows.length - 1 ? "" : "border-b border-rule"
          }`}
        >
          <div
            className="absolute inset-y-0 left-0 bg-stripe"
            style={{ width: `${(r.count / max) * 100}%` }}
            aria-hidden="true"
          />
          <span
            className={`relative truncate ${
              mono ? "font-mono text-[12px]" : "font-sans text-[13px]"
            } text-ink`}
          >
            {r.label}
          </span>
          <span className="relative font-mono text-[12px] text-ink-2 shrink-0">
            {r.count.toLocaleString("fr-FR")} {unit}
          </span>
        </div>
      ))}
    </div>
  );
}
