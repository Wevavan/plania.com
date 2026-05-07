import { SiteShell } from "@/components/site/SiteShell";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NewsletterMessage } from "@/components/newsletter/NewsletterMessage";

export default function AlreadySubscribedPage() {
  return (
    <SiteShell>
      <NewsletterMessage
        kicker="Déjà abonné"
        title="Vous l'êtes déjà."
        body={
          <>
            Cette adresse est déjà inscrite à la lettre. La prochaine vous sera
            envoyée mercredi.
          </>
        }
        actions={[{ label: "Retour à l'accueil →", href: "/", primary: true }]}
      />
      <SiteFooter />
    </SiteShell>
  );
}
