import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/authorization";

/**
 * GET /api/admin/check
 * Check if the current user is an admin
 * Used by client-side navigation to show/hide admin link
 *
 * Response:
 * - { isAdmin: boolean }
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return NextResponse.json({ isAdmin: false });
    }

    const isAdmin = isAdminEmail(session.user.email);

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("Admin check error:", error);
    return NextResponse.json({ isAdmin: false });
  }
}
