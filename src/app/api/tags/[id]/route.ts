import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { imageTags } from "@/lib/schema";
import { updateTagSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PUT /api/tags/[id]
 * Update an existing tag (name and/or color)
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateTagSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    // Verify ownership
    const [existing] = await db
      .select()
      .from(imageTags)
      .where(and(eq(imageTags.id, id), eq(imageTags.userId, session.user.id)))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // Build the update object only with provided fields
    const updateData: Partial<{ name: string; color: string }> = {};
    if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
    if (parsed.data.color !== undefined) updateData.color = parsed.data.color;

    const [updated] = await db
      .update(imageTags)
      .set(updateData)
      .where(eq(imageTags.id, id))
      .returning();

    return NextResponse.json({ tag: updated });
  } catch (error) {
    return handleApiError(error, "updating tag");
  }
}

/**
 * DELETE /api/tags/[id]
 * Delete a tag (cascades to all assignments)
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const [existing] = await db
      .select()
      .from(imageTags)
      .where(and(eq(imageTags.id, id), eq(imageTags.userId, session.user.id)))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    await db.delete(imageTags).where(eq(imageTags.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "deleting tag");
  }
}
