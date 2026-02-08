import { NextResponse } from "next/server";
import { eq, lt, isNotNull, and } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { db } from "@/lib/db";
import { generations, generatedImages } from "@/lib/schema";
import { deleteFile } from "@/lib/storage";

/** Number of days after which trashed items are permanently deleted */
const TRASH_RETENTION_DAYS = 30;

/**
 * DELETE /api/cron/trash-cleanup
 *
 * Permanently deletes generations that have been in the trash for more than 30 days.
 * This endpoint is designed to be called by a Vercel Cron Job.
 *
 * Auth: Requires `Authorization: Bearer {CRON_SECRET}` header.
 */
export async function DELETE(request: Request) {
  try {
    // Verify the cron secret to prevent unauthorized access
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error("[Cron] CRON_SECRET is not configured");
      return NextResponse.json(
        { error: "Cron endpoint is not configured" },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Calculate the cutoff date (30 days ago)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - TRASH_RETENTION_DAYS);

    // Find all generations that were trashed before the cutoff date
    const expiredGenerations = await db
      .select({
        id: generations.id,
      })
      .from(generations)
      .where(
        and(
          isNotNull(generations.deletedAt),
          lt(generations.deletedAt, cutoffDate)
        )
      );

    if (expiredGenerations.length === 0) {
      return NextResponse.json({
        success: true,
        deletedCount: 0,
        message: "No expired trash items found",
      });
    }

    let deletedCount = 0;
    let storageErrors = 0;

    // Process each expired generation: delete images from storage, then delete the generation record
    for (const generation of expiredGenerations) {
      try {
        // Fetch all images for this generation to delete from storage
        const images = await db
          .select({ imageUrl: generatedImages.imageUrl })
          .from(generatedImages)
          .where(eq(generatedImages.generationId, generation.id));

        // Delete each image from storage (best-effort, log failures but continue)
        for (const image of images) {
          try {
            await deleteFile(image.imageUrl);
          } catch (err) {
            storageErrors++;
            console.error(
              `[Cron] Failed to delete image from storage: ${image.imageUrl}`,
              err
            );
          }
        }

        // Delete the generation record (cascades to generatedImages and generationHistory)
        await db.delete(generations).where(eq(generations.id, generation.id));

        deletedCount++;
      } catch (err) {
        console.error(
          `[Cron] Failed to delete generation ${generation.id}`,
          err
        );
      }
    }

    // Log cleanup results for monitoring (using console.warn for visibility in production logs)
    console.warn(
      `[Cron] Trash cleanup completed: ${deletedCount}/${expiredGenerations.length} generations deleted, ${storageErrors} storage errors`
    );

    return NextResponse.json({
      success: true,
      deletedCount,
      totalExpired: expiredGenerations.length,
      storageErrors,
    });
  } catch (error) {
    return handleApiError(error, "trash cleanup cron job");
  }
}
