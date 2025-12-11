"use client";

import { useState } from "react";
import { Copy, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BannerPreset } from "@/lib/types/banner";

interface DuplicatePresetDialogProps {
  preset: BannerPreset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDuplicate: (id: string, newName: string) => Promise<boolean>;
  existingNames: string[];
}

export function DuplicatePresetDialog({
  preset,
  open,
  onOpenChange,
  onDuplicate,
  existingNames,
}: DuplicatePresetDialogProps) {
  const t = useTranslations("bannerGenerator.presets");
  const tCommon = useTranslations("common");

  const [name, setName] = useState("");
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate default name when preset changes
  const getDefaultName = (presetName: string): string => {
    const baseName = `${presetName} (Copy)`;
    let finalName = baseName;
    let counter = 1;

    while (existingNames.some((n) => n.toLowerCase() === finalName.toLowerCase())) {
      counter++;
      finalName = `${presetName} (Copy ${counter})`;
    }

    return finalName;
  };

  // Reset state when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && preset) {
      setName(getDefaultName(preset.name));
      setError(null);
    }
    onOpenChange(newOpen);
  };

  const handleDuplicate = async () => {
    if (!preset || isDuplicating) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(t("nameRequired"));
      return;
    }

    // Check for duplicate name
    if (existingNames.some((n) => n.toLowerCase() === trimmedName.toLowerCase())) {
      setError(t("nameExists"));
      return;
    }

    setIsDuplicating(true);
    setError(null);

    try {
      const success = await onDuplicate(preset.id, trimmedName);
      if (success) {
        onOpenChange(false);
      } else {
        setError(t("duplicateFailed"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("duplicateFailed"));
    } finally {
      setIsDuplicating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("duplicatePreset")}</DialogTitle>
          <DialogDescription>
            {t("duplicatePresetDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="duplicate-name">{t("newPresetName")}</Label>
            <Input
              id="duplicate-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder={t("presetPlaceholder")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleDuplicate();
                }
              }}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {preset && (
            <p className="text-sm text-muted-foreground">
              {t("duplicatingFrom", { name: preset.name })}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDuplicating}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            onClick={handleDuplicate}
            disabled={isDuplicating || !name.trim()}
          >
            {isDuplicating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {t("duplicate")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
