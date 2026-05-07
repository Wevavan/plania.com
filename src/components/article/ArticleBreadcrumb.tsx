import Link from "next/link";
import {
  getCategoryByName,
  getSectionForCategoryName,
  sectionUrl,
  categoryUrl,
} from "@/lib/categories";

type Props = {
  category: string;
  kicker: string;
  dateLabel: string;
};

export function ArticleBreadcrumb({ category, kicker, dateLabel }: Props) {
  const cat = getCategoryByName(category);
  const section = getSectionForCategoryName(category);
  return (
    <div className="flex items-center gap-[10px] py-4 font-mono text-[11px] text-muted tracking-[0.4px] uppercase border-b border-rule flex-wrap">
      <Link href="/" className="text-muted no-underline hover:text-accent">
        Accueil
      </Link>
      {section && (
        <>
          <span className="text-rule-2">/</span>
          <Link
            href={sectionUrl(section)}
            className="text-muted no-underline hover:text-accent"
          >
            {section.name}
          </Link>
        </>
      )}
      {cat && (
        <>
          <span className="text-rule-2">/</span>
          <Link
            href={categoryUrl(cat)}
            className="text-muted no-underline hover:text-accent"
          >
            {category}
          </Link>
        </>
      )}
      <span className="text-rule-2">/</span>
      <span className="text-ink font-medium">
        {kicker} · {dateLabel}
      </span>
    </div>
  );
}
