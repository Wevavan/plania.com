export function CategoryChips({ chips }: { chips: string[] }) {
  if (!chips || chips.length === 0) return null;
  return (
    <div className="flex gap-2 items-center pt-6 pb-8 border-b border-rule flex-wrap">
      <span className="font-mono text-[10px] tracking-[1.8px] text-muted uppercase mr-1">
        Filtrer
      </span>
      {chips.map((c, i) => {
        const active = i === 0;
        return (
          <a
            key={c}
            href="#"
            className={`font-sans text-[12px] px-3 py-[7px] border tracking-[0.2px] no-underline transition-all cursor-pointer ${
              active
                ? "bg-ink text-paper border-ink"
                : "bg-transparent text-ink border-rule hover:bg-ink hover:text-paper hover:border-ink"
            }`}
          >
            {c}
          </a>
        );
      })}
    </div>
  );
}
