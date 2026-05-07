import { revalidatePath } from "next/cache";
import { connectMongo } from "@/lib/mongodb";
import { SubscriberModel } from "@/models/Subscriber";
import { SiteShell } from "@/components/site/SiteShell";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NewsletterMessage } from "@/components/newsletter/NewsletterMessage";

export const dynamic = "force-dynamic";

async function confirmUnsubscribe(token: string) {
  "use server";
  await connectMongo();
  await SubscriberModel.findOneAndUpdate(
    { unsubscribeToken: token },
    { unsubscribedAt: new Date() }
  );
  revalidatePath(`/unsubscribe/${token}`);
}

export default async function UnsubscribePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  await connectMongo();
  const sub = await SubscriberModel.findOne({ unsubscribeToken: token });

  if (!sub) {
    return (
      <SiteShell>
        <NewsletterMessage
          kicker="Lien invalide"
          title="Ce lien n'est plus valable."
          body="Vous êtes peut-être déjà désinscrit, ou le lien est expiré."
          actions={[{ label: "Retour à l'accueil →", href: "/", primary: true }]}
        />
        <SiteFooter />
      </SiteShell>
    );
  }

  if (sub.unsubscribedAt) {
    return (
      <SiteShell>
        <NewsletterMessage
          kicker="Désinscription confirmée"
          title="Vous ne recevrez plus rien de nous."
          body={
            <>
              Votre adresse{" "}
              <span className="font-mono text-[15px] text-ink not-italic">
                {sub.email}
              </span>{" "}
              a été retirée de notre liste. Si c'était une erreur, vous pouvez
              vous réinscrire depuis la page d'accueil.
            </>
          }
          actions={[
            { label: "Retour à l'accueil →", href: "/", primary: true },
          ]}
        />
        <SiteFooter />
      </SiteShell>
    );
  }

  const action = confirmUnsubscribe.bind(null, token);

  return (
    <SiteShell>
      <div className="py-16 max-w-[560px] mx-auto text-center">
        <span className="font-mono text-[11px] tracking-[2.4px] text-accent uppercase">
          Désinscription
        </span>
        <h1 className="font-serif text-[44px] font-bold leading-[1.05] tracking-[-0.8px] m-0 mt-4 mb-6 balance">
          Vous êtes sûr ?
        </h1>
        <p className="text-[17px] leading-[1.55] text-ink-2 m-0 mb-8 pretty">
          Vous êtes sur le point de désinscrire{" "}
          <span className="font-mono text-[15px] text-ink not-italic">
            {sub.email}
          </span>{" "}
          de notre lettre. Vous ne recevrez plus aucun email.
        </p>
        <form action={action} className="flex justify-center gap-3 flex-wrap">
          <button
            type="submit"
            className="bg-ink text-paper font-sans text-[14px] font-medium px-7 py-[14px] hover:bg-accent transition-colors cursor-pointer border-none"
          >
            Confirmer la désinscription →
          </button>
          <a
            href="/"
            className="border border-ink text-ink font-sans text-[14px] font-medium px-7 py-[14px] no-underline hover:bg-ink hover:text-paper transition-colors"
          >
            Annuler
          </a>
        </form>
      </div>
      <SiteFooter />
    </SiteShell>
  );
}
