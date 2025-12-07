"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  BannerPreset,
  BannerPresetConfig,
  BannerSection,
  BannerTextContent,
} from "@/lib/types/banner";

// ==========================================
// Types
// ==========================================

interface PresetChanges {
  added: string[];
  modified: string[];
  removed: string[];
}

interface UsePresetEditorReturn {
  // State
  editingPreset: BannerPreset | null;
  editedConfig: BannerPresetConfig;
  editedName: string;
  isDirty: boolean;
  changes: PresetChanges;

  // Actions
  startEditing: (preset: BannerPreset) => void;
  updateField: <K extends keyof BannerPresetConfig>(
    field: K,
    value: BannerPresetConfig[K]
  ) => void;
  updateTextContent: <K extends keyof BannerTextContent>(
    field: K,
    value: string
  ) => void;
  updateName: (name: string) => void;
  clearField: (field: keyof BannerPresetConfig) => void;
  clearTextContentField: (field: keyof BannerTextContent) => void;
  resetChanges: () => void;
  cancelEditing: () => void;
  getEditedPreset: () => BannerPreset | null;

  // Section helpers
  getOriginalSection: (section: BannerSection | "textContent" | "customPrompt") => Partial<BannerPresetConfig>;
  getEditedSection: (section: BannerSection | "textContent" | "customPrompt") => Partial<BannerPresetConfig>;
  hasChangesInSection: (section: BannerSection | "textContent" | "customPrompt") => boolean;
}

// Section field mappings
const SECTION_FIELD_MAP: Record<BannerSection | "textContent" | "customPrompt", string[]> = {
  basicConfig: ["bannerType", "bannerSize", "industry", "customWidth", "customHeight"],
  visualStyle: ["designStyle", "colorScheme", "mood", "seasonal"],
  visualElements: ["backgroundStyle", "visualEffects", "iconGraphics", "promotionalElements"],
  layoutTypography: [
    "layoutStyle",
    "textLanguage",
    "textPlacement",
    "typographyStyle",
    "headlineTypography",
    "bodyTypography",
    "ctaTypography",
    "ctaButtonStyle",
  ],
  textContent: ["headline", "subheadline", "ctaText", "tagline"],
  customPrompt: ["customPrompt"],
};

// ==========================================
// Hook Implementation
// ==========================================

