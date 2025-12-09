import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { isNull } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { estimateCostForLegacyGeneration, DEFAULT_PRICING } from "@/lib/pricing";
import { generations } from "@/lib/schema";
import type { GenerationSettings } from "@/lib/types/generation";

// Maximum duration for Vercel Hobby plan
export const maxDuration = 60;

/**
 * POST /api/cost-control/migrate
 * Migrate existing generations by estimating their costs
 * This is a one-time operation to populate cost data for legacy generations
 */
export async function POST() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all generations for this user that don't have cost estimates
    const legacyGenerations = await db
      .select({
        id: generations.id,
        prompt: generations.prompt,
        settings: generations.settings,
      })
      .from(generations)
      .where(isNull(generations.estimatedCostMicros));

    if (legacyGenerations.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No generations need migration",
        migratedCount: 0,
      });
    }

    // Process each generation and update with estimated cost
    let migratedCount = 0;
    const errors: string[] = [];

    for (const gen of legacyGenerations) {
      try {
        const settings = gen.settings as GenerationSettings | null;
        const legacySettings: { resolution?: string; imageCount?: number } = {};
        if (settings?.resolution) legacySettings.resolution = settings.resolution;
        if (settings?.imageCount) legacySettings.imageCount = settings.imageCount;

        const estimatedCost = estimateCostForLegacyGeneration(
          gen.prompt,
          legacySettings,
          DEFAULT_PRICING
        );

        // Estimate token counts based on prompt and settings
        const estimatedInputTokens = Math.ceil(gen.prompt.length / 4);
        const imageCount = settings?.imageCount || 1;
        let outputTokensPerImage: number;

        switch (settings?.resolution) {
          case "4K":
            outputTokensPerImage = 8000;
            break;
          case "2K":
            outputTokensPerImage = 4000;
            break;
          case "1K":
          default:
            outputTokensPerImage = 2000;
            break;
        }

        const estimatedOutputTokens = outputTokensPerImage * imageCount;

        await db
          .update(generations)
          .set({
            promptTokenCount: estimatedInputTokens,
            candidatesTokenCount: estimatedOutputTokens,
            totalTokenCount: estimatedInputTokens + estimatedOutputTokens,
            estimatedCostMicros: estimatedCost,
          })
          .where(isNull(generations.estimatedCostMicros));

        migratedCount++;
      } catch (err) {
        errors.push(`Failed to migrate generation ${gen.id}: ${String(err)}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration complete`,
      migratedCount,
      totalFound: legacyGenerations.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    return handleApiError(error, "migrating cost data");
  }
}

/**
 * GET /api/cost-control/migrate
 * Check migration status - how many generations need cost estimates
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Count generations without cost estimates
    const [result] = await db
      .select({
        count: db.$count(generations, isNull(generations.estimatedCostMicros)),
      })
      .from(generations);

    const pendingCount = result?.count || 0;

    return NextResponse.json({
      pendingMigrations: pendingCount,
      needsMigration: pendingCount > 0,
    });
  } catch (error) {
    return handleApiError(error, "checking migration status");
  }
}
