"use client";

import { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BannerRefineInputProps {
  onRefine: (instruction: string) => Promise<void>;
  isRefining: boolean;
  disabled?: boolean;
}

const BANNER_SUGGESTION_KEYS = [
  "moreContrast",
  "brighterColors",
  "largerText",
  "prominentCta",
  "cleanerLayout",
  "moreProfessional",
  "addGradient",
  "minimalistStyle",
] as const;

export function BannerRefineInput({
  onRefine,
  isRefining,
  disabled = false,
}: BannerRefineInputProps) {
  const t = useTranslations("bannerGenerator.results");
  const [instruction, setInstruction] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isRefining || disabled) return;

    await onRefine(instruction.trim());
    setInstruction("");
  };

  const handleSuggestionClick = (suggestionKey: string) => {
    const suggestion = t(`suggestions.${suggestionKey}`);
    setInstruction(suggestion);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="banner-refine-instruction" className="text-sm font-medium">
          {t("refineTitle")}
        </Label>
        <p className="text-xs text-muted-foreground mt-1">{t("refineDescription")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          id="banner-refine-instruction"
          placeholder={t("refinePlaceholder")}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          disabled={isRefining || disabled}
          className="min-h-20 resize-none"
        />

        <div className="flex flex-wrap gap-2">
          {BANNER_SUGGESTION_KEYS.slice(0, 4).map((key) => (
            <Button
              key={key}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick(key)}
              disabled={isRefining || disabled}
              className="text-xs"
            >
              {t(`suggestions.${key}`)}
            </Button>
          ))}
        </div>

        <Button
          type="submit"
          disabled={!instruction.trim() || isRefining || disabled}
          className="w-full"
        >
          {isRefining ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t("refining")}
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              {t("refineButton")}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
