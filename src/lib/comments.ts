import { connectMongo } from "./mongodb";
import { CommentModel, type Comment } from "@/models/Comment";

export type CommentDTO = {
  _id: string;
  articleSlug: string;
  userId: string;
  userName: string;
  userImage: string;
  text: string;
  role: "admin" | "reader";
  createdAt: string;
};

function toDTO(c: Comment): CommentDTO {
  return {
    _id: c._id.toString(),
    articleSlug: c.articleSlug,
    userId: c.userId,
    userName: c.userName,
    userImage: c.userImage ?? "",
    text: c.text,
    role: (c.role as "admin" | "reader") ?? "reader",
    createdAt: (c.createdAt ?? new Date()).toISOString(),
  };
}

export async function listCommentsForArticle(
  slug: string
): Promise<CommentDTO[]> {
  await connectMongo();
  const docs = await CommentModel.find({ articleSlug: slug })
    .sort({ createdAt: -1 })
    .lean<Comment[]>();
  return docs.map(toDTO);
}
