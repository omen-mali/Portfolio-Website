import { skillCategories } from "@/content/skills";
import { coreStack } from "@/content/coreStack";
import FadeInUp from "@/components/ui/FadeInUp";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Skills() {
  return (
    <section id="skills" className="px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1700px]">
        <SectionHeading
          kicker="Skills"
          title="Tools of the trade."
          subtitle="The full toolkit, grouped — strongest, most-used items first."
        />

        <FadeInUp delay={0.1}>
          <div className="mx-auto mt-12 grid max-w-[88%] gap-5 md:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((cat) => {
              const strong = cat.strong ?? [];
              const rest = cat.skills.filter((s) => !strong.includes(s));
              return (
                <div key={cat.name} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-widest text-muted">
                    {cat.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {/* Strongest / most-relevant — highlighted purple, first */}
                    {strong.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-violet-400/40 bg-violet-500/15 px-3 py-1.5 text-[13px] font-medium text-violet-200"
                      >
                        {s}
                      </span>
                    ))}
                    {/* Supporting — hover: purple outline, lightened text, subtle background */}
                    {rest.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-border px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-violet-400 hover:bg-white/[0.07] hover:text-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </FadeInUp>

        {/* Core Stack — single row of brand-coloured icons for the tools I
            reach for most (glyphs embedded from simple-icons, CC0). */}
        <FadeInUp delay={0.2}>
          <div className="mx-auto mt-14 w-fit max-w-full">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              Core Stack
            </h3>
            <p className="mt-1 text-base text-muted">The tools I reach for most.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {coreStack.map((tool) => (
                <div
                  key={tool.label}
                  title={tool.label}
                  className="group flex w-[100px] flex-col items-center gap-2 rounded-xl border border-border bg-card px-2 py-3.5 transition-all hover:-translate-y-0.5 hover:border-violet-400/60 hover:ring-1 hover:ring-violet-400/40 hover:bg-white/[0.04]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-9 w-9 transition-transform group-hover:scale-110"
                    style={{ fill: tool.color }}
                    aria-hidden="true"
                  >
                    <path d={tool.path} />
                  </svg>
                  <span className="text-center text-xs font-medium text-muted transition-colors group-hover:text-foreground">
                    {tool.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
