"use client";

import { useState } from "react";
import { ALL_CATEGORIES } from "@/lib/categories";
import { MarkdownEditor } from "./MarkdownEditor";
import { ImageUpload } from "./ImageUpload";

const KICKERS = [
  "ANALYSE",
  "ENQUÊTE",
  "DÉCRYPTAGE",
  "REPORTAGE",
  "TRIBUNE",
  "PORTRAIT",
  "ENTRETIEN",
  "TEST",
  "COMPARATIF",
  "INVESTIGATION",
  "DATA",
  "ARCHIVE",
  "RECHERCHE",
  "BRÈVE",
];

type Initial = {
  slug?: string;
  title?: string;
  titleTrail?: string;
  kicker?: string;
  category?: string;
  dek?: string;
  body?: string;
  author?: string;
  authorBeat?: string;
  authorBio?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
  imageCredit?: string;
  thumbnailUrl?: string;
  thumbnailAlt?: string;
  readTime?: string;
  tags?: string[];
  featured?: boolean;
  secondary?: boolean;
  status?: "draft" | "published";
  publishedAt?: string;
};

type Props = {
  action: (fd: FormData) => Promise<void>;
  deleteAction?: () => Promise<void>;
  initial?: Initial;
  mode: "create" | "edit";
  saved?: boolean;
};

function toLocalDateTime(iso?: string): string {
  if (!iso) {
    const d = new Date();
    d.setSeconds(0, 0);
    return d.toISOString().slice(0, 16);
  }
  const d = new Date(iso);
  const tz = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 16);
}

