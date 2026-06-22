import { cloudinaryFill } from "@/lib/cloudinary-url";

type Props = {
  src?: string;
  alt?: string;
  label?: string;
  aspect?: string;
  className?: string;
  /** Largeur de livraison Cloudinary en px (défaut adapté au hero). */
  width?: number;
};

export function HeroImage({
  src,
  alt = "",
  label = "[ photo · ligne éditoriale noir et blanc ]",
  aspect = "16 / 10",
  className = "",
  width = 1600,
}: Props) {
  if (src) {
    return (
      <div
        className={`w-full overflow-hidden ${className}`}
        style={{ aspectRatio: aspect }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cloudinaryFill(src, { aspect, width })}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  return (
    <div
      className={`w-full stripe-bg flex items-center justify-center ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <span className="font-mono text-[11px] text-muted tracking-[0.3px] bg-paper px-[10px] py-1">
        {label}
      </span>
    </div>
  );
}

export function SmallImage({
  src,
  alt = "",
  className = "",
  aspect = "4 / 3",
  width = 800,
}: {
  src?: string;
  alt?: string;
  className?: string;
  aspect?: string;
  width?: number;
}) {
  if (src) {
    return (
      <div
        className={`w-full overflow-hidden ${className}`}
        style={{ aspectRatio: aspect }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cloudinaryFill(src, { aspect, width })}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  return (
    <div
      className={`w-full stripe-bg-sm flex items-center justify-center ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <span className="font-mono text-[10px] text-muted tracking-[0.3px] bg-paper px-[7px] py-[3px]">
        [ photo ]
      </span>
    </div>
  );
}
