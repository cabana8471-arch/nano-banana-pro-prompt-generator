import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import {
  getAllBlockedIps,
  blockIp,
  setIpBlockActive,
  unblockIp,
} from "@/lib/authorization";
import { requireAdmin } from "@/lib/require-admin";
import type { IpType } from "@/lib/types/admin";

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
    return handleApiError(error, "fetching blocked IPs");
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
    return handleApiError(error, "blocking IP");
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
    return handleApiError(error, "updating IP block");
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
    return handleApiError(error, "unblocking IP");
  }
}
