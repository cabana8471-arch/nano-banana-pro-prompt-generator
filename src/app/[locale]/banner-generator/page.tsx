"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function BannerGeneratorPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();

  // Auth check - loading state
  if (sessionPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!session) {
    router.push("/");
    return null;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Placeholder - Banner Builder will be implemented in Phase 3-4 */}
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Banner Generator</h1>
        <p className="text-muted-foreground">
          Create professional web banners for Google Ads, Facebook, Instagram, and websites.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Coming soon - Phase 3-4 implementation
        </p>
      </div>
    </div>
  );
}
