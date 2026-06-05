import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/signin', '/signup', '/api', '/_next', '/static', '/favicon.ico'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();

  // Only protect dashboard routes
  if (!pathname.startsWith('/dashboard')) return NextResponse.next();

  // Lightweight, safe logging: parse cookie header and list cookie NAMES only.
  const cookieHeader = req.headers.get('cookie') || '';
  const cookieNames = cookieHeader
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((c) => c.split('=')[0]);

  console.log('[middleware] path=', pathname, 'cookieNames=', cookieNames);

  // Check for presence of common auth cookie names. Do NOT read values here.
  const hasAuthCookie = cookieNames.includes('qqai_access_token') || cookieNames.includes('qqai_refresh_token') || cookieNames.includes('token') || cookieNames.includes('access') || cookieNames.includes('next-auth.session-token');

  if (!hasAuthCookie) {
    const url = req.nextUrl.clone();
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard'],
};
