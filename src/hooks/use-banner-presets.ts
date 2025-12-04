"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  BannerPreset,
  BannerPresetConfig,
  CreateBannerPresetInput,
  UpdateBannerPresetInput,
} from "@/lib/types/banner";

// ==========================================
// Types
// ==========================================

interface UseBannerPresetsReturn {
  presets: BannerPreset[];
  isLoading: boolean;
  error: string | null;
  fetchPresets: () => Promise<void>;
  createPreset: (name: string, config: BannerPresetConfig) => Promise<boolean>;
  updatePreset: (id: string, input: UpdateBannerPresetInput) => Promise<boolean>;
  deletePreset: (id: string) => Promise<boolean>;
  getPresetById: (id: string) => BannerPreset | undefined;
  clearError: () => void;
}

// ==========================================
// Hook Implementation
// ==========================================

export function useBannerPresets(): UseBannerPresetsReturn {
  const [presets, setPresets] = useState<BannerPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // Fetch All Presets
  // ==========================================

  const fetchPresets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/banner-presets");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch banner presets");
      }

      setPresets(data.presets || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch banner presets";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ==========================================
  // Create Preset
  // ==========================================

  const createPreset = useCallback(
    async (name: string, config: BannerPresetConfig): Promise<boolean> => {
      try {
        setError(null);

        const input: CreateBannerPresetInput = { name, config };

        const response = await fetch("/api/banner-presets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create banner preset");
        }

        // Add the new preset to the list
        setPresets((prev) => [data.preset, ...prev]);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create banner preset";
        setError(message);
        return false;
      }
    },
    []
  );

  // ==========================================
  // Update Preset
  // ==========================================

  const updatePreset = useCallback(
    async (id: string, input: UpdateBannerPresetInput): Promise<boolean> => {
      try {
        setError(null);

        const response = await fetch(`/api/banner-presets/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update banner preset");
        }

        // Update the preset in the list
        setPresets((prev) => prev.map((preset) => (preset.id === id ? data.preset : preset)));
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update banner preset";
        setError(message);
        return false;
      }
    },
    []
  );

  // ==========================================
  // Delete Preset
  // ==========================================

  const deletePreset = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch(`/api/banner-presets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete banner preset");
      }

      // Remove the preset from the list
      setPresets((prev) => prev.filter((preset) => preset.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete banner preset";
      setError(message);
      return false;
    }
  }, []);

  // ==========================================
  // Get Preset by ID
  // ==========================================

  const getPresetById = useCallback(
    (id: string): BannerPreset | undefined => {
      return presets.find((preset) => preset.id === id);
    },
    [presets]
  );

  // ==========================================
  // Clear Error
  // ==========================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ==========================================
  // Fetch presets on mount
  // ==========================================

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  // ==========================================
  // Return
  // ==========================================

  return {
    presets,
    isLoading,
    error,
    fetchPresets,
    createPreset,
    updatePreset,
    deletePreset,
    getPresetById,
    clearError,
  };
}
