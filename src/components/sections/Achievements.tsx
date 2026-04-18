import { achievements } from "@/content/achievements";
import FadeInUp from "@/components/ui/FadeInUp";

export default function Achievements() {
  return (
    <section id="achievements" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <FadeInUp>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Achievements
          </h2>
          <p className="mt-4 text-muted">
            Certifications and credentials.
          </p>
        </FadeInUp>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {achievements.map((item, i) => (
            <FadeInUp key={item.title} delay={i * 0.08}>
              <div className="flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-muted">
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-muted">{item.issuer}</p>
                <p className="mt-1 font-mono text-xs text-muted">{item.date}</p>
                {item.verifyUrl && (
                  <a
                    href={item.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Verify ${item.title} credential`}
                    className="mt-3 text-xs text-muted transition-colors hover:text-foreground"
                  >
                    Verify &rarr;
                  </a>
                )}
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}
