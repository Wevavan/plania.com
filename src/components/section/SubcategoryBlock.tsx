import Link from "next/link";
import type { ArticleDTO } from "@/lib/articles";
import { Kicker } from "@/components/site/Kicker";
import { SmallImage } from "@/components/site/HeroImage";
import { formatDateShortFr } from "@/lib/format";
import type { CategoryMeta } from "@/lib/categories";
import { categoryUrl } from "@/lib/categories";

type Props = {
  category: CategoryMeta;
  articles: ArticleDTO[];
};

export function SubcategoryBlock({ category, articles }: Props) {
  return (
    <section className="py-9 border-b border-rule">
      <header className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <Kicker>Sous-rubrique</Kicker>
          <h2 className="font-serif text-[28px] font-bold tracking-[-0.4px] m-0 mt-2">
            <Link
              href={categoryUrl(category)}
              className="no-underline text-ink hover:text-accent transition-colors"
            >
              {category.name}
            </Link>
          </h2>
          <p className="font-serif italic text-[14px] text-muted m-0 mt-1 max-w-[640px]">
            {category.dek}
          </p>
        </div>
        <Link
          href={categoryUrl(category)}
          className="font-sans text-[12px] text-accent no-underline tracking-[0.3px] whitespace-nowrap"
        >
          Voir tous les articles →
        </Link>
      </header>

      {articles.length === 0 ? (
        <div className="border border-rule px-5 py-8 text-center">
          <p className="font-serif italic text-[15px] text-muted m-0">
            Aucun article pour cette sous-rubrique pour l'instant.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {articles.slice(0, 3).map((a) => (
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
                <Kicker size="sm">{a.kicker}</Kicker>
                <h3 className="mt-[10px] font-serif text-[19px] leading-[1.2] font-semibold m-0 tracking-[-0.2px] mb-2 transition-colors group-hover:text-accent">
                  {a.title}
                </h3>
                {a.dek && (
                  <p className="text-[14px] text-ink-3 leading-[1.45] mb-3">
                    {a.dek}
                  </p>
                )}
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
      )}
    </section>
  );
}
