"use client";

import { useState, useCallback, useMemo } from "react";
import { getLogoTemplateById } from "@/lib/data/logo-templates";
import type {
  LogoBuilderState,
  LogoTextContent,
  LogoPresetConfig,
  LogoGenerationSettings,
  LogoTemplateCategory,
  SelectedLogoReference,
} from "@/lib/types/logo";
import {
  DEFAULT_LOGO_BUILDER_STATE,
  DEFAULT_LOGO_GENERATION_SETTINGS,
} from "@/lib/types/logo";

// ==========================================
// Types
// ==========================================

interface UseLogoBuilderReturn {
  // State
  state: LogoBuilderState;
  settings: LogoGenerationSettings;

  // Category setters (Section A: Basic Configuration)
  setLogoType: (value: string) => void;
  setIndustry: (value: string) => void;
  setLogoFormat: (value: string) => void;

  // Category setters (Section B: Visual Style)
  setDesignStyle: (value: string) => void;
  setColorSchemeType: (value: string) => void;
  setMood: (value: string) => void;

  // Category setters (Section C: Icon/Symbol Design)
  setIconStyle: (value: string) => void;
  setSymbolElements: (values: string[]) => void;
  addSymbolElement: (value: string) => void;
  removeSymbolElement: (value: string) => void;

  // Category setters (Section D: Typography)
  setFontCategory: (value: string) => void;
  setTypographyTreatment: (value: string) => void;

  // Category setters (Section E: Additional Options)
  setSpecialEffects: (value: string) => void;
  setBackgroundStyle: (value: string) => void;

  // Generic category setter
  setCategoryValue: (category: LogoTemplateCategory, value: string) => void;

  // Text content setters
  setTextContent: (content: Partial<LogoTextContent>) => void;
  setCompanyName: (value: string) => void;
  setTagline: (value: string) => void;
  setAbbreviation: (value: string) => void;

  // Color setters
  setPrimaryColor: (value: string) => void;
  setSecondaryColor: (value: string) => void;
  setAccentColor: (value: string) => void;

  // Custom prompt
  setCustomPrompt: (value: string) => void;

  // Settings
  setSettings: (settings: Partial<LogoGenerationSettings>) => void;

  // Computed values
  assembledPrompt: string;
  hasAnySelection: boolean;
  selectionCount: number;

  // Logo references (style, composition, color)
  selectedLogoReferenceIds: string[];
  setSelectedLogoReferenceIds: (ids: string[]) => void;
  logoReferences: SelectedLogoReference[];

  // Actions
  reset: () => void;
  loadFromPreset: (config: LogoPresetConfig) => void;
  getCurrentConfig: () => LogoPresetConfig;
  clearCategory: (category: LogoTemplateCategory) => void;
  clearAllCategories: () => void;
  clearTextContent: () => void;
  swapColors: () => void;
}

// ==========================================
// Hook Implementation
// ==========================================

