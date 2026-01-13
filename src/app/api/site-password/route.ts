import { NextResponse } from "next/server";
import {
  isSitePasswordEnabled,
  verifyPassword,
  setSitePasswordCookie,
} from "@/lib/site-password";
import { sitePasswordAttemptLimiter } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // Check if site password protection is enabled
    if (!isSitePasswordEnabled()) {
      return NextResponse.json(
        { error: "Site password protection is not enabled" },
        { status: 400 }
      );
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor
      ? forwardedFor.split(",")[0]?.trim() || "unknown"
      : request.headers.get("x-real-ip") || "unknown";

    const rateLimitResult = sitePasswordAttemptLimiter(clientIp);
    if (!rateLimitResult.success) {
      const retryAfterSeconds = Math.ceil(rateLimitResult.resetInMs / 1000);
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfterSeconds.toString(),
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": retryAfterSeconds.toString(),
          },
        }
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
