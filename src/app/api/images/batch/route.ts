import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, inArray, and, isNull } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { RATE_LIMITS } from "@/lib/constants";
import { db } from "@/lib/db";
import { batchOperationLimiter } from "@/lib/rate-limit";
import { generations, generatedImages, imageFavorites } from "@/lib/schema";
import { batchOperationSchema } from "@/lib/validations";

/**
 * POST /api/images/batch
 *
 * Execute a batch operation on multiple gallery images.
 * Supports: delete, favorite, unfavorite, make_public, make_private.
 *
 * Ownership is verified for every image before any mutation occurs.
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Rate limit check
    const rateLimitResult = batchOperationLimiter(userId);
    if (!rateLimitResult.success) {
      const retryAfterSeconds = Math.ceil(rateLimitResult.resetInMs / 1000);
      return NextResponse.json(
        {
          error: `Too many batch operations. Maximum ${RATE_LIMITS.BATCH_OPERATIONS_PER_HOUR} per hour. Try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfterSeconds.toString(),
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": retryAfterSeconds.toString(),
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const parseResult = batchOperationSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const { imageIds, operation } = parseResult.data;

    // Verify ownership: fetch all requested images joined with their parent generation
    const imageRows = await db
      .select({
        imageId: generatedImages.id,
        generationId: generatedImages.generationId,
        generationUserId: generations.userId,
      })
      .from(generatedImages)
      .innerJoin(generations, eq(generatedImages.generationId, generations.id))
      .where(inArray(generatedImages.id, imageIds));

    // Build a map of image ID -> generation data for quick lookups
    const imageMap = new Map(
      imageRows.map((row) => [row.imageId, row])
    );

    // Ensure every requested image exists and belongs to the current user
    const unauthorizedIds: string[] = [];
    const missingIds: string[] = [];
    for (const id of imageIds) {
      const row = imageMap.get(id);
      if (!row) {
        missingIds.push(id);
      } else if (row.generationUserId !== userId) {
        unauthorizedIds.push(id);
      }
    }

    if (unauthorizedIds.length > 0) {
      return NextResponse.json(
        { error: "Forbidden: you do not own all selected images" },
        { status: 403 }
      );
    }

    if (missingIds.length > 0) {
      return NextResponse.json(
        { error: "Some images were not found" },
        { status: 404 }
      );
    }

    // Execute the operation
    switch (operation) {
      case "delete": {
        // Soft-delete the parent generations (sets deletedAt)
        // Collect unique generation IDs from the selected images
        const generationIds = [
          ...new Set(imageRows.map((row) => row.generationId)),
        ];
        await db
          .update(generations)
          .set({ deletedAt: new Date() })
          .where(
            and(
              inArray(generations.id, generationIds),
              eq(generations.userId, userId),
              isNull(generations.deletedAt)
            )
          );
        break;
      }

      case "favorite": {
        // Insert into imageFavorites, ignoring conflicts (already favorited)
        const favoriteValues = imageIds.map((imageId) => ({
          imageId,
          userId,
        }));
        await db
          .insert(imageFavorites)
          .values(favoriteValues)
          .onConflictDoNothing();
        break;
      }

      case "unfavorite": {
        // Remove from imageFavorites
        await db
          .delete(imageFavorites)
          .where(
            and(
              inArray(imageFavorites.imageId, imageIds),
              eq(imageFavorites.userId, userId)
            )
          );
        break;
      }

      case "make_public": {
        await db
          .update(generatedImages)
          .set({ isPublic: true })
          .where(inArray(generatedImages.id, imageIds));
        break;
      }

      case "make_private": {
        await db
          .update(generatedImages)
          .set({ isPublic: false })
          .where(inArray(generatedImages.id, imageIds));
        break;
      }
    }

    return NextResponse.json({
      success: true,
      count: imageIds.length,
      operation,
    });
  } catch (error) {
    return handleApiError(error, "batch image operation");
  }
}
