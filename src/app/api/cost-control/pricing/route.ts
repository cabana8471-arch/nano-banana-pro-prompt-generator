import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { DEFAULT_PRICING } from "@/lib/pricing";
import { userPricingSettings } from "@/lib/schema";
import type { PricingSettings } from "@/lib/types/cost-control";

// Validation schema for pricing updates
const updatePricingSchema = z.object({
  inputTokenPriceMicros: z.number().min(0).max(1_000_000), // Max $1 per 1K tokens
  outputTextPriceMicros: z.number().min(0).max(1_000_000),
  outputImagePriceMicros: z.number().min(0).max(1_000_000),
});

/**
 * GET /api/cost-control/pricing
 * Get pricing settings for the current user
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [pricing] = await db
      .select()
      .from(userPricingSettings)
      .where(eq(userPricingSettings.userId, session.user.id));

    if (!pricing) {
      // Return default pricing settings
      return NextResponse.json(DEFAULT_PRICING);
    }

    const userPricing: PricingSettings = {
      inputTokenPriceMicros: pricing.inputTokenPriceMicros,
      outputTextPriceMicros: pricing.outputTextPriceMicros,
      outputImagePriceMicros: pricing.outputImagePriceMicros,
    };

    return NextResponse.json(userPricing);
  } catch (error) {
    return handleApiError(error, "fetching pricing settings");
  }
}

/**
 * PUT /api/cost-control/pricing
 * Update pricing settings for the current user
 */
export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = updatePricingSchema.safeParse(body);

    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || "Invalid request data" },
        { status: 400 }
      );
    }

    const { inputTokenPriceMicros, outputTextPriceMicros, outputImagePriceMicros } = parseResult.data;

    // Upsert the pricing settings
    const [existingPricing] = await db
      .select()
      .from(userPricingSettings)
      .where(eq(userPricingSettings.userId, session.user.id));

    let updatedPricing;
    if (existingPricing) {
      [updatedPricing] = await db
        .update(userPricingSettings)
        .set({
          inputTokenPriceMicros,
          outputTextPriceMicros,
          outputImagePriceMicros,
        })
        .where(eq(userPricingSettings.userId, session.user.id))
        .returning();
    } else {
      [updatedPricing] = await db
        .insert(userPricingSettings)
        .values({
          userId: session.user.id,
          inputTokenPriceMicros,
          outputTextPriceMicros,
          outputImagePriceMicros,
        })
        .returning();
    }

    const userPricing: PricingSettings = {
      inputTokenPriceMicros: updatedPricing!.inputTokenPriceMicros,
      outputTextPriceMicros: updatedPricing!.outputTextPriceMicros,
      outputImagePriceMicros: updatedPricing!.outputImagePriceMicros,
    };

    return NextResponse.json(userPricing);
  } catch (error) {
    return handleApiError(error, "updating pricing settings");
  }
}
