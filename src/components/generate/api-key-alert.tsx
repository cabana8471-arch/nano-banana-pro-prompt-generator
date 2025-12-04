"use client";

import Link from "next/link";
import { AlertCircle, Key } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ApiKeyAlertProps {
  variant?: "warning" | "error";
  title?: string;
  message?: string;
  showSettingsLink?: boolean;
}

export function ApiKeyAlert({
  variant = "warning",
  title,
  message,
  showSettingsLink = true,
}: ApiKeyAlertProps) {
  const t = useTranslations("generate");

  const displayTitle = title ?? t("apiKeyRequired");
  const displayMessage = message ?? t("apiKeyRequiredMessage");

  return (
    <Alert variant={variant === "error" ? "destructive" : "default"} className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{displayTitle}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <span>{displayMessage}</span>
        {showSettingsLink && (
          <Button asChild variant="outline" size="sm" className="w-fit gap-2">
            <Link href="/profile">
              <Key className="h-4 w-4" />
              {t("addApiKeyInSettings")}
            </Link>
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
