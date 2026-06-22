import Link from "next/link";
import { LogIn } from "lucide-react";
import { auth } from "@/auth";
import { Avatar } from "./Avatar";

function initials(name?: string | null, email?: string | null): string {
  const src = name || email || "·";
  return src
    .split(/[\s@.]+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type Variant = "header" | "pill";

export async function AuthBadge({ variant = "header" }: { variant?: Variant }) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    // Variante "pill" (barre de nav) : bouton-icône compact, même empreinte que
    // la pastille avatar → le header reste sur une seule ligne, connecté ou non.
    if (variant === "pill") {
      return (
        <Link
          href="/signin"
          aria-label="Se connecter"
          title="Se connecter"
          className="flex items-center justify-center border border-ink px-[9px] py-[9px] text-ink no-underline hover:bg-accent hover:text-paper transition-colors"
        >
          <LogIn size={18} strokeWidth={2} aria-hidden="true" />
        </Link>
      );
    }
    return (
      <Link
        href="/signin"
        className="border border-ink px-[10px] py-[4px] text-ink tracking-[0.6px] text-[10px] uppercase no-underline hover:bg-accent hover:text-paper transition-colors"
      >
        Se connecter
      </Link>
    );
  }

  return (
    <Link
      href="/account"
      className={
        variant === "pill"
          ? "flex items-center border border-ink px-[7px] py-[9px] text-ink no-underline hover:bg-accent hover:text-paper transition-colors group"
          : "flex items-center gap-[6px] border border-ink px-[10px] py-[3px] text-ink tracking-[0.4px] text-[10px] uppercase no-underline hover:bg-accent hover:text-paper transition-colors group"
      }
      title={user.email || undefined}
    >
      <Avatar
        src={user.image}
        initials={initials(user.name, user.email)}
        size={18}
      />
      {variant !== "pill" && (
        <span className="normal-case font-medium">
          {user.name?.split(" ")[0] || user.email?.split("@")[0]}
        </span>
      )}
    </Link>
  );
}
