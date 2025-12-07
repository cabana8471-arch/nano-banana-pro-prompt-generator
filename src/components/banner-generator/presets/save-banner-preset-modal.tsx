"use client";

import { useState, useEffect, useMemo } from "react";
import { Save, Loader2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { BannerPreset, BannerPresetConfig, UpdateBannerPresetInput } from "@/lib/types/banner";
import { PresetConfigDiff } from "./shared/preset-config-diff";

interface SaveBannerPresetModalProps {
  config: BannerPresetConfig;
  onSave: (name: string, config: BannerPresetConfig) => Promise<boolean>;
  onUpdate: (id: string, input: UpdateBannerPresetInput) => Promise<boolean>;
  existingPresets: BannerPreset[];
  disabled?: boolean;
  trigger?: React.ReactNode;
}

export function SaveBannerPresetModal({
  config,
  onSave,
  onUpdate,
  existingPresets,
  disabled = false,
  trigger,
}: SaveBannerPresetModalProps) {
  const t = useTranslations("bannerGenerator.presets");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMode, setSaveMode] = useState<"new" | "update">("new");
  const [showChanges, setShowChanges] = useState(false);

  // Find existing preset with same name
  const existingPreset = useMemo(() => {
    if (!name.trim()) return null;
    return existingPresets.find(
      (p) => p.name.toLowerCase() === name.trim().toLowerCase()
    );
  }, [name, existingPresets]);

  // Reset save mode when name changes
  useEffect(() => {
    if (existingPreset) {
      setSaveMode("update");
    } else {
      setSaveMode("new");
    }
  }, [existingPreset]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      let success = false;

      if (saveMode === "update" && existingPreset) {
        // Update existing preset
        success = await onUpdate(existingPreset.id, { config });
      } else {
        // Create new preset
        success = await onSave(name.trim(), config);
      }

      if (success) {
        setOpen(false);
        setName("");
        setShowChanges(false);
      } else {
        setError(t("failedToSave"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failedToSave"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSaving) {
      setOpen(newOpen);
      if (!newOpen) {
        setName("");
        setError(null);
        setSaveMode("new");
        setShowChanges(false);
      }
    }
  };

  const getConfigSummary = (): string[] => {
    const summary: string[] = [];
    if (config.bannerType) summary.push(t("summaryBannerType"));
    if (config.bannerSize) summary.push(t("summaryBannerSize"));
    if (config.industry) summary.push(t("summaryIndustry"));
    if (config.designStyle) summary.push(t("summaryDesignStyle"));
    if (config.colorScheme) summary.push(t("summaryColorScheme"));
    if (config.layoutStyle) summary.push(t("summaryLayoutStyle"));
    if (config.textContent) {
      const textParts: string[] = [];
      if (config.textContent.headline) textParts.push(t("summaryHeadline"));
      if (config.textContent.subheadline) textParts.push(t("summarySubheadline"));
      if (config.textContent.ctaText) textParts.push(t("summaryCta"));
      if (textParts.length > 0) {
        summary.push(t("summaryTextContent", { count: textParts.length }));
      }
    }
    if (config.customPrompt) summary.push(t("summaryCustomPrompt"));
    return summary;
  };

  const configSummary = getConfigSummary();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" disabled={disabled}>
            <Save className="h-4 w-4 mr-2" />
            {t("savePreset")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>{t("savePreset")}</DialogTitle>
            <DialogDescription>{t("saveDescription")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="banner-preset-name">{t("presetName")}</Label>
              <Input
                id="banner-preset-name"
                placeholder={t("presetPlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSaving}
                autoFocus
              />
            </div>

            {/* Existing Preset Warning & Options */}
            {existingPreset && (
              <div className="space-y-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    {t("presetExists")}
                  </span>
                </div>

                <RadioGroup
                  value={saveMode}
                  onValueChange={(value: string) => setSaveMode(value as "new" | "update")}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="save-new" />
                    <Label htmlFor="save-new" className="font-normal cursor-pointer">
                      {t("saveAsNew")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="update" id="save-update" />
                    <Label htmlFor="save-update" className="font-normal cursor-pointer">
                      {t("updateExisting")}
                    </Label>
                  </div>
                </RadioGroup>

                {/* Show Changes Collapsible */}
                {saveMode === "update" && (
                  <Collapsible open={showChanges} onOpenChange={setShowChanges}>
                    <CollapsibleTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between"
                      >
                        {showChanges ? t("hideChanges") : t("showChanges")}
                        {showChanges ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <PresetConfigDiff
                        original={existingPreset.config}
                        modified={config}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            )}

            {/* Config Summary */}
            {configSummary.length > 0 && (
              <div className="grid gap-2">
                <Label className="text-muted-foreground text-sm">{t("configSummary")}</Label>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  {configSummary.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSaving}
            >
              {tCommon("cancel")}
            </Button>
            <Button type="submit" disabled={!name.trim() || isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("savingPreset")}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {saveMode === "update" && existingPreset
                    ? t("updatePreset")
                    : t("savePreset")}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
