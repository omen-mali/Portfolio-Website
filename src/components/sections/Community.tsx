"use client";

import { communityRoles } from "@/content/community";
import FadeInUp from "@/components/ui/FadeInUp";
import PhotoSlot from "@/components/ui/PhotoSlot";
import SectionHeading from "@/components/ui/SectionHeading";

// Event-photo placeholders ("recommended spaces for pictures"). Add files to
// /public/images/photos and set `src` on each to swap the placeholder out.
const MOMENTS: { src?: string; caption: string }[] = [
  { src: "/images/photos/hackthefuture.jpg", caption: "MSA Hack-The-Future — RoadSense" },
  { src: "/images/photos/tutorlink.jpg", caption: "Dev.0 Closing Ceremony — Tutorlink" },
  { src: "/images/photos/youthday.jpg", caption: "International Youth Day 2024 — SCFS" },
];

export default function Community() {
  return (
    <section id="community" className="section-alt px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1700px]">
        <SectionHeading
          kicker="Community"
          title="Giving back."
          subtitle="Mentorship, tutoring, and student leadership beyond the code."
        />

        {/* Role cards */}
        <div className="mx-auto mt-12 grid max-w-[94%] gap-5 md:grid-cols-2 lg:grid-cols-3">
          {communityRoles.map((c, i) => (
            <FadeInUp key={`${c.org}-${c.role}`} delay={i * 0.05}>
              <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-[border-color,box-shadow] hover:border-violet-400/60 hover:ring-1 hover:ring-violet-400/40">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-snug text-foreground">
                      {c.role}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-[#a1a1aa]">{c.org}</p>
                  </div>
                  {c.bilingual && (
                    <span className="shrink-0 rounded-full border border-violet-400/40 bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-300">
                      EN / FR
                    </span>
                  )}
                </div>

                <p className="mt-1 font-mono text-[11px] text-muted">{c.period}</p>

                <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
                  {c.description}
                </p>

                {/* Links (above) + tags pinned to the bottom — links sit just
                    above the tag row, lined up across cards. */}
                <div className="mt-auto flex flex-col gap-3 pt-4">
                  {c.links && c.links.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {c.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-400 transition-colors hover:text-violet-300"
                        >
                          {link.label}
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {c.tags.map((tag) => (
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
            </FadeInUp>
          ))}
        </div>

        {/* Moments — event photo strip, each labelled beneath. */}
        <FadeInUp delay={0.1}>
          <div className="mx-auto mt-8 grid max-w-[1140px] gap-4 sm:grid-cols-3">
            {MOMENTS.map((m) => (
              <figure key={m.caption}>
                <PhotoSlot src={m.src} alt={m.caption} className="aspect-[4/3]" />
                <figcaption className="mt-2 text-center text-xs font-medium text-muted">
                  {m.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
