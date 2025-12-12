import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminEmail, getUserLoginHistory } from "@/lib/authorization";

/**
 * Helper to check if the current user is an admin
 */
async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return { error: "Unauthorized", status: 401, session: null };
  }

  const isAdmin = isAdminEmail(session.user.email);
  if (!isAdmin) {
    return { error: "Forbidden: Admin access required", status: 403, session: null };
  }

  return { error: null, status: null, session };
}

/**
 * GET /api/admin/login-history
 * Get login history for a user (admin only)
 *
 * Query params:
 * - userId: string (required)
 * - page: number (default: 1)
 * - pageSize: number (default: 20)
 */
export async function GET(request: NextRequest) {
  try {
    const { error, status } = await requireAdmin();
    if (error) {
      return NextResponse.json({ error }, { status: status! });
    }

    const { searchParams } = new URL(request.url);

    // Validate userId
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "userId query parameter is required" },
        { status: 400 }
      );
    }

    // Parse pagination params
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)));

    const result = await getUserLoginHistory(userId, { page, pageSize });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin login-history GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
