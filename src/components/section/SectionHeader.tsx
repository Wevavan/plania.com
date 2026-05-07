import { Kicker } from "@/components/site/Kicker";
import type { SectionMeta } from "@/lib/categories";

type Props = {
  section: SectionMeta;
  total: number;
  totalSections: number;
  lastUpdate: string;
};

export function SectionHeader({
  section,
  total,
  totalSections,
  lastUpdate,
}: Props) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 lg:gap-16 py-12 lg:pb-9 border-b border-rule items-end">
      <div>
        <Kicker>
          SECTION · {String(section.index).padStart(2, "0")} DE{" "}
          {String(totalSections).padStart(2, "0")}
        </Kicker>
        <h1 className="mt-[18px] font-serif font-bold leading-[0.92] tracking-[-4px] m-0 text-[64px] md:text-[96px] lg:text-[120px] text-center">
          {section.name}
          <span className="italic font-normal text-accent">.</span>
        </h1>
        <p className="text-[19px] leading-[1.55] text-ink-2 mt-[18px] m-0 text-center">
          {section.dek}
        </p>
      </div>
      <div className="flex lg:justify-end">
        <div className="border border-ink px-5 py-[18px] w-full max-w-[320px]">
          <Row label="Articles publiés" valueLarge={String(total)} />
          <Row label="Dernière mise à jour" value={lastUpdate} last />
        </div>
      </div>
    </section>
  );
}

function Row({
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
