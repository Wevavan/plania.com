import type { NextRequest } from "next/server";
import { handlers } from "@/auth";
import { rateLimit, rateLimitConfigs } from "@/lib/rateLimit";
import { ApiErrors } from "@/lib/apiErrors";

export const GET = handlers.GET;

// Limite les POST d'authentification (envoi de magic link, credentials…)
// pour éviter l'abus d'envoi d'emails / le brute force, par IP.
export async function POST(req: NextRequest) {
  const rl = await rateLimit(req, rateLimitConfigs.signin, "signin");
  if (!rl.success) {
    return ApiErrors.rateLimitExceeded(
      rateLimitConfigs.signin.uniqueTokenPerInterval,
      rl.remaining,
      rl.reset
    );
  }
  return handlers.POST(req);
}
