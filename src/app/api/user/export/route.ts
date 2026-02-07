import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  generations,
  generatedImages,
  avatars,
  presets,
  bannerPresets,
  logoPresets,
  userPreferences,
} from "@/lib/schema";

/**
 * GET /api/user/export
 * Export all user data as JSON for backup/portability.
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch all user data in parallel
    const [
      userGenerations,
      userImages,
      userAvatars,
      userPresets,
      userBannerPresets,
      userLogoPresets,
      userPrefs,
    ] = await Promise.all([
      db.select().from(generations).where(eq(generations.userId, userId)),
      db
        .select({
          id: generatedImages.id,
          generationId: generatedImages.generationId,
          imageUrl: generatedImages.imageUrl,
          isPublic: generatedImages.isPublic,
          createdAt: generatedImages.createdAt,
        })
        .from(generatedImages)
        .innerJoin(generations, eq(generatedImages.generationId, generations.id))
        .where(eq(generations.userId, userId)),
      db.select().from(avatars).where(eq(avatars.userId, userId)),
      db.select().from(presets).where(eq(presets.userId, userId)),
      db.select().from(bannerPresets).where(eq(bannerPresets.userId, userId)),
      db.select().from(logoPresets).where(eq(logoPresets.userId, userId)),
      db.select().from(userPreferences).where(eq(userPreferences.userId, userId)),
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
      preferences: userPrefs[0] ?? null,
      avatars: userAvatars.map((a) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        avatarType: a.avatarType,
        imageUrl: a.imageUrl,
        createdAt: a.createdAt,
      })),
      presets: {
        photo: userPresets.map((p) => ({
          id: p.id,
          name: p.name,
          config: p.config,
          createdAt: p.createdAt,
        })),
        banner: userBannerPresets.map((p) => ({
          id: p.id,
          name: p.name,
          config: p.config,
          createdAt: p.createdAt,
        })),
        logo: userLogoPresets.map((p) => ({
          id: p.id,
          name: p.name,
          config: p.config,
          createdAt: p.createdAt,
        })),
      },
      generations: userGenerations.map((gen) => {
        const genImages = userImages.filter((img) => img.generationId === gen.id);
        return {
          id: gen.id,
          prompt: gen.prompt,
          settings: gen.settings,
          status: gen.status,
          generationType: gen.generationType,
          builderConfig: gen.builderConfig,
          errorMessage: gen.errorMessage,
          createdAt: gen.createdAt,
          images: genImages.map((img) => ({
            id: img.id,
            imageUrl: img.imageUrl,
            isPublic: img.isPublic,
            createdAt: img.createdAt,
          })),
        };
      }),
      stats: {
        totalGenerations: userGenerations.length,
        totalImages: userImages.length,
        totalAvatars: userAvatars.length,
        totalPresets:
          userPresets.length + userBannerPresets.length + userLogoPresets.length,
      },
    };

    const filename = `nano-banana-export-${new Date().toISOString().split("T")[0]}.json`;

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return handleApiError(error, "exporting user data");
  }
}
