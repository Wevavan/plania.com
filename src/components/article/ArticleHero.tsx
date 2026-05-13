import { HeroImage } from "@/components/site/HeroImage";

type Props = {
  imageUrl?: string;
  alt: string;
  caption?: string;
  credit?: string;
};

export function ArticleHero({ imageUrl, alt, caption, credit }: Props) {
  return (
    <figure className="mt-4 mb-2 w-full">
      <HeroImage src={imageUrl} alt={alt} aspect="21 / 9" />
      {(caption || credit) && (
        <figcaption className="font-serif italic text-[13px] text-muted mt-[10px] leading-[1.5] max-w-[780px]">
          {caption}
          {credit && (
            <span className="not-italic font-sans text-[11px] text-muted-2 ml-2 tracking-[0.3px]">
              - {credit}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
