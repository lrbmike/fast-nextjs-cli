import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import type {NextRequest} from 'next/server';

const i18nMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  return i18nMiddleware(request);
}

export const config = {
  matcher: [ '/((?!api|_next/static|_next/image|assets|favicon.ico|icon.svg|sw.js|site.webmanifest|sitemap.xml|robots.txt|ads.txt).*)']
};
