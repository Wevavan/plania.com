import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  listArticlesByCategory,
  listArticlesBySection,
} from "@/lib/articles";
import { getSectionBySlug } from "@/lib/categories";
import { SiteShell } from "@/components/site/SiteShell";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Newsletter } from "@/components/site/Newsletter";
import { Categories } from "@/components/site/Categories";
import { Hero } from "@/components/site/Hero";
import { Breadcrumb } from "@/components/category/Breadcrumb";
import { SubcategoryBlock } from "@/components/section/SubcategoryBlock";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sectionSlug: string }>;
}): Promise<Metadata> {
  const { sectionSlug } = await params;
  const section = getSectionBySlug(sectionSlug);
  if (!section) return { title: "Section introuvable" };
  return {
    title: `${section.name} - Planète IA`,
    description: section.dek,
  };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ sectionSlug: string }>;
}) {
  const { sectionSlug } = await params;
  const section = getSectionBySlug(sectionSlug);
  if (!section) notFound();

  const sectionArticles = await listArticlesBySection(section.slug);

  const featured = sectionArticles[0] ?? null;
  const secondary = sectionArticles.slice(1, 4);

  // Pour chaque sous-cat, récupérer les 3 derniers articles
  const blocks = await Promise.all(
    section.categories.map(async (c) => ({
      category: c,
      articles: await listArticlesByCategory(c.name),
    }))
  );

  return (
    <SiteShell activeNav={section.name} masthead={null}>
      <Breadcrumb
        current={section.name}
        subcategories={section.categories}
      />

      {featured && <Hero article={featured} secondary={secondary} />}

      {blocks.map(({ category, articles }) => (
        <SubcategoryBlock
          key={category.slug}
          category={category}
          articles={articles}
        />
      ))}

      <Newsletter />
      <Categories />
      <SiteFooter />
    </SiteShell>
  );
}
