import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bannerReferences } from "@/lib/schema";
import { deleteFile } from "@/lib/storage";
import type { BannerReference } from "@/lib/types/banner";
import { updateBannerReferenceSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/banner-references/[id]
 * Get a single banner reference by ID
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
      .from(bannerReferences)
      .where(and(eq(bannerReferences.id, id), eq(bannerReferences.userId, session.user.id)))
      .limit(1);

    if (!reference) {
      return NextResponse.json({ error: "Banner reference not found" }, { status: 404 });
    }

    return NextResponse.json({ bannerReference: reference as BannerReference });
  } catch (error) {
    return handleApiError(error, "fetching banner reference");
  }
}

/**
 * PUT /api/banner-references/[id]
 * Update a banner reference's metadata (name, description, referenceType)
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
    const parseResult = updateBannerReferenceSchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || "Invalid request data" },
        { status: 400 }
      );
    }

    const { name, description, referenceType } = parseResult.data;

    // Check if banner reference exists and belongs to user
    const [existingReference] = await db
      .select()
      .from(bannerReferences)
      .where(and(eq(bannerReferences.id, id), eq(bannerReferences.userId, session.user.id)))
      .limit(1);

    if (!existingReference) {
      return NextResponse.json({ error: "Banner reference not found" }, { status: 404 });
    }

    // Build update object from validated data
    const updateData: Partial<typeof bannerReferences.$inferInsert> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description || null;
    if (referenceType !== undefined) updateData.referenceType = referenceType;

    // Update the banner reference
    const [updatedReference] = await db
      .update(bannerReferences)
      .set(updateData)
      .where(and(eq(bannerReferences.id, id), eq(bannerReferences.userId, session.user.id)))
      .returning();

    return NextResponse.json({ bannerReference: updatedReference as BannerReference });
  } catch (error) {
    return handleApiError(error, "updating banner reference");
  }
}

/**
 * DELETE /api/banner-references/[id]
 * Delete a banner reference and its associated image
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the banner reference to delete its image
    const [reference] = await db
      .select()
      .from(bannerReferences)
      .where(and(eq(bannerReferences.id, id), eq(bannerReferences.userId, session.user.id)))
      .limit(1);

    if (!reference) {
      return NextResponse.json({ error: "Banner reference not found" }, { status: 404 });
    }

    // Delete the image from storage
    try {
      await deleteFile(reference.imageUrl);
    } catch (storageError) {
      console.error("Error deleting banner reference image:", storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete the banner reference from database
    await db
      .delete(bannerReferences)
      .where(and(eq(bannerReferences.id, id), eq(bannerReferences.userId, session.user.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "deleting banner reference");
  }
}
