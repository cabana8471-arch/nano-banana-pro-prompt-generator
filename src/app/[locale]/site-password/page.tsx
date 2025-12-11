import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SitePasswordForm } from "@/components/auth/site-password-form";
import {
  isSitePasswordEnabled,
  verifySitePasswordCookie,
} from "@/lib/site-password";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ returnUrl?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sitePassword" });

  return {
    title: t("pageTitle"),
    description: t("description"),
  };
}

export default async function SitePasswordPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { returnUrl } = await searchParams;
  setRequestLocale(locale);

  // If site password is not enabled, redirect to home
  if (!isSitePasswordEnabled()) {
    redirect(`/${locale}`);
  }

  // If already verified, redirect to return URL or home
  const isVerified = await verifySitePasswordCookie();
  if (isVerified) {
    redirect(returnUrl || `/${locale}`);
  }

  return <SitePasswordForm returnUrl={returnUrl || `/${locale}`} />;
}
