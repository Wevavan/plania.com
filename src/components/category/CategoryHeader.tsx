import { Kicker } from "@/components/site/Kicker";
import type { CategoryMeta, SectionMeta } from "@/lib/categories";
import type { CategoryStats } from "@/lib/articles";

type Props = {
  category: CategoryMeta;
  section: SectionMeta;
  stats: CategoryStats;
};

export function CategoryHeader({ category, section, stats }: Props) {
  const lastUpdate =
    stats.lastUpdateHours == null
      ? "-"
      : stats.lastUpdateHours < 24
        ? `il y a ${stats.lastUpdateHours} h`
        : `il y a ${Math.round(stats.lastUpdateHours / 24)} j`;

  const indexInSection = section.categories.findIndex(
    (c) => c.slug === category.slug
  );
  const positionLabel = `${String(indexInSection + 1).padStart(2, "0")} DE ${String(section.categories.length).padStart(2, "0")}`;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 lg:gap-16 py-12 lg:pb-9 border-b border-rule items-end">
      <div>
        <Kicker>RUBRIQUE · {positionLabel}</Kicker>
        <h2 className="mt-[18px] font-serif font-bold leading-[0.9] tracking-[-5px] m-0 balance text-[72px] md:text-[110px] lg:text-[140px]">
          {category.name}
          <span className="italic font-normal text-accent">.</span>
        </h2>
        <p className="text-[19px] leading-[1.55] text-ink-2 mt-[18px] m-0">
          {category.dek}
        </p>
      </div>
      <div className="flex lg:justify-end">
        <div className="border border-ink px-5 py-[18px] w-full max-w-[320px]">
          <StatRow label="Articles publiés" valueLarge={String(stats.total)} />
          <StatRow
            label="Enquêtes en cours"
            valueLarge={String(stats.ongoingInvestigations).padStart(2, "0")}
          />
          <StatRow label="Dernière mise à jour" value={lastUpdate} />
          <StatRow label="Éditrice de rubrique" value={category.editor} last />
        </div>
      </div>
    </section>
  );
}

function StatRow({
  label,
  valueLarge,
  value,
  last,
}: {
  label: string;
  valueLarge?: string;
  value?: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-baseline py-[10px] font-sans text-[12px] text-ink-3 ${
        last ? "" : "border-b border-dashed border-rule"
      }`}
    >
      <span className="tracking-[0.3px]">{label}</span>
      {valueLarge ? (
        <span className="font-serif text-[24px] font-bold tracking-[-0.5px] text-ink">
          {valueLarge}
        </span>
      ) : (
        <span className="font-mono text-[12px] text-ink">{value}</span>
      )}
    </div>
  );
}
