"use client";

import { useState, useRef } from "react";
import { parseBody, renderInline, type Block } from "@/lib/article-body";
import { ImageInsertDialog } from "./ImageInsertDialog";

type Props = {
  name: string;
  defaultValue?: string;
};

const TOOLBAR = [
  { label: "H2", insert: "\n## ", help: "Titre de section" },
  { label: "H3", insert: "\n### ", help: "Sous-titre" },
  { label: "Gras", wrap: "**", help: "**texte**" },
  { label: "Italique", wrap: "*", help: "*texte*" },
  { label: "Lien", insert: "[texte](https://)", help: "Lien" },
  { label: "Citation", insert: "\n> ", help: "Pull quote" },
  { label: "Code", wrap: "`", help: "code inline" },
];

export function MarkdownEditor({ name, defaultValue = "" }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const ref = useRef<HTMLTextAreaElement | null>(null);

  function applyToolbar(item: (typeof TOOLBAR)[number]) {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = value.slice(0, start);
    const selection = value.slice(start, end);
    const after = value.slice(end);
    let next: string;
    let cursor: number;
    if (item.wrap) {
      next = before + item.wrap + (selection || "texte") + item.wrap + after;
      cursor = start + item.wrap.length + (selection || "texte").length;
    } else if (item.insert) {
      next = before + item.insert + after;
      cursor = start + item.insert.length;
    } else {
      return;
    }
    setValue(next);
    requestAnimationFrame(() => {
      if (ta) {
        ta.focus();
        ta.setSelectionRange(cursor, cursor);
      }
    });
  }

  function insertAtCursor(text: string) {
    const ta = ref.current;
    const start = ta?.selectionStart ?? value.length;
    const end = ta?.selectionEnd ?? value.length;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const sep = before.endsWith("\n\n") || before === "" ? "" : "\n\n";
    const tail = after.startsWith("\n\n") ? "" : "\n\n";
    const block = sep + text + tail;
    const next = before + block + after;
    const cursor = start + block.length;
    setValue(next);
    requestAnimationFrame(() => {
      if (ta) {
        ta.focus();
        ta.setSelectionRange(cursor, cursor);
      }
    });
  }

  const { blocks } = parseBody(value);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 border border-rule">
        <div className="border-r border-rule">
          <div className="flex items-center gap-1 border-b border-rule bg-stripe px-2 py-2 flex-wrap">
            {TOOLBAR.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => applyToolbar(t)}
                title={t.help}
                className="font-mono text-[11px] px-2 py-1 border border-rule bg-paper text-ink hover:bg-ink hover:text-paper hover:border-ink transition-colors cursor-pointer"
              >
                {t.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setImageDialogOpen(true)}
              title="Insérer une image (upload ou URL, position, légende)"
              className="font-mono text-[11px] px-2 py-1 border border-accent bg-paper text-accent hover:bg-accent hover:text-paper hover:border-accent transition-colors cursor-pointer"
            >
              + Image
            </button>
            <span className="ml-auto font-mono text-[10px] text-muted tracking-[0.4px] uppercase">
              {value.split(/\s+/).filter(Boolean).length} mots
            </span>
          </div>
          <textarea
            ref={ref}
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={28}
            className="w-full bg-paper p-4 font-mono text-[13px] leading-[1.7] text-ink outline-none resize-y border-none focus:bg-stripe block"
            placeholder={
              "Premier paragraphe (devient l'intro avec drop cap)…\n\n## Titre de section\n\nParagraphe.\n\n### Sous-titre\n\nDétail.\n\n> Une citation marquante\n— Source"
            }
          />
        </div>
        <div className="overflow-auto p-4">
          <div className="font-mono text-[10px] tracking-[1.6px] uppercase text-muted mb-3">
            Aperçu
          </div>
          <div className="article-prose">
            {blocks.length === 0 ? (
              <p className="font-serif italic text-[14px] text-muted m-0">
                Le rendu apparaît ici à mesure que vous tapez.
              </p>
            ) : (
              blocks.map((b, i) => <Block key={i} block={b} index={i} />)
            )}
          </div>
        </div>
      </div>

      <ImageInsertDialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        onInsert={(html) => insertAtCursor(html)}
      />
    </>
  );
}

function Block({ block, index }: { block: Block; index: number }) {
  if (block.kind === "heading") {
    return (
      <h2 className="font-serif text-[22px] font-bold leading-[1.15] tracking-[-0.4px] m-0 mt-6 mb-3">
        {block.title}
      </h2>
    );
  }
  if (block.kind === "subheading") {
    return (
      <h3 className="font-serif text-[17px] font-semibold leading-[1.2] tracking-[-0.2px] m-0 mt-4 mb-2 text-ink-2">
        {block.title}
      </h3>
    );
  }
  if (block.kind === "pullquote") {
    return (
      <blockquote className="my-5 py-3 pl-8 pr-4 border-l-2 border-ink relative">
        <span className="absolute left-2 top-0 font-serif italic text-[28px] text-accent leading-none">
          «
        </span>
        <p className="font-serif italic text-[16px] leading-[1.4] text-ink m-0 mb-1">
          {block.text}
        </p>
        {block.attribution && (
          <footer className="font-sans text-[11px] text-muted">
            — {block.attribution}
          </footer>
        )}
      </blockquote>
    );
  }
  if (block.kind === "html") {
    return <div dangerouslySetInnerHTML={{ __html: block.html }} />;
  }
  return (
    <p
      className={
        index === 0
          ? "text-[15px] leading-[1.6] text-ink font-serif m-0 mb-3 article-lead"
          : "text-[14px] leading-[1.65] text-ink-2 font-serif m-0 mb-3"
      }
      dangerouslySetInnerHTML={{ __html: renderInline(block.text) }}
    />
  );
}
