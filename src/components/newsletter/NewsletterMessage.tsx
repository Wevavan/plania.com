import Link from "next/link";

type Tone = "accent" | "ink" | "muted";

type Action = {
  label: string;
  href: string;
  primary?: boolean;
};

type Props = {
  kicker: string;
  kickerTone?: Tone;
  title: string;
  body: React.ReactNode;
  actions?: Action[];
};

export function NewsletterMessage({
  kicker,
  kickerTone = "accent",
  title,
  body,
  actions = [],
}: Props) {
  const kickerColor =
    kickerTone === "ink"
      ? "text-ink"
      : kickerTone === "muted"
        ? "text-muted"
        : "text-accent";

  return (
    <div className="py-16 max-w-[560px] mx-auto text-center">
      <span
        className={`font-mono text-[11px] tracking-[2.4px] ${kickerColor} uppercase`}
      >
        {kicker}
      </span>
      <h1 className="font-serif text-[44px] font-bold leading-[1.05] tracking-[-0.8px] m-0 mt-4 mb-6 balance">
        {title}
      </h1>
      <div className="text-[17px] leading-[1.55] text-ink-2 m-0 mb-8 pretty">
        {body}
      </div>
      {actions.length > 0 && (
        <div className="flex justify-center gap-3 flex-wrap">
          {actions.map((a) => (
            <Link
              key={a.href + a.label}
              href={a.href}
              className={
                a.primary
                  ? "inline-block bg-ink text-paper font-sans text-[14px] font-medium px-7 py-[14px] no-underline hover:bg-accent transition-colors"
                  : "inline-block border border-ink text-ink font-sans text-[14px] font-medium px-7 py-[14px] no-underline hover:bg-accent hover:text-paper transition-colors"
              }
            >
              {a.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
