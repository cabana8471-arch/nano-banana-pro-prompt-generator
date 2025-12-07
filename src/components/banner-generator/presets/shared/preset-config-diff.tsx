"use client";

import { Plus, Minus, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { BannerPresetConfig, BannerSection } from "@/lib/types/banner";
import { SECTION_FIELD_MAP } from "./preset-section-summary";

// Typography categories that share the same templates
const TYPOGRAPHY_CATEGORIES = ["headlineTypography", "bodyTypography", "ctaTypography"];

interface PresetConfigDiffProps {
  original: BannerPresetConfig;
  modified: BannerPresetConfig;
  showOnlyChanges?: boolean;
  compact?: boolean;
}

interface FieldChange {
  field: string;
  category: string;
  type: "added" | "removed" | "modified";
  oldValue?: string | undefined;
  newValue?: string | undefined;
}

export function PresetConfigDiff({
  original,
  modified,
  showOnlyChanges: _showOnlyChanges = true,
  compact = false,
}: PresetConfigDiffProps) {
  const tTemplates = useTranslations("bannerTemplates");
  const tPresets = useTranslations("bannerGenerator.presets");
  const tLabels = useTranslations("bannerGenerator.builder");

  // Get translated name for a template value
  const getTranslatedValue = (category: string, value: string | undefined): string => {
    if (!value) return "";

    // For typography categories, use typographyStyle translations
    const translationCategory = TYPOGRAPHY_CATEGORIES.includes(category) ? "typographyStyle" : category;

    try {
      const translatedName = tTemplates(`${translationCategory}.${value}.name`);
      if (translatedName !== `${translationCategory}.${value}.name`) {
        return translatedName;
      }
    } catch {
      // Translation not found
    }

    // Return cleaned up value
    return value
      .replace(/^(banner-type-|style-|scheme-|mood-|seasonal-|bg-|effect-|icon-|promo-|layout-|lang-|placement-|typography-|cta-style-)/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Get field label
  const getFieldLabel = (field: string): string => {
    try {
      // Try to get from builder labels
      const label = tLabels(field as Parameters<typeof tLabels>[0]);
      if (label !== field) {
        return label;
      }
    } catch {
      // Label not found
    }

    // Fallback: convert camelCase to Title Case
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
  };

  // Get value from config
  const getValue = (config: BannerPresetConfig, field: string, section: string): string | undefined => {
    if (section === "textContent" && config.textContent) {
      return config.textContent[field as keyof typeof config.textContent];
    }
    if (section === "customPrompt") {
      return config.customPrompt;
    }
    return config[field as keyof BannerPresetConfig] as string | undefined;
  };

  // Calculate all changes
  const calculateChanges = (): FieldChange[] => {
    const changes: FieldChange[] = [];
    const sections: Array<BannerSection | "textContent" | "customPrompt"> = [
      "basicConfig",
      "visualStyle",
      "visualElements",
      "layoutTypography",
      "textContent",
      "customPrompt",
    ];

    for (const section of sections) {
      const fields = SECTION_FIELD_MAP[section];

      for (const field of fields) {
        const oldVal = getValue(original, field, section);
        const newVal = getValue(modified, field, section);

        if (oldVal !== newVal) {
          if (!oldVal && newVal) {
            changes.push({
              field,
              category: section === "textContent" || section === "customPrompt" ? section : field,
              type: "added",
              newValue: newVal,
            });
          } else if (oldVal && !newVal) {
            changes.push({
              field,
              category: section === "textContent" || section === "customPrompt" ? section : field,
              type: "removed",
              oldValue: oldVal,
            });
          } else {
            changes.push({
              field,
              category: section === "textContent" || section === "customPrompt" ? section : field,
              type: "modified",
              oldValue: oldVal,
              newValue: newVal,
            });
          }
        }
      }
    }

    return changes;
  };

  const changes = calculateChanges();

  if (changes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">{tPresets("noChanges")}</p>
    );
  }

  if (compact) {
    // Compact mode: single line summary
    const added = changes.filter((c) => c.type === "added").length;
    const removed = changes.filter((c) => c.type === "removed").length;
    const modified = changes.filter((c) => c.type === "modified").length;

    const parts: string[] = [];
    if (added > 0) parts.push(`+${added}`);
    if (modified > 0) parts.push(`~${modified}`);
    if (removed > 0) parts.push(`-${removed}`);

    return (
      <span className="text-xs text-muted-foreground">
        {tPresets("changesCount", { count: changes.length })} ({parts.join(", ")})
      </span>
    );
  }

  return (
    <div className="space-y-1.5">
      {changes.map((change, index) => (
        <div
          key={`${change.field}-${index}`}
          className={cn(
            "flex items-start gap-2 text-sm px-2 py-1 rounded",
            change.type === "added" && "bg-green-500/10 text-green-700 dark:text-green-400",
            change.type === "removed" && "bg-red-500/10 text-red-700 dark:text-red-400",
            change.type === "modified" && "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
          )}
        >
          {change.type === "added" && <Plus className="h-4 w-4 shrink-0 mt-0.5" />}
          {change.type === "removed" && <Minus className="h-4 w-4 shrink-0 mt-0.5" />}
          {change.type === "modified" && <RefreshCw className="h-4 w-4 shrink-0 mt-0.5" />}

          <div className="flex-1 min-w-0">
            <span className="font-medium">{getFieldLabel(change.field)}: </span>
            {change.type === "added" && (
              <span>{getTranslatedValue(change.category, change.newValue)}</span>
            )}
            {change.type === "removed" && (
              <span className="line-through">
                {getTranslatedValue(change.category, change.oldValue)}
              </span>
            )}
            {change.type === "modified" && (
              <span>
                <span className="line-through opacity-60">
                  {getTranslatedValue(change.category, change.oldValue)}
                </span>
                {" → "}
                {getTranslatedValue(change.category, change.newValue)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper function to compare two configs and return changes summary
export function compareConfigs(
  original: BannerPresetConfig,
  modified: BannerPresetConfig
): { added: string[]; removed: string[]; modified: string[] } {
  const result = { added: [] as string[], removed: [] as string[], modified: [] as string[] };
  const sections: Array<BannerSection | "textContent" | "customPrompt"> = [
    "basicConfig",
    "visualStyle",
    "visualElements",
    "layoutTypography",
    "textContent",
    "customPrompt",
  ];

  const getValue = (config: BannerPresetConfig, field: string, section: string): string | undefined => {
    if (section === "textContent" && config.textContent) {
      return config.textContent[field as keyof typeof config.textContent];
    }
    if (section === "customPrompt") {
      return config.customPrompt;
    }
    return config[field as keyof BannerPresetConfig] as string | undefined;
  };

  for (const section of sections) {
    const fields = SECTION_FIELD_MAP[section];

    for (const field of fields) {
      const oldVal = getValue(original, field, section);
      const newVal = getValue(modified, field, section);

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
  }

  return result;
}

// Export for use in other components
export type { FieldChange };
