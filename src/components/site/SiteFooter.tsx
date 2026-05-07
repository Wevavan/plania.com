import Link from "next/link";
import { ALL_SECTIONS, sectionUrl } from "@/lib/categories";

export function SiteFooter() {
  return (
    <>
      <footer className="border-t border-rule grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 pt-8 pb-5">
        <div>
          <div className="font-serif text-[20px] font-bold tracking-[-0.4px] mb-[6px]">
            Planète IA
          </div>
          <div className="font-sans text-[12px] text-muted leading-[1.7]">
            Un regard éditorial sur l'IA. Depuis 2026.
          </div>
        </div>
        <FooterColumn
          label="Sections"
          items={ALL_SECTIONS.map((s) => ({
            href: sectionUrl(s),
            label: s.name,
          }))}
        />
        <FooterColumn
          label="Naviguer"
          items={[
            { href: "/", label: "Accueil" },
            { href: "/recherche", label: "Recherche" },
            { href: "/#newsletter", label: "Newsletter" },
            { href: "/a-propos", label: "À propos" },
            { href: "/contact", label: "Contact" },
          ]}
        />
        <FooterColumn
          label="Compte"
          items={[
            { href: "/account", label: "Mon compte" },
            { href: "/signin", label: "Se connecter" },
          ]}
        />
      </footer>
      <div className="border-t border-rule py-3 flex flex-col md:flex-row items-center justify-between gap-2 font-sans text-[11px] text-muted">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href="/mentions-legales" className="text-muted hover:text-accent transition-colors no-underline">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="text-muted hover:text-accent transition-colors no-underline">
            Confidentialité
          </Link>
          <Link href="/cookies" className="text-muted hover:text-accent transition-colors no-underline">
            Cookies
          </Link>
        </div>
        <div className="font-mono text-[10px] text-muted-2 tracking-[0.4px]">
          © {new Date().getFullYear()} · Planète IA · Composé en Source Serif
        </div>
      </div>
    </>
  );
}

type Item = { href: string; label: string };

function FooterColumn({ label, items }: { label: string; items: Item[] }) {
  return (
    <div>
      <div className="font-sans text-[11px] tracking-[1.8px] uppercase font-semibold text-ink mb-2">
        {label}
      </div>
      <div className="font-sans text-[12px] text-muted leading-[1.7]">
        {items.map((it, i) => (
          <span key={it.href}>
            <Link
              href={it.href}
              className="text-muted no-underline hover:text-accent transition-colors"
            >
              {it.label}
            </Link>
            {i < items.length - 1 ? " · " : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
