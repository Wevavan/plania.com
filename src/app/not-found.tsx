import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "La page demandée n'existe pas (ou plus).",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <SiteShell>
      <article className="py-20 max-w-[720px] mx-auto text-center">
        <span className="font-mono text-[11px] tracking-[2.4px] text-accent font-medium uppercase">
          Erreur 404
        </span>
        <h1 className="font-serif text-[88px] font-bold leading-[0.95] tracking-[-2px] m-0 mt-6 mb-2 balance">
          Page introuvable.
        </h1>
        <p className="font-serif italic text-[20px] text-ink-3 m-0 mb-8 max-w-[520px] mx-auto">
          La page que vous cherchez n'existe pas - ou n'existe plus.
        </p>

        <div className="flex items-center gap-4 justify-center mt-2 mb-10">
          <span className="flex-1 max-w-[80px] h-px bg-rule" />
          <span className="font-mono text-[10px] tracking-[2px] uppercase text-muted">
            Quelques pistes
          </span>
          <span className="flex-1 max-w-[80px] h-px bg-rule" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[480px] mx-auto text-left">
          <SuggestionCard
            href="/"
            label="Une"
            text="Revenir à l'accueil et aux derniers articles."
          />
          <SuggestionCard
            href="/recherche"
            label="Recherche"
            text="Trouver un article par mot-clé."
          />
          <SuggestionCard
            href="/intelligence-artificielle"
            label="Section"
            text="Parcourir la section Intelligence Artificielle."
          />
          <SuggestionCard
            href="/contact"
            label="Contact"
            text="Nous signaler un lien cassé."
          />
        </div>
      </article>
      <SiteFooter />
    </SiteShell>
  );
}

function SuggestionCard({
  href,
  label,
  text,
}: {
  href: string;
  label: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="block border border-rule p-4 hover:border-ink transition-colors no-underline group"
    >
      <span className="font-mono text-[10px] tracking-[2px] uppercase text-accent block mb-1">
        {label} →
      </span>
      <span className="font-serif text-[15px] text-ink leading-[1.4]">
        {text}
      </span>
    </Link>
  );
}
