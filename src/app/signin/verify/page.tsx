import { SiteShell } from "@/components/site/SiteShell";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function VerifyPage() {
  return (
    <SiteShell>
      <div className="py-16 max-w-[480px] mx-auto">
        <span className="font-mono text-[11px] tracking-[2.4px] text-accent font-medium uppercase">
          Vérifiez votre messagerie
        </span>
        <h1 className="font-serif text-[44px] font-bold leading-[1.05] tracking-[-0.8px] m-0 mt-4 mb-4 balance">
          Un lien vous attend.
        </h1>
        <p className="text-[17px] leading-[1.55] text-ink-2 m-0 mb-6 pretty">
          Nous venons de vous envoyer un email contenant un lien de connexion.
          Il est valable une heure et ne fonctionne qu'une fois.
        </p>
        <p className="font-sans text-[12px] text-muted leading-[1.6]">
          Pas reçu ? Vérifiez vos spams, ou{" "}
          <a href="/signin" className="text-accent no-underline">
            réessayez
          </a>
          .
        </p>
      </div>
      <SiteFooter />
    </SiteShell>
  );
}
