import type { Section } from "@/lib/article-body";
import { ReadProgress } from "./ReadProgress";
import { ShareButtons } from "./ShareButtons";

type Props = {
  toc: Section[];
  shareTitle: string;
  shareUrl: string;
};

export function LeftRail({ toc, shareTitle, shareUrl }: Props) {
  return (
    <aside className="flex flex-col gap-8 lg:sticky lg:top-5 self-start">
      {toc.length > 0 && (
        <div>
          <RailHeader>Au sommaire</RailHeader>
          <nav className="flex flex-col">
            {toc.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block py-[10px] border-b border-dashed border-rule no-underline text-ink-3 font-serif text-[14px] leading-[1.3] transition-colors hover:text-accent"
              >
                {s.title}
              </a>
            ))}
          </nav>
        </div>
      )}

      <div>
        <RailHeader>Partager</RailHeader>
        <ShareButtons title={shareTitle} url={shareUrl} />
      </div>

      <div>
        <RailHeader>Lecture</RailHeader>
        <ReadProgress />
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
