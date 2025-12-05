import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { INPUT_LIMITS, GENERATION } from "@/lib/constants";
import { db } from "@/lib/db";
import { generateWithUserKey, type ReferenceImage } from "@/lib/gemini";
import { generations, generatedImages, generationHistory, avatars } from "@/lib/schema";
import { upload } from "@/lib/storage";
import type {
  GenerationSettings,
  AvatarType,
  GenerationWithImages,
} from "@/lib/types/generation";

// Maximum duration for Vercel Hobby plan is 60 seconds
export const maxDuration = 60;

interface GenerateRequestBody {
  prompt: string;
  settings: GenerationSettings;
  referenceImages?: {
    avatarId: string;
    type: AvatarType;
  }[];
}

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

    const body = (await request.json()) as GenerateRequestBody;
    const { prompt, settings, referenceImages = [] } = body;

    // Validate required fields
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Validate prompt length to prevent DoS and database bloat
    if (prompt.length > INPUT_LIMITS.MAX_PROMPT_LENGTH) {
      return NextResponse.json(
        { error: `Prompt too long. Maximum ${INPUT_LIMITS.MAX_PROMPT_LENGTH} characters allowed` },
        { status: 400 }
      );
    }

    if (!settings || !settings.resolution || !settings.aspectRatio) {
      return NextResponse.json(
        { error: "Settings with resolution and aspectRatio are required" },
        { status: 400 }
      );
    }

    // Validate settings using centralized constants
    if (!GENERATION.VALID_RESOLUTIONS.includes(settings.resolution as typeof GENERATION.VALID_RESOLUTIONS[number])) {
      return NextResponse.json(
        { error: "Invalid resolution" },
        { status: 400 }
      );
    }

    if (!GENERATION.VALID_ASPECT_RATIOS.includes(settings.aspectRatio as typeof GENERATION.VALID_ASPECT_RATIOS[number])) {
      return NextResponse.json(
        { error: "Invalid aspect ratio" },
        { status: 400 }
      );
    }

    if (settings.imageCount && !GENERATION.VALID_IMAGE_COUNTS.includes(settings.imageCount as typeof GENERATION.VALID_IMAGE_COUNTS[number])) {
      return NextResponse.json(
        { error: "Invalid image count. Must be 1-4" },
        { status: 400 }
      );
    }

    // Get avatar details for reference images
    let avatarDetails: ReferenceImage[] = [];
    if (referenceImages.length > 0) {
      const avatarIds = referenceImages.map((r) => r.avatarId);
      const avatarRecords = await db
        .select()
        .from(avatars)
        .where(inArray(avatars.id, avatarIds));

      // Map avatar records to reference images
      avatarDetails = referenceImages
        .map((ref) => {
          const avatar = avatarRecords.find((a) => a.id === ref.avatarId);
          if (!avatar) return null;
          return {
            imageUrl: avatar.imageUrl,
            type: avatar.avatarType as AvatarType,
            name: avatar.name,
          } as ReferenceImage;
        })
        .filter((a): a is ReferenceImage => a !== null);
    }

    // Create the generation record with 'processing' status
    const [generation] = await db
      .insert(generations)
      .values({
        userId: session.user.id,
        prompt: prompt.trim(),
        settings: settings,
        status: "processing",
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

      // Update generation status to completed
      await tx
        .update(generations)
        .set({ status: "completed" })
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
      prompt: updatedGeneration!.prompt,
      settings: updatedGeneration!.settings as GenerationSettings,
      status: "completed",
      errorMessage: null,
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

    return NextResponse.json({ generation: generationWithImages }, { status: 201 });
  } catch (error) {
    console.error("Error generating images:", error);
    return NextResponse.json(
      { error: "Failed to generate images" },
      { status: 500 }
    );
  }
}
