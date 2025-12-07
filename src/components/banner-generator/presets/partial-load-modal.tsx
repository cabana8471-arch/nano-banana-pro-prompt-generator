"use client";

import { useState, useMemo, useCallback } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { BannerPreset, BannerPresetConfig, BannerSection } from "@/lib/types/banner";

interface PartialLoadModalProps {
  preset: BannerPreset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (selectedFields: Partial<BannerPresetConfig>) => void;
}

// Section definitions
const SECTIONS: Array<{
  key: BannerSection | "textContent" | "customPrompt";
  fields: string[];
}> = [
  { key: "basicConfig", fields: ["bannerType", "bannerSize", "industry"] },
  { key: "visualStyle", fields: ["designStyle", "colorScheme", "mood", "seasonal"] },
  { key: "visualElements", fields: ["backgroundStyle", "visualEffects", "iconGraphics", "promotionalElements"] },
  { key: "layoutTypography", fields: ["layoutStyle", "textLanguage", "textPlacement", "typographyStyle", "headlineTypography", "bodyTypography", "ctaTypography", "ctaButtonStyle"] },
  { key: "textContent", fields: ["headline", "subheadline", "ctaText", "tagline"] },
  { key: "customPrompt", fields: ["customPrompt"] },
];

// Typography categories that share the same templates
const TYPOGRAPHY_CATEGORIES = ["headlineTypography", "bodyTypography", "ctaTypography"];

