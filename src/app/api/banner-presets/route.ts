import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, desc, count } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { RESOURCE_LIMITS } from "@/lib/constants";
import { db } from "@/lib/db";
import { bannerPresets } from "@/lib/schema";
import type { BannerPreset, BannerPresetConfig } from "@/lib/types/banner";
import { createBannerPresetSchema } from "@/lib/validations";

/**
 * GET /api/banner-presets
 * List all banner presets for the authenticated user
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userPresets = await db
      .select()
      .from(bannerPresets)
      .where(eq(bannerPresets.userId, session.user.id))
      .orderBy(desc(bannerPresets.createdAt));

    const formattedPresets: BannerPreset[] = userPresets.map((p) => ({
      id: p.id,
      userId: p.userId,
      name: p.name,
      config: p.config as BannerPresetConfig,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json({ presets: formattedPresets });
  } catch (error) {
    return handleApiError(error, "fetching banner presets");
  }
}

/**
 * POST /api/banner-presets
 * Create a new banner preset
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check total banner preset limit per user
    const [presetCount] = await db
      .select({ count: count() })
      .from(bannerPresets)
      .where(eq(bannerPresets.userId, session.user.id));

    if (presetCount && presetCount.count >= RESOURCE_LIMITS.MAX_BANNER_PRESETS_PER_USER) {
      return NextResponse.json(
        {
          error: `Maximum ${RESOURCE_LIMITS.MAX_BANNER_PRESETS_PER_USER} banner presets allowed. Please delete some presets before creating new ones.`,
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate request body using Zod schema
    const parseResult = createBannerPresetSchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || "Invalid request data" },
        { status: 400 }
      );
    }

    const { name, config } = parseResult.data;

    // Create the preset
    const [newPreset] = await db
      .insert(bannerPresets)
      .values({
        userId: session.user.id,
        name: name,
        config: config,
      })
      .returning();

    if (!newPreset) {
      return NextResponse.json(
        { error: "Failed to create banner preset" },
        { status: 500 }
      );
    }

    const formattedPreset: BannerPreset = {
      id: newPreset.id,
      userId: newPreset.userId,
      name: newPreset.name,
      config: newPreset.config as BannerPresetConfig,
      createdAt: newPreset.createdAt,
      updatedAt: newPreset.updatedAt,
    };

    return NextResponse.json({ preset: formattedPreset }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "creating banner preset");
  }
}
