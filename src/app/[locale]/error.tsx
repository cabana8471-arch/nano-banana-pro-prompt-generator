"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");
  const tCommon = useTranslations("common");

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-16 w-16 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-4">{t("somethingWentWrong")}</h1>
        <p className="text-muted-foreground mb-6">
          {t("unexpectedError")}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground mb-4">
            {t("errorId", { id: error.digest })}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>{tCommon("tryAgain")}</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            {tCommon("goHome")}
          </Button>
        </div>
      </div>
    </div>
  );
}
