"use client";

import { useActionState } from "react";
import { sendContactMessage, type ContactState } from "@/app/contact/actions";

const initialState: ContactState = { status: "idle" };

export function ContactForm() {
  const [state, action, pending] = useActionState(
    sendContactMessage,
    initialState
  );

  if (state.status === "ok") {
    return (
      <div className="border border-ink p-6 bg-stripe">
        <div className="font-mono text-[11px] tracking-[1.8px] uppercase text-accent font-medium mb-2">
          ✓ Message envoyé
        </div>
        <p className="font-serif text-[16px] leading-[1.55] text-ink m-0">
          Merci, votre message est arrivé. Nous lisons tout, nous répondons aux
          messages utiles.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="border border-ink p-6 grid gap-5">
      {/* Honeypot anti-bot : invisible aux humains, rempli par les robots */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label>
          Site web (laisser vide)
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="font-mono text-[11px] tracking-[1.2px] uppercase text-ink-3">
          Votre nom
        </span>
        <input
          type="text"
          name="name"
          required
          maxLength={120}
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
          maxLength={200}
          className="w-full bg-transparent border border-rule px-3 py-[10px] font-serif italic text-[15px] outline-none focus:border-ink"
        />
      </label>

      <label className="grid gap-2">
        <span className="font-mono text-[11px] tracking-[1.2px] uppercase text-ink-3">
          Sujet
        </span>
        <select
          name="subject"
          defaultValue="Suggestion de sujet"
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
          minLength={10}
          maxLength={10000}
          className="w-full bg-transparent border border-rule px-3 py-[10px] font-serif text-[15px] outline-none focus:border-ink resize-y"
        />
      </label>

      {state.status === "error" && (
        <div className="font-sans text-[13px] text-accent border-l-2 border-accent pl-3">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-ink text-paper font-sans text-[14px] font-medium py-[14px] tracking-[0.2px] hover:bg-accent transition-colors cursor-pointer border-none mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Envoi en cours…" : "Envoyer →"}
      </button>
      <p className="font-sans text-[11px] text-muted m-0">
        En envoyant ce message, vous acceptez notre{" "}
        <a
          href="/confidentialite"
          className="underline underline-offset-[3px]"
        >
          politique de confidentialité
        </a>
        .
      </p>
    </form>
  );
}
