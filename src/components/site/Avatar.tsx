"use client";

import { useState } from "react";

type Props = {
  src?: string | null;
  initials: string;
  /** Taille du carré (px). Défaut 18. */
  size?: number;
};

export function Avatar({ src, initials, size = 18 }: Props) {
  const [failed, setFailed] = useState(false);
  const shouldShowImage = src && !failed;

  if (shouldShowImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setFailed(true)}
        style={{ width: size, height: size }}
        className="rounded-full object-cover shrink-0"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: Math.max(9, size * 0.55) }}
      className="rounded-full bg-ink text-paper group-hover:bg-paper group-hover:text-ink flex items-center justify-center font-sans font-semibold shrink-0"
    >
      {initials}
    </span>
  );
}
