import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { peekRateLimit, IMAGE_GENERATION_RATE_CONFIG } from "@/lib/rate-limit";

/**
 * GET /api/generate/rate-limit
 * Returns the current rate limit status for the authenticated user
 * without consuming a request.
 */
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = peekRateLimit(
    "image-generation",
    IMAGE_GENERATION_RATE_CONFIG,
    session.user.id
  );

  return NextResponse.json({
    current: status.current,
    limit: status.limit,
    remaining: status.remaining,
    resetInMs: status.resetInMs,
  });
}
