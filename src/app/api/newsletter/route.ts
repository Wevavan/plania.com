import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { SubscriberModel } from "@/models/Subscriber";
import { generateToken, sendConfirmationEmail } from "@/lib/newsletter";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  let email: string | null = null;
  let horsSeries = true;

  try {
    if (contentType.includes("application/json")) {
      const body = await req.json();
      email = typeof body.email === "string" ? body.email : null;
      horsSeries = body.horsSeries !== false;
    } else {
      const fd = await req.formData();
      const v = fd.get("email");
      email = typeof v === "string" ? v : null;
      horsSeries = fd.get("hors-series") !== null;
    }
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: "Email manquant." }, { status: 400 });
  }
  email = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.redirect(
      new URL("/newsletter/error", req.url),
      { status: 303 }
    );
  }

  await connectMongo();

  const existing = await SubscriberModel.findOne({ email });

  if (existing) {
    if (existing.confirmedAt && !existing.unsubscribedAt) {
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
      return NextResponse.redirect(
        new URL("/newsletter/check-email", req.url),
        { status: 303 }
      );
    }
    // Réactivation directe d'un abonné qui s'était désinscrit
    return NextResponse.redirect(
      new URL("/newsletter/already-subscribed", req.url),
      { status: 303 }
    );
  }

  const confirmToken = generateToken();
  const unsubscribeToken = generateToken();
  await SubscriberModel.create({
    email,
    confirmToken,
    unsubscribeToken,
    horsSeries,
  });

  await sendConfirmationEmail(email, confirmToken);

  return NextResponse.redirect(
    new URL("/newsletter/check-email", req.url),
    { status: 303 }
  );
}
