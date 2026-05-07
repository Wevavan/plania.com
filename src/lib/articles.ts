import { connectMongo } from "./mongodb";
import { ArticleModel, type Article } from "@/models/Article";

export type ArticleStatus = "draft" | "published";

export type ArticleDTO = {
  _id: string;
  slug: string;
  kicker: string;
  category: string;
  section: string;
  title: string;
  titleTrail: string;
  dek: string;
  body: string;
  author: string;
  authorBeat: string;
  authorBio: string;
  authorArticleCount: number;
  imageUrl: string;
  imageAlt: string;
  imageCaption: string;
  imageCredit: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  readTime: string;
  wordCount: number;
  tags: string[];
  featured: boolean;
  secondary: boolean;
  status: ArticleStatus;
  publishedAt: string;
  updatedAt: string;
};

function toDTO(a: Article): ArticleDTO {
  return {
    _id: a._id.toString(),
    slug: a.slug,
    kicker: a.kicker,
    category: a.category,
    section: a.section ?? "",
    title: a.title,
    titleTrail: a.titleTrail ?? "",
    dek: a.dek ?? "",
    body: a.body ?? "",
    author: a.author,
    authorBeat: a.authorBeat ?? "",
    authorBio: a.authorBio ?? "",
    authorArticleCount: a.authorArticleCount ?? 0,
    imageUrl: a.imageUrl ?? "",
    imageAlt: a.imageAlt ?? "",
    imageCaption: a.imageCaption ?? "",
    imageCredit: a.imageCredit ?? "",
    thumbnailUrl: a.thumbnailUrl ?? "",
    thumbnailAlt: a.thumbnailAlt ?? "",
    readTime: a.readTime ?? "",
    wordCount: a.wordCount ?? 0,
    tags: Array.isArray(a.tags) ? a.tags : [],
    featured: !!a.featured,
    secondary: !!a.secondary,
    status: (a.status as ArticleStatus) ?? "published",
    publishedAt: (a.publishedAt ?? new Date()).toISOString(),
    updatedAt: (a.updatedAt ?? a.publishedAt ?? new Date()).toISOString(),
  };
}

// Public filter — articles visible aux lecteurs : status=published ET publishedAt <= maintenant
function publicFilter() {
  return { status: "published", publishedAt: { $lte: new Date() } };
}

export async function getFeaturedArticle(): Promise<ArticleDTO | null> {
  await connectMongo();
  const doc = await ArticleModel.findOne({ ...publicFilter(), featured: true })
    .sort({ publishedAt: -1 })
    .lean<Article | null>();
  return doc ? toDTO(doc) : null;
}

