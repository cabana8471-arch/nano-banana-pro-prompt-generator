import { Metadata } from "next";
import { PublicGalleryClient } from "@/components/gallery/public-gallery-client";
import { requireAuthorization } from "@/lib/require-authorization";

export const metadata: Metadata = {
  title: "Public Gallery - Nano Banana Pro",
  description: "Explore AI-generated images created by our community",
};

export default async function PublicGalleryPage() {
  // Require authentication and authorization
  await requireAuthorization();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Public Gallery</h1>
        <p className="text-muted-foreground mt-2">
          Explore AI-generated images created by our community
        </p>
      </div>
      <PublicGalleryClient />
    </div>
  );
}
