import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { createArticleAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const session = await auth();
  return (
    <AdminShell active="Articles" user={session!.user}>
      <header className="mb-8">
        <span className="font-mono text-[11px] tracking-[2.4px] text-accent uppercase">
          Articles · Nouveau
        </span>
        <h1 className="font-serif text-[44px] font-bold tracking-[-0.8px] m-0 mt-3 leading-[1.05]">
          Écrire un nouvel article
        </h1>
      </header>
      <ArticleForm action={createArticleAction} mode="create" />
    </AdminShell>
  );
}
