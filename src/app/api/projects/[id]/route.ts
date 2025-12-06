import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/schema";
import type { Project } from "@/lib/types/project";
import { updateProjectSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/projects/[id]
 * Get a single project
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [project] = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.id, id),
          eq(projects.userId, session.user.id)
        )
      );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const formattedProject: Project = {
      id: project.id,
      userId: project.userId,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };

    return NextResponse.json({ project: formattedProject });
  } catch (error) {
    return handleApiError(error, "fetching project");
  }
}

/**
 * PUT /api/projects/[id]
 * Update a project
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validate request body using Zod schema
    const parseResult = updateProjectSchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || "Invalid request data" },
        { status: 400 }
      );
    }

    const { name, description } = parseResult.data;

    // Verify the project exists and belongs to the user
    const [existingProject] = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.id, id),
          eq(projects.userId, session.user.id)
        )
      );

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Build update object from validated data
    const updates: Partial<{ name: string; description: string | null }> = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description || null;

    // Update the project
    const [updatedProject] = await db
      .update(projects)
      .set(updates)
      .where(eq(projects.id, id))
      .returning();

    if (!updatedProject) {
      return NextResponse.json(
        { error: "Failed to update project" },
        { status: 500 }
      );
    }

    const formattedProject: Project = {
      id: updatedProject.id,
      userId: updatedProject.userId,
      name: updatedProject.name,
      description: updatedProject.description,
      createdAt: updatedProject.createdAt,
      updatedAt: updatedProject.updatedAt,
    };

    return NextResponse.json({ project: formattedProject });
  } catch (error) {
    return handleApiError(error, "updating project");
  }
}

/**
 * DELETE /api/projects/[id]
 * Delete a project (generations with this projectId will have projectId set to null via cascade)
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify the project exists and belongs to the user
    const [existingProject] = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.id, id),
          eq(projects.userId, session.user.id)
        )
      );

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete the project (projectId on generations will be set to null via onDelete: "set null")
    await db.delete(projects).where(eq(projects.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "deleting project");
  }
}
