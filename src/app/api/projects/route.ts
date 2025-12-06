import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/schema";
import type { Project } from "@/lib/types/project";
import { createProjectSchema } from "@/lib/validations";

/**
 * GET /api/projects
 * List all projects for the authenticated user
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, session.user.id))
      .orderBy(desc(projects.createdAt));

    const formattedProjects: Project[] = userProjects.map((p) => ({
      id: p.id,
      userId: p.userId,
      name: p.name,
      description: p.description,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json({ projects: formattedProjects });
  } catch (error) {
    return handleApiError(error, "fetching projects");
  }
}

/**
 * POST /api/projects
 * Create a new project
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body using Zod schema
    const parseResult = createProjectSchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || "Invalid request data" },
        { status: 400 }
      );
    }

    const { name, description } = parseResult.data;

    // Create the project
    const [newProject] = await db
      .insert(projects)
      .values({
        userId: session.user.id,
        name: name,
        description: description || null,
      })
      .returning();

    if (!newProject) {
      return NextResponse.json(
        { error: "Failed to create project" },
        { status: 500 }
      );
    }

    const formattedProject: Project = {
      id: newProject.id,
      userId: newProject.userId,
      name: newProject.name,
      description: newProject.description,
      createdAt: newProject.createdAt,
      updatedAt: newProject.updatedAt,
    };

    return NextResponse.json({ project: formattedProject }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "creating project");
  }
}
