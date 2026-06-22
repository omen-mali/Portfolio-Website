"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { projects } from "@/content/projects";
import { experiences } from "@/content/experience";
import { communityRoles } from "@/content/community";
import { skillCategories } from "@/content/skills";
import FadeInUp from "@/components/ui/FadeInUp";
import SectionHeading from "@/components/ui/SectionHeading";

const PROMPT = "visitor@momen:~$";
const RESUME_URL = "/resume.pdf";

interface Line {
  id: number;
  node: ReactNode;
}

let lineId = 0;
const mk = (node: ReactNode): Line => ({ id: lineId++, node });

const COMMANDS = [
  "help",
  "about",
  "skills",
  "projects",
  "experience",
  "community",
  "contact",
  "resume",
  "whoami",
  "ls",
  "neofetch",
  "clear",
] as const;

const out = (text: string) => <span className="text-muted">{text}</span>;
const accent = (text: string) => <span className="text-violet-300">{text}</span>;

// Detailed Jedi Order emblem, half-block rasterised from the SVG glyph
// (ui/JediEmblem.tsx) at 77 cols × 48 rows. Odd width keeps the saber tip a
// single, perfectly-centred character that sharpens to the peak.
const JEDI_ASCII = [
  "                  ▄▀                                     ▀▄",
  "                ▄█▀                                       ▀█▄",
  "               ▄█▀                    ▄                    ▀█▄",
  "              ███                     █                     ███",
  "            ▄███▀                     █                     ▀███▄",
  "           ▄████                      █                      ████▄",
  "          ▄█████                      █                      █████▄",
  "          ██████                      █                      ██████",
  "         ███████▄                     █                     ▄███████",
  "        █████████                     █                     █████████",
  "    █   █████████▄                    █                    ▄█████████   █",
  "   ▄   ███████████                    █                    ███████████   ▄",
  "   █   ███████████▄                   █                   ▄███████████   █",
  "  █    ████████████▄                  █                  ▄████████████    █",
  "  █    █████████████▄                 █                 ▄█████████████    █",
  " ██    ██████████████▄                █                ▄██████████████    ██",
  " ███   ███████████████▄               █               ▄███████████████   ███",
  " ███   ████████████████▄              █              ▄████████████████   ███",
  "████   ██████████████████             █             ██████████████████   ████",
  "█████  ▀████████████████              █              ████████████████▀  █████",
  "█████▄  ███████████████               █               ███████████████  ▄█████",
  "██████▄ ▀█████████████▀              ███              ▀█████████████▀ ▄██████",
  "▀██████  █████████████               ███               █████████████  ██████▀",
  " ███████ ▀███████████▀               ███               ▀███████████▀ ███████",
  " ████████▄▀██████████                ███                ██████████▀▄████████",
  " ▀████████▄▀█████████           ▄    ███    ▄           █████████▀▄████████▀",
  "▄ █████████▄▀████████            █   ███   █            ████████▀▄█████████ ▄",
  " ▄▀██████████████████            ██  ███  ██            ██████████████████▀▄",
  " █▄▀█████████████████             ██ ███ ██             █████████████████▀▄█",
  " ▀█▄█████████████████             ▀███████▀             █████████████████▄█▀",
  "  ██▄████████████████             ▄███████▄             ████████████████▄██",
  "   ██▄███████████████     ▄▄█████████████████████▄▄     ██████████████████",
  "   ▀█████████████████▄          ▀▀▀███████▀▀▀          ▄██████████████▄██▀",
  "    ▀█████████████████            ▄███████▄            █████████████████▀",
  "     ██████████████████          ▄██ ███ ██▄          ██████████████████",
  "      ██████████████████        ▄█▀  ███  ▀█▄        ██████████████████",
  "       ▀█████████████████       ▀    ███    ▀       █████████████████▀",
  "        ▀█████████████████▄          ███          ▄█████████████████▀",
  "          █████████████████▄         ███         ▄█████████████████",
  "           ▀█████████████████▄       ███       ▄█████████████████▀",
  "             ▀▀████████████████▄     ███     ▄████████████████▀▀",
  "                ▀████████████████▄  ▄███▄  ▄████████████████▀",
  "                  ▀▀███████████████▄█████▄███████████████▀▀",
  "                      ▀▀█████████████████████████████▀▀",
  "                           ▀▀▀▀▀█████████████▀▀▀▀▀",
].join("\n");

// neofetch-style profile rows (key, value).
const NEOFETCH_INFO: [string, string][] = [
  ["OS", "Galaxy Linux (Next.js 16 · React 19)"],
  ["Host", "momenali.com"],
  ["Kernel", "Computer Systems Eng. @ Carleton"],
  ["Uptime", "building since 2022"],
  ["Co-ops", "RCMP · Siemens Healthineers · CRA"],
  ["Langs", "C · C++ · C# · Java · Python"],
  ["Systems", "QNX Neutrino · Linux · STM32 M7/M4 · RPI 4"],
  ["Stack", ".NET · Maven · Gradle · JFrog · Jenkins"],
  ["Tools", "Git · Azure DevOps · IAR · PowerShell"],
  ["Community", "Jaku Konbit · SCESoc · FYC"],
  ["Theme", "violet on near-black / white"],
];

