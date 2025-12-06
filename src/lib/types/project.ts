// ==========================================
// Project Types
// ==========================================

/**
 * Project for organizing banner generations
 */
export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input for creating a new project
 */
export interface CreateProjectInput {
  name: string;
  description?: string | undefined;
}

/**
 * Input for updating a project
 */
export interface UpdateProjectInput {
  name?: string;
  description?: string;
}

/**
 * Project with generation count for display
 */
export interface ProjectWithGenerationCount extends Project {
  generationCount: number;
}
