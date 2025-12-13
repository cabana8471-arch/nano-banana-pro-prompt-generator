"use client";

import { useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { BannerTemplate, BannerSizeTemplate, BannerTemplateCategory } from "@/lib/types/banner";
import { BannerTemplateSelectorModal } from "./banner-template-selector-modal";

interface BannerTemplateSelectorProps {
  label: string;
  templates: BannerTemplate[] | BannerSizeTemplate[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowCustom?: boolean;
  category: BannerTemplateCategory;
  description?: string;
}

export function BannerTemplateSelector({
  label,
  templates,
  value,
  onChange,
  placeholder,
  allowCustom = false,
  category,
  description,
}: BannerTemplateSelectorProps) {
  const t = useTranslations("bannerGenerator");
  const tTemplates = useTranslations("bannerTemplates");
  const [open, setOpen] = useState(false);

  // Typography categories that share the same templates as typographyStyle
  const typographyCategories = ["headlineTypography", "bodyTypography", "ctaTypography"];

  // Helper function to get translated template name
  const getTranslatedName = (template: BannerTemplate) => {
    // For typography categories (headline, body, CTA), use typographyStyle translations
    const translationCategory = typographyCategories.includes(category) ? "typographyStyle" : category;

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

  const handleSelect = (template: BannerTemplate) => {
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
          aria-haspopup="dialog"
          aria-expanded={open}
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
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {isCustomValue && (
        <p className="text-xs text-muted-foreground">{t("customValue")}: {value}</p>
      )}

      <BannerTemplateSelectorModal
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
