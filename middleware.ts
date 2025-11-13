import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware for handling authentication and routing
 *
 * This middleware allows unauthenticated access to:
 * - Home page (/)
 * - Notes page (/notes) - for trial mode
 * - Sign-in/Sign-up pages
 * - All public routes
 *
 * Trial mode is supported, so we don't force authentication
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/notes", "/sign-in", "/sign-up", "/auth/error"];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Allow access to public routes without authentication check
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For other routes, check authentication
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If no token and not a public route, redirect to notes (trial mode)
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/notes";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * Configure which routes this middleware runs on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|logo.png|next.svg|vercel.svg).*)",
  ],
};
