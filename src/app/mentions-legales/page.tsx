import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Éditeur, hébergeur et conditions d'utilisation du site Planète IA.",
};

export default function MentionsLegalesPage() {
  return (
    <SiteShell>
      <article className="py-12 max-w-[780px] mx-auto">
        <span className="font-mono text-[11px] tracking-[2.4px] text-accent font-medium uppercase">
          Mentions légales
        </span>
        <h1 className="font-serif text-[56px] font-bold leading-[1.05] tracking-[-1px] m-0 mt-4 mb-8 balance">
          Mentions légales.
        </h1>

        <div className="prose-article">
          <h2>Éditeur du site</h2>
          <p>
            Le présent site <strong>Planète IA</strong> (planèteia.com) est
            édité à titre non commercial par <strong>Wev</strong>, en tant que
            personne physique.
          </p>
          <p>
            Contact :{" "}
            <a href="mailto:wev.ia.org@gmail.com">wev.ia.org@gmail.com</a>
          </p>
          <p>
            Responsable de la publication : <strong>Wev</strong>.
          </p>

          <h2>Hébergeur</h2>
          <p>
            Le site est hébergé par <strong>Vercel Inc.</strong>
            <br />
            440 N Barranca Ave #4133
            <br />
            Covina, CA 91723, États-Unis
            <br />
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              vercel.com
            </a>
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L'ensemble des contenus publiés (articles, illustrations, mise en
            page) est protégé par le droit d'auteur. Toute reproduction,
            même partielle, à des fins commerciales nécessite une autorisation
            écrite préalable. Les citations courtes avec lien vers la source
            sont libres.
          </p>

          <h2>Liens externes</h2>
          <p>
            Le site peut contenir des liens vers des ressources externes
            (papers, dépôts de code, articles tiers). L'éditeur n'exerce aucun
            contrôle sur ces ressources et ne peut être tenu responsable de
            leur contenu.
          </p>

          <h2>Données personnelles</h2>
          <p>
            Les conditions de collecte et de traitement des données
            personnelles sont décrites dans notre{" "}
            <a href="/confidentialite">politique de confidentialité</a>. Les
            cookies utilisés sont détaillés dans la{" "}
            <a href="/cookies">politique cookies</a>.
          </p>

          <h2>Signaler un contenu</h2>
          <p>
            Pour toute demande de correction, droit de réponse ou signalement
            d'un contenu illicite, écrivez à{" "}
            <a href="mailto:wev.ia.org@gmail.com">wev.ia.org@gmail.com</a>.
            Les demandes recevables sont traitées sous quinze jours.
          </p>

          <p className="font-serif italic text-[14px] text-muted mt-12">
            Dernière mise à jour : mai 2026.
          </p>
        </div>
      </article>
      <SiteFooter />
    </SiteShell>
  );
}
