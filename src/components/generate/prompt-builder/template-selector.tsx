"use client";

import { useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Template } from "@/lib/types/generation";
import { TemplateSelectorModal } from "./template-selector-modal";

type TemplateCategory = "style" | "lighting" | "camera" | "location" | "pose" | "action" | "clothing" | "expression";

interface TemplateSelectorProps {
  label: string;
  templates: Template[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowCustom?: boolean;
  category?: TemplateCategory;
}

export function TemplateSelector({
  label,
  templates,
  value,
  onChange,
  placeholder = "Select an option...",
  allowCustom = true,
  category,
}: TemplateSelectorProps) {
  const t = useTranslations("templateSelector");
  const tTemplates = useTranslations("templates");
  const [open, setOpen] = useState(false);

  // Helper function to get translated template name
  const getTranslatedName = (template: Template) => {
    if (category) {
      try {
        const translatedName = tTemplates(`${category}.${template.id}.name`);
        // Check if translation exists (next-intl returns the key if not found)
        if (translatedName !== `${category}.${template.id}.name`) {
          return translatedName;
        }
      } catch {
        // Translation not found, use default
      }
    }
    return template.name;
  };

  // Find the selected template
  const selectedTemplate = templates.find((t) => t.id === value);
  const displayValue = selectedTemplate ? getTranslatedName(selectedTemplate) : value || "";
  const isCustomValue = value && !selectedTemplate;

  const handleSelect = (template: Template) => {
    onChange(template.id);
  };

  const handleCustomChange = (customValue: string) => {
    onChange(customValue);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  // Map label to translation key for modal title
  const getModalTitle = (label: string) => {
    const labelMap: Record<string, string> = {
      "Style": t("selectStyle"),
      "Stil": t("selectStyle"),
      "Location": t("selectLocation"),
      "Locatie": t("selectLocation"),
      "Lighting": t("selectLighting"),
      "Iluminare": t("selectLighting"),
      "Camera / Composition": t("selectCamera"),
      "Camera / Compozitie": t("selectCamera"),
    };
    return labelMap[label] || label;
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 justify-between h-10 px-3 font-normal"
          onClick={() => setOpen(true)}
        >
          <span className={displayValue ? "text-foreground" : "text-muted-foreground"}>
            {displayValue || placeholder}
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </Button>
        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="shrink-0"
            aria-label={t("clearSelection")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {isCustomValue && (
        <p className="text-xs text-muted-foreground">{t("customLabel", { value })}</p>
      )}

      <TemplateSelectorModal
        open={open}
        onOpenChange={setOpen}
        title={getModalTitle(label)}
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
