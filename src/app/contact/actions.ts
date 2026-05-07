"use server";

import { resend, fromHeader } from "@/lib/resend";

const CONTACT_TO = "wev.ia.org@gmail.com";

export type ContactState =
  | { status: "idle" }
  | { status: "ok" }
  | { status: "error"; message: string };

const SUBJECTS = [
  "Suggestion de sujet",
  "Correction / erratum",
  "Tribune / contribution",
  "Presse / partenariat",
  "Autre",
];

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot anti-bot : champ caché qui doit rester vide
  const honeypot = String(formData.get("website") || "").trim();
  if (honeypot) {
    // On feinte le succès pour ne pas guider le bot
    return { status: "ok" };
  }

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || name.length > 120) {
    return { status: "error", message: "Nom invalide." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return { status: "error", message: "Email invalide." };
  }
  if (!message || message.length < 10 || message.length > 10000) {
    return {
      status: "error",
      message: "Le message doit faire entre 10 et 10000 caractères.",
    };
  }
  const subj = SUBJECTS.includes(subject) ? subject : "Autre";

  if (!resend) {
    return {
      status: "error",
      message:
        "Service d'envoi indisponible (Resend non configuré). Réessayez plus tard.",
    };
  }

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#f7f7f5;color:#16130e;">
      <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#418159;margin-bottom:8px;">Planète IA — formulaire contact</div>
      <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px;">${escapeHtml(subj)}</h1>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:16px;">
        <tr><td style="padding:6px 0;color:#5A5A5A;width:80px;">Nom</td><td style="padding:6px 0;"><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#5A5A5A;">Email</td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
      </table>
      <div style="border-top:1px solid #ccc;padding-top:16px;white-space:pre-wrap;font-size:15px;line-height:1.55;">${escapeHtml(message)}</div>
    </div>
  `.trim();

  const text = `Sujet : ${subj}\nNom : ${name}\nEmail : ${email}\n\n${message}`;

  try {
    const { error } = await resend.emails.send({
      from: fromHeader(),
      to: CONTACT_TO,
      replyTo: email,
      subject: `[Contact Planète IA] ${subj} — ${name}`,
      html,
      text,
    });
    if (error) {
      console.error("[contact] resend error:", error);
      return {
        status: "error",
        message: "Envoi impossible pour l'instant. Réessayez plus tard.",
      };
    }
    return { status: "ok" };
  } catch (err) {
    console.error("[contact] exception:", err);
    return {
      status: "error",
      message: "Erreur réseau. Réessayez plus tard.",
    };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
