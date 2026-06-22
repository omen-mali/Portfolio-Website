import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Blog routes are not publicly served — send visitors home
  if (request.nextUrl.pathname.startsWith("/blog")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const password = process.env.SITE_PASSWORD;
  const authToken = process.env.SITE_AUTH_TOKEN;

  // If protection isn't fully configured, allow all requests (gate disabled).
  // Both the password and the secret cookie token must be set.
  if (!password || !authToken) {
    return NextResponse.next();
  }

  // Allow the login page and login API through
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/api/login"
  ) {
    return NextResponse.next();
  }

  // Check for the auth cookie. Its value is a high-entropy secret token
  // (SITE_AUTH_TOKEN) held only in the server env, so it cannot be forged by
  // anyone reading the public source.
  const authCookie = request.cookies.get("site-auth");
  if (authCookie?.value === authToken) {
    return NextResponse.next();
  }

  // Redirect to login
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
