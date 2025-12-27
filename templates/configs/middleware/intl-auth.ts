import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import {NextRequest, NextResponse} from 'next/server';

const i18nMiddleware = createMiddleware(routing);

const protectedRoutes = ['/dashboard', '/profile'];

function extractLocaleFromPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const maybeLocale = segments[0];
  if (maybeLocale && routing.locales.includes(maybeLocale as any)) {
    return maybeLocale;
  }
  return null;
}

function normalizePath(pathname: string, localeFromPath: string | null) {
  const segments = pathname.split('/').filter(Boolean);
  const sliceStart = localeFromPath ? 1 : 0;
  const normalized = segments.slice(sliceStart).join('/');
  return `/${normalized}`;
}

function resolveLocale(request: NextRequest, localeFromPath: string | null) {
  if (localeFromPath) {
    return localeFromPath;
  }

  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && routing.locales.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  return routing.defaultLocale;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localeFromPath = extractLocaleFromPath(pathname);
  const normalizedPath = normalizePath(pathname, localeFromPath);
  const isProtectedRoute = protectedRoutes.some(route => normalizedPath.startsWith(route));

  if (isProtectedRoute) {
    const token = request.cookies.get('jwt-token');
    if (!token) {
      const locale = resolveLocale(request, localeFromPath);
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  return i18nMiddleware(request);
}

export const config = {
  matcher: [ '/((?!api|_next/static|_next/image|assets|favicon.ico|icon.svg|sw.js|site.webmanifest|sitemap.xml|robots.txt|ads.txt).*)']
};
