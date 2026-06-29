"use client";

import { useState, useRef, useCallback } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import "highlight.js/styles/atom-one-dark.css";

const lowlight = createLowlight(common);

type Props = {
  name: string;
  defaultValue?: string;
};

export function RichEditor({ name, defaultValue = "" }: Props) {
  const [html, setHtml] = useState(defaultValue);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer nofollow" },
      }),
      Image.configure({ HTMLAttributes: { class: "rounded" } }),
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

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("kind", "hero");
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Upload échoué.");
        const alt = window.prompt("Texte alternatif (alt) de l'image :") || "";
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

  return (
    <div className="flex items-center gap-1 border-b border-rule bg-stripe px-2 py-2 flex-wrap sticky top-0 z-10">
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
