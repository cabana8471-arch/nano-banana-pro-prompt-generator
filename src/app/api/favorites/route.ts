import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { imageFavorites, generatedImages, generations } from "@/lib/schema";

const toggleFavoriteSchema = z.object({
  imageId: z.string().uuid(),
});

/**
 * POST /api/favorites
 * Toggle favorite status for an image
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = toggleFavoriteSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid image ID" }, { status: 400 });
    }

    const { imageId } = parseResult.data;

    // Verify the image belongs to the user
    const [image] = await db
      .select({ id: generatedImages.id })
      .from(generatedImages)
      .innerJoin(generations, eq(generatedImages.generationId, generations.id))
      .where(
        and(
          eq(generatedImages.id, imageId),
          eq(generations.userId, session.user.id)
        )
      );

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Check if already favorited
    const [existing] = await db
      .select()
      .from(imageFavorites)
      .where(
        and(
          eq(imageFavorites.imageId, imageId),
          eq(imageFavorites.userId, session.user.id)
        )
      );

    if (existing) {
      // Remove favorite
      await db
        .delete(imageFavorites)
        .where(eq(imageFavorites.id, existing.id));
      return NextResponse.json({ isFavorited: false });
    } else {
      // Add favorite
      await db.insert(imageFavorites).values({
        imageId,
        userId: session.user.id,
      });
      return NextResponse.json({ isFavorited: true });
    }
  } catch (error) {
    return handleApiError(error, "toggling favorite");
  }
}
