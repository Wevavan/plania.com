import {
  getFeaturedArticle,
  getLatestArticles,
  getSecondaryArticles,
} from "@/lib/articles";
import { SiteShell } from "@/components/site/SiteShell";
import { Hero } from "@/components/site/Hero";
import { SectionDivider } from "@/components/site/SectionDivider";
import { LatestGrid } from "@/components/site/LatestGrid";
import { Newsletter } from "@/components/site/Newsletter";
import { Categories } from "@/components/site/Categories";
import { SiteFooter } from "@/components/site/SiteFooter";

export const dynamic = "force-dynamic";

function EmptyState() {
  return (
    <section className="py-20 text-center border-b border-rule">
      <span className="font-mono text-[11px] tracking-[2.4px] text-accent uppercase">
        En préparation
      </span>
      <h2 className="font-serif text-[36px] font-bold text-ink mt-3 mb-3 balance">
        La rédaction met les bouchées doubles.
      </h2>
      <p className="text-[16px] text-ink-3 m-0 max-w-[520px] mx-auto">
        Notre première édition arrive très bientôt. Inscrivez-vous à la
        newsletter pour la recevoir.
      </p>
    </section>
  );
}

export default async function HomePage() {
  const [featured, secondary, latest] = await Promise.all([
    getFeaturedArticle(),
    getSecondaryArticles(2),
    getLatestArticles(4),
  ]);

  return (
    <SiteShell activeNav="Accueil" masthead={null}>
      {featured ? (
        <Hero article={featured} secondary={secondary} />
      ) : (
        <EmptyState />
      )}

      {latest.length > 0 && (
        <>
          <SectionDivider
            label="Dernières publications"
            seeMoreHref="/archives"
          />
          <LatestGrid articles={latest} />
        </>
      )}

      <Newsletter />
      <Categories />
      <SiteFooter />
    </SiteShell>
  );
}
