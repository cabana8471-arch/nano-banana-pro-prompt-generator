import { requireAuthorization } from "@/lib/require-authorization";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generate",
  description:
    "Create AI-generated images with Nano Banana Pro. Use the prompt builder to craft the perfect image.",
};

export default async function GenerateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthorization();
  return children;
}
