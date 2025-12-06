import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bannerPresets } from "@/lib/schema";
import type { BannerPreset, BannerPresetConfig } from "@/lib/types/banner";
import { updateBannerPresetSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/banner-presets/[id]
 * Get a single banner preset
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [preset] = await db
      .select()
      .from(bannerPresets)
      .where(
        and(
          eq(bannerPresets.id, id),
          eq(bannerPresets.userId, session.user.id)
        )
      );

    if (!preset) {
      return NextResponse.json({ error: "Banner preset not found" }, { status: 404 });
    }

    const formattedPreset: BannerPreset = {
      id: preset.id,
      userId: preset.userId,
      name: preset.name,
      config: preset.config as BannerPresetConfig,
      createdAt: preset.createdAt,
      updatedAt: preset.updatedAt,
    };

    return NextResponse.json({ preset: formattedPreset });
  } catch (error) {
    return handleApiError(error, "fetching banner preset");
  }
}

/**
 * PUT /api/banner-presets/[id]
 * Update a banner preset
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validate request body using Zod schema
    const parseResult = updateBannerPresetSchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || "Invalid request data" },
        { status: 400 }
      );
    }

    const { name, config } = parseResult.data;

    // Verify the preset exists and belongs to the user
    const [existingPreset] = await db
      .select()
      .from(bannerPresets)
      .where(
        and(
          eq(bannerPresets.id, id),
          eq(bannerPresets.userId, session.user.id)
        )
      );

    if (!existingPreset) {
      return NextResponse.json({ error: "Banner preset not found" }, { status: 404 });
    }

    // Build update object from validated data
    const updates: Partial<{ name: string; config: BannerPresetConfig }> = {};
    if (name !== undefined) updates.name = name;
    if (config !== undefined) updates.config = config as BannerPresetConfig;

    // Update the preset
    const [updatedPreset] = await db
      .update(bannerPresets)
      .set(updates)
      .where(eq(bannerPresets.id, id))
      .returning();

    if (!updatedPreset) {
      return NextResponse.json(
        { error: "Failed to update banner preset" },
        { status: 500 }
      );
    }

    const formattedPreset: BannerPreset = {
      id: updatedPreset.id,
      userId: updatedPreset.userId,
      name: updatedPreset.name,
      config: updatedPreset.config as BannerPresetConfig,
      createdAt: updatedPreset.createdAt,
      updatedAt: updatedPreset.updatedAt,
    };

    return NextResponse.json({ preset: formattedPreset });
  } catch (error) {
    return handleApiError(error, "updating banner preset");
  }
}

/**
 * DELETE /api/banner-presets/[id]
 * Delete a banner preset
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify the preset exists and belongs to the user
    const [existingPreset] = await db
      .select()
      .from(bannerPresets)
      .where(
        and(
          eq(bannerPresets.id, id),
          eq(bannerPresets.userId, session.user.id)
        )
      );

    if (!existingPreset) {
      return NextResponse.json({ error: "Banner preset not found" }, { status: 404 });
    }

    // Delete the preset
    await db.delete(bannerPresets).where(eq(bannerPresets.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "deleting banner preset");
  }
}
