"use client";

import { useEffect, useRef, useState } from "react";

type Kind = "hero" | "thumbnail";

type Props = {
  /** Nom du champ caché qui transmettra l'URL au formulaire parent */
  urlName: string;
  /** Nom du champ alt text */
  altName: string;
  /** Type d'upload (Cloudinary range les fichiers dans linfoia/<kind>) */
  kind: Kind;
  /** Valeurs initiales (pour l'édition) */
  defaultUrl?: string;
  defaultAlt?: string;
  /** Aspect ratio de l'aperçu */
  aspect?: string;
  /** Label affiché */
  label: string;
};

export function ImageUpload({
  urlName,
  altName,
  kind,
  defaultUrl = "",
  defaultAlt = "",
  aspect = "16 / 9",
  label,
}: Props) {
  const [url, setUrl] = useState(defaultUrl);
  const [alt, setAlt] = useState(defaultAlt);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Aperçu immédiat avant l'upload (depuis le File local)
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function handleFile(file: File) {
    setError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Upload échoué.");
      }
      setUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'upload.");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  }

  function clearImage() {
    setUrl("");
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const displayed = preview || url;

  return (
    <div className="space-y-3">
      <div className="font-sans text-[11px] tracking-[1.2px] uppercase text-ink-3 mb-1">
        {label}
      </div>

      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border border-rule p-3 bg-paper-2 hover:border-ink transition-colors"
      >
        {displayed ? (
          <div className="relative" style={{ aspectRatio: aspect }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayed}
              alt={alt || ""}
              className="w-full h-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-ink/40 flex items-center justify-center">
                <span className="font-mono text-[12px] tracking-[1.5px] text-paper uppercase">
                  Upload en cours…
                </span>
              </div>
            )}
            {!uploading && (
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="font-sans text-[11px] bg-paper text-ink border border-ink px-3 py-1 hover:bg-ink hover:text-paper transition-colors cursor-pointer"
                >
                  Remplacer
                </button>
                <button
                  type="button"
                  onClick={clearImage}
                  className="font-sans text-[11px] bg-paper text-accent border border-accent px-3 py-1 hover:bg-accent hover:text-paper transition-colors cursor-pointer"
                >
                  Retirer
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center bg-transparent border-2 border-dashed border-rule-2 hover:border-ink transition-colors py-12 cursor-pointer"
          >
            <span className="font-mono text-[11px] tracking-[1.5px] uppercase text-muted mb-1">
              {uploading ? "Upload en cours…" : "Glisser une image ici"}
            </span>
            <span className="font-sans text-[12px] text-muted-2">
              ou cliquer pour parcourir · JPG, PNG, WebP · max 10 Mo
            </span>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          onChange={onChange}
          className="hidden"
        />
      </div>

      {error && (
        <div className="font-sans text-[12px] text-accent">{error}</div>
      )}

      {/* URL stockée (champ visible mais en mode lecture pour transparence) */}
      <div>
        <label className="block">
          <span className="font-sans text-[10px] tracking-[1px] uppercase text-muted mb-1 block">
            URL Cloudinary
          </span>
          <input
            type="text"
            name={urlName}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            readOnly={uploading}
            placeholder="(générée automatiquement après upload)"
            className="w-full bg-transparent border border-rule px-3 py-2 font-mono text-[12px] text-muted outline-none focus:border-ink"
          />
        </label>
      </div>

      <div>
        <label className="block">
          <span className="font-sans text-[10px] tracking-[1px] uppercase text-muted mb-1 block">
            Texte alternatif (alt) <span className="text-accent">*</span>
          </span>
          <input
            type="text"
            name={altName}
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Description de l'image pour les lecteurs d'écran et le SEO"
            className="w-full bg-transparent border border-rule px-3 py-2 font-serif text-[14px] outline-none focus:border-ink"
          />
        </label>
      </div>
    </div>
  );
}
