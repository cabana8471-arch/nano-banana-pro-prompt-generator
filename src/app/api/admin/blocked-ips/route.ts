import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  isAdminEmail,
  getAllBlockedIps,
  blockIp,
  setIpBlockActive,
  unblockIp,
} from "@/lib/authorization";
import type { IpType } from "@/lib/types/admin";

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
 * GET /api/admin/blocked-ips
 * List all blocked IPs (admin only)
 */
export async function GET() {
  try {
    const { error, status } = await requireAdmin();
    if (error) {
      return NextResponse.json({ error }, { status: status! });
    }

    const blockedIps = await getAllBlockedIps();

    return NextResponse.json({ blockedIps });
  } catch (error) {
    console.error("Admin blocked-ips GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/blocked-ips
 * Block an IP address (admin only)
 *
 * Body: {
 *   ipAddress: string,
 *   ipType?: "single" | "range" (default: "single"),
 *   reason?: string,
 *   expiresAt?: string (ISO date, optional)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { error, status, session } = await requireAdmin();
    if (error || !session) {
      return NextResponse.json({ error }, { status: status! });
    }

    const body = await request.json();
    const { ipAddress, ipType, reason, expiresAt } = body;

    // Validate ipAddress
    if (!ipAddress || typeof ipAddress !== "string") {
      return NextResponse.json(
        { error: "IP address is required" },
        { status: 400 }
      );
    }

    // Validate ipType
    const validIpTypes = ["single", "range"];
    const validatedIpType: IpType = validIpTypes.includes(ipType) ? ipType : "single";

    // Validate reason (optional)
    const validatedReason = typeof reason === "string" ? reason.trim() || undefined : undefined;

    // Validate expiresAt (optional)
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

    const options = {
      ipType: validatedIpType,
      expiresAt: validatedExpiresAt,
      ...(validatedReason && { reason: validatedReason }),
    };

    const result = await blockIp(ipAddress.trim(), session.user.id, options);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      id: result.id,
    });
  } catch (error) {
    console.error("Admin blocked-ips POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/blocked-ips
 * Activate/deactivate an IP block (admin only)
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

    // Validate id
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Blocked IP ID is required" },
        { status: 400 }
      );
    }

    // Validate isActive
    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "isActive must be a boolean" },
        { status: 400 }
      );
    }

    const result = await setIpBlockActive(id, isActive);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin blocked-ips PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/blocked-ips
 * Remove an IP block (admin only)
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

    // Validate id
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Blocked IP ID is required" },
        { status: 400 }
      );
    }

    const result = await unblockIp(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin blocked-ips DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
