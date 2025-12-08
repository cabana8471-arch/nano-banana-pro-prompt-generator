import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { logoPresets } from "@/lib/schema";
import type { LogoPreset, LogoPresetConfig } from "@/lib/types/logo";
import { updateLogoPresetSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/logo-presets/[id]
 * Get a single logo preset
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
      .from(logoPresets)
      .where(
        and(
          eq(logoPresets.id, id),
          eq(logoPresets.userId, session.user.id)
        )
      );

    if (!preset) {
      return NextResponse.json({ error: "Logo preset not found" }, { status: 404 });
    }

    const formattedPreset: LogoPreset = {
      id: preset.id,
      userId: preset.userId,
      name: preset.name,
      config: preset.config as LogoPresetConfig,
      createdAt: preset.createdAt,
      updatedAt: preset.updatedAt,
    };

    return NextResponse.json({ preset: formattedPreset });
  } catch (error) {
    return handleApiError(error, "fetching logo preset");
  }
}

/**
 * PUT /api/logo-presets/[id]
 * Update a logo preset
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
    const parseResult = updateLogoPresetSchema.safeParse(body);
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
      .from(logoPresets)
      .where(
        and(
          eq(logoPresets.id, id),
          eq(logoPresets.userId, session.user.id)
        )
      );

    if (!existingPreset) {
      return NextResponse.json({ error: "Logo preset not found" }, { status: 404 });
    }

    // Build update object from validated data
    const updates: Partial<{ name: string; config: LogoPresetConfig }> = {};
    if (name !== undefined) updates.name = name;
    if (config !== undefined) updates.config = config as LogoPresetConfig;

    // Update the preset
    const [updatedPreset] = await db
      .update(logoPresets)
      .set(updates)
      .where(eq(logoPresets.id, id))
      .returning();

    if (!updatedPreset) {
      return NextResponse.json(
        { error: "Failed to update logo preset" },
        { status: 500 }
      );
    }

    const formattedPreset: LogoPreset = {
      id: updatedPreset.id,
      userId: updatedPreset.userId,
      name: updatedPreset.name,
      config: updatedPreset.config as LogoPresetConfig,
      createdAt: updatedPreset.createdAt,
      updatedAt: updatedPreset.updatedAt,
    };

    return NextResponse.json({ preset: formattedPreset });
  } catch (error) {
    return handleApiError(error, "updating logo preset");
  }
}

/**
 * DELETE /api/logo-presets/[id]
 * Delete a logo preset
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
      .from(logoPresets)
      .where(
        and(
          eq(logoPresets.id, id),
          eq(logoPresets.userId, session.user.id)
        )
      );

    if (!existingPreset) {
      return NextResponse.json({ error: "Logo preset not found" }, { status: 404 });
    }

    // Delete the preset
    await db.delete(logoPresets).where(eq(logoPresets.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "deleting logo preset");
  }
}
