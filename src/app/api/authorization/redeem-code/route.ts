import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { redeemInvitationCode } from "@/lib/authorization";

/**
 * POST /api/authorization/redeem-code
 * Redeem an invitation code for the current user
 *
 * Request body:
 * - code: string - the 8-character invitation code
 *
 * Returns:
 * - success: boolean - whether the code was successfully redeemed
 * - error?: string - error message if redemption failed
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    const { code } = body;

    // Validate the code format
    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, error: "Invitation code is required" },
        { status: 400 }
      );
    }

    // Remove any spaces or dashes from the code
    const cleanedCode = code.replace(/[\s-]/g, "").toUpperCase();

    // Validate code length (8 characters)
    if (cleanedCode.length !== 8) {
      return NextResponse.json(
        { success: false, error: "Invalid code format. Code must be 8 characters." },
        { status: 400 }
      );
    }

    // Validate code contains only allowed characters (A-Z except I and O, 2-9 except 0 and 1)
    const validCodePattern = /^[A-HJ-NP-Z2-9]{8}$/;
    if (!validCodePattern.test(cleanedCode)) {
      return NextResponse.json(
        { success: false, error: "Invalid code format. Please check the code and try again." },
        { status: 400 }
      );
    }

    // Attempt to redeem the code
    const result = await redeemInvitationCode(session.user.id, cleanedCode);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Invitation code redemption error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
