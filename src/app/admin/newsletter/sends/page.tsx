import Link from "next/link";
import { auth } from "@/auth";
import { connectMongo } from "@/lib/mongodb";
import { NewsletterSendModel } from "@/models/NewsletterSend";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatDateFr, formatRelativeFr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function NewsletterSendsHistory({
  searchParams,
}: {
  searchParams: Promise<{ just?: string }>;
}) {
  const session = await auth();
  const sp = await searchParams;
  await connectMongo();
  const sends = await NewsletterSendModel.find({})
    .sort({ sentAt: -1 })
    .lean();

  return (
    <AdminShell active="Newsletter" user={session!.user}>
      <header className="flex justify-between items-end gap-4 mb-8 flex-wrap">
        <div>
          <span className="font-mono text-[11px] tracking-[2.4px] text-accent uppercase">
            Newsletter · Historique
          </span>
          <h1 className="font-serif text-[44px] font-bold tracking-[-0.8px] m-0 mt-3 leading-[1.05]">
            Lettres envoyées
          </h1>
        </div>
        <Link
          href="/admin/newsletter/compose"
          className="bg-ink text-paper font-sans text-[13px] font-medium px-5 py-[12px] no-underline hover:bg-accent transition-colors"
        >
          Nouvelle lettre →
        </Link>
      </header>

      {sp.just && (
        <div className="bg-stripe border border-ink px-4 py-3 mb-6 font-sans text-[13px] text-ink">
          ✓ Lettre envoyée. Voir le résultat ci-dessous.
        </div>
      )}

      {sends.length === 0 ? (
        <div className="border border-rule px-6 py-10 text-center">
          <p className="font-serif italic text-[18px] text-ink-2 m-0 mb-4">
            Aucune lettre envoyée pour l'instant.
          </p>
          <Link
            href="/admin/newsletter/compose"
            className="inline-block bg-ink text-paper font-sans text-[13px] font-medium px-5 py-3 no-underline hover:bg-accent transition-colors"
          >
            Rédiger la première →
          </Link>
        </div>
      ) : (
        <div className="border border-rule">
          <div className="grid grid-cols-[2fr_120px_120px_140px_140px] gap-4 px-5 py-3 bg-stripe font-mono text-[10px] tracking-[1.6px] uppercase text-muted">
            <span>Sujet</span>
            <span>Statut</span>
            <span>Destinataires</span>
            <span>Réussite</span>
            <span>Envoyée</span>
          </div>
          {sends.map((s, i) => {
            const id = s._id.toString();
            return (
              <div
                key={id}
                className={`grid grid-cols-[2fr_120px_120px_140px_140px] gap-4 px-5 py-4 items-center text-ink ${
                  i === sends.length - 1 ? "" : "border-t border-rule"
                }`}
              >
                <div className="min-w-0">
                  <div className="font-serif text-[15px] font-semibold truncate">
                    {s.subject}
                  </div>
                  <div className="font-mono text-[10px] text-muted mt-1">
                    par {s.sentBy || "—"}
                  </div>
                </div>
                <SendStatus status={s.status} />
                <span className="font-mono text-[12px] text-ink">
                  {s.sentToCount}
                </span>
                <span className="font-mono text-[12px] text-ink">
                  {s.successCount}
                  {s.failureCount > 0 && (
                    <span className="text-accent"> · {s.failureCount} ✗</span>
                  )}
                </span>
                <span className="font-mono text-[11px] text-muted">
                  {s.sentAt ? formatRelativeFr(s.sentAt.toString()) : "—"}
                  <br />
                  <span className="text-[10px]">
                    {s.sentAt ? formatDateFr(s.sentAt.toString()) : ""}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}

function SendStatus({ status }: { status: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    sent: { label: "Envoyée", cls: "border-accent text-accent" },
    sending: { label: "En cours…", cls: "border-ink text-ink" },
    failed: { label: "Échec", cls: "border-accent text-accent" },
    draft: { label: "Brouillon", cls: "border-muted-2 text-muted" },
  };
  const c = cfg[status] || cfg.draft;
  return (
    <span
      className={`font-mono text-[10px] tracking-[1.6px] uppercase border px-2 py-[3px] ${c.cls} justify-self-start`}
    >
      {c.label}
    </span>
  );
}
