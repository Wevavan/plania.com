import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  getCategoryStats,
  listArticlesByCategory,
} from "@/lib/articles";
import {
  getCategoryBySlug,
  getSectionBySlug,
  categoryUrl,
} from "@/lib/categories";
import { SiteShell } from "@/components/site/SiteShell";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Breadcrumb } from "@/components/category/Breadcrumb";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { CategoryChips } from "@/components/category/CategoryChips";
import { CategoryHero } from "@/components/category/CategoryHero";
import { CategoryGrid } from "@/components/category/CategoryGrid";
import { Newsletter } from "@/components/site/Newsletter";
import { Categories } from "@/components/site/Categories";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sectionSlug: string; categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const cat = getCategoryBySlug(categorySlug);
  if (!cat) return { title: "Rubrique introuvable — Linfoia" };
  return {
    title: `${cat.name} — & Le Quotidien des IA`,
    description: cat.dek,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ sectionSlug: string; categorySlug: string }>;
}) {
  const { sectionSlug, categorySlug } = await params;
  const section = getSectionBySlug(sectionSlug);
  const category = getCategoryBySlug(categorySlug);
  if (!section || !category) notFound();

  // Si l'URL n'est pas la canonique pour cette catégorie, on redirige
  if (category.sectionSlug !== section.slug) {
    redirect(categoryUrl(category));
  }

  const [articles, stats] = await Promise.all([
    listArticlesByCategory(category.name),
    getCategoryStats(category.name),
  ]);

  const featured = articles[0] ?? null;
  const secondary = articles.slice(1, 3);
  const grid = articles.slice(3);

  return (
    <SiteShell activeNav={section.name}>
      <Breadcrumb
        section={section}
        current={category.name}
        subcategories={section.categories}
        activeSubSlug={category.slug}
      />
      <CategoryHeader category={category} section={section} stats={stats} />
      <CategoryChips chips={category.chips} />

      {featured ? (
        <CategoryHero featured={featured} secondary={secondary} />
      ) : (
        <EmptyCategory name={category.name} />
      )}

      {grid.length > 0 && (
        <CategoryGrid articles={grid} total={stats.total} />
      )}

      <Newsletter />
      <Categories />
      <SiteFooter />
    </SiteShell>
  );
}

function EmptyCategory({ name }: { name: string }) {
  return (
    <section className="py-16 text-center border-b border-rule">
      <span className="font-mono text-[11px] tracking-[2.4px] text-accent uppercase">
        Bientôt en kiosque
      </span>
      <h3 className="font-serif text-[32px] font-bold text-ink mt-3 mb-3 balance">
        La rubrique « {name} » prépare sa première parution.
      </h3>
      <p className="text-[15px] text-ink-3 m-0 max-w-[460px] mx-auto">
        Revenez bientôt, ou inscrivez-vous à notre newsletter pour ne rien
        manquer.
      </p>
    </section>
  );
}
