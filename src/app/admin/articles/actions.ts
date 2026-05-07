"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectMongo } from "@/lib/mongodb";
import { ArticleModel } from "@/models/Article";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Forbidden");
  }
  return session;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function fieldString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function fieldBool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on" || fd.get(key) === "true";
}

export type ActionResult = { ok: true } | { ok: false; error: string };

function parseFormData(fd: FormData) {
  const title = fieldString(fd, "title");
  const slug = fieldString(fd, "slug") || slugify(title);
  const kicker = fieldString(fd, "kicker") || "ANALYSE";
  const category = fieldString(fd, "category") || "Claude AI";
  const dek = fieldString(fd, "dek");
  const titleTrail = fieldString(fd, "titleTrail");
  const body = fieldString(fd, "body");
  const author = fieldString(fd, "author") || "& Le Quotidien des IA";
  const authorBeat = fieldString(fd, "authorBeat");
  const authorBio = fieldString(fd, "authorBio");
  const imageUrl = fieldString(fd, "imageUrl");
  const imageAlt = fieldString(fd, "imageAlt");
  const imageCaption = fieldString(fd, "imageCaption");
  const imageCredit = fieldString(fd, "imageCredit");
  const thumbnailUrl = fieldString(fd, "thumbnailUrl");
  const thumbnailAlt = fieldString(fd, "thumbnailAlt");
  const readTime = fieldString(fd, "readTime");
  const tagsRaw = fieldString(fd, "tags");
  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const featured = fieldBool(fd, "featured");
  const secondary = fieldBool(fd, "secondary");
  const status = (fieldString(fd, "status") || "draft") as "draft" | "published";
  const publishedAtRaw = fieldString(fd, "publishedAt");
  const publishedAt = publishedAtRaw
    ? new Date(publishedAtRaw)
    : new Date();

  // Compute word count from body
  const wordCount = body
    .replace(/[#>*`\-]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return {
    title,
    slug,
    kicker,
    category,
    dek,
    titleTrail,
    body,
    author,
    authorBeat,
    authorBio,
    imageUrl,
    imageAlt,
    imageCaption,
    imageCredit,
    thumbnailUrl,
    thumbnailAlt,
    readTime,
    tags,
    featured,
    secondary,
    status,
    publishedAt,
    wordCount,
  };
}

export async function createArticleAction(fd: FormData): Promise<void> {
  await requireAdmin();
  await connectMongo();
  const data = parseFormData(fd);
  if (!data.title) throw new Error("Le titre est requis.");

  const exists = await ArticleModel.findOne({ slug: data.slug });
  if (exists) {
    throw new Error(`Le slug « ${data.slug} » existe déjà.`);
  }
  await ArticleModel.create(data);

  revalidatePath("/admin/articles");
  revalidatePath("/admin");
  revalidatePath("/");
  redirect(`/admin/articles/${data.slug}/edit?saved=1`);
}

export async function updateArticleAction(
  originalSlug: string,
  fd: FormData
): Promise<void> {
  await requireAdmin();
  await connectMongo();
  const data = parseFormData(fd);
  if (!data.title) throw new Error("Le titre est requis.");

  if (data.slug !== originalSlug) {
    const conflict = await ArticleModel.findOne({ slug: data.slug });
    if (conflict) throw new Error(`Le slug « ${data.slug} » est déjà utilisé.`);
  }

  await ArticleModel.findOneAndUpdate({ slug: originalSlug }, data, {
    new: true,
  });

  revalidatePath("/admin/articles");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/article/${data.slug}`);
  revalidatePath(`/article/${originalSlug}`);
  redirect(`/admin/articles/${data.slug}/edit?saved=1`);
}

export async function deleteArticleAction(slug: string): Promise<void> {
  await requireAdmin();
  await connectMongo();
  await ArticleModel.deleteOne({ slug });
  revalidatePath("/admin/articles");
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin/articles?deleted=1");
}
