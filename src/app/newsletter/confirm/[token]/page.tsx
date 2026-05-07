import { connectMongo } from "@/lib/mongodb";
import { SubscriberModel } from "@/models/Subscriber";
import { SiteShell } from "@/components/site/SiteShell";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NewsletterMessage } from "@/components/newsletter/NewsletterMessage";

export const dynamic = "force-dynamic";

export default async function ConfirmPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  await connectMongo();
  const sub = await SubscriberModel.findOne({ confirmToken: token });

  if (!sub) {
    return (
      <SiteShell>
        <NewsletterMessage
          kicker="Lien invalide"
          title="Ce lien n'est plus valable."
          body={
            <>
              Le lien de confirmation a expiré ou n'existe pas. Vous pouvez
              vous inscrire à nouveau depuis la page d'accueil.
            </>
          }
          actions={[
            { label: "Retour à l'accueil →", href: "/#newsletter", primary: true },
          ]}
        />
        <SiteFooter />
      </SiteShell>
    );
  }

  const wasAlreadyConfirmed = !!sub.confirmedAt && !sub.unsubscribedAt;
  if (!wasAlreadyConfirmed) {
    sub.confirmedAt = new Date();
    sub.unsubscribedAt = null;
    await sub.save();
  }

  const firstName = sub.email.split("@")[0];

  return (
    <SiteShell>
      <NewsletterMessage
        kicker={wasAlreadyConfirmed ? "Déjà confirmé" : "Inscription confirmée"}
        title={wasAlreadyConfirmed ? "Vous êtes bien inscrit." : `Bienvenue, ${firstName}.`}
        body={
          <>
            Votre adresse{" "}
            <span className="font-mono text-[15px] text-ink not-italic">
              {sub.email}
            </span>{" "}
            est bien enregistrée. Vous recevrez la prochaine lettre mercredi.
          </>
        }
        actions={[{ label: "Retour à la lecture →", href: "/", primary: true }]}
      />
      <SiteFooter />
    </SiteShell>
  );
}