export function useLogoBuilder(): UseLogoBuilderReturn {
  const [state, setState] = useState<LogoBuilderState>(DEFAULT_LOGO_BUILDER_STATE);
  const [settings, setSettingsState] = useState<LogoGenerationSettings>(
    DEFAULT_LOGO_GENERATION_SETTINGS
  );
  const [selectedLogoReferenceIds, setSelectedLogoReferenceIds] = useState<string[]>([]);

  // ==========================================
  // Section A: Basic Configuration Setters
  // ==========================================

  const setLogoType = useCallback((value: string) => {
    setState((prev) => ({ ...prev, logoType: value }));
  }, []);

  const setIndustry = useCallback((value: string) => {
    setState((prev) => ({ ...prev, industry: value }));
  }, []);

  const setLogoFormat = useCallback((value: string) => {
    setState((prev) => ({ ...prev, logoFormat: value }));
  }, []);

  // ==========================================
  // Section B: Visual Style Setters
  // ==========================================

  const setDesignStyle = useCallback((value: string) => {
    setState((prev) => ({ ...prev, designStyle: value }));
  }, []);

  const setColorSchemeType = useCallback((value: string) => {
    setState((prev) => ({ ...prev, colorSchemeType: value }));
  }, []);

  const setMood = useCallback((value: string) => {
    setState((prev) => ({ ...prev, mood: value }));
  }, []);

  // ==========================================
  // Section C: Icon/Symbol Design Setters
  // ==========================================

  const setIconStyle = useCallback((value: string) => {
    setState((prev) => ({ ...prev, iconStyle: value }));
  }, []);

  const setSymbolElements = useCallback((values: string[]) => {
    setState((prev) => ({ ...prev, symbolElements: values }));
  }, []);

  const addSymbolElement = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      symbolElements: prev.symbolElements.includes(value)
        ? prev.symbolElements
        : [...prev.symbolElements, value],
    }));
  }, []);

  const removeSymbolElement = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      symbolElements: prev.symbolElements.filter((el) => el !== value),
    }));
  }, []);

  // ==========================================
  // Section D: Typography Setters
  // ==========================================

  const setFontCategory = useCallback((value: string) => {
    setState((prev) => ({ ...prev, fontCategory: value }));
  }, []);

  const setTypographyTreatment = useCallback((value: string) => {
    setState((prev) => ({ ...prev, typographyTreatment: value }));
  }, []);

  // ==========================================
  // Section E: Additional Options Setters
  // ==========================================

  const setSpecialEffects = useCallback((value: string) => {
    setState((prev) => ({ ...prev, specialEffects: value }));
  }, []);

  const setBackgroundStyle = useCallback((value: string) => {
    setState((prev) => ({ ...prev, backgroundStyle: value }));
  }, []);

  // ==========================================
  // Generic Category Setter
  // ==========================================

  const setCategoryValue = useCallback((category: LogoTemplateCategory, value: string) => {
    if (category === "symbolElements") {
      // Handle multi-select separately
      return;
    }
    setState((prev) => ({ ...prev, [category]: value }));
  }, []);

  // ==========================================
  // Text Content Setters
  // ==========================================

  const setTextContent = useCallback((content: Partial<LogoTextContent>) => {
    setState((prev) => ({
      ...prev,
      textContent: { ...prev.textContent, ...content },
    }));
  }, []);

  const setCompanyName = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      textContent: { ...prev.textContent, companyName: value },
    }));
  }, []);

  const setTagline = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      textContent: { ...prev.textContent, tagline: value },
    }));
  }, []);

  const setAbbreviation = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      textContent: { ...prev.textContent, abbreviation: value },
    }));
  }, []);

  // ==========================================
  // Color Setters
  // ==========================================

  const setPrimaryColor = useCallback((value: string) => {
    setState((prev) => ({ ...prev, primaryColor: value }));
  }, []);

  const setSecondaryColor = useCallback((value: string) => {
    setState((prev) => ({ ...prev, secondaryColor: value }));
  }, []);

  const setAccentColor = useCallback((value: string) => {
    setState((prev) => ({ ...prev, accentColor: value }));
  }, []);

  // ==========================================
  // Custom Prompt
  // ==========================================

  const setCustomPrompt = useCallback((value: string) => {
    setState((prev) => ({ ...prev, customPrompt: value }));
  }, []);

  // ==========================================
  // Settings
  // ==========================================

  const setSettings = useCallback((newSettings: Partial<LogoGenerationSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // ==========================================
  // Helper to get prompt fragment from template ID
  // ==========================================

  const getPromptValue = useCallback((value: string): string => {
    if (!value) return "";
    const template = getLogoTemplateById(value);
    return template ? template.promptFragment : value;
  }, []);

  // ==========================================
  // Assembled Prompt
  // ==========================================

  const assembledPrompt = useMemo(() => {
    const parts: string[] = [];

    // Start with a professional logo prompt
    parts.push("A professional company logo design");

    // Add logo type
    const logoTypePrompt = getPromptValue(state.logoType);
    if (logoTypePrompt) {
      parts.push(logoTypePrompt);
    }

    // Add industry/niche context
    const industryPrompt = getPromptValue(state.industry);
    if (industryPrompt) {
      parts.push(industryPrompt);
    }

    // Add logo format/layout
    const formatPrompt = getPromptValue(state.logoFormat);
    if (formatPrompt) {
      parts.push(formatPrompt);
    }

    // Add design style
    const designStylePrompt = getPromptValue(state.designStyle);
    if (designStylePrompt) {
      parts.push(designStylePrompt);
    }

    // Add color scheme type
    const colorSchemePrompt = getPromptValue(state.colorSchemeType);
    if (colorSchemePrompt) {
      parts.push(colorSchemePrompt);
    }

    // Add mood/tone
    const moodPrompt = getPromptValue(state.mood);
    if (moodPrompt) {
      parts.push(moodPrompt);
    }

    // Add icon style
    const iconStylePrompt = getPromptValue(state.iconStyle);
    if (iconStylePrompt) {
      parts.push(iconStylePrompt);
    }

    // Add symbol elements (multi-select)
    if (state.symbolElements.length > 0) {
      const symbolPrompts = state.symbolElements
        .map((id) => getPromptValue(id))
        .filter(Boolean);
      if (symbolPrompts.length > 0) {
        parts.push(symbolPrompts.join(", "));
      }
    }

    // Add font category
    const fontPrompt = getPromptValue(state.fontCategory);
    if (fontPrompt) {
      parts.push(fontPrompt);
    }

    // Add typography treatment
    const treatmentPrompt = getPromptValue(state.typographyTreatment);
    if (treatmentPrompt) {
      parts.push(treatmentPrompt);
    }

    // Add special effects
    const effectsPrompt = getPromptValue(state.specialEffects);
    if (effectsPrompt) {
      parts.push(effectsPrompt);
    }

    // Add background style
    const backgroundPrompt = getPromptValue(state.backgroundStyle);
    if (backgroundPrompt) {
      parts.push(backgroundPrompt);
    }

    // Add text content
    if (state.textContent.companyName) {
      parts.push(`Company name: "${state.textContent.companyName}"`);
    }
    if (state.textContent.tagline) {
      parts.push(`Tagline: "${state.textContent.tagline}"`);
    }
    if (state.textContent.abbreviation) {
      parts.push(`Abbreviation/initials: "${state.textContent.abbreviation}"`);
    }

    // Add brand colors if specified
    const colorParts: string[] = [];
    if (state.primaryColor) {
      colorParts.push(`primary color ${state.primaryColor}`);
    }
    if (state.secondaryColor) {
      colorParts.push(`secondary color ${state.secondaryColor}`);
    }
    if (state.accentColor) {
      colorParts.push(`accent color ${state.accentColor}`);
    }
    if (colorParts.length > 0) {
      parts.push(`Using ${colorParts.join(", ")}`);
    }

    // Add custom prompt at the end
    if (state.customPrompt) {
      parts.push(state.customPrompt);
    }

    // Final quality instructions
    parts.push(
      "Vector-ready, scalable design that works from favicon to billboard size"
    );

    return parts.filter(Boolean).join(". ");
  }, [state, getPromptValue]);

  // ==========================================
  // Selection Statistics
  // ==========================================

  const hasAnySelection = useMemo(() => {
    return !!(
      state.logoType ||
      state.industry ||
      state.logoFormat ||
      state.designStyle ||
      state.colorSchemeType ||
      state.mood ||
      state.iconStyle ||
      state.symbolElements.length > 0 ||
      state.fontCategory ||
      state.typographyTreatment ||
      state.specialEffects ||
      state.backgroundStyle ||
      state.textContent.companyName ||
      state.textContent.tagline ||
      state.textContent.abbreviation ||
      state.primaryColor ||
      state.secondaryColor ||
      state.accentColor ||
      state.customPrompt
    );
  }, [state]);

  const selectionCount = useMemo(() => {
    let count = 0;
    if (state.logoType) count++;
    if (state.industry) count++;
    if (state.logoFormat) count++;
    if (state.designStyle) count++;
    if (state.colorSchemeType) count++;
    if (state.mood) count++;
    if (state.iconStyle) count++;
    if (state.symbolElements.length > 0) count++;
    if (state.fontCategory) count++;
    if (state.typographyTreatment) count++;
    if (state.specialEffects) count++;
    if (state.backgroundStyle) count++;
    return count;
  }, [state]);

  // ==========================================
  // Logo References (for style/composition/color)
  // ==========================================

  const logoReferences = useMemo((): SelectedLogoReference[] => {
    return selectedLogoReferenceIds.map((id) => ({
      referenceId: id,
      type: "style" as const,
    }));
  }, [selectedLogoReferenceIds]);

  // ==========================================
  // Actions
  // ==========================================

  const reset = useCallback(() => {
    setState(DEFAULT_LOGO_BUILDER_STATE);
    setSettingsState(DEFAULT_LOGO_GENERATION_SETTINGS);
    setSelectedLogoReferenceIds([]);
  }, []);

  const loadFromPreset = useCallback((config: LogoPresetConfig) => {
    setState((prev) => ({
      ...prev,
      logoType: config.logoType ?? prev.logoType,
      industry: config.industry ?? prev.industry,
      logoFormat: config.logoFormat ?? prev.logoFormat,
      designStyle: config.designStyle ?? prev.designStyle,
      colorSchemeType: config.colorSchemeType ?? prev.colorSchemeType,
      mood: config.mood ?? prev.mood,
      iconStyle: config.iconStyle ?? prev.iconStyle,
      symbolElements: config.symbolElements ?? prev.symbolElements,
      fontCategory: config.fontCategory ?? prev.fontCategory,
      typographyTreatment: config.typographyTreatment ?? prev.typographyTreatment,
      specialEffects: config.specialEffects ?? prev.specialEffects,
      backgroundStyle: config.backgroundStyle ?? prev.backgroundStyle,
      textContent: config.textContent
        ? { ...prev.textContent, ...config.textContent }
        : prev.textContent,
      primaryColor: config.primaryColor ?? prev.primaryColor,
      secondaryColor: config.secondaryColor ?? prev.secondaryColor,
      accentColor: config.accentColor ?? prev.accentColor,
      customPrompt: config.customPrompt ?? prev.customPrompt,
    }));
  }, []);

  const getCurrentConfig = useCallback((): LogoPresetConfig => {
    const config: LogoPresetConfig = {};

    // Only include non-empty values
    if (state.logoType) config.logoType = state.logoType;
    if (state.industry) config.industry = state.industry;
    if (state.logoFormat) config.logoFormat = state.logoFormat;
    if (state.designStyle) config.designStyle = state.designStyle;
    if (state.colorSchemeType) config.colorSchemeType = state.colorSchemeType;
    if (state.mood) config.mood = state.mood;
    if (state.iconStyle) config.iconStyle = state.iconStyle;
    if (state.symbolElements.length > 0) config.symbolElements = state.symbolElements;
    if (state.fontCategory) config.fontCategory = state.fontCategory;
    if (state.typographyTreatment) config.typographyTreatment = state.typographyTreatment;
    if (state.specialEffects) config.specialEffects = state.specialEffects;
    if (state.backgroundStyle) config.backgroundStyle = state.backgroundStyle;

    // Include text content if any field has a value
    const hasTextContent =
      state.textContent.companyName ||
      state.textContent.tagline ||
      state.textContent.abbreviation;
    if (hasTextContent) {
      config.textContent = {};
      if (state.textContent.companyName)
        config.textContent.companyName = state.textContent.companyName;
      if (state.textContent.tagline) config.textContent.tagline = state.textContent.tagline;
      if (state.textContent.abbreviation)
        config.textContent.abbreviation = state.textContent.abbreviation;
    }

    // Include colors
    if (state.primaryColor) config.primaryColor = state.primaryColor;
    if (state.secondaryColor) config.secondaryColor = state.secondaryColor;
    if (state.accentColor) config.accentColor = state.accentColor;

    if (state.customPrompt) config.customPrompt = state.customPrompt;

    return config;
  }, [state]);

  const clearCategory = useCallback((category: LogoTemplateCategory) => {
    if (category === "symbolElements") {
      setState((prev) => ({ ...prev, symbolElements: [] }));
    } else {
      setState((prev) => ({ ...prev, [category]: "" }));
    }
  }, []);

  const clearAllCategories = useCallback(() => {
    setState((prev) => ({
      ...prev,
      logoType: "",
      industry: "",
      logoFormat: "",
      designStyle: "",
      colorSchemeType: "",
      mood: "",
      iconStyle: "",
      symbolElements: [],
      fontCategory: "",
      typographyTreatment: "",
      specialEffects: "",
      backgroundStyle: "",
      customPrompt: "",
    }));
  }, []);

  const clearTextContent = useCallback(() => {
    setState((prev) => ({
      ...prev,
      textContent: {
        companyName: "",
        tagline: "",
        abbreviation: "",
      },
    }));
  }, []);

  // Swap primary and secondary colors
  const swapColors = useCallback(() => {
    setState((prev) => ({
      ...prev,
      primaryColor: prev.secondaryColor,
      secondaryColor: prev.primaryColor,
    }));
  }, []);

  // ==========================================
  // Return
  // ==========================================

  return {
    // State
    state,
    settings,

    // Section A setters
    setLogoType,
    setIndustry,
    setLogoFormat,

    // Section B setters
    setDesignStyle,
    setColorSchemeType,
    setMood,

    // Section C setters
    setIconStyle,
    setSymbolElements,
    addSymbolElement,
    removeSymbolElement,

    // Section D setters
    setFontCategory,
    setTypographyTreatment,

    // Section E setters
    setSpecialEffects,
    setBackgroundStyle,

    // Generic setter
    setCategoryValue,

    // Text content setters
    setTextContent,
    setCompanyName,
    setTagline,
    setAbbreviation,

    // Color setters
    setPrimaryColor,
    setSecondaryColor,
    setAccentColor,

    // Custom prompt
    setCustomPrompt,

    // Settings
    setSettings,

    // Computed
    assembledPrompt,
    hasAnySelection,
    selectionCount,

    // Logo references
    selectedLogoReferenceIds,
    setSelectedLogoReferenceIds,
    logoReferences,

    // Actions
    reset,
    loadFromPreset,
    getCurrentConfig,
    clearCategory,
    clearAllCategories,
    clearTextContent,
    swapColors,
  };
}
