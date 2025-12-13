"use client";

import { useState } from "react";
import { FolderPlus, Loader2, FolderOpen, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Project, CreateProjectInput } from "@/lib/types/project";
import { CreateProjectModal } from "./create-project-modal";

interface ProjectSelectorProps {
  projects: Project[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (projectId: string | null) => void;
  onCreateProject: (input: CreateProjectInput) => Promise<Project | null>;
  disabled?: boolean;
}

export function ProjectSelector({
  projects,
  isLoading,
  selectedId,
  onSelect,
  onCreateProject,
  disabled = false,
}: ProjectSelectorProps) {
  const t = useTranslations("bannerGenerator.projects");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCreateProject = async (input: CreateProjectInput): Promise<Project | null> => {
    const project = await onCreateProject(input);
    if (project) {
      // Auto-select the newly created project
      onSelect(project.id);
    }
    return project;
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 h-9 px-3 border rounded-md bg-muted/50">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{t("loading")}</span>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Select
        value={selectedId || ""}
        onValueChange={(value) => onSelect(value || null)}
        disabled={disabled}
      >
        <SelectTrigger className="flex-1">
          <SelectValue placeholder={t("selectProject")}>
            {selectedId && projects.find(p => p.id === selectedId) ? (
              <span className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                {projects.find(p => p.id === selectedId)?.name}
              </span>
            ) : (
              t("selectProject")
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {projects.length === 0 ? (
            <div className="px-2 py-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">{t("noProjects")}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCreateModalOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                {t("createFirstProject")}
              </Button>
            </div>
          ) : (
            projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                <span className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  {project.name}
                </span>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <CreateProjectModal
        onCreateProject={handleCreateProject}
        disabled={disabled}
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        trigger={
          <Button
            variant="outline"
            size="icon"
            disabled={disabled}
            title={t("createNew")}
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
        }
      />
    </div>
  );
}
