"use client";

import Link from "next/link";
import { AlertCircle, XCircle, RefreshCw, Key, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface GenerationErrorAlertProps {
  error: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

type ErrorInfoResult = {
  titleKey: string;
  messageKey: string;
  action?: "api-key" | "retry" | "quota" | "none";
  fallbackMessage?: string;
};

// Error type detection - returns translation keys
function getErrorInfo(error: string): ErrorInfoResult {
  const errorLower = error.toLowerCase();

  // API Key errors
  if (
    errorLower.includes("api key") ||
    errorLower.includes("invalid key") ||
    errorLower.includes("unauthorized") ||
    errorLower.includes("authentication")
  ) {
    return {
      titleKey: "invalidApiKey",
      messageKey: "invalidApiKeyMessage",
      action: "api-key",
    };
  }

  // Rate limit errors
  if (
    errorLower.includes("rate limit") ||
    errorLower.includes("too many requests") ||
    errorLower.includes("quota exceeded") ||
    errorLower.includes("429")
  ) {
    return {
      titleKey: "rateLimitExceeded",
      messageKey: "rateLimitExceededMessage",
      action: "retry",
    };
  }

  // Quota errors
  if (errorLower.includes("quota") || errorLower.includes("billing")) {
    return {
      titleKey: "apiQuotaExceeded",
      messageKey: "apiQuotaExceededMessage",
      action: "quota",
    };
  }

  // Content policy errors
  if (
    errorLower.includes("content policy") ||
    errorLower.includes("safety") ||
    errorLower.includes("blocked") ||
    errorLower.includes("harmful")
  ) {
    return {
      titleKey: "contentPolicyViolation",
      messageKey: "contentPolicyViolationMessage",
      action: "none",
    };
  }

  // Network errors
  if (
    errorLower.includes("network") ||
    errorLower.includes("timeout") ||
    errorLower.includes("connection")
  ) {
    return {
      titleKey: "connectionError",
      messageKey: "connectionErrorMessage",
      action: "retry",
    };
  }

  // Default error
  return {
    titleKey: "generationFailed",
    messageKey: "generationFailedMessage",
    action: "retry",
    fallbackMessage: error,
  };
}

export function GenerationErrorAlert({
  error,
  onDismiss,
  onRetry,
}: GenerationErrorAlertProps) {
  const t = useTranslations("errors");
  const tCommon = useTranslations("common");
  const { titleKey, messageKey, action, fallbackMessage } = getErrorInfo(error);

  const title = t(titleKey);
  const message = fallbackMessage || t(messageKey);

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="flex items-center justify-between">
        {title}
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0 hover:bg-destructive/20"
          >
            <XCircle className="h-4 w-4" />
            <span className="sr-only">{t("dismiss")}</span>
          </Button>
        )}
      </AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <span>{message}</span>
        <div className="flex flex-wrap gap-2">
          {action === "api-key" && (
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/profile">
                <Key className="h-4 w-4" />
                {t("checkApiKey")}
              </Link>
            </Button>
          )}
          {action === "retry" && onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              {tCommon("tryAgain")}
            </Button>
          )}
          {action === "quota" && (
            <Button asChild variant="outline" size="sm" className="gap-2">
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                {t("googleCloudConsole")}
              </a>
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
