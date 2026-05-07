"use client";

import { useEffect, useState } from "react";

export function ReadProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const update = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      if (total <= 0) {
        setPct(0);
        return;
      }
      const scrolled = Math.max(0, Math.min(1, h.scrollTop / total));
      setPct(Math.round(scrolled * 100));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div>
      <div className="h-[2px] bg-rule mb-2">
        <span
          className="block h-full bg-accent transition-[width] duration-150"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between font-sans text-[11px] text-muted">
        <span>Progression</span>
        <span className="font-mono text-ink">{pct} %</span>
      </div>
    </div>
  );
}
