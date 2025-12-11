import { requireAuthorization } from "@/lib/require-authorization";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "References",
  description:
    "Manage style, composition, and color reference images for AI generation.",
};

export default async function ReferencesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthorization();
  return children;
}
