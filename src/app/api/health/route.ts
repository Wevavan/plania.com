import { NextResponse } from "next/server";
import { isKvConfigured, kvPing } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

/**
 * Endpoint de diagnostic léger.
 * Ne révèle aucun secret : uniquement des booléens d'état.
 *
 * GET /api/health
 */
export async function GET() {
  const kvConfigured = isKvConfigured();
  const kvReachable = kvConfigured ? await kvPing() : false;

  // Si le KV est configuré mais injoignable, l'app fonctionne encore
  // (repli mémoire), mais on signale l'état dégradé.
  const ok = !kvConfigured || kvReachable;

  const backend = !kvConfigured
    ? "memory (best-effort, par instance)"
    : kvReachable
      ? "kv (limites globales)"
      : "kv configuré mais injoignable → repli mémoire";

  return NextResponse.json(
    {
      status: ok ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      rateLimit: {
        backend,
        kvConfigured,
        kvReachable,
      },
    },
    { status: ok ? 200 : 503 }
  );
}
