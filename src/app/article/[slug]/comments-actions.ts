"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { connectMongo } from "@/lib/mongodb";
import { CommentModel } from "@/models/Comment";

export async function createCommentAction(
  slug: string,
  fd: FormData
): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Connexion requise pour commenter.");
  }

  const text = String(fd.get("text") || "").trim();
  if (!text) throw new Error("Le commentaire est vide.");
  if (text.length > 2000) throw new Error("Le commentaire dépasse 2000 caractères.");

  await connectMongo();
  await CommentModel.create({
    articleSlug: slug,
    userId: session.user.id,
    userName:
      session.user.name ||
      session.user.email?.split("@")[0] ||
      "Lecteur anonyme",
    userEmail: session.user.email || "",
    userImage: session.user.image || "",
    text,
    role: session.user.role,
  });

  revalidatePath(`/article/${slug}`);
}

export async function deleteCommentAction(
  slug: string,
  commentId: string
): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Connexion requise.");
  }

  await connectMongo();
  const comment = await CommentModel.findById(commentId);
  if (!comment) return;

  const isOwner = comment.userId === session.user.id;
  const isAdmin = session.user.role === "admin";
  if (!isOwner && !isAdmin) {
    throw new Error("Action interdite.");
  }

  await CommentModel.deleteOne({ _id: commentId });
  revalidatePath(`/article/${slug}`);
}
