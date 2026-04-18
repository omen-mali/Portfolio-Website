import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options",  value: "nosniff" },
  // Deny framing (clickjacking protection)
  { key: "X-Frame-Options",         value: "DENY" },
  // Strict referrer for outbound links
  { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
  // Disable browser features not used by this site
  { key: "Permissions-Policy",      value: "camera=(), microphone=(), geolocation=()" },
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
