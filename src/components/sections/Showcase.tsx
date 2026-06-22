"use client";

import { achievements } from "@/content/achievements";
import { capabilities, type CapabilityLink } from "@/content/capabilities";
import { statusItems } from "@/content/status";
import FadeInUp from "@/components/ui/FadeInUp";
import SectionHeading from "@/components/ui/SectionHeading";
import { jumpAndHighlight } from "@/lib/highlight";

const subLabel =
  "text-xs font-semibold uppercase tracking-widest text-violet-400/80";

// Small down-right jump arrow — these links scroll further down the page.
const jumpArrow = (
  <svg
    width="11"
    height="11"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    className="transition-transform group-hover:translate-y-0.5"
  >
    <path d="M6 2v7M3 6.5L6 9.5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function jumpToEvidence(link: CapabilityLink) {
  if (link.kind === "project") {
    jumpAndHighlight("project", link.slug, `project-${link.slug}`);
  } else {
    jumpAndHighlight("experience", `${link.expId}-p${link.point}`);
  }
}

export default function Showcase() {
  return (
    <section id="showcase" className="px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1700px]">
        <SectionHeading
          kicker="At a Glance"
          title="A quick snapshot."
          subtitle="The essentials — what I do, credentials, and what I'm working on."
        />

        {/* What I do — capability domains with one proof line each (the full
            toolkit lives in the Skills section; this stays higher-level). */}
        <FadeInUp delay={0.1} className="mx-auto mt-12 max-w-[88%]">
          <h3 className={subLabel}>What I do</h3>
          <div className="mt-6 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((c) => (
              <div
                key={c.title}
                className="flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-[border-color,box-shadow] hover:border-violet-400/60 hover:ring-1 hover:ring-violet-400/40"
              >
                <h4 className="text-sm font-semibold text-foreground">{c.title}</h4>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{c.proof}</p>
                <div className="mt-auto pt-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {c.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* Stylized footing — quick-links to the work that backs the
                      claim. Each scrolls to and flashes its target. */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-border/60 pt-3">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-400/70">
                      Relevant
                    </span>
                    {c.links.map((link) => (
                      <button
                        key={link.label}
                        onClick={() => jumpToEvidence(link)}
                        className="group inline-flex items-center gap-1 text-xs font-medium text-violet-400 transition-colors hover:text-violet-300"
                      >
                        {link.label}
                        {jumpArrow}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeInUp>

        {/* Certifications & Awards */}
        <FadeInUp delay={0.15} className="mx-auto mt-12 max-w-[88%]">
          <h3 className={subLabel}>Certifications & Awards</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((a) => (
              <div key={a.title} className="rounded-xl border border-border bg-card p-5 transition-[border-color,box-shadow] hover:border-violet-400/60 hover:ring-1 hover:ring-violet-400/40">
                <h4 className="text-sm font-semibold text-foreground">{a.title}</h4>
                <p className="mt-1.5 text-xs text-muted">{a.issuer}</p>
                <p className="mt-1 font-mono text-xs text-muted">{a.date}</p>
              </div>
            ))}
          </div>
        </FadeInUp>

        {/* What I'm up to */}
        <FadeInUp delay={0.2} className="mx-auto mt-12 max-w-[88%]">
          <h3 className={subLabel}>What I&apos;m up to</h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {statusItems.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-[border-color,box-shadow] hover:border-violet-400/60 hover:ring-1 hover:ring-violet-400/40"
              >
                <span className="text-xl" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
