"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import "highlight.js/styles/atom-one-dark.css";

const lowlight = createLowlight(common);

// Image avec largeur personnalisable (rendue en style inline, ex. width: 50%).
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.style.width || element.getAttribute("width") || null,
        renderHTML: (attributes: { width?: string | null }) =>
          attributes.width ? { style: `width: ${attributes.width}` } : {},
      },
      align: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const m = (element.getAttribute("class") || "").match(
            /align-(left|center|right)/
          );
          return m ? m[1] : null;
        },
        renderHTML: (attributes: { align?: string | null }) =>
          attributes.align ? { class: `align-${attributes.align}` } : {},
      },
    };
  },
});

const IMAGE_ALIGNS = [
  { v: "left", label: "G", title: "Aligner à gauche" },
  { v: "center", label: "C", title: "Centrer" },
  { v: "right", label: "D", title: "Aligner à droite" },
];

const IMAGE_WIDTHS = ["25%", "50%", "75%", "100%"];

type Props = {
  name: string;
  defaultValue?: string;
};

function uploadErrorMessage(data: unknown): string {
  if (data && typeof data === "object" && "error" in data) {
    const err = (data as { error: unknown }).error;
    if (typeof err === "string") return err;
    if (err && typeof err === "object" && "message" in err) {
      return String((err as { message: unknown }).message);
    }
  }
  return "Upload échoué. Vérifiez la configuration Cloudinary.";
}

export function RichEditor({ name, defaultValue = "" }: Props) {
  const [html, setHtml] = useState(defaultValue);
  // Force le re-render de la barre d'outils quand le curseur bouge,
  // pour que l'état actif (H2/H3/liste…) suive la sélection.
  const [, setTick] = useState(0);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer nofollow" },
      }),
      CustomImage.configure({ HTMLAttributes: { class: "rounded" } }),
      Placeholder.configure({
        placeholder:
          "Écrivez votre article… (utilisez la barre d'outils pour les titres, listes, code, etc.)",
      }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class: "article-prose focus:outline-none min-h-[420px] px-5 py-4",
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    const rerender = () => setTick((t) => t + 1);
    editor.on("selectionUpdate", rerender);
    editor.on("transaction", rerender);
    return () => {
      editor.off("selectionUpdate", rerender);
      editor.off("transaction", rerender);
    };
  }, [editor]);

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("kind", "hero");
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.url) {
          throw new Error(uploadErrorMessage(data));
        }
        const alt =
          window.prompt("Texte alternatif (alt) de l'image :", "") || "";
        editor.chain().focus().setImage({ src: data.url, alt }).run();
      } catch (e) {
        alert(e instanceof Error ? e.message : "Erreur d'upload.");
      }
    },
    [editor]
  );

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL du lien :", previous || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  return (
    <div className="border border-rule">
      <Toolbar
        editor={editor}
        onImage={() => fileRef.current?.click()}
        onLink={setLink}
      />
      <EditorContent editor={editor} />
      {/* Champ transmis au formulaire (HTML produit par l'éditeur) */}
      <input type="hidden" name={name} value={html} />
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadImage(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function Toolbar({
  editor,
  onImage,
  onLink,
}: {
  editor: Editor | null;
  onImage: () => void;
  onLink: () => void;
}) {
  if (!editor) {
    return (
      <div className="border-b border-rule bg-stripe px-2 py-2 h-[41px]" />
    );
  }

  const blockLabel = editor.isActive("heading", { level: 2 })
    ? "Titre H2"
    : editor.isActive("heading", { level: 3 })
      ? "Titre H3"
      : editor.isActive("codeBlock")
        ? "Bloc de code"
        : editor.isActive("blockquote")
          ? "Citation"
          : editor.isActive("bulletList")
            ? "Liste à puces"
            : editor.isActive("orderedList")
              ? "Liste numérotée"
              : "Paragraphe";

  return (
    <div className="flex items-center gap-1 border-b border-rule bg-stripe px-2 py-2 flex-wrap sticky top-0 z-10">
      <span
        className="font-sans text-[11px] tracking-[0.5px] uppercase bg-ink text-paper px-2 py-1 mr-1 min-w-[110px] text-center"
        title="Type du bloc où se trouve le curseur"
      >
        {blockLabel}
      </span>
      <Sep />
      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="Titre de section"
      >
        H2
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="Sous-titre"
      >
        H3
      </Btn>
      <Sep />
      <Btn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Gras"
      >
        <strong>B</strong>
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italique"
      >
        <em>I</em>
      </Btn>
      <Btn
        onClick={onLink}
        active={editor.isActive("link")}
        title="Lien"
      >
        🔗
      </Btn>
      <Sep />
      <Btn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Liste à puces"
      >
        • —
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Liste numérotée"
      >
        1.
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Citation"
      >
        ❝
      </Btn>
      <Sep />
      <Btn
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
        title="Code en ligne"
      >
        {"</>"}
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
        title="Bloc de code"
      >
        {"{ }"}
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Séparateur"
      >
        —
      </Btn>
      <Btn onClick={onImage} title="Insérer une image">
        🖼
      </Btn>

      {editor.isActive("image") && (
        <>
          <Sep />
          <span className="font-mono text-[10px] tracking-[1px] uppercase text-muted">
            Largeur
          </span>
          {IMAGE_WIDTHS.map((w) => (
            <Btn
              key={w}
              onClick={() =>
                editor.chain().focus().updateAttributes("image", { width: w }).run()
              }
              active={editor.getAttributes("image").width === w}
              title={`Largeur ${w}`}
            >
              {w}
            </Btn>
          ))}
          <Btn
            onClick={() => {
              const v = window.prompt(
                "Largeur personnalisée (ex. 400px ou 60%) :",
                (editor.getAttributes("image").width as string) || ""
              );
              if (v)
                editor
                  .chain()
                  .focus()
                  .updateAttributes("image", { width: v.trim() })
                  .run();
            }}
            title="Largeur personnalisée (px ou %)"
          >
            px…
          </Btn>
          <Btn
            onClick={() =>
              editor.chain().focus().updateAttributes("image", { width: null }).run()
            }
            title="Réinitialiser la largeur (auto)"
          >
            auto
          </Btn>
          <Sep />
          <span className="font-mono text-[10px] tracking-[1px] uppercase text-muted">
            Position
          </span>
          {IMAGE_ALIGNS.map((a) => (
            <Btn
              key={a.v}
              onClick={() =>
                editor.chain().focus().updateAttributes("image", { align: a.v }).run()
              }
              active={editor.getAttributes("image").align === a.v}
              title={a.title}
            >
              {a.label}
            </Btn>
          ))}
        </>
      )}

      <span className="ml-auto flex items-center gap-1">
        <Btn
          onClick={() => editor.chain().focus().undo().run()}
          title="Annuler"
        >
          ↺
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().redo().run()}
          title="Rétablir"
        >
          ↻
        </Btn>
      </span>
    </div>
  );
}

function Btn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={`font-mono text-[12px] min-w-[30px] px-2 py-1 border transition-colors cursor-pointer ${
        active
          ? "bg-ink text-paper border-ink"
          : "bg-paper text-ink border-rule hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="w-px h-5 bg-rule mx-1" aria-hidden="true" />;
}
