"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { useTags } from "@/hooks/use-tags";

// Preset palette for quick color selection
const COLOR_PRESETS: string[] = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#64748b", // slate
];

const DEFAULT_TAG_COLOR = "#6366f1";

export function TagManager() {
  const t = useTranslations("gallery.tags");
  const { tags, isLoading, createTag, updateTag, deleteTag } = useTags();

  const [open, setOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(DEFAULT_TAG_COLOR);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newTagName.trim()) return;

    const tag = await createTag(newTagName.trim(), newTagColor);
    if (tag) {
      setNewTagName("");
      setNewTagColor(DEFAULT_TAG_COLOR);
      toast.success(t("tagCreated"));
    }
  };

  const handleStartEdit = (tagId: string, name: string, color: string) => {
    setEditingTagId(tagId);
    setEditName(name);
    setEditColor(color);
    setDeleteConfirmId(null);
  };

  const handleSaveEdit = async () => {
    if (!editingTagId || !editName.trim()) return;

    const success = await updateTag(editingTagId, {
      name: editName.trim(),
      color: editColor,
    });
    if (success) {
      setEditingTagId(null);
      toast.success(t("tagUpdated"));
    }
  };

  const handleCancelEdit = () => {
    setEditingTagId(null);
    setEditName("");
    setEditColor("");
  };

  const handleDelete = async (tagId: string) => {
    const success = await deleteTag(tagId);
    if (success) {
      setDeleteConfirmId(null);
      toast.success(t("tagDeleted"));
    }
  };

  const maxReached = tags.length >= 100;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          {t("manageTags")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("manageTags")}</DialogTitle>
          <DialogDescription>
            {tags.length}/100
          </DialogDescription>
        </DialogHeader>

        {/* Create new tag */}
        {!maxReached && (
          <div className="space-y-2">
            <p className="text-sm font-medium">{t("addTag")}</p>
            <div className="flex items-center gap-2">
              <Input
                placeholder={t("tagName")}
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="flex-1"
                maxLength={50}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                }}
              />
              <Button size="sm" onClick={handleCreate} disabled={!newTagName.trim()}>
                {t("addTag")}
              </Button>
            </div>
            {/* Color presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground mr-1">{t("tagColor")}:</span>
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewTagColor(color)}
                  className="h-5 w-5 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  style={{
                    backgroundColor: color,
                    borderColor: newTagColor === color ? "var(--foreground)" : "transparent",
                  }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
        )}
        {maxReached && (
          <p className="text-sm text-muted-foreground">{t("maxTags")}</p>
        )}

        {/* Existing tags list */}
        <div className="max-h-64 space-y-1 overflow-y-auto mt-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">{t("noTags")}</p>
          ) : tags.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noTags")}</p>
          ) : (
            tags.map((tag) => (
              <div key={tag.id}>
                {editingTagId === tag.id ? (
                  // Editing mode
                  <div className="space-y-2 rounded-md border p-2">
                    <div className="flex items-center gap-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 h-8 text-sm"
                        maxLength={50}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit();
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {COLOR_PRESETS.map((color) => (
                        <button
                          key={color}
                          onClick={() => setEditColor(color)}
                          className="h-4 w-4 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                          style={{
                            backgroundColor: color,
                            borderColor: editColor === color ? "var(--foreground)" : "transparent",
                          }}
                          aria-label={color}
                        />
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="default" onClick={handleSaveEdit} className="h-7 text-xs">
                        {t("editTag")}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-7 text-xs">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : deleteConfirmId === tag.id ? (
                  // Delete confirmation
                  <div className="rounded-md border border-destructive/50 p-2 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {t("deleteTagConfirm")}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(tag.id)}
                        className="h-7 text-xs"
                      >
                        {t("deleteTag")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteConfirmId(null)}
                        className="h-7 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Display mode
                  <div className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: tag.color, color: tag.color }}
                      >
                        {tag.name}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleStartEdit(tag.id, tag.name, tag.color)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => setDeleteConfirmId(tag.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
