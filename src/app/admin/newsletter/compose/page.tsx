import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { getSubscriberStats } from "@/lib/newsletter";
import { sendNewsletterAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function ComposeNewsletter() {
  const session = await auth();
  const stats = await getSubscriberStats();

  return (
    <AdminShell active="Newsletter" user={session!.user}>
      <header className="mb-8">
        <span className="font-mono text-[11px] tracking-[2.4px] text-accent uppercase">
          Newsletter · Composer
        </span>
        <h1 className="font-serif text-[44px] font-bold tracking-[-0.8px] m-0 mt-3 leading-[1.05]">
          Rédiger la lettre du mercredi
        </h1>
        <p className="text-[15px] text-ink-3 m-0 mt-3">
          Sera envoyée à <strong className="text-ink">{stats.confirmed}</strong>{" "}
          abonné{stats.confirmed > 1 ? "s" : ""} confirmé
          {stats.confirmed > 1 ? "s" : ""}.
        </p>
      </header>

      <form action={sendNewsletterAction} className="space-y-6">
        <label className="block">
          <span className="font-mono text-[10px] tracking-[1.2px] uppercase text-ink-3 mb-2 block">
            Sujet de l'email *
          </span>
          <input
            type="text"
            name="subject"
            required
            placeholder="Cinq lectures pour la semaine"
            className="w-full bg-transparent border border-rule px-4 py-[12px] font-serif text-[18px] outline-none focus:border-ink"
          />
        </label>

        <label className="block">
          <span className="font-mono text-[10px] tracking-[1.2px] uppercase text-ink-3 mb-2 block">
            Corps (Markdown supporté) *
          </span>
          <MarkdownEditor name="body" />
          <p className="font-sans text-[12px] text-muted mt-2 m-0">
            Format : <code className="font-mono">## Titre</code> pour une
            section, <code className="font-mono">**gras**</code>,{" "}
            <code className="font-mono">*italique*</code>,{" "}
            <code className="font-mono">[texte](url)</code>, et{" "}
            <code className="font-mono">&gt; Citation</code> sur une ligne avec
            une ligne <code className="font-mono">— Source</code> juste après.
          </p>
        </label>

        <div className="flex items-center justify-between gap-4 pt-6 border-t border-rule">
          <p className="font-sans text-[13px] text-muted m-0">
            Une fois envoyée, la lettre n'est plus modifiable et part vers tous
            les abonnés confirmés.
          </p>
          <button
            type="submit"
            disabled={stats.confirmed === 0}
            className="bg-ink text-paper font-sans text-[14px] font-medium px-7 py-[14px] tracking-[0.2px] hover:bg-accent transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Envoyer à {stats.confirmed} abonné{stats.confirmed > 1 ? "s" : ""}{" "}
            →
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
