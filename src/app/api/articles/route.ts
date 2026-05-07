import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { ArticleModel } from "@/models/Article";
import { listArticles } from "@/lib/articles";

export async function GET() {
  const articles = await listArticles();
  return NextResponse.json({ articles });
}

export async function POST(req: Request) {
  try {
    await connectMongo();
    const body = await req.json();

    if (!body?.title || !body?.author || !body?.kicker || !body?.category) {
      return NextResponse.json(
        { error: "Champs requis manquants : title, author, kicker, category" },
        { status: 400 }
      );
    }

    const slug = body.slug || slugify(body.title);
    const exists = await ArticleModel.findOne({ slug });
    if (exists) {
      return NextResponse.json(
        { error: `Slug déjà utilisé : ${slug}` },
        { status: 409 }
      );
    }

    const doc = await ArticleModel.create({
      slug,
      kicker: body.kicker,
      category: body.category,
      title: body.title,
      dek: body.dek ?? "",
      body: body.body ?? "",
      author: body.author,
      imageUrl: body.imageUrl ?? "",
      imageCaption: body.imageCaption ?? "",
      readTime: body.readTime ?? "",
      featured: !!body.featured,
      secondary: !!body.secondary,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
    });

    return NextResponse.json({ article: { ...doc.toObject(), _id: doc._id.toString() } }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
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
