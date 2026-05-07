import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const SubscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    confirmToken: { type: String, required: true, unique: true, index: true },
    confirmedAt: { type: Date, default: null, index: true },
    unsubscribeToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    unsubscribedAt: { type: Date, default: null, index: true },
    horsSeries: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type Subscriber = InferSchemaType<typeof SubscriberSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const SubscriberModel: Model<Subscriber> =
  (mongoose.models.Subscriber as Model<Subscriber>) ||
  mongoose.model<Subscriber>("Subscriber", SubscriberSchema);
