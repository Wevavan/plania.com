import Link from "next/link";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { listAllArticlesForAdmin } from "@/lib/articles";
import { formatDateFr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminArticlesList({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const session = await auth();
  const sp = await searchParams;
  const filter = sp.filter || "all";
  const q = (sp.q || "").trim().toLowerCase();

  let all = await listAllArticlesForAdmin();
  const now = Date.now();

  // Filtres
  if (filter === "published") {
    all = all.filter(
      (a) =>
        a.status === "published" && new Date(a.publishedAt).getTime() <= now
    );
  } else if (filter === "scheduled") {
    all = all.filter(
      (a) =>
        a.status === "published" && new Date(a.publishedAt).getTime() > now
    );
  } else if (filter === "draft") {
    all = all.filter((a) => a.status === "draft");
  }

  if (q) {
    all = all.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.kicker.toLowerCase().includes(q)
    );
  }

  const filters = [
    { key: "all", label: "Tous" },
    { key: "published", label: "Publiés" },
    { key: "scheduled", label: "Programmés" },
    { key: "draft", label: "Brouillons" },
  ];

  return (
    <AdminShell active="Articles" user={session!.user}>
      <header className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <span className="font-mono text-[11px] tracking-[2.4px] text-accent uppercase">
            Articles
          </span>
          <h1 className="font-serif text-[44px] font-bold tracking-[-0.8px] m-0 mt-3 leading-[1.05]">
            Gestion des articles
          </h1>
        </div>
        <Link
          href="/admin/articles/new"
          className="bg-ink text-paper font-sans text-[13px] font-medium px-5 py-[12px] no-underline hover:bg-accent transition-colors"
        >
          Nouvel article →
        </Link>
      </header>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {filters.map((f) => (
          <Link
            key={f.key}
            href={
              f.key === "all"
                ? "/admin/articles"
                : `/admin/articles?filter=${f.key}`
            }
            className={`px-3 py-[6px] font-mono text-[10px] tracking-[1.8px] uppercase border no-underline transition-colors ${
              filter === f.key
                ? "bg-ink text-paper border-ink"
                : "text-ink-3 border-rule hover:border-ink"
            }`}
          >
            {f.label}
          </Link>
        ))}

        <form action="/admin/articles" method="get" className="ml-auto">
          {filter !== "all" && (
            <input type="hidden" name="filter" value={filter} />
          )}
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Filtrer par titre, rubrique…"
            className="border border-rule bg-transparent px-3 py-[7px] font-serif italic text-[13px] outline-none focus:border-ink min-w-[280px]"
          />
        </form>
      </div>

      {all.length === 0 ? (
        <div className="border border-rule px-6 py-10 text-center">
          <p className="font-serif italic text-[18px] text-ink-2 m-0">
            Aucun article{q ? ` pour « ${q} »` : ""}.
          </p>
        </div>
      ) : (
        <div className="border border-rule">
          <div className="grid grid-cols-[1fr_120px_120px_140px_110px] gap-4 px-5 py-3 bg-stripe font-mono text-[10px] tracking-[1.6px] uppercase text-muted">
            <span>Titre</span>
            <span>Rubrique</span>
            <span>Statut</span>
            <span>Publication</span>
            <span>Mise à jour</span>
          </div>
          {all.map((a, i) => (
            <Link
              key={a._id}
              href={`/admin/articles/${a.slug}/edit`}
              className={`grid grid-cols-[1fr_120px_120px_140px_110px] gap-4 px-5 py-4 no-underline text-ink hover:bg-stripe transition-colors items-center ${
                i === all.length - 1 ? "" : "border-t border-rule"
              }`}
            >
              <div className="min-w-0">
                <div className="font-serif text-[15px] font-semibold truncate">
                  {a.title}
                </div>
                <div className="font-mono text-[10px] tracking-[1.6px] uppercase text-muted mt-1">
                  {a.kicker}
                  {a.featured ? " · À LA UNE" : ""}
                  {a.secondary ? " · SECONDAIRE" : ""}
                </div>
              </div>
              <span className="font-serif text-[13px] text-ink-3">
                {a.category}
              </span>
              <StatusBadge status={a.status} publishedAt={a.publishedAt} />
              <span className="font-mono text-[11px] text-muted">
                {formatDateFr(a.publishedAt)}
              </span>
              <span className="font-mono text-[11px] text-muted">
                {formatDateFr(a.updatedAt)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

function StatusBadge({
  status,
  publishedAt,
}: {
  status: string;
  publishedAt: string;
}) {
  const isFuture =
    status === "published" && new Date(publishedAt).getTime() > Date.now();
  const label = isFuture
    ? "Programmé"
    : status === "published"
      ? "Publié"
      : "Brouillon";
  const cls = isFuture
    ? "border-accent text-accent"
    : status === "published"
      ? "border-ink text-ink"
      : "border-muted-2 text-muted";
  return (
    <span
      className={`font-mono text-[10px] tracking-[1.6px] uppercase border px-2 py-[3px] ${cls} justify-self-start`}
    >
      {label}
    </span>
  );
}
