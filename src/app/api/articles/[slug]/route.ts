import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { ArticleModel } from "@/models/Article";
import { getArticleBySlug } from "@/lib/articles";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }
  return NextResponse.json({ article });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectMongo();
  const { slug } = await params;
  const updates = await req.json();
  const doc = await ArticleModel.findOneAndUpdate({ slug }, updates, {
    new: true,
  });
  if (!doc) {
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }
  return NextResponse.json({
    article: { ...doc.toObject(), _id: doc._id.toString() },
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectMongo();
  const { slug } = await params;
  const res = await ArticleModel.deleteOne({ slug });
  if (res.deletedCount === 0) {
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
