import sharp from "sharp";

type Options = {
  /** Taille cible maximale en octets (défaut 100 Ko). */
  maxBytes?: number;
  /** Largeur maximale en pixels (défaut 1920). */
  maxWidth?: number;
};

/**
 * Compresse une image sous une taille cible (≈100 Ko par défaut).
 *
 * Phase 1 : à largeur maximale, baisse la qualité.
 * Phase 2 : si toujours trop lourd, réduit la largeur jusqu'à passer sous la cible.
 * Renvoie toujours la plus petite version obtenue.
 */
export async function compressImage(
  input: Buffer,
  opts: Options = {}
): Promise<{ buffer: Buffer; format: "webp" }> {
  const maxBytes = opts.maxBytes ?? 100 * 1024;
  const maxWidth = opts.maxWidth ?? 1920;

  const encode = (width: number, quality: number) =>
    sharp(input, { failOn: "none" })
      .rotate() // respecte l'orientation EXIF
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 4 })
      .toBuffer();

  let smallest: Buffer | null = null;
  const consider = (buf: Buffer) => {
    if (!smallest || buf.length < smallest.length) smallest = buf;
  };

  // Phase 1 : pleine largeur, qualité décroissante.
  for (let q = 82; q >= 40; q -= 7) {
    const buf = await encode(maxWidth, q);
    consider(buf);
    if (buf.length <= maxBytes) return { buffer: buf, format: "webp" };
  }

  // Phase 2 : on réduit la largeur (qualité modérée) jusqu'à passer sous la cible.
  let width = maxWidth;
  while (width > 320) {
    width = Math.round(width * 0.82);
    const buf = await encode(width, 52);
    consider(buf);
    if (buf.length <= maxBytes) return { buffer: buf, format: "webp" };
  }

  // Dernier recours : version la plus compacte possible.
  const buf = await encode(320, 38);
  consider(buf);
  return { buffer: smallest as Buffer, format: "webp" };
}
