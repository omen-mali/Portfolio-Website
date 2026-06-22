import type { ReactNode } from "react";
import FadeInUp from "@/components/ui/FadeInUp";
import PhotoSlot from "@/components/ui/PhotoSlot";
import SectionHeading from "@/components/ui/SectionHeading";

// Quick-summary items shown in the raised overview card.
const SUMMARY = [
  {
    label: "Coursework",
    value:
      "Operating Systems · Real-Time Systems · Computer Architecture · Embedded SW",
  },
  { label: "Societies", value: "Accountability Officer & Dev.0 Mentor @ SCESoc" },
  { label: "Tutorship", value: "Math & Calculus Tutor @ Jaku Konbit (Black Star Program)" },
  { label: "Clearances", value: "RCMP Enhanced Reliability · CRA Reliability" },
];

// Headline achievements (number-forward) shown beneath the summary.
const HIGHLIGHTS = [
  { value: "3+", label: "Co-op Terms" },
  { value: "100+", label: "Protocol artifacts generated @ Siemens-Healthineers" },
  { value: "2024", label: "Int'l Youth Day Leadership Award — Innovation" },
];

// Quick socials shown beneath the avatar.
const SOCIALS: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "GitHub",
    href: "https://github.com/omen-mali",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/momen-m-ali/",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:momen.musa.ali@gmail.com",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-10 7L2 7" />
      </svg>
    ),
  },
];

export default function About() {
  return (
    <section id="about" className="px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1700px]">
        <SectionHeading kicker="About" />

        {/* Identity (photo + socials + name) and blurb on the left; the
            overview card sits beside them on the right. */}
        <div className="mx-auto mt-12 grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:items-stretch">
          {/* LEFT — identity + heading + blurb */}
          <div>
            <FadeInUp>
              <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
                {/* Circular photo with quick socials beneath */}
                <div className="flex shrink-0 flex-col items-center gap-3">
                  <PhotoSlot
                    rounded="rounded-full"
                    className="h-32 w-32 sm:h-40 sm:w-40"
                    sizes="160px"
                  />
                  <div className="flex items-center gap-2">
                    {SOCIALS.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target={s.href.startsWith("http") ? "_blank" : undefined}
                        rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        aria-label={s.label}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-violet-400 hover:text-foreground"
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Name beside the photo */}
                <div className="sm:pt-2">
                  <h2 className="text-3xl font-bold text-white md:text-4xl">Momen Ali</h2>
                  <p className="mt-1.5 font-mono text-base text-violet-300">
                    Computer Systems Engineer
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                    Embedded &amp; real-time systems · Application software · IT platforms
                  </p>
                </div>
              </div>
            </FadeInUp>

            {/* Smaller heading leading the blurb */}
            <FadeInUp delay={0.15}>
              <h3 className="mt-10 text-xl font-semibold text-white md:text-2xl">
                At the hardware–software intersection.
              </h3>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
                I&apos;m a Computer Systems Engineering student at Carleton
                University (B.Eng., Co-op), focused on embedded &amp; real-time
                systems and high-level software. I recently completed two co-op
                terms at Epocal, Siemens Healthineers, building firmware in C/C++
                and desktop tooling in C# for the epoc&reg; Blood Analysis System.
                Currently, I&apos;m working on IT test platform software at the
                Canada Revenue Agency.
              </p>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
                My work lives at the intersection of hardware and software: from
                QNX RTOS applications on Raspberry Pi to YOLOv8 computer-vision
                pipelines, from microcontroller programming to cross-platform
                code-generation tools. I focus on writing deterministic,
                reliable code and systems that work when it matters.
              </p>
            </FadeInUp>
          </div>

          {/* RIGHT — overview card */}
          <FadeInUp delay={0.2}>
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-xl md:p-8">
              {/* Education header */}
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-semibold text-foreground">
                  Carleton University
                </h3>
                <span className="font-mono text-xs text-muted">Sep 2022 — Present</span>
              </div>
              <p className="mt-0.5 text-sm text-violet-300">
                Computer Systems Engineering (B.Eng., Co-op)
              </p>

              {/* Summary */}
              <div className="mt-7 grid gap-3.5">
                {SUMMARY.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-border bg-white/[0.02] p-4 transition-[border-color,box-shadow] hover:border-violet-400/60 hover:ring-1 hover:ring-violet-400/40"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                      {s.label}
                    </p>
                    <p className="mt-1.5 text-sm leading-snug text-foreground">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Major achievements — pinned to the card bottom so it meets the
                  blurb's last line when the pane stretches. */}
              <div className="mt-auto grid grid-cols-3 gap-3 pt-4">
                {HIGHLIGHTS.map((h) => (
                  <div
                    key={h.label}
                    className="rounded-xl border border-violet-400/20 bg-violet-500/[0.06] p-3"
                  >
                    <p className="text-xl font-bold text-foreground">{h.value}</p>
                    <p className="mt-1 text-[12px] leading-snug text-muted">{h.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeInUp>
        </div>

      </div>
    </section>
  );
}
