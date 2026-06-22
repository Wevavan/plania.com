import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

/**
 * Page vue (analytics first-party, cookieless).
 * `visitorId` est un hash pseudonyme qui tourne chaque jour → pas de suivi
 * d'un individu sur plusieurs jours, pas de données personnelles stockées.
 */
const PageViewSchema = new Schema(
  {
    visitorId: { type: String, required: true, index: true },
    path: { type: String, required: true },
    source: { type: String, default: "Direct" },
    device: { type: String, default: "desktop" },
    browser: { type: String, default: "Autre" },
    os: { type: String, default: "Autre" },
    ts: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

PageViewSchema.index({ ts: 1, visitorId: 1 });

export type PageView = InferSchemaType<typeof PageViewSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const PageViewModel: Model<PageView> =
  (mongoose.models.PageView as Model<PageView>) ||
  mongoose.model<PageView>("PageView", PageViewSchema);
