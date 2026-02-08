"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Copy, RotateCcw, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useLogoPresetEditor } from "@/hooks/use-logo-preset-editor";
import {
  logoTypeTemplates,
  industryTemplates,
  logoFormatTemplates,
  designStyleTemplates,
  colorSchemeTypeTemplates,
  moodTemplates,
  iconStyleTemplates,
  fontCategoryTemplates,
  typographyTreatmentTemplates,
  specialEffectsTemplates,
  backgroundStyleTemplates,
} from "@/lib/data/logo-templates";
import type { LogoPreset, UpdateLogoPresetInput } from "@/lib/types/logo";
import { LogoTemplateSelector } from "../logo-builder/logo-template-selector";

interface EditLogoPresetSheetProps {
  preset: LogoPreset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, input: UpdateLogoPresetInput) => Promise<boolean>;
  onDuplicate: (id: string, newName?: string) => Promise<boolean>;
}

export function EditLogoPresetSheet({
  preset,
  open,
  onOpenChange,
  onSave,
  onDuplicate,
}: EditLogoPresetSheetProps) {
  const t = useTranslations("logoGenerator");
  const tPresets = useTranslations("logoGenerator.presets");
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
  } = useLogoPresetEditor();

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

  return (
    <>
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col h-full max-h-screen overflow-hidden">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>{tPresets("editPreset")}</SheetTitle>
            <SheetDescription>
              {tPresets("editPresetDescription")}
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1 overflow-auto">
            <div className="px-6 py-4 space-y-6 pb-8">
              {/* Preset Name */}
              <div className="space-y-2">
                <Label htmlFor="logo-preset-name">{tPresets("presetName")}</Label>
                <Input
                  id="logo-preset-name"
                  value={editedName}
                  onChange={(e) => updateName(e.target.value)}
                  placeholder={tPresets("presetPlaceholder")}
                />
              </div>

              {/* Changes Summary */}
              {isDirty && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                      {tPresets("unsavedChanges")}
                    </span>
                    <Badge variant="outline" className="ml-auto">
                      {tPresets("changesCount", { count: totalChanges })}
                    </Badge>
                  </div>
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
                      {(editedConfig.logoType || editedConfig.industry || editedConfig.logoFormat) && (
                        <Badge variant="secondary" className="text-xs">
                          {[editedConfig.logoType, editedConfig.industry, editedConfig.logoFormat].filter(Boolean).length}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <LogoTemplateSelector
                      label={t("categories.logoType")}
                      templates={logoTypeTemplates}
                      value={editedConfig.logoType || ""}
                      onChange={(v) => updateField("logoType", v)}
                      placeholder={t("placeholders.logoType")}
                      category="logoType"
                    />
                    <LogoTemplateSelector
                      label={t("categories.industry")}
                      templates={industryTemplates}
                      value={editedConfig.industry || ""}
                      onChange={(v) => updateField("industry", v)}
                      placeholder={t("placeholders.industry")}
                      category="industry"
                    />
                    <LogoTemplateSelector
                      label={t("categories.logoFormat")}
                      templates={logoFormatTemplates}
                      value={editedConfig.logoFormat || ""}
                      onChange={(v) => updateField("logoFormat", v)}
                      placeholder={t("placeholders.logoFormat")}
                      category="logoFormat"
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Section B: Visual Style */}
                <AccordionItem value="visualStyle" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t("sections.visualStyle")}</span>
                      {(editedConfig.designStyle || editedConfig.colorSchemeType || editedConfig.mood) && (
                        <Badge variant="secondary" className="text-xs">
                          {[editedConfig.designStyle, editedConfig.colorSchemeType, editedConfig.mood].filter(Boolean).length}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <LogoTemplateSelector
                      label={t("categories.designStyle")}
                      templates={designStyleTemplates}
                      value={editedConfig.designStyle || ""}
                      onChange={(v) => updateField("designStyle", v)}
                      placeholder={t("placeholders.designStyle")}
                      category="designStyle"
                    />
                    <LogoTemplateSelector
                      label={t("categories.colorSchemeType")}
                      templates={colorSchemeTypeTemplates}
                      value={editedConfig.colorSchemeType || ""}
                      onChange={(v) => updateField("colorSchemeType", v)}
                      placeholder={t("placeholders.colorSchemeType")}
                      category="colorSchemeType"
                    />
                    <LogoTemplateSelector
                      label={t("categories.mood")}
                      templates={moodTemplates}
                      value={editedConfig.mood || ""}
                      onChange={(v) => updateField("mood", v)}
                      placeholder={t("placeholders.mood")}
                      category="mood"
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Section C: Icon & Symbol */}
                <AccordionItem value="iconSymbol" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t("sections.iconSymbol")}</span>
                      {(editedConfig.iconStyle || (editedConfig.symbolElements && editedConfig.symbolElements.length > 0)) && (
                        <Badge variant="secondary" className="text-xs">
                          {[editedConfig.iconStyle, editedConfig.symbolElements?.length ? "symbols" : undefined].filter(Boolean).length}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <LogoTemplateSelector
                      label={t("categories.iconStyle")}
                      templates={iconStyleTemplates}
                      value={editedConfig.iconStyle || ""}
                      onChange={(v) => updateField("iconStyle", v)}
                      placeholder={t("placeholders.iconStyle")}
                      category="iconStyle"
                    />
                    {/* Symbol elements display (read-only summary, edit via main builder) */}
                    {editedConfig.symbolElements && editedConfig.symbolElements.length > 0 && (
                      <div className="space-y-1.5">
                        <Label className="text-sm">{t("categories.symbolElements")}</Label>
                        <div className="flex flex-wrap gap-1">
                          {editedConfig.symbolElements.map((element) => (
                            <Badge key={element} variant="secondary" className="text-xs">
                              {element.replace(/^symbol-/, "").replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Section D: Typography */}
                <AccordionItem value="typography" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t("sections.typography")}</span>
                      {(editedConfig.fontCategory || editedConfig.typographyTreatment) && (
                        <Badge variant="secondary" className="text-xs">
                          {[editedConfig.fontCategory, editedConfig.typographyTreatment].filter(Boolean).length}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <LogoTemplateSelector
                      label={t("categories.fontCategory")}
                      templates={fontCategoryTemplates}
                      value={editedConfig.fontCategory || ""}
                      onChange={(v) => updateField("fontCategory", v)}
                      placeholder={t("placeholders.fontCategory")}
                      category="fontCategory"
                    />
                    <LogoTemplateSelector
                      label={t("categories.typographyTreatment")}
                      templates={typographyTreatmentTemplates}
                      value={editedConfig.typographyTreatment || ""}
                      onChange={(v) => updateField("typographyTreatment", v)}
                      placeholder={t("placeholders.typographyTreatment")}
                      category="typographyTreatment"
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Section E: Additional Options */}
                <AccordionItem value="additionalOptions" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t("sections.additionalOptions")}</span>
                      {(editedConfig.specialEffects || editedConfig.backgroundStyle) && (
                        <Badge variant="secondary" className="text-xs">
                          {[editedConfig.specialEffects, editedConfig.backgroundStyle].filter(Boolean).length}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <LogoTemplateSelector
                      label={t("categories.specialEffects")}
                      templates={specialEffectsTemplates}
                      value={editedConfig.specialEffects || ""}
                      onChange={(v) => updateField("specialEffects", v)}
                      placeholder={t("placeholders.specialEffects")}
                      category="specialEffects"
                    />
                    <LogoTemplateSelector
                      label={t("categories.backgroundStyle")}
                      templates={backgroundStyleTemplates}
                      value={editedConfig.backgroundStyle || ""}
                      onChange={(v) => updateField("backgroundStyle", v)}
                      placeholder={t("placeholders.backgroundStyle")}
                      category="backgroundStyle"
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Brand Colors */}
                <AccordionItem value="brandColors" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t("sections.brandColors")}</span>
                      {(editedConfig.primaryColor || editedConfig.secondaryColor || editedConfig.accentColor) && (
                        <Badge variant="secondary" className="text-xs">
                          {[editedConfig.primaryColor, editedConfig.secondaryColor, editedConfig.accentColor].filter(Boolean).length}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>{t("brandColors.primaryColor")}</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={editedConfig.primaryColor || "#000000"}
                          onChange={(e) => updateField("primaryColor", e.target.value)}
                          className="h-9 w-9 rounded border cursor-pointer"
                        />
                        <Input
                          value={editedConfig.primaryColor || ""}
                          onChange={(e) => updateField("primaryColor", e.target.value)}
                          placeholder="#000000"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("brandColors.secondaryColor")}</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={editedConfig.secondaryColor || "#000000"}
                          onChange={(e) => updateField("secondaryColor", e.target.value)}
                          className="h-9 w-9 rounded border cursor-pointer"
                        />
                        <Input
                          value={editedConfig.secondaryColor || ""}
                          onChange={(e) => updateField("secondaryColor", e.target.value)}
                          placeholder="#000000"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("brandColors.accentColor")}</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={editedConfig.accentColor || "#000000"}
                          onChange={(e) => updateField("accentColor", e.target.value)}
                          className="h-9 w-9 rounded border cursor-pointer"
                        />
                        <Input
                          value={editedConfig.accentColor || ""}
                          onChange={(e) => updateField("accentColor", e.target.value)}
                          placeholder="#000000"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Text Content */}
                <AccordionItem value="textContent" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t("sections.textContent")}</span>
                      {editedConfig.textContent && Object.values(editedConfig.textContent).some(Boolean) && (
                        <Badge variant="secondary" className="text-xs">
                          {Object.values(editedConfig.textContent).filter(Boolean).length}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>{t("textContent.companyName")}</Label>
                      <Input
                        value={editedConfig.textContent?.companyName || ""}
                        onChange={(e) => updateTextContent("companyName", e.target.value)}
                        placeholder={t("placeholders.companyName")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("textContent.tagline")}</Label>
                      <Input
                        value={editedConfig.textContent?.tagline || ""}
                        onChange={(e) => updateTextContent("tagline", e.target.value)}
                        placeholder={t("placeholders.tagline")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("textContent.abbreviation")}</Label>
                      <Input
                        value={editedConfig.textContent?.abbreviation || ""}
                        onChange={(e) => updateTextContent("abbreviation", e.target.value)}
                        placeholder={t("placeholders.abbreviation")}
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
