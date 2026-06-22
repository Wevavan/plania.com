"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Tracker analytics first-party (cookieless).
 * Envoie une page vue à chaque changement de route, sans cookie ni stockage
 * local. L'admin n'est pas traqué. La pseudonymisation est faite côté serveur.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (last.current === pathname) return;
    last.current = pathname;

    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer || "",
    });

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/analytics/collect",
          new Blob([payload], { type: "application/json" })
        );
      } else {
        fetch("/api/analytics/collect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        });
      }
    } catch {
      // silencieux : l'analytics ne doit jamais casser la navigation
    }
  }, [pathname]);

  return null;
}
