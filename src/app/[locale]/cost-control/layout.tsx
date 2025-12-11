import { requireAuthorization } from "@/lib/require-authorization";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cost Control",
  description:
    "Monitor API costs, track usage, and manage budget settings for your AI generations.",
};

export default async function CostControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthorization();
  return children;
}
