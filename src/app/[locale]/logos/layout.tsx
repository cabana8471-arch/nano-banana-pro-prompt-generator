import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logos",
  description: "Manage your brand logos for AI banner generation.",
};

export default function LogosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
