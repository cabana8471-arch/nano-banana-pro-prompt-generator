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
import { Badge } from "@/components/ui/badge";
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
        <DialogContent className="sm:max-w-xl">
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
            <ScrollArea className="max-h-[400px] pr-4">
              <div className="space-y-3">
                {presets.map((preset) => {
                  const totalFields = getTotalConfiguredFields(preset.config);

                  return (
                    <div
                      key={preset.id}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        {editingId === preset.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="h-8"
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
                              className="h-8 w-8 shrink-0"
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
                              className="h-8 w-8 shrink-0"
                              onClick={handleCancelEdit}
                              disabled={isUpdating}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{preset.name}</p>
                              <Badge variant="secondary" className="text-xs shrink-0">
                                {t("fieldsConfigured", { count: totalFields })}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatDate(preset.createdAt)}
                            </p>
                            <div className="mt-2 space-y-1">
                              <PresetSectionSummary section="basicConfig" config={preset.config} compact />
                              <PresetSectionSummary section="visualStyle" config={preset.config} compact />
                            </div>
                          </>
                        )}
                      </div>

                      {editingId !== preset.id && (
                        <div className="flex flex-col gap-1 shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleEditFull(preset)}
                            title={t("editFull")}
                          >
                            <Pencil className="h-4 w-4" />
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
