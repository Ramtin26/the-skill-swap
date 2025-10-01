import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const url = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log("MIDDLEWARE HIT:", url.pathname);
  console.log("TOKEN:", token);

  // 1. If no token (not logged in)
  if (!token) {
    if (url.pathname.startsWith("/login")) {
      console.log("ALLOWING /login WITHOUT TOKEN");
      return NextResponse.next();
    }

    if (
      url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/onboarding")
    ) {
      console.log("BLOCKING -> redirecting to /login");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  }

  // 2. If logged in but no role → force onboarding
  if (!token.role && url.pathname.startsWith("/dashboard")) {
    console.log("LOGGED IN NO ROLE -> redirecting to /onboarding/role");
    return NextResponse.redirect(new URL("/onboarding/role", req.url));
  }

  // 3. If already has role but tries to visit onboarding → send them to dashboard
  if (token.role && url.pathname.startsWith("/onboarding")) {
    console.log("HAS ROLE -> redirecting to /dashboard");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  console.log("ALLOWING THROUGH:", url.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"], // 👈 /login is REMOVED
};
