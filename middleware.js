import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const url = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
    cookies: req.cookies, // 👈 Force cookie extraction
  });

  // console.log("MIDDLEWARE HIT:", url.pathname, "TOKEN:", token);

  if (!token) {
    if (url.pathname.startsWith("/login")) {
      return NextResponse.next();
    }

    if (
      url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/onboarding")
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  if (!token.role && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/onboarding/role", req.url));
  }

  if (token.role && url.pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};
