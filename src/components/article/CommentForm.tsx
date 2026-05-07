"use client";

import { useRef, useState, useTransition } from "react";
import { createCommentAction } from "@/app/article/[slug]/comments-actions";

export function CommentForm({ articleSlug }: { articleSlug: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await createCommentAction(articleSlug, formData);
        setText("");
        formRef.current?.reset();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="border border-ink p-5">
      <textarea
        name="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Votre réaction…"
        className="w-full bg-transparent border-none outline-none font-serif text-[15px] text-ink resize-y placeholder:italic placeholder:text-muted leading-[1.55]"
        required
        maxLength={2000}
      />
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-rule">
        <span className="font-mono text-[10px] text-muted tracking-[0.4px]">
          {text.length} / 2000 · Markdown ignoré · soyez courtois.
        </span>
        <button
          type="submit"
          disabled={pending || !text.trim()}
          className="bg-ink text-paper font-sans text-[12px] font-medium px-5 py-[10px] hover:bg-accent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none"
        >
          {pending ? "Publication…" : "Publier →"}
        </button>
      </div>
      {error && (
        <div className="mt-3 font-sans text-[12px] text-accent">{error}</div>
      )}
    </form>
  );
}
