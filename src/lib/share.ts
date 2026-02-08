import { eq, count, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { generatedImages, generations, imageLikes, user } from "@/lib/schema";

/**
 * Data returned for a publicly shared image.
 * Used by the public image page for rendering and OG meta tags.
 */
export interface PublicImageData {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: Date;
  creator: {
    name: string;
    image: string | null;
  };
  likeCount: number;
}

/**
 * Fetches public image data for the shared image page.
 * Returns null if the image does not exist or is not public.
 *
 * @param imageId - The UUID of the generated image
 */
export async function getPublicImageData(imageId: string): Promise<PublicImageData | null> {
  // Validate that imageId looks like a UUID to avoid unnecessary DB queries
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(imageId)) {
    return null;
  }

  // Query the image joined with its generation and creator
  const [result] = await db
    .select({
      imageId: generatedImages.id,
      imageUrl: generatedImages.imageUrl,
      isPublic: generatedImages.isPublic,
      createdAt: generatedImages.createdAt,
      prompt: generations.prompt,
      creatorName: user.name,
      creatorImage: user.image,
    })
    .from(generatedImages)
    .innerJoin(generations, eq(generatedImages.generationId, generations.id))
    .innerJoin(user, eq(generations.userId, user.id))
    .where(
      and(
        eq(generatedImages.id, imageId),
        eq(generatedImages.isPublic, true)
      )
    )
    .limit(1);

  if (!result) {
    return null;
  }

  // Get the like count for this image
  const [likeResult] = await db
    .select({ count: count() })
    .from(imageLikes)
    .where(eq(imageLikes.imageId, imageId));

  return {
    id: result.imageId,
    imageUrl: result.imageUrl,
    prompt: result.prompt,
    createdAt: result.createdAt,
    creator: {
      name: result.creatorName,
      image: result.creatorImage,
    },
    likeCount: likeResult?.count ?? 0,
  };
}
