import Link from "next/link";
import type { ArticleDTO } from "@/lib/articles";
import { Kicker } from "./Kicker";
import { SmallImage } from "./HeroImage";
import { formatDateShortFr } from "@/lib/format";

export function LatestGrid({ articles }: { articles: ArticleDTO[] }) {
  if (articles.length === 0) return null;
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 pb-12 border-b border-rule">
      {articles.map((a) => (
        <article key={a._id} className="group cursor-pointer">
          <Link href={`/article/${a.slug}`} className="no-underline text-ink">
            <SmallImage
              src={a.thumbnailUrl || a.imageUrl}
              alt={a.thumbnailAlt || a.imageAlt || a.title}
              className="mb-[14px]"
            />
            <Kicker size="sm">{a.kicker}</Kicker>
            <h3 className="mt-[10px] font-serif text-[19px] leading-[1.2] font-semibold m-0 tracking-[-0.2px] mb-2 balance transition-colors group-hover:text-accent">
              {a.title}
            </h3>
            {a.dek && (
              <p className="text-[14px] text-ink-3 leading-[1.45] mb-3">
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
    </section>
  );
}
