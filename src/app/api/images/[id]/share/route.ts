import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generations, generatedImages } from "@/lib/schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/images/[id]/share
 * Generate a share token for an image and make it public.
 * Returns the share URL for social sharing with OG tags.
 */
export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the image with its generation to verify ownership
    const [image] = await db
      .select({
        image: generatedImages,
        generation: generations,
      })
      .from(generatedImages)
      .innerJoin(generations, eq(generatedImages.generationId, generations.id))
      .where(eq(generatedImages.id, id))
      .limit(1);

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Verify the user owns this image
    if (image.generation.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // If the image already has a share token, return it
    if (image.image.shareToken) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      return NextResponse.json({
        shareToken: image.image.shareToken,
        shareUrl: `${appUrl}/image/${id}`,
      });
    }

    // Generate a URL-safe share token
    const shareToken = crypto.randomBytes(8).toString("base64url");

    // Update the image: set share token and make it public
    const result = await db
      .update(generatedImages)
      .set({ shareToken, isPublic: true })
      .where(eq(generatedImages.id, id))
      .returning();

    const updated = result[0];
    if (!updated) {
      return NextResponse.json({ error: "Failed to create share link" }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return NextResponse.json({
      shareToken: updated.shareToken,
      shareUrl: `${appUrl}/image/${id}`,
    });
  } catch (error) {
    return handleApiError(error, "creating share link");
  }
}

/**
 * DELETE /api/images/[id]/share
 * Revoke the share token for an image.
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the image with its generation to verify ownership
    const [image] = await db
      .select({
        image: generatedImages,
        generation: generations,
      })
      .from(generatedImages)
      .innerJoin(generations, eq(generatedImages.generationId, generations.id))
      .where(eq(generatedImages.id, id))
      .limit(1);

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Verify the user owns this image
    if (image.generation.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Clear the share token
    await db
      .update(generatedImages)
      .set({ shareToken: null })
      .where(eq(generatedImages.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "revoking share link");
  }
}
