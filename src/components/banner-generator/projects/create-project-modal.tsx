"use client";

import { useState } from "react";
import { FolderPlus, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Project, CreateProjectInput } from "@/lib/types/project";

interface CreateProjectModalProps {
  onCreateProject: (input: CreateProjectInput) => Promise<Project | null>;
  disabled?: boolean;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateProjectModal({
  onCreateProject,
  disabled = false,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: CreateProjectModalProps) {
  const t = useTranslations("bannerGenerator.projects");
  const tCommon = useTranslations("common");
  const [internalOpen, setInternalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Support both controlled and uncontrolled modes
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isCreating) return;

    setIsCreating(true);
    setError(null);

    try {
      const project = await onCreateProject({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      if (project) {
        setOpen(false);
        setName("");
        setDescription("");
      } else {
        setError(t("failedToCreate"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failedToCreate"));
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isCreating) {
      setOpen(newOpen);
      if (!newOpen) {
        setName("");
        setDescription("");
        setError(null);
      }
    }
  };

  const content = (
    <DialogContent className="sm:max-w-[425px]">
      <form onSubmit={handleCreate}>
        <DialogHeader>
          <DialogTitle>{t("createProject")}</DialogTitle>
          <DialogDescription>{t("createDescription")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="project-name">{t("projectName")}</Label>
            <Input
              id="project-name"
              placeholder={t("projectNamePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isCreating}
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-description">{t("projectDescription")}</Label>
            <Textarea
              id="project-description"
              placeholder={t("projectDescriptionPlaceholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isCreating}
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isCreating}
          >
            {tCommon("cancel")}
          </Button>
          <Button type="submit" disabled={!name.trim() || isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("creating")}
              </>
            ) : (
              <>
                <FolderPlus className="h-4 w-4 mr-2" />
                {t("createProject")}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );

  // If no trigger is provided and modal is controlled, just render content
  if (isControlled && !trigger) {
    return <Dialog open={open} onOpenChange={handleOpenChange}>{content}</Dialog>;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" disabled={disabled}>
            <FolderPlus className="h-4 w-4 mr-2" />
            {t("createNew")}
          </Button>
        )}
      </DialogTrigger>
      {content}
    </Dialog>
  );
}
