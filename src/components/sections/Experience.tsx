"use client";

import { experiences } from "@/content/experience";
import { communityRoles } from "@/content/community";
import FadeInUp from "@/components/ui/FadeInUp";
import SectionHeading from "@/components/ui/SectionHeading";
import { useHighlight } from "@/lib/highlight";

function renderBullet(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

const linkArrow = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Experience() {
  const highlight = useHighlight();
  return (
    <section id="experience" className="section-alt px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1700px]">
        <SectionHeading
          kicker="Experience"
          title="Where I've shipped."
          subtitle="Production firmware, tooling, and internal software — plus giving back."
        />

        {/* One continuous grey rail across both professional + community rows */}
        <div className="relative mt-14">
          <span className="absolute top-2 bottom-2 left-2 w-px bg-border" aria-hidden="true" />
          <div className="flex flex-col gap-8">
            {/* Professional roles — violet nodes */}
            {experiences.map((exp, i) => {
              const key = `${exp.company}-${exp.role}`;
              const hasLinks = exp.links && exp.links.length > 0;
              const divider = i < experiences.length - 1 ? "border-b border-border/60" : "";
              return (
                <FadeInUp key={key} delay={i * 0.05}>
                  <div className="relative pl-10 md:pl-14">
                    <span
                      className={`absolute left-0 top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border ${
                        exp.current
                          ? "border-violet-400 bg-violet-500/20"
                          : "border-border bg-card"
                      }`}
                      aria-hidden="true"
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          exp.current ? "bg-violet-400 timeline-pulse" : "bg-muted"
                        }`}
                      />
                    </span>

                    <div className={`${divider} pb-7`}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <h3 className="text-base font-semibold text-foreground md:text-lg">
                          {exp.role}
                        </h3>
                        <span className="shrink-0 font-mono text-sm text-muted">
                          {exp.period}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="text-sm font-medium text-[#a1a1aa]">{exp.company}</p>
                        {exp.current && (
                          <span className="rounded-full border border-violet-400/40 bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300">
                            Current
                          </span>
                        )}
                        {exp.bilingual && (
                          <span className="rounded-full border border-violet-400/40 bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300">
                            EN / FR
                          </span>
                        )}
                      </div>

                      <ul className="mt-3 flex flex-col gap-2">
                        {exp.points.map((pt, pi) => {
                          const pointId = `${exp.id}-p${pi}`;
                          const phase =
                            highlight?.kind === "experience" &&
                            highlight.id === pointId
                              ? highlight.phase
                              : null;
                          const cls = phase
                            ? `point-highlight${phase === "out" ? " point-highlight-out" : ""}`
                            : undefined;
                          return (
                            <li
                              key={pt}
                              id={pointId}
                              className="flex gap-2.5 scroll-mt-24 text-sm leading-relaxed text-muted"
                            >
                              <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-violet-400/70" aria-hidden="true" />
                              <span className={cls}>
                                {renderBullet(pt)}
                              </span>
                            </li>
                          );
                        })}
                      </ul>

                      {hasLinks && (
                        <div className="mt-3 flex flex-wrap gap-3">
                          {exp.links!.map((link) => (
                            <a
                              key={link.label}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300"
                            >
                              {link.label}
                              {linkArrow}
                            </a>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {exp.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-muted">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </FadeInUp>
              );
            })}

            {/* Community & Volunteering — green kicker on the same rail, with a
                bit of extra space above it. No node (it's a divider heading). */}
            <FadeInUp className="pt-6">
              <div className="pl-10 md:pl-14">
                <div className="flex items-center gap-3">
                  <span className="whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-teal-400 md:text-xs">
                    Community &amp; Volunteering
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-teal-500/50 to-transparent" aria-hidden="true" />
                </div>
              </div>
            </FadeInUp>

            {/* Community roles — green (teal) orbs */}
            {communityRoles.map((c, i) => {
              const key = `${c.org}-${c.role}`;
              const hasLinks = c.links && c.links.length > 0;
              const divider = i < communityRoles.length - 1 ? "border-b border-border/60" : "";
              return (
                <FadeInUp key={key} delay={i * 0.05}>
                  <div className="relative pl-10 md:pl-14">
                    <span
                      className="absolute left-0 top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border border-teal-400 bg-teal-500/15"
                      aria-hidden="true"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                    </span>

                    <div className={`${divider} pb-7`}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <h3 className="text-base font-semibold text-foreground md:text-lg">
                          {c.role}
                        </h3>
                        <span className="shrink-0 font-mono text-sm text-muted">
                          {c.period}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="text-sm font-medium text-[#a1a1aa]">{c.org}</p>
                        {c.bilingual && (
                          <span className="rounded-full border border-teal-400/40 bg-teal-500/10 px-2 py-0.5 text-[10px] font-medium text-teal-300">
                            EN / FR
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-muted">{c.description}</p>

                      {hasLinks && (
                        <div className="mt-3 flex flex-wrap gap-3">
                          {c.links!.map((link) => (
                            <a
                              key={link.label}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-400 transition-colors hover:text-teal-300"
                            >
                              {link.label}
                              {linkArrow}
                            </a>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {c.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-muted">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </FadeInUp>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
