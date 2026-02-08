import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { createRateLimiter, peekRateLimit } from "@/lib/rate-limit";

describe("createRateLimiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests within the limit", () => {
    const limiter = createRateLimiter("test-allow", { limit: 3, windowMs: 60000 });
    const result = limiter("user1");
    expect(result.success).toBe(true);
    expect(result.current).toBe(1);
    expect(result.remaining).toBe(2);
    expect(result.limit).toBe(3);
  });

  it("blocks requests exceeding the limit", () => {
    const limiter = createRateLimiter("test-block", { limit: 2, windowMs: 60000 });
    limiter("user1");
    limiter("user1");
    const result = limiter("user1");
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.current).toBe(3);
  });

  it("allows exactly the limit number of requests", () => {
    const limiter = createRateLimiter("test-exact", { limit: 3, windowMs: 60000 });
    limiter("user1");
    limiter("user1");
    const result = limiter("user1");
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("tracks different identifiers independently", () => {
    const limiter = createRateLimiter("test-independent", { limit: 1, windowMs: 60000 });
    const r1 = limiter("user1");
    const r2 = limiter("user2");
    expect(r1.success).toBe(true);
    expect(r2.success).toBe(true);
  });

  it("resets after the time window expires", () => {
    const limiter = createRateLimiter("test-reset", { limit: 1, windowMs: 60000 });
    limiter("user1");
    const blocked = limiter("user1");
    expect(blocked.success).toBe(false);

    vi.advanceTimersByTime(60001);
    const afterReset = limiter("user1");
    expect(afterReset.success).toBe(true);
    expect(afterReset.current).toBe(1);
  });

  it("returns correct resetInMs", () => {
    const limiter = createRateLimiter("test-resetms", { limit: 5, windowMs: 60000 });
    const result = limiter("user1");
    expect(result.resetInMs).toBe(60000);

    vi.advanceTimersByTime(10000);
    const result2 = limiter("user1");
    expect(result2.resetInMs).toBeLessThanOrEqual(50000);
    expect(result2.resetInMs).toBeGreaterThan(49000);
  });

  it("handles concurrent requests from same user", () => {
    const limiter = createRateLimiter("test-concurrent", { limit: 5, windowMs: 60000 });
    for (let i = 0; i < 5; i++) {
      expect(limiter("user1").success).toBe(true);
    }
    expect(limiter("user1").success).toBe(false);
  });

  it("uses different namespaces independently", () => {
    const limiter1 = createRateLimiter("namespace-a", { limit: 1, windowMs: 60000 });
    const limiter2 = createRateLimiter("namespace-b", { limit: 1, windowMs: 60000 });
    expect(limiter1("user1").success).toBe(true);
    expect(limiter2("user1").success).toBe(true);
    expect(limiter1("user1").success).toBe(false);
    expect(limiter2("user1").success).toBe(false);
  });

  it("returns remaining as 0 when blocked", () => {
    const limiter = createRateLimiter("test-remaining", { limit: 1, windowMs: 60000 });
    limiter("user1");
    const result = limiter("user1");
    expect(result.remaining).toBe(0);
    expect(result.success).toBe(false);
  });
});

describe("peekRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns full limit when no requests made", () => {
    const config = { limit: 10, windowMs: 60000 };
    const result = peekRateLimit("test-peek-empty", config, "user1");
    expect(result.success).toBe(true);
    expect(result.current).toBe(0);
    expect(result.remaining).toBe(10);
  });

  it("does not consume a request", () => {
    const config = { limit: 2, windowMs: 60000 };
    const limiter = createRateLimiter("test-peek-no-consume", config);
    limiter("user1");

    const peek1 = peekRateLimit("test-peek-no-consume", config, "user1");
    const peek2 = peekRateLimit("test-peek-no-consume", config, "user1");
    expect(peek1.current).toBe(1);
    expect(peek2.current).toBe(1);
    expect(peek1.remaining).toBe(1);
  });

  it("reflects current usage after requests", () => {
    const config = { limit: 3, windowMs: 60000 };
    const limiter = createRateLimiter("test-peek-usage", config);
    limiter("user1");
    limiter("user1");

    const result = peekRateLimit("test-peek-usage", config, "user1");
    expect(result.current).toBe(2);
    expect(result.remaining).toBe(1);
    expect(result.success).toBe(true);
  });

  it("shows blocked status when limit exceeded", () => {
    const config = { limit: 1, windowMs: 60000 };
    const limiter = createRateLimiter("test-peek-blocked", config);
    limiter("user1");
    limiter("user1");

    const result = peekRateLimit("test-peek-blocked", config, "user1");
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("returns full limit after window expiry", () => {
    const config = { limit: 5, windowMs: 60000 };
    const limiter = createRateLimiter("test-peek-expired", config);
    limiter("user1");

    vi.advanceTimersByTime(60001);

    const result = peekRateLimit("test-peek-expired", config, "user1");
    expect(result.success).toBe(true);
    expect(result.current).toBe(0);
    expect(result.remaining).toBe(5);
  });
});
