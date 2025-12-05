import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { RATE_LIMITS } from "@/lib/constants";
import { db } from "@/lib/db";
import { avatarUploadLimiter } from "@/lib/rate-limit";
import { avatars } from "@/lib/schema";
import { upload } from "@/lib/storage";
import type { Avatar } from "@/lib/types/generation";
import { createAvatarSchema, validateImageFile } from "@/lib/validations";

/**
 * GET /api/avatars
 * List all avatars for the authenticated user
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userAvatars = await db
      .select()
      .from(avatars)
      .where(eq(avatars.userId, session.user.id))
      .orderBy(desc(avatars.createdAt));

    return NextResponse.json({ avatars: userAvatars as Avatar[] });
  } catch (error) {
    console.error("Error fetching avatars:", error);
    return NextResponse.json(
      { error: "Failed to fetch avatars" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/avatars
 * Create a new avatar with image upload
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check rate limit for avatar uploads
    const rateLimitResult = avatarUploadLimiter(session.user.id);
    if (!rateLimitResult.success) {
      const retryAfterSeconds = Math.ceil(rateLimitResult.resetInMs / 1000);
      return NextResponse.json(
        {
          error: `Too many uploads. Maximum ${RATE_LIMITS.AVATAR_UPLOADS_PER_HOUR} avatars per hour. Try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfterSeconds.toString(),
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": retryAfterSeconds.toString(),
          },
        }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image") as File | null;

    // Validate form data using Zod schema
    const parseResult = createAvatarSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description") || null,
      avatarType: formData.get("avatarType"),
    });

    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || "Invalid request data" },
        { status: 400 }
      );
    }

    const { name, description, avatarType } = parseResult.data;

    // Validate image file
    const imageValidation = validateImageFile(image);
    if (!imageValidation.success) {
      return NextResponse.json(
        { error: imageValidation.error },
        { status: 400 }
      );
    }

    // Upload the image (image is guaranteed to be non-null after validation)
    const arrayBuffer = await image!.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const timestamp = Date.now();
    const extension = image!.name.split(".").pop() || "png";
    const filename = `avatar-${session.user.id}-${timestamp}.${extension}`;

    const uploadResult = await upload(buffer, filename, "avatars");

    // Create avatar record
    const [newAvatar] = await db
      .insert(avatars)
      .values({
        userId: session.user.id,
        name: name,
        description: description || null,
        avatarType: avatarType,
        imageUrl: uploadResult.url,
      })
      .returning();

    return NextResponse.json({ avatar: newAvatar as Avatar }, { status: 201 });
  } catch (error) {
    console.error("Error creating avatar:", error);
    return NextResponse.json(
      { error: "Failed to create avatar" },
      { status: 500 }
    );
  }
}
