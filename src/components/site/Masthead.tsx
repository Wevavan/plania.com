import { AuthBadge } from "./AuthBadge";

export function Masthead() {
  return (
    <header className="text-center pt-8 pb-5 border-b border-rule">
      <div className="flex justify-between items-center font-sans text-[11px] text-muted tracking-[0.3px] uppercase mb-5">
        <AuthBadge />
        <span />
      </div>
      <h1 className="font-serif text-[78px] font-bold tracking-[-2px] m-0 leading-[0.95]">
        Planète <span className="text-accent">IA</span>
      </h1>
      <div className="flex items-center gap-4 justify-center mt-[18px]">
        <span className="flex-1 max-w-[120px] h-px bg-ink" />
        <span className="italic text-[14px] text-ink-3">
          Un regard éditorial sur l'intelligence artificielle — depuis 2026
        </span>
        <span className="flex-1 max-w-[120px] h-px bg-ink" />
      </div>
    </header>
  );
}
