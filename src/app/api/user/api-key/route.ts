import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { encrypt, getKeyHint, isValidGoogleApiKey } from "@/lib/encryption";
import { userApiKeys } from "@/lib/schema";
import { saveApiKeySchema } from "@/lib/validations";

/**
 * GET /api/user/api-key
 * Check if the user has an API key stored and return the hint
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingKey = await db
      .select({ hint: userApiKeys.hint })
      .from(userApiKeys)
      .where(eq(userApiKeys.userId, session.user.id))
      .limit(1);

    const firstKey = existingKey[0];
    if (!firstKey) {
      return NextResponse.json({ hasKey: false });
    }

    return NextResponse.json({
      hasKey: true,
      hint: firstKey.hint,
    });
  } catch (error) {
    return handleApiError(error, "checking API key status");
  }
}

/**
 * POST /api/user/api-key
 * Save or update the user's encrypted API key
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body using Zod schema
    const parseResult = saveApiKeySchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || "Invalid request data" },
        { status: 400 }
      );
    }

    const { apiKey } = parseResult.data;

    if (!isValidGoogleApiKey(apiKey)) {
      return NextResponse.json(
        { error: "Invalid API key format" },
        { status: 400 }
      );
    }

    // Encrypt the API key
    const encryptResult = encrypt(apiKey);
    if (!encryptResult) {
      return NextResponse.json(
        { error: "Encryption is not configured. Please contact the administrator." },
        { status: 500 }
      );
    }

    const { encrypted, iv } = encryptResult;
    const hint = getKeyHint(apiKey);

    // Check if user already has a key
    const existingKey = await db
      .select({ id: userApiKeys.id })
      .from(userApiKeys)
      .where(eq(userApiKeys.userId, session.user.id))
      .limit(1);

    if (existingKey.length > 0) {
      // Update existing key
      await db
        .update(userApiKeys)
        .set({
          encryptedKey: encrypted,
          iv: iv,
          hint: hint,
          updatedAt: new Date(),
        })
        .where(eq(userApiKeys.userId, session.user.id));
    } else {
      // Insert new key
      await db.insert(userApiKeys).values({
        userId: session.user.id,
        encryptedKey: encrypted,
        iv: iv,
        hint: hint,
      });
    }

    return NextResponse.json({
      success: true,
      hint: hint,
    });
  } catch (error) {
    return handleApiError(error, "saving API key");
  }
}

/**
 * DELETE /api/user/api-key
 * Remove the user's stored API key
 */
export async function DELETE() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db
      .delete(userApiKeys)
      .where(eq(userApiKeys.userId, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "deleting API key");
  }
}