export function PartialLoadModal({
  preset,
  open,
  onOpenChange,
  onApply,
}: PartialLoadModalProps) {
  const t = useTranslations("bannerGenerator.presets");
  const tLabels = useTranslations("bannerGenerator.builder");
  const tTemplates = useTranslations("bannerTemplates");
  const tCommon = useTranslations("common");

  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["basicConfig", "visualStyle"]));

  // Get value from preset config
  const getFieldValue = useCallback((field: string, sectionKey: string): string | undefined => {
    if (!preset) return undefined;

    if (sectionKey === "textContent" && preset.config.textContent) {
      return preset.config.textContent[field as keyof typeof preset.config.textContent];
    }
    if (sectionKey === "customPrompt") {
      return preset.config.customPrompt;
    }
    return preset.config[field as keyof BannerPresetConfig] as string | undefined;
  }, [preset]);

  // Get translated value for display
  const getTranslatedValue = useCallback((field: string, value: string | undefined, sectionKey: string): string => {
    if (!value) return t("notSet");

    if (sectionKey === "textContent" || sectionKey === "customPrompt") {
      return value.length > 30 ? `"${value.substring(0, 30)}..."` : `"${value}"`;
    }

    const translationCategory = TYPOGRAPHY_CATEGORIES.includes(field) ? "typographyStyle" : field;
    try {
      const translated = tTemplates(`${translationCategory}.${value}.name`);
      if (translated !== `${translationCategory}.${value}.name`) {
        return translated;
      }
    } catch {
      // Translation not found
    }

    return value
      .replace(/^(banner-type-|style-|scheme-|mood-|seasonal-|bg-|effect-|icon-|promo-|layout-|lang-|placement-|typography-|cta-style-)/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }, [t, tTemplates]);

  // Get field label
  const getFieldLabel = useCallback((field: string): string => {
    try {
      const label = tLabels(field as Parameters<typeof tLabels>[0]);
      if (label !== field) return label;
    } catch {
      // Label not found
    }
    return field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim();
  }, [tLabels]);

  // Count available fields (with values) in section
  const getSectionFieldCounts = useMemo(() => {
    const counts: Record<string, { available: number; selected: number }> = {};

    for (const section of SECTIONS) {
      let available = 0;
      let selected = 0;

      for (const field of section.fields) {
        const value = getFieldValue(field, section.key);
        if (value) {
          available++;
          const fieldKey = section.key === "textContent" ? `textContent.${field}` : field;
          if (selectedFields.has(fieldKey)) {
            selected++;
          }
        }
      }

      counts[section.key] = { available, selected };
    }

    return counts;
  }, [getFieldValue, selectedFields]);

  // Toggle field selection
  const toggleField = useCallback((field: string, sectionKey: string) => {
    const fieldKey = sectionKey === "textContent" ? `textContent.${field}` : field;
    setSelectedFields((prev) => {
      const next = new Set(prev);
      if (next.has(fieldKey)) {
        next.delete(fieldKey);
      } else {
        next.add(fieldKey);
      }
      return next;
    });
  }, []);

  // Toggle entire section
  const toggleSection = useCallback((sectionKey: string, fields: string[]) => {
    const availableFields = fields.filter((f) => getFieldValue(f, sectionKey));
    const fieldKeys = availableFields.map((f) => sectionKey === "textContent" ? `textContent.${f}` : f);
    const allSelected = fieldKeys.every((fk) => selectedFields.has(fk));

    setSelectedFields((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        // Deselect all
        fieldKeys.forEach((fk) => next.delete(fk));
      } else {
        // Select all
        fieldKeys.forEach((fk) => next.add(fk));
      }
      return next;
    });
  }, [getFieldValue, selectedFields]);

  // Toggle section expand
  const toggleExpand = useCallback((sectionKey: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) {
        next.delete(sectionKey);
      } else {
        next.add(sectionKey);
      }
      return next;
    });
  }, []);

  // Select all / Deselect all
  const selectAll = useCallback(() => {
    const allFields = new Set<string>();
    for (const section of SECTIONS) {
      for (const field of section.fields) {
        const value = getFieldValue(field, section.key);
        if (value) {
          const fieldKey = section.key === "textContent" ? `textContent.${field}` : field;
          allFields.add(fieldKey);
        }
      }
    }
    setSelectedFields(allFields);
  }, [getFieldValue]);

  const deselectAll = useCallback(() => {
    setSelectedFields(new Set());
  }, []);

  // Build selected config for apply
  const buildSelectedConfig = useCallback((): Partial<BannerPresetConfig> => {
    if (!preset) return {};

    const config: Partial<BannerPresetConfig> = {};
    let textContent: Partial<BannerPreset["config"]["textContent"]> | undefined;

    for (const fieldKey of selectedFields) {
      if (fieldKey.startsWith("textContent.")) {
        const textField = fieldKey.replace("textContent.", "");
        if (!textContent) textContent = {};
        const value = preset.config.textContent?.[textField as keyof typeof preset.config.textContent];
        if (value) {
          (textContent as Record<string, string>)[textField] = value;
        }
      } else if (fieldKey === "customPrompt" && preset.config.customPrompt) {
        config.customPrompt = preset.config.customPrompt;
      } else {
        const value = preset.config[fieldKey as keyof BannerPresetConfig];
        if (value !== undefined) {
          (config as Record<string, unknown>)[fieldKey] = value;
        }
      }
    }

    if (textContent && Object.keys(textContent).length > 0) {
      config.textContent = textContent;
    }

    return config;
  }, [preset, selectedFields]);

  // Handle apply
  const handleApply = useCallback(() => {
    const config = buildSelectedConfig();
    onApply(config);
    onOpenChange(false);
    setSelectedFields(new Set());
  }, [buildSelectedConfig, onApply, onOpenChange]);

  // Reset on open
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (newOpen) {
      setSelectedFields(new Set());
      setExpandedSections(new Set(["basicConfig", "visualStyle"]));
    }
    onOpenChange(newOpen);
  }, [onOpenChange]);

  const totalSelected = selectedFields.size;
  const totalAvailable = Object.values(getSectionFieldCounts).reduce((sum, c) => sum + c.available, 0);

  const sectionLabels: Record<string, string> = {
    basicConfig: t("sectionBasicConfig"),
    visualStyle: t("sectionVisualStyle"),
    visualElements: t("sectionVisualElements"),
    layoutTypography: t("sectionLayoutTypography"),
    textContent: t("sectionTextContent"),
    customPrompt: t("sectionCustomPrompt"),
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("partialLoadTitle")}</DialogTitle>
          <DialogDescription>
            {preset ? t("partialLoadFrom", { name: preset.name }) : t("partialLoadDescription")}
          </DialogDescription>
        </DialogHeader>

        {/* Select/Deselect All */}
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-muted-foreground">
            {t("fieldsSelected", { selected: totalSelected, total: totalAvailable })}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={selectAll}>
              {t("selectAll")}
            </Button>
            <Button variant="ghost" size="sm" onClick={deselectAll}>
              {t("deselectAll")}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Sections List */}
        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-2 py-2">
            {SECTIONS.map((section) => {
              const counts = getSectionFieldCounts[section.key] ?? { available: 0, selected: 0 };
              const isExpanded = expandedSections.has(section.key);
              const availableFields = section.fields.filter((f) => getFieldValue(f, section.key));
              const fieldKeys = availableFields.map((f) =>
                section.key === "textContent" ? `textContent.${f}` : f
              );
              const allSelected = fieldKeys.length > 0 && fieldKeys.every((fk) => selectedFields.has(fk));
              const someSelected = fieldKeys.some((fk) => selectedFields.has(fk));

              if (counts.available === 0) {
                return (
                  <div
                    key={section.key}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 opacity-50"
                  >
                    <Checkbox disabled checked={false} />
                    <div className="flex-1">
                      <span className="text-sm font-medium">{sectionLabels[section.key]}</span>
                      <p className="text-xs text-muted-foreground">{t("noFieldsAvailable")}</p>
                    </div>
                  </div>
                );
              }

              return (
                <Collapsible
                  key={section.key}
                  open={isExpanded}
                  onOpenChange={() => toggleExpand(section.key)}
                >
                  <div className="border rounded-lg">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 p-3">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={() => toggleSection(section.key, section.fields)}
                        className={someSelected && !allSelected ? "data-[state=unchecked]:bg-primary/30" : ""}
                      />
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => toggleExpand(section.key)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{sectionLabels[section.key]}</span>
                          <Badge variant="secondary" className="text-xs">
                            {counts.selected}/{counts.available}
                          </Badge>
                        </div>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>

                    {/* Section Fields */}
                    <CollapsibleContent>
                      <div className="px-3 pb-3 pt-1 border-t bg-muted/20">
                        <div className="space-y-1">
                          {section.fields.map((field) => {
                            const value = getFieldValue(field, section.key);
                            const fieldKey = section.key === "textContent" ? `textContent.${field}` : field;
                            const isSelected = selectedFields.has(fieldKey);
                            const translatedValue = getTranslatedValue(field, value, section.key);

                            return (
                              <div
                                key={field}
                                className={`flex items-center gap-3 p-2 rounded transition-colors ${
                                  value ? "hover:bg-accent/50 cursor-pointer" : "opacity-50"
                                }`}
                                onClick={() => value && toggleField(field, section.key)}
                              >
                                <Checkbox
                                  checked={isSelected && !!value}
                                  disabled={!value}
                                  onCheckedChange={() => toggleField(field, section.key)}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm">{getFieldLabel(field)}</p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {translatedValue}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {tCommon("cancel")}
          </Button>
          <Button onClick={handleApply} disabled={totalSelected === 0}>
            <Check className="h-4 w-4 mr-2" />
            {t("applySelected")} ({totalSelected})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
