"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/content/projects";
import { achievements } from "@/content/achievements";
import { skillCategories } from "@/content/skills";
import { experiences } from "@/content/experience";
import { statusItems } from "@/content/status";
import FadeInUp from "@/components/ui/FadeInUp";

const HIDDEN_COMPANIES = ["Royal Canadian Mounted Police (RCMP)", "Midterm Rental Properties"];
const displayedExperiences = experiences.filter(
  (e) => !HIDDEN_COMPANIES.includes(e.company)
);

const TABS = ["Projects", "Experience", "Certifications", "Tech Stack"] as const;
type Tab = (typeof TABS)[number];

export default function Showcase() {
  const [activeTab, setActiveTab] = useState<Tab>("Projects");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [expandedExperience, setExpandedExperience] = useState<string | null>(null);

  return (
    <section id="showcase" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white/[0.03] p-8 md:p-10">
        <FadeInUp>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            At a Glance
          </h2>
          <p className="mt-2 text-muted">
            Projects, certifications, and tech stack in one place.
          </p>
        </FadeInUp>

        {/* Tab buttons */}
        <FadeInUp delay={0.1}>
          <div className="mt-8 flex gap-1 rounded-xl border border-border bg-card p-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 rounded-lg bg-white/10"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </FadeInUp>

        {/* Tab content */}
        <FadeInUp delay={0.2}>
          <div className="mt-6 min-h-[320px]">
            <AnimatePresence mode="wait">
              {activeTab === "Projects" && (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-4"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                  {projects.map((p) => {
                    const isExpanded = expandedProject === p.slug;
                    const hasRepo = p.github && p.github !== "#";
                    return (
                      <div
                        key={p.slug}
                        onClick={() => setExpandedProject(isExpanded ? null : p.slug)}
                        className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-muted cursor-pointer select-none"
                      >
                        {/* Header row */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-foreground leading-snug">
                            {p.title}
                          </h3>
                          <motion.span
                            animate={{ rotate: isExpanded ? 45 : 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="mt-0.5 shrink-0 text-muted text-base leading-none"
                            aria-hidden="true"
                          >
                            +
                          </motion.span>
                        </div>

                        {/* Description — clamped when collapsed; whitespace-pre-line honours \n in content */}
                        <p className={`mt-2 text-xs leading-relaxed text-muted whitespace-pre-line transition-all ${isExpanded ? "" : "line-clamp-3"}`}>
                          {p.description}
                        </p>

                        {/* Animated expand row: contributors + View Repo */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              key="expanded-extras"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.22, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              {/* Contributors */}
                              {p.contributors && p.contributors.length > 0 && (
                                <div className="mt-3 flex flex-col gap-1 text-xs text-muted/70">
                                  <span>Credits:</span>
                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                    {p.contributors.map((c, i) => (
                                      <span key={c.username}>
                                        {c.name}{" "}
                                        <a
                                          href={c.href}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="font-mono text-violet-400 hover:text-violet-300 transition-colors"
                                        >
                                          @{c.username}
                                        </a>
                                        {i < p.contributors!.length - 1 && ","}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* View Repo */}
                              <div className="mt-3">
                                {hasRepo ? (
                                  <a
                                    href={p.github!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
                                  >
                                    View Repo
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                      <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </a>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted/50 cursor-default select-none">
                                    Repo coming soon
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Tags */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {p.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  </div>
                  <p className="text-center text-xs text-muted/40 italic">
                    More to be added soon...
                  </p>
                </motion.div>
              )}

              {activeTab === "Experience" && (
                <motion.div
                  key="experience"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="grid gap-4"
                >
                  {displayedExperiences.map((exp) => {
                    const isExpanded = expandedExperience === exp.role;
                    const hasLinks = exp.links && exp.links.length > 0;
                    return (
                      <div
                        key={exp.role}
                        onClick={() => setExpandedExperience(isExpanded ? null : exp.role)}
                        className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-muted cursor-pointer select-none"
                      >
                        {/* Header row */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3 min-w-0">
                            <h3 className="text-sm font-semibold text-foreground leading-snug">
                              {exp.role}
                            </h3>
                            <span className="font-mono text-xs text-muted shrink-0">
                              {exp.period}
                            </span>
                          </div>
                          <motion.span
                            animate={{ rotate: isExpanded ? 45 : 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="mt-0.5 shrink-0 text-muted text-base leading-none"
                            aria-hidden="true"
                          >
                            +
                          </motion.span>
                        </div>

                        <p className="mt-0.5 text-xs font-medium text-[#a1a1aa]">
                          {exp.company}
                        </p>

                        {/* Description — clamped when collapsed */}
                        <p className={`mt-2 text-xs leading-relaxed text-muted transition-all ${isExpanded ? "" : "line-clamp-3"}`}>
                          {exp.description}
                        </p>

                        {/* Animated links row */}
                        <AnimatePresence initial={false}>
                          {isExpanded && hasLinks && (
                            <motion.div
                              key="exp-links"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.22, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 flex flex-wrap gap-3">
                                {exp.links!.map((link) => (
                                  <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
                                  >
                                    {link.label}
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                      <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </a>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Tags */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {exp.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {activeTab === "Certifications" && (
                <motion.div
                  key="certs"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="grid gap-4 md:grid-cols-2"
                >
                  {achievements.map((a) => (
                    <div
                      key={a.title}
                      className="rounded-xl border border-border bg-card p-5"
                    >
                      <h3 className="text-sm font-semibold text-foreground">
                        {a.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted">{a.issuer}</p>
                      <p className="mt-1 font-mono text-xs text-muted">
                        {a.date}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "Tech Stack" && (
                <motion.div
                  key="stack"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="grid gap-4 md:grid-cols-2"
                >
                  {skillCategories.map((cat) => (
                    <div
                      key={cat.name}
                      className="rounded-xl border border-border bg-card p-5"
                    >
                      <h3 className="mb-3 text-xs font-semibold tracking-widest text-muted uppercase">
                        {cat.name}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-border px-3 py-1 text-xs text-foreground transition-colors hover:border-muted hover:bg-white/5"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeInUp>

        {/* What I'm up to — mini status */}
        <FadeInUp delay={0.3}>
          <div className="mt-12">
            <h3 className="text-sm font-semibold tracking-widest text-muted uppercase">
              What I&apos;m up to
            </h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {statusItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <span className="text-xl" aria-hidden="true">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-muted uppercase">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-sm text-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
