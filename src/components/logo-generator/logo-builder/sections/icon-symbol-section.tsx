"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  iconStyleTemplates,
  symbolElementsTemplates,
} from "@/lib/data/logo-templates";
import { cn } from "@/lib/utils";
import { LogoTemplateSelector } from "../logo-template-selector";

interface IconSymbolSectionProps {
  iconStyle: string;
  symbolElements: string[];
  onIconStyleChange: (value: string) => void;
  onSymbolElementsChange: (value: string[]) => void;
}

export function IconSymbolSection({
  iconStyle,
  symbolElements,
  onIconStyleChange,
  onSymbolElementsChange,
}: IconSymbolSectionProps) {
  const t = useTranslations("logoGenerator");
  const tTemplates = useTranslations("logoTemplates");

  // Helper function to get translated template name
  const getTranslatedName = (templateId: string) => {
    try {
      const translatedName = tTemplates(`symbolElements.${templateId}.name`);
      if (translatedName !== `symbolElements.${templateId}.name`) {
        return translatedName;
      }
    } catch {
      // Translation not found
    }
    const template = symbolElementsTemplates.find((t) => t.id === templateId);
    return template?.name || templateId;
  };

  // Toggle a symbol element selection
  const toggleSymbolElement = (elementId: string) => {
    if (symbolElements.includes(elementId)) {
      onSymbolElementsChange(symbolElements.filter((id) => id !== elementId));
    } else {
      // Limit to 3 selections
      if (symbolElements.length < 3) {
        onSymbolElementsChange([...symbolElements, elementId]);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
        {t("sections.iconSymbol")}
      </h3>

      {/* Icon Style */}
      <LogoTemplateSelector
        label={t("categories.iconStyle")}
        templates={iconStyleTemplates}
        value={iconStyle}
        onChange={onIconStyleChange}
        placeholder={t("placeholders.iconStyle")}
        category="iconStyle"
      />

      {/* Symbol Elements (Multi-select) */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t("categories.symbolElements")}
        </Label>
        <p className="text-xs text-muted-foreground">
          {t("symbolElements.hint", { max: 3 })}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {symbolElementsTemplates.map((template) => {
            const isSelected = symbolElements.includes(template.id);
            const isDisabled = !isSelected && symbolElements.length >= 3;

            return (
              <Button
                key={template.id}
                variant="outline"
                size="sm"
                onClick={() => toggleSymbolElement(template.id)}
                disabled={isDisabled}
                className={cn(
                  "justify-start h-auto py-2 px-3",
                  isSelected && "border-primary bg-primary/5"
                )}
              >
                <div className="flex items-center gap-2 w-full">
                  <div
                    className={cn(
                      "h-4 w-4 rounded flex items-center justify-center shrink-0",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "border border-muted-foreground/30"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  <span className="text-xs truncate">
                    {getTranslatedName(template.id)}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
        {symbolElements.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {t("symbolElements.selected", { count: symbolElements.length })}
          </p>
        )}
      </div>
    </div>
  );
}
