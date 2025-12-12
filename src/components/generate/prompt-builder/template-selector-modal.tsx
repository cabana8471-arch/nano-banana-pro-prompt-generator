"use client";

import { useState, useMemo } from "react";
import { Check, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Template } from "@/lib/types/generation";
import { cn } from "@/lib/utils";

type TemplateCategory = "style" | "lighting" | "camera" | "location" | "pose" | "action" | "clothing" | "expression";

interface TemplateSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  templates: Template[];
  selectedId?: string | undefined;
  onSelect: (template: Template) => void;
  allowCustom?: boolean;
  customValue?: string;
  onCustomChange?: (value: string) => void;
  category?: TemplateCategory | undefined;
}

export function TemplateSelectorModal({
  open,
  onOpenChange,
  title,
  templates,
  selectedId,
  onSelect,
  allowCustom = true,
  customValue = "",
  onCustomChange,
  category,
}: TemplateSelectorModalProps) {
  const t = useTranslations("templateSelector");
  const tCommon = useTranslations("common");
  const tTemplates = useTranslations("templates");
  const [search, setSearch] = useState("");
  const [localCustomValue, setLocalCustomValue] = useState(customValue);

  // Helper function to get translated template name and description
  const getTranslatedTemplate = (template: Template) => {
    if (category) {
      try {
        const translatedName = tTemplates(`${category}.${template.id}.name`);
        const translatedDescription = tTemplates(`${category}.${template.id}.description`);
        // Check if translation exists (next-intl returns the key if not found)
        if (translatedName !== `${category}.${template.id}.name`) {
          return {
            name: translatedName,
            description: translatedDescription !== `${category}.${template.id}.description`
              ? translatedDescription
              : template.description,
          };
        }
      } catch {
        // Translation not found, use default
      }
    }
    return {
      name: template.name,
      description: template.description,
    };
  };

  // Group templates by their category prefix (e.g., "Natural Lighting", "Studio Lighting")
  const groupedTemplates = useMemo(() => {
    const searchLower = search.toLowerCase();
    const filtered = templates.filter((template) => {
      const translated = getTranslatedTemplate(template);
      return (
        template.name.toLowerCase().includes(searchLower) ||
        template.description.toLowerCase().includes(searchLower) ||
        template.promptFragment.toLowerCase().includes(searchLower) ||
        translated.name.toLowerCase().includes(searchLower) ||
        translated.description.toLowerCase().includes(searchLower)
      );
    });
    return filtered;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates, search, category]);

  const handleSelect = (template: Template) => {
    onSelect(template);
    onOpenChange(false);
    setSearch("");
  };

  const handleCustomSubmit = () => {
    if (localCustomValue.trim() && onCustomChange) {
      onCustomChange(localCustomValue.trim());
      onOpenChange(false);
      setSearch("");
    }
  };

  const isCustomSelected = customValue && !selectedId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="px-6 py-4 border-b bg-muted/30 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchOptions", { count: templates.length })}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background"
              autoFocus
            />
            {search && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearch("")}
                aria-label={t("clearSearch")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Template Grid */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-6">
            {/* Custom Input Option */}
            {allowCustom && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  {t("customValue")}
                </h3>
                <div className="flex gap-2">
                  <Input
                    placeholder={t("customPlaceholder")}
                    value={localCustomValue}
                    onChange={(e) => setLocalCustomValue(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCustomSubmit();
                      }
                    }}
                  />
                  <Button
                    onClick={handleCustomSubmit}
                    disabled={!localCustomValue.trim()}
                    variant={isCustomSelected ? "default" : "secondary"}
                  >
                    {isCustomSelected ? t("update") : t("useCustom")}
                  </Button>
                </div>
                {isCustomSelected && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {t("currentlyUsing", { value: customValue })}
                  </p>
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                {search
                  ? t("resultsCount", { count: groupedTemplates.length })
                  : t("presetsAvailable", { count: templates.length })}
              </h3>
            </div>

            {groupedTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-muted-foreground mb-2">
                  {t("noTemplatesFor", { search })}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearch("")}
                >
                  {t("clearSearch")}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {groupedTemplates.map((template) => {
                  const isSelected = selectedId === template.id;
                  const translated = getTranslatedTemplate(template);
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleSelect(template)}
                      className={cn(
                        "group relative p-4 text-left rounded-xl border-2 transition-all duration-200",
                        "hover:border-primary/50 hover:bg-accent/50 hover:shadow-md",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-card"
                      )}
                    >
                      {/* Selection Indicator */}
                      <div
                        className={cn(
                          "absolute top-3 right-3 h-5 w-5 rounded-full flex items-center justify-center transition-all",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted group-hover:bg-muted-foreground/20"
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>

                      {/* Content */}
                      <div className="pr-6">
                        <h4
                          className={cn(
                            "font-semibold text-sm mb-1 transition-colors",
                            isSelected
                              ? "text-primary"
                              : "text-foreground group-hover:text-primary"
                          )}
                        >
                          {translated.name}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {translated.description}
                        </p>
                        <div className="text-xs text-muted-foreground/70 line-clamp-1 font-mono bg-muted/50 rounded px-2 py-1">
                          {template.promptFragment}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30 shrink-0">
          <div className="text-sm text-muted-foreground">
            {selectedId
              ? t("selected", {
                  name: (() => {
                    const selectedTemplate = templates.find((tmpl) => tmpl.id === selectedId);
                    if (selectedTemplate) {
                      return getTranslatedTemplate(selectedTemplate).name;
                    }
                    return "Custom";
                  })()
                })
              : customValue
                ? t("custom", { value: customValue })
                : t("noSelection")}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {tCommon("cancel")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
