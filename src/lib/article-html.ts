import { sanitizeArticleHtml } from "@/lib/sanitize";

/** Entrée de sommaire hiérarchisée (niveau de titre conservé). */
export type TocItem = { id: string; title: string; level: 2 | 3 };

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
  toc: TocItem[];
} {
  if (!raw) return { html: "", toc: [] };

  let html = sanitizeArticleHtml(raw);
  const toc: TocItem[] = [];
  const usedIds = new Set<string>();
  let idx = 0;

  const uniqueId = (base: string, fallback: string) => {
    let id = base || fallback;
    let i = 2;
    while (usedIds.has(id)) id = `${base || fallback}-${i++}`;
    usedIds.add(id);
    return id;
  };

  // Titres h2/h3 dans l'ordre du document → ancre + entrée de sommaire.
  html = html.replace(
    /<(h2|h3)(\b[^>]*)>([\s\S]*?)<\/\1>/gi,
    (m, tag: string, attrs: string, inner: string) => {
      idx += 1;
      const title = stripTags(inner);
      if (!title) return m;
      const level: 2 | 3 = tag.toLowerCase() === "h2" ? 2 : 3;
      const id = uniqueId(slugify(title), `h-${idx}`);
      toc.push({ id, title, level });
      const cleanAttrs = attrs.replace(/\sid="[^"]*"/i, "");
      return `<${tag} id="${id}"${cleanAttrs}>${inner}</${tag}>`;
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
