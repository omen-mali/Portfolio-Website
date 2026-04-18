import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Block blog routes until fully implemented
  if (request.nextUrl.pathname.startsWith("/blog")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const password = process.env.SITE_PASSWORD;

  // If no password is set, allow all requests (protection disabled)
  if (!password) {
    return NextResponse.next();
  }

  // Allow the login page and login API through
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/api/login"
  ) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const authCookie = request.cookies.get("site-auth");
  if (authCookie?.value === "authenticated") {
    return NextResponse.next();
  }

  // Redirect to login
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|sitemap.xml|robots.txt).*)",
  ],
};
