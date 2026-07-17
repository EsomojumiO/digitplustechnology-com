import Image from "next/image";
import { cn } from "@/lib/utils";
import { hasPublicFile } from "@/lib/media";

export interface FeatureImageProps {
  /** Public path, e.g. "/images/services/it-procurement.jpg". */
  src: string;
  alt: string;
  /** Mono micro-label, e.g. "MANAGED IT". */
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Tailwind aspect class for the frame. */
  aspect?: string;
}

/**
 * FeatureImage — one curated accent image, treated to match the home hero
 * (cover-dark scrim + saturate(0.85) + hairline frame + mono micro-label).
 *
 * Server component: if the file isn't present yet (checked at build via
 * hasPublicFile), it renders a hairline placeholder instead of a broken image,
 * so pages ship cleanly before the imagery is downloaded.
 */
export function FeatureImage({
  src,
  alt,
  label,
  className,
  sizes = "(min-width: 1024px) 40vw, 100vw",
  priority,
  aspect = "aspect-[4/3]",
}: FeatureImageProps) {
  const exists = hasPublicFile(src);
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-hairline bg-surface",
        aspect,
        className,
      )}
    >
      {exists ? (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover saturate-[0.85] brightness-[0.9]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent"
            aria-hidden="true"
          />
        </>
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[repeating-linear-gradient(135deg,transparent,transparent_10px,rgb(255_255_255/0.02)_10px,rgb(255_255_255/0.02)_20px)]">
          <span className="font-mono text-caption uppercase tracking-[0.14em] text-faint">
            Image pending
          </span>
        </div>
      )}
      {label ? (
        <span
          aria-hidden="true"
          className="absolute bottom-2.5 left-3 font-mono text-caption uppercase tracking-[0.14em] text-white/50"
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

export default FeatureImage;
