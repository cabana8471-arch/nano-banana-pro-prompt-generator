import { requireAuthorization } from "@/lib/require-authorization";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logo Generator",
  description:
    "Create professional AI-powered logos for your brand identity with customizable styles and typography.",
};

export default async function LogoGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthorization();
  return children;
}
