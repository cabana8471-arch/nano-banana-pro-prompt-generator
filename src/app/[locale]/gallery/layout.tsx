import { requireAuthorization } from "@/lib/require-authorization";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse and share AI-generated images with the community. Discover popular creations and get inspired.",
};

export default async function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthorization();
  return children;
}
