import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
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

        <ContactForm />
      </article>
      <SiteFooter />
    </SiteShell>
  );
}
