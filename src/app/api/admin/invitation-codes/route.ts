import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  isAdminEmail,
  getAllInvitationCodes,
  generateInvitationCode,
  setInvitationCodeActive,
  deleteInvitationCode,
} from "@/lib/authorization";

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
 * GET /api/admin/invitation-codes
 * List all invitation codes (admin only)
 */
export async function GET() {
  try {
    const { error, status } = await requireAdmin();
    if (error) {
      return NextResponse.json({ error }, { status: status! });
    }

    const codes = await getAllInvitationCodes();

    return NextResponse.json({ codes });
  } catch (error) {
    console.error("Admin invitation-codes GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/invitation-codes
 * Generate new invitation code (admin only)
 *
 * Body: { maxUses?: number, expiresAt?: string (ISO date) }
 */
export async function POST(request: NextRequest) {
  try {
    const { error, status, session } = await requireAdmin();
    if (error || !session) {
      return NextResponse.json({ error }, { status: status! });
    }

    const body = await request.json();
    const { maxUses, expiresAt } = body;

    // Validate maxUses
    let validatedMaxUses = 1;
    if (maxUses !== undefined) {
      if (typeof maxUses !== "number" || maxUses < 1 || maxUses > 1000) {
        return NextResponse.json(
          { error: "maxUses must be a number between 1 and 1000" },
          { status: 400 }
        );
      }
      validatedMaxUses = Math.floor(maxUses);
    }

    // Validate expiresAt
    let validatedExpiresAt: Date | null = null;
    if (expiresAt !== undefined && expiresAt !== null) {
      if (typeof expiresAt !== "string") {
        return NextResponse.json(
          { error: "expiresAt must be an ISO date string" },
          { status: 400 }
        );
      }
      const parsedDate = new Date(expiresAt);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid expiresAt date format" },
          { status: 400 }
        );
      }
      if (parsedDate <= new Date()) {
        return NextResponse.json(
          { error: "expiresAt must be in the future" },
          { status: 400 }
        );
      }
      validatedExpiresAt = parsedDate;
    }

    const result = await generateInvitationCode(session.user.id, {
      maxUses: validatedMaxUses,
      expiresAt: validatedExpiresAt,
    });

    return NextResponse.json({
      success: true,
      code: result.code,
      id: result.id,
      maxUses: result.maxUses,
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    console.error("Admin invitation-codes POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/invitation-codes
 * Activate/deactivate an invitation code (admin only)
 *
 * Body: { id: string, isActive: boolean }
 */
export async function PATCH(request: NextRequest) {
  try {
    const { error, status } = await requireAdmin();
    if (error) {
      return NextResponse.json({ error }, { status: status! });
    }

    const body = await request.json();
    const { id, isActive } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Code ID is required" },
        { status: 400 }
      );
    }

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "isActive must be a boolean" },
        { status: 400 }
      );
    }

    const result = await setInvitationCodeActive(id, isActive);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin invitation-codes PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/invitation-codes
 * Delete an invitation code (admin only)
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
        { error: "Code ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteInvitationCode(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin invitation-codes DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
