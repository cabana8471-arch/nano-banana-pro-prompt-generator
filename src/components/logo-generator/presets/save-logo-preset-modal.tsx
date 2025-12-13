"use client";

import { useState, useEffect, useMemo } from "react";
import { Save, Loader2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
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
import type { LogoPreset, LogoPresetConfig, UpdateLogoPresetInput } from "@/lib/types/logo";

interface SaveLogoPresetModalProps {
  config: LogoPresetConfig;
  onSave: (name: string, config: LogoPresetConfig) => Promise<boolean>;
  onUpdate: (id: string, input: UpdateLogoPresetInput) => Promise<boolean>;
  existingPresets: LogoPreset[];
  disabled?: boolean;
  trigger?: React.ReactNode;
}

export function SaveLogoPresetModal({
  config,
  onSave,
  onUpdate,
  existingPresets,
  disabled = false,
  trigger,
}: SaveLogoPresetModalProps) {
  const t = useTranslations("logoGenerator.presets");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMode, setSaveMode] = useState<"new" | "update">("new");

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
        success = await onUpdate(existingPreset.id, { config });
      } else {
        success = await onSave(name.trim(), config);
      }

      if (success) {
        setOpen(false);
        setName("");
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
      }
    }
  };

  const getConfigSummary = (): string[] => {
    const summary: string[] = [];
    if (config.logoType) summary.push(t("summaryLogoType"));
    if (config.industry) summary.push(t("summaryIndustry"));
    if (config.logoFormat) summary.push(t("summaryLogoFormat"));
    if (config.designStyle) summary.push(t("summaryDesignStyle"));
    if (config.colorSchemeType) summary.push(t("summaryColorScheme"));
    if (config.fontCategory) summary.push(t("summaryTypography"));
    if (config.textContent?.companyName) summary.push(t("summaryCompanyName"));
    if (config.primaryColor || config.secondaryColor) summary.push(t("summaryColors"));
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
              <Label htmlFor="logo-preset-name">{t("presetName")}</Label>
              <Input
                id="logo-preset-name"
                placeholder={t("presetPlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSaving}
                autoFocus
              />
            </div>

            {/* Existing Preset Warning & Options */}
            {existingPreset && (
              <div className="space-y-3 p-3 bg-warning/10 border border-warning/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium text-warning-foreground">
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
