import { NextResponse } from "next/server";
import { eq, desc, sql, count } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { db } from "@/lib/db";
import { checkAuthorization } from "@/lib/require-authorization";
import { generations, generatedImages, user, imageLikes } from "@/lib/schema";
import type { GalleryImage, GenerationSettings } from "@/lib/types/generation";

/**
 * GET /api/gallery/most-liked
 * Get the most liked public images
 * Requires authentication and authorization
 */
export async function GET(request: Request) {
  try {
    // Check authentication and authorization
    const authResult = await checkAuthorization();

    if (!authResult) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!authResult.isAuthorized) {
      return NextResponse.json(
        { error: "Authorization required" },
        { status: 403 }
      );
    }

    const currentUserId = authResult.userId;

    const { searchParams } = new URL(request.url);
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));

    // Get most liked public images using LEFT JOIN + GROUP BY to avoid duplicate subqueries
    const likeCountExpr = count(imageLikes.id);

    const mostLikedImages = await db
      .select({
        image: generatedImages,
        generation: generations,
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
        likeCount: sql<number>`${likeCountExpr}::int`,
        isLikedByUser: currentUserId
          ? sql<boolean>`BOOL_OR(${imageLikes.userId} = ${currentUserId})`
          : sql<boolean>`false`,
      })
      .from(generatedImages)
      .innerJoin(generations, eq(generatedImages.generationId, generations.id))
      .innerJoin(user, eq(generations.userId, user.id))
      .leftJoin(imageLikes, eq(imageLikes.imageId, generatedImages.id))
      .where(eq(generatedImages.isPublic, true))
      .groupBy(generatedImages.id, generations.id, user.id)
      .orderBy(desc(likeCountExpr), desc(generatedImages.createdAt))
      .limit(limit);

    // Map to GalleryImage type
    const galleryImages: GalleryImage[] = mostLikedImages.map((row) => ({
      id: row.image.id,
      generationId: row.image.generationId,
      imageUrl: row.image.imageUrl,
      isPublic: row.image.isPublic,
      createdAt: row.image.createdAt,
      generation: {
        prompt: row.generation.prompt,
        settings: row.generation.settings as GenerationSettings,
        createdAt: row.generation.createdAt,
      },
      user: {
        id: row.user.id,
        name: row.user.name,
        image: row.user.image,
      },
      likeCount: row.likeCount || 0,
      isLikedByUser: row.isLikedByUser || false,
    }));

    // No public caching since route requires authentication
    return NextResponse.json({ images: galleryImages });
  } catch (error) {
    return handleApiError(error, "fetching most liked images");
  }
}
