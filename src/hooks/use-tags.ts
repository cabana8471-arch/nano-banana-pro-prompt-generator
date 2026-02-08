"use client";

import { useState, useCallback, useEffect } from "react";
import type { Tag } from "@/lib/types/generation";

// ==========================================
// Types
// ==========================================

interface UseTagsReturn {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  loadTags: () => Promise<void>;
  createTag: (name: string, color: string) => Promise<Tag | null>;
  updateTag: (id: string, data: { name?: string; color?: string }) => Promise<boolean>;
  deleteTag: (id: string) => Promise<boolean>;
  setImageTags: (imageId: string, tagIds: string[]) => Promise<boolean>;
  getImageTags: (imageId: string) => Promise<Tag[]>;
  clearError: () => void;
}

// ==========================================
// Hook Implementation
// ==========================================

export function useTags(): UseTagsReturn {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // Load All Tags
  // ==========================================

  const loadTags = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/tags");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch tags");
      }

      setTags(data.tags || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch tags";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ==========================================
  // Create Tag
  // ==========================================

  const createTag = useCallback(
    async (name: string, color: string): Promise<Tag | null> => {
      try {
        setError(null);

        const response = await fetch("/api/tags", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, color }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create tag");
        }

        // Add the new tag to the sorted list
        setTags((prev) => [...prev, data.tag].sort((a, b) => a.name.localeCompare(b.name)));
        return data.tag;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create tag";
        setError(message);
        return null;
      }
    },
    []
  );

  // ==========================================
  // Update Tag
  // ==========================================

  const updateTag = useCallback(
    async (id: string, data: { name?: string; color?: string }): Promise<boolean> => {
      try {
        setError(null);

        const response = await fetch(`/api/tags/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to update tag");
        }

        setTags((prev) =>
          prev
            .map((tag) => (tag.id === id ? result.tag : tag))
            .sort((a, b) => a.name.localeCompare(b.name))
        );
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update tag";
        setError(message);
        return false;
      }
    },
    []
  );

  // ==========================================
  // Delete Tag
  // ==========================================

  const deleteTag = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch(`/api/tags/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete tag");
      }

      setTags((prev) => prev.filter((tag) => tag.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete tag";
      setError(message);
      return false;
    }
  }, []);

  // ==========================================
  // Set Image Tags (replace all)
  // ==========================================

  const setImageTags = useCallback(
    async (imageId: string, tagIds: string[]): Promise<boolean> => {
      try {
        setError(null);

        const response = await fetch(`/api/images/${imageId}/tags`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tagIds }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to set image tags");
        }

        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to set image tags";
        setError(message);
        return false;
      }
    },
    []
  );

  // ==========================================
  // Get Image Tags
  // ==========================================

  const getImageTags = useCallback(async (imageId: string): Promise<Tag[]> => {
    try {
      const response = await fetch(`/api/images/${imageId}/tags`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get image tags");
      }

      return data.tags || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get image tags";
      setError(message);
      return [];
    }
  }, []);

  // ==========================================
  // Clear Error
  // ==========================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ==========================================
  // Load tags on mount
  // ==========================================

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  // ==========================================
  // Return
  // ==========================================

  return {
    tags,
    isLoading,
    error,
    loadTags,
    createTag,
    updateTag,
    deleteTag,
    setImageTags,
    getImageTags,
    clearError,
  };
}
