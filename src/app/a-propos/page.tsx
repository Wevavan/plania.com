import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "À propos — & Le Quotidien des IA",
  description:
    "Un regard éditorial sur l'intelligence artificielle. Sans hype, sans catastrophisme.",
};

export default function AboutPage() {
  return (
    <SiteShell activeNav="À propos">
      <article className="py-12 max-w-[780px] mx-auto">
        <span className="font-mono text-[11px] tracking-[2.4px] text-accent font-medium uppercase">
          À propos
        </span>
        <h1 className="font-serif text-[56px] font-bold leading-[1.05] tracking-[-1px] m-0 mt-4 mb-8 balance">
          Pourquoi <span className="italic font-normal text-accent">&</span> Le
          Quotidien des IA.
        </h1>

        <div className="prose-article">
          <p className="text-[20px] leading-[1.6] text-ink m-0 mb-7 article-lead">
            <span className="font-serif font-bold text-[64px] leading-[0.85] float-left mr-3 mt-2">
              U
            </span>
            n quotidien éditorial consacré à l'intelligence artificielle, lu
            chaque semaine par chercheurs, décideurs et curieux. On y trouve des
            enquêtes, des décryptages, des portraits, et la lettre du mercredi.
          </p>

          <h2>Notre ligne</h2>
          <p>
            Couvrir l'IA telle qu'elle est : ni miracle, ni cataclysme. On lit
            les papers avant d'en parler. On reformule jamais sans avoir compris.
            On préfère la précision à la rapidité, et la nuance au cliquable.
          </p>

          <h2>Comment on travaille</h2>
          <p>
            Une rédaction restreinte, des sources publiques (papers, dépôts,
            documents officiels), des entretiens, et beaucoup de relecture
            croisée. Quand un sujet n'est pas mûr, on ne publie pas.
          </p>

          <h2>Indépendance</h2>
          <p>
            Aucun investisseur dans l'IA, aucune publicité, aucun sponsor. Les
            seuls revenus sont l'abonnement à la lettre — gratuit pour
            l'instant.
          </p>

          <h2>Contact</h2>
          <p>
            Pour la rédaction, les corrections, les propositions de sujet :{" "}
            <a href="/contact">passez par la page contact</a>.
          </p>

          <p className="font-serif italic text-[16px] text-muted mt-12">
            — La rédaction.
          </p>
        </div>
      </article>
      <SiteFooter />
    </SiteShell>
  );
}
