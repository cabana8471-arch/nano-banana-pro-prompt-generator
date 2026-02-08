"use client";

import { useState, useMemo, useCallback } from "react";
import { Equal, ArrowLeftRight, Minus, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LogoPreset, LogoPresetConfig } from "@/lib/types/logo";
import { cn } from "@/lib/utils";

interface CompareLogoPresetsModalProps {
  presets: LogoPreset[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoad: (preset: LogoPreset) => void;
  initialPreset1Id?: string;
  initialPreset2Id?: string;
}

/**
 * Comparison fields organized by section for the logo preset comparison table.
 * Each section groups related logo configuration fields together.
 */
const COMPARISON_FIELDS = [
  { section: "basicConfig", fields: ["logoType", "industry", "logoFormat"] },
  { section: "visualStyle", fields: ["designStyle", "colorSchemeType", "mood"] },
  { section: "iconSymbol", fields: ["iconStyle", "symbolElements"] },
  { section: "typography", fields: ["fontCategory", "typographyTreatment"] },
  { section: "additionalOptions", fields: ["specialEffects", "backgroundStyle"] },
  { section: "brandColors", fields: ["primaryColor", "secondaryColor", "accentColor"] },
  { section: "textContent", fields: ["companyName", "tagline", "abbreviation"] },
  { section: "customPrompt", fields: ["customPrompt"] },
];

export function CompareLogoPresetsModal({
  presets,
  open,
  onOpenChange,
  onLoad,
  initialPreset1Id,
  initialPreset2Id,
}: CompareLogoPresetsModalProps) {
  const t = useTranslations("logoGenerator.presets");
  const tLabels = useTranslations("logoGenerator.categories");
  const tTemplates = useTranslations("logoTemplates");
  const tCommon = useTranslations("common");

  const [preset1Id, setPreset1Id] = useState<string>(initialPreset1Id || "");
  const [preset2Id, setPreset2Id] = useState<string>(initialPreset2Id || "");

  const preset1 = useMemo(() => presets.find((p) => p.id === preset1Id), [presets, preset1Id]);
  const preset2 = useMemo(() => presets.find((p) => p.id === preset2Id), [presets, preset2Id]);

  // Get value from preset config, handling nested textContent and array fields
  const getValue = useCallback((config: LogoPresetConfig | undefined, field: string, section: string): string | undefined => {
    if (!config) return undefined;

    if (section === "textContent" && config.textContent) {
      return config.textContent[field as keyof typeof config.textContent];
    }
    if (section === "customPrompt") {
      return config.customPrompt;
    }
    if (field === "symbolElements") {
      const elements = config.symbolElements;
      return elements && elements.length > 0 ? elements.join(", ") : undefined;
    }
    if (section === "brandColors") {
      return config[field as keyof LogoPresetConfig] as string | undefined;
    }
    return config[field as keyof LogoPresetConfig] as string | undefined;
  }, []);

  // Get translated value for display
  const getTranslatedValue = useCallback((field: string, value: string | undefined, section: string): string => {
    if (!value) return "-";

    // Text content and custom prompt show raw values (potentially truncated)
    if (section === "textContent" || section === "customPrompt") {
      return value.length > 25 ? `${value.substring(0, 25)}...` : value;
    }

    // Brand colors show the hex value directly
    if (section === "brandColors") {
      return value;
    }

    // For symbolElements, show comma-separated translated names
    if (field === "symbolElements") {
      return value.split(", ").map((element) => {
        try {
          const translated = tTemplates(`symbolElements.${element}.name`);
          if (translated !== `symbolElements.${element}.name`) return translated;
        } catch {
          // Translation not found
        }
        return element.replace(/^symbol-/, "").replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      }).join(", ");
    }

    // Try template category translations
    const categoryMap: Record<string, string> = {
      logoType: "logoType",
      industry: "industry",
      logoFormat: "logoFormat",
      designStyle: "designStyle",
      colorSchemeType: "colorSchemeType",
      mood: "mood",
      iconStyle: "iconStyle",
      fontCategory: "fontCategory",
      typographyTreatment: "typographyTreatment",
      specialEffects: "specialEffects",
      backgroundStyle: "backgroundStyle",
    };
    const category = categoryMap[field];
    if (category) {
      try {
        const translated = tTemplates(`${category}.${value}.name`);
        if (translated !== `${category}.${value}.name`) {
          return translated;
        }
      } catch {
        // Translation not found
      }
    }

    // Fallback: clean up the value for display
    return value
      .replace(/^(logo-type-|industry-|format-|style-|color-|mood-|icon-|font-|treatment-|effect-|bg-)/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }, [tTemplates]);

  // Get field label from i18n
  const getFieldLabel = useCallback((field: string, section: string): string => {
    // Brand color fields use a separate translation key
    if (section === "brandColors") {
      const colorLabels: Record<string, string> = {
        primaryColor: t("comparePrimaryColor"),
        secondaryColor: t("compareSecondaryColor"),
        accentColor: t("compareAccentColor"),
      };
      return colorLabels[field] || field;
    }

    // Text content fields
    if (section === "textContent") {
      const textLabels: Record<string, string> = {
        companyName: t("compareCompanyName"),
        tagline: t("compareTagline"),
        abbreviation: t("compareAbbreviation"),
      };
      return textLabels[field] || field;
    }

    if (section === "customPrompt") {
      return t("sectionCustomPrompt");
    }

    // Try category labels
    try {
      const label = tLabels(field as Parameters<typeof tLabels>[0]);
      if (label !== field) return label;
    } catch {
      // Label not found
    }

    // Fallback: convert camelCase to Title Case
    return field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim();
  }, [tLabels, t]);

  // Calculate comparison stats
  const stats = useMemo(() => {
    if (!preset1 || !preset2) return { identical: 0, different: 0, onlyIn1: 0, onlyIn2: 0 };

    let identical = 0;
    let different = 0;
    let onlyIn1 = 0;
    let onlyIn2 = 0;

    for (const { section, fields } of COMPARISON_FIELDS) {
      for (const field of fields) {
        const val1 = getValue(preset1.config, field, section);
        const val2 = getValue(preset2.config, field, section);

        if (val1 === val2) {
          if (val1) identical++;
        } else if (val1 && val2) {
          different++;
        } else if (val1 && !val2) {
          onlyIn1++;
        } else if (!val1 && val2) {
          onlyIn2++;
        }
      }
    }

    return { identical, different, onlyIn1, onlyIn2 };
  }, [preset1, preset2, getValue]);

  // Handle load
  const handleLoad = useCallback((preset: LogoPreset) => {
    onLoad(preset);
    onOpenChange(false);
  }, [onLoad, onOpenChange]);

  // Reset selections on open change
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (newOpen) {
      setPreset1Id(initialPreset1Id || "");
      setPreset2Id(initialPreset2Id || "");
    }
    onOpenChange(newOpen);
  }, [initialPreset1Id, initialPreset2Id, onOpenChange]);

