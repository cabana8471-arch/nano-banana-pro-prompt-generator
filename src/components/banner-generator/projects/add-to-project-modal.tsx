"use client";

import { useState } from "react";
import { FolderPlus, Loader2, FolderOpen, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Project, CreateProjectInput } from "@/lib/types/project";
import { CreateProjectModal } from "./create-project-modal";

interface AddToProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
  projectsLoading: boolean;
  generationId: string;
  currentProjectId?: string | null | undefined;
  onAddToProject: (generationId: string, projectId: string) => Promise<boolean>;
  onCreateProject: (input: CreateProjectInput) => Promise<Project | null>;
}

export function AddToProjectModal({
  open,
  onOpenChange,
  projects,
  projectsLoading,
  generationId,
  currentProjectId,
  onAddToProject,
  onCreateProject,
}: AddToProjectModalProps) {
  const t = useTranslations("bannerGenerator.projects");
  const tCommon = useTranslations("common");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(currentProjectId || null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleAdd = async () => {
    if (!selectedProjectId || isAdding) return;

    setIsAdding(true);
    setError(null);

    try {
      const success = await onAddToProject(generationId, selectedProjectId);
      if (success) {
        onOpenChange(false);
      } else {
        setError(t("failedToAdd"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failedToAdd"));
    } finally {
      setIsAdding(false);
    }
  };

  const handleCreateProject = async (input: CreateProjectInput): Promise<Project | null> => {
    const project = await onCreateProject(input);
    if (project) {
      // Auto-select the newly created project
      setSelectedProjectId(project.id);
    }
    return project;
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isAdding) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setSelectedProjectId(currentProjectId || null);
        setError(null);
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("addToProject")}</DialogTitle>
            <DialogDescription>{t("addToProjectDescription")}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {projectsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-4">{t("noProjectsSaved")}</p>
                <p className="text-xs text-muted-foreground">{t("noProjectsSavedHint")}</p>
              </div>
            ) : (
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-2">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => setSelectedProjectId(project.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                        selectedProjectId === project.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                      disabled={isAdding}
                    >
                      <FolderOpen className={`h-5 w-5 flex-shrink-0 ${
                        selectedProjectId === project.id ? "text-primary" : "text-muted-foreground"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{project.name}</p>
                        {project.description && (
                          <p className="text-xs text-muted-foreground truncate">{project.description}</p>
                        )}
                      </div>
                      {selectedProjectId === project.id && (
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}

            {error && <p className="text-sm text-destructive mt-4">{error}</p>}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateModalOpen(true)}
              disabled={isAdding}
              className="w-full sm:w-auto"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              {t("createNew")}
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleOpenChange(false)}
                disabled={isAdding}
                className="flex-1 sm:flex-none"
              >
                {tCommon("cancel")}
              </Button>
              <Button
                type="button"
                onClick={handleAdd}
                disabled={!selectedProjectId || isAdding || selectedProjectId === currentProjectId}
                className="flex-1 sm:flex-none"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t("adding")}
                  </>
                ) : (
                  t("addToProject")
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateProjectModal
        onCreateProject={handleCreateProject}
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </>
  );
}
