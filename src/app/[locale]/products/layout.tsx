import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your product images for AI banner generation.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
