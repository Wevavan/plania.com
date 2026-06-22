import Image from "next/image";

type Props = {
  /** Taille préréglée. sm = pour barres, md = pour cartes, lg = pour masthead accueil. */
  size?: "sm" | "md" | "lg";
  /** Sans effet ici (le PNG inclut déjà la déco) — conservé pour compat. */
  withCircuit?: boolean;
  className?: string;
  /** Surcharge la hauteur du preset (ex. "h-[88px]"). */
  heightClass?: string;
  /** Pour l'image LCP au-dessus de la ligne de flottaison. */
  priority?: boolean;
};

export function BrandLogo({
  size = "lg",
  className = "",
  heightClass,
  priority = false,
}: Props) {
  const h =
    heightClass ??
    (size === "sm" ? "h-[44px]" : size === "md" ? "h-[110px]" : "h-[340px]");

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span className="sr-only">Planète IA</span>
      <Image
        src="/logo.png"
        alt="Planète IA"
        width={1400}
        height={800}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className={`${h} w-auto object-contain mix-blend-multiply`}
      />
    </span>
  );
}
