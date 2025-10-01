// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req) {
//   const url = req.nextUrl;
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   if (!token) {
//     if (
//       url.pathname.startsWith("/dashboard") ||
//       url.pathname.startsWith("/onboarding")
//     ) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//     return NextResponse.next();
//   }

//   if (!token.role && !url.pathname.startsWith("/onboarding")) {
//     return NextResponse.redirect(new URL("/onboarding/role", req.url));
//   }

//   if (token.role && url.pathname.startsWith("/onboarding")) {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/onboarding/:path*"],
// };
