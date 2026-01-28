import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n/settings';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Check if it's an admin route (e.g. /fr/admin, /en/admin)
  // We exclude /admin/login from protection
  const isAdminRoute = pathname.match(/^\/(?:en|fr|ar)\/admin/) || pathname.startsWith('/admin');
  const isLoginPage = pathname.match(/^\/(?:en|fr|ar)\/admin\/login/) || pathname === '/admin/login';

  if (isAdminRoute && !isLoginPage) {
    // Check for auth cookie (set in login page)
    const authCookie = req.cookies.get('admin-auth');
    
    if (!authCookie) {
      // Redirect to login page with correct locale
      const locale = pathname.split('/')[1] as string | undefined;
      const validLocale = locale && locales.includes(locale as string) ? (locale as string) : defaultLocale;
      return NextResponse.redirect(new URL(`/${validLocale}/admin/login`, req.url));
    }

    try {
      const token = authCookie.value;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
      const jsonPayload = typeof atob === 'function'
        ? atob(padded)
        : Buffer.from(padded, 'base64').toString('utf-8');
      const payload = JSON.parse(jsonPayload);
      const email = payload?.email as string | undefined;
      if (email !== 'iiih10923@gmail.com') {
        const locale = pathname.split('/')[1] as string | undefined;
        const validLocale = locale && locales.includes(locale as string) ? (locale as string) : defaultLocale;
        return NextResponse.redirect(new URL(`/${validLocale}/admin/login`, req.url));
      }
    } catch {
      const locale = pathname.split('/')[1] as string | undefined;
      const validLocale = locale && locales.includes(locale as string) ? (locale as string) : defaultLocale;
      return NextResponse.redirect(new URL(`/${validLocale}/admin/login`, req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
