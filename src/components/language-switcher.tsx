"use client";

import { useState, useTransition } from "react";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { useRouter, usePathname } from "@/i18n/routing";

export function LanguageSwitcher() {
  const t = useTranslations("profile.language");
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [selectedLocale, setSelectedLocale] = useState<Locale>(currentLocale);

  const handleLanguageChange = async (newLocale: Locale) => {
    setSelectedLocale(newLocale);

    // Save preference to API
    try {
      const response = await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: newLocale }),
      });

      if (!response.ok) {
        throw new Error("Failed to save preference");
      }

      // Navigate to the new locale
      startTransition(() => {
        router.replace(pathname, { locale: newLocale });
      });

      toast.success(
        newLocale === "ro"
          ? "Limba a fost schimbata cu succes"
          : "Language changed successfully"
      );
    } catch {
      toast.error(
        currentLocale === "ro"
          ? "Eroare la salvarea preferintei"
          : "Failed to save language preference"
      );
      setSelectedLocale(currentLocale);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          {t("title")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Select
            value={selectedLocale}
            onValueChange={(value) => handleLanguageChange(value as Locale)}
            disabled={isPending}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {locales.map((locale) => (
                <SelectItem key={locale} value={locale}>
                  {localeNames[locale]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isPending && (
            <span className="text-sm text-muted-foreground">
              {currentLocale === "ro" ? "Se schimba..." : "Changing..."}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
