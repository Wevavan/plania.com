import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { ArticleModel } from "@/models/Article";
import { getArticleBySlug } from "@/lib/articles";
import { auth } from "@/auth";
import { validateSchema, updateArticleSchema } from "@/lib/validation";
import { ApiErrors } from "@/lib/apiErrors";
import { createApiLogger, logError } from "@/lib/logger";

const logger = createApiLogger("/api/articles/[slug]");

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
      logger.info({ slug }, "Article not found");
      return ApiErrors.articleNotFound(slug);
    }

    logger.debug({ slug }, "Article retrieved");
    return NextResponse.json({ article });
  } catch (err) {
    const { slug } = await params;
    logError(err, { route: "/api/articles/[slug]", method: "GET", slug });
    return ApiErrors.databaseError("la récupération de l'article");
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const startTime = Date.now();

  try {
    // Vérification admin
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      const { slug } = await params;
      logger.warn(
        { slug, userId: session?.user?.email },
        "Unauthorized article update attempt"
      );
      return ApiErrors.adminOnly();
    }

    await connectMongo();
    const { slug } = await params;
    const updates = await req.json();

    // Validation avec Zod (partial schema)
    const validation = validateSchema(updateArticleSchema, updates);
    if (!validation.success) {
      logger.info(
        { slug, errors: validation.errors, userId: session.user.email },
        "Article update validation failed"
      );
      return ApiErrors.validationError(validation.errors);
    }

    // Mettre à jour l'article
    const doc = await ArticleModel.findOneAndUpdate(
      { slug },
      validation.data,
      { new: true }
    );

    if (!doc) {
      logger.info({ slug }, "Article not found for update");
      return ApiErrors.articleNotFound(slug);
    }

    const duration = Date.now() - startTime;
    logger.info(
      {
        slug,
        updatedFields: Object.keys(validation.data),
        userId: session.user.email,
        duration,
      },
      "Article updated"
    );

    return NextResponse.json({
      article: { ...doc.toObject(), _id: doc._id.toString() },
    });
  } catch (err) {
    const duration = Date.now() - startTime;
    const { slug } = await params;
    logError(err, { route: "/api/articles/[slug]", method: "PATCH", slug, duration });
    return ApiErrors.internalError();
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const startTime = Date.now();

  try {
    // Vérification admin
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      const { slug } = await params;
      logger.warn(
        { slug, userId: session?.user?.email },
        "Unauthorized article deletion attempt"
      );
      return ApiErrors.adminOnly();
    }

    await connectMongo();
    const { slug } = await params;
    const res = await ArticleModel.deleteOne({ slug });

    if (res.deletedCount === 0) {
      logger.info({ slug }, "Article not found for deletion");
      return ApiErrors.articleNotFound(slug);
    }

    const duration = Date.now() - startTime;
    logger.info(
      { slug, userId: session.user.email, duration },
      "Article deleted"
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    const duration = Date.now() - startTime;
    const { slug } = await params;
    logError(err, { route: "/api/articles/[slug]", method: "DELETE", slug, duration });
    return ApiErrors.internalError();
  }
}
