"use client";

import { useState } from "react";
import FadeInUp from "@/components/ui/FadeInUp";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Open mailto with pre-filled subject and body
    const subject = encodeURIComponent(
      `Portfolio Contact from ${formData.name}`
    );
    const body = encodeURIComponent(
      `From: ${formData.name} (${formData.email})\n\n${formData.message}`
    );
    window.location.href = `mailto:momen.musa.ali@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <section id="contact" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl rounded-2xl bg-[#111111]/85 p-8 md:p-10">
        <FadeInUp>
          <h2 className="hero-gradient-text-breathe bg-[linear-gradient(135deg,#c4b5fd,#8b5cf6,#6366f1,#4f46e5,#6366f1,#8b5cf6,#c4b5fd)] bg-clip-text text-center text-3xl font-bold md:text-4xl text-transparent">
            Get in Touch
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-lg text-muted">
            Interested in working together or have a question? Feel free to
            reach out.
          </p>
        </FadeInUp>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          {/* Contact form */}
          <FadeInUp delay={0.2}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  placeholder="What would you like to discuss?"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {submitted ? "Opening email client..." : "Send Message"}
              </button>
            </form>
          </FadeInUp>

          {/* Connect with me */}
          <FadeInUp delay={0.3}>
            <div>
              <h3 className="text-sm font-semibold tracking-widest text-muted uppercase">
                Connect with me
              </h3>
              <div className="mt-6 space-y-4">
                <a
                  href="mailto:momen.musa.ali@gmail.com"
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-muted hover:bg-white/5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-t from-indigo-500 via-violet-600 to-violet-400 p-[1.5px] icon-gradient-ring">
                    <div className="flex h-full w-full items-center justify-center rounded-[calc(0.5rem-1.5px)] bg-card">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400" aria-hidden="true">
                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                        <path d="M22 7l-10 7L2 7"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-xs text-muted">
                      momen.musa.ali@gmail.com
                    </p>
                  </div>
                </a>
                <a
                  href="https://www.linkedin.com/in/momen-m-ali/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-muted hover:bg-white/5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-t from-indigo-500 via-violet-600 to-violet-400 p-[1.5px] icon-gradient-ring">
                    <div className="flex h-full w-full items-center justify-center rounded-[calc(0.5rem-1.5px)] bg-card">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-violet-400" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      LinkedIn
                    </p>
                    <p className="text-xs text-muted">linkedin.com/in/momen-m-ali</p>
                  </div>
                </a>
                <a
                  href="https://github.com/omen-mali"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-muted hover:bg-white/5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-t from-indigo-500 via-violet-600 to-violet-400 p-[1.5px] icon-gradient-ring">
                    <div className="flex h-full w-full items-center justify-center rounded-[calc(0.5rem-1.5px)] bg-card">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-violet-400" aria-hidden="true">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      GitHub
                    </p>
                    <p className="text-xs text-muted">github.com/omen-mali</p>
                  </div>
                </a>
              </div>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}
