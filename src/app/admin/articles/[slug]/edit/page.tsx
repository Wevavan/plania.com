import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { getArticleBySlug } from "@/lib/articles";
import { updateArticleAction, deleteArticleAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const session = await auth();
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const update = updateArticleAction.bind(null, slug);
  const remove = deleteArticleAction.bind(null, slug);

  return (
    <AdminShell active="Articles" user={session!.user}>
      <header className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span className="font-mono text-[11px] tracking-[2.4px] text-accent uppercase">
            Articles · Éditer
          </span>
          <h1 className="font-serif text-[36px] font-bold tracking-[-0.6px] m-0 mt-3 leading-[1.1] balance">
            {article.title}
          </h1>
        </div>
        {article.status === "published" && (
          <Link
            href={`/article/${article.slug}`}
            target="_blank"
            className="font-sans text-[13px] text-accent border border-accent px-4 py-[10px] no-underline hover:bg-accent hover:text-paper transition-colors"
          >
            Voir en ligne ↗
          </Link>
        )}
      </header>
      <ArticleForm
        action={update}
        deleteAction={remove}
        mode="edit"
        saved={sp.saved === "1"}
        initial={{
          slug: article.slug,
          title: article.title,
          titleTrail: article.titleTrail,
          kicker: article.kicker,
          category: article.category,
          dek: article.dek,
          body: article.body,
          author: article.author,
          authorBeat: article.authorBeat,
          authorBio: article.authorBio,
          imageUrl: article.imageUrl,
          imageAlt: article.imageAlt,
          imageCaption: article.imageCaption,
          imageCredit: article.imageCredit,
          thumbnailUrl: article.thumbnailUrl,
          thumbnailAlt: article.thumbnailAlt,
          readTime: article.readTime,
          tags: article.tags,
          featured: article.featured,
          secondary: article.secondary,
          status: article.status,
          publishedAt: article.publishedAt,
        }}
      />
    </AdminShell>
  );
}
