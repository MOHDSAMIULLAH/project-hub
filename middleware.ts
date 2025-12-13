import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  console.log('Middleware - Path:', pathname, 'Has Token:', !!token, 'Token value:', token?.value?.substring(0, 20));

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If logged in and trying to access auth pages or home, redirect to dashboard
  if (token && (isPublicRoute || pathname === '/')) {
    console.log('Redirecting logged-in user from', pathname, 'to /dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protected routes
  const protectedRoutes = ['/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If not logged in and trying to access protected routes
  if (!token && isProtectedRoute) {
    console.log('No token, redirecting to /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token for protected routes
  if (token && isProtectedRoute) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token.value, secret);
      console.log('Token verified successfully for user:', payload.userId);
    } catch (error) {
      console.log('Invalid token, redirecting to /login');
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  console.log('Allowing access to', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};