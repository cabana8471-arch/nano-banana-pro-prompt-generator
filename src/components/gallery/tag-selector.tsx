"use client";

import { Tags } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Tag } from "@/lib/types/generation";

interface TagSelectorProps {
  imageId: string;
  currentTagIds: string[];
  tags: Tag[];
  onTagsChange: (tagIds: string[]) => void;
}

export function TagSelector({
  currentTagIds,
  tags,
  onTagsChange,
}: TagSelectorProps) {
  const t = useTranslations("gallery.tags");

  const handleToggle = (tagId: string) => {
    const isSelected = currentTagIds.includes(tagId);
    if (isSelected) {
      onTagsChange(currentTagIds.filter((id) => id !== tagId));
    } else {
      onTagsChange([...currentTagIds, tagId]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5">
          <Tags className="h-4 w-4" />
          <span className="hidden sm:inline">{t("title")}</span>
          {currentTagIds.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1 text-[10px]">
              {currentTagIds.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <p className="mb-2 text-sm font-medium">{t("title")}</p>
        {tags.length === 0 ? (
          <p className="text-xs text-muted-foreground">{t("noTags")}</p>
        ) : (
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {tags.map((tag) => {
              const isChecked = currentTagIds.includes(tag.id);
              return (
                <label
                  key={tag.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => handleToggle(tag.id)}
                  />
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="truncate text-sm">{tag.name}</span>
                </label>
              );
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
