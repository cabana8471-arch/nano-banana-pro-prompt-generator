"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getBannerTemplateById, getBannerSizeById } from "@/lib/data/banner-templates";
import type {
  BannerBuilderState,
  BannerTextContent,
  BannerPresetConfig,
  BannerBrandAssets,
  BannerGenerationSettings,
  BannerSizeTemplate,
  BannerTemplateCategory,
  SelectedBannerReference,
} from "@/lib/types/banner";
import {
  DEFAULT_BANNER_BUILDER_STATE,
  DEFAULT_BANNER_GENERATION_SETTINGS,
} from "@/lib/types/banner";

// ==========================================
// Types
// ==========================================

interface UseBannerBuilderReturn {
  // State
  state: BannerBuilderState;
  settings: BannerGenerationSettings;
  brandAssets: BannerBrandAssets;

  // Category setters (Section A: Basic Configuration)
  setBannerType: (value: string) => void;
  setBannerSize: (value: string) => void;
  setIndustry: (value: string) => void;

  // Custom size setters
  setCustomWidth: (value: number | null) => void;
  setCustomHeight: (value: number | null) => void;

  // Category setters (Section B: Visual Style)
  setDesignStyle: (value: string) => void;
  setColorScheme: (value: string) => void;
  setMood: (value: string) => void;
  setSeasonal: (value: string) => void;

  // Category setters (Section C: Visual Elements)
  setBackgroundStyle: (value: string) => void;
  setVisualEffects: (value: string) => void;
  setIconGraphics: (value: string) => void;
  setPromotionalElements: (value: string) => void;

  // Category setters (Section D: Layout & Typography)
  setLayoutStyle: (value: string) => void;
  setTextLanguage: (value: string) => void;
  setTextPlacement: (value: string) => void;
  setTypographyStyle: (value: string) => void;
  setHeadlineTypography: (value: string) => void;
  setBodyTypography: (value: string) => void;
  setCtaTypography: (value: string) => void;
  setCtaButtonStyle: (value: string) => void;

  // Generic category setter
  setCategoryValue: (category: BannerTemplateCategory, value: string) => void;

  // Text content setters
  setTextContent: (content: Partial<BannerTextContent>) => void;
  setHeadline: (value: string) => void;
  setSubheadline: (value: string) => void;
  setCtaText: (value: string) => void;
  setTagline: (value: string) => void;

  // Custom prompt
  setCustomPrompt: (value: string) => void;

  // Product Swap Mode
  setProductSwapMode: (value: boolean) => void;

  // Settings
  setSettings: (settings: Partial<BannerGenerationSettings>) => void;

  // Brand assets
  setBrandAssets: (assets: Partial<BannerBrandAssets>) => void;
  setLogoAvatarId: (avatarId: string | undefined) => void;
  setProductImageAvatarId: (avatarId: string | undefined) => void;

  // Computed values
  assembledPrompt: string;
  selectedBannerSize: BannerSizeTemplate | undefined;
  hasAnySelection: boolean;
  selectionCount: number;

  // Reference images for generation (logo and product)
  referenceImages: { avatarId: string; type: "logo" | "product" }[];

  // Banner references (style, composition, color)
  selectedBannerReferenceIds: string[];
  setSelectedBannerReferenceIds: (ids: string[]) => void;
  bannerReferences: SelectedBannerReference[];

  // Actions
  reset: () => void;
  loadFromPreset: (config: BannerPresetConfig) => void;
  getCurrentConfig: () => BannerPresetConfig;
  clearCategory: (category: BannerTemplateCategory) => void;
  clearAllCategories: () => void;
  clearTextContent: () => void;
  swapColors: () => void;
  saveSettingsAsDefaults: () => void;
}

// ==========================================
// Default Values
// ==========================================

const defaultBrandAssets: BannerBrandAssets = {};

