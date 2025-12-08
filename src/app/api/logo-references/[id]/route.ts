import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { logoReferences } from "@/lib/schema";
import { deleteFile } from "@/lib/storage";
import type { LogoReference } from "@/lib/types/logo";
import { updateLogoReferenceSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/logo-references/[id]
 * Get a single logo reference by ID
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [reference] = await db
      .select()
      .from(logoReferences)
      .where(and(eq(logoReferences.id, id), eq(logoReferences.userId, session.user.id)))
      .limit(1);

    if (!reference) {
      return NextResponse.json({ error: "Logo reference not found" }, { status: 404 });
    }

    return NextResponse.json({ logoReference: reference as LogoReference });
  } catch (error) {
    return handleApiError(error, "fetching logo reference");
  }
}

/**
 * PUT /api/logo-references/[id]
 * Update a logo reference's metadata (name, description, referenceType)
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
    const parseResult = updateLogoReferenceSchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || "Invalid request data" },
        { status: 400 }
      );
    }

    const { name, description, referenceType } = parseResult.data;

    // Check if logo reference exists and belongs to user
    const [existingReference] = await db
      .select()
      .from(logoReferences)
      .where(and(eq(logoReferences.id, id), eq(logoReferences.userId, session.user.id)))
      .limit(1);

    if (!existingReference) {
      return NextResponse.json({ error: "Logo reference not found" }, { status: 404 });
    }

    // Build update object from validated data
    const updateData: Partial<typeof logoReferences.$inferInsert> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description || null;
    if (referenceType !== undefined) updateData.referenceType = referenceType;

    // Update the logo reference
    const [updatedReference] = await db
      .update(logoReferences)
      .set(updateData)
      .where(and(eq(logoReferences.id, id), eq(logoReferences.userId, session.user.id)))
      .returning();

    return NextResponse.json({ logoReference: updatedReference as LogoReference });
  } catch (error) {
    return handleApiError(error, "updating logo reference");
  }
}

/**
 * DELETE /api/logo-references/[id]
 * Delete a logo reference and its associated image
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the logo reference to delete its image
    const [reference] = await db
      .select()
      .from(logoReferences)
      .where(and(eq(logoReferences.id, id), eq(logoReferences.userId, session.user.id)))
      .limit(1);

    if (!reference) {
      return NextResponse.json({ error: "Logo reference not found" }, { status: 404 });
    }

    // Delete the image from storage
    try {
      await deleteFile(reference.imageUrl);
    } catch (storageError) {
      console.error("Error deleting logo reference image:", storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete the logo reference from database
    await db
      .delete(logoReferences)
      .where(and(eq(logoReferences.id, id), eq(logoReferences.userId, session.user.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "deleting logo reference");
  }
}
