import Link from "next/link";
import { signOut } from "@/auth";

const NAV = [
  { label: "Tableau de bord", href: "/admin" },
  { label: "Articles", href: "/admin/articles" },
  { label: "Abonnés", href: "/admin/subscribers" },
  { label: "Newsletter", href: "/admin/newsletter/sends" },
];

export function AdminShell({
  children,
  active,
  user,
}: {
  children: React.ReactNode;
  active?: string;
  user: { name?: string | null; email?: string | null };
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-[240px] bg-ink text-paper flex flex-col py-6 px-5 fixed top-0 left-0 h-screen">
        <Link href="/" className="no-underline text-paper">
          <div className="font-serif text-[20px] font-bold tracking-[-0.4px]">
            Planète IA
          </div>
          <div className="font-mono text-[10px] tracking-[2px] uppercase text-accent-warm mt-1">
            Console admin
          </div>
        </Link>

        <nav className="mt-10 flex flex-col gap-1">
          {NAV.map((n) => {
            const isActive = n.label === active;
            return (
              <Link
                key={n.label}
                href={n.href}
                className={`block px-3 py-2 font-sans text-[13px] no-underline transition-colors ${
                  isActive
                    ? "bg-accent text-paper"
                    : "text-rule-2 hover:text-paper hover:bg-accent"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-ink-3">
          <div className="font-serif text-[14px] text-paper mb-1">
            {user.name || user.email}
          </div>
          <div className="font-mono text-[10px] text-rule-2 mb-3 truncate">
            {user.email}
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="font-sans text-[12px] text-rule-2 hover:text-paper underline underline-offset-[3px] cursor-pointer bg-transparent border-none p-0"
            >
              Se déconnecter →
            </button>
          </form>
          <Link
            href="/"
            className="block font-sans text-[12px] text-rule-2 hover:text-paper mt-2 no-underline"
          >
            ← Retour au site
          </Link>
        </div>
      </aside>
      <main className="ml-[240px] flex-1 bg-paper p-12">{children}</main>
    </div>
  );
}
