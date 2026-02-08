import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and, inArray } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generatedImages, generations, imageTags, imageTagAssignments } from "@/lib/schema";
import { setImageTagsSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Verify image ownership by joining through the generation table.
 * Returns the image record if the user owns it, or null otherwise.
 */
async function verifyImageOwnership(imageId: string, userId: string) {
  const [result] = await db
    .select({
      image: generatedImages,
      generation: generations,
    })
    .from(generatedImages)
    .innerJoin(generations, eq(generatedImages.generationId, generations.id))
    .where(
      and(
        eq(generatedImages.id, imageId),
        eq(generations.userId, userId)
      )
    )
    .limit(1);

  return result || null;
}

/**
 * GET /api/images/[id]/tags
 * Get all tags assigned to a specific image
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const ownership = await verifyImageOwnership(id, session.user.id);
    if (!ownership) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Get assigned tags by joining assignments with tags
    const assignments = await db
      .select({
        tag: imageTags,
      })
      .from(imageTagAssignments)
      .innerJoin(imageTags, eq(imageTagAssignments.tagId, imageTags.id))
      .where(eq(imageTagAssignments.imageId, id));

    const tags = assignments.map((a) => a.tag);

    return NextResponse.json({ tags });
  } catch (error) {
    return handleApiError(error, "fetching image tags");
  }
}

/**
 * PUT /api/images/[id]/tags
 * Set (replace) all tags for an image.
 * Accepts { tagIds: string[] } and replaces all existing assignments.
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = setImageTagsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    // Verify image ownership
    const ownership = await verifyImageOwnership(id, session.user.id);
    if (!ownership) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const { tagIds } = parsed.data;

    // Verify all provided tags belong to the user
    if (tagIds.length > 0) {
      const userTags = await db
        .select({ id: imageTags.id })
        .from(imageTags)
        .where(
          and(
            inArray(imageTags.id, tagIds),
            eq(imageTags.userId, session.user.id)
          )
        );

      if (userTags.length !== tagIds.length) {
        return NextResponse.json(
          { error: "One or more tags not found" },
          { status: 400 }
        );
      }
    }

    // Replace all existing assignments in a transaction
    await db.transaction(async (tx) => {
      // Delete existing assignments for this image
      await tx
        .delete(imageTagAssignments)
        .where(eq(imageTagAssignments.imageId, id));

      // Insert new assignments
      if (tagIds.length > 0) {
        await tx.insert(imageTagAssignments).values(
          tagIds.map((tagId) => ({
            imageId: id,
            tagId,
          }))
        );
      }
    });

    return NextResponse.json({ success: true, tagIds });
  } catch (error) {
    return handleApiError(error, "setting image tags");
  }
}
