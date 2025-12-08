"use client";

import { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface LogoRefineInputProps {
  onRefine: (instruction: string) => Promise<void>;
  isRefining: boolean;
  disabled?: boolean;
}

const LOGO_SUGGESTION_KEYS = [
  "simpler",
  "bolder",
  "moreModern",
  "differentColors",
  "largerIcon",
  "betterTypography",
  "moreMinimal",
  "moreUnique",
] as const;

export function LogoRefineInput({
  onRefine,
  isRefining,
  disabled = false,
}: LogoRefineInputProps) {
  const t = useTranslations("logoGenerator.results");
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
        <Label htmlFor="logo-refine-instruction" className="text-sm font-medium">
          {t("refineTitle")}
        </Label>
        <p className="text-xs text-muted-foreground mt-1">{t("refineDescription")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          id="logo-refine-instruction"
          placeholder={t("refinePlaceholder")}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          disabled={isRefining || disabled}
          className="min-h-20 resize-none"
        />

        <div className="flex flex-wrap gap-2">
          {LOGO_SUGGESTION_KEYS.slice(0, 4).map((key) => (
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
