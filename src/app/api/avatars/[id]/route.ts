import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { avatars } from "@/lib/schema";
import { deleteFile } from "@/lib/storage";
import type { Avatar } from "@/lib/types/generation";
import { updateAvatarSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/avatars/[id]
 * Get a single avatar by ID
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [avatar] = await db
      .select()
      .from(avatars)
      .where(and(eq(avatars.id, id), eq(avatars.userId, session.user.id)))
      .limit(1);

    if (!avatar) {
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
    }

    return NextResponse.json({ avatar: avatar as Avatar });
  } catch (error) {
    return handleApiError(error, "fetching avatar");
  }
}

/**
 * PUT /api/avatars/[id]
 * Update an avatar's metadata (name, description, type)
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
    const parseResult = updateAvatarSchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || "Invalid request data" },
        { status: 400 }
      );
    }

    const { name, description, avatarType } = parseResult.data;

    // Check if avatar exists and belongs to user
    const [existingAvatar] = await db
      .select()
      .from(avatars)
      .where(and(eq(avatars.id, id), eq(avatars.userId, session.user.id)))
      .limit(1);

    if (!existingAvatar) {
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
    }

    // Build update object from validated data
    const updateData: Partial<typeof avatars.$inferInsert> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description || null;
    if (avatarType !== undefined) updateData.avatarType = avatarType;

    // Update the avatar
    const [updatedAvatar] = await db
      .update(avatars)
      .set(updateData)
      .where(and(eq(avatars.id, id), eq(avatars.userId, session.user.id)))
      .returning();

    return NextResponse.json({ avatar: updatedAvatar as Avatar });
  } catch (error) {
    return handleApiError(error, "updating avatar");
  }
}

/**
 * DELETE /api/avatars/[id]
 * Delete an avatar and its associated image
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the avatar to delete its image
    const [avatar] = await db
      .select()
      .from(avatars)
      .where(and(eq(avatars.id, id), eq(avatars.userId, session.user.id)))
      .limit(1);

    if (!avatar) {
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
    }

    // Delete the image from storage
    try {
      await deleteFile(avatar.imageUrl);
    } catch (storageError) {
      console.error("Error deleting avatar image:", storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete the avatar from database
    await db
      .delete(avatars)
      .where(and(eq(avatars.id, id), eq(avatars.userId, session.user.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "deleting avatar");
  }
}
