"use client";

import { useState } from "react";
import { Settings2, Pencil, Loader2, Trash2, Copy, ArrowLeftRight } from "lucide-react";
import { useTranslations } from "next-intl";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LogoPreset, UpdateLogoPresetInput } from "@/lib/types/logo";

interface ManageLogoPresetsModalProps {
  presets: LogoPreset[];
  onUpdate: (id: string, input: UpdateLogoPresetInput) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onDuplicate: (id: string, newName?: string) => Promise<boolean>;
  onEdit: (preset: LogoPreset) => void;
  onCompare: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

/**
 * Counts the total number of configured fields in a logo preset config.
 * Used to display a summary badge on each preset row.
 */
function getTotalConfiguredFields(config: LogoPreset["config"]): number {
  let count = 0;
  const stringFields = [
    "logoType", "industry", "logoFormat", "designStyle", "colorSchemeType",
    "mood", "iconStyle", "fontCategory", "typographyTreatment",
    "specialEffects", "backgroundStyle", "primaryColor", "secondaryColor",
    "accentColor", "customPrompt",
  ] as const;

  for (const field of stringFields) {
    if (config[field]) count++;
  }
  if (config.symbolElements && config.symbolElements.length > 0) count++;
  if (config.textContent) {
    if (config.textContent.companyName) count++;
    if (config.textContent.tagline) count++;
    if (config.textContent.abbreviation) count++;
  }
  return count;
}

export function ManageLogoPresetsModal({
  presets,
  onUpdate: _onUpdate,
  onDelete,
  onDuplicate,
  onEdit,
  onCompare,
  isLoading = false,
  disabled = false,
}: ManageLogoPresetsModalProps) {
  const t = useTranslations("logoGenerator.presets");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState<LogoPreset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null);

  // onUpdate is available for future inline rename; suppress for now
  void _onUpdate;

  const handleDeleteClick = (preset: LogoPreset) => {
    setPresetToDelete(preset);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!presetToDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(presetToDelete.id);
      setDeleteDialogOpen(false);
      setPresetToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async (presetId: string) => {
    setIsDuplicating(presetId);
    try {
      await onDuplicate(presetId);
    } finally {
      setIsDuplicating(null);
    }
  };

  const handleEditFull = (preset: LogoPreset) => {
    setOpen(false);
    onEdit(preset);
  };

  const handleCompare = () => {
    setOpen(false);
    onCompare();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={disabled || isLoading}>
            <Settings2 className="h-4 w-4 mr-2" />
            {t("managePresets")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("managePresets")}</DialogTitle>
            <DialogDescription>{t("manageDescription")}</DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[400px]">
            <div className="space-y-3 pr-4">
              {presets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t("noPresets")}
                </div>
              ) : (
                presets.map((preset) => {
                  const totalFields = getTotalConfiguredFields(preset.config);

                  return (
                    <div
                      key={preset.id}
                      className="p-3 border rounded-lg hover:bg-accent/30 transition-colors"
                    >
                      {/* Header Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium truncate">{preset.name}</p>
                            <Badge variant="secondary" className="text-xs">
                              {totalFields} {t("fields")}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(preset.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3"
                            onClick={() => handleEditFull(preset)}
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                            {t("edit")}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleDuplicate(preset.id)}
                            disabled={isDuplicating === preset.id}
                            title={t("duplicate")}
                          >
                            {isDuplicating === preset.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(preset)}
                            title={tCommon("delete")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>

          {/* Footer with Compare action */}
          {presets.length >= 2 && (
            <DialogFooter className="sm:justify-start">
              <Button variant="outline" onClick={handleCompare}>
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                {t("comparePresets")}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirm", { name: presetToDelete?.name ?? "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("deleting")}
                </>
              ) : (
                tCommon("delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
