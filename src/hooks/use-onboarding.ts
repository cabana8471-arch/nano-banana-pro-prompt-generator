"use client";

import { useState, useEffect, useCallback } from "react";

const ONBOARDING_KEY = "nano-banana:onboarding-dismissed";

export interface OnboardingStatus {
  hasApiKey: boolean;
  hasAvatar: boolean;
  hasGeneration: boolean;
}

/**
 * Hook that manages onboarding checklist state.
 * Fetches completion status and manages dismissed state via localStorage.
 */
export function useOnboarding(hasApiKey: boolean) {
  const [dismissed, setDismissed] = useState(true); // Default true to avoid flash
  const [status, setStatus] = useState<OnboardingStatus>({
    hasApiKey: false,
    hasAvatar: false,
    hasGeneration: false,
  });
  const [loading, setLoading] = useState(true);

  // Check dismissed state from localStorage
  useEffect(() => {
    setDismissed(localStorage.getItem(ONBOARDING_KEY) === "true");
  }, []);

  // Fetch onboarding status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [avatarRes, genRes] = await Promise.all([
          fetch("/api/avatars?limit=1"),
          fetch("/api/generations?pageSize=1"),
        ]);

        const avatarData = avatarRes.ok ? await avatarRes.json() : null;
        const genData = genRes.ok ? await genRes.json() : null;

        const hasAvatar = Array.isArray(avatarData)
          ? avatarData.length > 0
          : false;
        const hasGeneration = genData?.items?.length > 0 || genData?.total > 0;

        setStatus({
          hasApiKey,
          hasAvatar,
          hasGeneration,
        });
      } catch {
        // On error, don't show onboarding
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [hasApiKey]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    localStorage.setItem(ONBOARDING_KEY, "true");
  }, []);

  const isComplete = status.hasApiKey && status.hasAvatar && status.hasGeneration;

  // Show if: not dismissed, not loading, and not all steps complete
  const shouldShow = !dismissed && !loading && !isComplete;

  return { status, shouldShow, dismiss, isComplete, loading };
}
