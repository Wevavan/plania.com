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
        <nav className="flex items-center gap-x-3 gap-y-2 flex-wrap justify-end">
          {subcategories.map((c, i) => {
            const active = c.slug === activeSubSlug;
            return (
              <span key={c.slug} className="flex items-center gap-x-3">
                <Link
                  href={categoryUrl(c)}
                  className={`no-underline transition-colors hover:text-accent ${
                    active
                      ? "text-ink font-semibold"
                      : "text-muted"
                  }`}
                >
                  {c.name}
                </Link>
                {i < subcategories.length - 1 && (
                  <span className="text-rule-2">·</span>
                )}
              </span>
            );
          })}
        </nav>
      )}
    </div>
  );
}
