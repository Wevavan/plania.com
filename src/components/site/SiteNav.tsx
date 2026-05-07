import Link from "next/link";

const LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Intelligence Artificielle", href: "/intelligence-artificielle" },
  { label: "Experts & Marché IA", href: "/experts-marche-ia" },
  { label: "Tutoriels", href: "/tutoriels" },
  { label: "Actualités", href: "/actualites" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

export function SiteNav({ active = "Accueil" }: { active?: string }) {
  return (
    <nav className="flex gap-6 justify-center items-center pt-[10px] pb-[12px] border-b-2 border-ink font-sans text-[13px] flex-wrap">
      {LINKS.map((l) => {
        const isActive = l.label === active;
        return (
          <Link
            key={l.label}
            href={l.href}
            className={`no-underline tracking-[0.2px] pb-[6px] transition-colors hover:text-accent border-b-2 ${
              isActive
                ? "font-semibold text-ink border-accent"
                : "font-normal text-ink-3 border-transparent"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
      <form
        action="/recherche"
        method="get"
        role="search"
        className="ml-auto flex items-center gap-2 border border-rule px-4 py-[8px] hover:border-ink focus-within:border-ink transition-colors min-w-[260px]"
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
