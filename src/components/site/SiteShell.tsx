import { TopStrip } from "./TopStrip";
import { Masthead } from "./Masthead";
import { SiteNav } from "./SiteNav";

export function SiteShell({
  children,
  activeNav,
}: {
  children: React.ReactNode;
  activeNav?: string;
}) {
  return (
    <div className="max-w-[1600px] mx-auto bg-paper px-[72px] shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
      <TopStrip />
      <Masthead />
      <SiteNav active={activeNav} />
      {children}
    </div>
  );
}
