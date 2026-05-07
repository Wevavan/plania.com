type Props = {
  children: React.ReactNode;
  size?: "sm" | "md";
  tone?: "accent" | "warm" | "ink";
  className?: string;
};

export function Kicker({
  children,
  size = "md",
  tone = "accent",
  className = "",
}: Props) {
  const sizeClass =
    size === "sm"
      ? "text-[10px] tracking-[1.8px]"
      : "text-[11px] tracking-[2px]";
  const toneClass =
    tone === "warm"
      ? "text-accent-warm"
      : tone === "ink"
        ? "text-ink"
        : "text-accent";
  return (
    <span
      className={`font-mono font-medium uppercase inline-block ${sizeClass} ${toneClass} ${className}`}
    >
      {children}
    </span>
  );
}
