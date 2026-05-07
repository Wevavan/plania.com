"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const COOKIE_NAME = "pi_cookie_consent";
const COOKIE_DAYS = 180;

function readConsent(): "accepted" | "refused" | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`)
  );
  if (!match) return null;
  const v = decodeURIComponent(match[1]);
  return v === "accepted" || v === "refused" ? v : null;
}

function writeConsent(value: "accepted" | "refused") {
  const d = new Date();
  d.setTime(d.getTime() + COOKIE_DAYS * 24 * 60 * 60 * 1000);
  document.cookie = `${COOKIE_NAME}=${value}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
}

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (readConsent() === null) setShow(true);
  }, []);

  if (!show) return null;

  function dismiss(value: "accepted" | "refused") {
    writeConsent(value);
    setShow(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:max-w-[460px] z-50 bg-paper border border-ink p-5 shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
    >
      <div className="font-mono text-[10px] tracking-[2px] uppercase text-accent font-medium mb-2">
        Cookies
      </div>
      <p className="font-serif text-[14px] leading-[1.5] text-ink m-0 mb-4">
        Nous utilisons uniquement des cookies essentiels au fonctionnement du
        site (session, authentification). Aucun traceur publicitaire.{" "}
        <Link
          href="/cookies"
          className="text-accent underline underline-offset-[3px]"
        >
          En savoir plus
        </Link>
        .
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => dismiss("refused")}
          className="flex-1 border border-rule font-sans text-[12px] py-[10px] hover:border-ink transition-colors cursor-pointer"
        >
          Refuser
        </button>
        <button
          type="button"
          onClick={() => dismiss("accepted")}
          className="flex-1 bg-ink text-paper font-sans text-[12px] font-semibold py-[10px] hover:bg-accent transition-colors cursor-pointer border-none"
        >
          Accepter
        </button>
      </div>
    </div>
  );
}