function getUserDefaultBannerSettings(): BannerGenerationSettings {
  if (typeof window === "undefined") return DEFAULT_BANNER_GENERATION_SETTINGS;
  try {
    const stored = localStorage.getItem("nano-banana:defaults:banner");
    return stored ? JSON.parse(stored) : DEFAULT_BANNER_GENERATION_SETTINGS;
  } catch {
    return DEFAULT_BANNER_GENERATION_SETTINGS;
  }
}

// ==========================================
// Hook Implementation
// ==========================================

export function useBannerBuilder(): UseBannerBuilderReturn {
  // Auto-save / restore from localStorage
  const [savedState, persistState, clearSavedState] = useLocalStorage<{
    state: BannerBuilderState;
    settings: BannerGenerationSettings;
    brandAssets: BannerBrandAssets;
    referenceIds: string[];
  }>("nano-banana:banner-builder", {
    state: DEFAULT_BANNER_BUILDER_STATE,
    settings: DEFAULT_BANNER_GENERATION_SETTINGS,
    brandAssets: defaultBrandAssets,
    referenceIds: [],
  });

  const [state, setState] = useState<BannerBuilderState>(savedState?.state ?? DEFAULT_BANNER_BUILDER_STATE);
  const [settings, setSettingsState] = useState<BannerGenerationSettings>(
    savedState?.settings ?? getUserDefaultBannerSettings()
  );
  const [brandAssets, setBrandAssetsState] = useState<BannerBrandAssets>(savedState?.brandAssets ?? defaultBrandAssets);
  const [selectedBannerReferenceIds, setSelectedBannerReferenceIds] = useState<string[]>(savedState?.referenceIds ?? []);

  // Persist state changes
  useEffect(() => {
    persistState({ state, settings, brandAssets, referenceIds: selectedBannerReferenceIds });
  }, [state, settings, brandAssets, selectedBannerReferenceIds, persistState]);

  // ==========================================
  // Section A: Basic Configuration Setters
  // ==========================================

  const setBannerType = useCallback((value: string) => {
    setState((prev) => ({ ...prev, bannerType: value }));
  }, []);

  const setBannerSize = useCallback((value: string) => {
    setState((prev) => ({ ...prev, bannerSize: value }));
  }, []);

  const setIndustry = useCallback((value: string) => {
    setState((prev) => ({ ...prev, industry: value }));
  }, []);

  // Custom size setters
  const setCustomWidth = useCallback((value: number | null) => {
    setState((prev) => ({ ...prev, customWidth: value }));
  }, []);

  const setCustomHeight = useCallback((value: number | null) => {
    setState((prev) => ({ ...prev, customHeight: value }));
  }, []);

  // ==========================================
  // Section B: Visual Style Setters
  // ==========================================

  const setDesignStyle = useCallback((value: string) => {
    setState((prev) => ({ ...prev, designStyle: value }));
  }, []);

  const setColorScheme = useCallback((value: string) => {
    setState((prev) => ({ ...prev, colorScheme: value }));
  }, []);

  const setMood = useCallback((value: string) => {
    setState((prev) => ({ ...prev, mood: value }));
  }, []);

  const setSeasonal = useCallback((value: string) => {
    setState((prev) => ({ ...prev, seasonal: value }));
  }, []);

  // ==========================================
  // Section C: Visual Elements Setters
  // ==========================================

  const setBackgroundStyle = useCallback((value: string) => {
    setState((prev) => ({ ...prev, backgroundStyle: value }));
  }, []);

  const setVisualEffects = useCallback((value: string) => {
    setState((prev) => ({ ...prev, visualEffects: value }));
  }, []);

  const setIconGraphics = useCallback((value: string) => {
    setState((prev) => ({ ...prev, iconGraphics: value }));
  }, []);

  const setPromotionalElements = useCallback((value: string) => {
    setState((prev) => ({ ...prev, promotionalElements: value }));
  }, []);

  // ==========================================
  // Section D: Layout & Typography Setters
  // ==========================================

  const setLayoutStyle = useCallback((value: string) => {
    setState((prev) => ({ ...prev, layoutStyle: value }));
  }, []);

  const setTextLanguage = useCallback((value: string) => {
    setState((prev) => ({ ...prev, textLanguage: value }));
  }, []);

  const setTextPlacement = useCallback((value: string) => {
    setState((prev) => ({ ...prev, textPlacement: value }));
  }, []);

  const setTypographyStyle = useCallback((value: string) => {
    setState((prev) => ({ ...prev, typographyStyle: value }));
  }, []);

  const setHeadlineTypography = useCallback((value: string) => {
    setState((prev) => ({ ...prev, headlineTypography: value }));
  }, []);

  const setBodyTypography = useCallback((value: string) => {
    setState((prev) => ({ ...prev, bodyTypography: value }));
  }, []);

  const setCtaTypography = useCallback((value: string) => {
    setState((prev) => ({ ...prev, ctaTypography: value }));
  }, []);

  const setCtaButtonStyle = useCallback((value: string) => {
    setState((prev) => ({ ...prev, ctaButtonStyle: value }));
  }, []);

  // ==========================================
  // Generic Category Setter
  // ==========================================

  const setCategoryValue = useCallback((category: BannerTemplateCategory, value: string) => {
    setState((prev) => ({ ...prev, [category]: value }));
  }, []);

  // ==========================================
  // Text Content Setters
  // ==========================================

  const setTextContent = useCallback((content: Partial<BannerTextContent>) => {
    setState((prev) => ({
      ...prev,
      textContent: { ...prev.textContent, ...content },
    }));
  }, []);

  const setHeadline = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      textContent: { ...prev.textContent, headline: value },
    }));
  }, []);

  const setSubheadline = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      textContent: { ...prev.textContent, subheadline: value },
    }));
  }, []);

  const setCtaText = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      textContent: { ...prev.textContent, ctaText: value },
    }));
  }, []);

  const setTagline = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      textContent: { ...prev.textContent, tagline: value },
    }));
  }, []);

  // ==========================================
  // Custom Prompt
  // ==========================================

  const setCustomPrompt = useCallback((value: string) => {
    setState((prev) => ({ ...prev, customPrompt: value }));
  }, []);

  // ==========================================
  // Product Swap Mode
  // ==========================================

  const setProductSwapMode = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, productSwapMode: value }));
  }, []);

  // ==========================================
  // Settings
  // ==========================================

  const setSettings = useCallback((newSettings: Partial<BannerGenerationSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // ==========================================
  // Brand Assets
  // ==========================================

  const setBrandAssets = useCallback((assets: Partial<BannerBrandAssets>) => {
    setBrandAssetsState((prev) => ({ ...prev, ...assets }));
  }, []);

  const setLogoAvatarId = useCallback((avatarId: string | undefined) => {
    setBrandAssetsState((prev) => {
      if (avatarId === undefined) {
        const { logoAvatarId: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, logoAvatarId: avatarId };
    });
  }, []);

  const setProductImageAvatarId = useCallback((avatarId: string | undefined) => {
    setBrandAssetsState((prev) => {
      if (avatarId === undefined) {
        const { productImageAvatarId: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, productImageAvatarId: avatarId };
    });
  }, []);

  // ==========================================
  // Helper to get prompt fragment from template ID
  // ==========================================

  const getPromptValue = useCallback((value: string): string => {
    if (!value) return "";
    const template = getBannerTemplateById(value);
    return template ? template.promptFragment : value;
  }, []);

  // ==========================================
  // Assembled Prompt
  // ==========================================

  const assembledPrompt = useMemo(() => {
    const parts: string[] = [];

    // Get dimensions for intro
    const sizeTemplate = state.bannerSize ? getBannerSizeById(state.bannerSize) : undefined;
    let dimensions = "";
    if (state.bannerSize === "size-custom" && state.customWidth && state.customHeight) {
      dimensions = `${state.customWidth}x${state.customHeight}`;
    } else if (sizeTemplate && sizeTemplate.width > 0 && sizeTemplate.height > 0) {
      dimensions = `${sizeTemplate.width}x${sizeTemplate.height}`;
    }

    // Product Swap Mode - concise prompt (similar to what works in AI Studio)
    if (state.productSwapMode && selectedBannerReferenceIds.length > 0) {
      // Build a simple, direct prompt
      let swapPrompt = `Generate an image of ${dimensions || "the same size"}`;
      swapPrompt += `, with the exact background, layout, and style from the first image`;
      swapPrompt += `, but replace the product/object with the one from the second image, in the same position`;

      // Text replacements - keep it simple
      const textChanges: string[] = [];
      if (state.textContent.headline) {
        textChanges.push(`headline "${state.textContent.headline}"`);
      }
      if (state.textContent.subheadline) {
        textChanges.push(`subheadline "${state.textContent.subheadline}"`);
      }
      if (state.textContent.ctaText) {
        textChanges.push(`button text "${state.textContent.ctaText}"`);
      }
      if (state.textContent.tagline) {
        textChanges.push(`tagline "${state.textContent.tagline}"`);
      }
      if (textChanges.length > 0) {
        swapPrompt += `. Use this text: ${textChanges.join(", ")}`;
      }

      // Add custom prompt if specified
      if (state.customPrompt) {
        swapPrompt += `. ${state.customPrompt}`;
      }

      return swapPrompt;
    }

    // Normal mode - standard prompt assembly
    // Start with a contextual intro including dimensions
    const bannerTypePrompt = getPromptValue(state.bannerType);
    if (dimensions && bannerTypePrompt) {
      parts.push(`A professional ${dimensions} ${bannerTypePrompt}`);
    } else if (dimensions) {
      parts.push(`A professional ${dimensions} web banner`);
    } else if (bannerTypePrompt) {
      parts.push(`A professional ${bannerTypePrompt}`);
    } else {
      parts.push("A professional web banner design");
    }

    // Add industry/niche context
    const industryPrompt = getPromptValue(state.industry);
    if (industryPrompt) {
      parts.push(industryPrompt);
    }

    // Add design style
    const designStylePrompt = getPromptValue(state.designStyle);
    if (designStylePrompt) {
      parts.push(designStylePrompt);
    }

    // Add color scheme
    const colorSchemePrompt = getPromptValue(state.colorScheme);
    if (colorSchemePrompt) {
      parts.push(colorSchemePrompt);
    }

    // Add mood/emotion
    const moodPrompt = getPromptValue(state.mood);
    if (moodPrompt) {
      parts.push(moodPrompt);
    }

    // Add seasonal/holiday theme
    const seasonalPrompt = getPromptValue(state.seasonal);
    if (seasonalPrompt) {
      parts.push(seasonalPrompt);
    }

    // Add background style
    const backgroundPrompt = getPromptValue(state.backgroundStyle);
    if (backgroundPrompt) {
      parts.push(backgroundPrompt);
    }

    // Add visual effects
    const effectsPrompt = getPromptValue(state.visualEffects);
    if (effectsPrompt) {
      parts.push(effectsPrompt);
    }

    // Add icon/graphics
    const iconsPrompt = getPromptValue(state.iconGraphics);
    if (iconsPrompt) {
      parts.push(iconsPrompt);
    }

    // Add promotional elements
    const promoPrompt = getPromptValue(state.promotionalElements);
    if (promoPrompt) {
      parts.push(promoPrompt);
    }

    // Add layout style
    const layoutPrompt = getPromptValue(state.layoutStyle);
    if (layoutPrompt) {
      parts.push(layoutPrompt);
    }

    // Add text language
    const textLanguagePrompt = getPromptValue(state.textLanguage);
    if (textLanguagePrompt) {
      parts.push(textLanguagePrompt);
    }

    // Add text placement
    const placementPrompt = getPromptValue(state.textPlacement);
    if (placementPrompt) {
      parts.push(placementPrompt);
    }

    // Add general typography style (fallback for all text if specific ones not set)
    const typoPrompt = getPromptValue(state.typographyStyle);
    if (typoPrompt) {
      parts.push(typoPrompt);
    }

    // Add CTA button style
    const ctaPrompt = getPromptValue(state.ctaButtonStyle);
    if (ctaPrompt) {
      parts.push(ctaPrompt);
    }

    // Add banner size context with explicit size instruction
    if (sizeTemplate) {
      // Handle custom size
      if (state.bannerSize === "size-custom" && state.customWidth && state.customHeight) {
        parts.push("custom dimensions banner format");
        parts.push(
          `IMPORTANT: The generated image MUST be exactly ${state.customWidth}x${state.customHeight} pixels. Do not deviate from these exact dimensions.`
        );
      } else if (sizeTemplate.width > 0 && sizeTemplate.height > 0) {
        parts.push(sizeTemplate.promptFragment);
        parts.push(
          `IMPORTANT: The generated image MUST be exactly ${sizeTemplate.width}x${sizeTemplate.height} pixels. Do not deviate from these exact dimensions.`
        );
      }
    }

    // Add text content to prompt with specific typography styles
    const textParts: string[] = [];

    // Get specific typography styles or fallback to general
    const headlineTypo = getPromptValue(state.headlineTypography) || typoPrompt;
    const bodyTypo = getPromptValue(state.bodyTypography) || typoPrompt;
    const ctaTextTypo = getPromptValue(state.ctaTypography) || typoPrompt;

    if (state.textContent.headline) {
      const typoStyle = headlineTypo ? ` using ${headlineTypo}` : "";
      textParts.push(`headline text: "${state.textContent.headline}"${typoStyle}`);
    }
    if (state.textContent.subheadline) {
      const typoStyle = bodyTypo ? ` using ${bodyTypo}` : "";
      textParts.push(`subheadline text: "${state.textContent.subheadline}"${typoStyle}`);
    }
    if (state.textContent.ctaText) {
      const typoStyle = ctaTextTypo ? ` using ${ctaTextTypo}` : "";
      textParts.push(`call-to-action button with text: "${state.textContent.ctaText}"${typoStyle}`);
    }
    if (state.textContent.tagline) {
      const typoStyle = bodyTypo ? ` using ${bodyTypo}` : "";
      textParts.push(`tagline or offer text: "${state.textContent.tagline}"${typoStyle}`);
    }

    if (textParts.length > 0) {
      parts.push(`Text elements: ${textParts.join(", ")}`);
    }

    // Add brand colors if specified
    if (brandAssets.primaryColor || brandAssets.secondaryColor || brandAssets.accentColor) {
      const colorParts: string[] = [];
      if (brandAssets.primaryColor) {
        colorParts.push(`primary brand color ${brandAssets.primaryColor}`);
      }
      if (brandAssets.secondaryColor) {
        colorParts.push(`secondary color ${brandAssets.secondaryColor}`);
      }
      if (brandAssets.accentColor) {
        colorParts.push(`accent color ${brandAssets.accentColor}`);
      }
      parts.push(`Using ${colorParts.join(", ")}`);
    }

    // Add custom prompt at the end
    if (state.customPrompt) {
      parts.push(state.customPrompt);
    }

    // Final quality instructions
    parts.push("High quality advertising design with clean composition and professional finish");

    return parts.filter(Boolean).join(". ");
  }, [state, brandAssets, getPromptValue, selectedBannerReferenceIds]);

  // ==========================================
  // Selected Banner Size
  // ==========================================

  const selectedBannerSize = useMemo((): BannerSizeTemplate | undefined => {
    if (!state.bannerSize) return undefined;
    const template = getBannerSizeById(state.bannerSize);
    if (!template) return undefined;

    // For custom size, return a modified template with custom dimensions
    if (state.bannerSize === "size-custom" && state.customWidth && state.customHeight) {
      return {
        ...template,
        width: state.customWidth,
        height: state.customHeight,
      };
    }

    return template;
  }, [state.bannerSize, state.customWidth, state.customHeight]);

  // ==========================================
  // Selection Statistics
  // ==========================================

  const hasAnySelection = useMemo(() => {
    return !!(
      state.bannerType ||
      state.bannerSize ||
      state.industry ||
      state.designStyle ||
      state.colorScheme ||
      state.mood ||
      state.seasonal ||
      state.backgroundStyle ||
      state.visualEffects ||
      state.iconGraphics ||
      state.promotionalElements ||
      state.layoutStyle ||
      state.textLanguage ||
      state.textPlacement ||
      state.typographyStyle ||
      state.headlineTypography ||
      state.bodyTypography ||
      state.ctaTypography ||
      state.ctaButtonStyle ||
      state.textContent.headline ||
      state.textContent.subheadline ||
      state.textContent.ctaText ||
      state.textContent.tagline ||
      state.customPrompt
    );
  }, [state]);

  const selectionCount = useMemo(() => {
    let count = 0;
    if (state.bannerType) count++;
    if (state.bannerSize) count++;
    if (state.industry) count++;
    if (state.designStyle) count++;
    if (state.colorScheme) count++;
    if (state.mood) count++;
    if (state.seasonal) count++;
    if (state.backgroundStyle) count++;
    if (state.visualEffects) count++;
    if (state.iconGraphics) count++;
    if (state.promotionalElements) count++;
    if (state.layoutStyle) count++;
    if (state.textLanguage) count++;
    if (state.textPlacement) count++;
    if (state.typographyStyle) count++;
    if (state.headlineTypography) count++;
    if (state.bodyTypography) count++;
    if (state.ctaTypography) count++;
    if (state.ctaButtonStyle) count++;
    return count;
  }, [state]);

  // ==========================================
  // Reference Images
  // ==========================================

  const referenceImages = useMemo(() => {
    const images: { avatarId: string; type: "logo" | "product" }[] = [];

    if (brandAssets.logoAvatarId) {
      images.push({ avatarId: brandAssets.logoAvatarId, type: "logo" });
    }
    if (brandAssets.productImageAvatarId) {
      images.push({ avatarId: brandAssets.productImageAvatarId, type: "product" });
    }

    return images;
  }, [brandAssets.logoAvatarId, brandAssets.productImageAvatarId]);

  // ==========================================
  // Banner References (for style/composition/color)
  // ==========================================

  // Note: We store just IDs here. The actual reference type comes from the database.
  // The bannerReferences computed value will be populated by the parent component
  // which has access to the full BannerReference objects from useBannerReferences hook.
  const bannerReferences = useMemo((): SelectedBannerReference[] => {
    // This returns empty array - actual data should be joined with useBannerReferences
    // in the parent component that has access to the full reference data
    return selectedBannerReferenceIds.map((id) => ({
      referenceId: id,
      type: "style" as const, // Default type, will be overridden by actual data
    }));
  }, [selectedBannerReferenceIds]);

  // ==========================================
  // Actions
  // ==========================================

  const reset = useCallback(() => {
    setState(DEFAULT_BANNER_BUILDER_STATE);
    setSettingsState(getUserDefaultBannerSettings());
    setBrandAssetsState(defaultBrandAssets);
    setSelectedBannerReferenceIds([]);
    clearSavedState();
  }, [clearSavedState]);

  const loadFromPreset = useCallback((config: BannerPresetConfig) => {
    setState((prev) => ({
      ...prev,
      bannerType: config.bannerType ?? prev.bannerType,
      bannerSize: config.bannerSize ?? prev.bannerSize,
      industry: config.industry ?? prev.industry,
      customWidth: config.customWidth ?? prev.customWidth,
      customHeight: config.customHeight ?? prev.customHeight,
      designStyle: config.designStyle ?? prev.designStyle,
      colorScheme: config.colorScheme ?? prev.colorScheme,
      mood: config.mood ?? prev.mood,
      seasonal: config.seasonal ?? prev.seasonal,
      backgroundStyle: config.backgroundStyle ?? prev.backgroundStyle,
      visualEffects: config.visualEffects ?? prev.visualEffects,
      iconGraphics: config.iconGraphics ?? prev.iconGraphics,
      promotionalElements: config.promotionalElements ?? prev.promotionalElements,
      layoutStyle: config.layoutStyle ?? prev.layoutStyle,
      textLanguage: config.textLanguage ?? prev.textLanguage,
      textPlacement: config.textPlacement ?? prev.textPlacement,
      typographyStyle: config.typographyStyle ?? prev.typographyStyle,
      headlineTypography: config.headlineTypography ?? prev.headlineTypography,
      bodyTypography: config.bodyTypography ?? prev.bodyTypography,
      ctaTypography: config.ctaTypography ?? prev.ctaTypography,
      ctaButtonStyle: config.ctaButtonStyle ?? prev.ctaButtonStyle,
      textContent: config.textContent
        ? { ...prev.textContent, ...config.textContent }
        : prev.textContent,
      customPrompt: config.customPrompt ?? prev.customPrompt,
    }));
  }, []);

  const getCurrentConfig = useCallback((): BannerPresetConfig => {
    const config: BannerPresetConfig = {};

    // Only include non-empty values
    if (state.bannerType) config.bannerType = state.bannerType;
    if (state.bannerSize) config.bannerSize = state.bannerSize;
    if (state.industry) config.industry = state.industry;
    // Include custom dimensions if custom size is selected
    if (state.bannerSize === "size-custom") {
      if (state.customWidth) config.customWidth = state.customWidth;
      if (state.customHeight) config.customHeight = state.customHeight;
    }
    if (state.designStyle) config.designStyle = state.designStyle;
    if (state.colorScheme) config.colorScheme = state.colorScheme;
    if (state.mood) config.mood = state.mood;
    if (state.seasonal) config.seasonal = state.seasonal;
    if (state.backgroundStyle) config.backgroundStyle = state.backgroundStyle;
    if (state.visualEffects) config.visualEffects = state.visualEffects;
    if (state.iconGraphics) config.iconGraphics = state.iconGraphics;
    if (state.promotionalElements) config.promotionalElements = state.promotionalElements;
    if (state.layoutStyle) config.layoutStyle = state.layoutStyle;
    if (state.textLanguage) config.textLanguage = state.textLanguage;
    if (state.textPlacement) config.textPlacement = state.textPlacement;
    if (state.typographyStyle) config.typographyStyle = state.typographyStyle;
    if (state.headlineTypography) config.headlineTypography = state.headlineTypography;
    if (state.bodyTypography) config.bodyTypography = state.bodyTypography;
    if (state.ctaTypography) config.ctaTypography = state.ctaTypography;
    if (state.ctaButtonStyle) config.ctaButtonStyle = state.ctaButtonStyle;

    // Include text content if any field has a value
    const hasTextContent =
      state.textContent.headline ||
      state.textContent.subheadline ||
      state.textContent.ctaText ||
      state.textContent.tagline;
    if (hasTextContent) {
      config.textContent = {};
      if (state.textContent.headline) config.textContent.headline = state.textContent.headline;
      if (state.textContent.subheadline)
        config.textContent.subheadline = state.textContent.subheadline;
      if (state.textContent.ctaText) config.textContent.ctaText = state.textContent.ctaText;
      if (state.textContent.tagline) config.textContent.tagline = state.textContent.tagline;
    }

    if (state.customPrompt) config.customPrompt = state.customPrompt;

    return config;
  }, [state]);

  const clearCategory = useCallback((category: BannerTemplateCategory) => {
    setState((prev) => ({ ...prev, [category]: "" }));
  }, []);

  const clearAllCategories = useCallback(() => {
    setState((prev) => ({
      ...prev,
      bannerType: "",
      bannerSize: "",
      industry: "",
      designStyle: "",
      colorScheme: "",
      mood: "",
      seasonal: "",
      backgroundStyle: "",
      visualEffects: "",
      iconGraphics: "",
      promotionalElements: "",
      layoutStyle: "",
      textLanguage: "",
      textPlacement: "",
      typographyStyle: "",
      headlineTypography: "",
      bodyTypography: "",
      ctaTypography: "",
      ctaButtonStyle: "",
      customPrompt: "",
    }));
  }, []);

  const clearTextContent = useCallback(() => {
    setState((prev) => ({
      ...prev,
      textContent: {
        headline: "",
        subheadline: "",
        ctaText: "",
        tagline: "",
      },
    }));
  }, []);

  // Swap primary and secondary colors
  const swapColors = useCallback(() => {
    setBrandAssetsState((prev) => {
      // With exactOptionalPropertyTypes, we need to explicitly build the new object
      // Only include properties that have values
      const result: BannerBrandAssets = {};

      if (prev.logoAvatarId !== undefined) {
        result.logoAvatarId = prev.logoAvatarId;
      }
      if (prev.productImageAvatarId !== undefined) {
        result.productImageAvatarId = prev.productImageAvatarId;
      }
      if (prev.accentColor !== undefined) {
        result.accentColor = prev.accentColor;
      }

      // Swap primary and secondary - only set if the source has a value
      if (prev.secondaryColor !== undefined) {
        result.primaryColor = prev.secondaryColor;
      }
      if (prev.primaryColor !== undefined) {
        result.secondaryColor = prev.primaryColor;
      }

      return result;
    });
  }, []);

  // Save current settings as user defaults
  const saveSettingsAsDefaults = useCallback(() => {
    try {
      localStorage.setItem("nano-banana:defaults:banner", JSON.stringify(settings));
    } catch {
      // Ignore quota errors
    }
  }, [settings]);

  // ==========================================
  // Return
  // ==========================================

  return {
    // State
    state,
    settings,
    brandAssets,

    // Section A setters
    setBannerType,
    setBannerSize,
    setIndustry,

    // Custom size setters
    setCustomWidth,
    setCustomHeight,

    // Section B setters
    setDesignStyle,
    setColorScheme,
    setMood,
    setSeasonal,

    // Section C setters
    setBackgroundStyle,
    setVisualEffects,
    setIconGraphics,
    setPromotionalElements,

    // Section D setters
    setLayoutStyle,
    setTextLanguage,
    setTextPlacement,
    setTypographyStyle,
    setHeadlineTypography,
    setBodyTypography,
    setCtaTypography,
    setCtaButtonStyle,

    // Generic setter
    setCategoryValue,

    // Text content setters
    setTextContent,
    setHeadline,
    setSubheadline,
    setCtaText,
    setTagline,

    // Custom prompt
    setCustomPrompt,

    // Product Swap Mode
    setProductSwapMode,

    // Settings
    setSettings,

    // Brand assets
    setBrandAssets,
    setLogoAvatarId,
    setProductImageAvatarId,

    // Computed
    assembledPrompt,
    selectedBannerSize,
    hasAnySelection,
    selectionCount,
    referenceImages,

    // Banner references
    selectedBannerReferenceIds,
    setSelectedBannerReferenceIds,
    bannerReferences,

    // Actions
    reset,
    loadFromPreset,
    getCurrentConfig,
    clearCategory,
    clearAllCategories,
    clearTextContent,
    swapColors,
    saveSettingsAsDefaults,
  };
}
