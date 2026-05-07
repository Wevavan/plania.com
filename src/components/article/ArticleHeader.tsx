import type { ArticleDTO } from "@/lib/articles";
import { FitLine } from "./FitLine";
import { formatDateFr } from "@/lib/format";

export function ArticleHeader({ article }: { article: ArticleDTO }) {
  return (
    <header className="mb-10">
      <span className="font-mono text-[11px] tracking-[2.4px] text-accent font-medium inline-block mb-6">
        {article.kicker} · {article.category.toUpperCase()}
      </span>

      <h1 className="font-serif m-0 mb-8 block">
        {article.titleTrail ? (
          <>
            <FitLine align="left">{article.title}</FitLine>
            <FitLine align="right" italic color="var(--color-accent)">
              {article.titleTrail}
            </FitLine>
          </>
        ) : (
          <FitLine align="left">{article.title}</FitLine>
        )}
      </h1>

      {article.dek && (
        <p className="text-[22px] leading-[1.5] text-ink-2 font-serif font-normal m-0 mb-8 text-center">
          {article.dek}
        </p>
      )}

      <div className="py-[18px] border-y border-ink">
        <div className="font-serif italic text-[15px] text-muted">
          & Le Quotidien des IA ·{" "}
          <span className="not-italic font-mono text-[13px] text-ink">
            {formatDateFr(article.publishedAt)}
          </span>
        </div>
      </div>
    </header>
  );
}
