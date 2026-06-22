import type { ReactNode } from "react";
import FadeInUp from "@/components/ui/FadeInUp";

/**
 * Section heading: a small purple mono kicker followed by a purple rule that
 * fades to transparent, then (optionally) a slightly-smaller white heading and
 * a muted subtext. Self-wraps in FadeInUp.
 */
export default function SectionHeading({
  kicker,
  title,
  subtitle,
  className = "",
}: {
  kicker: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}) {
  return (
    <FadeInUp className={className}>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-violet-400 md:text-sm">
          {kicker}
        </span>
        <span
          className="h-px flex-1 bg-gradient-to-r from-violet-500/50 to-transparent"
          aria-hidden="true"
        />
      </div>
      {title && (
        <h2 className="mt-5 text-3xl font-bold text-white md:text-4xl">{title}</h2>
      )}
      {subtitle && <p className="mt-2 max-w-2xl text-sm text-muted">{subtitle}</p>}
    </FadeInUp>
  );
}
