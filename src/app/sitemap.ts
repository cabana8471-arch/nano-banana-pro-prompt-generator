import { locales } from "@/i18n/config";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  );

  const routes = ["", "/generate", "/gallery"];
  const lastModified = new Date();

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified,
      changeFrequency: route === "" ? "monthly" : "weekly",
      priority: route === "" ? 1 : 0.8,
    }))
  );
}
