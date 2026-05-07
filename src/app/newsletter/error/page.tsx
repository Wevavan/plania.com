import { SiteShell } from "@/components/site/SiteShell";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NewsletterMessage } from "@/components/newsletter/NewsletterMessage";

export default function NewsletterErrorPage() {
  return (
    <SiteShell>
      <NewsletterMessage
        kicker="Adresse invalide"
        title="L'adresse n'a pas l'air bonne."
        body={
          <>
            Vérifiez le format de votre email et réessayez depuis l'accueil ou
            la newsletter en bas de chaque page.
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