  const sectionLabels: Record<string, string> = {
    basicConfig: t("sectionBasicConfig"),
    visualStyle: t("sectionVisualStyle"),
    iconSymbol: t("sectionIconSymbol"),
    typography: t("sectionTypography"),
    additionalOptions: t("sectionAdditionalOptions"),
    brandColors: t("sectionBrandColors"),
    textContent: t("sectionTextContent"),
    customPrompt: t("sectionCustomPrompt"),
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("comparePresets")}</DialogTitle>
          <DialogDescription>{t("compareDescription")}</DialogDescription>
        </DialogHeader>

        {/* Preset Selectors */}
        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="space-y-2">
            <Label>{t("selectPreset1")}</Label>
            <Select value={preset1Id} onValueChange={setPreset1Id}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectPresetPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {presets.map((preset) => (
                  <SelectItem
                    key={preset.id}
                    value={preset.id}
                    disabled={preset.id === preset2Id}
                  >
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("selectPreset2")}</Label>
            <Select value={preset2Id} onValueChange={setPreset2Id}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectPresetPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {presets.map((preset) => (
                  <SelectItem
                    key={preset.id}
                    value={preset.id}
                    disabled={preset.id === preset1Id}
                  >
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Summary */}
        {preset1 && preset2 && (
          <div className="flex items-center justify-center gap-4 py-2">
            <Badge variant="secondary" className="gap-1">
              <Equal className="h-3 w-3" />
              {t("identical")}: {stats.identical}
            </Badge>
            <Badge variant="outline" className="gap-1 border-yellow-500 text-yellow-700 dark:text-yellow-400">
              <ArrowLeftRight className="h-3 w-3" />
              {t("different")}: {stats.different}
            </Badge>
            <Badge variant="outline" className="gap-1 border-blue-500 text-blue-700 dark:text-blue-400">
              {t("onlyInPreset1")}: {stats.onlyIn1}
            </Badge>
            <Badge variant="outline" className="gap-1 border-green-500 text-green-700 dark:text-green-400">
              {t("onlyInPreset2")}: {stats.onlyIn2}
            </Badge>
          </div>
        )}

        {/* Comparison Table */}
        <ScrollArea className="max-h-[50vh] border rounded-lg">
          {preset1 && preset2 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">{t("field")}</TableHead>
                  <TableHead>{preset1.name}</TableHead>
                  <TableHead className="w-[50px] text-center">{t("status")}</TableHead>
                  <TableHead>{preset2.name}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPARISON_FIELDS.map(({ section, fields }) => (
                  <>
                    {/* Section Header */}
                    <TableRow key={`section-${section}`} className="bg-muted/50">
                      <TableCell colSpan={4} className="font-medium text-sm">
                        {sectionLabels[section]}
                      </TableCell>
                    </TableRow>
                    {/* Fields */}
                    {fields.map((field) => {
                      const val1 = getValue(preset1.config, field, section);
                      const val2 = getValue(preset2.config, field, section);
                      const translated1 = getTranslatedValue(field, val1, section);
                      const translated2 = getTranslatedValue(field, val2, section);

                      let status: "identical" | "different" | "only1" | "only2" | "empty" = "empty";
                      if (val1 === val2) {
                        status = val1 ? "identical" : "empty";
                      } else if (val1 && val2) {
                        status = "different";
                      } else if (val1) {
                        status = "only1";
                      } else if (val2) {
                        status = "only2";
                      }

                      return (
                        <TableRow key={`${section}-${field}`}>
                          <TableCell className="text-sm font-medium">
                            {getFieldLabel(field, section)}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "text-sm",
                              status === "only1" && "text-blue-600 dark:text-blue-400",
                              status === "different" && "text-yellow-600 dark:text-yellow-400",
                              !val1 && "text-muted-foreground"
                            )}
                          >
                            {section === "brandColors" && val1 ? (
                              <span className="flex items-center gap-2">
                                <span
                                  className="inline-block w-4 h-4 rounded border"
                                  style={{ backgroundColor: val1 }}
                                />
                                {translated1}
                              </span>
                            ) : (
                              translated1
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {status === "identical" && (
                              <Equal className="h-4 w-4 mx-auto text-muted-foreground" />
                            )}
                            {status === "different" && (
                              <ArrowLeftRight className="h-4 w-4 mx-auto text-yellow-600" />
                            )}
                            {status === "only1" && (
                              <Minus className="h-4 w-4 mx-auto text-blue-600 rotate-90" />
                            )}
                            {status === "only2" && (
                              <Minus className="h-4 w-4 mx-auto text-green-600 -rotate-90" />
                            )}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "text-sm",
                              status === "only2" && "text-green-600 dark:text-green-400",
                              status === "different" && "text-yellow-600 dark:text-yellow-400",
                              !val2 && "text-muted-foreground"
                            )}
                          >
                            {section === "brandColors" && val2 ? (
                              <span className="flex items-center gap-2">
                                <span
                                  className="inline-block w-4 h-4 rounded border"
                                  style={{ backgroundColor: val2 }}
                                />
                                {translated2}
                              </span>
                            ) : (
                              translated2
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              {t("selectBothPresets")}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {tCommon("close")}
          </Button>
          {preset1 && (
            <Button variant="outline" onClick={() => handleLoad(preset1)}>
              <Download className="h-4 w-4 mr-2" />
              {t("loadPreset")} 1
            </Button>
          )}
          {preset2 && (
            <Button variant="outline" onClick={() => handleLoad(preset2)}>
              <Download className="h-4 w-4 mr-2" />
              {t("loadPreset")} 2
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
