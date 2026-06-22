import { NextResponse } from "next/server";
import crypto from "crypto";

// Best-effort in-memory rate limit on login attempts. NOTE: on serverless
// (e.g. Vercel) this state is per-instance and resets on cold start — for
// robust limiting, back it with a shared store (Vercel KV / Upstash Ratelimit).
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 10;
const attempts = new Map<string, { count: number; first: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || now - record.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: now });
    return false;
  }
  record.count += 1;
  return record.count > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const password = (body as { password?: unknown })?.password;
  const sitePassword = process.env.SITE_PASSWORD;
  const authToken = process.env.SITE_AUTH_TOKEN;

  // Reject if auth isn't fully configured, or if the submitted password is not
  // a string. BOTH the password and the secret cookie token must be present.
  if (!sitePassword || !authToken || typeof password !== "string") {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // Constant-time comparison prevents timing attacks. Compare on byte length
  // (not character length) so multibyte input can't make timingSafeEqual throw.
  const submitted = Buffer.from(password);
  const expected = Buffer.from(sitePassword);
  const match =
    submitted.length === expected.length &&
    crypto.timingSafeEqual(submitted, expected);

  if (!match) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("site-auth", authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
