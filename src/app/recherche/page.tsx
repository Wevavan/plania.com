import Link from "next/link";
import type { Metadata } from "next";
import { searchArticles } from "@/lib/articles";
import { SiteShell } from "@/components/site/SiteShell";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Kicker } from "@/components/site/Kicker";
import { SmallImage } from "@/components/site/HeroImage";
import { formatDateShortFr } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Recherche — Linfoia",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const results = q ? await searchArticles(q) : [];

  return (
    <SiteShell>
      <div className="py-10">
        <span className="font-mono text-[11px] tracking-[2.4px] text-accent font-medium uppercase">
          Recherche
        </span>
        <h1 className="font-serif text-[44px] font-bold leading-[1.05] tracking-[-0.8px] m-0 mt-3 mb-6 balance">
          {q ? (
            <>
              Résultats pour{" "}
              <span className="italic text-accent">« {q} »</span>
            </>
          ) : (
            "Que cherchez-vous ?"
          )}
        </h1>

        <form action="/recherche" method="get" role="search" className="mb-12">
          <div className="flex items-center gap-3 border border-ink px-5 py-[14px] focus-within:border-accent transition-colors max-w-[640px]">
            <span className="text-[18px] text-muted" aria-hidden="true">
              ⌕
            </span>
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Titre, auteur, sujet, mot-clé…"
              autoFocus
              className="flex-1 bg-transparent border-none outline-none font-serif italic text-[16px] text-ink placeholder:text-muted"
            />
            <button
              type="submit"
              className="font-sans text-[12px] font-medium tracking-[0.3px] uppercase text-ink-3 hover:text-ink cursor-pointer"
            >
              Chercher →
            </button>
          </div>
        </form>

        {q && results.length === 0 && (
          <div className="border border-rule px-6 py-10 text-center">
            <p className="font-serif italic text-[18px] text-ink-2 m-0 mb-2">
              Aucun article ne correspond à « {q} ».
            </p>
            <p className="font-sans text-[12px] text-muted">
              Essayez un terme plus court ou différent.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <div className="font-mono text-[11px] tracking-[1.8px] uppercase text-muted mb-6">
              {results.length} article{results.length > 1 ? "s" : ""}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 pb-12">
              {results.map((a) => (
                <article key={a._id} className="group cursor-pointer">
                  <Link
                    href={`/article/${a.slug}`}
                    className="no-underline text-ink"
                  >
                    <SmallImage
                      src={a.thumbnailUrl || a.imageUrl}
                      alt={a.thumbnailAlt || a.imageAlt || a.title}
                      className="mb-[14px]"
                    />
                    <Kicker size="sm">
                      {a.kicker} · {a.category}
                    </Kicker>
                    <h3 className="mt-[10px] font-serif text-[20px] leading-[1.2] font-semibold m-0 tracking-[-0.3px] mb-2 balance transition-colors group-hover:text-accent">
                      {a.title}
                      {a.titleTrail && (
                        <>
                          {" "}
                          <span className="italic font-normal text-accent">
                            {a.titleTrail}
                          </span>
                        </>
                      )}
                    </h3>
                    {a.dek && (
                      <p className="text-[14px] leading-[1.5] text-ink-3 m-0 mb-3">
                        {a.dek}
                      </p>
                    )}
                    <div className="font-serif italic text-[12px] text-muted">
                      & Le Quotidien des IA ·{" "}
                      <span className="not-italic font-mono">
                        {formatDateShortFr(a.publishedAt)}
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
      <SiteFooter />
    </SiteShell>
  );
}
