import { requireAuthorization } from "@/lib/require-authorization";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Manage your profile settings, API key, and account preferences for Nano Banana Pro.",
};

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthorization();
  return children;
}
