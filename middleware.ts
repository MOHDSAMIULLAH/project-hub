import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ['/login', '/register', '/'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If logged in and trying to access auth pages, redirect to dashboard
  if (token && isPublicRoute && pathname !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If not logged in and trying to access protected routes
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token for protected routes
  if (token && !isPublicRoute) {
    const payload = verifyToken(token.value);
    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};