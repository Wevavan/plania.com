"use client";

import { useState } from "react";

type Props = { title: string; url: string };

export function ShareButtons({ title, url }: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const encUrl = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);
  const composedText = `${title} — ${url}`;
  const encComposed = encodeURIComponent(composedText);

  async function copyTo(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      // Clipboard refused (older browsers / no permission)
    }
  }

  function handlePrint() {
    window.print();
  }

  const cls =
    "px-[10px] py-2 border border-rule font-sans text-[11px] text-ink text-center tracking-[0.2px] hover:bg-ink hover:text-paper hover:border-ink transition-all cursor-pointer no-underline block w-full";

  return (
    <div className="grid grid-cols-2 gap-[6px]">
      <button
        type="button"
        onClick={() => copyTo("link", url)}
        className={cls}
      >
        {copiedKey === "link" ? "✓ Copié" : "Copier le lien"}
      </button>

      <a
        href={url ? `mailto:?subject=${encTitle}&body=${encUrl}` : "#"}
        className={cls}
      >
        Par courriel
      </a>

      <button
        type="button"
        onClick={() => copyTo("masto", composedText)}
        className={cls}
      >
        {copiedKey === "masto" ? "✓ Copié" : "Mastodon"}
      </button>

      <a
        href={
          url ? `https://bsky.app/intent/compose?text=${encComposed}` : "#"
        }
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
      >
        Bluesky
      </a>

      <a
        href={
          url
            ? `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`
            : "#"
        }
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
      >
        LinkedIn
      </a>

      <button type="button" onClick={handlePrint} className={cls}>
        Imprimer
      </button>
    </div>
  );
}
