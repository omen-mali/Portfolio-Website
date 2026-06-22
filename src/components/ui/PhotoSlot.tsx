import Image from "next/image";
import { LogoMark } from "./Logo";

/**
 * Photo placeholder that upgrades to a real image when a file is supplied.
 * Until then it shows a tasteful gradient block with the monogram + caption,
 * so layouts stay intact while photos are still being gathered. Drop files in
 * /public/images/photos and set `src` (e.g. "/images/photos/headshot.jpg").
 */
export default function PhotoSlot({
  src = "/images/photos/headshot.jpg",
  alt = "",
  caption,
  className = "",
  rounded = "rounded-2xl",
  sizes = "(max-width: 768px) 100vw, 400px",
  priority = false,
}: {
  src?: string;
  alt?: string;
  caption?: string;
  className?: string;
  rounded?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden border border-border bg-card ${rounded} ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.16),transparent_60%)]">
          <LogoMark size={44} className="opacity-40" />
          {caption && (
            <span className="px-4 text-center text-xs text-muted/60">{caption}</span>
          )}
        </div>
      )}
    </div>
  );
}
