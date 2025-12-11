import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { UnauthorizedClient } from "@/components/auth/unauthorized-client";
import { auth } from "@/lib/auth";
import { isAdminEmail, isUserAuthorized, authorizeUserViaAllowlist } from "@/lib/authorization";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "unauthorized" });

  return {
    title: t("pageTitle"),
    description: t("description"),
  };
}

export default async function UnauthorizedPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Check if user is authenticated
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    // Not authenticated, redirect to home
    redirect(`/${locale}`);
  }

  const { user } = session;

  // Check if user is admin (should not be on this page)
  if (isAdminEmail(user.email)) {
    redirect(`/${locale}`);
  }

  // Try to auto-authorize via allowlist
  const wasAuthorizedViaAllowlist = await authorizeUserViaAllowlist(user.id);
  if (wasAuthorizedViaAllowlist) {
    redirect(`/${locale}`);
  }

  // Check if already authorized
  const isAuthorized = await isUserAuthorized(user.id);
  if (isAuthorized) {
    redirect(`/${locale}`);
  }

  // User is authenticated but not authorized
  return (
    <UnauthorizedClient
      userEmail={user.email}
      userName={user.name}
    />
  );
}
