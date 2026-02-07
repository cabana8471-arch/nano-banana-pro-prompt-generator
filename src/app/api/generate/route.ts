import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateWithUserKey, type ReferenceImage } from "@/lib/gemini";
import { calculateCostMicros, DEFAULT_PRICING, serializeUsageMetadata } from "@/lib/pricing";
import { imageGenerationLimiter } from "@/lib/rate-limit";
import { generations, generatedImages, generationHistory, avatars, userPricingSettings } from "@/lib/schema";
import { upload } from "@/lib/storage";
import type { PricingSettings } from "@/lib/types/cost-control";
import type {
  GenerationSettings,
  AvatarType,
  GenerationWithImages,
} from "@/lib/types/generation";
import { generateRequestSchema } from "@/lib/validations";

// Maximum duration for Vercel Hobby plan is 60 seconds
export const maxDuration = 60;

/**
 * POST /api/generate
 * Start a new image generation
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting for image generation
    const rateLimitResult = imageGenerationLimiter(session.user.id);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many generation requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimitResult.resetInMs / 1000)) } }
      );
    }

    // Validate request body using Zod schema
    const parseResult = generateRequestSchema.safeParse(await request.json());
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || "Invalid request body" },
        { status: 400 }
      );
    }

    const { prompt, settings, generationType, referenceImages, projectId, builderConfig } = parseResult.data;

    // Get avatar details for reference images
    // Supports both avatarId (for avatars) and imageUrl (for banner references)
    const avatarDetails: ReferenceImage[] = [];
    if (referenceImages.length > 0) {
      // Separate references that have avatarId vs those with direct imageUrl
      const refsWithAvatarId = referenceImages.filter((r) => r.avatarId);
      const refsWithImageUrl = referenceImages.filter((r) => r.imageUrl && !r.avatarId);

      // Fetch avatar records for refs that use avatarId
      if (refsWithAvatarId.length > 0) {
        const avatarIds = refsWithAvatarId.map((r) => r.avatarId!);
        const avatarRecords = await db
          .select()
          .from(avatars)
          .where(inArray(avatars.id, avatarIds));

        // Map avatar records to reference images
        const avatarRefs = refsWithAvatarId
          .map((ref) => {
            const avatar = avatarRecords.find((a) => a.id === ref.avatarId);
            if (!avatar) return null;
            return {
              imageUrl: avatar.imageUrl,
              type: ref.type as AvatarType, // Use the type from the request, not the avatar
              name: avatar.name,
            } as ReferenceImage;
          })
          .filter((a): a is ReferenceImage => a !== null);

        avatarDetails.push(...avatarRefs);
      }

      // Add direct imageUrl references (banner references)
      for (const ref of refsWithImageUrl) {
        avatarDetails.push({
          imageUrl: ref.imageUrl!,
          type: ref.type as AvatarType,
          // Banner references don't have names in this context
        });
      }
    }

    // Create the generation record with 'processing' status
    const [generation] = await db
      .insert(generations)
      .values({
        userId: session.user.id,
        prompt: prompt.trim(),
        settings: settings,
        status: "processing",
        generationType: generationType,
        projectId: projectId ?? null,
        builderConfig: builderConfig ?? null,
      })
      .returning();

    if (!generation) {
      return NextResponse.json(
        { error: "Failed to create generation record" },
        { status: 500 }
      );
    }

    // Store the initial user message in history
    await db.insert(generationHistory).values({
      generationId: generation.id,
      role: "user",
      content: prompt.trim(),
      imageUrls: avatarDetails.map((a) => a.imageUrl),
    });

    // Generate images using Gemini
    const result = await generateWithUserKey(session.user.id, prompt.trim(), {
      resolution: settings.resolution,
      aspectRatio: settings.aspectRatio,
      imageCount: settings.imageCount || 1,
      referenceImages: avatarDetails,
    });

    if (!result.success || result.images.length === 0) {
      // Update generation status to failed
      await db
        .update(generations)
        .set({
          status: "failed",
          errorMessage: result.error || "No images generated",
        })
        .where(eq(generations.id, generation.id));

      return NextResponse.json(
        {
          error: result.error || "No images generated",
          generation: {
            id: generation.id,
            status: "failed",
            errorMessage: result.error,
          },
        },
        { status: 400 }
      );
    }

    // Upload images to storage in parallel (external operation - cannot be rolled back)
    // We do this before the transaction so we have the URLs ready
    const timestamp = Date.now();
    const uploadPromises = result.images.map(async (img, i) => {
      if (!img) return null;

      const buffer = Buffer.from(img.base64, "base64");
      const extension = img.mimeType.split("/")[1] || "png";
      const filename = `gen-${generation.id}-${i}-${timestamp}.${extension}`;

      const uploadResult = await upload(buffer, filename, "generations");
      return { url: uploadResult.url, index: i };
    });

    let uploadedImages: { url: string; index: number }[];
    try {
      const results = await Promise.all(uploadPromises);
      uploadedImages = results.filter((r): r is { url: string; index: number } => r !== null);
    } catch (uploadError) {
      // If any upload fails, mark generation as failed and return
      await db
        .update(generations)
        .set({
          status: "failed",
          errorMessage: "Failed to upload generated image",
        })
        .where(eq(generations.id, generation.id));

      console.error("Image upload failed:", uploadError);
      return NextResponse.json(
        {
          error: "Failed to upload generated image",
          generation: {
            id: generation.id,
            status: "failed",
            errorMessage: "Failed to upload generated image",
          },
        },
        { status: 500 }
      );
    }

    // Use a transaction for all database completion operations
    // This ensures consistency: either all DB operations succeed or none do
    const savedImages = await db.transaction(async (tx) => {
      // Save generated images to database
      const images = [];
      for (const uploaded of uploadedImages) {
        const [savedImage] = await tx
          .insert(generatedImages)
          .values({
            generationId: generation.id,
            imageUrl: uploaded.url,
            isPublic: false,
          })
          .returning();

        if (savedImage) {
          images.push(savedImage);
        }
      }

      // Store the assistant response in history
      await tx.insert(generationHistory).values({
        generationId: generation.id,
        role: "assistant",
        content: result.text || "Generated images successfully",
        imageUrls: images.map((img) => img.imageUrl),
      });

      // Get user's custom pricing settings (or use defaults)
      let pricing: PricingSettings = DEFAULT_PRICING;
      const [userPricing] = await tx
        .select()
        .from(userPricingSettings)
        .where(eq(userPricingSettings.userId, session.user.id));

      if (userPricing) {
        pricing = {
          inputTokenPriceMicros: userPricing.inputTokenPriceMicros,
          outputTextPriceMicros: userPricing.outputTextPriceMicros,
          outputImagePriceMicros: userPricing.outputImagePriceMicros,
        };
      }

      // Calculate cost from usage data
      const costMicros = result.usage ? calculateCostMicros(result.usage, pricing) : null;

      // Update generation status to completed with usage data
      await tx
        .update(generations)
        .set({
          status: "completed",
          promptTokenCount: result.usage?.promptTokenCount ?? null,
          candidatesTokenCount: result.usage?.candidatesTokenCount ?? null,
          totalTokenCount: result.usage?.totalTokenCount ?? null,
          usageMetadata: result.usage?.usageMetadata ? serializeUsageMetadata(result.usage.usageMetadata) : null,
          estimatedCostMicros: costMicros,
        })
        .where(eq(generations.id, generation.id));

      return images;
    });

    // Fetch the updated generation
    const [updatedGeneration] = await db
      .select()
      .from(generations)
      .where(eq(generations.id, generation.id));

    const generationWithImages: GenerationWithImages = {
      id: updatedGeneration!.id,
      userId: updatedGeneration!.userId,
      projectId: updatedGeneration!.projectId ?? null,
      prompt: updatedGeneration!.prompt,
      settings: updatedGeneration!.settings as GenerationSettings,
      status: "completed",
      generationType: (updatedGeneration!.generationType as "photo" | "banner") || "photo",
      errorMessage: null,
      builderConfig: updatedGeneration!.builderConfig as Record<string, unknown> | null,
      deletedAt: updatedGeneration!.deletedAt,
      createdAt: updatedGeneration!.createdAt,
      updatedAt: updatedGeneration!.updatedAt,
      images: savedImages.map((img) => ({
        id: img.id,
        generationId: img.generationId,
        imageUrl: img.imageUrl,
        isPublic: img.isPublic,
        createdAt: img.createdAt,
      })),
    };

    return NextResponse.json({ generation: generationWithImages }, {
      status: 201,
      headers: {
        "X-RateLimit-Limit": String(rateLimitResult.limit),
        "X-RateLimit-Remaining": String(rateLimitResult.remaining),
        "X-RateLimit-Reset": String(Math.ceil(rateLimitResult.resetInMs / 1000)),
      },
    });
  } catch (error) {
    return handleApiError(error, "generating images");
  }
}
