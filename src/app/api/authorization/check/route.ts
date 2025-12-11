import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  isAdminEmail,
  getUserAuthorizationStatus,
  authorizeUserViaAllowlist,
} from "@/lib/authorization";

/**
 * GET /api/authorization/check
 * Check the current user's authorization status
 *
 * Returns:
 * - authorized: boolean - whether the user is authorized to access the app
 * - isAdmin: boolean - whether the user is an admin (bypasses authorization)
 * - authorizedVia: "admin" | "allowlist" | "invitation_code" | null - how the user was authorized
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = session;
    const userEmail = user.email;

    // Check if user is admin
    const isAdmin = isAdminEmail(userEmail);
    if (isAdmin) {
      return NextResponse.json({
        authorized: true,
        isAdmin: true,
        authorizedVia: "admin",
      });
    }

    // Try to auto-authorize via allowlist
    const wasAuthorizedViaAllowlist = await authorizeUserViaAllowlist(user.id);
    if (wasAuthorizedViaAllowlist) {
      return NextResponse.json({
        authorized: true,
        isAdmin: false,
        authorizedVia: "allowlist",
      });
    }

    // Check existing authorization status
    const authStatus = await getUserAuthorizationStatus(user.id);

    if (authStatus?.isAuthorized) {
      return NextResponse.json({
        authorized: true,
        isAdmin: false,
        authorizedVia: authStatus.authorizedVia,
      });
    }

    // User is not authorized
    return NextResponse.json({
      authorized: false,
      isAdmin: false,
      authorizedVia: null,
    });
  } catch (error) {
    console.error("Authorization check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
