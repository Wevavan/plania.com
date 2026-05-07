import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const CommentSchema = new Schema(
  {
    articleSlug: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, default: "" },
    userEmail: { type: String, default: "" },
    userImage: { type: String, default: "" },
    text: { type: String, required: true, maxlength: 2000 },
    role: {
      type: String,
      enum: ["admin", "reader"],
      default: "reader",
      index: true,
    },
  },
  { timestamps: true }
);

export type Comment = InferSchemaType<typeof CommentSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const CommentModel: Model<Comment> =
  (mongoose.models.Comment as Model<Comment>) ||
  mongoose.model<Comment>("Comment", CommentSchema);
