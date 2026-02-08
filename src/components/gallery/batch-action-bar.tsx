"use client";

import { Globe, Heart, HeartOff, Lock, Loader2, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type BatchOperation = "delete" | "favorite" | "unfavorite" | "make_public" | "make_private";

interface BatchActionBarProps {
  /** Number of currently selected images */
  selectedCount: number;
  /** Whether a batch action is in progress */
  isPerforming: boolean;
  /** Callback when user triggers a batch operation */
  onAction: (operation: BatchOperation) => void;
  /** Callback to cancel/exit selection mode */
  onCancel: () => void;
}

/**
 * Floating action bar displayed at the bottom of the screen during multi-select mode.
 *
 * Provides quick access to batch operations: delete, favorite, unfavorite,
 * make public, and make private.
 */
export function BatchActionBar({
  selectedCount,
  isPerforming,
  onAction,
  onCancel,
}: BatchActionBarProps) {
  const t = useTranslations("gallery");

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-lg border bg-background/95 px-4 py-3 shadow-lg backdrop-blur-sm">
      {/* Selected count */}
      <span className="mr-2 text-sm font-medium whitespace-nowrap">
        {t("batchSelected", { count: selectedCount })}
      </span>

      {/* Action buttons */}
      <Button
        variant="destructive"
        size="sm"
        disabled={isPerforming}
        onClick={() => onAction("delete")}
        className="gap-1.5"
      >
        {isPerforming ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
        {t("batchDelete")}
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={isPerforming}
        onClick={() => onAction("favorite")}
        className="gap-1.5"
      >
        <Heart className="h-4 w-4" />
        {t("batchFavorite")}
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={isPerforming}
        onClick={() => onAction("unfavorite")}
        className="gap-1.5"
      >
        <HeartOff className="h-4 w-4" />
        {t("batchUnfavorite")}
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={isPerforming}
        onClick={() => onAction("make_public")}
        className="gap-1.5"
      >
        <Globe className="h-4 w-4" />
        {t("batchMakePublic")}
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={isPerforming}
        onClick={() => onAction("make_private")}
        className="gap-1.5"
      >
        <Lock className="h-4 w-4" />
        {t("batchMakePrivate")}
      </Button>

      {/* Cancel button */}
      <Button
        variant="ghost"
        size="sm"
        disabled={isPerforming}
        onClick={onCancel}
        className="ml-2 gap-1.5"
      >
        <X className="h-4 w-4" />
        {t("batchCancel")}
      </Button>
    </div>
  );
}
