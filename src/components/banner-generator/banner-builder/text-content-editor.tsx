"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import type { BannerTextContent, CharacterLimits } from "@/lib/types/banner";
import { cn } from "@/lib/utils";

interface TextContentEditorProps {
  textContent: BannerTextContent;
  characterLimits: CharacterLimits;
  onHeadlineChange: (value: string) => void;
  onSubheadlineChange: (value: string) => void;
  onCtaTextChange: (value: string) => void;
  onTaglineChange: (value: string) => void;
  isOverLimit: {
    headline: boolean;
    subheadline: boolean;
    ctaText: boolean;
    tagline: boolean;
  };
  getPercentageUsed: (field: keyof BannerTextContent) => number;
}

interface TextFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  limit: number;
  isOverLimit: boolean;
  percentageUsed: number;
  hint?: string;
}

function TextField({
  label,
  placeholder,
  value,
  onChange,
  limit,
  isOverLimit,
  percentageUsed,
  hint,
}: TextFieldProps) {
  const t = useTranslations("bannerGenerator");

  // Don't show limit indicator if limit is 0 (unlimited)
  const showLimit = limit > 0;
  const charCount = value.length;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {showLimit && (
          <span
            className={cn(
              "text-xs",
              isOverLimit ? "text-destructive font-medium" : "text-muted-foreground"
            )}
          >
            {charCount}/{limit}
          </span>
        )}
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(isOverLimit && "border-destructive focus-visible:ring-destructive")}
      />
      {showLimit && (
        <Progress
          value={Math.min(percentageUsed, 100)}
          className={cn("h-1", isOverLimit && "[&>div]:bg-destructive")}
        />
      )}
      {isOverLimit && (
        <div className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertTriangle className="h-3 w-3" />
          <span>{t("warnings.textTooLong")}</span>
        </div>
      )}
      {hint && !isOverLimit && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

export function TextContentEditor({
  textContent,
  characterLimits,
  onHeadlineChange,
  onSubheadlineChange,
  onCtaTextChange,
  onTaglineChange,
  isOverLimit,
  getPercentageUsed,
}: TextContentEditorProps) {
  const t = useTranslations("bannerGenerator");

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
        {t("sections.textContent")}
      </h3>

      {/* Headline */}
      <TextField
        label={t("textContent.headline")}
        placeholder={t("textContent.headlinePlaceholder")}
        value={textContent.headline}
        onChange={onHeadlineChange}
        limit={characterLimits.headline}
        isOverLimit={isOverLimit.headline}
        percentageUsed={getPercentageUsed("headline")}
        hint={t("textContent.headlineHint")}
      />

      {/* Subheadline */}
      {characterLimits.subheadline > 0 && (
        <TextField
          label={t("textContent.subheadline")}
          placeholder={t("textContent.subheadlinePlaceholder")}
          value={textContent.subheadline}
          onChange={onSubheadlineChange}
          limit={characterLimits.subheadline}
          isOverLimit={isOverLimit.subheadline}
          percentageUsed={getPercentageUsed("subheadline")}
          hint={t("textContent.subheadlineHint")}
        />
      )}

      {/* CTA Text */}
      <TextField
        label={t("textContent.ctaText")}
        placeholder={t("textContent.ctaPlaceholder")}
        value={textContent.ctaText}
        onChange={onCtaTextChange}
        limit={characterLimits.ctaText}
        isOverLimit={isOverLimit.ctaText}
        percentageUsed={getPercentageUsed("ctaText")}
        hint={t("textContent.ctaHint")}
      />

      {/* Tagline */}
      <TextField
        label={t("textContent.tagline")}
        placeholder={t("textContent.taglinePlaceholder")}
        value={textContent.tagline}
        onChange={onTaglineChange}
        limit={characterLimits.tagline}
        isOverLimit={isOverLimit.tagline}
        percentageUsed={getPercentageUsed("tagline")}
        hint={t("textContent.taglineHint")}
      />
    </div>
  );
}
