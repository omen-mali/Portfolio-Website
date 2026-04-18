import { skillCategories } from "@/content/skills";
import FadeInUp from "@/components/ui/FadeInUp";

export default function Skills() {
  return (
    <section id="skills" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <FadeInUp>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Skills & Expertise
          </h2>
        </FadeInUp>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {skillCategories.map((category, i) => (
            <FadeInUp key={category.name} delay={i * 0.1}>
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 text-sm font-semibold tracking-widest text-muted uppercase">
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-muted hover:bg-white/5"
                    >
                      {skill}
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
