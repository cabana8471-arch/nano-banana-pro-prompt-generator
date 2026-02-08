"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  LogoPreset,
  LogoPresetConfig,
  LogoSection,
  LogoTextContent,
} from "@/lib/types/logo";

// ==========================================
// Types
// ==========================================

interface PresetChanges {
  added: string[];
  modified: string[];
  removed: string[];
}

interface UseLogoPresetEditorReturn {
  // State
  editingPreset: LogoPreset | null;
  editedConfig: LogoPresetConfig;
  editedName: string;
  isDirty: boolean;
  changes: PresetChanges;

  // Actions
  startEditing: (preset: LogoPreset) => void;
  updateField: <K extends keyof LogoPresetConfig>(
    field: K,
    value: LogoPresetConfig[K]
  ) => void;
  updateTextContent: <K extends keyof LogoTextContent>(
    field: K,
    value: string
  ) => void;
  updateName: (name: string) => void;
  clearField: (field: keyof LogoPresetConfig) => void;
  clearTextContentField: (field: keyof LogoTextContent) => void;
  resetChanges: () => void;
  cancelEditing: () => void;
  getEditedPreset: () => LogoPreset | null;

  // Section helpers
  getOriginalSection: (section: LogoSection | "textContent" | "customPrompt" | "brandColors") => Partial<LogoPresetConfig>;
  getEditedSection: (section: LogoSection | "textContent" | "customPrompt" | "brandColors") => Partial<LogoPresetConfig>;
  hasChangesInSection: (section: LogoSection | "textContent" | "customPrompt" | "brandColors") => boolean;
}

// Section field mappings for the logo preset editor
const SECTION_FIELD_MAP: Record<LogoSection | "textContent" | "customPrompt" | "brandColors", string[]> = {
  basicConfig: ["logoType", "industry", "logoFormat"],
  visualStyle: ["designStyle", "colorSchemeType", "mood"],
  iconSymbol: ["iconStyle", "symbolElements"],
  typography: ["fontCategory", "typographyTreatment"],
  additionalOptions: ["specialEffects", "backgroundStyle"],
  brandColors: ["primaryColor", "secondaryColor", "accentColor"],
  textContent: ["companyName", "tagline", "abbreviation"],
  customPrompt: ["customPrompt"],
};

// ==========================================
// Hook Implementation
// ==========================================

export function useLogoPresetEditor(): UseLogoPresetEditorReturn {
  const [editingPreset, setEditingPreset] = useState<LogoPreset | null>(null);
  const [editedConfig, setEditedConfig] = useState<LogoPresetConfig>({});
  const [editedName, setEditedName] = useState<string>("");

  // ==========================================
  // Start Editing
  // ==========================================

  const startEditing = useCallback((preset: LogoPreset) => {
    setEditingPreset(preset);
    setEditedConfig({ ...preset.config });
    setEditedName(preset.name);
  }, []);

  // ==========================================
  // Update Field
  // ==========================================

  const updateField = useCallback(
    <K extends keyof LogoPresetConfig>(field: K, value: LogoPresetConfig[K]) => {
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
    <K extends keyof LogoTextContent>(field: K, value: string) => {
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

  const clearField = useCallback((field: keyof LogoPresetConfig) => {
    setEditedConfig((prev) => {
      const newConfig = { ...prev };
      delete newConfig[field];
      return newConfig;
    });
  }, []);

  // ==========================================
  // Clear Text Content Field
  // ==========================================

  const clearTextContentField = useCallback((field: keyof LogoTextContent) => {
    setEditedConfig((prev) => {
      if (!prev.textContent) return prev;
      const newTextContent = { ...prev.textContent };
      delete newTextContent[field];
      if (Object.keys(newTextContent).length === 0) {
        const { textContent: _, ...rest } = prev;
        return rest as LogoPresetConfig;
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

  const getEditedPreset = useCallback((): LogoPreset | null => {
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

    // Regular string fields to compare
    const stringFields: (keyof LogoPresetConfig)[] = [
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

    // Check regular fields
    for (const field of stringFields) {
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

    // Check symbolElements (array field)
    const oldSymbols = original.symbolElements || [];
    const newSymbols = editedConfig.symbolElements || [];
    const symbolsMatch =
      oldSymbols.length === newSymbols.length &&
      oldSymbols.every((s) => newSymbols.includes(s));
    if (!symbolsMatch) {
      if (oldSymbols.length === 0 && newSymbols.length > 0) {
        result.added.push("symbolElements");
      } else if (oldSymbols.length > 0 && newSymbols.length === 0) {
        result.removed.push("symbolElements");
      } else {
        result.modified.push("symbolElements");
      }
    }

    // Check text content fields
    const textFields: (keyof LogoTextContent)[] = ["companyName", "tagline", "abbreviation"];
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
    (section: LogoSection | "textContent" | "customPrompt" | "brandColors"): Partial<LogoPresetConfig> => {
      if (!editingPreset) return {};

      const fields = SECTION_FIELD_MAP[section];
      const result: Partial<LogoPresetConfig> = {};

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
        const key = field as keyof LogoPresetConfig;
        if (editingPreset.config[key] !== undefined) {
          (result as Record<string, unknown>)[key] = editingPreset.config[key];
        }
      }

      return result;
    },
    [editingPreset]
  );

  const getEditedSection = useCallback(
    (section: LogoSection | "textContent" | "customPrompt" | "brandColors"): Partial<LogoPresetConfig> => {
      const fields = SECTION_FIELD_MAP[section];
      const result: Partial<LogoPresetConfig> = {};

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
        const key = field as keyof LogoPresetConfig;
        if (editedConfig[key] !== undefined) {
          (result as Record<string, unknown>)[key] = editedConfig[key];
        }
      }

      return result;
    },
    [editedConfig]
  );

  const hasChangesInSection = useCallback(
    (section: LogoSection | "textContent" | "customPrompt" | "brandColors"): boolean => {
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
