"use client";

import { useState, useMemo, useCallback } from "react";
import { Equal, ArrowLeftRight, Minus, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import type { BannerPreset, BannerPresetConfig } from "@/lib/types/banner";

interface ComparePresetsModalProps {
  presets: BannerPreset[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoad: (preset: BannerPreset) => void;
  initialPreset1Id?: string;
  initialPreset2Id?: string;
}

// All fields to compare organized by section
const COMPARISON_FIELDS = [
  { section: "basicConfig", fields: ["bannerType", "bannerSize", "industry"] },
  { section: "visualStyle", fields: ["designStyle", "colorScheme", "mood", "seasonal"] },
  { section: "visualElements", fields: ["backgroundStyle", "visualEffects", "iconGraphics", "promotionalElements"] },
  { section: "layoutTypography", fields: ["layoutStyle", "textLanguage", "textPlacement", "typographyStyle", "headlineTypography", "bodyTypography", "ctaTypography", "ctaButtonStyle"] },
  { section: "textContent", fields: ["headline", "subheadline", "ctaText", "tagline"] },
  { section: "customPrompt", fields: ["customPrompt"] },
];

// Typography categories that share translations
const TYPOGRAPHY_CATEGORIES = ["headlineTypography", "bodyTypography", "ctaTypography"];

export function ComparePresetsModal({
  presets,
  open,
  onOpenChange,
  onLoad,
  initialPreset1Id,
  initialPreset2Id,
}: ComparePresetsModalProps) {
  const t = useTranslations("bannerGenerator.presets");
  const tLabels = useTranslations("bannerGenerator.builder");
  const tTemplates = useTranslations("bannerTemplates");
  const tCommon = useTranslations("common");

  const [preset1Id, setPreset1Id] = useState<string>(initialPreset1Id || "");
  const [preset2Id, setPreset2Id] = useState<string>(initialPreset2Id || "");

  const preset1 = useMemo(() => presets.find((p) => p.id === preset1Id), [presets, preset1Id]);
  const preset2 = useMemo(() => presets.find((p) => p.id === preset2Id), [presets, preset2Id]);

  // Get value from preset config
  const getValue = useCallback((config: BannerPresetConfig | undefined, field: string, section: string): string | undefined => {
    if (!config) return undefined;

    if (section === "textContent" && config.textContent) {
      return config.textContent[field as keyof typeof config.textContent];
    }
    if (section === "customPrompt") {
      return config.customPrompt;
    }
    return config[field as keyof BannerPresetConfig] as string | undefined;
  }, []);

  // Get translated value
  const getTranslatedValue = useCallback((field: string, value: string | undefined, section: string): string => {
    if (!value) return "-";

    if (section === "textContent" || section === "customPrompt") {
      return value.length > 25 ? `${value.substring(0, 25)}...` : value;
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
  }, [tTemplates]);

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
  const handleLoad = useCallback((preset: BannerPreset) => {
    onLoad(preset);
    onOpenChange(false);
  }, [onLoad, onOpenChange]);

  // Reset on open change
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
    visualElements: t("sectionVisualElements"),
    layoutTypography: t("sectionLayoutTypography"),
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
                            {getFieldLabel(field)}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "text-sm",
                              status === "only1" && "text-blue-600 dark:text-blue-400",
                              status === "different" && "text-yellow-600 dark:text-yellow-400",
                              !val1 && "text-muted-foreground"
                            )}
                          >
                            {translated1}
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
                            {translated2}
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
