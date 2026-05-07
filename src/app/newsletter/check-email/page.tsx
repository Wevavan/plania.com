import { SiteShell } from "@/components/site/SiteShell";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NewsletterMessage } from "@/components/newsletter/NewsletterMessage";

export default function CheckEmailPage() {
  return (
    <SiteShell>
      <NewsletterMessage
        kicker="Vérifiez votre messagerie"
        title="Un lien vous attend."
        body={
          <>
            Nous venons de vous envoyer un email avec un lien de confirmation.
            Cliquez dessus pour activer votre abonnement à la lettre. Le lien
            est valable 7 jours.
            <p className="font-sans text-[12px] text-muted mt-6 m-0">
              Pas reçu ? Vérifiez vos spams, ou retournez sur l'accueil pour
              réessayer.
            </p>
          </>
        }
        actions={[{ label: "Retour à l'accueil →", href: "/", primary: true }]}
      />
      <SiteFooter />
    </SiteShell>
  );
}
