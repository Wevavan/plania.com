import Link from "next/link";
import {
  Home,
  Cpu,
  LineChart,
  BookOpen,
  Newspaper,
  Info,
  Mail,
  type LucideIcon,
} from "lucide-react";

const LINKS: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "Accueil", href: "/", Icon: Home },
  { label: "Intelligence Artificielle", href: "/intelligence-artificielle", Icon: Cpu },
  { label: "Experts & Marché IA", href: "/experts-marche-ia", Icon: LineChart },
  { label: "Tutoriels", href: "/tutoriels", Icon: BookOpen },
  { label: "Actualités", href: "/actualites", Icon: Newspaper },
  { label: "À propos", href: "/a-propos", Icon: Info },
  { label: "Contact", href: "/contact", Icon: Mail },
];

export function SiteNav({ active = "Accueil" }: { active?: string }) {
  return (
    <nav className="flex gap-3 lg:gap-4 justify-center items-center pt-4 pb-4 border-b-2 border-ink font-sans text-[15px] flex-wrap">
      {LINKS.map(({ label, href, Icon }) => {
        const isActive = label === active;
        return (
          <Link
            key={label}
            href={href}
            className={`no-underline inline-flex items-center gap-2 px-3 py-[8px] tracking-[0.2px] transition-all border-b-2 ${
              isActive
                ? "font-bold text-ink border-accent bg-paper-2"
                : "font-semibold text-ink-2 border-transparent hover:bg-ink hover:text-paper hover:border-ink"
            }`}
          >
            <Icon size={18} strokeWidth={2} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
      <form
        action="/recherche"
        method="get"
        role="search"
        className="ml-auto flex items-center gap-2 border border-rule px-4 py-[10px] hover:border-ink focus-within:border-ink transition-colors min-w-[260px]"
      >
        <span className="text-[14px] text-muted" aria-hidden="true">
          ⌕
        </span>
        <input
          type="search"
          name="q"
          placeholder="Rechercher un article…"
          aria-label="Rechercher"
          className="flex-1 bg-transparent border-none outline-none font-mono text-[12px] text-ink placeholder:text-muted"
        />
      </form>
    </nav>
  );
}
