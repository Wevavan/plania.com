import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { SubscriberModel } from "@/models/Subscriber";
import { generateToken, sendConfirmationEmail } from "@/lib/newsletter";
import { rateLimit, rateLimitConfigs } from "@/lib/rateLimit";
import { validateSchema, newsletterSubscriptionSchema } from "@/lib/validation";
import { ApiErrors } from "@/lib/apiErrors";
import { createApiLogger, logError } from "@/lib/logger";

const logger = createApiLogger("/api/newsletter");

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  try {
    // Rate limiting: 3 inscriptions par heure par IP
    const rateLimitResult = await rateLimit(req, rateLimitConfigs.newsletter, "newsletter");

    if (!rateLimitResult.success) {
      logger.warn({ ip, remaining: rateLimitResult.remaining }, "Rate limit exceeded");
      return ApiErrors.rateLimitExceeded(
        rateLimitConfigs.newsletter.uniqueTokenPerInterval,
        rateLimitResult.remaining,
        rateLimitResult.reset
      );
    }

    // Parse request body
    const contentType = req.headers.get("content-type") || "";
    let data: { email: string; horsSeries: boolean };
    let honeypot = "";

    try {
      if (contentType.includes("application/json")) {
        const body = await req.json();
        data = {
          email: body.email,
          horsSeries: body.horsSeries !== false,
        };
        honeypot = String(body.website || "");
      } else {
        const fd = await req.formData();
        data = {
          email: String(fd.get("email") || ""),
          horsSeries: fd.get("hors-series") !== null,
        };
        honeypot = String(fd.get("website") || "");
      }
    } catch (err) {
      logError(err, { ip, route: "/api/newsletter", step: "parse_request" });
      return ApiErrors.invalidRequest("Requête invalide");
    }

    // Honeypot : si ce champ caché est rempli, c'est un bot. On fait comme si
    // tout s'était bien passé (pour ne pas le renseigner) sans rien enregistrer.
    if (honeypot.trim() !== "") {
      logger.warn({ ip }, "Honeypot déclenché — inscription bot ignorée");
      if (!contentType.includes("application/json")) {
        return NextResponse.redirect(
          new URL("/newsletter/check-email", req.url),
          { status: 303 }
        );
      }
      return NextResponse.json({ ok: true });
    }

    // Validation avec Zod
    const validation = validateSchema(newsletterSubscriptionSchema, data);

    if (!validation.success) {
      logger.info({ ip, errors: validation.errors }, "Validation failed");

      // Pour les formulaires HTML, redirect vers page d'erreur
      if (!contentType.includes("application/json")) {
        return NextResponse.redirect(new URL("/newsletter/error", req.url), {
          status: 303,
        });
      }

      return ApiErrors.validationError(validation.errors);
    }

    const { email, horsSeries } = validation.data;

    // Connexion à la base de données
    await connectMongo();

    // Vérifier si l'email existe déjà
    const existing = await SubscriberModel.findOne({ email });

    if (existing) {
      if (existing.confirmedAt && !existing.unsubscribedAt) {
        logger.info({ email: email.substring(0, 3) + "***" }, "Already subscribed");
        return NextResponse.redirect(
          new URL("/newsletter/already-subscribed", req.url),
          { status: 303 }
        );
      }

      // Réactivation ou re-confirmation
      existing.unsubscribedAt = null;
      if (!existing.confirmedAt) {
        existing.confirmToken = generateToken();
      }
      existing.horsSeries = horsSeries;
      await existing.save();

      if (!existing.confirmedAt) {
        await sendConfirmationEmail(email, existing.confirmToken);
        logger.info({ email: email.substring(0, 3) + "***" }, "Re-confirmation email sent");
        return NextResponse.redirect(
          new URL("/newsletter/check-email", req.url),
          { status: 303 }
        );
      }

      logger.info({ email: email.substring(0, 3) + "***" }, "Reactivated subscription");
      return NextResponse.redirect(
        new URL("/newsletter/already-subscribed", req.url),
        { status: 303 }
      );
    }

    // Créer nouvel abonné
    const confirmToken = generateToken();
    const unsubscribeToken = generateToken();

    await SubscriberModel.create({
      email,
      confirmToken,
      unsubscribeToken,
      horsSeries,
    });

    await sendConfirmationEmail(email, confirmToken);

    const duration = Date.now() - startTime;
    logger.info(
      {
        email: email.substring(0, 3) + "***",
        horsSeries,
        duration,
        ip
      },
      "Newsletter subscription created"
    );

    return NextResponse.redirect(
      new URL("/newsletter/check-email", req.url),
      { status: 303 }
    );
  } catch (err) {
    const duration = Date.now() - startTime;
    logError(err, { ip, route: "/api/newsletter", duration });

    // En cas d'erreur lors de l'envoi d'email, on considère que c'est une erreur serveur
    if (err instanceof Error && err.message.includes("email")) {
      return ApiErrors.emailSendError();
    }

    return ApiErrors.internalError();
  }
}
