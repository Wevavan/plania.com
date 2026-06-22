import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { ArticleModel } from "@/models/Article";
import { listArticles } from "@/lib/articles";
import { auth } from "@/auth";
import { validateSchema, createArticleSchema } from "@/lib/validation";
import { ApiErrors } from "@/lib/apiErrors";
import { createApiLogger, logError } from "@/lib/logger";

const logger = createApiLogger("/api/articles");

export async function GET(req: NextRequest) {
  try {
    const startTime = Date.now();
    const articles = await listArticles();
    const duration = Date.now() - startTime;

    logger.info({ count: articles.length, duration }, "Articles listed");

    return NextResponse.json({ articles });
  } catch (err) {
    logError(err, { route: "/api/articles", method: "GET" });
    return ApiErrors.databaseError("la récupération des articles");
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // Vérification admin
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      logger.warn(
        { userId: session?.user?.email },
        "Unauthorized article creation attempt"
      );
      return ApiErrors.adminOnly();
    }

    await connectMongo();
    const body = await req.json();

    // Validation avec Zod
    const validation = validateSchema(createArticleSchema, body);
    if (!validation.success) {
      logger.info(
        { errors: validation.errors, userId: session.user.email },
        "Article validation failed"
      );
      return ApiErrors.validationError(validation.errors);
    }

    const data = validation.data;

    // Vérifier si le slug existe déjà
    const exists = await ArticleModel.findOne({ slug: data.slug });
    if (exists) {
      logger.info({ slug: data.slug }, "Slug already exists");
      return ApiErrors.slugExists(data.slug);
    }

    // Créer l'article
    const doc = await ArticleModel.create({
      slug: data.slug,
      kicker: data.kicker,
      category: data.category,
      section: data.section,
      title: data.title,
      titleTrail: data.titleTrail,
      dek: data.dek,
      body: data.body,
      author: data.author,
      authorBeat: data.authorBeat,
      authorBio: data.authorBio,
      imageUrl: data.imageUrl,
      imageAlt: data.imageAlt,
      imageCaption: data.imageCaption,
      imageCredit: data.imageCredit,
      thumbnailUrl: data.thumbnailUrl,
      thumbnailAlt: data.thumbnailAlt,
      readTime: data.readTime,
      wordCount: data.wordCount,
      tags: data.tags,
      featured: data.featured,
      secondary: data.secondary,
      status: data.status,
      publishedAt: data.publishedAt,
    });

    const duration = Date.now() - startTime;
    logger.info(
      {
        slug: data.slug,
        category: data.category,
        userId: session.user.email,
        duration,
      },
      "Article created"
    );

    return NextResponse.json(
      { article: { ...doc.toObject(), _id: doc._id.toString() } },
      { status: 201 }
    );
  } catch (err) {
    const duration = Date.now() - startTime;
    logError(err, { route: "/api/articles", method: "POST", duration });
    return ApiErrors.internalError();
  }
}