// Website colour palette — violet ramp + accents/neutrals (neofetch swatch rows).
const PALETTE: string[][] = [
  ["#ede9fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95"],
  ["#34d399", "#2dd4bf", "#38bdf8", "#f472b6", "#fafafa", "#a1a1aa", "#3f3f46", "#0a0a0a"],
];

function helpOutput(): ReactNode {
  const rows: [string, string][] = [
    ["ls", "list directories"],
    ["help", "list available commands"],
    ["about", "who I am"],
    ["skills", "languages, tools & platforms"],
    ["projects", "personal & academic builds"],
    ["experience", "professional roles"],
    ["community", "mentorship & giving back"],
    ["contact", "how to reach me"],
    ["resume", "open my resume"],
    ["whoami", "?"],
    ["clear", "clear the screen"],
    ["neofetch", "system information"],
  ];
  return (
    <div className="flex flex-col gap-0.5">
      {rows.map(([cmd, desc]) => (
        <div key={cmd}>
          {accent(cmd.padEnd(12))}
          {out(desc)}
        </div>
      ))}
    </div>
  );
}

function processCommand(raw: string): { node: ReactNode; clear?: boolean } {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return { node: null };

  switch (cmd) {
    case "help":
      return { node: helpOutput() };
    case "clear":
      return { node: null, clear: true };
    case "about":
      return {
        node: out(
          "Momen Ali | Computer Systems Engineering student at Carleton University (Co-op). I work at the intersection of hardware and software: embedded firmware in C/C++, real-time systems on QNX, and tooling in C#/Java/Python.",
        ),
      };
    case "skills":
      return {
        node: (
          <div className="flex flex-col gap-1">
            {skillCategories.map((c) => (
              <div key={c.name}>
                {accent(c.name + ": ")}
                {out(c.skills.join(", "))}
              </div>
            ))}
          </div>
        ),
      };
    case "projects":
      return {
        node: (
          <div className="flex flex-col gap-0.5">
            {projects.map((p) => (
              <div key={p.slug}>
                {accent("• " + p.title)}
                {out(p.category ? `  (${p.category})` : "")}
              </div>
            ))}
          </div>
        ),
      };
    case "experience":
      return {
        node: (
          <div className="flex flex-col gap-0.5">
            {experiences.map((e) => (
              <div key={`${e.company}-${e.role}`}>
                {accent("• " + e.role)}
                {out(` — ${e.company} (${e.period})`)}
              </div>
            ))}
          </div>
        ),
      };
    case "community":
      return {
        node: (
          <div className="flex flex-col gap-0.5">
            {communityRoles.map((c) => (
              <div key={`${c.org}-${c.role}`}>
                {accent("• " + c.role)}
                {out(` — ${c.org} (${c.period})`)}
              </div>
            ))}
          </div>
        ),
      };
    case "contact":
      return {
        node: (
          <div className="flex flex-col gap-0.5">
            <div>
              {accent("email    ")}
              <a href="mailto:momen.musa.ali@gmail.com" className="text-violet-400 hover:text-violet-300">
                momen.musa.ali@gmail.com
              </a>
            </div>
            <div>
              {accent("linkedin ")}
              <a href="https://www.linkedin.com/in/momen-m-ali/" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">
                linkedin.com/in/momen-m-ali
              </a>
            </div>
            <div>
              {accent("github   ")}
              <a href="https://github.com/omen-mali" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">
                github.com/omen-mali
              </a>
            </div>
          </div>
        ),
      };
    case "resume":
      if (typeof window !== "undefined") window.open(RESUME_URL, "_blank");
      return { node: out("Opening Resume in a new tab… (also linked in the navbar)") };
    case "whoami":
      return { node: out("a curious visitor, and I'd bet, a fellow systems enjoyer.") };
    case "ls":
      return { node: out("about  experience  projects  community  contact  resume") };
    case "neofetch":
      return {
        node: (
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
            <pre
              className="shrink-0 text-[6px] leading-[1] sm:text-[7px]"
              style={{
                backgroundImage: "var(--ascii-emblem-gradient)",
                backgroundSize: "250% 250%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                animation: "hero-gradient-flow 4s ease-in-out infinite",
              }}
            >
              {JEDI_ASCII}
            </pre>
            <div className="flex flex-col gap-0.5">
              <div>
                <span className="text-emerald-400">visitor</span>
                <span className="text-muted">@</span>
                <span className="text-emerald-400">momenali.com</span>
              </div>
              <div className="text-muted">{"─".repeat(22)}</div>
              {NEOFETCH_INFO.map(([k, v]) => (
                <div key={k}>
                  {accent(k.padEnd(11))}
                  {out(v)}
                </div>
              ))}
              <div className="mt-2 flex flex-col gap-1">
                {PALETTE.map((row, ri) => (
                  <div key={`palette-row-${ri}`} className="flex">
                    {row.map((c) => (
                      <span
                        key={c}
                        className="inline-block h-3 w-4"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ),
      };
    case "sudo":
    case "sudo su":
      return { node: out("🔒 Permission denied: nice try.") };
    default:
      return {
        node: (
          <span className="text-muted">
            {accent(raw.trim())} : command not found. Type {accent("help")} for options.
          </span>
        ),
      };
  }
}

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>(() => [
    mk(out("Welcome to my terminal. Type 'help' to get started.")),
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [view, setView] = useState<"open" | "minimized" | "closed">("open");
  const [maximized, setMaximized] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines, view, maximized]);

  function run(raw: string) {
    const { node, clear } = processCommand(raw);
    const echo = mk(
      <span>
        <span className="text-emerald-400">{PROMPT}</span> <span className="text-foreground">{raw}</span>
      </span>,
    );
    if (clear) {
      setLines([]);
      return;
    }
    setLines((prev) => [...prev, echo, ...(node ? [mk(node)] : [])]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const value = input;
      if (value.trim()) {
        setHistory((h) => [...h, value]);
        setHistIdx(-1);
      }
      run(value);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next);
      setInput(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === -1) return;
      const next = histIdx + 1;
      if (next >= history.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(next);
        setInput(history[next]);
      }
    }
  }

  return (
    <section id="terminal" className="px-6 pb-20 pt-28 md:px-12 md:pb-28 md:pt-48">
      <div className="mx-auto max-w-[1700px]">
        <SectionHeading kicker="Terminal" />

        <FadeInUp delay={0.05} className="mt-10 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">HOME Terminal</h2>
          <p className="mx-auto mt-3 max-w-xl text-lg font-medium text-violet-500 md:text-xl">
            Explore it the systems way.
          </p>
          <p className="mx-auto mt-1.5 text-sm text-muted">
            Prefer a command line? Type{" "}
            <span className="font-mono text-violet-300">help</span>.
          </p>
        </FadeInUp>
      </div>

      <div className="mx-auto max-w-4xl">
        <FadeInUp delay={0.1}>
          {view === "closed" ? (
            <button
              onClick={() => setView("open")}
              className="mt-8 rounded-lg border border-border bg-card px-4 py-2 font-mono text-sm text-muted transition-colors hover:border-muted hover:text-foreground"
            >
              ▸ Reopen terminal
            </button>
          ) : (
            <div className="term-window mt-8 overflow-hidden rounded-xl border border-border bg-[#0a0a0a] shadow-xl">
              {/* Title bar — Ubuntu/GNOME controls on the right */}
              <div className="flex items-center justify-between border-b border-border bg-white/[0.04] px-4 py-2">
                <span className="font-mono text-xs text-muted">visitor@momen: ~</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setView("minimized")}
                    aria-label="Minimize terminal"
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[11px] leading-none text-muted transition-colors hover:bg-white/20 hover:text-foreground"
                  >
                    <span aria-hidden="true">–</span>
                  </button>
                  <button
                    onClick={() => {
                      setMaximized((m) => !m);
                      setView("open");
                    }}
                    aria-label="Maximize terminal"
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[9px] leading-none text-muted transition-colors hover:bg-white/20 hover:text-foreground"
                  >
                    <span aria-hidden="true">▢</span>
                  </button>
                  <button
                    onClick={() => setView("closed")}
                    aria-label="Close terminal"
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[11px] leading-none text-muted transition-colors hover:bg-[#E95420] hover:text-white"
                  >
                    <span aria-hidden="true">✕</span>
                  </button>
                </div>
              </div>

              {/* Body */}
              {view === "open" && (
                <div
                  ref={bodyRef}
                  onClick={() => inputRef.current?.focus()}
                  className={`overflow-y-auto p-4 font-mono text-[13px] leading-relaxed transition-[height] duration-300 ${
                    maximized ? "h-[34rem] md:h-[40rem]" : "h-80 md:h-100"
                  }`}
                >
                  {lines.map((l) => (
                    <div key={l.id} className="whitespace-pre-wrap break-words">
                      {l.node}
                    </div>
                  ))}

                  {/* Input line */}
                  <div className="mt-1 flex items-center gap-2">
                    <span className="shrink-0 text-emerald-400">{PROMPT}</span>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      spellCheck={false}
                      autoComplete="off"
                      aria-label="Terminal input"
                      className="terminal-caret flex-1 bg-transparent text-foreground outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </FadeInUp>
      </div>
    </section>
  );
}
