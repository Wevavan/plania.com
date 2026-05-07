import crypto from "crypto";
import { connectMongo } from "./mongodb";
import { SubscriberModel, type Subscriber } from "@/models/Subscriber";
import { resend, fromHeader, getBaseUrl } from "./resend";
import { parseBody, renderInline } from "./article-body";

export type SubscriberDTO = {
  _id: string;
  email: string;
  confirmedAt: string | null;
  unsubscribedAt: string | null;
  createdAt: string;
};

function toDTO(s: Subscriber): SubscriberDTO {
  return {
    _id: s._id.toString(),
    email: s.email,
    confirmedAt: s.confirmedAt ? s.confirmedAt.toISOString() : null,
    unsubscribedAt: s.unsubscribedAt ? s.unsubscribedAt.toISOString() : null,
    createdAt: s.createdAt.toISOString(),
  };
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function listAllSubscribers(): Promise<SubscriberDTO[]> {
  await connectMongo();
  const docs = await SubscriberModel.find({})
    .sort({ createdAt: -1 })
    .lean<Subscriber[]>();
  return docs.map(toDTO);
}

export async function listConfirmedSubscribers(): Promise<SubscriberDTO[]> {
  await connectMongo();
  const docs = await SubscriberModel.find({
    confirmedAt: { $ne: null },
    unsubscribedAt: null,
  })
    .sort({ confirmedAt: -1 })
    .lean<Subscriber[]>();
  return docs.map(toDTO);
}

export type SubscriberStats = {
  total: number;
  confirmed: number;
  pending: number;
  unsubscribed: number;
};

export async function getSubscriberStats(): Promise<SubscriberStats> {
  await connectMongo();
  const [total, confirmed, unsubscribed] = await Promise.all([
    SubscriberModel.countDocuments({}),
    SubscriberModel.countDocuments({
      confirmedAt: { $ne: null },
      unsubscribedAt: null,
    }),
    SubscriberModel.countDocuments({ unsubscribedAt: { $ne: null } }),
  ]);
  return {
    total,
    confirmed,
    pending: Math.max(0, total - confirmed - unsubscribed),
    unsubscribed,
  };
}

// ====== Email rendering ======

const COLOR_PAPER = "#f4efe6";
const COLOR_INK = "#16130e";
const COLOR_INK2 = "#3b3529";
const COLOR_MUTED = "#6b6456";
const COLOR_RULE = "#dcd5c7";
const COLOR_ACCENT = "#8b3a1f";

function emailShell(content: string, unsubscribeUrl?: string): string {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Planète IA</title>
</head>
<body style="margin:0;padding:0;background:${COLOR_PAPER};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLOR_PAPER};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:${COLOR_PAPER};">
          <tr>
            <td style="padding:0 0 24px;border-bottom:1px solid ${COLOR_RULE};">
              <div style="font-family:Georgia,'Source Serif 4',serif;font-size:22px;font-weight:700;letter-spacing:-0.4px;color:${COLOR_INK};">
                Planète IA
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 0;font-family:Georgia,'Source Serif 4',serif;color:${COLOR_INK2};font-size:16px;line-height:1.6;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 0 0;border-top:1px solid ${COLOR_RULE};font-family:'Courier New',monospace;font-size:11px;color:${COLOR_MUTED};letter-spacing:0.4px;">
              PLANÈTE IA · DEPUIS 2026
              ${unsubscribeUrl ? `<br/><a href="${unsubscribeUrl}" style="color:${COLOR_MUTED};text-decoration:underline;">Se désabonner</a>` : ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendConfirmationEmail(
  email: string,
  confirmToken: string
): Promise<void> {
  if (!resend) {
    console.warn("[newsletter] Resend non configuré, email non envoyé");
    return;
  }
  const url = `${getBaseUrl()}/newsletter/confirm/${confirmToken}`;
  const content = `
    <p style="margin:0 0 16px;">Bonjour,</p>
    <p style="margin:0 0 24px;">
      Vous venez de demander à recevoir notre lettre. Pour confirmer votre
      inscription, cliquez sur le bouton ci-dessous.
    </p>
    <p style="margin:0 0 24px;">
      <a href="${url}" style="display:inline-block;background:${COLOR_INK};color:${COLOR_PAPER};padding:14px 28px;text-decoration:none;font-family:-apple-system,Helvetica,sans-serif;font-size:14px;font-weight:500;letter-spacing:0.3px;">
        Confirmer mon inscription →
      </a>
    </p>
    <p style="margin:0 0 8px;font-size:13px;color:${COLOR_MUTED};">
      Si le bouton ne fonctionne pas, copiez-collez ce lien&nbsp;:<br/>
      <span style="font-family:'Courier New',monospace;font-size:12px;word-break:break-all;">${url}</span>
    </p>
    <p style="margin:32px 0 0;font-size:13px;color:${COLOR_MUTED};">
      Si vous n'avez pas demandé cette inscription, ignorez ce message — vous
      ne recevrez aucun autre email de notre part.
    </p>
  `;
  await resend.emails.send({
    from: fromHeader(),
    to: email,
    subject: "Confirmez votre inscription à la lettre",
    html: emailShell(content),
  });
}

export function renderNewsletterHtml(
  subject: string,
  markdown: string,
  unsubscribeUrl: string
): string {
  const { blocks } = parseBody(markdown);
  const parts = blocks.map((b) => {
    switch (b.kind) {
      case "heading":
        return `<h2 style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:${COLOR_INK};margin:32px 0 12px;letter-spacing:-0.3px;">${escapeHtml(b.title)}</h2>`;
      case "subheading":
        return `<h3 style="font-family:Georgia,serif;font-size:17px;font-weight:600;color:${COLOR_INK};margin:24px 0 8px;letter-spacing:-0.2px;">${escapeHtml(b.title)}</h3>`;
      case "pullquote": {
        const attr = b.attribution
          ? `<footer style="font-family:-apple-system,sans-serif;font-size:12px;color:${COLOR_MUTED};margin-top:8px;">— ${escapeHtml(b.attribution)}</footer>`
          : "";
        return `<blockquote style="margin:24px 0;padding:8px 0 8px 20px;border-left:2px solid ${COLOR_INK};"><p style="font-family:Georgia,serif;font-style:italic;font-size:18px;line-height:1.4;color:${COLOR_INK};margin:0;">${escapeHtml(b.text)}</p>${attr}</blockquote>`;
      }
      case "html":
        return b.html;
      case "paragraph":
        return `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.65;color:${COLOR_INK2};margin:0 0 16px;">${renderInline(b.text)}</p>`;
      default: {
        const _exhaustive: never = b;
        return _exhaustive;
      }
    }
  });

  const content = `
    <p style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;color:${COLOR_ACCENT};margin:0 0 12px;text-transform:uppercase;">
      Lettre du ${new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
    </p>
    <h1 style="font-family:Georgia,serif;font-size:32px;font-weight:700;color:${COLOR_INK};letter-spacing:-0.6px;margin:0 0 24px;line-height:1.1;">
      ${escapeHtml(subject)}
    </h1>
    ${parts.join("\n")}
  `;
  return emailShell(content, unsubscribeUrl);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
