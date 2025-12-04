import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { locales, type Locale } from "@/i18n/config";
import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const messages = await getMessages();
  const metadata = messages.metadata as { title: string; description: string };

  return {
    title: {
      default: metadata.title,
      template: `%s | Nano Banana Pro`,
    },
    description: metadata.description,
    openGraph: {
      type: "website",
      locale: locale === "ro" ? "ro_RO" : "en_US",
      siteName: "Nano Banana Pro",
      title: metadata.title,
      description: metadata.description,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </NextIntlClientProvider>
  );
}
