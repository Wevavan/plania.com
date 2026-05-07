import Link from "next/link";
import type { ArticleDTO } from "@/lib/articles";
import { Kicker } from "@/components/site/Kicker";
import { HeroImage } from "@/components/site/HeroImage";
import { formatDateFr, formatDateShortFr } from "@/lib/format";

type Props = {
  featured: ArticleDTO;
  secondary: ArticleDTO[];
};

export function CategoryHero({ featured, secondary }: Props) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 py-10 border-b border-rule">
      <article className="lg:pr-10 lg:border-r lg:border-rule">
        <div className="mb-6">
          <HeroImage
            src={featured.imageUrl}
            alt={featured.imageAlt || featured.title}
            label="[ photo · ligne éditoriale noir et blanc ]"
          />
          {featured.imageCaption && (
            <div className="text-[12px] text-muted mt-2 italic leading-[1.4]">
              {featured.imageCaption}
            </div>
          )}
        </div>
        <div>
          <Kicker>{featured.kicker}</Kicker>
          <h2 className="mt-[14px] font-serif text-[48px] leading-[1.05] tracking-[-0.8px] font-bold m-0 text-center">
            <Link
              href={`/article/${featured.slug}`}
              className="no-underline text-ink transition-colors hover:text-accent"
            >
              {featured.title}
            </Link>
          </h2>
          {featured.dek && (
            <p className="text-[19px] leading-[1.5] text-ink-2 mt-[18px] mb-[22px] text-center">
              {featured.dek}
            </p>
          )}
          <div className="font-serif italic text-[14px] text-muted">
            Planète IA ·{" "}
            <span className="not-italic font-mono text-[13px]">
              {formatDateFr(featured.publishedAt)}
            </span>
          </div>
        </div>
      </article>

      <aside>
        <div className="font-sans text-[12px] tracking-[2px] uppercase font-semibold text-ink pb-3 border-b-2 border-ink mb-[18px]">
          Également à la une
        </div>
        {secondary.map((s, i) => (
          <article
            key={s._id}
            className={`pb-[18px] mb-[18px] cursor-pointer group ${
              i === secondary.length - 1 ? "border-none" : "border-b border-rule"
            }`}
          >
            <Kicker size="sm">{s.kicker}</Kicker>
            <h3 className="mt-[10px] font-serif text-[21px] leading-[1.2] font-semibold m-0 tracking-[-0.2px]">
              <Link
                href={`/article/${s.slug}`}
                className="no-underline text-ink transition-colors group-hover:text-accent"
              >
                {s.title}
              </Link>
            </h3>
            <div className="font-serif italic text-[12px] text-muted mt-[10px]">
              Planète IA ·{" "}
              <span className="not-italic font-mono">
                {formatDateShortFr(s.publishedAt)}
              </span>
            </div>
          </article>
        ))}
      </aside>
    </section>
  );
}
