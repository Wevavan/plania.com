type Props = {
  src?: string;
  alt?: string;
  label?: string;
  aspect?: string;
  className?: string;
};

export function HeroImage({
  src,
  alt = "",
  label = "[ photo · ligne éditoriale noir et blanc ]",
  aspect = "16 / 10",
  className = "",
}: Props) {
  if (src) {
    return (
      <div
        className={`w-full overflow-hidden ${className}`}
        style={{ aspectRatio: aspect }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full h-full object-cover" />
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
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  if (src) {
    return (
      <div
        className={`w-full overflow-hidden ${className}`}
        style={{ aspectRatio: "4 / 3" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`w-full stripe-bg-sm flex items-center justify-center ${className}`}
      style={{ aspectRatio: "4 / 3" }}
    >
      <span className="font-mono text-[10px] text-muted tracking-[0.3px] bg-paper px-[7px] py-[3px]">
        [ photo ]
      </span>
    </div>
  );
}
