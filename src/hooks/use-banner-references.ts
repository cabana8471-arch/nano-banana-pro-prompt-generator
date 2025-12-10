"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type {
  BannerReference,
  CreateBannerReferenceInput,
  UpdateBannerReferenceInput,
} from "@/lib/types/banner";

interface UseBannerReferencesOptions {
  /** Enable auto-refresh when window gains focus or becomes visible (default: false) */
  autoRefresh?: boolean;
  /** Minimum time between auto-refreshes in milliseconds (default: 5000) */
  refreshDebounce?: number;
}

interface UseBannerReferencesReturn {
  bannerReferences: BannerReference[];
  isLoading: boolean;
  error: string | null;
  fetchBannerReferences: () => Promise<void>;
  createBannerReference: (input: CreateBannerReferenceInput, image: File) => Promise<BannerReference | null>;
  updateBannerReference: (id: string, input: UpdateBannerReferenceInput) => Promise<BannerReference | null>;
  deleteBannerReference: (id: string) => Promise<boolean>;
  getBannerReferenceById: (id: string) => BannerReference | undefined;
}

export function useBannerReferences(options: UseBannerReferencesOptions = {}): UseBannerReferencesReturn {
  const { autoRefresh = false, refreshDebounce = 5000 } = options;

  const [bannerReferences, setBannerReferences] = useState<BannerReference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<number>(0);

  const fetchBannerReferences = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/banner-references");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch banner references");
      }

      setBannerReferences(data.bannerReferences);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch banner references";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBannerReference = useCallback(
    async (input: CreateBannerReferenceInput, image: File): Promise<BannerReference | null> => {
      try {
        setError(null);

        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("referenceType", input.referenceType);
        formData.append("image", image);
        if (input.description) {
          formData.append("description", input.description);
        }

        const response = await fetch("/api/banner-references", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create banner reference");
        }

        // Add the new banner reference to the list
        setBannerReferences((prev) => [data.bannerReference, ...prev]);
        return data.bannerReference;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create banner reference";
        setError(message);
        return null;
      }
    },
    []
  );

  const updateBannerReference = useCallback(
    async (id: string, input: UpdateBannerReferenceInput): Promise<BannerReference | null> => {
      try {
        setError(null);

        const response = await fetch(`/api/banner-references/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update banner reference");
        }

        // Update the banner reference in the list
        setBannerReferences((prev) =>
          prev.map((ref) => (ref.id === id ? data.bannerReference : ref))
        );
        return data.bannerReference;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update banner reference";
        setError(message);
        return null;
      }
    },
    []
  );

  const deleteBannerReference = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch(`/api/banner-references/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete banner reference");
      }

      // Remove the banner reference from the list
      setBannerReferences((prev) => prev.filter((ref) => ref.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete banner reference";
      setError(message);
      return false;
    }
  }, []);

  const getBannerReferenceById = useCallback(
    (id: string): BannerReference | undefined => {
      return bannerReferences.find((ref) => ref.id === id);
    },
    [bannerReferences]
  );

  // Fetch banner references on mount
  useEffect(() => {
    fetchBannerReferences();
    lastFetchRef.current = Date.now();
  }, [fetchBannerReferences]);

  // Auto-refresh when window gains focus or becomes visible
  useEffect(() => {
    if (!autoRefresh) return;

    const handleRefresh = () => {
      const now = Date.now();
      // Only refresh if enough time has passed since last fetch
      if (now - lastFetchRef.current >= refreshDebounce) {
        lastFetchRef.current = now;
        fetchBannerReferences();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        handleRefresh();
      }
    };

    const handleFocus = () => {
      handleRefresh();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [autoRefresh, refreshDebounce, fetchBannerReferences]);

  return {
    bannerReferences,
    isLoading,
    error,
    fetchBannerReferences,
    createBannerReference,
    updateBannerReference,
    deleteBannerReference,
    getBannerReferenceById,
  };
}
