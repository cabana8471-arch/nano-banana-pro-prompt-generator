import { NextResponse } from "next/server";
import { eq, sql, desc, count, countDistinct } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { db } from "@/lib/db";
import { checkAuthorization } from "@/lib/require-authorization";
import { user, generations, generatedImages, imageLikes } from "@/lib/schema";
import type { TopContributor } from "@/lib/types/generation";

/**
 * GET /api/gallery/top-contributors
 * Get top contributors ranked by total likes received on public images
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

    const { searchParams } = new URL(request.url);
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));

    // Get top contributors with their public image count and total likes received
    const contributors = await db
      .select({
        userId: user.id,
        userName: user.name,
        userImage: user.image,
        totalImages: countDistinct(generatedImages.id),
        totalLikes: count(imageLikes.id),
      })
      .from(user)
      .innerJoin(generations, eq(generations.userId, user.id))
      .innerJoin(
        generatedImages,
        sql`${generatedImages.generationId} = ${generations.id} AND ${generatedImages.isPublic} = true`
      )
      .leftJoin(imageLikes, eq(imageLikes.imageId, generatedImages.id))
      .groupBy(user.id, user.name, user.image)
      .having(sql`COUNT(DISTINCT ${generatedImages.id}) > 0`)
      .orderBy(desc(count(imageLikes.id)), desc(countDistinct(generatedImages.id)))
      .limit(limit);

    const topContributors: TopContributor[] = contributors.map((row) => ({
      user: {
        id: row.userId,
        name: row.userName,
        image: row.userImage,
      },
      totalImages: row.totalImages,
      totalLikes: row.totalLikes,
    }));

    return NextResponse.json({ contributors: topContributors });
  } catch (error) {
    return handleApiError(error, "fetching top contributors");
  }
}