export async function getSecondaryArticles(limit = 3): Promise<ArticleDTO[]> {
  await connectMongo();
  const docs = await ArticleModel.find({
    ...publicFilter(),
    secondary: true,
    featured: { $ne: true },
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean<Article[]>();
  return docs.map(toDTO);
}

export async function getLatestArticles(limit = 4): Promise<ArticleDTO[]> {
  await connectMongo();
  const docs = await ArticleModel.find({
    ...publicFilter(),
    featured: { $ne: true },
    secondary: { $ne: true },
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean<Article[]>();
  return docs.map(toDTO);
}

export async function getArticleBySlug(slug: string): Promise<ArticleDTO | null> {
  await connectMongo();
  const doc = await ArticleModel.findOne({ slug }).lean<Article | null>();
  return doc ? toDTO(doc) : null;
}

export async function searchArticles(query: string): Promise<ArticleDTO[]> {
  await connectMongo();
  const q = query.trim();
  if (!q) return [];
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(safe, "i");
  const docs = await ArticleModel.find({
    ...publicFilter(),
    $or: [
      { title: re },
      { titleTrail: re },
      { dek: re },
      { body: re },
      { author: re },
      { category: re },
      { kicker: re },
      { tags: re },
    ],
  })
    .sort({ publishedAt: -1 })
    .limit(50)
    .lean<Article[]>();
  return docs.map(toDTO);
}

export async function listArticles(): Promise<ArticleDTO[]> {
  await connectMongo();
  const docs = await ArticleModel.find(publicFilter())
    .sort({ publishedAt: -1 })
    .lean<Article[]>();
  return docs.map(toDTO);
}

export async function listArticlesByCategory(
  categoryName: string
): Promise<ArticleDTO[]> {
  await connectMongo();
  const docs = await ArticleModel.find({
    ...publicFilter(),
    category: categoryName,
  })
    .sort({ publishedAt: -1 })
    .lean<Article[]>();
  return docs.map(toDTO);
}

export async function listArticlesBySection(
  sectionSlug: string
): Promise<ArticleDTO[]> {
  await connectMongo();
  const docs = await ArticleModel.find({
    ...publicFilter(),
    section: sectionSlug,
  })
    .sort({ publishedAt: -1 })
    .lean<Article[]>();
  return docs.map(toDTO);
}

export async function getSectionStats(sectionSlug: string): Promise<{
  total: number;
  lastUpdateHours: number | null;
}> {
  await connectMongo();
  const baseFilter = { ...publicFilter(), section: sectionSlug };
  const total = await ArticleModel.countDocuments(baseFilter);
  const last = await ArticleModel.findOne(baseFilter)
    .sort({ publishedAt: -1 })
    .lean<Article | null>();
  const lastUpdateHours = last?.publishedAt
    ? Math.max(
        1,
        Math.round(
          (Date.now() - new Date(last.publishedAt).getTime()) / 3_600_000
        )
      )
    : null;
  return { total, lastUpdateHours };
}

export async function getSectionCounts(): Promise<Record<string, number>> {
  await connectMongo();
  const agg = await ArticleModel.aggregate<{ _id: string; count: number }>([
    { $match: publicFilter() },
    { $group: { _id: "$section", count: { $sum: 1 } } },
  ]);
  return Object.fromEntries(agg.map((a) => [a._id, a.count]));
}

export type CategoryStats = {
  total: number;
  ongoingInvestigations: number;
  lastUpdateHours: number | null;
};

export async function getCategoryStats(
  categoryName: string
): Promise<CategoryStats> {
  await connectMongo();
  const baseFilter = { ...publicFilter(), category: categoryName };
  const total = await ArticleModel.countDocuments(baseFilter);
  const ongoingInvestigations = await ArticleModel.countDocuments({
    ...baseFilter,
    kicker: { $in: ["ENQUÊTE", "INVESTIGATION"] },
  });
  const last = await ArticleModel.findOne(baseFilter)
    .sort({ publishedAt: -1 })
    .lean<Article | null>();
  const lastUpdateHours = last?.publishedAt
    ? Math.max(
        1,
        Math.round(
          (Date.now() - new Date(last.publishedAt).getTime()) / 3_600_000
        )
      )
    : null;
  return { total, ongoingInvestigations, lastUpdateHours };
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  await connectMongo();
  const agg = await ArticleModel.aggregate<{ _id: string; count: number }>([
    { $match: publicFilter() },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);
  return Object.fromEntries(agg.map((a) => [a._id, a.count]));
}

// ====== Admin queries (toutes statuts confondus) ======

export type AdminArticleSummary = {
  _id: string;
  slug: string;
  title: string;
  category: string;
  kicker: string;
  status: ArticleStatus;
  publishedAt: string;
  updatedAt: string;
  featured: boolean;
  secondary: boolean;
};

export async function listAllArticlesForAdmin(): Promise<AdminArticleSummary[]> {
  await connectMongo();
  const docs = await ArticleModel.find({})
    .sort({ updatedAt: -1, publishedAt: -1 })
    .select(
      "slug title category kicker status publishedAt updatedAt featured secondary"
    )
    .lean<Article[]>();
  return docs.map((d) => ({
    _id: d._id.toString(),
    slug: d.slug,
    title: d.title,
    category: d.category,
    kicker: d.kicker,
    status: (d.status as ArticleStatus) ?? "published",
    publishedAt: (d.publishedAt ?? new Date()).toISOString(),
    updatedAt: (d.updatedAt ?? d.publishedAt ?? new Date()).toISOString(),
    featured: !!d.featured,
    secondary: !!d.secondary,
  }));
}

export type AdminStats = {
  total: number;
  published: number;
  scheduled: number;
  drafts: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  await connectMongo();
  const now = new Date();
  const [total, published, scheduled, drafts] = await Promise.all([
    ArticleModel.countDocuments({}),
    ArticleModel.countDocuments({
      status: "published",
      publishedAt: { $lte: now },
    }),
    ArticleModel.countDocuments({
      status: "published",
      publishedAt: { $gt: now },
    }),
    ArticleModel.countDocuments({ status: "draft" }),
  ]);
  return { total, published, scheduled, drafts };
}
