import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  getArticleBySlug,
  listArticlesByCategory,
} from "@/lib/articles";
import { getCategoryBySlug, categorySlug, ALL_CATEGORIES } from "@/lib/categories";
import { parseBody } from "@/lib/article-body";
import { formatDateFr } from "@/lib/format";
import { auth } from "@/auth";
import { getBaseUrl } from "@/lib/resend";
import { ArticleShell } from "@/components/article/ArticleShell";
import { ArticleBreadcrumb } from "@/components/article/ArticleBreadcrumb";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { ArticleHero } from "@/components/article/ArticleHero";
import { LeftRail } from "@/components/article/LeftRail";
import { RightRail } from "@/components/article/RightRail";
import { ArticleBody } from "@/components/article/ArticleBody";
import { TagsRow } from "@/components/article/TagsRow";
import { Comments } from "@/components/article/Comments";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { SiteFooter } from "@/components/site/SiteFooter";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article introuvable" };
  const full = article.titleTrail
    ? `${article.title} ${article.titleTrail}`
    : article.title;
  const desc = article.dek || `Article publié sur Planète IA - ${article.category}.`;
  const ogImage = article.imageUrl
    ? article.imageUrl.includes("res.cloudinary.com")
      ? article.imageUrl.replace(
          "/upload/",
          "/upload/c_fill,g_auto,w_1200,h_630,q_auto,f_auto/"
        )
      : article.imageUrl
    : undefined;
  const url = `${getBaseUrl()}/article/${article.slug}`;

  return {
    title: full,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: full,
      description: desc,
      url,
      siteName: "Planète IA",
      locale: "fr_FR",
      publishedTime: article.publishedAt
        ? new Date(article.publishedAt).toISOString()
        : undefined,
      authors: article.author ? [article.author] : undefined,
      section: article.category,
      tags: article.tags || undefined,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: article.imageAlt || full,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description: desc,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect(`/signin?callbackUrl=${encodeURIComponent(`/article/${slug}`)}`);
  }

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const { toc } = parseBody(article.body);

  const sameCategory = await listArticlesByCategory(article.category);
  const others = sameCategory.filter((a) => a.slug !== article.slug);
  const mostRead = others.slice(0, 4);
  const related = others.slice(0, 3);

  const categoryMeta =
    ALL_CATEGORIES.find((c) => c.name === article.category) ??
    getCategoryBySlug(categorySlug(article.category)) ??
    ALL_CATEGORIES[0];

  return (
    <ArticleShell activeCategory={article.category}>
      <ArticleBreadcrumb
        category={article.category}
        kicker={article.kicker}
        dateLabel={formatDateFr(article.publishedAt)}
      />

      <ArticleHero
        imageUrl={article.imageUrl}
        alt={article.imageAlt || article.title}
        caption={article.imageCaption}
        credit={article.imageCredit}
      />

      <article className="pt-4 pb-8">
        <ArticleHeader article={article} />

        <div className="grid grid-cols-1 lg:grid-cols-[180px_minmax(0,1fr)_240px] gap-6 lg:gap-8 items-start">
          <LeftRail
            toc={toc}
            shareTitle={
              article.titleTrail
                ? `${article.title} ${article.titleTrail}`
                : article.title
            }
            shareUrl={`${getBaseUrl()}/article/${article.slug}`}
          />
          <div className="w-full">
            <ArticleBody body={article.body} />
            <TagsRow tags={article.tags} />
          </div>
          <RightRail mostRead={mostRead} category={categoryMeta} />
        </div>
      </article>

      <Comments slug={article.slug} />
      <RelatedArticles articles={related} categoryName={article.category} />
      <SiteFooter />
    </ArticleShell>
  );
}
