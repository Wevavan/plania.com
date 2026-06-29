import { SiteNav } from "@/components/site/SiteNav";

export function ArticleShell({
  children,
  activeCategory,
}: {
  children: React.ReactNode;
  activeCategory?: string;
}) {
  return (
    <div className="max-w-[1920px] mx-auto bg-paper px-[80px] shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
      <SiteNav active={activeCategory} />
      {children}
    </div>
  );
}
