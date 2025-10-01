import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const url = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 1. If no token (not logged in)
  if (!token) {
    // allow hitting the login page itself
    if (url.pathname.startsWith("/login")) {
      return NextResponse.next();
    }

    // block dashboard & onboarding for non-authenticated users
    if (
      url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/onboarding")
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  }

  // 2. If logged in but no role → force onboarding
  if (!token.role && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/onboarding/role", req.url));
  }

  // 3. If already has role but tries to visit onboarding → send them to dashboard
  if (token.role && url.pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 4. Otherwise, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/login"],
};
