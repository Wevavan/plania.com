import Link from "next/link";

type Props = {
  label: string;
  seeMoreHref?: string;
  seeMoreLabel?: string;
};

export function SectionDivider({
  label,
  seeMoreHref,
  seeMoreLabel = "Voir toutes les éditions →",
}: Props) {
  return (
    <div className="flex items-center gap-4 pt-9 pb-7">
      <span className="font-sans text-[11px] tracking-[2.4px] uppercase font-semibold text-ink">
        {label}
      </span>
      <span className="flex-1 h-px bg-rule" />
      {seeMoreHref && (
        <Link
          href={seeMoreHref}
          className="font-sans text-[12px] text-accent no-underline tracking-[0.3px]"
        >
          {seeMoreLabel}
        </Link>
      )}
    </div>
  );
}
