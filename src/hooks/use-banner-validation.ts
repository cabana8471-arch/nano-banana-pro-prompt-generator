"use client";

import { useMemo } from "react";
import { getBannerSizeById } from "@/lib/data/banner-templates";
import type {
  BannerTextContent,
  BannerValidationWarning,
  BannerWarningType,
  CharacterLimits,
} from "@/lib/types/banner";
import { DEFAULT_CHARACTER_LIMITS } from "@/lib/types/banner";

// ==========================================
// Types
// ==========================================

interface UseBannerValidationProps {
  textContent: BannerTextContent;
  bannerSizeId: string;
  primaryColor?: string;
  backgroundColor?: string;
}

interface UseBannerValidationReturn {
  warnings: BannerValidationWarning[];
  errors: BannerValidationWarning[];
  allIssues: BannerValidationWarning[];
  hasWarnings: boolean;
  hasErrors: boolean;
  isValid: boolean;
  characterLimits: CharacterLimits;
  characterCounts: {
    headline: number;
    subheadline: number;
    ctaText: number;
    tagline: number;
  };
  isOverLimit: {
    headline: boolean;
    subheadline: boolean;
    ctaText: boolean;
    tagline: boolean;
  };
  getRemainingCharacters: (field: keyof BannerTextContent) => number;
  getPercentageUsed: (field: keyof BannerTextContent) => number;
}

// ==========================================
// Helper Functions
// ==========================================

/**
 * Get character limits for a specific banner size
 */
function getCharacterLimitsForSize(bannerSizeId: string): CharacterLimits {
  if (!bannerSizeId) {
    // Return hero limits as default (most permissive)
    return DEFAULT_CHARACTER_LIMITS.hero;
  }

  const sizeTemplate = getBannerSizeById(bannerSizeId);
  if (!sizeTemplate) {
    return DEFAULT_CHARACTER_LIMITS.hero;
  }

  return DEFAULT_CHARACTER_LIMITS[sizeTemplate.category] || DEFAULT_CHARACTER_LIMITS.hero;
}

/**
 * Create a validation warning
 */
function createWarning(
  type: BannerWarningType,
  message: string,
  field: keyof BannerTextContent | undefined,
  severity: "warning" | "error" = "warning"
): BannerValidationWarning {
  const warning: BannerValidationWarning = { type, message, severity };
  if (field !== undefined) {
    warning.field = field;
  }
  return warning;
}

/**
 * Calculate relative luminance for contrast checking
 * Based on WCAG 2.1 guidelines
 */
function getLuminance(hexColor: string): number {
  // Remove # if present
  const hex = hexColor.replace("#", "");

  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Apply gamma correction
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calculate luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  try {
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    // If color parsing fails, return a passing ratio
    return 5;
  }
}

/**
 * Check if a hex color is valid
 */
function isValidHexColor(color: string): boolean {
  if (!color) return false;
  const hex = color.replace("#", "");
  return /^[0-9A-Fa-f]{6}$/.test(hex);
}

// ==========================================
// Hook Implementation
// ==========================================

