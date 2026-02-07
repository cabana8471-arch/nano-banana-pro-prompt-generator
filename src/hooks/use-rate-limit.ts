"use client";

import { useState, useEffect, useCallback } from "react";

interface RateLimitStatus {
  current: number;
  limit: number;
  remaining: number;
  resetInMs: number;
}

interface UseRateLimitReturn {
  status: RateLimitStatus | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useRateLimit(): UseRateLimitReturn {
  const [status, setStatus] = useState<RateLimitStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate/rate-limit");
      if (response.ok) {
        const data = (await response.json()) as RateLimitStatus;
        setStatus(data);
      }
    } catch {
      // Silently fail - rate limit display is non-critical
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  return { status, isLoading, refresh };
}
