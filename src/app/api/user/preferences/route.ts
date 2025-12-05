import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userPreferences } from "@/lib/schema";
import { userPreferencesSchema } from "@/lib/validations";

/**
 * GET /api/user/preferences
 * Get the user's preferences
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences = await db
      .select({ language: userPreferences.language })
      .from(userPreferences)
      .where(eq(userPreferences.userId, session.user.id))
      .limit(1);

    const userPref = preferences[0];
    if (!userPref) {
      // Return default preferences if none exist
      return NextResponse.json({
        language: "en",
      });
    }

    return NextResponse.json({
      language: userPref.language,
    });
  } catch (error) {
    console.error("Error getting preferences:", error);
    return NextResponse.json(
      { error: "Failed to get preferences" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/preferences
 * Create or update the user's preferences
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body using Zod schema
    const parseResult = userPreferencesSchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || "Invalid request data" },
        { status: 400 }
      );
    }

    const { language } = parseResult.data;

    // Check if preferences exist
    const existingPrefs = await db
      .select({ id: userPreferences.id })
      .from(userPreferences)
      .where(eq(userPreferences.userId, session.user.id))
      .limit(1);

    if (existingPrefs.length > 0) {
      // Update existing preferences
      await db
        .update(userPreferences)
        .set({
          language: language || "en",
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, session.user.id));
    } else {
      // Insert new preferences
      await db.insert(userPreferences).values({
        userId: session.user.id,
        language: language || "en",
      });
    }

    return NextResponse.json({
      success: true,
      language: language || "en",
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 }
    );
  }
}
