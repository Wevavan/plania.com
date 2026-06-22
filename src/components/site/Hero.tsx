import Link from "next/link";
import type { ArticleDTO } from "@/lib/articles";
import { Kicker } from "./Kicker";
import { HeroImage, SmallImage } from "./HeroImage";
import { formatDateFr, formatDateShortFr } from "@/lib/format";

type Props = {
  article: ArticleDTO;
  secondary: ArticleDTO[];
};

export function Hero({ article, secondary }: Props) {
  return (
    <section className="py-10 border-b border-rule">
      <div className="grid grid-cols-1 lg:grid-cols-[3.6fr_1fr] gap-8 lg:gap-10 items-start">
        {/* Vedette principale — réduite */}
        <article className="group cursor-pointer lg:border-r lg:border-rule lg:pr-10">
          <Link
            href={`/article/${article.slug}`}
            className="no-underline text-ink block"
          >
            <HeroImage
              src={article.imageUrl}
              alt={article.imageAlt || article.title}
              aspect="2.4 / 1"
              className="mb-4"
            />
            <Kicker>{article.kicker}</Kicker>
            <h2 className="mt-3 font-serif text-[34px] leading-[1.08] tracking-[-0.5px] font-bold m-0 transition-colors group-hover:text-accent balance">
              {article.title}
            </h2>
            {article.dek && (
              <p className="text-[17px] leading-[1.5] text-ink-2 mt-3 mb-0 max-w-[640px]">
                {article.dek}
              </p>
            )}
            <div className="font-serif italic text-[13px] text-muted mt-4">
              Planète IA ·{" "}
              <span className="not-italic font-mono text-[11px]">
                {formatDateFr(article.publishedAt)}
              </span>
            </div>
          </Link>
        </article>

        {/* Les autres à la une — une colonne, titres sous images */}
        <div className="flex flex-col gap-8">
          {secondary.map((s) => (
            <article key={s._id} className="group cursor-pointer">
              <Link
                href={`/article/${s.slug}`}
                className="no-underline text-ink block"
              >
                <SmallImage
                  src={s.thumbnailUrl || s.imageUrl}
                  alt={s.thumbnailAlt || s.imageAlt || s.title}
                  className="mb-[10px]"
                />
                <Kicker size="sm">{s.kicker}</Kicker>
                <h3 className="mt-[5px] font-serif text-[13px] leading-[1.3] font-semibold m-0 tracking-[-0.1px] transition-colors group-hover:text-accent balance">
                  {s.title}
                </h3>
                <div className="font-serif italic text-[10px] text-muted mt-[6px]">
                  Planète IA ·{" "}
                  <span className="not-italic font-mono">
                    {formatDateShortFr(s.publishedAt)}
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
