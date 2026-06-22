import Link from "next/link";
import { auth } from "@/auth";
import { ALL_SECTIONS, sectionUrl } from "@/lib/categories";
import { BrandLogo } from "./BrandLogo";

export async function SiteFooter() {
  const session = await auth();
  const accountItems = [
    { href: "/account", label: "Mon compte" },
    ...(session?.user
      ? []
      : [{ href: "/signin", label: "Se connecter" }]),
  ];

  return (
    <>
      <footer className="border-t border-rule grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 pt-8 pb-5">
        <div>
          <div className="mb-2 -ml-1">
            <BrandLogo size="sm" />
          </div>
          <div className="font-sans text-[12px] text-muted leading-[1.7]">
            Un regard éditorial sur l&apos;IA. Depuis 2026.
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
        <FooterColumn label="Compte" items={accountItems} />
      </footer>
      <div className="border-t border-rule py-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-sans text-[11px] text-muted text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
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
          © {new Date().getFullYear()} · Planète IA
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
