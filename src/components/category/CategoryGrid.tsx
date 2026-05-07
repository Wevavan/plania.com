import Link from "next/link";
import type { ArticleDTO } from "@/lib/articles";
import { Kicker } from "@/components/site/Kicker";
import { SmallImage } from "@/components/site/HeroImage";
import { formatDateShortFr } from "@/lib/format";

export function CategoryGrid({
  articles,
  total,
}: {
  articles: ArticleDTO[];
  total: number;
}) {
  const remaining = Math.max(0, total - articles.length);
  return (
    <>
      <div className="flex items-center gap-4 pt-9 pb-5">
        <span className="font-sans text-[11px] tracking-[2.4px] uppercase font-semibold text-ink">
          Tous les articles
        </span>
        <span className="flex-1 h-px bg-rule" />
        <div className="flex gap-[14px] items-center font-sans text-[12px]">
          <span className="text-muted tracking-[0.3px]">Trier par</span>
          <a
            href="#"
            className="text-ink font-semibold no-underline hover:text-accent"
          >
            Date
          </a>
          <a href="#" className="text-muted no-underline hover:text-accent">
            Lus
          </a>
          <a href="#" className="text-muted no-underline hover:text-accent">
            Longueur
          </a>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-12 border-b border-rule">
        {articles.map((a) => (
          <article key={a._id} className="group cursor-pointer pb-1">
            <Link href={`/article/${a.slug}`} className="no-underline text-ink">
              <SmallImage
                src={a.thumbnailUrl || a.imageUrl}
                alt={a.thumbnailAlt || a.imageAlt || a.title}
                className="mb-[14px]"
              />
              <Kicker size="sm">{a.kicker}</Kicker>
              <h4 className="mt-[10px] font-serif text-[22px] leading-[1.18] font-semibold m-0 tracking-[-0.3px] mb-[10px] balance transition-colors group-hover:text-accent">
                {a.title}
              </h4>
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

        <div className="flex justify-between items-center pt-9 col-span-full">
          <button className="font-sans text-[13px] font-medium bg-transparent border border-ink text-ink px-[22px] py-[12px] cursor-pointer tracking-[0.3px] hover:bg-ink hover:text-paper transition-colors">
            {remaining > 0
              ? `Charger la suite · ${remaining} articles restants`
              : "Fin des articles"}
          </button>
          <span className="font-mono text-[11px] text-muted tracking-[0.5px]">
            Page 1 / {Math.max(1, Math.ceil(total / 9))}
          </span>
        </div>
      </section>
    </>
  );
}