export function ArticleForm({
  action,
  deleteAction,
  initial = {},
  mode,
  saved = false,
}: Props) {
  const [title, setTitle] = useState(initial.title || "");
  const [slug, setSlug] = useState(initial.slug || "");
  const [slugTouched, setSlugTouched] = useState(!!initial.slug);

  function autoSlug(t: string) {
    return t
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 90);
  }

  return (
    <form action={action} className="space-y-8">
      {saved && (
        <div className="bg-stripe border border-ink px-4 py-3 font-sans text-[13px] text-ink">
          ✓ Enregistré.
        </div>
      )}

      {/* Métadonnées éditoriales */}
      <Section title="Édition">
        <Row>
          <Field label="Titre" required>
            <input
              name="title"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(autoSlug(e.target.value));
              }}
              className="form-input"
              placeholder="Claude 5 Sonnet : ce que change la mise à jour"
            />
          </Field>
          <Field label="Slug (URL)">
            <input
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              className="form-input font-mono text-[13px]"
              placeholder="claude-5-sonnet-sortie"
            />
          </Field>
        </Row>
        <Field label="Titre italique (suite, optionnel)">
          <input
            name="titleTrail"
            defaultValue={initial.titleTrail || ""}
            className="form-input"
            placeholder="Elle ne sait toujours pas comment."
          />
        </Field>
        <Field label="Standfirst (chapeau)">
          <textarea
            name="dek"
            rows={3}
            defaultValue={initial.dek || ""}
            className="form-input"
            placeholder="Une étude menée sur dix-huit mois révèle…"
          />
        </Field>
      </Section>

      {/* Classification */}
      <Section title="Classification">
        <Row>
          <Field label="Kicker (genre)" required>
            <select
              name="kicker"
              defaultValue={initial.kicker || "ANALYSE"}
              className="form-input"
            >
              {KICKERS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Rubrique" required>
            <select
              name="category"
              defaultValue={initial.category || "Claude AI"}
              className="form-input"
            >
              {ALL_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Temps de lecture">
            <input
              name="readTime"
              defaultValue={initial.readTime || ""}
              className="form-input"
              placeholder="8 min"
            />
          </Field>
        </Row>
        <Field label="Tags (séparés par virgules)">
          <input
            name="tags"
            defaultValue={(initial.tags || []).join(", ")}
            className="form-input"
            placeholder="Claude 5, Anthropic, Computer use"
          />
        </Field>
      </Section>

      {/* Images */}
      <Section title="Image principale (hero — page article)">
        <ImageUpload
          urlName="imageUrl"
          altName="imageAlt"
          kind="hero"
          defaultUrl={initial.imageUrl || ""}
          defaultAlt={initial.imageAlt || ""}
          aspect="21 / 9"
          label="Format conseillé : panoramique 21:9 (au moins 1600 × 690 px)"
        />
        <Row>
          <Field label="Légende">
            <input
              name="imageCaption"
              defaultValue={initial.imageCaption || ""}
              className="form-input"
              placeholder="Le Capitole de Sacramento, le 1ᵉʳ avril 2026."
            />
          </Field>
          <Field label="Crédit">
            <input
              name="imageCredit"
              defaultValue={initial.imageCredit || ""}
              className="form-input"
              placeholder="Archives / Miguel Rossi"
            />
          </Field>
        </Row>
      </Section>

      <Section title="Image vignette (galeries · listes · cartes)">
        <ImageUpload
          urlName="thumbnailUrl"
          altName="thumbnailAlt"
          kind="thumbnail"
          defaultUrl={initial.thumbnailUrl || ""}
          defaultAlt={initial.thumbnailAlt || ""}
          aspect="4 / 3"
          label="Format conseillé : 4:3 (au moins 800 × 600 px). Si vide, on utilisera l'image hero."
        />
      </Section>

      {/* Auteur */}
      <Section title="Signature (optionnel)">
        <Row>
          <Field label="Nom (utilisé en interne)">
            <input
              name="author"
              defaultValue={initial.author || "& Le Quotidien des IA"}
              className="form-input"
            />
          </Field>
          <Field label="Beat (sujet de prédilection)">
            <input
              name="authorBeat"
              defaultValue={initial.authorBeat || ""}
              className="form-input"
              placeholder="Bureau Claude · suivi des sorties Anthropic"
            />
          </Field>
        </Row>
        <Field label="Bio">
          <textarea
            name="authorBio"
            rows={2}
            defaultValue={initial.authorBio || ""}
            className="form-input"
          />
        </Field>
      </Section>

      {/* Corps */}
      <Section title="Corps de l'article">
        <p className="font-sans text-[12px] text-muted mb-3">
          Markdown supporté : <code>## Titre</code> pour une section,{" "}
          <code>**gras**</code>, <code>*italique*</code>,{" "}
          <code>[texte](url)</code>, et <code>&gt; Citation</code> avec une
          ligne <code>— Source</code>. Le premier paragraphe devient l'intro
          avec drop cap.
        </p>
        <MarkdownEditor name="body" defaultValue={initial.body || ""} />
      </Section>

      {/* Mise en avant */}
      <Section title="Mise en avant">
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 font-sans text-[13px] text-ink cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={!!initial.featured}
              className="accent-accent"
            />
            <span>
              <strong>Article principal</strong> (le « hero » de l'accueil)
            </span>
          </label>
          <label className="flex items-center gap-3 font-sans text-[13px] text-ink cursor-pointer">
            <input
              type="checkbox"
              name="secondary"
              defaultChecked={!!initial.secondary}
              className="accent-accent"
            />
            <span>
              <strong>Article secondaire</strong> (sidebar « Également à la une
              »)
            </span>
          </label>
        </div>
      </Section>

      {/* Statut & publication */}
      <Section title="Publication">
        <Row>
          <Field label="Statut" required>
            <select
              name="status"
              defaultValue={initial.status || "draft"}
              className="form-input"
            >
              <option value="draft">Brouillon (invisible)</option>
              <option value="published">Publié</option>
            </select>
          </Field>
          <Field label="Date de publication">
            <input
              type="datetime-local"
              name="publishedAt"
              defaultValue={toLocalDateTime(initial.publishedAt)}
              className="form-input font-mono text-[13px]"
            />
          </Field>
        </Row>
        <p className="font-sans text-[12px] text-muted">
          Si <strong>Statut = Publié</strong> et la date est dans le futur,
          l'article est <em>programmé</em> et n'apparaît qu'à cette date.
        </p>
      </Section>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 pt-6 border-t border-rule">
        <div>
          {mode === "edit" && deleteAction && (
            <form action={deleteAction}>
              <button
                type="submit"
                className="font-sans text-[13px] text-accent border border-accent px-4 py-[10px] hover:bg-accent hover:text-paper transition-colors cursor-pointer"
                onClick={(e) => {
                  if (!confirm("Supprimer définitivement cet article ?")) {
                    e.preventDefault();
                  }
                }}
              >
                Supprimer
              </button>
            </form>
          )}
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/admin/articles"
            className="font-sans text-[13px] text-ink-3 underline underline-offset-[3px]"
          >
            Annuler
          </a>
          <button
            type="submit"
            className="bg-ink text-paper font-sans text-[13px] font-medium px-6 py-[12px] hover:bg-accent transition-colors cursor-pointer border-none"
          >
            {mode === "create" ? "Créer l'article →" : "Enregistrer →"}
          </button>
        </div>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          background: transparent;
          border: 1px solid var(--color-rule);
          padding: 10px 12px;
          font-family: var(--font-serif);
          font-size: 15px;
          color: var(--color-ink);
          outline: none;
          transition: border-color 0.15s;
        }
        .form-input:focus {
          border-color: var(--color-ink);
        }
        textarea.form-input {
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.6;
          resize: vertical;
        }
        select.form-input {
          font-family: var(--font-sans);
          font-size: 13px;
        }
      `}</style>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-mono text-[10px] tracking-[2px] uppercase font-semibold text-ink pb-3 mb-4 border-b border-rule">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr] gap-4">
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-sans text-[11px] tracking-[1.2px] uppercase text-ink-3">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      {children}
    </label>
  );
}
