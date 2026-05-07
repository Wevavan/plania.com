import Link from "next/link";
import type { ArticleDTO } from "@/lib/articles";
import { Kicker } from "@/components/site/Kicker";
import { SmallImage } from "@/components/site/HeroImage";
import { formatDateShortFr } from "@/lib/format";
import { categoryUrlByName } from "@/lib/categories";

type Props = {
  articles: ArticleDTO[];
  categoryName: string;
};

export function RelatedArticles({ articles, categoryName }: Props) {
  if (articles.length === 0) return null;
  return (
    <section className="py-9 border-t border-rule">
      <div className="flex items-center gap-4 pb-5 mb-6">
        <span className="font-sans text-[11px] tracking-[2.4px] uppercase font-semibold text-ink">
          À lire ensuite
        </span>
        <span className="flex-1 h-px bg-rule" />
        <Link
          href={categoryUrlByName(categoryName)}
          className="font-sans text-[12px] text-accent no-underline tracking-[0.3px]"
        >
          Voir toute la rubrique →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {articles.map((a) => (
          <article key={a._id} className="group cursor-pointer">
            <Link href={`/article/${a.slug}`} className="no-underline text-ink">
              <SmallImage
                src={a.thumbnailUrl || a.imageUrl}
                alt={a.thumbnailAlt || a.imageAlt || a.title}
                className="mb-[14px]"
              />
              <Kicker size="sm">{a.kicker}</Kicker>
              <h3 className="mt-[10px] font-serif text-[20px] leading-[1.2] font-semibold m-0 tracking-[-0.3px] mb-[10px] balance transition-colors group-hover:text-accent">
                {a.title}
              </h3>
              <div className="font-serif italic text-[12px] text-muted">
                Planète IA ·{" "}
                <span className="not-italic font-mono">
                  {formatDateShortFr(a.publishedAt)}
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
