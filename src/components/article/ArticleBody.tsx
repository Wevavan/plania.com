import Link from "next/link";
import "highlight.js/styles/atom-one-dark.css";

type Props = {
  /** HTML déjà traité (sanitisé + ancres + lettrine) via processArticleHtml. */
  html: string;
  locked?: boolean;
  signInHref?: string;
};

export function ArticleBody({ html, locked = false, signInHref = "/signin" }: Props) {
  return (
    <div className="article-prose w-full">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {locked ? (
        <Paywall signInHref={signInHref} />
      ) : (
        <div className="flex items-center gap-[10px] justify-center font-sans text-[12px] text-muted tracking-[0.4px] py-8">
          <span className="inline-block w-[10px] h-[10px] bg-ink" />- Fin du
          papier -
        </div>
      )}
    </div>
  );
}

function Paywall({ signInHref }: { signInHref: string }) {
  return (
    <div className="relative mt-2">
      <div
        aria-hidden="true"
        className="absolute -top-32 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(244,239,230,0) 0%, rgba(244,239,230,0.85) 60%, var(--color-paper) 100%)",
        }}
      />
      <section className="relative border-t border-ink pt-10 pb-12 text-center">
        <span className="font-mono text-[11px] tracking-[2.4px] text-accent font-medium uppercase">
          Réservé aux lecteurs connectés
        </span>
        <h3 className="font-serif text-[34px] font-bold leading-[1.1] tracking-[-0.6px] m-0 mt-4 mb-3 balance">
          La suite est gratuite. Connectez-vous pour la lire.
        </h3>
        <p className="text-[16px] leading-[1.55] text-ink-2 m-0 mb-7 max-w-[480px] mx-auto pretty">
          Aucun mot de passe à retenir : Google ou un lien envoyé par email.
          Vous pouvez vous désinscrire en un clic.
        </p>
        <Link
          href={signInHref}
          className="inline-block bg-ink text-paper border border-ink font-sans text-[14px] font-medium px-7 py-[14px] tracking-[0.3px] no-underline hover:bg-accent hover:border-accent transition-colors"
        >
          Se connecter pour lire la suite →
        </Link>
        <div className="mt-5 font-sans text-[12px] text-muted">
          Déjà membre ?{" "}
          <Link href={signInHref} className="text-accent no-underline">
            Connexion
          </Link>
        </div>
      </section>
    </div>
  );
}
