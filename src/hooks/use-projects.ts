"use client";

import { useState, useCallback, useEffect } from "react";
import type { Project, CreateProjectInput, UpdateProjectInput } from "@/lib/types/project";

// ==========================================
// Types
// ==========================================

interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (input: CreateProjectInput) => Promise<Project | null>;
  updateProject: (id: string, input: UpdateProjectInput) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  getProjectById: (id: string) => Project | undefined;
  clearError: () => void;
}

// ==========================================
// Hook Implementation
// ==========================================

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // Fetch All Projects
  // ==========================================

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/projects");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch projects");
      }

      setProjects(data.projects || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch projects";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ==========================================
  // Create Project
  // ==========================================

  const createProject = useCallback(
    async (input: CreateProjectInput): Promise<Project | null> => {
      try {
        setError(null);

        const response = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create project");
        }

        // Add the new project to the list
        setProjects((prev) => [data.project, ...prev]);
        return data.project;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create project";
        setError(message);
        return null;
      }
    },
    []
  );

  // ==========================================
  // Update Project
  // ==========================================

  const updateProject = useCallback(
    async (id: string, input: UpdateProjectInput): Promise<boolean> => {
      try {
        setError(null);

        const response = await fetch(`/api/projects/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update project");
        }

        // Update the project in the list
        setProjects((prev) => prev.map((project) => (project.id === id ? data.project : project)));
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update project";
        setError(message);
        return false;
      }
    },
    []
  );

  // ==========================================
  // Delete Project
  // ==========================================

  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete project");
      }

      // Remove the project from the list
      setProjects((prev) => prev.filter((project) => project.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete project";
      setError(message);
      return false;
    }
  }, []);

  // ==========================================
  // Get Project by ID
  // ==========================================

  const getProjectById = useCallback(
    (id: string): Project | undefined => {
      return projects.find((project) => project.id === id);
    },
    [projects]
  );

  // ==========================================
  // Clear Error
  // ==========================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ==========================================
  // Fetch projects on mount
  // ==========================================

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ==========================================
  // Return
  // ==========================================

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    clearError,
  };
}
