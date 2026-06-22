import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.25em] text-violet-400">
        404
      </p>
      <h1 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">
        These aren&apos;t the pages you&apos;re looking for.
      </h1>
      <p className="mt-3 max-w-md text-muted">
        The page you requested doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105"
      >
        Return home
      </Link>
    </main>
  );
}
