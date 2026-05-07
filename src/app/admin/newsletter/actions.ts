"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectMongo } from "@/lib/mongodb";
import { SubscriberModel } from "@/models/Subscriber";
import { NewsletterSendModel } from "@/models/NewsletterSend";
import { renderNewsletterHtml } from "@/lib/newsletter";
import { resend, fromHeader, getBaseUrl } from "@/lib/resend";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Forbidden");
  }
  return session;
}

export async function sendNewsletterAction(fd: FormData): Promise<void> {
  const session = await requireAdmin();
  const subject = String(fd.get("subject") || "").trim();
  const body = String(fd.get("body") || "").trim();
  if (!subject || !body) {
    throw new Error("Sujet et contenu sont requis.");
  }

  await connectMongo();

  // Crée un enregistrement "sending"
  const sendDoc = await NewsletterSendModel.create({
    subject,
    body,
    status: "sending",
    sentBy: session.user.email || "",
    sentAt: new Date(),
  });

  const subscribers = await SubscriberModel.find({
    confirmedAt: { $ne: null },
    unsubscribedAt: null,
  }).lean();

  let success = 0;
  let failure = 0;

  if (resend && subscribers.length > 0) {
    // Envoi 1 par 1 pour pouvoir personnaliser le lien de désinscription
    for (const sub of subscribers) {
      const unsubUrl = `${getBaseUrl()}/unsubscribe/${sub.unsubscribeToken}`;
      try {
        await resend.emails.send({
          from: fromHeader(),
          to: sub.email,
          subject,
          html: renderNewsletterHtml(subject, body, unsubUrl),
        });
        success += 1;
      } catch (err) {
        console.error("[newsletter] Erreur envoi à", sub.email, err);
        failure += 1;
      }
    }
  }

  sendDoc.status = failure === 0 ? "sent" : success === 0 ? "failed" : "sent";
  sendDoc.sentToCount = subscribers.length;
  sendDoc.successCount = success;
  sendDoc.failureCount = failure;
  sendDoc.htmlBody = renderNewsletterHtml(subject, body, "#");
  await sendDoc.save();

  revalidatePath("/admin/newsletter/sends");
  revalidatePath("/admin");
  redirect(`/admin/newsletter/sends?just=${sendDoc._id.toString()}`);
}

export async function deleteSendAction(id: string): Promise<void> {
  await requireAdmin();
  await connectMongo();
  await NewsletterSendModel.deleteOne({ _id: id });
  revalidatePath("/admin/newsletter/sends");
}
