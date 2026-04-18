import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  const { password } = await request.json();
  const sitePassword = process.env.SITE_PASSWORD;

  // Reject if no password configured, or if submitted password is not a string
  if (!sitePassword || typeof password !== "string") {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // Constant-time comparison prevents timing attacks
  const match =
    password.length === sitePassword.length &&
    crypto.timingSafeEqual(Buffer.from(password), Buffer.from(sitePassword));

  if (!match) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("site-auth", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
