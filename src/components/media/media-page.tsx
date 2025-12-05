"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { AvatarFormModal } from "@/components/avatars/avatar-form-modal";
import { AvatarList } from "@/components/avatars/avatar-list";
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
import { useAvatars } from "@/hooks/use-avatars";
import { useSession } from "@/lib/auth-client";
import type { Avatar, AvatarType } from "@/lib/types/generation";

interface MediaPageProps {
  /** The avatar type to filter by */
  filterType: AvatarType;
  /** Translation namespace for this media type */
  translationNamespace: "logos" | "products" | "references";
  /** Default avatar type for new items */
  defaultAvatarType: AvatarType;
}

export function MediaPage({ filterType, translationNamespace, defaultAvatarType }: MediaPageProps) {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();
  const t = useTranslations(translationNamespace);
  const tCommon = useTranslations("common");
  const tAvatars = useTranslations("avatars");
  const { avatars, isLoading, createAvatar, updateAvatar, deleteAvatar } = useAvatars();

  // Filter avatars by type
  const filteredAvatars = useMemo(() => {
    return avatars.filter((avatar) => avatar.avatarType === filterType);
  }, [avatars, filterType]);

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState<Avatar | undefined>();
  const [deletingAvatar, setDeletingAvatar] = useState<Avatar | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission (create or edit)
  const handleFormSubmit = async (data: {
    name: string;
    description: string;
    avatarType: AvatarType;
    image?: File | undefined;
  }) => {
    setIsSubmitting(true);
    try {
      if (editingAvatar) {
        // Update existing item
        const result = await updateAvatar(editingAvatar.id, {
          name: data.name,
          description: data.description || undefined,
          avatarType: data.avatarType,
        });
        if (result) {
          toast.success(t("updateSuccess"));
          setFormModalOpen(false);
          setEditingAvatar(undefined);
        } else {
          toast.error(t("updateError"));
        }
      } else {
        // Create new item
        if (!data.image) {
          toast.error(tAvatars("imageRequired"));
          return;
        }
        const result = await createAvatar(
          {
            name: data.name,
            description: data.description || undefined,
            avatarType: defaultAvatarType,
            imageUrl: "", // Will be set by API
          },
          data.image
        );
        if (result) {
          toast.success(t("createSuccess"));
          setFormModalOpen(false);
        } else {
          toast.error(t("createError"));
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit click
  const handleEdit = (avatar: Avatar) => {
    setEditingAvatar(avatar);
    setFormModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingAvatar) return;

    const success = await deleteAvatar(deletingAvatar.id);
    if (success) {
      toast.success(t("deleteSuccess"));
    } else {
      toast.error(t("deleteError"));
    }
    setDeletingAvatar(null);
  };

  // Handle modal close
  const handleFormModalClose = (open: boolean) => {
    if (!open) {
      setEditingAvatar(undefined);
    }
    setFormModalOpen(open);
  };

  // Auth check
  if (sessionPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>{tCommon("loading")}</div>
      </div>
    );
  }

  if (!session) {
    router.push("/");
    return null;
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {tCommon("back")}
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="text-muted-foreground">
              {t("description")}
            </p>
          </div>
        </div>
        <Button onClick={() => setFormModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("createButton")}
        </Button>
      </div>

      {/* Item List */}
      <AvatarList
        avatars={filteredAvatars}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={setDeletingAvatar}
        emptyMessage={t("noItems")}
        emptyHint={t("noItemsHint")}
      />

      {/* Create/Edit Modal */}
      <AvatarFormModal
        key={editingAvatar?.id ?? "new"}
        open={formModalOpen}
        onOpenChange={handleFormModalClose}
        avatar={editingAvatar}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        defaultAvatarType={defaultAvatarType}
        hideTypeSelector={true}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingAvatar} onOpenChange={() => setDeletingAvatar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDescription", { name: deletingAvatar?.name || "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {tCommon("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
