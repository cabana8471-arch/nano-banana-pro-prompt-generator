"use client";

import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("brand");

  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <p>{t("name")} - {t("tagline")}</p>
      </div>
    </footer>
  );
}
