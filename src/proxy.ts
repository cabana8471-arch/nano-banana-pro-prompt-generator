import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import createIntlMiddleware from "next-intl/middleware";
import { isIpBlocked } from "@/lib/authorization";
import { routing } from "./i18n/routing";

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware(routing);

// Cookie name for site password verification (must match src/lib/site-password.ts)
const SITE_PASSWORD_COOKIE = "site_password_verified";

/**
 * Routes that bypass IP blocking check (Layer 0)
 * These must be accessible even for blocked IPs
 */
const ipBlockingExcludedRoutes = ["/blocked"];

/**
 * Routes that bypass site password check (Layer 1)
 * These are accessible without verifying the site password
 */
const sitePasswordPublicRoutes = ["/site-password", "/unauthorized", "/blocked"];

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

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (!a || !b) return false;

  const length = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;

  for (let i = 0; i < length; i++) {
    const aChar = a.charCodeAt(i) || 0;
    const bChar = b.charCodeAt(i) || 0;
    diff |= aChar ^ bChar;
  }

  return diff === 0;
}

async function verifySitePasswordCookieValue(cookieValue?: string): Promise<boolean> {
  if (!cookieValue) return false;
  const sitePassword = process.env.SITE_PASSWORD;
  if (!sitePassword) return false;

  const expectedHash = await hashPassword(sitePassword);
  return timingSafeEqual(cookieValue, expectedHash);
}

/**
 * Extract client IP from request headers
 * Tries x-forwarded-for first, then x-real-ip, then falls back to null
 */
function getClientIp(request: NextRequest): string | null {
  // x-forwarded-for can contain multiple IPs, the first one is the client
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null;
  }

  // Try x-real-ip header
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return null;
}

/**
 * Next.js 16 Proxy combining:
 *
 * Security Layers:
 * 0. Layer 0 - IP Blocking: Block requests from blocked IP addresses
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
  // LAYER 0: IP Blocking
  // ============================================
  // Check if this is an excluded route (blocked page itself)
  const isIpBlockingExcluded = ipBlockingExcludedRoutes.some(
    (route) => pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  );

  if (!isIpBlockingExcluded) {
    const clientIp = getClientIp(request);

    if (clientIp) {
      try {
        const { isBlocked } = await isIpBlocked(clientIp);
        if (isBlocked) {
          return NextResponse.redirect(new URL(`/${locale}/blocked`, request.url));
        }
      } catch {
        // On error, allow access to prevent blocking legitimate users
        console.error("IP blocking check failed, allowing access");
      }
    }
  }

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

      const isValidCookie = await verifySitePasswordCookieValue(sitePasswordCookie?.value);
      if (!isValidCookie) {
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
