import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { SiteShell } from "@/components/site/SiteShell";
import { SiteFooter } from "@/components/site/SiteFooter";

export const dynamic = "force-dynamic";

function initials(name?: string | null): string {
  if (!name) return "·";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
}

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=/account");
  const u = session.user;

  return (
    <SiteShell>
      <div className="py-12 max-w-[640px] mx-auto">
        <span className="font-mono text-[11px] tracking-[2.4px] text-accent font-medium uppercase">
          Mon compte
        </span>
        <h1 className="font-serif text-[44px] font-bold leading-[1.05] tracking-[-0.8px] m-0 mt-4 mb-2 balance">
          {u.name || "Bienvenue."}
        </h1>
        <p className="text-[16px] text-ink-3 m-0 mb-10">
          Connecté en tant que <span className="text-ink">{u.email}</span>.
        </p>

        <div className="border border-rule px-6 py-5 mb-6">
          <div className="flex gap-4 items-center">
            {u.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={u.image}
                alt={u.name || ""}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-ink text-paper flex items-center justify-center font-serif italic text-[20px]">
                {initials(u.name)}
              </div>
            )}
            <div>
              <div className="font-serif text-[18px] font-semibold">
                {u.name || u.email}
              </div>
              <div className="font-sans text-[12px] text-muted">
                Accès illimité aux articles
              </div>
            </div>
          </div>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="border border-ink bg-transparent text-ink font-sans text-[13px] font-medium px-[22px] py-[12px] tracking-[0.3px] hover:bg-ink hover:text-paper transition-colors cursor-pointer"
          >
            Se déconnecter
          </button>
        </form>
      </div>
      <SiteFooter />
    </SiteShell>
  );
}
