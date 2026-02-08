import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, count } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { imageTags } from "@/lib/schema";
import { createTagSchema } from "@/lib/validations";

const MAX_TAGS_PER_USER = 100;

/**
 * GET /api/tags
 * List all tags for the authenticated user
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tags = await db
      .select()
      .from(imageTags)
      .where(eq(imageTags.userId, session.user.id))
      .orderBy(imageTags.name);

    return NextResponse.json({ tags });
  } catch (error) {
    return handleApiError(error, "fetching tags");
  }
}

/**
 * POST /api/tags
 * Create a new tag for the authenticated user
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createTagSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    // Enforce maximum tags per user
    const [tagCount] = await db
      .select({ count: count() })
      .from(imageTags)
      .where(eq(imageTags.userId, session.user.id));

    if ((tagCount?.count || 0) >= MAX_TAGS_PER_USER) {
      return NextResponse.json(
        { error: `Maximum ${MAX_TAGS_PER_USER} tags reached` },
        { status: 400 }
      );
    }

    const [tag] = await db
      .insert(imageTags)
      .values({
        userId: session.user.id,
        name: parsed.data.name,
        color: parsed.data.color,
      })
      .returning();

    return NextResponse.json({ tag }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "creating tag");
  }
}
