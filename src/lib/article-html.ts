import { sanitizeArticleHtml } from "@/lib/sanitize";
import type { Section } from "@/lib/article-body";

/**
 * Prépare le HTML d'un article (issu de l'éditeur WYSIWYG) pour l'affichage :
 * - sanitise (sécurité),
 * - ajoute des ancres (id) sur les titres + construit le sommaire (h2),
 * - applique la classe lettrine au premier paragraphe.
 */

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "").trim();
}

export function processArticleHtml(raw: string): {
  html: string;
  toc: Section[];
} {
  if (!raw) return { html: "", toc: [] };

  let html = sanitizeArticleHtml(raw);
  const toc: Section[] = [];
  const usedIds = new Set<string>();
  let n = 0;

  const uniqueId = (base: string, fallback: string) => {
    let id = base || fallback;
    let i = 2;
    while (usedIds.has(id)) id = `${base || fallback}-${i++}`;
    usedIds.add(id);
    return id;
  };

  // Titres de section (h2) → ancre + entrée de sommaire.
  html = html.replace(
    /<h2(\b[^>]*)>([\s\S]*?)<\/h2>/gi,
    (_m, attrs: string, inner: string) => {
      n += 1;
      const title = stripTags(inner);
      const id = uniqueId(slugify(title), `section-${n}`);
      const num = String(n).padStart(2, "0");
      toc.push({ n: num, id, title });
      const cleanAttrs = attrs.replace(/\sid="[^"]*"/i, "");
      return `<h2 id="${id}"${cleanAttrs}>${inner}</h2>`;
    }
  );

  // Sous-titres (h3) → ancre (sans entrée de sommaire).
  html = html.replace(
    /<h3(\b[^>]*)>([\s\S]*?)<\/h3>/gi,
    (m, attrs: string, inner: string) => {
      const title = stripTags(inner);
      const slug = slugify(title);
      if (!slug) return m;
      const id = uniqueId(slug, slug);
      const cleanAttrs = attrs.replace(/\sid="[^"]*"/i, "");
      return `<h3 id="${id}"${cleanAttrs}>${inner}</h3>`;
    }
  );

  // Lettrine sur le premier paragraphe.
  html = html.replace(/<p(\b[^>]*)>/i, (m, attrs: string) => {
    if (/\sclass="/i.test(attrs)) {
      return m.replace(/class="([^"]*)"/i, 'class="$1 article-lead"');
    }
    return `<p class="article-lead"${attrs}>`;
  });

  return { html, toc };
}
