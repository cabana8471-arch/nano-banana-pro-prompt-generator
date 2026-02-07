"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, RotateCcw, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type {
  GenerationWithImages,
  GenerationSettings,
  PaginatedResponse,
} from "@/lib/types/generation";

interface TrashItem {
  id: string;
  prompt: string;
  generationType: string;
  deletedAt: Date;
  createdAt: Date;
  settings: GenerationSettings;
  images: { id: string; imageUrl: string }[];
}

export function TrashGallery() {
  const t = useTranslations("gallery");
  const [items, setItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchTrash = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generations?trash=true&pageSize=50");
      if (response.ok) {
        const data: PaginatedResponse<GenerationWithImages> = await response.json();
        const trashItems: TrashItem[] = data.items.map((gen) => ({
          id: gen.id,
          prompt: gen.prompt,
          generationType: gen.generationType,
          deletedAt: gen.deletedAt ?? gen.updatedAt,
          createdAt: gen.createdAt,
          settings: gen.settings,
          images: gen.images.map((img) => ({ id: img.id, imageUrl: img.imageUrl })),
        }));
        setItems(trashItems);
      }
    } catch (error) {
      console.error("Failed to fetch trash:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrash();
  }, [fetchTrash]);

  const handleRestore = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await fetch(`/api/generations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restore: true }),
      });
      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        toast.success(t("restored"));
      } else {
        toast.error(t("restoreFailed"));
      }
    } catch {
      toast.error(t("restoreFailed"));
    } finally {
      setActionLoading(null);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await fetch(`/api/generations/${id}?permanent=true`, {
        method: "DELETE",
      });
      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        toast.success(t("permanentlyDeleted"));
      } else {
        toast.error(t("deleteFailed"));
      }
    } catch {
      toast.error(t("deleteFailed"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleEmptyTrash = async () => {
    setActionLoading("empty-all");
    try {
      let failed = 0;
      for (const item of items) {
        const response = await fetch(`/api/generations/${item.id}?permanent=true`, {
          method: "DELETE",
        });
        if (!response.ok) failed++;
      }
      if (failed === 0) {
        setItems([]);
        toast.success(t("trashEmptied"));
      } else {
        await fetchTrash();
        toast.error(t("someDeletesFailed"));
      }
    } catch {
      toast.error(t("deleteFailed"));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/gallery">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trash2 className="h-6 w-6" />
              {t("trash")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("trashDescription")}
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={actionLoading !== null}
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                {t("emptyTrash")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("emptyTrashConfirmTitle")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("emptyTrashConfirmDescription", { count: items.length })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleEmptyTrash}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {t("emptyTrash")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-pulse text-muted-foreground">{t("loading")}</div>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <Trash2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">{t("trashEmpty")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-lg border bg-card"
            >
              {/* Thumbnail */}
              <div className="shrink-0 w-16 h-16 relative rounded-md overflow-hidden bg-muted">
                {item.images[0] && (
                  <Image
                    src={item.images[0].imageUrl}
                    alt={item.prompt}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.prompt}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="capitalize">{item.generationType}</span>
                  <span>-</span>
                  <span>
                    {t("deletedAgo", {
                      time: formatDistanceToNow(new Date(item.deletedAt), { addSuffix: true }),
                    })}
                  </span>
                  <span>-</span>
                  <span>
                    {item.images.length} {item.images.length === 1 ? t("image") : t("images")}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRestore(item.id)}
                  disabled={actionLoading !== null}
                >
                  <RotateCcw className="h-4 w-4 mr-1.5" />
                  {t("restore")}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={actionLoading !== null}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("permanentDeleteTitle")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("permanentDeleteDescription")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handlePermanentDelete(item.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {t("permanentlyDelete")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
