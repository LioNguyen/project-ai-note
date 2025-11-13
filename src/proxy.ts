import { withAuth } from "next-auth/middleware";

/**
 * NextAuth Middleware Configuration
 * Protects routes that require authentication
 */
export default withAuth(function middleware(req) {
  // NextAuth middleware will handle authentication checks
  // This function runs for all matched routes
});

export const config = {
  matcher: [
    // Protect notes pages and API routes
    "/notes/:path*",
    "/api/notes/:path*",
    "/api/chat/:path*",
  ],
};
