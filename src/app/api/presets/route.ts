import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { presets } from "@/lib/schema";
import type { Preset, PresetConfig } from "@/lib/types/generation";
import { createPresetSchema } from "@/lib/validations";

/**
 * GET /api/presets
 * List all presets for the authenticated user
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userPresets = await db
      .select()
      .from(presets)
      .where(eq(presets.userId, session.user.id))
      .orderBy(desc(presets.createdAt));

    const formattedPresets: Preset[] = userPresets.map((p) => ({
      id: p.id,
      userId: p.userId,
      name: p.name,
      config: p.config as PresetConfig,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json({ presets: formattedPresets });
  } catch (error) {
    return handleApiError(error, "fetching presets");
  }
}

/**
 * POST /api/presets
 * Create a new preset
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body using Zod schema
    const parseResult = createPresetSchema.safeParse(body);
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
      .insert(presets)
      .values({
        userId: session.user.id,
        name: name,
        config: config,
      })
      .returning();

    if (!newPreset) {
      return NextResponse.json(
        { error: "Failed to create preset" },
        { status: 500 }
      );
    }

    const formattedPreset: Preset = {
      id: newPreset.id,
      userId: newPreset.userId,
      name: newPreset.name,
      config: newPreset.config as PresetConfig,
      createdAt: newPreset.createdAt,
      updatedAt: newPreset.updatedAt,
    };

    return NextResponse.json({ preset: formattedPreset }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "creating preset");
  }
}
