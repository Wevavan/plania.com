import { SiteNav } from "./SiteNav";

export function SiteShell({
  children,
  activeNav,
  masthead,
}: {
  children: React.ReactNode;
  activeNav?: string;
  /** Bandeau optionnel sous la nav. Aucun par défaut (le logo est dans la nav). */
  masthead?: React.ReactNode;
}) {
  return (
    <div className="max-w-[1920px] mx-auto bg-paper px-[80px] shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
      <SiteNav active={activeNav} />
      {masthead}
      {children}
    </div>
  );
}
