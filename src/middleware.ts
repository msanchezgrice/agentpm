import { authMiddleware, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)"],
  afterAuth: async (auth, req) => {
    // If the user is authenticated and they're accessing a protected route
    if (auth.userId && !auth.isPublicRoute) {
      // Create a Supabase JWT token
      const supabaseAccessToken = await auth.getToken({
        template: "supabase",
      });

      // If successful, attach the token to the request
      const requestHeaders = new Headers(req.headers);
      if (supabaseAccessToken) {
        requestHeaders.set("Authorization", `Bearer ${supabaseAccessToken}`);
      }
      
      // Continue with the modified request
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
    
    // Continue with the original request if not authenticated or public route
    return NextResponse.next();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
