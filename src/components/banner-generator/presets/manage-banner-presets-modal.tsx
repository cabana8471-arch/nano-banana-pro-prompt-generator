"use client";

import { useState } from "react";
import { Settings, Pencil, Trash2, Loader2, X, Check, Copy, ArrowLeftRight } from "lucide-react";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { BannerPreset, UpdateBannerPresetInput } from "@/lib/types/banner";
import { PresetSectionSummary, getTotalConfiguredFields } from "./shared/preset-section-summary";

interface ManageBannerPresetsModalProps {
  presets: BannerPreset[];
  onUpdate: (id: string, input: UpdateBannerPresetInput) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onDuplicate: (id: string, newName?: string) => Promise<boolean>;
  onEdit: (preset: BannerPreset) => void;
  onCompare: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ManageBannerPresetsModal({
  presets,
  onUpdate,
  onDelete,
  onDuplicate,
  onEdit,
  onCompare,
  isLoading = false,
  disabled = false,
}: ManageBannerPresetsModalProps) {
  const t = useTranslations("bannerGenerator.presets");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null);

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleSaveEdit = async (preset: BannerPreset) => {
    if (!editingName.trim() || editingName.trim() === preset.name) {
      handleCancelEdit();
      return;
    }

    setIsUpdating(true);
    try {
      const success = await onUpdate(preset.id, { name: editingName.trim() });
      if (success) {
        handleCancelEdit();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteId);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
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

  const handleEditFull = (preset: BannerPreset) => {
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
          <Button
            variant="outline"
            size="sm"
            disabled={disabled || presets.length === 0}
          >
            <Settings className="h-4 w-4 mr-2" />
            {t("managePresets")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("managePresets")}</DialogTitle>
            <DialogDescription>{t("managePresetsDescription")}</DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : presets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-lg mb-2">{t("noPresetsSaved")}</p>
              <p className="text-sm">{t("noPresetsSavedHint")}</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4 pb-4">
                {presets.map((preset) => {
                  const totalFields = getTotalConfiguredFields(preset.config);

                  return (
                    <div
                      key={preset.id}
                      className="p-4 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
                    >
                      {editingId === preset.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="h-9 flex-1"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveEdit(preset);
                              } else if (e.key === "Escape") {
                                handleCancelEdit();
                              }
                            }}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 shrink-0"
                            onClick={() => handleSaveEdit(preset)}
                            disabled={isUpdating}
                          >
                            {isUpdating ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 shrink-0"
                            onClick={handleCancelEdit}
                            disabled={isUpdating}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          {/* Header Row */}
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-base">{preset.name}</h3>
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
                                onClick={() => setDeleteId(preset.id)}
                                title={tCommon("delete")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Content Preview - Grid Layout */}
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="space-y-1.5">
                              <PresetSectionSummary section="basicConfig" config={preset.config} />
                              <PresetSectionSummary section="visualStyle" config={preset.config} />
                              <PresetSectionSummary section="visualElements" config={preset.config} />
                            </div>
                            <div className="space-y-1.5">
                              <PresetSectionSummary section="layoutTypography" config={preset.config} />
                              <PresetSectionSummary section="textContent" config={preset.config} />
                              <PresetSectionSummary section="customPrompt" config={preset.config} />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}

          {/* Footer Actions */}
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

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deletePreset")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deletePresetConfirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t("deleting") : tCommon("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
