"use client";

import { projects } from "@/content/projects";
import FadeInUp from "@/components/ui/FadeInUp";
import SectionHeading from "@/components/ui/SectionHeading";
import { useHighlight } from "@/lib/highlight";

const linkArrow = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Projects() {
  const highlight = useHighlight();
  return (
    <section id="projects" className="px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1700px]">
        <SectionHeading
          kicker="Projects"
          title="Things I've built."
          subtitle="Personal and academic work across embedded, systems, and ML."
        />

        <FadeInUp delay={0.1}>
          {/* auto-rows-fr → every card matches the tallest; content always expanded */}
          <div className="mx-auto mt-12 grid max-w-[88%] auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => {
              const hasRepo = p.github && p.github !== "#";
              const spec =
                p.specifier && p.specifier !== p.category ? `(${p.specifier})` : null;
              const label = [
                [p.category, spec].filter(Boolean).join(" "),
                p.course,
              ]
                .filter(Boolean)
                .join(" · ");
              const phase =
                highlight?.kind === "project" && highlight.id === p.slug
                  ? highlight.phase
                  : null;
              return (
                <div
                  key={p.slug}
                  id={`project-${p.slug}`}
                  className="relative flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-[border-color,box-shadow] hover:border-violet-400/60 hover:ring-1 hover:ring-violet-400/40"
                >
                  {/* Deep-link highlight overlay — an animated rotating
                      gradient ring trace. Instant on, smooth fade out, and
                      decoupled from the card's own hover so neither slows the
                      other. */}
                  {phase && (
                    <span
                      aria-hidden="true"
                      className={`gradient-ring-trace pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                        phase === "out" ? "opacity-0" : "opacity-100"
                      }`}
                    />
                  )}
                  {label && (
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-violet-400/80">
                      {label}
                    </span>
                  )}
                  <h3 className="mt-1 text-base font-semibold leading-snug text-foreground">
                    {p.title}
                  </h3>

                  {/* Optional standing/award (e.g. hackathon placement) —
                      animated violet gradient text with an underline so it
                      stands out, mirroring the MA logo / badge gradient. */}
                  {p.placement && (
                    <p className="mt-1.5">
                      <span className="gradient-text-animate inline-block bg-[linear-gradient(135deg,var(--grad-light,#b6a0fc),#8b5cf6,#6366f1,#7c3aed,var(--grad-light,#b6a0fc))] bg-clip-text text-sm font-semibold text-transparent underline decoration-violet-400/80 underline-offset-[3px]">
                        {p.placement}
                      </span>
                    </p>
                  )}

                  <p className="mt-2.5 whitespace-pre-line text-[13px] leading-relaxed text-muted">
                    {p.description}
                  </p>

                  {/* Credits — standardized, vertically stacked */}
                  {p.contributors && p.contributors.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-400/70">
                        Credits
                      </p>
                      <div className="mt-1.5 flex flex-col gap-1">
                        {p.contributors.map((c) => (
                          <span key={c.username} className="text-xs text-muted">
                            {c.name}{": "}
                            <a
                              href={c.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-violet-400 transition-colors hover:text-violet-300"
                            >
                              @{c.username}
                            </a>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Repo (above) + tags pinned to the bottom so they line up
                      across cards — View Repo sits just above the stack. */}
                  <div className="mt-auto flex flex-col gap-4 pt-5">
                    {(hasRepo || p.category !== "Academic") && (
                      <div>
                        {hasRepo ? (
                          <a
                            href={p.github!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-400 transition-colors hover:text-violet-300"
                          >
                            View Repo
                            {linkArrow}
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium italic text-muted">
                            Repo coming soon
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {p.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* View All — final card, matches the grid height */}
            <a
              href="https://github.com/omen-mali"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full min-h-[160px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/40 p-5 text-center transition-[border-color,box-shadow,background-color] hover:border-violet-400/60 hover:ring-1 hover:ring-violet-400/40 hover:bg-white/5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-2xl leading-none text-muted transition-colors group-hover:border-violet-400 group-hover:text-violet-300">
                +
              </span>
              <span className="text-sm font-medium text-foreground">View All</span>
              <span className="text-xs text-muted">on GitHub</span>
            </a>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
