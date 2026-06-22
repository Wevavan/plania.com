import { NextRequest, NextResponse } from "next/server";
import { recordPageView } from "@/lib/analytics";

export const dynamic = "force-dynamic";

/**
 * Ingestion d'une page vue (analytics first-party, cookieless).
 * Répond toujours 204 (léger, ne renseigne rien). Le filtrage bot / admin
 * et la pseudonymisation sont faits dans recordPageView.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      path?: unknown;
      referrer?: unknown;
    };
    const path = typeof body.path === "string" ? body.path : "";
    const referrer = typeof body.referrer === "string" ? body.referrer : "";

    if (path.startsWith("/")) {
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown";
      const ua = req.headers.get("user-agent") || "";
      await recordPageView({ path, referrer, ip, ua });
    }
  } catch {
    // On avale toute erreur : l'analytics ne doit jamais impacter le visiteur.
  }
  return new NextResponse(null, { status: 204 });
}
