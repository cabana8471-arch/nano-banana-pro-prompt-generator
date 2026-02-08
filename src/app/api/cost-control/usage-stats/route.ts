import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and, gte, lte, sql, isNull } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generations, generatedImages } from "@/lib/schema";
import type { UsageStats, GenerationType } from "@/lib/types/cost-control";

/**
 * GET /api/cost-control/usage-stats
 * Get generation usage statistics for the current user.
 * Only counts non-deleted generations (where deletedAt IS NULL).
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();

    // Date ranges for current and previous calendar months
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Base conditions: user-owned and not soft-deleted
    const baseConditions = and(
      eq(generations.userId, userId),
      isNull(generations.deletedAt)
    );

    // Query 1: Total generations and breakdown by type (single query with groupBy)
    const byTypeRows = await db
      .select({
        generationType: generations.generationType,
        count: sql<number>`COUNT(*)::integer`,
      })
      .from(generations)
      .where(baseConditions)
      .groupBy(generations.generationType);

    // Build the type breakdown and compute totals
    const generationsByType: Record<GenerationType, number> = {
      photo: 0,
      banner: 0,
      logo: 0,
    };
    let totalGenerations = 0;

    for (const row of byTypeRows) {
      totalGenerations += row.count;
      const type = row.generationType as GenerationType;
      if (type in generationsByType) {
        generationsByType[type] = row.count;
      }
    }

    // Determine the favorite type (most generations)
    let favoriteType: GenerationType | null = null;
    let maxCount = 0;
    for (const [type, count] of Object.entries(generationsByType)) {
      if (count > maxCount) {
        maxCount = count;
        favoriteType = type as GenerationType;
      }
    }

    // Query 2: This month's generation count
    const [thisMonthRow] = await db
      .select({
        count: sql<number>`COUNT(*)::integer`,
      })
      .from(generations)
      .where(
        and(
          baseConditions,
          gte(generations.createdAt, startOfCurrentMonth)
        )
      );

    // Query 3: Last month's generation count
    const [lastMonthRow] = await db
      .select({
        count: sql<number>`COUNT(*)::integer`,
      })
      .from(generations)
      .where(
        and(
          baseConditions,
          gte(generations.createdAt, startOfPreviousMonth),
          lte(generations.createdAt, endOfPreviousMonth)
        )
      );

    // Query 4: Total images and average images per generation
    // Join generatedImages to non-deleted generations to get accurate counts
    const [imageStatsRow] = await db
      .select({
        totalImages: sql<number>`COUNT(${generatedImages.id})::integer`,
      })
      .from(generatedImages)
      .innerJoin(generations, eq(generatedImages.generationId, generations.id))
      .where(baseConditions);

    const totalImages = imageStatsRow?.totalImages ?? 0;
    const averageImagesPerGeneration =
      totalGenerations > 0
        ? Math.round((totalImages / totalGenerations) * 100) / 100
        : 0;

    const stats: UsageStats = {
      totalGenerations,
      thisMonthGenerations: thisMonthRow?.count ?? 0,
      lastMonthGenerations: lastMonthRow?.count ?? 0,
      generationsByType,
      favoriteType,
      averageImagesPerGeneration,
      totalImages,
    };

    return NextResponse.json(stats);
  } catch (error) {
    return handleApiError(error, "fetching usage statistics");
  }
}
