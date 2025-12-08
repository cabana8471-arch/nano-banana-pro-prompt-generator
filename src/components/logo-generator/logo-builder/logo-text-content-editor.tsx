"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import type { LogoTextContent, LogoCharacterLimits } from "@/lib/types/logo";
import { cn } from "@/lib/utils";

interface LogoTextContentEditorProps {
  textContent: LogoTextContent;
  characterLimits: LogoCharacterLimits;
  onCompanyNameChange: (value: string) => void;
  onTaglineChange: (value: string) => void;
  onAbbreviationChange: (value: string) => void;
  isOverLimit: (field: keyof LogoTextContent, value: string) => boolean;
  getPercentageUsed: (field: keyof LogoTextContent, value: string) => number;
}

export function LogoTextContentEditor({
  textContent,
  characterLimits,
  onCompanyNameChange,
  onTaglineChange,
  onAbbreviationChange,
  isOverLimit,
  getPercentageUsed,
}: LogoTextContentEditorProps) {
  const t = useTranslations("logoGenerator");

  const fields: {
    key: keyof LogoTextContent;
    label: string;
    placeholder: string;
    onChange: (value: string) => void;
    value: string;
    limit: number;
    required?: boolean;
  }[] = [
    {
      key: "companyName",
      label: t("textContent.companyName"),
      placeholder: t("placeholders.companyName"),
      onChange: onCompanyNameChange,
      value: textContent.companyName,
      limit: characterLimits.companyName,
      required: true,
    },
    {
      key: "tagline",
      label: t("textContent.tagline"),
      placeholder: t("placeholders.tagline"),
      onChange: onTaglineChange,
      value: textContent.tagline,
      limit: characterLimits.tagline,
    },
    {
      key: "abbreviation",
      label: t("textContent.abbreviation"),
      placeholder: t("placeholders.abbreviation"),
      onChange: onAbbreviationChange,
      value: textContent.abbreviation,
      limit: characterLimits.abbreviation,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
        {t("sections.textContent")}
      </h3>

      {fields.map((field) => {
        const overLimit = isOverLimit(field.key, field.value);
        const percentUsed = getPercentageUsed(field.key, field.value);
        const charCount = field.value.length;

        return (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </Label>
              <span
                className={cn(
                  "text-xs",
                  overLimit
                    ? "text-destructive font-medium"
                    : "text-muted-foreground"
                )}
              >
                {charCount}/{field.limit}
              </span>
            </div>
            <Input
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder={field.placeholder}
              className={cn(overLimit && "border-destructive")}
              maxLength={field.limit + 10} // Allow slight overflow for user to see
            />
            <Progress
              value={Math.min(percentUsed, 100)}
              className={cn("h-1", overLimit && "[&>div]:bg-destructive")}
            />
            {overLimit && (
              <p className="text-xs text-destructive">
                {t("validation.characterLimit", { limit: field.limit })}
              </p>
            )}
          </div>
        );
      })}

      <p className="text-xs text-muted-foreground">
        {t("textContent.hint")}
      </p>
    </div>
  );
}
