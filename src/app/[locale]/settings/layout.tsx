import { requireAdmin } from "@/lib/require-authorization";

type Props = {
  children: React.ReactNode;
};

export default async function SettingsLayout({ children }: Props) {
  // Protect entire settings section - only admins can access
  await requireAdmin();

  return <>{children}</>;
}
