// SIMPLE Middleware

// import { auth } from "@/app/_lib/auth";

// export const middleware = auth;

// export const config = {
//   matcher: ["/dashboard/:path*"],
// };

// USING AUTH with Session Middleware

// import { NextResponse } from "next/server";
// import { auth } from "./app/_lib/auth";

// export async function middleware(req) {
//   const session = await auth(); // pulls Auth.js session
//   const url = req.nextUrl;

//   // If not logged in, kick to landing page unless already on / or /auth
//   if (!session?.user) {
//     if (
//       url.pathname.startsWith("/dashboard") ||
//       url.pathname.startsWith("/onboarding")
//     ) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//     return NextResponse.next();
//   }

//   // Logged in but missing role → force onboarding
//   if (!session.user.role && !url.pathname.startsWith("/onboarding")) {
//     return NextResponse.redirect(new URL("/onboarding/role", req.url));
//   }

//   // If user already has a role, block them from re-entering onboarding
//   if (session.user.role && url.pathname.startsWith("/onboarding")) {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   // Otherwise, allow through
//   return NextResponse.next();
// }

// // Match which routes middleware should run on
// export const config = {
//   matcher: ["/dashboard/:path*", "/onboarding/:path*"],
// };

// USING Token and JWT Middleware

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const url = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // --- Not logged in ---
  if (!token) {
    if (
      url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/onboarding")
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // --- Logged in but missing role ---
  if (!token.role && !url.pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/onboarding/role", req.url));
  }

  // --- Logged in with role, trying to hit onboarding ---
  if (token.role && url.pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};
