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
 * (cover scrim + saturate(0.85) + hairline frame + mono micro-label).
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
            className="object-cover"
          />
          {/* Soft white gradient at the base — ONLY when there's a label to
              keep legible. The dark theme veiled the whole image
              (from-background/70) to seat it into near-black; on white that
              inverts into a haze over the photo. Photos run clean now. */}
          {label ? (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/60 to-transparent"
              aria-hidden="true"
            />
          ) : null}
        </>
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[repeating-linear-gradient(135deg,transparent,transparent_10px,rgb(0_0_0/0.03)_10px,rgb(0_0_0/0.03)_20px)]">
          <span className="text-caption text-muted">Image pending</span>
        </div>
      )}
      {label ? (
        <span
          aria-hidden="true"
          className="text-caption absolute bottom-2.5 left-3 font-medium text-muted"
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

export default FeatureImage;