export function usePresetEditor(): UsePresetEditorReturn {
  const [editingPreset, setEditingPreset] = useState<BannerPreset | null>(null);
  const [editedConfig, setEditedConfig] = useState<BannerPresetConfig>({});
  const [editedName, setEditedName] = useState<string>("");

  // ==========================================
  // Start Editing
  // ==========================================

  const startEditing = useCallback((preset: BannerPreset) => {
    setEditingPreset(preset);
    setEditedConfig({ ...preset.config });
    setEditedName(preset.name);
  }, []);

  // ==========================================
  // Update Field
  // ==========================================

  const updateField = useCallback(
    <K extends keyof BannerPresetConfig>(field: K, value: BannerPresetConfig[K]) => {
      setEditedConfig((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  // ==========================================
  // Update Text Content Field
  // ==========================================

  const updateTextContent = useCallback(
    <K extends keyof BannerTextContent>(field: K, value: string) => {
      setEditedConfig((prev) => ({
        ...prev,
        textContent: {
          ...prev.textContent,
          [field]: value,
        },
      }));
    },
    []
  );

  // ==========================================
  // Update Name
  // ==========================================

  const updateName = useCallback((name: string) => {
    setEditedName(name);
  }, []);

  // ==========================================
  // Clear Field
  // ==========================================

  const clearField = useCallback((field: keyof BannerPresetConfig) => {
    setEditedConfig((prev) => {
      const newConfig = { ...prev };
      delete newConfig[field];
      return newConfig;
    });
  }, []);

  // ==========================================
  // Clear Text Content Field
  // ==========================================

  const clearTextContentField = useCallback((field: keyof BannerTextContent) => {
    setEditedConfig((prev) => {
      if (!prev.textContent) return prev;
      const newTextContent = { ...prev.textContent };
      delete newTextContent[field];
      if (Object.keys(newTextContent).length === 0) {
        const { textContent: _, ...rest } = prev;
        return rest as BannerPresetConfig;
      }
      return {
        ...prev,
        textContent: newTextContent,
      };
    });
  }, []);

  // ==========================================
  // Reset Changes
  // ==========================================

  const resetChanges = useCallback(() => {
    if (editingPreset) {
      setEditedConfig({ ...editingPreset.config });
      setEditedName(editingPreset.name);
    }
  }, [editingPreset]);

  // ==========================================
  // Cancel Editing
  // ==========================================

  const cancelEditing = useCallback(() => {
    setEditingPreset(null);
    setEditedConfig({});
    setEditedName("");
  }, []);

  // ==========================================
  // Get Edited Preset
  // ==========================================

  const getEditedPreset = useCallback((): BannerPreset | null => {
    if (!editingPreset) return null;
    return {
      ...editingPreset,
      name: editedName,
      config: editedConfig,
    };
  }, [editingPreset, editedName, editedConfig]);

  // ==========================================
  // Calculate Changes
  // ==========================================

  const changes = useMemo((): PresetChanges => {
    if (!editingPreset) {
      return { added: [], modified: [], removed: [] };
    }

    const result: PresetChanges = { added: [], modified: [], removed: [] };
    const original = editingPreset.config;

    // All fields to check
    const allFields: (keyof BannerPresetConfig)[] = [
      "bannerType",
      "bannerSize",
      "industry",
      "customWidth",
      "customHeight",
      "designStyle",
      "colorScheme",
      "mood",
      "seasonal",
      "backgroundStyle",
      "visualEffects",
      "iconGraphics",
      "promotionalElements",
      "layoutStyle",
      "textLanguage",
      "textPlacement",
      "typographyStyle",
      "headlineTypography",
      "bodyTypography",
      "ctaTypography",
      "ctaButtonStyle",
      "customPrompt",
    ];

    // Check regular fields
    for (const field of allFields) {
      const oldVal = original[field];
      const newVal = editedConfig[field];

      if (oldVal !== newVal) {
        if (!oldVal && newVal) {
          result.added.push(field);
        } else if (oldVal && !newVal) {
          result.removed.push(field);
        } else {
          result.modified.push(field);
        }
      }
    }

    // Check text content fields
    const textFields: (keyof BannerTextContent)[] = ["headline", "subheadline", "ctaText", "tagline"];
    for (const field of textFields) {
      const oldVal = original.textContent?.[field];
      const newVal = editedConfig.textContent?.[field];

      if (oldVal !== newVal) {
        const fullField = `textContent.${field}`;
        if (!oldVal && newVal) {
          result.added.push(fullField);
        } else if (oldVal && !newVal) {
          result.removed.push(fullField);
        } else {
          result.modified.push(fullField);
        }
      }
    }

    return result;
  }, [editingPreset, editedConfig]);

  // ==========================================
  // Is Dirty
  // ==========================================

  const isDirty = useMemo(() => {
    if (!editingPreset) return false;

    // Check name change
    if (editedName !== editingPreset.name) return true;

    // Check config changes
    return (
      changes.added.length > 0 ||
      changes.modified.length > 0 ||
      changes.removed.length > 0
    );
  }, [editingPreset, editedName, changes]);

  // ==========================================
  // Section Helpers
  // ==========================================

  const getOriginalSection = useCallback(
    (section: BannerSection | "textContent" | "customPrompt"): Partial<BannerPresetConfig> => {
      if (!editingPreset) return {};

      const fields = SECTION_FIELD_MAP[section];
      const result: Partial<BannerPresetConfig> = {};

      if (section === "textContent") {
        if (editingPreset.config.textContent) {
          return { textContent: editingPreset.config.textContent };
        }
        return {};
      }

      if (section === "customPrompt") {
        if (editingPreset.config.customPrompt) {
          return { customPrompt: editingPreset.config.customPrompt };
        }
        return {};
      }

      for (const field of fields) {
        const key = field as keyof BannerPresetConfig;
        if (editingPreset.config[key] !== undefined) {
          (result as Record<string, unknown>)[key] = editingPreset.config[key];
        }
      }

      return result;
    },
    [editingPreset]
  );

  const getEditedSection = useCallback(
    (section: BannerSection | "textContent" | "customPrompt"): Partial<BannerPresetConfig> => {
      const fields = SECTION_FIELD_MAP[section];
      const result: Partial<BannerPresetConfig> = {};

      if (section === "textContent") {
        if (editedConfig.textContent) {
          return { textContent: editedConfig.textContent };
        }
        return {};
      }

      if (section === "customPrompt") {
        if (editedConfig.customPrompt) {
          return { customPrompt: editedConfig.customPrompt };
        }
        return {};
      }

      for (const field of fields) {
        const key = field as keyof BannerPresetConfig;
        if (editedConfig[key] !== undefined) {
          (result as Record<string, unknown>)[key] = editedConfig[key];
        }
      }

      return result;
    },
    [editedConfig]
  );

  const hasChangesInSection = useCallback(
    (section: BannerSection | "textContent" | "customPrompt"): boolean => {
      const fields = SECTION_FIELD_MAP[section];

      for (const field of fields) {
        const checkField = section === "textContent" ? `textContent.${field}` : field;
        if (
          changes.added.includes(checkField) ||
          changes.modified.includes(checkField) ||
          changes.removed.includes(checkField)
        ) {
          return true;
        }
      }

      return false;
    },
    [changes]
  );

  // ==========================================
  // Return
  // ==========================================

  return {
    editingPreset,
    editedConfig,
    editedName,
    isDirty,
    changes,
    startEditing,
    updateField,
    updateTextContent,
    updateName,
    clearField,
    clearTextContentField,
    resetChanges,
    cancelEditing,
    getEditedPreset,
    getOriginalSection,
    getEditedSection,
    hasChangesInSection,
  };
}
