/**
 * Transformation d'URL Cloudinary "au rendu".
 *
 * Permet d'afficher la MÊME image source au bon format selon le contexte
 * (à la une 21:9, vignette 4:3, etc.) avec un recadrage intelligent (g_auto),
 * sans toucher au fichier uploadé.
 *
 * - Sur une URL de livraison Cloudinary : insère les transformations après
 *   `/image/upload/`.
 * - Sur toute autre URL (placeholder, image externe) : renvoie l'URL inchangée.
 */

/**
 * Convertit "21 / 9", "16:10", "2.4 / 1" en ratio Cloudinary valide.
 * Cloudinary accepte un ratio d'entiers "w:h" OU un décimal unique, mais PAS
 * un mélange comme "2.4:1" (→ erreur 400). On bascule donc en décimal dès qu'une
 * des deux valeurs n'est pas entière.
 */
function toCloudinaryAr(aspect?: string): string | null {
  if (!aspect) return null;
  const m = aspect
    .replace(/\s+/g, "")
    .match(/^(\d+(?:\.\d+)?)[/:](\d+(?:\.\d+)?)$/);
  if (!m) return null;
  const w = parseFloat(m[1]);
  const h = parseFloat(m[2]);
  if (!w || !h) return null;
  if (Number.isInteger(w) && Number.isInteger(h)) return `${w}:${h}`;
  return (w / h).toFixed(3).replace(/\.?0+$/, "");
}

type FillOptions = {
  /** Ratio cible, accepte "21 / 9" ou "21:9". */
  aspect?: string;
  /** Largeur de livraison en px (la hauteur découle du ratio). */
  width?: number;
};

export function cloudinaryFill(src: string, opts: FillOptions = {}): string {
  if (!src || !src.includes("res.cloudinary.com")) return src;

  const marker = "/image/upload/";
  const i = src.indexOf(marker);
  if (i < 0) return src;

  // Si nos transformations sont déjà appliquées, on ne ré-insère pas.
  const after = src.slice(i + marker.length);
  if (/^c_fill,/.test(after)) return src;

  const parts = ["c_fill", "g_auto", "f_auto", "q_auto", "dpr_auto"];
  const ar = toCloudinaryAr(opts.aspect);
  if (ar) parts.push(`ar_${ar}`);
  if (opts.width) parts.push(`w_${Math.round(opts.width)}`);

  return `${src.slice(0, i + marker.length)}${parts.join(",")}/${after}`;
}
