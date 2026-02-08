"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { Tag } from "@/lib/types/generation";
import { cn } from "@/lib/utils";

interface TagFilterProps {
  tags: Tag[];
  selectedTagIds: string[];
  onToggleTag: (tagId: string) => void;
}

export function TagFilter({ tags, selectedTagIds, onToggleTag }: TagFilterProps) {
  const t = useTranslations("gallery.tags");

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-muted-foreground mr-1">{t("filterByTags")}:</span>
      {tags.map((tag) => {
        const isSelected = selectedTagIds.includes(tag.id);
        return (
          <button
            key={tag.id}
            onClick={() => onToggleTag(tag.id)}
            className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 rounded-full"
          >
            <Badge
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors text-xs",
                isSelected && "text-white"
              )}
              style={
                isSelected
                  ? { backgroundColor: tag.color, borderColor: tag.color }
                  : { borderColor: tag.color, color: tag.color }
              }
            >
              {tag.name}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}
