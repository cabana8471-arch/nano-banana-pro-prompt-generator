"use client";

import { useState } from "react";
import { MoreVertical, Trash2, Loader2 } from "lucide-react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BannerPreset } from "@/lib/types/banner";

interface BannerPresetListProps {
  presets: BannerPreset[];
  onLoad: (preset: BannerPreset) => void;
  onDelete: (id: string) => Promise<boolean>;
  isLoading?: boolean;
}

export function BannerPresetList({
  presets,
  onLoad,
  onDelete,
  isLoading = false,
}: BannerPresetListProps) {
  const t = useTranslations("bannerGenerator.presets");
  const tCommon = useTranslations("common");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPresetSummary = (preset: BannerPreset): string => {
    const parts: string[] = [];
    if (preset.config.bannerType) parts.push(t("summaryBannerType"));
    if (preset.config.bannerSize) parts.push(t("summaryBannerSize"));
    if (preset.config.designStyle) parts.push(t("summaryDesignStyle"));
    if (preset.config.colorScheme) parts.push(t("summaryColorScheme"));
    return parts.join(" | ") || t("noConfiguration");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (presets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-lg mb-2">{t("noPresetsSaved")}</p>
        <p className="text-sm">{t("noPresetsSavedHint")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {presets.map((preset) => (
          <Card
            key={preset.id}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => onLoad(preset)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">{preset.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {formatDate(preset.createdAt)}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onLoad(preset);
                      }}
                    >
                      {t("loadPreset")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(preset.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {tCommon("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground truncate">{getPresetSummary(preset)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

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
