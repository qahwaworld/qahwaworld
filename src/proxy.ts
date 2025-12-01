import { NextRequest, NextResponse } from 'next/server';

const locales = ['ar', 'ru']; // Only ar and ru need locale prefix, en is default at root
const defaultLocale = 'en';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Redirect /en and /en/* to root (remove /en prefix)
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const newPathname = pathname === '/en' ? '/' : pathname.replace(/^\/en/, '');
    return NextResponse.redirect(new URL(newPathname, request.url));
  }

  // Check if pathname already has ar or ru locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If already has locale or is root/English route, continue
  if (pathnameHasLocale) return;

  // Don't redirect root and English routes - they work without locale prefix
  return;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, images, etc)
    '/((?!_next|api|images|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)',
  ],
};
