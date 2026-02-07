import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { TrashGallery } from "@/components/gallery/trash-gallery";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Trash - Nano Banana Pro",
  description: "Recently deleted images",
};

export default async function TrashPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TrashGallery />
    </div>
  );
}
