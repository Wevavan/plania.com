import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const ArticleSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    kicker: { type: String, required: true },
    category: { type: String, required: true, index: true },
    section: { type: String, default: "", index: true },
    title: { type: String, required: true },
    titleTrail: { type: String, default: "" },
    dek: { type: String, default: "" },
    body: { type: String, default: "" },
    author: { type: String, required: true },
    authorBeat: { type: String, default: "" },
    authorBio: { type: String, default: "" },
    authorArticleCount: { type: Number, default: 0 },
    imageUrl: { type: String, default: "" },
    imageAlt: { type: String, default: "" },
    imageCaption: { type: String, default: "" },
    imageCredit: { type: String, default: "" },
    thumbnailUrl: { type: String, default: "" },
    thumbnailAlt: { type: String, default: "" },
    readTime: { type: String, default: "" },
    wordCount: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false, index: true },
    secondary: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },
    publishedAt: { type: Date, default: () => new Date(), index: true },
  },
  { timestamps: true }
);

export type Article = InferSchemaType<typeof ArticleSchema> & {
  _id: mongoose.Types.ObjectId;
  updatedAt?: Date;
};

export const ArticleModel: Model<Article> =
  (mongoose.models.Article as Model<Article>) ||
  mongoose.model<Article>("Article", ArticleSchema);
