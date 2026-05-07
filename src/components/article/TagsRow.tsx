import Link from "next/link";

export function TagsRow({ tags }: { tags: string[] }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 items-center py-6">
      <span className="font-mono text-[10px] tracking-[1.8px] uppercase text-muted mr-1">
        Sujets
      </span>
      {tags.map((t) => (
        <Link
          key={t}
          href={`/recherche?q=${encodeURIComponent(t)}`}
          className="px-3 py-[6px] border border-rule font-serif italic text-[13px] text-ink no-underline transition-all hover:bg-ink hover:text-paper hover:border-ink"
        >
          {t}
        </Link>
      ))}
    </div>
  );
}
