import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import {NextRequest, NextResponse} from 'next/server';

const i18nMiddleware = createMiddleware(routing);

// Define protected routes
const protectedRoutes = ['/dashboard', '/profile'];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check authentication for protected routes
  // We check if the pathname contains any protected route
  // This handles /en/dashboard, /dashboard, etc.
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.includes(route)
  );

  if (isProtectedRoute) {
    const token = request.cookies.get('jwt-token');
    if (!token) {
      // Redirect to login page
      // We try to respect the current locale preference or fallback to default
      const locale = request.cookies.get('NEXT_LOCALE')?.value || routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  return i18nMiddleware(request);
}

export const config = {
  matcher: [ '/((?!api|_next/static|_next/image|assets|favicon.ico|icon.svg|sw.js|site.webmanifest|sitemap.xml|robots.txt|ads.txt).*)']
};
