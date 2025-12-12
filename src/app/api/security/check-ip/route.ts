import { NextRequest, NextResponse } from "next/server";
import { isIpBlocked } from "@/lib/authorization";

/**
 * GET /api/security/check-ip
 * Check if an IP address is blocked
 * Used by middleware for IP blocking (Layer 0)
 *
 * Query params:
 * - ip: string (required) - The IP address to check
 *
 * Response:
 * - { isBlocked: boolean, reason?: string }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get("ip");

    if (!ip) {
      return NextResponse.json(
        { error: "IP address is required" },
        { status: 400 }
      );
    }

    const result = await isIpBlocked(ip);

    return NextResponse.json({
      isBlocked: result.isBlocked,
      ...(result.reason && { reason: result.reason }),
    });
  } catch (error) {
    console.error("Security check-ip error:", error);
    // On error, allow access to prevent blocking legitimate users
    return NextResponse.json({ isBlocked: false });
  }
}
