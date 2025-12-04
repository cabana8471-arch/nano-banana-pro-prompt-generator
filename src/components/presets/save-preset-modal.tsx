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
import type { PresetConfig } from "@/lib/types/generation";

interface SavePresetModalProps {
  config: PresetConfig;
  onSave: (name: string, config: PresetConfig) => Promise<boolean>;
  disabled?: boolean;
  trigger?: React.ReactNode;
}

export function SavePresetModal({
  config,
  onSave,
  disabled = false,
  trigger,
}: SavePresetModalProps) {
  const t = useTranslations("presets");
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
    if (config.style) summary.push(`Style: ${config.style}`);
    if (config.location) summary.push(`Location: ${config.location}`);
    if (config.lighting) summary.push(`Lighting: ${config.lighting}`);
    if (config.camera) summary.push(`Camera: ${config.camera}`);
    if (config.subjects.length > 0) {
      summary.push(t("subjects", { count: config.subjects.length }));
    }
    if (config.customPrompt) summary.push(t("customPromptIncluded"));
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
            <DialogDescription>
              {t("saveDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="preset-name">{t("presetName")}</Label>
              <Input
                id="preset-name"
                placeholder={t("presetPlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSaving}
                autoFocus
              />
            </div>

            {configSummary.length > 0 && (
              <div className="grid gap-2">
                <Label className="text-muted-foreground text-sm">
                  {t("configSummary")}
                </Label>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  {configSummary.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
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
