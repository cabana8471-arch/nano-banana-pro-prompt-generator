import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "References",
  description: "Manage style, composition, and color reference images for AI generation.",
};

export default function ReferencesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
