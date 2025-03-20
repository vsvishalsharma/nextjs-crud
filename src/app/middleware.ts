// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jwt from 'jsonwebtoken';

// This array contains paths that are accessible without authentication
const publicPaths = ['/login', '/signup', '/api/auth/login', '/api/auth/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  
  // Allow access to API routes except those that should be protected
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/protected/')) {
    return NextResponse.next();
  }
  
  // Check for auth token
  const authToken = request.cookies.get('auth-token')?.value;
  
  // If path is public and user is logged in, redirect to home page
  if (isPublicPath && authToken) {
    try {
      // Verify token
      jwt.verify(authToken, process.env.JWT_SECRET || 'your-jwt-secret-key');
      // Token is valid, redirect to home page if trying to access login/signup
      if (pathname === '/login' || pathname === '/signup') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // Token verification failed, allow access to public routes
    }
  }
  
  // If path requires authentication and user is not logged in, redirect to login
  if (!isPublicPath && !authToken) {
    // Store the original path so we can redirect back after login
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  // If non-public path and token exists, verify it
  if (!isPublicPath && authToken) {
    try {
      // Verify token
      jwt.verify(authToken, process.env.JWT_SECRET || 'your-jwt-secret-key');
      // Token is valid, continue
      return NextResponse.next();
    } catch (error) {
      // Token verification failed, redirect to login
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
  }
  
  // Default: allow the request to proceed
  return NextResponse.next();
}

// Configure which paths should be checked by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};