export function useBannerValidation({
  textContent,
  bannerSizeId,
  primaryColor,
  backgroundColor,
}: UseBannerValidationProps): UseBannerValidationReturn {
  // ==========================================
  // Character Limits
  // ==========================================

  const characterLimits = useMemo(() => {
    return getCharacterLimitsForSize(bannerSizeId);
  }, [bannerSizeId]);

  // ==========================================
  // Character Counts
  // ==========================================

  const characterCounts = useMemo(
    () => ({
      headline: textContent.headline.length,
      subheadline: textContent.subheadline.length,
      ctaText: textContent.ctaText.length,
      tagline: textContent.tagline.length,
    }),
    [textContent]
  );

  // ==========================================
  // Is Over Limit
  // ==========================================

  const isOverLimit = useMemo(
    () => ({
      headline:
        characterLimits.headline > 0 && characterCounts.headline > characterLimits.headline,
      subheadline:
        characterLimits.subheadline > 0 &&
        characterCounts.subheadline > characterLimits.subheadline,
      ctaText: characterLimits.ctaText > 0 && characterCounts.ctaText > characterLimits.ctaText,
      tagline: characterLimits.tagline > 0 && characterCounts.tagline > characterLimits.tagline,
    }),
    [characterCounts, characterLimits]
  );

  // ==========================================
  // Validation Warnings
  // ==========================================

  const allIssues = useMemo(() => {
    const issues: BannerValidationWarning[] = [];

    // Check headline length
    if (isOverLimit.headline) {
      issues.push(
        createWarning(
          "headline-too-long",
          `Headline exceeds ${characterLimits.headline} character limit for this banner size (${characterCounts.headline}/${characterLimits.headline})`,
          "headline",
          "warning"
        )
      );
    }

    // Check subheadline length
    if (isOverLimit.subheadline) {
      issues.push(
        createWarning(
          "subheadline-too-long",
          `Subheadline exceeds ${characterLimits.subheadline} character limit (${characterCounts.subheadline}/${characterLimits.subheadline})`,
          "subheadline",
          "warning"
        )
      );
    }

    // Check CTA text length
    if (isOverLimit.ctaText) {
      issues.push(
        createWarning(
          "cta-too-long",
          `CTA button text exceeds ${characterLimits.ctaText} character limit (${characterCounts.ctaText}/${characterLimits.ctaText})`,
          "ctaText",
          "warning"
        )
      );
    }

    // Check tagline length
    if (isOverLimit.tagline) {
      issues.push(
        createWarning(
          "tagline-too-long",
          `Tagline exceeds ${characterLimits.tagline} character limit (${characterCounts.tagline}/${characterLimits.tagline})`,
          "tagline",
          "warning"
        )
      );
    }

    // Check for missing headline (soft warning)
    if (!textContent.headline.trim() && (textContent.ctaText || textContent.subheadline)) {
      issues.push(
        createWarning(
          "missing-headline",
          "Consider adding a headline for better banner effectiveness",
          "headline",
          "warning"
        )
      );
    }

    // Check for missing CTA (soft warning if there's content)
    if (
      !textContent.ctaText.trim() &&
      textContent.headline &&
      bannerSizeId &&
      !bannerSizeId.includes("cover") // Cover images typically don't need CTAs
    ) {
      issues.push(
        createWarning(
          "missing-cta",
          "Consider adding a call-to-action button for better conversion",
          "ctaText",
          "warning"
        )
      );
    }

    // Check color contrast if both colors are provided
    if (primaryColor && backgroundColor) {
      if (isValidHexColor(primaryColor) && isValidHexColor(backgroundColor)) {
        const contrastRatio = getContrastRatio(primaryColor, backgroundColor);
        // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
        // We use 3:1 as banner text is typically large
        if (contrastRatio < 3) {
          issues.push(
            createWarning(
              "low-contrast",
              `Low contrast between text color and background (${contrastRatio.toFixed(1)}:1). Minimum recommended is 3:1`,
              undefined,
              "warning"
            )
          );
        }
      }
    }

    return issues;
  }, [
    textContent,
    bannerSizeId,
    characterLimits,
    characterCounts,
    isOverLimit,
    primaryColor,
    backgroundColor,
  ]);

  // ==========================================
  // Separate Warnings and Errors
  // ==========================================

  const warnings = useMemo(() => {
    return allIssues.filter((issue) => issue.severity === "warning");
  }, [allIssues]);

  const errors = useMemo(() => {
    return allIssues.filter((issue) => issue.severity === "error");
  }, [allIssues]);

  // ==========================================
  // Status Flags
  // ==========================================

  const hasWarnings = warnings.length > 0;
  const hasErrors = errors.length > 0;
  const isValid = !hasErrors;

  // ==========================================
  // Helper Functions
  // ==========================================

  const getRemainingCharacters = useMemo(() => {
    return (field: keyof BannerTextContent): number => {
      const limit = characterLimits[field];
      const count = characterCounts[field];
      return limit > 0 ? limit - count : Infinity;
    };
  }, [characterLimits, characterCounts]);

  const getPercentageUsed = useMemo(() => {
    return (field: keyof BannerTextContent): number => {
      const limit = characterLimits[field];
      const count = characterCounts[field];
      if (limit === 0) return 0;
      return Math.min(100, (count / limit) * 100);
    };
  }, [characterLimits, characterCounts]);

  // ==========================================
  // Return
  // ==========================================

  return {
    warnings,
    errors,
    allIssues,
    hasWarnings,
    hasErrors,
    isValid,
    characterLimits,
    characterCounts,
    isOverLimit,
    getRemainingCharacters,
    getPercentageUsed,
  };
}
