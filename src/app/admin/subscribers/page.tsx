import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  getSubscriberStats,
  listAllSubscribers,
} from "@/lib/newsletter";
import { formatDateFr, formatRelativeFr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const session = await auth();
  const sp = await searchParams;
  const filter = sp.filter || "all";
  const q = (sp.q || "").trim().toLowerCase();

  const [stats, all] = await Promise.all([
    getSubscriberStats(),
    listAllSubscribers(),
  ]);

  let list = all;
  if (filter === "confirmed") {
    list = list.filter((s) => s.confirmedAt && !s.unsubscribedAt);
  } else if (filter === "pending") {
    list = list.filter((s) => !s.confirmedAt && !s.unsubscribedAt);
  } else if (filter === "unsubscribed") {
    list = list.filter((s) => !!s.unsubscribedAt);
  }
  if (q) {
    list = list.filter((s) => s.email.toLowerCase().includes(q));
  }

  const filters = [
    { key: "all", label: `Tous (${stats.total})` },
    { key: "confirmed", label: `Confirmés (${stats.confirmed})` },
    { key: "pending", label: `En attente (${stats.pending})` },
    { key: "unsubscribed", label: `Désinscrits (${stats.unsubscribed})` },
  ];

  return (
    <AdminShell active="Abonnés" user={session!.user}>
      <header className="mb-8">
        <span className="font-mono text-[11px] tracking-[2.4px] text-accent uppercase">
          Newsletter
        </span>
        <h1 className="font-serif text-[44px] font-bold tracking-[-0.8px] m-0 mt-3 leading-[1.05]">
          Abonnés
        </h1>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Stat label="Total" value={stats.total} />
        <Stat label="Confirmés" value={stats.confirmed} accent />
        <Stat label="En attente" value={stats.pending} />
        <Stat label="Désinscrits" value={stats.unsubscribed} />
      </section>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {filters.map((f) => (
          <a
            key={f.key}
            href={
              f.key === "all"
                ? "/admin/subscribers"
                : `/admin/subscribers?filter=${f.key}`
            }
            className={`px-3 py-[6px] font-mono text-[10px] tracking-[1.8px] uppercase border no-underline transition-colors ${
              filter === f.key
                ? "bg-ink text-paper border-ink"
                : "text-ink-3 border-rule hover:border-ink"
            }`}
          >
            {f.label}
          </a>
        ))}

        <form action="/admin/subscribers" method="get" className="ml-auto">
          {filter !== "all" && (
            <input type="hidden" name="filter" value={filter} />
          )}
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Filtrer par email…"
            className="border border-rule bg-transparent px-3 py-[7px] font-serif italic text-[13px] outline-none focus:border-ink min-w-[280px]"
          />
        </form>
      </div>

      {list.length === 0 ? (
        <div className="border border-rule px-6 py-10 text-center">
          <p className="font-serif italic text-[18px] text-ink-2 m-0">
            Aucun abonné{q ? ` pour « ${q} »` : ""}.
          </p>
        </div>
      ) : (
        <div className="border border-rule">
          <div className="grid grid-cols-[2fr_120px_140px_140px] gap-4 px-5 py-3 bg-stripe font-mono text-[10px] tracking-[1.6px] uppercase text-muted">
            <span>Email</span>
            <span>Statut</span>
            <span>Inscrit le</span>
            <span>Confirmé</span>
          </div>
          {list.map((s, i) => (
            <div
              key={s._id}
              className={`grid grid-cols-[2fr_120px_140px_140px] gap-4 px-5 py-3 items-center text-ink ${
                i === list.length - 1 ? "" : "border-t border-rule"
              }`}
            >
              <span className="font-mono text-[13px] truncate">
                {s.email}
              </span>
              <SubscriberStatusBadge
                confirmed={!!s.confirmedAt}
                unsubscribed={!!s.unsubscribedAt}
              />
              <span className="font-mono text-[11px] text-muted">
                {formatDateFr(s.createdAt)}
              </span>
              <span className="font-mono text-[11px] text-muted">
                {s.confirmedAt ? formatRelativeFr(s.confirmedAt) : "-"}
              </span>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`border px-5 py-5 ${accent ? "border-accent" : "border-rule"}`}
    >
      <div className="font-mono text-[10px] tracking-[1.8px] uppercase text-muted mb-2">
        {label}
      </div>
      <div
        className={`font-serif text-[40px] font-bold tracking-[-0.5px] leading-none ${
          accent ? "text-accent" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function SubscriberStatusBadge({
  confirmed,
  unsubscribed,
}: {
  confirmed: boolean;
  unsubscribed: boolean;
}) {
  let label = "En attente";
  let cls = "border-muted-2 text-muted";
  if (unsubscribed) {
    label = "Désinscrit";
    cls = "border-rule-2 text-muted-2";
  } else if (confirmed) {
    label = "Confirmé";
    cls = "border-accent text-accent";
  }
  return (
    <span
      className={`font-mono text-[10px] tracking-[1.6px] uppercase border px-2 py-[3px] ${cls} justify-self-start`}
    >
      {label}
    </span>
  );
}
