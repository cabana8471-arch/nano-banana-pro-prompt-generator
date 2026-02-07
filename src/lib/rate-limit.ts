/**
 * Simple in-memory rate limiter for API endpoints
 *
 * This provides basic protection against abuse without external dependencies.
 * For production at scale, consider using @upstash/ratelimit with Redis.
 *
 * Note: In-memory storage resets on server restart and doesn't share state
 * across serverless function instances. This is acceptable for basic protection.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  /** Whether the request is allowed */
  success: boolean;
  /** Current request count in window */
  current: number;
  /** Maximum requests allowed */
  limit: number;
  /** Remaining requests in window */
  remaining: number;
  /** Milliseconds until the rate limit resets */
  resetInMs: number;
}

// In-memory storage for rate limit data
// Key format: `${namespace}:${identifier}`
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup interval to prevent memory leaks (every 5 minutes)
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Start the cleanup interval to remove expired entries
 */
function startCleanup(): void {
  if (cleanupInterval) return;

  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL_MS);

  // Don't prevent Node.js from exiting
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }
}

/**
 * Create a rate limiter for a specific namespace
 *
 * @param namespace - Unique identifier for this rate limiter (e.g., 'avatar-upload')
 * @param config - Rate limit configuration
 * @returns A function that checks rate limits for a given identifier
 *
 * @example
 * const uploadLimiter = createRateLimiter('avatar-upload', { limit: 10, windowMs: 60 * 60 * 1000 });
 * const result = uploadLimiter(userId);
 * if (!result.success) {
 *   return new Response('Too many requests', { status: 429 });
 * }
 */
export function createRateLimiter(
  namespace: string,
  config: RateLimitConfig
): (identifier: string) => RateLimitResult {
  startCleanup();

  return (identifier: string): RateLimitResult => {
    const key = `${namespace}:${identifier}`;
    const now = Date.now();

    let entry = rateLimitStore.get(key);

    // If no entry or entry has expired, create a new one
    if (!entry || entry.resetAt <= now) {
      entry = {
        count: 1,
        resetAt: now + config.windowMs,
      };
      rateLimitStore.set(key, entry);

      return {
        success: true,
        current: 1,
        limit: config.limit,
        remaining: config.limit - 1,
        resetInMs: config.windowMs,
      };
    }

    // Entry exists and hasn't expired
    entry.count += 1;
    const remaining = Math.max(0, config.limit - entry.count);
    const resetInMs = entry.resetAt - now;

    if (entry.count > config.limit) {
      return {
        success: false,
        current: entry.count,
        limit: config.limit,
        remaining: 0,
        resetInMs,
      };
    }

    return {
      success: true,
      current: entry.count,
      limit: config.limit,
      remaining,
      resetInMs,
    };
  };
}

/**
 * Pre-configured rate limiters for common use cases
 */

/** Rate limiter for avatar uploads: 10 uploads per hour per user */
export const avatarUploadLimiter = createRateLimiter("avatar-upload", {
  limit: 10,
  windowMs: 60 * 60 * 1000, // 1 hour
});

/** Rate limiter for image likes: 100 likes per hour per user */
export const imageLikeLimiter = createRateLimiter("image-like", {
  limit: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
});

/** Rate limiter for banner reference uploads: 15 uploads per hour per user */
export const bannerReferenceUploadLimiter = createRateLimiter("banner-reference-upload", {
  limit: 15,
  windowMs: 60 * 60 * 1000, // 1 hour
});

/** Rate limiter for logo reference uploads: 15 uploads per hour per user */
export const logoReferenceUploadLimiter = createRateLimiter("logo-reference-upload", {
  limit: 15,
  windowMs: 60 * 60 * 1000, // 1 hour
});

/** Rate limiter for site password attempts: 20 attempts per minute per IP */
export const sitePasswordAttemptLimiter = createRateLimiter("site-password-attempt", {
  limit: 20,
  windowMs: 60 * 1000, // 1 minute
});

/** Rate limiter for image generation: 30 generations per hour per user */
export const imageGenerationLimiter = createRateLimiter("image-generation", {
  limit: 30,
  windowMs: 60 * 60 * 1000, // 1 hour
});
