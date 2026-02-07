"use client";

import { Gauge } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface RateLimitIndicatorProps {
  current: number;
  limit: number;
  remaining: number;
  resetInMs: number;
}

export function RateLimitIndicator({
  current,
  limit,
  remaining,
  resetInMs,
}: RateLimitIndicatorProps) {
  const t = useTranslations("generate");
  const usagePercent = (current / limit) * 100;
  const isWarning = usagePercent >= 80;
  const isExhausted = remaining === 0;

  const minutesUntilReset = Math.ceil(resetInMs / 60000);

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-xs px-3 py-1.5 rounded-md",
        isExhausted
          ? "bg-destructive/10 text-destructive"
          : isWarning
            ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
            : "bg-muted text-muted-foreground"
      )}
    >
      <Gauge className="h-3.5 w-3.5 shrink-0" />
      <span>
        {isExhausted
          ? t("rateLimitExhausted", { minutes: minutesUntilReset })
          : t("rateLimitStatus", { remaining, limit })}
      </span>
    </div>
  );
}
