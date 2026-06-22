import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { SiteShell } from "@/components/site/SiteShell";
import { SiteFooter } from "@/components/site/SiteFooter";

export const dynamic = "force-dynamic";

const HAS_GOOGLE = !!(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
);
const HAS_EMAIL = !!process.env.AUTH_RESEND_KEY;

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/account");

  const sp = await searchParams;
  const callbackUrl = sp.callbackUrl || "/";
  const error = sp.error;

  return (
    <SiteShell>
      <div className="py-16 max-w-[480px] mx-auto">
        <span className="font-mono text-[11px] tracking-[2.4px] text-accent font-medium uppercase">
          Connexion
        </span>
        <h1 className="font-serif text-[44px] font-bold leading-[1.05] tracking-[-0.8px] m-0 mt-4 mb-3 balance">
          Bienvenue.
        </h1>
        <p className="text-[17px] leading-[1.55] text-ink-2 m-0 mb-8 pretty">
          Connectez-vous pour lire l'intégralité des articles. Aucun mot de
          passe à retenir : Google, ou un lien envoyé par email.
        </p>

        {error && (
          <div className="border border-accent text-accent px-4 py-3 mb-6 font-sans text-[13px]">
            Une erreur s'est produite : {error}. Réessayez.
          </div>
        )}

        {HAS_GOOGLE && (
          <form
            className="mb-6"
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: callbackUrl });
            }}
          >
            <button
              type="submit"
              className="w-full border border-ink bg-paper text-ink font-sans text-[14px] font-medium py-[14px] tracking-[0.3px] hover:bg-accent hover:text-paper transition-colors cursor-pointer"
            >
              Continuer avec Google
            </button>
          </form>
        )}

        {HAS_GOOGLE && HAS_EMAIL && (
          <div className="flex items-center gap-4 my-6">
            <span className="flex-1 h-px bg-rule" />
            <span className="font-mono text-[10px] tracking-[1.8px] uppercase text-muted">
              ou
            </span>
            <span className="flex-1 h-px bg-rule" />
          </div>
        )}

        {HAS_EMAIL && (
          <form
            action={async (formData: FormData) => {
              "use server";
              const email = String(formData.get("email") || "").trim();
              if (!email) return;
              await signIn("resend", {
                email,
                redirectTo: callbackUrl,
              });
            }}
          >
            <label className="font-sans text-[12px] tracking-[1.2px] uppercase text-ink-3 mb-2 block">
              Recevoir un lien par email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="vous@exemple.fr"
              className="w-full border border-rule bg-transparent px-4 py-[12px] font-serif italic text-[15px] text-ink outline-none focus:border-ink"
            />
            <button
              type="submit"
              className="w-full border-none bg-ink text-paper font-sans text-[14px] font-medium py-[14px] mt-3 tracking-[0.3px] hover:bg-accent transition-colors cursor-pointer"
            >
              M'envoyer le lien →
            </button>
          </form>
        )}

        {!HAS_GOOGLE && !HAS_EMAIL && (
          <div className="border border-rule p-6 text-ink-3">
            <p className="font-sans text-[13px] m-0">
              Aucun fournisseur d'authentification n'est configuré. Renseignez{" "}
              <code className="font-mono text-[12px]">AUTH_GOOGLE_ID</code> /{" "}
              <code className="font-mono text-[12px]">AUTH_GOOGLE_SECRET</code>{" "}
              et/ou <code className="font-mono text-[12px]">AUTH_RESEND_KEY</code>{" "}
              dans <code className="font-mono text-[12px]">.env.local</code>.
            </p>
          </div>
        )}

        <p className="font-sans text-[12px] text-muted mt-8 leading-[1.6]">
          La connexion sert uniquement à débloquer la lecture complète des
          articles. Aucune donnée n'est partagée. Désinscription en un clic
          depuis la page <em className="not-italic underline">Mon compte</em>.
        </p>
      </div>
      <SiteFooter />
    </SiteShell>
  );
}
