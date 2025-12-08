"use client";

import { useMemo } from "react";
import type { LogoTextContent, LogoValidationWarning, LogoBuilderState } from "@/lib/types/logo";
import { DEFAULT_LOGO_CHARACTER_LIMITS } from "@/lib/types/logo";

interface UseLogoValidationReturn {
  warnings: LogoValidationWarning[];
  hasErrors: boolean;
  hasWarnings: boolean;
  isValid: boolean;
  getFieldWarning: (field: keyof LogoTextContent) => LogoValidationWarning | undefined;
  characterLimits: typeof DEFAULT_LOGO_CHARACTER_LIMITS;
  isOverLimit: (field: keyof LogoTextContent, value: string) => boolean;
  getPercentageUsed: (field: keyof LogoTextContent, value: string) => number;
}

export function useLogoValidation(state: LogoBuilderState): UseLogoValidationReturn {
  const warnings = useMemo(() => {
    const result: LogoValidationWarning[] = [];
    const limits = DEFAULT_LOGO_CHARACTER_LIMITS;

    // Check company name length
    if (state.textContent.companyName) {
      if (state.textContent.companyName.length > limits.companyName) {
        result.push({
          type: "company-name-too-long",
          message: `Company name exceeds ${limits.companyName} characters (${state.textContent.companyName.length}/${limits.companyName})`,
          field: "companyName",
          severity: "warning",
        });
      }
    }

    // Check tagline length
    if (state.textContent.tagline) {
      if (state.textContent.tagline.length > limits.tagline) {
        result.push({
          type: "tagline-too-long",
          message: `Tagline exceeds ${limits.tagline} characters (${state.textContent.tagline.length}/${limits.tagline})`,
          field: "tagline",
          severity: "warning",
        });
      }
    }

    // Check abbreviation length
    if (state.textContent.abbreviation) {
      if (state.textContent.abbreviation.length > limits.abbreviation) {
        result.push({
          type: "abbreviation-too-long",
          message: `Abbreviation exceeds ${limits.abbreviation} characters (${state.textContent.abbreviation.length}/${limits.abbreviation})`,
          field: "abbreviation",
          severity: "warning",
        });
      }
    }

    // Check for missing company name when text is expected
    const textRequiredTypes = [
      "logo-type-wordmark",
      "logo-type-lettermark",
      "logo-type-combination",
      "logo-type-emblem",
    ];
    if (
      textRequiredTypes.includes(state.logoType) &&
      !state.textContent.companyName &&
      !state.textContent.abbreviation
    ) {
      result.push({
        type: "missing-company-name",
        message: "Company name or abbreviation is recommended for this logo type",
        severity: "warning",
      });
    }

    // Check for too many colors
    const colorCount = [state.primaryColor, state.secondaryColor, state.accentColor].filter(
      Boolean
    ).length;
    if (colorCount > 3) {
      result.push({
        type: "too-many-colors",
        message: "Using more than 3 colors may make the logo less versatile",
        severity: "warning",
      });
    }

    // Check for low contrast colors (basic check - same colors)
    if (
      state.primaryColor &&
      state.secondaryColor &&
      state.primaryColor.toLowerCase() === state.secondaryColor.toLowerCase()
    ) {
      result.push({
        type: "low-contrast-colors",
        message: "Primary and secondary colors are the same - consider adding contrast",
        severity: "warning",
      });
    }

    return result;
  }, [state]);

  const hasErrors = useMemo(() => {
    return warnings.some((w) => w.severity === "error");
  }, [warnings]);

  const hasWarnings = useMemo(() => {
    return warnings.some((w) => w.severity === "warning");
  }, [warnings]);

  const isValid = useMemo(() => {
    return !hasErrors;
  }, [hasErrors]);

  const getFieldWarning = (field: keyof LogoTextContent): LogoValidationWarning | undefined => {
    return warnings.find((w) => w.field === field);
  };

  const characterLimits = DEFAULT_LOGO_CHARACTER_LIMITS;

  const isOverLimit = (field: keyof LogoTextContent, value: string): boolean => {
    const limit = characterLimits[field];
    return value.length > limit;
  };

  const getPercentageUsed = (field: keyof LogoTextContent, value: string): number => {
    const limit = characterLimits[field];
    return Math.min(100, Math.round((value.length / limit) * 100));
  };

  return {
    warnings,
    hasErrors,
    hasWarnings,
    isValid,
    getFieldWarning,
    characterLimits,
    isOverLimit,
    getPercentageUsed,
  };
}
