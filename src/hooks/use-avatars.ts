"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { Avatar, CreateAvatarInput, UpdateAvatarInput } from "@/lib/types/generation";

interface UseAvatarsOptions {
  /** Enable auto-refresh when window gains focus or becomes visible (default: false) */
  autoRefresh?: boolean;
  /** Minimum time between auto-refreshes in milliseconds (default: 5000) */
  refreshDebounce?: number;
}

interface UseAvatarsReturn {
  avatars: Avatar[];
  isLoading: boolean;
  error: string | null;
  fetchAvatars: () => Promise<void>;
  createAvatar: (input: CreateAvatarInput, image: File) => Promise<Avatar | null>;
  updateAvatar: (id: string, input: UpdateAvatarInput) => Promise<Avatar | null>;
  deleteAvatar: (id: string) => Promise<boolean>;
  getAvatarById: (id: string) => Avatar | undefined;
}

export function useAvatars(options: UseAvatarsOptions = {}): UseAvatarsReturn {
  const { autoRefresh = false, refreshDebounce = 5000 } = options;

  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<number>(0);

  const fetchAvatars = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/avatars");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch avatars");
      }

      setAvatars(data.avatars);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch avatars";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAvatar = useCallback(
    async (input: CreateAvatarInput, image: File): Promise<Avatar | null> => {
      try {
        setError(null);

        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("avatarType", input.avatarType);
        formData.append("image", image);
        if (input.description) {
          formData.append("description", input.description);
        }

        const response = await fetch("/api/avatars", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create avatar");
        }

        // Add the new avatar to the list
        setAvatars((prev) => [data.avatar, ...prev]);
        return data.avatar;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create avatar";
        setError(message);
        return null;
      }
    },
    []
  );

  const updateAvatar = useCallback(
    async (id: string, input: UpdateAvatarInput): Promise<Avatar | null> => {
      try {
        setError(null);

        const response = await fetch(`/api/avatars/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update avatar");
        }

        // Update the avatar in the list
        setAvatars((prev) =>
          prev.map((avatar) => (avatar.id === id ? data.avatar : avatar))
        );
        return data.avatar;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update avatar";
        setError(message);
        return null;
      }
    },
    []
  );

  const deleteAvatar = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch(`/api/avatars/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete avatar");
      }

      // Remove the avatar from the list
      setAvatars((prev) => prev.filter((avatar) => avatar.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete avatar";
      setError(message);
      return false;
    }
  }, []);

  const getAvatarById = useCallback(
    (id: string): Avatar | undefined => {
      return avatars.find((avatar) => avatar.id === id);
    },
    [avatars]
  );

  // Fetch avatars on mount
  useEffect(() => {
    fetchAvatars();
    lastFetchRef.current = Date.now();
  }, [fetchAvatars]);

  // Auto-refresh when window gains focus or becomes visible
  useEffect(() => {
    if (!autoRefresh) return;

    const handleRefresh = () => {
      const now = Date.now();
      // Only refresh if enough time has passed since last fetch
      if (now - lastFetchRef.current >= refreshDebounce) {
        lastFetchRef.current = now;
        fetchAvatars();
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
  }, [autoRefresh, refreshDebounce, fetchAvatars]);

  return {
    avatars,
    isLoading,
    error,
    fetchAvatars,
    createAvatar,
    updateAvatar,
    deleteAvatar,
    getAvatarById,
  };
}
