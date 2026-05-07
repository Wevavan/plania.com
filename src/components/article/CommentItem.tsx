import type { CommentDTO } from "@/lib/comments";
import { formatRelativeFr } from "@/lib/format";
import { deleteCommentAction } from "@/app/article/[slug]/comments-actions";

type Props = {
  comment: CommentDTO;
  canDelete: boolean;
  articleSlug: string;
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function CommentItem({ comment, canDelete, articleSlug }: Props) {
  const isAdmin = comment.role === "admin";
  const remove = deleteCommentAction.bind(null, articleSlug, comment._id);
  return (
    <article
      className={`px-[18px] py-4 border border-rule flex flex-col ${
        isAdmin ? "bg-stripe" : ""
      }`}
    >
      <div className="flex items-baseline gap-2 flex-wrap mb-[10px]">
        {comment.userImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={comment.userImage}
            alt=""
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <span className="w-6 h-6 rounded-full bg-ink text-paper flex items-center justify-center font-serif italic text-[10px]">
            {initials(comment.userName) || "·"}
          </span>
        )}
        <span className="font-serif text-[15px] font-semibold text-ink">
          {comment.userName}
        </span>
        {isAdmin && (
          <span className="font-mono text-[9px] tracking-[1.6px] uppercase text-accent border border-accent px-[5px] py-[1px]">
            Rédaction
          </span>
        )}
        <span className="ml-auto font-mono text-[10px] text-muted-2 tracking-[0.4px]">
          {formatRelativeFr(comment.createdAt)}
        </span>
      </div>
      <p className="text-[14px] leading-[1.55] text-ink-2 m-0 whitespace-pre-wrap">
        {comment.text}
      </p>
      {canDelete && (
        <form action={remove} className="mt-3">
          <button
            type="submit"
            className="font-sans text-[11px] text-muted hover:text-accent transition-colors cursor-pointer bg-transparent border-none p-0 underline underline-offset-[2px]"
          >
            Supprimer
          </button>
        </form>
      )}
    </article>
  );
}
