// Simplest Clerk middleware configuration to avoid production errors
export { default } from "@clerk/nextjs";

// Configure protected and public routes via matcher patterns
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public routes (sign-in, sign-up)
     */
    "/((?!_next/static|_next/image|favicon.ico|sign-in|sign-up).*)",
  ],
};
