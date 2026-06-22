"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogoMark } from "@/components/ui/Logo";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useActiveSection } from "@/lib/useActiveSection";

// Desktop keeps the shorter curated list; the mobile menu carries every
// section (it's the only wayfinding on small screens — the side dots are md+).
const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Community", href: "/#community" },
  { label: "Interests", href: "/#interests" },
  { label: "Contact", href: "/#contact" },
];

const MOBILE_NAV_LINKS = [
  { label: "Terminal", href: "/#terminal" },
  { label: "About", href: "/#about" },
  { label: "At a Glance", href: "/#showcase" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Skills", href: "/#skills" },
  { label: "Community", href: "/#community" },
  { label: "Interests", href: "/#interests" },
  { label: "Contact", href: "/#contact" },
];

const RESUME_URL = "/resume.pdf";

const externalArrow = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Section id for a hash link like "/#about" → "about" (non-hash links → null).
const hashId = (href: string) => (href.startsWith("/#") ? href.slice(2) : null);

function NavLink({
  href,
  onClick,
  className,
  ariaCurrent,
  children,
}: {
  href: string;
  onClick?: () => void;
  className?: string;
  ariaCurrent?: "location";
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (href.startsWith("/#") && pathname === "/") {
    return (
      <a
        href={href}
        aria-current={ariaCurrent}
        onClick={(e) => {
          e.preventDefault();
          const id = href.slice(2); // strip leading /#
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
          window.history.replaceState(null, "", "/");
          onClick?.();
        }}
        className={className}
      >
        {children}
      </a>
    );
  }

  if (href.startsWith("/#")) {
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          onClick?.();
          const id = href.slice(2); // strip leading /#
          // Validate before persisting — prevents selector injection if href is ever dynamic
          if (/^[a-zA-Z0-9_-]+$/.test(id)) {
            sessionStorage.setItem("scrollTo", `#${id}`);
          }
          window.location.assign("/");
        }}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const activeSection = useActiveSection();
  // Active highlighting only makes sense on the home page sections.
  const activeId = pathname === "/" ? activeSection : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = (href: string) => {
    const isActive = activeId !== null && hashId(href) === activeId;
    return {
      isActive,
      className: `border-b pb-0.5 text-sm transition-colors ${
        isActive
          ? "border-violet-400/70 text-foreground"
          : "border-transparent text-muted hover:text-foreground"
      }`,
    };
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-40 px-6 transition-colors duration-300 md:px-12 ${
        scrolled
          ? "bg-[#0a0a0a]/80 backdrop-blur-md border-b border-border"
          : ""
      }`}
    >
      <nav className="mx-auto flex max-w-[1700px] items-center justify-between py-4">
        <NavLink href="/#hero" className="inline-flex items-center">
          <LogoMark size={52} />
        </NavLink>

        {/* Right side — desktop links, theme toggle (top-right), mobile menu */}
        <div className="flex items-center gap-3">
          {/* Desktop nav */}
          <div className="hidden items-center gap-7 md:flex">
            <ul className="flex items-center gap-7">
              {NAV_LINKS.map((link) => {
                const { isActive, className } = linkClass(link.href);
                return (
                  <li key={link.href}>
                    <NavLink
                      href={link.href}
                      className={className}
                      ariaCurrent={isActive ? "location" : undefined}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-sm text-foreground transition-colors hover:border-muted hover:bg-white/5"
            >
              Resume
              {externalArrow}
            </a>
          </div>

          {/* Joke dark/light toggle — always visible, top-right */}
          <ThemeToggle />

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span
              aria-hidden="true"
              className={`h-0.5 w-5 bg-foreground transition-transform ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              aria-hidden="true"
              className={`h-0.5 w-5 bg-foreground transition-opacity ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              aria-hidden="true"
              className={`h-0.5 w-5 bg-foreground transition-transform ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-border bg-[#0a0a0a]/95 backdrop-blur-md md:hidden"
        >
          <ul className="flex flex-col gap-4 px-6 py-6">
            {MOBILE_NAV_LINKS.map((link) => {
              const { isActive, className } = linkClass(link.href);
              return (
                <li key={link.href}>
                  <NavLink
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={className}
                    ariaCurrent={isActive ? "location" : undefined}
                  >
                    {link.label}
                  </NavLink>
                </li>
              );
            })}
            <li>
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center gap-1.5 text-sm text-foreground transition-colors hover:text-violet-300"
              >
                Resume
                {externalArrow}
              </a>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}
