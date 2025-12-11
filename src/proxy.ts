import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware(routing);

// Cookie name for site password verification (must match src/lib/site-password.ts)
const SITE_PASSWORD_COOKIE = "site_password_verified";

/**
 * Routes that bypass site password check (Layer 1)
 * These are accessible without verifying the site password
 */
const sitePasswordPublicRoutes = ["/site-password", "/unauthorized"];

/**
 * Routes that require authentication (Layer 2)
 * These require a valid session cookie
 */
const protectedRoutes = [
  "/photo-generator",
  "/banner-generator",
  "/logo-generator",
  "/gallery",
  "/avatars",
  "/logos",
  "/products",
  "/references",
  "/profile",
  "/cost-control",
];

/**
 * Helper to extract locale from pathname
 */
function getLocaleFromPath(pathname: string): string {
  const match = pathname.match(/^\/([a-z]{2})\//);
  return match?.[1] || routing.defaultLocale;
}

/**
 * Helper to remove locale prefix from pathname
 */
function getPathWithoutLocale(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return pathname.slice(`/${locale}`.length) || "/";
    }
  }
  return pathname;
}

/**
 * Check if site password protection is enabled
 * Uses process.env directly since middleware runs in Edge runtime
 */
function isSitePasswordEnabled(): boolean {
  const password = process.env.SITE_PASSWORD;
  return !!password && password.length >= 8;
}

/**
 * Next.js 16 Proxy combining:
 *
 * Security Layers:
 * 1. Layer 1 - Site Password Gate: Cookie-based site-wide password protection
 * 2. Layer 2 - Google OAuth: Session cookie check for authentication
 * 3. Layer 3 - Authorization: Server-side check via requireAuthorization() in page layouts
 *    (Not handled in middleware - done in server components for database access)
 *
 * Plus:
 * - Internationalization (next-intl) routing with locale preservation
 */
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathWithoutLocale = getPathWithoutLocale(pathname);
  const locale = getLocaleFromPath(pathname);

  // ============================================
  // LAYER 1: Site Password Gate
  // ============================================
  // Check if site password protection is enabled and verify cookie
  if (isSitePasswordEnabled()) {
    // Check if this is a public route that bypasses site password
    const isSitePasswordPublic = sitePasswordPublicRoutes.some(
      (route) => pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
    );

    if (!isSitePasswordPublic) {
      // Check for site password cookie
      const sitePasswordCookie = request.cookies.get(SITE_PASSWORD_COOKIE);

      // Optimistic check - cookie existence only
      // Full hash validation happens in server components
      if (!sitePasswordCookie) {
        // Redirect to site password page with locale preserved
        return NextResponse.redirect(new URL(`/${locale}/site-password`, request.url));
      }
    }
  }

  // ============================================
  // LAYER 2: Session Authentication
  // ============================================
  // Check if this is a protected route that requires authentication
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    const sessionCookie = getSessionCookie(request);

    // Optimistic redirect - cookie existence check only
    // Full validation happens in page components via auth.api.getSession()
    if (!sessionCookie) {
      // Redirect to home page with locale preserved
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  // ============================================
  // LAYER 3: Authorization (Server-Side Only)
  // ============================================
  // Authorization checks (allowlist, invitation codes) are NOT done in middleware.
  // They require database access and are handled in server components using
  // requireAuthorization() from src/lib/require-authorization.ts
  // This allows for proper async database queries and redirect handling.

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
