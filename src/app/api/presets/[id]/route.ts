import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { presets } from "@/lib/schema";
import type { Preset, PresetConfig } from "@/lib/types/generation";
import { updatePresetSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/presets/[id]
 * Get a single preset
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
      .from(presets)
      .where(
        and(
          eq(presets.id, id),
          eq(presets.userId, session.user.id)
        )
      );

    if (!preset) {
      return NextResponse.json({ error: "Preset not found" }, { status: 404 });
    }

    const formattedPreset: Preset = {
      id: preset.id,
      userId: preset.userId,
      name: preset.name,
      config: preset.config as PresetConfig,
      createdAt: preset.createdAt,
      updatedAt: preset.updatedAt,
    };

    return NextResponse.json({ preset: formattedPreset });
  } catch (error) {
    return handleApiError(error, "fetching preset");
  }
}

/**
 * PUT /api/presets/[id]
 * Update a preset
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
    const parseResult = updatePresetSchema.safeParse(body);
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
      .from(presets)
      .where(
        and(
          eq(presets.id, id),
          eq(presets.userId, session.user.id)
        )
      );

    if (!existingPreset) {
      return NextResponse.json({ error: "Preset not found" }, { status: 404 });
    }

    // Build update object from validated data
    const updates: Partial<{ name: string; config: PresetConfig }> = {};
    if (name !== undefined) updates.name = name;
    if (config !== undefined) updates.config = config as PresetConfig;

    // Update the preset
    const [updatedPreset] = await db
      .update(presets)
      .set(updates)
      .where(eq(presets.id, id))
      .returning();

    if (!updatedPreset) {
      return NextResponse.json(
        { error: "Failed to update preset" },
        { status: 500 }
      );
    }

    const formattedPreset: Preset = {
      id: updatedPreset.id,
      userId: updatedPreset.userId,
      name: updatedPreset.name,
      config: updatedPreset.config as PresetConfig,
      createdAt: updatedPreset.createdAt,
      updatedAt: updatedPreset.updatedAt,
    };

    return NextResponse.json({ preset: formattedPreset });
  } catch (error) {
    return handleApiError(error, "updating preset");
  }
}

/**
 * DELETE /api/presets/[id]
 * Delete a preset
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
      .from(presets)
      .where(
        and(
          eq(presets.id, id),
          eq(presets.userId, session.user.id)
        )
      );

    if (!existingPreset) {
      return NextResponse.json({ error: "Preset not found" }, { status: 404 });
    }

    // Delete the preset
    await db.delete(presets).where(eq(presets.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "deleting preset");
  }
}
