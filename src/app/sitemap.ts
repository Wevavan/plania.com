import type { MetadataRoute } from "next";
import { listArticles } from "@/lib/articles";
import { ALL_SECTIONS, ALL_CATEGORIES } from "@/lib/categories";
import { getBaseUrl } from "@/lib/resend";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/a-propos`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/newsletter`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/recherche`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const sectionEntries: MetadataRoute.Sitemap = ALL_SECTIONS.map((s) => ({
    url: `${base}/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = ALL_CATEGORIES.map((c) => ({
    url: `${base}/${c.sectionSlug}/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  let articleEntries: MetadataRoute.Sitemap = [];
  try {
    const articles = await listArticles();
    articleEntries = articles.map((a) => ({
      url: `${base}/article/${a.slug}`,
      lastModified: a.publishedAt ? new Date(a.publishedAt) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    // Si Mongo indisponible au build : on retourne le reste plutôt que de planter.
  }

  return [...staticEntries, ...sectionEntries, ...categoryEntries, ...articleEntries];
}
