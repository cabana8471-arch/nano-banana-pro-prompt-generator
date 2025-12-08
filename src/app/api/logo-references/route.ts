import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, desc, count } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { LOGO_REFERENCE_LIMITS, RESOURCE_LIMITS } from "@/lib/constants";
import { db } from "@/lib/db";
import { logoReferenceUploadLimiter } from "@/lib/rate-limit";
import { logoReferences } from "@/lib/schema";
import { upload } from "@/lib/storage";
import type { LogoReference } from "@/lib/types/logo";
import { createLogoReferenceSchema, validateImageFile } from "@/lib/validations";

/**
 * GET /api/logo-references
 * List all logo references for the authenticated user
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userReferences = await db
      .select()
      .from(logoReferences)
      .where(eq(logoReferences.userId, session.user.id))
      .orderBy(desc(logoReferences.createdAt));

    return NextResponse.json({ logoReferences: userReferences as LogoReference[] });
  } catch (error) {
    return handleApiError(error, "fetching logo references");
  }
}

/**
 * POST /api/logo-references
 * Create a new logo reference with image upload
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check rate limit for logo reference uploads
    const rateLimitResult = logoReferenceUploadLimiter(session.user.id);
    if (!rateLimitResult.success) {
      const retryAfterSeconds = Math.ceil(rateLimitResult.resetInMs / 1000);
      return NextResponse.json(
        {
          error: `Too many uploads. Maximum ${LOGO_REFERENCE_LIMITS.UPLOADS_PER_HOUR} logo references per hour. Try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.`,
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

    // Check total logo reference limit per user
    const [referenceCount] = await db
      .select({ count: count() })
      .from(logoReferences)
      .where(eq(logoReferences.userId, session.user.id));

    if (referenceCount && referenceCount.count >= RESOURCE_LIMITS.MAX_LOGO_REFERENCES_PER_USER) {
      return NextResponse.json(
        {
          error: `Maximum ${RESOURCE_LIMITS.MAX_LOGO_REFERENCES_PER_USER} logo references allowed. Please delete some before creating new ones.`,
        },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image") as File | null;

    // Validate form data using Zod schema
    const parseResult = createLogoReferenceSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description") || null,
      referenceType: formData.get("referenceType"),
    });

    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || "Invalid request data" },
        { status: 400 }
      );
    }

    const { name, description, referenceType } = parseResult.data;

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
    const filename = `logo-ref-${session.user.id}-${timestamp}.${extension}`;

    const uploadResult = await upload(buffer, filename, "logo-references");

    // Create logo reference record
    const [newReference] = await db
      .insert(logoReferences)
      .values({
        userId: session.user.id,
        name: name,
        description: description || null,
        referenceType: referenceType,
        imageUrl: uploadResult.url,
      })
      .returning();

    return NextResponse.json({ logoReference: newReference as LogoReference }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "creating logo reference");
  }
}
