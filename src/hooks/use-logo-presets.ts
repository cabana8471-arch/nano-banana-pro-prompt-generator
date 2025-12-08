"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  LogoPreset,
  LogoPresetConfig,
  CreateLogoPresetInput,
  UpdateLogoPresetInput,
} from "@/lib/types/logo";

// ==========================================
// Types
// ==========================================

interface PresetFieldComparison {
  field: string;
  preset1Value: string | string[] | undefined;
  preset2Value: string | string[] | undefined;
}

export interface LogoPresetComparison {
  identical: string[];
  different: PresetFieldComparison[];
  onlyIn1: string[];
  onlyIn2: string[];
}

interface UseLogoPresetsReturn {
  presets: LogoPreset[];
  isLoading: boolean;
  error: string | null;
  fetchPresets: () => Promise<void>;
  createPreset: (name: string, config: LogoPresetConfig) => Promise<boolean>;
  updatePreset: (id: string, input: UpdateLogoPresetInput) => Promise<boolean>;
  deletePreset: (id: string) => Promise<boolean>;
  getPresetById: (id: string) => LogoPreset | undefined;
  getPresetByName: (name: string) => LogoPreset | undefined;
  duplicatePreset: (id: string, newName?: string) => Promise<boolean>;
  comparePresets: (id1: string, id2: string) => LogoPresetComparison | null;
  clearError: () => void;
}

// ==========================================
// Hook Implementation
// ==========================================

export function useLogoPresets(): UseLogoPresetsReturn {
  const [presets, setPresets] = useState<LogoPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // Fetch All Presets
  // ==========================================

  const fetchPresets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/logo-presets");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch logo presets");
      }

      setPresets(data.presets || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch logo presets";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ==========================================
  // Create Preset
  // ==========================================

  const createPreset = useCallback(
    async (name: string, config: LogoPresetConfig): Promise<boolean> => {
      try {
        setError(null);

        const input: CreateLogoPresetInput = { name, config };

        const response = await fetch("/api/logo-presets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create logo preset");
        }

        // Add the new preset to the list
        setPresets((prev) => [data.preset, ...prev]);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create logo preset";
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
    async (id: string, input: UpdateLogoPresetInput): Promise<boolean> => {
      try {
        setError(null);

        const response = await fetch(`/api/logo-presets/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update logo preset");
        }

        // Update the preset in the list
        setPresets((prev) => prev.map((preset) => (preset.id === id ? data.preset : preset)));
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update logo preset";
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

      const response = await fetch(`/api/logo-presets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete logo preset");
      }

      // Remove the preset from the list
      setPresets((prev) => prev.filter((preset) => preset.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete logo preset";
      setError(message);
      return false;
    }
  }, []);

  // ==========================================
  // Get Preset by ID
  // ==========================================

  const getPresetById = useCallback(
    (id: string): LogoPreset | undefined => {
      return presets.find((preset) => preset.id === id);
    },
    [presets]
  );

  // ==========================================
  // Get Preset by Name
  // ==========================================

  const getPresetByName = useCallback(
    (name: string): LogoPreset | undefined => {
      return presets.find((preset) => preset.name.toLowerCase() === name.toLowerCase());
    },
    [presets]
  );

  // ==========================================
  // Duplicate Preset
  // ==========================================

  const duplicatePreset = useCallback(
    async (id: string, newName?: string): Promise<boolean> => {
      const preset = presets.find((p) => p.id === id);
      if (!preset) {
        setError("Preset not found");
        return false;
      }

      // Generate a unique name if not provided
      let duplicateName = newName || `${preset.name} (Copy)`;

      // Check if name already exists and append number if needed
      let counter = 1;
      const baseName = duplicateName;
      while (presets.some((p) => p.name.toLowerCase() === duplicateName.toLowerCase())) {
        counter++;
        duplicateName = `${baseName} ${counter}`;
      }

      return createPreset(duplicateName, preset.config);
    },
    [presets, createPreset]
  );

  // ==========================================
  // Compare Presets
  // ==========================================

  const comparePresets = useCallback(
    (id1: string, id2: string): LogoPresetComparison | null => {
      const preset1 = presets.find((p) => p.id === id1);
      const preset2 = presets.find((p) => p.id === id2);

      if (!preset1 || !preset2) {
        return null;
      }

      const result: LogoPresetComparison = {
        identical: [],
        different: [],
        onlyIn1: [],
        onlyIn2: [],
      };

      // Regular fields to compare
      const stringFields = [
        "logoType",
        "industry",
        "logoFormat",
        "designStyle",
        "colorSchemeType",
        "mood",
        "iconStyle",
        "fontCategory",
        "typographyTreatment",
        "specialEffects",
        "backgroundStyle",
        "primaryColor",
        "secondaryColor",
        "accentColor",
        "customPrompt",
      ];

      // Text content fields
      const textFields = ["companyName", "tagline", "abbreviation"];

      // Compare regular string fields
      for (const field of stringFields) {
        const val1 = preset1.config[field as keyof LogoPresetConfig] as string | undefined;
        const val2 = preset2.config[field as keyof LogoPresetConfig] as string | undefined;

        if (val1 === val2) {
          if (val1) result.identical.push(field);
        } else if (val1 && val2) {
          result.different.push({ field, preset1Value: val1, preset2Value: val2 });
        } else if (val1 && !val2) {
          result.onlyIn1.push(field);
        } else if (!val1 && val2) {
          result.onlyIn2.push(field);
        }
      }

      // Compare symbolElements (array field)
      const symbols1 = preset1.config.symbolElements || [];
      const symbols2 = preset2.config.symbolElements || [];
      const symbolsMatch =
        symbols1.length === symbols2.length &&
        symbols1.every((s) => symbols2.includes(s));

      if (symbolsMatch) {
        if (symbols1.length > 0) result.identical.push("symbolElements");
      } else if (symbols1.length > 0 && symbols2.length > 0) {
        result.different.push({
          field: "symbolElements",
          preset1Value: symbols1,
          preset2Value: symbols2,
        });
      } else if (symbols1.length > 0 && symbols2.length === 0) {
        result.onlyIn1.push("symbolElements");
      } else if (symbols1.length === 0 && symbols2.length > 0) {
        result.onlyIn2.push("symbolElements");
      }

      // Compare text content fields
      for (const field of textFields) {
        const val1 = preset1.config.textContent?.[
          field as keyof typeof preset1.config.textContent
        ];
        const val2 = preset2.config.textContent?.[
          field as keyof typeof preset2.config.textContent
        ];
        const fullField = `textContent.${field}`;

        if (val1 === val2) {
          if (val1) result.identical.push(fullField);
        } else if (val1 && val2) {
          result.different.push({ field: fullField, preset1Value: val1, preset2Value: val2 });
        } else if (val1 && !val2) {
          result.onlyIn1.push(fullField);
        } else if (!val1 && val2) {
          result.onlyIn2.push(fullField);
        }
      }

      return result;
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
    getPresetByName,
    duplicatePreset,
    comparePresets,
    clearError,
  };
}
