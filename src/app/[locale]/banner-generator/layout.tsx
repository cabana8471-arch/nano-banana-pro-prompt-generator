import { requireAuthorization } from "@/lib/require-authorization";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banner Generator",
  description:
    "Create professional web banners for Google Ads, Facebook, Instagram, and websites with AI-powered generation.",
};

export default async function BannerGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthorization();
  return children;
}
