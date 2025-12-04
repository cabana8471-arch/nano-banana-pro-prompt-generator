import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware(routing);

// Protected routes that require authentication
const protectedRoutes = ["/generate", "/gallery", "/avatars", "/profile"];

/**
 * Next.js 16 Proxy combining:
 * 1. Internationalization (next-intl) routing
 * 2. Auth protection for specific routes
 */
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the path (without locale prefix) is a protected route
  const locales = routing.locales;
  let pathWithoutLocale = pathname;

  // Remove locale prefix if present
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      pathWithoutLocale = pathname.slice(`/${locale}`.length) || "/";
      break;
    }
  }

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  );

  // If protected route, check for auth cookie
  if (isProtectedRoute) {
    const sessionCookie = getSessionCookie(request);

    // Optimistic redirect - cookie existence check only
    // Full validation happens in page components via auth.api.getSession()
    if (!sessionCookie) {
      // Redirect to home page with locale preserved
      const locale = pathname.match(/^\/([a-z]{2})\//)?.[1] || routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  // Apply i18n middleware for all routes
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - Static files (images, fonts, etc.)
  // - Next.js internals
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)" ],
};
