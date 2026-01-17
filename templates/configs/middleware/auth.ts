import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/profile"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const token = request.cookies.get("jwt-token");
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|icon.svg|sw.js|site.webmanifest|sitemap.xml|robots.txt|ads.txt).*)",
  ],
};
