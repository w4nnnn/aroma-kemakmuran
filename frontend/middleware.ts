import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Only run on /admin routes, but skip /admin/login
  if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
    const authCookie = request.cookies.get('pb_auth');
    let isAuthenticated = false;

    if (authCookie) {
      try {
        const parsed = JSON.parse(authCookie.value);
        if (parsed.token) {
          isAuthenticated = true;
        }
      } catch (e) {
        // Invalid cookie
      }
    }

    if (!isAuthenticated) {
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from login
  if (url.pathname === '/admin/login') {
    const authCookie = request.cookies.get('pb_auth');
    if (authCookie) {
      try {
        const parsed = JSON.parse(authCookie.value);
        if (parsed.token) {
          url.pathname = '/admin/produk';
          return NextResponse.redirect(url);
        }
      } catch (e) {}
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
