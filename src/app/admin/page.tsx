import Link from "next/link";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminStats, listAllArticlesForAdmin } from "@/lib/articles";
import { formatDateFr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await auth();
  const [stats, articles] = await Promise.all([
    getAdminStats(),
    listAllArticlesForAdmin(),
  ]);
  const recent = articles.slice(0, 5);

  return (
    <AdminShell active="Tableau de bord" user={session!.user}>
      <header className="mb-10">
        <span className="font-mono text-[11px] tracking-[2.4px] text-accent uppercase">
          Tableau de bord
        </span>
        <h1 className="font-serif text-[44px] font-bold tracking-[-0.8px] m-0 mt-3 leading-[1.05]">
          Bonjour {session!.user.name?.split(" ")[0] || ""}.
        </h1>
        <p className="text-[16px] text-ink-3 m-0 mt-2">
          Voici l'état de la rédaction.
        </p>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <Stat label="Articles publiés" value={stats.published} />
        <Stat label="Programmés" value={stats.scheduled} />
        <Stat label="Brouillons" value={stats.drafts} />
        <Stat label="Total" value={stats.total} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-sans text-[11px] tracking-[2.4px] uppercase font-semibold text-ink m-0">
            Activité récente
          </h2>
          <Link
            href="/admin/articles"
            className="font-sans text-[12px] text-accent no-underline tracking-[0.3px]"
          >
            Voir tous les articles →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="border border-rule px-6 py-10 text-center">
            <p className="font-serif italic text-[18px] text-ink-2 m-0 mb-4">
              Aucun article pour l'instant.
            </p>
            <Link
              href="/admin/articles/new"
              className="inline-block bg-ink text-paper font-sans text-[13px] font-medium px-5 py-3 no-underline hover:bg-accent transition-colors"
            >
              Écrire le premier →
            </Link>
          </div>
        ) : (
          <div className="border border-rule">
            {recent.map((a, i) => (
              <Link
                key={a._id}
                href={`/admin/articles/${a.slug}/edit`}
                className={`flex items-center justify-between gap-4 px-5 py-4 no-underline text-ink hover:bg-stripe transition-colors ${
                  i === recent.length - 1 ? "" : "border-b border-rule"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-[16px] font-semibold truncate">
                    {a.title}
                  </div>
                  <div className="font-mono text-[10px] tracking-[1.6px] uppercase text-muted mt-1">
                    {a.kicker} · {a.category}
                  </div>
                </div>
                <StatusBadge
                  status={a.status}
                  publishedAt={a.publishedAt}
                />
                <span className="font-mono text-[11px] text-muted">
                  {formatDateFr(a.updatedAt)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-rule px-5 py-5">
      <div className="font-mono text-[10px] tracking-[1.8px] uppercase text-muted mb-2">
        {label}
      </div>
      <div className="font-serif text-[40px] font-bold tracking-[-0.5px] leading-none">
        {value}
      </div>
    </div>
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
      className={`font-mono text-[10px] tracking-[1.6px] uppercase border px-2 py-[3px] ${cls}`}
    >
      {label}
    </span>
  );
}
