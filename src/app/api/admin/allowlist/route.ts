import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import {
  getAllAllowedEmails,
  addEmailToAllowlist,
  removeEmailFromAllowlist,
} from "@/lib/authorization";
import { requireAdmin } from "@/lib/require-admin";

/**
 * GET /api/admin/allowlist
 * List all allowed emails (admin only)
 */
export async function GET() {
  try {
    const { error, status } = await requireAdmin();
    if (error) {
      return NextResponse.json({ error }, { status: status! });
    }

    const emails = await getAllAllowedEmails();

    return NextResponse.json({ emails });
  } catch (error) {
    return handleApiError(error, "fetching allowlist");
  }
}

/**
 * POST /api/admin/allowlist
 * Add email to allowlist (admin only)
 *
 * Body: { email: string, note?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { error, status, session } = await requireAdmin();
    if (error || !session) {
      return NextResponse.json({ error }, { status: status! });
    }

    const body = await request.json();
    const { email, note } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const result = await addEmailToAllowlist(
      email,
      session.user.id,
      typeof note === "string" ? note : undefined
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "adding to allowlist");
  }
}

/**
 * DELETE /api/admin/allowlist
 * Remove email from allowlist (admin only)
 *
 * Body: { id: string }
 */
export async function DELETE(request: NextRequest) {
  try {
    const { error, status } = await requireAdmin();
    if (error) {
      return NextResponse.json({ error }, { status: status! });
    }

    const body = await request.json();
    const { id } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Email ID is required" },
        { status: 400 }
      );
    }

    const result = await removeEmailFromAllowlist(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "removing from allowlist");
  }
}
