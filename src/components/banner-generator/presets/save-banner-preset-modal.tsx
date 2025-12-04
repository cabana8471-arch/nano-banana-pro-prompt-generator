"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
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
import type { BannerPresetConfig } from "@/lib/types/banner";

interface SaveBannerPresetModalProps {
  config: BannerPresetConfig;
  onSave: (name: string, config: BannerPresetConfig) => Promise<boolean>;
  disabled?: boolean;
  trigger?: React.ReactNode;
}

export function SaveBannerPresetModal({
  config,
  onSave,
  disabled = false,
  trigger,
}: SaveBannerPresetModalProps) {
  const t = useTranslations("bannerGenerator.presets");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      const success = await onSave(name.trim(), config);
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
      <DialogContent className="sm:max-w-[425px]">
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
                  {t("savePreset")}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
