import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, desc, count } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { RESOURCE_LIMITS } from "@/lib/constants";
import { db } from "@/lib/db";
import { logoPresets } from "@/lib/schema";
import type { LogoPreset, LogoPresetConfig } from "@/lib/types/logo";
import { createLogoPresetSchema } from "@/lib/validations";

/**
 * GET /api/logo-presets
 * List all logo presets for the authenticated user
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userPresets = await db
      .select()
      .from(logoPresets)
      .where(eq(logoPresets.userId, session.user.id))
      .orderBy(desc(logoPresets.createdAt));

    const formattedPresets: LogoPreset[] = userPresets.map((p) => ({
      id: p.id,
      userId: p.userId,
      name: p.name,
      config: p.config as LogoPresetConfig,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json({ presets: formattedPresets });
  } catch (error) {
    return handleApiError(error, "fetching logo presets");
  }
}

/**
 * POST /api/logo-presets
 * Create a new logo preset
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check total logo preset limit per user
    const [presetCount] = await db
      .select({ count: count() })
      .from(logoPresets)
      .where(eq(logoPresets.userId, session.user.id));

    if (presetCount && presetCount.count >= RESOURCE_LIMITS.MAX_LOGO_PRESETS_PER_USER) {
      return NextResponse.json(
        {
          error: `Maximum ${RESOURCE_LIMITS.MAX_LOGO_PRESETS_PER_USER} logo presets allowed. Please delete some presets before creating new ones.`,
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate request body using Zod schema
    const parseResult = createLogoPresetSchema.safeParse(body);
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
      .insert(logoPresets)
      .values({
        userId: session.user.id,
        name: name,
        config: config,
      })
      .returning();

    if (!newPreset) {
      return NextResponse.json({ error: "Failed to create logo preset" }, { status: 500 });
    }

    const formattedPreset: LogoPreset = {
      id: newPreset.id,
      userId: newPreset.userId,
      name: newPreset.name,
      config: newPreset.config as LogoPresetConfig,
      createdAt: newPreset.createdAt,
      updatedAt: newPreset.updatedAt,
    };

    return NextResponse.json({ preset: formattedPreset }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "creating logo preset");
  }
}
