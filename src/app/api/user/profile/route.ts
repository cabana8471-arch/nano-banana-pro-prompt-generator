import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import { updateProfileSchema } from "@/lib/validations";

/**
 * PATCH /api/user/profile
 * Update the user's profile (name)
 */
export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = updateProfileSchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || "Invalid request data" },
        { status: 400 }
      );
    }

    const { name } = parseResult.data;

    await db
      .update(user)
      .set({ name })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({ success: true, name });
  } catch (error) {
    return handleApiError(error, "updating profile");
  }
}
