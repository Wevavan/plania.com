import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const NewsletterSendSchema = new Schema(
  {
    subject: { type: String, required: true },
    body: { type: String, default: "" },
    htmlBody: { type: String, default: "" },
    sentAt: { type: Date, default: () => new Date(), index: true },
    sentToCount: { type: Number, default: 0 },
    successCount: { type: Number, default: 0 },
    failureCount: { type: Number, default: 0 },
    sentBy: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "sending", "sent", "failed"],
      default: "draft",
      index: true,
    },
    error: { type: String, default: "" },
  },
  { timestamps: true }
);

export type NewsletterSend = InferSchemaType<typeof NewsletterSendSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const NewsletterSendModel: Model<NewsletterSend> =
  (mongoose.models.NewsletterSend as Model<NewsletterSend>) ||
  mongoose.model<NewsletterSend>("NewsletterSend", NewsletterSendSchema);
