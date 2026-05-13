import Link from "next/link";
import { parseBody, renderInline, type Block } from "@/lib/article-body";

type Props = {
  body: string;
  locked?: boolean;
  signInHref?: string;
};

export function ArticleBody({ body, locked = false, signInHref = "/signin" }: Props) {
  const { blocks } = parseBody(body);
  return (
    <div className="article-prose w-full">
      {blocks.map((b, i) => renderBlock(b, i))}
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

function renderBlock(b: Block, i: number) {
  if (b.kind === "heading") {
    return (
      <h2
        key={i}
        id={b.id}
        className="font-serif text-[30px] font-bold leading-[1.15] tracking-[-0.6px] balance m-0 mt-11 mb-[18px]"
      >
        {b.title}
      </h2>
    );
  }
  if (b.kind === "subheading") {
    return (
      <h3
        key={i}
        id={b.id}
        className="font-serif text-[22px] font-semibold leading-[1.2] tracking-[-0.3px] balance m-0 mt-7 mb-3 text-ink-2"
      >
        {b.title}
      </h3>
    );
  }
  if (b.kind === "pullquote") {
    return (
      <blockquote
        key={i}
        className="my-9 py-6 pl-14 pr-8 border-l-2 border-ink relative"
      >
        <span className="absolute left-[18px] top-[10px] font-serif italic text-[56px] text-accent leading-none">
          «
        </span>
        <p className="font-serif italic text-[24px] leading-[1.35] text-ink m-0 mb-[10px] font-normal balance">
          {b.text}
        </p>
        {b.attribution && (
          <footer className="font-sans text-[12px] text-muted tracking-[0.3px]">
            - {b.attribution}
          </footer>
        )}
      </blockquote>
    );
  }
  if (b.kind === "html") {
    return <div key={i} dangerouslySetInnerHTML={{ __html: b.html }} />;
  }
  const html = renderInline(b.text);
  if (b.lead) {
    return (
      <p
        key={i}
        className="text-[19px] leading-[1.65] text-ink font-serif m-0 mb-[22px] article-lead"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return (
    <p
      key={i}
      className="text-[17px] leading-[1.7] text-ink-2 font-serif m-0 mb-5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
