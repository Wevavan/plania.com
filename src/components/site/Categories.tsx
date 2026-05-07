import Link from "next/link";
import { ALL_SECTIONS, sectionUrl } from "@/lib/categories";
import { getSectionCounts } from "@/lib/articles";

export async function Categories() {
  const counts = await getSectionCounts();

  return (
    <section className="py-12 border-b border-rule">
      <div className="flex items-center gap-4 pb-5">
        <span className="font-sans text-[11px] tracking-[2.4px] uppercase font-semibold text-ink">
          Explorer par section
        </span>
        <span className="flex-1 h-px bg-rule" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ALL_SECTIONS.map((s) => {
          const count = counts[s.slug] ?? 0;
          const initials = stripDiacritics(s.name).slice(0, 2);
          return (
            <Link
              key={s.slug}
              href={sectionUrl(s)}
              className="relative overflow-hidden border border-rule px-5 py-5 no-underline text-ink group hover:border-ink transition-colors min-h-[180px] flex flex-col justify-between"
            >
              <span
                aria-hidden="true"
                className="absolute right-2 -bottom-4 font-serif font-bold leading-none text-rule-2 opacity-60 select-none pointer-events-none text-[110px]"
              >
                {initials}
              </span>
              <div className="relative">
                <span className="font-mono text-[10px] tracking-[1.8px] text-accent uppercase font-medium">
                  Section
                </span>
                <h3 className="mt-1 font-serif text-[22px] font-semibold tracking-[-0.3px] text-ink m-0 leading-[1.15]">
                  {s.name}
                </h3>
                <p className="font-sans text-[11px] text-muted m-0 mt-2 leading-[1.4]">
                  {s.categories.length} sous-rubriques
                </p>
              </div>
              <div className="relative flex justify-between items-baseline font-sans text-[12px] text-muted mt-6">
                <span>
                  {count} article{count > 1 ? "s" : ""}
                </span>
                <span className="font-serif italic text-accent group-hover:underline">
                  lire →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function stripDiacritics(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}
