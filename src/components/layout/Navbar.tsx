"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import IconParticles from "@/components/ui/IconParticles";

const ICON_EXPAND_ENABLED = false;

const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Showcase", href: "/#showcase" },
  { label: "Contact", href: "/#contact" },
];

function rampPlaybackRate(
  anim: Animation,
  target: number,
  durationMs: number,
) {
  const start = anim.playbackRate;
  const t0 = performance.now();
  function step() {
    const p = Math.min(1, (performance.now() - t0) / durationMs);
    const eased = 1 - (1 - p) * (1 - p);
    anim.playbackRate = start + (target - start) * eased;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function NavLink({
  href,
  onClick,
  className,
  children,
}: {
  href: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (href.startsWith("/#") && pathname === "/") {
    return (
      <a
        href={href}
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
  const [iconAnimating, setIconAnimating] = useState(false);
  const [animDuration, setAnimDuration] = useState(1);
  const ringGradientRef = useRef<HTMLSpanElement>(null);

  const handleIconClick = useCallback(() => {
    if (iconAnimating) return;

    const scrollY = window.scrollY;
    const pageHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollRatio = pageHeight > 0 ? scrollY / pageHeight : 0;
    const duration = scrollY < 50 ? 1.0 : 0.8 + (1 - scrollRatio) * 1.2;

    setAnimDuration(duration);
    setIconAnimating(true);

    const ringEl = ringGradientRef.current;
    if (ringEl) {
      const anims = ringEl.getAnimations();
      if (anims.length > 0) {
        const anim = anims[0];
        anim.playbackRate = 8;
        setTimeout(
          () => rampPlaybackRate(anim, 1, 400),
          duration * 0.6 * 1000,
        );
      }
    }

    setTimeout(() => setIconAnimating(false), duration * 1000 + 50);
  }, [iconAnimating]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/80 backdrop-blur-md border-b border-border"
          : ""
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <NavLink
          href="/#hero"
          onClick={handleIconClick}
          className="inline-flex items-center gap-2 font-mono text-sm font-bold tracking-wider text-foreground"
        >
          <span
            className={`relative inline-flex shrink-0 ${ICON_EXPAND_ENABLED && iconAnimating ? "icon-expanding" : ""}`}
            style={
              { "--expand-duration": `${animDuration}s` } as React.CSSProperties
            }
          >
            <IconParticles size={60} />
            <span className="icon-nav-ring inline-flex rounded-full p-[3px]">
              <span
                ref={ringGradientRef}
                className="icon-ring-gradient"
                aria-hidden="true"
              />
              <span className="overflow-hidden rounded-full bg-background">
                <Image
                  src="/images/branding/omen-icon-squared.png"
                  alt="Momen Ali logo"
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                  priority
                />
              </span>
            </span>
          </span>
        </NavLink>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <NavLink
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
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
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-border bg-[#0a0a0a]/95 backdrop-blur-md md:hidden"
        >
          <ul className="flex flex-col gap-4 px-6 py-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}
