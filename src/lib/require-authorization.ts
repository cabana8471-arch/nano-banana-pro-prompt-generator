import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  isAdminEmail,
  isUserAuthorized,
  authorizeUserViaAllowlist,
} from "@/lib/authorization";

/**
 * Authorization result with user details
 */
export interface AuthorizationResult {
  userId: string;
  email: string;
  name: string;
  image: string | null;
  isAdmin: boolean;
  isAuthorized: boolean;
}

/**
 * Requires the user to be both authenticated and authorized.
 *
 * Authorization flow:
 * 1. Check session existence (Layer 2 - Google OAuth)
 * 2. Check if user is admin (bypass all authorization)
 * 3. Try to auto-authorize via email allowlist
 * 4. Check existing authorization status
 * 5. Redirect to /unauthorized if not authorized
 *
 * @returns Authorization result with user details
 * @throws Redirects to home page if not authenticated
 * @throws Redirects to /unauthorized page if not authorized
 */
export async function requireAuthorization(): Promise<AuthorizationResult> {
  // Step 1: Check session (authentication)
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/");
  }

  const { user } = session;
  const userEmail = user.email;

  // Step 2: Check if user is admin (bypass authorization)
  const isAdmin = isAdminEmail(userEmail);
  if (isAdmin) {
    return {
      userId: user.id,
      email: userEmail,
      name: user.name,
      image: user.image || null,
      isAdmin: true,
      isAuthorized: true,
    };
  }

  // Step 3: Try to auto-authorize via allowlist
  const wasAuthorizedViaAllowlist = await authorizeUserViaAllowlist(user.id);
  if (wasAuthorizedViaAllowlist) {
    return {
      userId: user.id,
      email: userEmail,
      name: user.name,
      image: user.image || null,
      isAdmin: false,
      isAuthorized: true,
    };
  }

  // Step 4: Check existing authorization status
  const isAuthorized = await isUserAuthorized(user.id);
  if (isAuthorized) {
    return {
      userId: user.id,
      email: userEmail,
      name: user.name,
      image: user.image || null,
      isAdmin: false,
      isAuthorized: true,
    };
  }

  // Step 5: Not authorized - redirect
  redirect("/unauthorized");
}

/**
 * Checks authorization without redirecting.
 * Useful for API routes or components that need to check authorization status.
 *
 * @returns Authorization result or null if not authenticated
 */
export async function checkAuthorization(): Promise<AuthorizationResult | null> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return null;
  }

  const { user } = session;
  const userEmail = user.email;

  // Check if user is admin (bypass authorization)
  const isAdmin = isAdminEmail(userEmail);
  if (isAdmin) {
    return {
      userId: user.id,
      email: userEmail,
      name: user.name,
      image: user.image || null,
      isAdmin: true,
      isAuthorized: true,
    };
  }

  // Try to auto-authorize via allowlist
  const wasAuthorizedViaAllowlist = await authorizeUserViaAllowlist(user.id);
  if (wasAuthorizedViaAllowlist) {
    return {
      userId: user.id,
      email: userEmail,
      name: user.name,
      image: user.image || null,
      isAdmin: false,
      isAuthorized: true,
    };
  }

  // Check existing authorization status
  const isAuthorized = await isUserAuthorized(user.id);

  return {
    userId: user.id,
    email: userEmail,
    name: user.name,
    image: user.image || null,
    isAdmin: false,
    isAuthorized,
  };
}

/**
 * Requires the user to be an admin.
 * Useful for admin-only API routes or pages.
 *
 * @returns Authorization result with admin status
 * @throws Redirects to home page if not authenticated
 * @throws Redirects to /unauthorized page if not admin
 */
export async function requireAdmin(): Promise<AuthorizationResult> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/");
  }

  const { user } = session;
  const userEmail = user.email;

  const isAdmin = isAdminEmail(userEmail);
  if (!isAdmin) {
    redirect("/unauthorized");
  }

  return {
    userId: user.id,
    email: userEmail,
    name: user.name,
    image: user.image || null,
    isAdmin: true,
    isAuthorized: true,
  };
}

/**
 * Checks if the current user is an admin without redirecting.
 * Useful for API routes that need admin-only access.
 *
 * @returns true if user is authenticated and is an admin, false otherwise
 */
export async function checkIsAdmin(): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return false;
  }

  return isAdminEmail(session.user.email);
}
