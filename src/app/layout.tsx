import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import StarField from "@/components/layout/StarField";
import CustomCursor from "@/components/layout/CustomCursor";
import JsonLd from "@/components/layout/JsonLd";
import BackgroundProvider from "@/components/layout/BackgroundProvider";
import BackgroundToggle from "@/components/layout/BackgroundToggle";
import BackgroundDots from "@/components/layout/BackgroundDots";
import HyperspaceField from "@/components/layout/HyperspaceField";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://momenali.com";

export const metadata: Metadata = {
  title: {
    default: "Momen Ali | Tech Enthusiast",
    template: "%s | Momen Ali",
  },
  description:
    "Embedded Software Developer & Systems Programmer specializing in QNX, Linux, C#, Python, and Java.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Momen Ali",
    title: "Momen Ali | Software Engineer",
    description:
      "Embedded Software Engineer & Systems Programmer specializing in QNX, Linux, C#, Python, and Java.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Momen Ali | Software Engineer",
    description:
      "Embedded Software Engineer & Systems Programmer specializing in QNX, Linux, C#, Python, and Java.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="relative min-h-screen bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:outline-none"
        >
          Skip to content
        </a>
        <JsonLd />
        <BackgroundProvider>
          <StarField />
          <HyperspaceField />
          <BackgroundDots />
          <BackgroundToggle />
        </BackgroundProvider>
        <CustomCursor />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
