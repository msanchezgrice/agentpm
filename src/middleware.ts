import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

// This function defines your middleware behavior
export function middleware(request: NextRequest) {
  const { userId } = getAuth(request);
  const path = request.nextUrl.pathname;
  
  // Define public routes
  const isPublicRoute = 
    path === '/' || 
    path.startsWith('/sign-in') || 
    path.startsWith('/sign-up');
  
  // If trying to access protected route without auth, redirect to sign-in
  if (!isPublicRoute && !userId) {
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }
  
  // Continue with the request
  return NextResponse.next();
}

// Define which paths should be processed by this middleware
export const config = {
  matcher: [
    // Match all paths except static files and certain routes
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/',
  ],
};
