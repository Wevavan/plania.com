import Link from "next/link";
import type { SectionMeta, CategoryMeta } from "@/lib/categories";
import { sectionUrl, categoryUrl } from "@/lib/categories";

type Props = {
  current: string;
  section?: SectionMeta;
  subcategories?: CategoryMeta[];
  activeSubSlug?: string;
};

export function Breadcrumb({
  current,
  section,
  subcategories,
  activeSubSlug,
}: Props) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-y-3 gap-x-6 py-[18px] font-mono text-[11px] text-muted tracking-[0.4px] uppercase border-b border-rule">
      {/* Fil d'Ariane à gauche */}
      <div className="flex items-center gap-[10px] flex-wrap">
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
        <span className="text-rule-2">/</span>
        <span className="text-ink font-medium">{current}</span>
      </div>

      {/* Sous-rubriques à droite */}
      {subcategories && subcategories.length > 0 && (
        <nav className="flex items-center gap-2 flex-wrap justify-end font-sans normal-case tracking-[0.2px] text-[13px]">
          {subcategories.map((c) => {
            const active = c.slug === activeSubSlug;
            return (
              <Link
                key={c.slug}
                href={categoryUrl(c)}
                className={`no-underline px-3 py-[6px] border-b-2 transition-all ${
                  active
                    ? "font-bold text-ink border-accent bg-paper-2"
                    : "font-semibold text-ink-2 border-transparent hover:bg-ink hover:text-paper hover:border-ink"
                }`}
              >
                {c.name}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
