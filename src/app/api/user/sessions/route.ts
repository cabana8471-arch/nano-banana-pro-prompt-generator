import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and, ne, gt } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { session as sessionTable } from "@/lib/schema";

/**
 * GET /api/user/sessions
 * Get the user's active sessions
 */
export async function GET() {
  try {
    const currentSession = await auth.api.getSession({ headers: await headers() });
    if (!currentSession?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await db
      .select({
        id: sessionTable.id,
        createdAt: sessionTable.createdAt,
        expiresAt: sessionTable.expiresAt,
        ipAddress: sessionTable.ipAddress,
        userAgent: sessionTable.userAgent,
      })
      .from(sessionTable)
      .where(
        and(
          eq(sessionTable.userId, currentSession.user.id),
          gt(sessionTable.expiresAt, new Date())
        )
      );

    return NextResponse.json({
      sessions: sessions.map((s) => ({
        ...s,
        isCurrent: s.id === currentSession.session.id,
      })),
    });
  } catch (error) {
    return handleApiError(error, "getting sessions");
  }
}

/**
 * DELETE /api/user/sessions
 * Revoke all other sessions (keep current)
 */
export async function DELETE() {
  try {
    const currentSession = await auth.api.getSession({ headers: await headers() });
    if (!currentSession?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db
      .delete(sessionTable)
      .where(
        and(
          eq(sessionTable.userId, currentSession.user.id),
          ne(sessionTable.id, currentSession.session.id)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "revoking sessions");
  }
}
