import { locales } from "@/i18n/config";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const localizedDisallow = locales.flatMap((locale) => [
    `/${locale}/generate/`,
    `/${locale}/gallery/`,
    `/${locale}/avatars/`,
    `/${locale}/profile/`,
  ]);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", ...localizedDisallow],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
