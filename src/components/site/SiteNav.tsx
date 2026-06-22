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
import { AuthBadge } from "./AuthBadge";
import { BrandLogo } from "./BrandLogo";

const LINKS: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "Accueil", href: "/", Icon: Home },
  { label: "Actualités", href: "/actualites", Icon: Newspaper },
  { label: "Intelligence Artificielle", href: "/intelligence-artificielle", Icon: Cpu },
  { label: "Experts & Marché IA", href: "/experts-marche-ia", Icon: LineChart },
  { label: "Tutoriels", href: "/tutoriels", Icon: BookOpen },
  { label: "À propos", href: "/a-propos", Icon: Info },
  { label: "Contact", href: "/contact", Icon: Mail },
];

export function SiteNav({ active = "Accueil" }: { active?: string }) {
  return (
    <nav className="flex gap-2 items-center pt-2 pb-2 border-b-2 border-ink font-sans text-[13px] xl:text-[14px]">
      <Link href="/" aria-label="Planète IA — Accueil" className="shrink-0 mr-2">
        <BrandLogo heightClass="h-[88px]" priority />
      </Link>
      <div className="flex items-center gap-1 xl:gap-2 flex-wrap min-w-0">
      {LINKS.map(({ label, href, Icon }) => {
        const isActive = label === active;
        return (
          <Link
            key={label}
            href={href}
            className={`no-underline inline-flex items-center gap-[5px] px-[6px] py-[6px] tracking-[0.2px] transition-all border-b-2 whitespace-nowrap ${
              isActive
                ? "font-bold text-ink border-accent bg-paper-2"
                : "font-semibold text-ink-2 border-transparent hover:bg-accent hover:text-paper hover:border-accent"
            }`}
          >
            <Icon size={16} strokeWidth={2} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
      </div>
      <div className="ml-auto flex items-center gap-3 shrink-0">
        <form
          action="/recherche"
          method="get"
          role="search"
          className="flex items-center gap-2 bg-paper-2 border border-ink pl-4 pr-4 py-[8px] hover:bg-stripe focus-within:border-ink transition-colors w-[220px]"
        >
          <span className="text-[13px] text-muted" aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            name="q"
            placeholder="Rechercher…"
            aria-label="Rechercher"
            className="flex-1 bg-transparent border-none outline-none font-mono text-[12px] text-ink placeholder:text-muted"
          />
        </form>
        <AuthBadge variant="pill" />
      </div>
    </nav>
  );
}
