// Simplest possible middleware for Clerk integration
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This is the most basic middleware function possible
export function middleware(request: NextRequest) {
  // All this does is pass through all requests
  // Just to ensure the middleware loads correctly
  return NextResponse.next();
}

// Only apply middleware to a few routes to minimize issues
export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};
