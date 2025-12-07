"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { BannerPresetConfig, BannerSection } from "@/lib/types/banner";

interface PresetSectionSummaryProps {
  section: BannerSection | "textContent" | "customPrompt";
  config: BannerPresetConfig;
  compact?: boolean;
  showEmpty?: boolean;
}

// Fields in each section for iteration
const SECTION_FIELD_MAP: Record<BannerSection | "textContent" | "customPrompt", string[]> = {
  basicConfig: ["bannerType", "bannerSize", "industry"],
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

// Typography categories that share the same templates as typographyStyle
const TYPOGRAPHY_CATEGORIES = ["headlineTypography", "bodyTypography", "ctaTypography"];

export function PresetSectionSummary({
  section,
  config,
  compact = false,
  showEmpty = false,
}: PresetSectionSummaryProps) {
  const tTemplates = useTranslations("bannerTemplates");
  const tPresets = useTranslations("bannerGenerator.presets");

  // Get translated name for a template value
  const getTranslatedValue = (category: string, value: string | undefined): string | null => {
    if (!value) return null;

    // Handle text content fields
    if (section === "textContent") {
      return value; // Return raw text for text content
    }

    // Handle custom prompt
    if (section === "customPrompt") {
      return value.length > 50 ? `${value.substring(0, 50)}...` : value;
    }

    // For typography categories, use typographyStyle translations
    const translationCategory = TYPOGRAPHY_CATEGORIES.includes(category) ? "typographyStyle" : category;

    try {
      const translatedName = tTemplates(`${translationCategory}.${value}.name`);
      // Check if translation exists (next-intl returns the key if not found)
      if (translatedName !== `${translationCategory}.${value}.name`) {
        return translatedName;
      }
    } catch {
      // Translation not found
    }

    // Return cleaned up value
    return value.replace(/^(banner-type-|style-|scheme-|mood-|seasonal-|bg-|effect-|icon-|promo-|layout-|lang-|placement-|typography-|cta-style-)/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Get field values for the section
  const getFieldValues = (): Array<{ field: string; value: string }> => {
    const fields = SECTION_FIELD_MAP[section];
    const values: Array<{ field: string; value: string }> = [];

    for (const field of fields) {
      let rawValue: string | undefined;

      if (section === "textContent" && config.textContent) {
        rawValue = config.textContent[field as keyof typeof config.textContent];
      } else if (section === "customPrompt") {
        rawValue = config.customPrompt;
      } else {
        rawValue = config[field as keyof BannerPresetConfig] as string | undefined;
      }

      const translatedValue = getTranslatedValue(field, rawValue);
      if (translatedValue) {
        values.push({ field, value: translatedValue });
      } else if (showEmpty) {
        values.push({ field, value: "-" });
      }
    }

    return values;
  };

  const fieldValues = getFieldValues();

  if (fieldValues.length === 0) {
    return showEmpty ? (
      <span className="text-xs text-muted-foreground italic">{tPresets("noConfiguration")}</span>
    ) : null;
  }

  if (compact) {
    // Compact mode: single line with values separated by |
    return (
      <span className="text-xs text-muted-foreground truncate">
        {fieldValues.map((fv) => fv.value).join(" | ")}
      </span>
    );
  }

  // Normal mode: badges for each value
  return (
    <div className="flex flex-wrap gap-1">
      {fieldValues.map(({ field, value }) => (
        <Badge key={field} variant="secondary" className="text-xs font-normal">
          {value}
        </Badge>
      ))}
    </div>
  );
}

// Helper function to get count of configured fields in a section
export function getConfiguredFieldsCount(
  section: BannerSection | "textContent" | "customPrompt",
  config: BannerPresetConfig
): number {
  const fields = SECTION_FIELD_MAP[section];
  let count = 0;

  for (const field of fields) {
    let hasValue = false;

    if (section === "textContent" && config.textContent) {
      hasValue = !!config.textContent[field as keyof typeof config.textContent];
    } else if (section === "customPrompt") {
      hasValue = !!config.customPrompt;
    } else {
      hasValue = !!config[field as keyof BannerPresetConfig];
    }

    if (hasValue) count++;
  }

  return count;
}

// Helper to get total configured fields across all sections
export function getTotalConfiguredFields(config: BannerPresetConfig): number {
  let total = 0;
  const sections: Array<BannerSection | "textContent" | "customPrompt"> = [
    "basicConfig",
    "visualStyle",
    "visualElements",
    "layoutTypography",
    "textContent",
    "customPrompt",
  ];

  for (const section of sections) {
    total += getConfiguredFieldsCount(section, config);
  }

  return total;
}

// Export section field map for use in other components
export { SECTION_FIELD_MAP };
