import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

// Simple middleware that protects routes
export function middleware(request: NextRequest) {
  const { userId } = getAuth(request);
  const path = request.nextUrl.pathname;
  
  // Define public routes that don't require authentication
  const isPublicRoute = 
    path === '/' || 
    path.startsWith('/sign-in') || 
    path.startsWith('/sign-up') ||
    path.includes('_next') ||
    path.includes('favicon.ico');
  
  // If trying to access protected route without auth, redirect to sign-in
  if (!isPublicRoute && !userId) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  
  // Continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
