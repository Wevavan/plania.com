import Link from "next/link";
import type { ArticleDTO } from "@/lib/articles";
import type { CategoryMeta } from "@/lib/categories";

type Props = {
  mostRead: ArticleDTO[];
  category: CategoryMeta;
};

export function RightRail({ mostRead, category }: Props) {
  return (
    <aside className="flex flex-col gap-8">
      {mostRead.length > 0 && (
        <div>
          <RailHeader>Les + lus en {category.name}</RailHeader>
          <div>
            {mostRead.map((m, i) => (
              <Link
                key={m._id}
                href={`/article/${m.slug}`}
                className={`grid grid-cols-[auto_1fr] gap-3 py-3 no-underline text-inherit items-start ${
                  i === mostRead.length - 1 ? "" : "border-b border-rule"
                }`}
              >
                <span className="font-mono text-[20px] font-medium text-rule-2 tracking-[-0.5px] leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-serif text-[14px] leading-[1.25] font-semibold text-ink balance transition-colors hover:text-accent">
                  {m.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="p-5 bg-ink text-paper">
        <span className="font-mono text-[10px] tracking-[2px] text-accent-warm font-medium">
          LA LETTRE DU MERCREDI
        </span>
        <h3 className="font-serif text-[22px] font-bold tracking-[-0.4px] m-0 mt-[10px] mb-2 leading-[1.15]">
          Une synthèse, chaque mercredi.
        </h3>
        <p className="font-sans text-[12px] text-rule-2 m-0 mb-[14px]">
          Gratuit, sans publicité.
        </p>
        <form
          className="flex flex-col gap-[6px]"
          action="/api/newsletter"
          method="post"
        >
          <input
            name="email"
            type="email"
            required
            placeholder="votre.adresse@exemple.fr"
            className="border border-rule-2 bg-transparent px-3 py-[10px] font-serif text-[13px] text-paper outline-none italic placeholder:text-rule-2"
          />
          <button
            type="submit"
            className="border-none bg-accent-warm text-ink font-sans text-[12px] font-semibold py-[10px] cursor-pointer tracking-[0.4px] hover:bg-paper transition-colors"
          >
            S'abonner
          </button>
        </form>
      </div>
    </aside>
  );
}

function RailHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans text-[11px] tracking-[2px] uppercase font-semibold text-ink pb-[10px] border-b border-ink mb-[14px]">
      {children}
    </div>
  );
}
