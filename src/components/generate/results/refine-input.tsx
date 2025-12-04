"use client";

import { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RefineInputProps {
  onRefine: (instruction: string) => Promise<void>;
  isRefining: boolean;
  disabled?: boolean;
}

const SUGGESTION_KEYS = [
  "dramaticLighting",
  "vibrantColors",
  "detailedBackground",
  "happierExpression",
  "depthShadows",
  "dynamicComposition",
  "increaseContrast",
  "warmTone",
] as const;

export function RefineInput({ onRefine, isRefining, disabled = false }: RefineInputProps) {
  const t = useTranslations("results");
  const [instruction, setInstruction] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isRefining || disabled) return;

    await onRefine(instruction.trim());
    setInstruction("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInstruction(suggestion);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="refine-instruction" className="text-sm font-medium">
          {t("refineTitle")}
        </Label>
        <p className="text-xs text-muted-foreground mt-1">
          {t("refineDescription")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          id="refine-instruction"
          placeholder={t("refinePlaceholder")}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          disabled={isRefining || disabled}
          className="min-h-20 resize-none"
        />

        <div className="flex flex-wrap gap-2">
          {SUGGESTION_KEYS.slice(0, 4).map((key) => {
            const suggestion = t(`suggestions.${key}`);
            return (
              <Button
                key={key}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isRefining || disabled}
                className="text-xs"
              >
                {suggestion}
              </Button>
            );
          })}
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
