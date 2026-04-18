import { experiences } from "@/content/experience";
import FadeInUp from "@/components/ui/FadeInUp";

export default function Experience() {
  return (
    <section id="experience" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <FadeInUp>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Experience</h2>
        </FadeInUp>

        <div className="mt-12 space-y-8">
          {experiences.map((exp, i) => (
            <FadeInUp key={exp.role + exp.company} delay={i * 0.15}>
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {exp.role}
                    </h3>
                    <p className="text-sm text-muted">{exp.company}</p>
                  </div>
                  <span className="font-mono text-sm text-muted">
                    {exp.period}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {exp.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}
