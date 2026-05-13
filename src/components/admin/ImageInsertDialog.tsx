"use client";

import { useEffect, useRef, useState } from "react";

type Position = "center" | "left" | "right";
type Width = "small" | "medium" | "large" | "full";

type Props = {
  open: boolean;
  onClose: () => void;
  onInsert: (html: string) => void;
};

const POSITIONS: { value: Position; label: string; help: string }[] = [
  { value: "center", label: "Centré", help: "Image seule, centrée. Pas d'enroulement." },
  { value: "left", label: "Aligné à gauche", help: "Le texte s'enroule à droite." },
  { value: "right", label: "Aligné à droite", help: "Le texte s'enroule à gauche." },
];

const WIDTHS: { value: Width; label: string }[] = [
  { value: "small", label: "Petite (40 %)" },
  { value: "medium", label: "Moyenne (60 %)" },
  { value: "large", label: "Grande (80 %)" },
  { value: "full", label: "Pleine largeur (100 %)" },
];

export function ImageInsertDialog({ open, onClose, onInsert }: Props) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [position, setPosition] = useState<Position>("center");
  const [width, setWidth] = useState<Width>("large");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Reset à l'ouverture
  useEffect(() => {
    if (open) {
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", "hero");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload échoué.");
      setUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'upload.");
    } finally {
      setUploading(false);
    }
  }

  function handleInsert() {
    setError(null);
    if (!url.trim()) {
      setError("URL d'image requise.");
      return;
    }
    if (!alt.trim()) {
      setError("Le texte alternatif est requis (accessibilité).");
      return;
    }

    const escUrl = escapeHtml(url.trim());
    const escAlt = escapeHtml(alt.trim());
    const escCaption = caption.trim() ? escapeHtml(caption.trim()) : "";

    // Pour les positions left/right, on ignore width (le float impose la taille)
    const widthAttr = position === "center" ? ` data-width="${width}"` : "";

    const html = `<figure class="article-image" data-position="${position}"${widthAttr}>
  <img src="${escUrl}" alt="${escAlt}" />
${escCaption ? `  <figcaption>${escCaption}</figcaption>\n` : ""}</figure>`;

    onInsert(html);
    // Reset
    setUrl("");
    setAlt("");
    setCaption("");
    setPosition("center");
    setWidth("large");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-ink/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-paper border border-ink max-w-[640px] w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-rule px-6 py-4 flex justify-between items-center">
          <h3 className="font-serif text-[20px] font-bold m-0">
            Insérer une image
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[11px] tracking-[1.5px] uppercase text-muted hover:text-ink cursor-pointer bg-transparent border-none"
          >
            Fermer ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Upload ou URL */}
          <div>
            <label className="block">
              <span className="font-mono text-[10px] tracking-[1.2px] uppercase text-ink-3 mb-2 block">
                Choisir un fichier ou coller une URL
              </span>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
                disabled={uploading}
                className="block w-full font-sans text-[13px] file:mr-4 file:py-2 file:px-4 file:border file:border-ink file:bg-paper file:text-ink file:font-medium file:cursor-pointer file:hover:bg-ink file:hover:text-paper file:transition-colors"
              />
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              className="w-full mt-3 bg-transparent border border-rule px-3 py-2 font-mono text-[12px] outline-none focus:border-ink"
            />
            {uploading && (
              <p className="font-mono text-[11px] text-accent mt-2">
                Upload en cours…
              </p>
            )}
          </div>

          {/* Aperçu */}
          {url && (
            <div className="border border-rule">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={alt || "aperçu"}
                className="w-full h-auto max-h-[280px] object-contain bg-stripe"
              />
            </div>
          )}

          {/* Alt text */}
          <label className="block">
            <span className="font-mono text-[10px] tracking-[1.2px] uppercase text-ink-3 mb-2 block">
              Texte alternatif (alt) <span className="text-accent">*</span>
            </span>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Description courte de ce qu'on voit sur l'image"
              className="w-full bg-transparent border border-rule px-3 py-2 font-serif text-[14px] outline-none focus:border-ink"
            />
          </label>

          {/* Caption */}
          <label className="block">
            <span className="font-mono text-[10px] tracking-[1.2px] uppercase text-ink-3 mb-2 block">
              Légende (optionnelle)
            </span>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Apparaît en italique sous l'image"
              className="w-full bg-transparent border border-rule px-3 py-2 font-serif text-[14px] outline-none focus:border-ink"
            />
          </label>

          {/* Position */}
          <div>
            <span className="font-mono text-[10px] tracking-[1.2px] uppercase text-ink-3 mb-2 block">
              Position
            </span>
            <div className="grid grid-cols-3 gap-2">
              {POSITIONS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPosition(p.value)}
                  className={`px-3 py-2 font-sans text-[12px] border transition-colors cursor-pointer ${
                    position === p.value
                      ? "bg-ink text-paper border-ink"
                      : "bg-transparent text-ink border-rule hover:border-ink"
                  }`}
                  title={p.help}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Width - visible uniquement pour center */}
          {position === "center" && (
            <div>
              <span className="font-mono text-[10px] tracking-[1.2px] uppercase text-ink-3 mb-2 block">
                Taille
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {WIDTHS.map((w) => (
                  <button
                    key={w.value}
                    type="button"
                    onClick={() => setWidth(w.value)}
                    className={`px-3 py-2 font-sans text-[12px] border transition-colors cursor-pointer ${
                      width === w.value
                        ? "bg-ink text-paper border-ink"
                        : "bg-transparent text-ink border-rule hover:border-ink"
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="font-sans text-[12px] text-accent">{error}</div>
          )}
        </div>

        <div className="border-t border-rule px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="font-sans text-[13px] text-ink-3 underline underline-offset-[3px] cursor-pointer bg-transparent border-none"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleInsert}
            disabled={uploading}
            className="bg-ink text-paper font-sans text-[13px] font-medium px-5 py-[10px] hover:bg-accent transition-colors cursor-pointer border-none disabled:opacity-50"
          >
            Insérer →
          </button>
        </div>
      </div>
    </div>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
