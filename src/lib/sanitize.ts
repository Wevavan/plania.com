import sanitizeHtml from "sanitize-html";

/**
 * Sanitisation du HTML d'article (blocs HTML bruts + markdown inline rendu).
 *
 * Allow-list stricte : on garde les balises de mise en forme et de contenu
 * éditorial courantes, mais on supprime <script>, les gestionnaires d'événements
 * (on*), les iframes, et les URLs dangereuses (javascript:, data: hors images).
 *
 * À utiliser systématiquement avant tout `dangerouslySetInnerHTML` côté serveur.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr", "span", "div",
    "blockquote", "figure", "figcaption", "cite",
    "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li",
    "strong", "em", "b", "i", "u", "s", "mark", "small", "sup", "sub",
    "code", "pre", "kbd",
    "a", "img",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup", "col",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    col: ["span"],
    "*": ["class", "id"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: {
    img: ["http", "https", "data"],
  },
  // Force des liens sûrs (empêche le tabnabbing) et nofollow pour le SEO.
  transformTags: {
    a: sanitizeHtml.simpleTransform(
      "a",
      { rel: "noopener noreferrer nofollow" },
      true
    ),
  },
  // Supprime entièrement le contenu de ces balises si elles apparaissaient.
  disallowedTagsMode: "discard",
};

export function sanitizeArticleHtml(html: string): string {
  if (!html) return "";
  return sanitizeHtml(html, OPTIONS);
}
