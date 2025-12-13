"use client";

import { useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { LogoTemplate, LogoTemplateCategory } from "@/lib/types/logo";
import { LogoTemplateSelectorModal } from "./logo-template-selector-modal";

interface LogoTemplateSelectorProps {
  label: string;
  templates: LogoTemplate[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowCustom?: boolean;
  category: LogoTemplateCategory;
  description?: string;
}

export function LogoTemplateSelector({
  label,
  templates,
  value,
  onChange,
  placeholder,
  allowCustom = false,
  category,
  description,
}: LogoTemplateSelectorProps) {
  const t = useTranslations("logoGenerator");
  const tTemplates = useTranslations("logoTemplates");
  const [open, setOpen] = useState(false);

  // Typography categories that share the same templates
  const typographyCategories = ["fontCategory", "typographyTreatment"];

  // Helper function to get translated template name
  const getTranslatedName = (template: LogoTemplate) => {
    const translationCategory = typographyCategories.includes(category) ? category : category;

    try {
      const translatedName = tTemplates(`${translationCategory}.${template.id}.name`);
      // Check if translation exists (next-intl returns the key if not found)
      if (translatedName !== `${translationCategory}.${template.id}.name`) {
        return translatedName;
      }
    } catch {
      // Translation not found, use default
    }
    return template.name;
  };

  // Find the selected template
  const selectedTemplate = templates.find((tmpl) => tmpl.id === value);
  const displayValue = selectedTemplate ? getTranslatedName(selectedTemplate) : value || "";
  const isCustomValue = value && !selectedTemplate;

  const handleSelect = (template: LogoTemplate) => {
    onChange(template.id);
  };

  const handleCustomChange = (customValue: string) => {
    onChange(customValue);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 justify-between h-10 px-3 font-normal"
          onClick={() => setOpen(true)}
          aria-label={`${t("selectTemplate")}: ${label}`}
        >
          <span className={displayValue ? "text-foreground truncate" : "text-muted-foreground"}>
            {displayValue || placeholder || t("selectOption")}
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </Button>
        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="shrink-0"
            aria-label={t("clear")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {isCustomValue && (
        <p className="text-xs text-muted-foreground">{t("customValue")}: {value}</p>
      )}

      <LogoTemplateSelectorModal
        open={open}
        onOpenChange={setOpen}
        title={label}
        templates={templates}
        selectedId={selectedTemplate?.id}
        onSelect={handleSelect}
        allowCustom={allowCustom}
        customValue={isCustomValue ? value : ""}
        onCustomChange={handleCustomChange}
        category={category}
      />
    </div>
  );
}
