import type { TocItem } from "@/lib/article-html";
import { ReadProgress } from "./ReadProgress";
import { ShareButtons } from "./ShareButtons";

type Props = {
  toc: TocItem[];
  shareTitle: string;
  shareUrl: string;
};

export function LeftRail({ toc, shareTitle, shareUrl }: Props) {
  return (
    <aside className="flex flex-col gap-8 lg:sticky lg:top-5 self-start">
      {toc.length > 0 && (
        <div>
          <RailHeader>Au sommaire</RailHeader>
          <nav className="flex flex-col gap-px">
            {toc.map((s) =>
              s.level === 2 ? (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block py-[3px] no-underline text-ink font-serif font-medium text-[12px] leading-[1.25] transition-colors hover:text-accent"
                >
                  {s.title}
                </a>
              ) : (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex gap-[6px] py-[2px] pl-3 no-underline text-ink-3 font-serif text-[11px] leading-[1.2] transition-colors hover:text-accent"
                >
                  <span className="text-rule-2 select-none">└</span>
                  <span>{s.title}</span>
                </a>
              )
            )}
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
