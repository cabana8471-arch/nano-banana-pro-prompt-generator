"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Copy, RotateCcw, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BannerTemplateSelector } from "../banner-builder/banner-template-selector";
import {
  bannerTypeTemplates,
  bannerSizeTemplates,
  industryTemplates,
  designStyleTemplates,
  colorSchemeTemplates,
  moodTemplates,
  seasonalTemplates,
  backgroundStyleTemplates,
  visualEffectsTemplates,
  iconGraphicsTemplates,
  promotionalTemplates,
  layoutStyleTemplates,
  textLanguageTemplates,
  textPlacementTemplates,
  typographyStyleTemplates,
  ctaButtonStyleTemplates,
} from "@/lib/data/banner-templates";
import type { BannerPreset, UpdateBannerPresetInput } from "@/lib/types/banner";
import { usePresetEditor } from "@/hooks/use-preset-editor";
import { PresetConfigDiff } from "./shared/preset-config-diff";

interface EditBannerPresetSheetProps {
  preset: BannerPreset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, input: UpdateBannerPresetInput) => Promise<boolean>;
  onDuplicate: (id: string, newName?: string) => Promise<boolean>;
}

export function EditBannerPresetSheet({
  preset,
  open,
  onOpenChange,
  onSave,
  onDuplicate,
}: EditBannerPresetSheetProps) {
  const t = useTranslations("bannerGenerator");
  const tPresets = useTranslations("bannerGenerator.presets");
  const tCommon = useTranslations("common");

  const {
    editedConfig,
    editedName,
    isDirty,
    changes,
    startEditing,
    updateField,
    updateTextContent,
    updateName,
    resetChanges,
    cancelEditing,
  } = usePresetEditor();

  const [isSaving, setIsSaving] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "basicConfig",
    "visualStyle",
  ]);

  // Start editing when preset changes
  useEffect(() => {
    if (preset && open) {
      startEditing(preset);
      setExpandedSections(["basicConfig", "visualStyle"]);
    }
  }, [preset, open, startEditing]);

  const handleClose = () => {
    if (isDirty) {
      setShowDiscardDialog(true);
    } else {
      cancelEditing();
      onOpenChange(false);
    }
  };

  const handleDiscardAndClose = () => {
    setShowDiscardDialog(false);
    cancelEditing();
    onOpenChange(false);
  };

  const handleSave = async () => {
    if (!preset || isSaving) return;

    setIsSaving(true);
    try {
      const success = await onSave(preset.id, {
        name: editedName,
        config: editedConfig,
      });
      if (success) {
        onOpenChange(false);
        cancelEditing();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = async () => {
    if (!preset || isDuplicating) return;

    setIsDuplicating(true);
    try {
      await onDuplicate(preset.id);
    } finally {
      setIsDuplicating(false);
    }
  };

  const totalChanges = changes.added.length + changes.modified.length + changes.removed.length;
  const isCustomSize = editedConfig.bannerSize === "size-custom";

  return (
    <>
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>{tPresets("editPreset")}</SheetTitle>
            <SheetDescription>
              {tPresets("editPresetDescription")}
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="px-6 py-4 space-y-6">
              {/* Preset Name */}
              <div className="space-y-2">
                <Label htmlFor="preset-name">{tPresets("presetName")}</Label>
                <Input
                  id="preset-name"
                  value={editedName}
                  onChange={(e) => updateName(e.target.value)}
                  placeholder={tPresets("presetPlaceholder")}
                />
              </div>

              {/* Changes Summary */}
              {isDirty && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                      {tPresets("unsavedChanges")}
                    </span>
                    <Badge variant="outline" className="ml-auto">
                      {tPresets("changesCount", { count: totalChanges })}
                    </Badge>
                  </div>
                  {preset && (
                    <PresetConfigDiff
                      original={preset.config}
                      modified={editedConfig}
                      compact={false}
                    />
                  )}
                </div>
              )}

              <Separator />

              {/* Accordion Sections */}
              <Accordion
                type="multiple"
                value={expandedSections}
                onValueChange={setExpandedSections}
                className="space-y-2"
              >
                {/* Section A: Basic Configuration */}
                <AccordionItem value="basicConfig" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t("sections.basicConfig")}</span>
                      {(editedConfig.bannerType || editedConfig.bannerSize || editedConfig.industry) && (
                        <Badge variant="secondary" className="text-xs">
                          {[editedConfig.bannerType, editedConfig.bannerSize, editedConfig.industry].filter(Boolean).length}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <BannerTemplateSelector
                      label={t("categories.bannerType")}
                      templates={bannerTypeTemplates}
                      value={editedConfig.bannerType || ""}
                      onChange={(v) => updateField("bannerType", v)}
                      placeholder={t("placeholders.bannerType")}
                      category="bannerType"
                    />
                    <BannerTemplateSelector
                      label={t("categories.bannerSize")}
                      templates={bannerSizeTemplates}
                      value={editedConfig.bannerSize || ""}
                      onChange={(v) => updateField("bannerSize", v)}
                      placeholder={t("placeholders.bannerSize")}
                      category="bannerSize"
                    />
                    {isCustomSize && (
                      <div className="grid grid-cols-2 gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="space-y-1.5">
                          <Label className="text-xs">{t("customSize.width")}</Label>
                          <Input
                            type="number"
                            min={50}
                            max={4096}
                            value={editedConfig.customWidth ?? ""}
                            onChange={(e) =>
                              updateField("customWidth", e.target.value ? parseInt(e.target.value) : null)
                            }
                            placeholder="1920"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">{t("customSize.height")}</Label>
                          <Input
                            type="number"
                            min={50}
                            max={4096}
                            value={editedConfig.customHeight ?? ""}
                            onChange={(e) =>
                              updateField("customHeight", e.target.value ? parseInt(e.target.value) : null)
                            }
                            placeholder="600"
                          />
                        </div>
                      </div>
                    )}
                    <BannerTemplateSelector
                      label={t("categories.industry")}
                      templates={industryTemplates}
                      value={editedConfig.industry || ""}
                      onChange={(v) => updateField("industry", v)}
                      placeholder={t("placeholders.industry")}
                      category="industry"
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Section B: Visual Style */}
                <AccordionItem value="visualStyle" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t("sections.visualStyle")}</span>
                      {(editedConfig.designStyle || editedConfig.colorScheme || editedConfig.mood || editedConfig.seasonal) && (
                        <Badge variant="secondary" className="text-xs">
                          {[editedConfig.designStyle, editedConfig.colorScheme, editedConfig.mood, editedConfig.seasonal].filter(Boolean).length}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <BannerTemplateSelector
                      label={t("categories.designStyle")}
                      templates={designStyleTemplates}
                      value={editedConfig.designStyle || ""}
                      onChange={(v) => updateField("designStyle", v)}
                      placeholder={t("placeholders.designStyle")}
                      category="designStyle"
                    />
                    <BannerTemplateSelector
                      label={t("categories.colorScheme")}
                      templates={colorSchemeTemplates}
                      value={editedConfig.colorScheme || ""}
                      onChange={(v) => updateField("colorScheme", v)}
                      placeholder={t("placeholders.colorScheme")}
                      category="colorScheme"
                    />
                    <BannerTemplateSelector
                      label={t("categories.mood")}
                      templates={moodTemplates}
                      value={editedConfig.mood || ""}
                      onChange={(v) => updateField("mood", v)}
                      placeholder={t("placeholders.mood")}
                      category="mood"
                    />
                    <BannerTemplateSelector
                      label={t("categories.seasonal")}
                      templates={seasonalTemplates}
                      value={editedConfig.seasonal || ""}
                      onChange={(v) => updateField("seasonal", v)}
                      placeholder={t("placeholders.seasonal")}
                      category="seasonal"
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Section C: Visual Elements */}
                <AccordionItem value="visualElements" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t("sections.visualElements")}</span>
                      {(editedConfig.backgroundStyle || editedConfig.visualEffects || editedConfig.iconGraphics || editedConfig.promotionalElements) && (
                        <Badge variant="secondary" className="text-xs">
                          {[editedConfig.backgroundStyle, editedConfig.visualEffects, editedConfig.iconGraphics, editedConfig.promotionalElements].filter(Boolean).length}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <BannerTemplateSelector
                      label={t("categories.backgroundStyle")}
                      templates={backgroundStyleTemplates}
                      value={editedConfig.backgroundStyle || ""}
                      onChange={(v) => updateField("backgroundStyle", v)}
                      placeholder={t("placeholders.backgroundStyle")}
                      category="backgroundStyle"
                    />
                    <BannerTemplateSelector
                      label={t("categories.visualEffects")}
                      templates={visualEffectsTemplates}
                      value={editedConfig.visualEffects || ""}
                      onChange={(v) => updateField("visualEffects", v)}
                      placeholder={t("placeholders.visualEffects")}
                      category="visualEffects"
                    />
                    <BannerTemplateSelector
                      label={t("categories.iconGraphics")}
                      templates={iconGraphicsTemplates}
                      value={editedConfig.iconGraphics || ""}
                      onChange={(v) => updateField("iconGraphics", v)}
                      placeholder={t("placeholders.iconGraphics")}
                      category="iconGraphics"
                    />
                    <BannerTemplateSelector
                      label={t("categories.promotionalElements")}
                      templates={promotionalTemplates}
                      value={editedConfig.promotionalElements || ""}
                      onChange={(v) => updateField("promotionalElements", v)}
                      placeholder={t("placeholders.promotionalElements")}
                      category="promotionalElements"
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Section D: Layout & Typography */}
                <AccordionItem value="layoutTypography" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t("sections.layoutTypography")}</span>
                      {(editedConfig.layoutStyle || editedConfig.textPlacement || editedConfig.typographyStyle || editedConfig.ctaButtonStyle) && (
                        <Badge variant="secondary" className="text-xs">
                          {[
                            editedConfig.layoutStyle,
                            editedConfig.textLanguage,
                            editedConfig.textPlacement,
                            editedConfig.typographyStyle,
                            editedConfig.headlineTypography,
                            editedConfig.bodyTypography,
                            editedConfig.ctaTypography,
                            editedConfig.ctaButtonStyle,
                          ].filter(Boolean).length}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <BannerTemplateSelector
                      label={t("categories.layoutStyle")}
                      templates={layoutStyleTemplates}
                      value={editedConfig.layoutStyle || ""}
                      onChange={(v) => updateField("layoutStyle", v)}
                      placeholder={t("placeholders.layoutStyle")}
                      category="layoutStyle"
                    />
                    <BannerTemplateSelector
                      label={t("categories.textLanguage")}
                      templates={textLanguageTemplates}
                      value={editedConfig.textLanguage || ""}
                      onChange={(v) => updateField("textLanguage", v)}
                      placeholder={t("placeholders.textLanguage")}
                      category="textLanguage"
                    />
                    <BannerTemplateSelector
                      label={t("categories.textPlacement")}
                      templates={textPlacementTemplates}
                      value={editedConfig.textPlacement || ""}
                      onChange={(v) => updateField("textPlacement", v)}
                      placeholder={t("placeholders.textPlacement")}
                      category="textPlacement"
                    />
                    <BannerTemplateSelector
                      label={t("categories.typographyStyle")}
                      templates={typographyStyleTemplates}
                      value={editedConfig.typographyStyle || ""}
                      onChange={(v) => updateField("typographyStyle", v)}
                      placeholder={t("placeholders.typographyStyle")}
                      category="typographyStyle"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <BannerTemplateSelector
                        label={t("categories.headlineTypography")}
                        templates={typographyStyleTemplates}
                        value={editedConfig.headlineTypography || ""}
                        onChange={(v) => updateField("headlineTypography", v)}
                        placeholder={t("placeholders.headlineTypography")}
                        category="headlineTypography"
                      />
                      <BannerTemplateSelector
                        label={t("categories.bodyTypography")}
                        templates={typographyStyleTemplates}
                        value={editedConfig.bodyTypography || ""}
                        onChange={(v) => updateField("bodyTypography", v)}
                        placeholder={t("placeholders.bodyTypography")}
                        category="bodyTypography"
                      />
                      <BannerTemplateSelector
                        label={t("categories.ctaTypography")}
                        templates={typographyStyleTemplates}
                        value={editedConfig.ctaTypography || ""}
                        onChange={(v) => updateField("ctaTypography", v)}
                        placeholder={t("placeholders.ctaTypography")}
                        category="ctaTypography"
                      />
                    </div>
                    <BannerTemplateSelector
                      label={t("categories.ctaButtonStyle")}
                      templates={ctaButtonStyleTemplates}
                      value={editedConfig.ctaButtonStyle || ""}
                      onChange={(v) => updateField("ctaButtonStyle", v)}
                      placeholder={t("placeholders.ctaButtonStyle")}
                      category="ctaButtonStyle"
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Text Content */}
                <AccordionItem value="textContent" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{tPresets("sectionTextContent")}</span>
                      {editedConfig.textContent && Object.values(editedConfig.textContent).some(Boolean) && (
                        <Badge variant="secondary" className="text-xs">
                          {Object.values(editedConfig.textContent).filter(Boolean).length}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>{t("textContent.headline")}</Label>
                      <Input
                        value={editedConfig.textContent?.headline || ""}
                        onChange={(e) => updateTextContent("headline", e.target.value)}
                        placeholder={t("textContent.headlinePlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("textContent.subheadline")}</Label>
                      <Input
                        value={editedConfig.textContent?.subheadline || ""}
                        onChange={(e) => updateTextContent("subheadline", e.target.value)}
                        placeholder={t("textContent.subheadlinePlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("textContent.ctaText")}</Label>
                      <Input
                        value={editedConfig.textContent?.ctaText || ""}
                        onChange={(e) => updateTextContent("ctaText", e.target.value)}
                        placeholder={t("textContent.ctaPlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("textContent.tagline")}</Label>
                      <Input
                        value={editedConfig.textContent?.tagline || ""}
                        onChange={(e) => updateTextContent("tagline", e.target.value)}
                        placeholder={t("textContent.taglinePlaceholder")}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Custom Prompt */}
                <AccordionItem value="customPrompt" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{tPresets("sectionCustomPrompt")}</span>
                      {editedConfig.customPrompt && (
                        <Badge variant="secondary" className="text-xs">1</Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>{t("customPrompt.label")}</Label>
                      <Textarea
                        value={editedConfig.customPrompt || ""}
                        onChange={(e) => updateField("customPrompt", e.target.value)}
                        placeholder={t("customPrompt.placeholder")}
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        {t("customPrompt.hint")}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </ScrollArea>

          <SheetFooter className="px-6 py-4 border-t gap-2">
            <Button
              variant="outline"
              onClick={handleDuplicate}
              disabled={isDuplicating || isSaving}
            >
              {isDuplicating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {tPresets("duplicate")}
            </Button>
            <Button
              variant="outline"
              onClick={resetChanges}
              disabled={!isDirty || isSaving}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {tPresets("resetChanges")}
            </Button>
            <div className="flex-1" />
            <Button variant="outline" onClick={handleClose} disabled={isSaving}>
              {tCommon("cancel")}
            </Button>
            <Button onClick={handleSave} disabled={!isDirty || isSaving || !editedName.trim()}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {tPresets("saveChanges")}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Discard Changes Dialog */}
      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tPresets("unsavedChanges")}</AlertDialogTitle>
            <AlertDialogDescription>
              {tPresets("unsavedChangesConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscardAndClose}>
              {tPresets("discardChanges")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
