import { auth } from "@/auth";
import { listCommentsForArticle } from "@/lib/comments";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

export async function Comments({ slug }: { slug: string }) {
  const [comments, session] = await Promise.all([
    listCommentsForArticle(slug),
    auth(),
  ]);
  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === "admin";

  return (
    <section className="py-9">
      <div className="flex items-center gap-4 pb-5 mb-6">
        <span className="font-sans text-[11px] tracking-[2.4px] uppercase font-semibold text-ink">
          Les notes des abonnés
        </span>
        <span className="flex-1 h-px bg-rule" />
        <span className="font-mono text-[11px] text-muted tracking-[0.4px]">
          {comments.length} réaction{comments.length > 1 ? "s" : ""}
        </span>
      </div>

      {comments.length === 0 ? (
        <div className="border border-rule px-6 py-10 text-center mb-6">
          <p className="font-serif italic text-[16px] text-ink-3 m-0">
            Aucune réaction pour l'instant. Lancez la conversation.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {comments.map((c) => (
            <CommentItem
              key={c._id}
              comment={c}
              canDelete={c.userId === userId || isAdmin}
              articleSlug={slug}
            />
          ))}
        </div>
      )}

      <CommentForm articleSlug={slug} />
    </section>
  );
}
