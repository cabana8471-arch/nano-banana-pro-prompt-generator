"use client";

import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import type { Avatar } from "@/lib/types/generation";
import { AvatarCard } from "./avatar-card";

interface AvatarListProps {
  avatars: Avatar[];
  isLoading: boolean;
  onEdit: (avatar: Avatar) => void;
  onDelete: (avatar: Avatar) => void;
}

function AvatarSkeleton() {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="p-4 pt-0 flex gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
    </div>
  );
}

export function AvatarList({ avatars, isLoading, onEdit, onDelete }: AvatarListProps) {
  const t = useTranslations("avatars");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <AvatarSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (avatars.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">{t("noAvatars")}</p>
        <p className="text-sm">{t("noAvatarsHint")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {avatars.map((avatar) => (
        <AvatarCard
          key={avatar.id}
          avatar={avatar}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
