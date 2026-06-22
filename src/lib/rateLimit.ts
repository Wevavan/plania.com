import { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Store mémoire (repli si Vercel KV n'est pas configuré).
const store = new Map<string, RateLimitEntry>();

// Nettoie les anciennes entrées toutes les heures (repli mémoire uniquement).
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (now > value.resetTime) {
      store.delete(key);
    }
  }
}, 60 * 60 * 1000); // 1 heure

export interface RateLimitConfig {
  interval: number; // en millisecondes
  uniqueTokenPerInterval: number; // nombre max de requêtes
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

// --- Backend Vercel KV (API REST compatible Upstash) -----------------------

// Accepte les deux conventions : Vercel KV (KV_REST_API_*) ou
// l'intégration Upstash Redis du Marketplace Vercel (UPSTASH_REDIS_REST_*).
const KV_URL =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const kvEnabled = Boolean(KV_URL && KV_TOKEN);

/**
 * Exécute une commande Redis via l'API REST path-style de Vercel KV / Upstash.
 * Renvoie le champ `result` de la réponse.
 */
async function kvCommand(parts: (string | number)[]): Promise<unknown> {
  const path = parts.map((p) => encodeURIComponent(String(p))).join("/");
  const res = await fetch(`${KV_URL}/${path}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`KV REST error ${res.status}`);
  }
  const data = (await res.json()) as { result?: unknown };
  return data.result;
}

/** Indique si un backend KV (Vercel KV / Upstash) est configuré. */
export function isKvConfigured(): boolean {
  return kvEnabled;
}

/** Vérifie en direct que le KV répond (PING). Renvoie false si non configuré ou injoignable. */
export async function kvPing(): Promise<boolean> {
  if (!kvEnabled) return false;
  try {
    const res = await kvCommand(["ping"]);
    return res === "PONG" || res === "pong";
  } catch {
    return false;
  }
}

/**
 * Fenêtre fixe distribuée via KV : INCR + PEXPIRE au premier hit.
 */
async function kvFixedWindow(
  key: string,
  limit: number,
  intervalMs: number
): Promise<RateLimitResult> {
  const count = Number(await kvCommand(["incr", key]));

  if (count === 1) {
    await kvCommand(["pexpire", key, intervalMs]);
  }

  let reset = Date.now() + intervalMs;
  if (count > 1) {
    const pttl = Number(await kvCommand(["pttl", key]));
    if (Number.isFinite(pttl) && pttl > 0) {
      reset = Date.now() + pttl;
    }
  }

  return {
    success: count <= limit,
    remaining: Math.max(0, limit - count),
    reset,
  };
}

// --- Repli mémoire ---------------------------------------------------------

function memoryFixedWindow(
  key: string,
  limit: number,
  intervalMs: number
): RateLimitResult {
  const now = Date.now();
  let entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    entry = { count: 0, resetTime: now + intervalMs };
  }

  entry.count++;
  store.set(key, entry);

  return {
    success: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    reset: entry.resetTime,
  };
}

// --- API publique ----------------------------------------------------------

/**
 * Rate limiter par IP, basé sur Vercel KV si configuré (limites globales,
 * fiables sur serverless), sinon repli sur un store mémoire (best-effort).
 *
 * @param request - La requête Next.js
 * @param config  - Fenêtre + nombre max de requêtes
 * @param scope   - Identifiant d'endpoint (évite de partager le compteur entre routes)
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = {
    interval: 60 * 1000, // 1 minute par défaut
    uniqueTokenPerInterval: 5, // 5 requêtes par défaut
  },
  scope = "default"
): Promise<RateLimitResult> {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const key = `rl:${scope}:${ip}`;

  if (kvEnabled) {
    try {
      return await kvFixedWindow(
        key,
        config.uniqueTokenPerInterval,
        config.interval
      );
    } catch {
      // En cas d'incident KV, on bascule sur le repli mémoire plutôt que
      // de bloquer ou de laisser tout passer.
      return memoryFixedWindow(
        key,
        config.uniqueTokenPerInterval,
        config.interval
      );
    }
  }

  return memoryFixedWindow(
    key,
    config.uniqueTokenPerInterval,
    config.interval
  );
}

/**
 * Configuration pour différents endpoints
 */
export const rateLimitConfigs = {
  // Newsletter: 3 inscriptions par heure
  newsletter: {
    interval: 60 * 60 * 1000, // 1 heure
    uniqueTokenPerInterval: 3,
  },
  // Upload: 10 uploads par heure
  upload: {
    interval: 60 * 60 * 1000, // 1 heure
    uniqueTokenPerInterval: 10,
  },
  // API articles: 30 requêtes par minute
  articles: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 30,
  },
  // Connexion: 10 tentatives par 10 minutes (anti-abus magic link / brute force)
  signin: {
    interval: 10 * 60 * 1000, // 10 minutes
    uniqueTokenPerInterval: 10,
  },
} as const;
