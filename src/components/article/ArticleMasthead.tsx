import Link from "next/link";
import { TopStrip } from "@/components/site/TopStrip";
import { AuthBadge } from "@/components/site/AuthBadge";

const NAV = [
  { label: "Accueil", href: "/" },
  { label: "Intelligence Artificielle", href: "/intelligence-artificielle" },
  { label: "Experts & Marché IA", href: "/experts-marche-ia" },
  { label: "Tutoriels", href: "/tutoriels" },
  { label: "Actualités", href: "/actualites" },
];

export function ArticleMasthead({
  activeCategory,
}: {
  activeCategory?: string;
}) {
  return (
    <>
      <TopStrip />
      <header className="flex justify-between items-center py-[18px] border-b-2 border-ink flex-wrap gap-4">
        <Link href="/" className="no-underline text-inherit">
          <span className="font-serif text-[26px] font-bold tracking-[-0.6px]">
            Planète IA
          </span>
        </Link>
        <div className="flex gap-5 items-center font-sans text-[13px] flex-wrap">
          {NAV.map((n) => {
            const isActive = n.label === activeCategory;
            return (
              <Link
                key={n.label}
                href={n.href}
                className={`no-underline tracking-[0.2px] hover:text-accent transition-colors ${
                  isActive ? "text-ink font-semibold" : "text-ink-3"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
          <span className="ml-2">
            <AuthBadge variant="pill" />
          </span>
        </div>
      </header>
    </>
  );
}
