import { statusItems } from "@/content/status";
import FadeInUp from "@/components/ui/FadeInUp";

export default function Status() {
  return (
    <section id="status" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <FadeInUp>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Status</h2>
          <p className="mt-4 text-muted">What I&apos;m up to right now.</p>
        </FadeInUp>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {statusItems.map((item, i) => (
            <FadeInUp key={item.label} delay={i * 0.1}>
              <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-muted">
                <span className="text-2xl" role="img" aria-label={item.label}>
                  {item.icon}
                </span>
                <div>
                  <p className="text-xs font-medium tracking-wider text-muted uppercase">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-foreground">{item.value}</p>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}
