"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Typography categories that share the same templates
const TYPOGRAPHY_CATEGORIES = ["headlineTypography", "bodyTypography", "ctaTypography"];

interface PresetFieldCheckboxProps {
  field: string;
  category: string;
  value: string | undefined;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function PresetFieldCheckbox({
  field,
  category,
  value,
  checked,
  onCheckedChange,
  disabled = false,
}: PresetFieldCheckboxProps) {
  const tTemplates = useTranslations("bannerTemplates");
  const tLabels = useTranslations("bannerGenerator.builder");
  const tPresets = useTranslations("bannerGenerator.presets");

  // Get field label
  const getFieldLabel = (): string => {
    try {
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

  // Get translated value
  const getTranslatedValue = (): string => {
    if (!value) return tPresets("notSet");

    // Handle text content and custom prompt differently
    if (category === "textContent" || category === "customPrompt") {
      return value.length > 40 ? `"${value.substring(0, 40)}..."` : `"${value}"`;
    }

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

  const hasValue = !!value;
  const fieldLabel = getFieldLabel();
  const translatedValue = getTranslatedValue();

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-2 rounded-md transition-colors",
        hasValue ? "hover:bg-accent/50" : "opacity-50",
        disabled && "pointer-events-none"
      )}
    >
      <Checkbox
        id={`field-${field}`}
        checked={checked && hasValue}
        onCheckedChange={(checked) => onCheckedChange(checked === true)}
        disabled={disabled || !hasValue}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <Label
          htmlFor={`field-${field}`}
          className={cn(
            "text-sm font-medium cursor-pointer",
            !hasValue && "text-muted-foreground"
          )}
        >
          {fieldLabel}
        </Label>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {translatedValue}
        </p>
      </div>
    </div>
  );
}

// Section checkbox component for selecting entire sections
interface PresetSectionCheckboxProps {
  sectionKey: string;
  sectionLabel: string;
  fieldsCount: number;
  selectedCount: number;
  indeterminate?: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export function PresetSectionCheckbox({
  sectionKey,
  sectionLabel,
  fieldsCount,
  selectedCount,
  indeterminate: _indeterminate = false,
  onCheckedChange,
  disabled = false,
  expanded = false,
  onToggleExpand,
}: PresetSectionCheckboxProps) {
  const tPresets = useTranslations("bannerGenerator.presets");

  const allSelected = selectedCount === fieldsCount && fieldsCount > 0;
  const someSelected = selectedCount > 0 && selectedCount < fieldsCount;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-2 rounded-md transition-colors",
        fieldsCount > 0 ? "hover:bg-accent/50" : "opacity-50",
        disabled && "pointer-events-none"
      )}
    >
      <Checkbox
        id={`section-${sectionKey}`}
        checked={allSelected}
        onCheckedChange={(checked) => onCheckedChange(checked === true)}
        disabled={disabled || fieldsCount === 0}
        className={cn(someSelected && "data-[state=unchecked]:bg-primary/30")}
        aria-checked={someSelected ? "mixed" : allSelected}
      />
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={onToggleExpand}
      >
        <Label
          htmlFor={`section-${sectionKey}`}
          className={cn(
            "text-sm font-medium cursor-pointer",
            fieldsCount === 0 && "text-muted-foreground"
          )}
        >
          {sectionLabel}
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5">
          {selectedCount > 0
            ? tPresets("fieldsSelected", { selected: selectedCount, total: fieldsCount })
            : tPresets("fieldsAvailable", { count: fieldsCount })}
        </p>
      </div>
      {onToggleExpand && fieldsCount > 0 && (
        <button
          type="button"
          onClick={onToggleExpand}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? tPresets("collapse") : tPresets("expand")}
        </button>
      )}
    </div>
  );
}
