import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, desc, asc, count, and, inArray, isNull, isNotNull, ilike, gte, lte } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { PAGINATION } from "@/lib/constants";
import { db } from "@/lib/db";
import { generations, generatedImages, imageFavorites } from "@/lib/schema";
import type { GenerationSettings, GenerationWithImages, PaginatedResponse, GenerationType } from "@/lib/types/generation";
import { escapeLikePattern } from "@/lib/utils";

/**
 * GET /api/generations
 * List user's generations with pagination, search, and filters
 */
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse pagination and filter params
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(PAGINATION.MAX_PAGE_SIZE, Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10)));
    const offset = (page - 1) * pageSize;
    const typeFilter = searchParams.get("type") as GenerationType | null;
    const projectIdFilter = searchParams.get("projectId");
    const trashFilter = searchParams.get("trash") === "true";
    const search = searchParams.get("search")?.trim() || "";
    const sortBy = searchParams.get("sort") || "newest";
    const visibilityFilter = searchParams.get("visibility"); // "public" | "private" | null
    const favoritesOnly = searchParams.get("favorites") === "true";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Build where conditions
    const whereConditions = [eq(generations.userId, session.user.id)];

    // Trash filter: show only deleted or only non-deleted
    if (trashFilter) {
      whereConditions.push(isNotNull(generations.deletedAt));
    } else {
      whereConditions.push(isNull(generations.deletedAt));
    }

    if (typeFilter && (typeFilter === "photo" || typeFilter === "banner" || typeFilter === "logo")) {
      whereConditions.push(eq(generations.generationType, typeFilter));
    }
    if (projectIdFilter) {
      whereConditions.push(eq(generations.projectId, projectIdFilter));
    }

    // Full-text search in prompts
    if (search) {
      whereConditions.push(ilike(generations.prompt, `%${escapeLikePattern(search)}%`));
    }

    // Date range filter
    if (dateFrom) {
      whereConditions.push(gte(generations.createdAt, new Date(dateFrom)));
    }
    if (dateTo) {
      // Add 1 day to include the entire end date
      const endDate = new Date(dateTo);
      endDate.setDate(endDate.getDate() + 1);
      whereConditions.push(lte(generations.createdAt, endDate));
    }

    const whereClause = and(...whereConditions);

    // Determine sort order
    const orderBy = sortBy === "oldest" ? asc(generations.createdAt) : desc(generations.createdAt);

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(generations)
      .where(whereClause);

    const total = totalResult?.count || 0;

    // Get generations for this page
    const userGenerations = await db
      .select()
      .from(generations)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(pageSize)
      .offset(offset);

    // Get all images for these generations
    const generationIds = userGenerations.map((g) => g.id);
    let images: typeof generatedImages.$inferSelect[] = [];
    let favoriteImageIds: Set<string> = new Set();

    if (generationIds.length > 0) {
      images = await db
        .select()
        .from(generatedImages)
        .where(inArray(generatedImages.generationId, generationIds));

      // Get favorite status for all images
      const imageIds = images.map((img) => img.id);
      if (imageIds.length > 0) {
        const favorites = await db
          .select({ imageId: imageFavorites.imageId })
          .from(imageFavorites)
          .where(
            and(
              inArray(imageFavorites.imageId, imageIds),
              eq(imageFavorites.userId, session.user.id)
            )
          );
        favoriteImageIds = new Set(favorites.map((f) => f.imageId));
      }
    }

    // Map generations with their images
    let generationsWithImages: GenerationWithImages[] = userGenerations.map((gen) => ({
      id: gen.id,
      userId: gen.userId,
      projectId: gen.projectId,
      prompt: gen.prompt,
      settings: gen.settings as GenerationSettings,
      status: gen.status as "pending" | "processing" | "completed" | "failed",
      generationType: (gen.generationType as GenerationType) || "photo",
      errorMessage: gen.errorMessage,
      builderConfig: gen.builderConfig as Record<string, unknown> | null,
      deletedAt: gen.deletedAt,
      createdAt: gen.createdAt,
      updatedAt: gen.updatedAt,
      images: images
        .filter((img) => img.generationId === gen.id)
        .map((img) => ({
          id: img.id,
          generationId: img.generationId,
          imageUrl: img.imageUrl,
          isPublic: img.isPublic,
          isFavorited: favoriteImageIds.has(img.id),
          createdAt: img.createdAt,
        })),
    }));

    // Post-filter: visibility (needs image data)
    if (visibilityFilter === "public") {
      generationsWithImages = generationsWithImages.filter((g) =>
        g.images.some((img) => img.isPublic)
      );
    } else if (visibilityFilter === "private") {
      generationsWithImages = generationsWithImages.filter((g) =>
        g.images.some((img) => !img.isPublic)
      );
    }

    // Post-filter: favorites only
    if (favoritesOnly) {
      generationsWithImages = generationsWithImages.filter((g) =>
        g.images.some((img) => img.isFavorited)
      );
    }

    const response: PaginatedResponse<GenerationWithImages> = {
      items: generationsWithImages,
      total: favoritesOnly || visibilityFilter ? generationsWithImages.length : total,
      page,
      pageSize,
      hasMore: favoritesOnly || visibilityFilter
        ? false
        : offset + userGenerations.length < total,
    };

    return NextResponse.json(response);
  } catch (error) {
    return handleApiError(error, "fetching generations");
  }
}
