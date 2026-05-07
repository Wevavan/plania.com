"use client";

import { useLayoutEffect, useRef, useState } from "react";

type Props = {
  children: string;
  align?: "left" | "right" | "center";
  italic?: boolean;
  color?: string;
  max?: number;
  min?: number;
};

export function FitLine({
  children,
  align = "left",
  italic = false,
  color,
  max = 160,
  min = 12,
}: Props) {
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [fontSize, setFontSize] = useState<number>(max);

  useLayoutEffect(() => {
    const fit = () => {
      const wrap = wrapRef.current;
      const measure = measureRef.current;
      if (!wrap || !measure) return;
      const cw = wrap.offsetWidth;
      const tw = measure.scrollWidth;
      if (!cw || !tw) return;
      const target = (cw / tw) * 100;
      setFontSize(Math.min(max, Math.max(min, target)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [children, max, min]);

  return (
    <span
      ref={wrapRef}
      style={{
        display: "block",
        textAlign: align,
        lineHeight: 0.92,
        width: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <span
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "nowrap",
          fontSize: 100,
          fontWeight: italic ? 400 : 700,
          fontStyle: italic ? "italic" : "normal",
          letterSpacing: "-0.031em",
          fontFamily: "var(--font-serif)",
          pointerEvents: "none",
          left: -99999,
          top: 0,
        }}
      >
        {children}
      </span>
      <span
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          fontSize,
          fontWeight: italic ? 400 : 700,
          fontStyle: italic ? "italic" : "normal",
          letterSpacing: "-0.031em",
          color: color || "inherit",
          fontFamily: "var(--font-serif)",
        }}
      >
        {children}
      </span>
    </span>
  );
}
