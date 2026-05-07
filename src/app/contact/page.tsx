import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Contact — & Le Quotidien des IA",
  description:
    "Une suggestion, une correction, un sujet à porter à notre attention ?",
};

export default function ContactPage() {
  return (
    <SiteShell activeNav="Contact">
      <article className="py-12 max-w-[780px] mx-auto">
        <span className="font-mono text-[11px] tracking-[2.4px] text-accent font-medium uppercase">
          Contact
        </span>
        <h1 className="font-serif text-[56px] font-bold leading-[1.05] tracking-[-1px] m-0 mt-4 mb-6 balance">
          Une chose à nous dire.
        </h1>
        <p className="text-[19px] leading-[1.55] text-ink-2 m-0 mb-10 max-w-[640px]">
          Une suggestion de sujet, une correction, une fuite, un message à la
          rédaction : utilisez le formulaire ci-dessous. On lit tout, on
          répond aux messages utiles.
        </p>

        <form className="border border-ink p-6 grid gap-5">
          <label className="grid gap-2">
            <span className="font-mono text-[11px] tracking-[1.2px] uppercase text-ink-3">
              Votre nom
            </span>
            <input
              type="text"
              name="name"
              required
              className="w-full bg-transparent border border-rule px-3 py-[10px] font-serif text-[15px] outline-none focus:border-ink"
            />
          </label>

          <label className="grid gap-2">
            <span className="font-mono text-[11px] tracking-[1.2px] uppercase text-ink-3">
              Email
            </span>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-transparent border border-rule px-3 py-[10px] font-serif italic text-[15px] outline-none focus:border-ink"
            />
          </label>

          <label className="grid gap-2">
            <span className="font-mono text-[11px] tracking-[1.2px] uppercase text-ink-3">
              Sujet
            </span>
            <select
              name="subject"
              className="w-full bg-transparent border border-rule px-3 py-[10px] font-sans text-[14px] outline-none focus:border-ink"
            >
              <option>Suggestion de sujet</option>
              <option>Correction / erratum</option>
              <option>Tribune / contribution</option>
              <option>Presse / partenariat</option>
              <option>Autre</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="font-mono text-[11px] tracking-[1.2px] uppercase text-ink-3">
              Message
            </span>
            <textarea
              name="message"
              required
              rows={6}
              className="w-full bg-transparent border border-rule px-3 py-[10px] font-serif text-[15px] outline-none focus:border-ink resize-y"
            />
          </label>

          <button
            type="submit"
            className="bg-ink text-paper font-sans text-[14px] font-medium py-[14px] tracking-[0.2px] hover:bg-accent transition-colors cursor-pointer border-none mt-2"
          >
            Envoyer →
          </button>
          <p className="font-sans text-[11px] text-muted m-0">
            Le formulaire n'envoie rien pour l'instant — on branche ça
            bientôt.
          </p>
        </form>
      </article>
      <SiteFooter />
    </SiteShell>
  );
}
