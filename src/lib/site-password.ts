import { cookies } from "next/headers";
import { getServerEnv } from "./env";

const COOKIE_NAME = "site_password_verified";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

/**
 * Get the site password from environment variables
 */
export function getSitePassword(): string | undefined {
  try {
    const env = getServerEnv();
    return env.SITE_PASSWORD;
  } catch {
    return undefined;
  }
}

/**
 * Check if site password protection is enabled
 */
export function isSitePasswordEnabled(): boolean {
  const password = getSitePassword();
  return !!password && password.length >= 8;
}

/**
 * Hash a password using SHA-256
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verify the site password cookie
 * Returns true if the cookie exists and contains the correct hash
 */
export async function verifySitePasswordCookie(): Promise<boolean> {
  if (!isSitePasswordEnabled()) {
    return true; // No password configured, allow access
  }

  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);

  if (!cookie) {
    return false;
  }

  const sitePassword = getSitePassword()!;
  const expectedHash = await hashPassword(sitePassword);

  return cookie.value === expectedHash;
}

/**
 * Set the site password verification cookie
 * Should be called after successful password verification
 */
export async function setSitePasswordCookie(): Promise<void> {
  const sitePassword = getSitePassword();
  if (!sitePassword) {
    throw new Error("Site password not configured");
  }

  const hash = await hashPassword(sitePassword);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, hash, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

/**
 * Verify if a provided password matches the site password
 */
export async function verifyPassword(password: string): Promise<boolean> {
  const sitePassword = getSitePassword();
  if (!sitePassword) {
    return false;
  }

  const providedHash = await hashPassword(password);
  const expectedHash = await hashPassword(sitePassword);

  // Use timing-safe comparison to prevent timing attacks
  if (providedHash.length !== expectedHash.length) {
    return false;
  }

  const encoder = new TextEncoder();
  const a = encoder.encode(providedHash);
  const b = encoder.encode(expectedHash);

  // Constant-time comparison
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i]! ^ b[i]!;
  }
  return diff === 0;
}
