/** Hero heading gradient: wide light→dark→light spectrum for fluid animation. */
export const HERO_HEADING_GRADIENT_CLASS =
  "bg-[linear-gradient(135deg,#c4b5fd,#8b5cf6,#6366f1,#4f46e5,#6366f1,#8b5cf6,#c4b5fd)]";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  breathe?: boolean;
  gradientClass?: string;
}

export default function GradientText({
  children,
  className = "",
  as: Tag = "h2",
  breathe = false,
  gradientClass = HERO_HEADING_GRADIENT_CLASS,
}: GradientTextProps) {
  return (
    <Tag
      className={`${gradientClass} bg-clip-text text-transparent ${breathe ? "hero-gradient-text-breathe" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
