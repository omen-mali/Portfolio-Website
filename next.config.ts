import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy. 'unsafe-inline' is required for the inline styles the
// site uses (ASCII gradient, framer-motion) and Next's inline bootstrap script.
// In development, 'unsafe-eval' and ws: are added so Next's HMR keeps working;
// production stays strict. A nonce-based policy would be stricter but needs
// per-request wiring.
const csp = [
  "default-src 'self'",
  "img-src 'self' data: https:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options",  value: "nosniff" },
  // Deny framing (clickjacking protection)
  { key: "X-Frame-Options",         value: "DENY" },
  // Strict referrer for outbound links
  { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
  // Disable browser features not used by this site
  { key: "Permissions-Policy",      value: "camera=(), microphone=(), geolocation=()" },
  // Force HTTPS for two years, including subdomains
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Baseline content-security-policy (see note above)
  { key: "Content-Security-Policy",   value: csp },
];

const nextConfig: NextConfig = {
  // Optimize images with modern formats
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Enable compression
  compress: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
