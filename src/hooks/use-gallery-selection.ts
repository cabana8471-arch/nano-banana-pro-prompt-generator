"use client";

import { useCallback, useState } from "react";

type BatchOperation = "delete" | "favorite" | "unfavorite" | "make_public" | "make_private";

interface BatchResult {
  success: boolean;
  count: number;
  operation: string;
}

interface UseGallerySelectionReturn {
  /** Set of currently selected image IDs */
  selectedIds: Set<string>;
  /** Whether multi-select mode is active */
  isSelecting: boolean;
  /** Enter multi-select mode */
  startSelecting: () => void;
  /** Exit multi-select mode and clear selection */
  stopSelecting: () => void;
  /** Toggle a single image's selection state */
  toggleSelect: (imageId: string) => void;
  /** Select all provided image IDs */
  selectAll: (imageIds: string[]) => void;
  /** Clear all selected IDs without leaving selection mode */
  clearSelection: () => void;
  /** Execute a batch API call for the selected images */
  performBatchAction: (operation: BatchOperation) => Promise<BatchResult>;
  /** Whether a batch action is currently in progress */
  isPerforming: boolean;
}

/**
 * Hook for managing multi-select state and batch operations in the gallery.
 *
 * Handles selection tracking, batch API calls, and loading state.
 */
export function useGallerySelection(): UseGallerySelectionReturn {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [isPerforming, setIsPerforming] = useState(false);

  const startSelecting = useCallback(() => {
    setIsSelecting(true);
  }, []);

  const stopSelecting = useCallback(() => {
    setIsSelecting(false);
    setSelectedIds(new Set());
  }, []);

  const toggleSelect = useCallback((imageId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(imageId)) {
        next.delete(imageId);
      } else {
        next.add(imageId);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback((imageIds: string[]) => {
    setSelectedIds(new Set(imageIds));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const performBatchAction = useCallback(
    async (operation: BatchOperation): Promise<BatchResult> => {
      if (selectedIds.size === 0) {
        return { success: false, count: 0, operation };
      }

      setIsPerforming(true);
      try {
        const response = await fetch("/api/images/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageIds: Array.from(selectedIds),
            operation,
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          return {
            success: false,
            count: 0,
            operation,
            ...("error" in data ? { error: data.error } : {}),
          } as BatchResult;
        }

        const data: BatchResult = await response.json();
        return data;
      } catch {
        return { success: false, count: 0, operation };
      } finally {
        setIsPerforming(false);
      }
    },
    [selectedIds]
  );

  return {
    selectedIds,
    isSelecting,
    startSelecting,
    stopSelecting,
    toggleSelect,
    selectAll,
    clearSelection,
    performBatchAction,
    isPerforming,
  };
}
