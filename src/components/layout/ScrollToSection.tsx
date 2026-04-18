"use client";

import { useEffect } from "react";

export default function ScrollToSection() {
  useEffect(() => {
    const raw = sessionStorage.getItem("scrollTo");
    // Validate: only allow simple IDs (alphanumeric, hyphen, underscore)
    // This prevents CSS selector injection from a tainted sessionStorage value
    if (raw && /^#[a-zA-Z0-9_-]+$/.test(raw)) {
      sessionStorage.removeItem("scrollTo");
      // Small delay to let the page render
      requestAnimationFrame(() => {
        document.getElementById(raw.slice(1))?.scrollIntoView({ behavior: "smooth" });
        // Keep URL clean
        window.history.replaceState(null, "", "/");
      });
    } else if (raw) {
      sessionStorage.removeItem("scrollTo"); // discard invalid value
    }
  }, []);

  return null;
}
