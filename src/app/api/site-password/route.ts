import { NextResponse } from "next/server";
import {
  isSitePasswordEnabled,
  verifyPassword,
  setSitePasswordCookie,
} from "@/lib/site-password";

export async function POST(request: Request) {
  try {
    // Check if site password protection is enabled
    if (!isSitePasswordEnabled()) {
      return NextResponse.json(
        { error: "Site password protection is not enabled" },
        { status: 400 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Verify the password
    const isValid = await verifyPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Set the verification cookie
    await setSitePasswordCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Site password verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
