import type { ArticleDTO } from "@/lib/articles";

export function ArticleHeader({ article }: { article: ArticleDTO }) {
  return (
    <header className="mb-10">
      <span className="font-mono text-[11px] tracking-[2.4px] text-accent font-medium inline-block mb-6">
        {article.kicker} · {article.category.toUpperCase()}
      </span>

      <h1
        className="font-serif font-bold m-0 mb-8 leading-[1.05] tracking-[-1px] pretty"
        style={{
          fontSize: "clamp(32px, 4.5vw, 64px)",
          wordBreak: "normal",
          overflowWrap: "break-word",
          hyphens: "auto",
        }}
      >
        {article.title}
        {article.titleTrail && (
          <>
            {" "}
            <span
              className="italic font-normal"
              style={{ color: "var(--color-accent)" }}
            >
              {article.titleTrail}
            </span>
          </>
        )}
      </h1>

      {article.dek && (
        <p className="text-[22px] leading-[1.5] text-ink-2 font-serif font-normal m-0 mb-8 text-center balance">
          {article.dek}
        </p>
      )}
    </header>
  );
}
