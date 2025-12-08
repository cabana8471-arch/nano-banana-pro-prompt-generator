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
import type { LogoTemplate, LogoTemplateCategory } from "@/lib/types/logo";
import { cn } from "@/lib/utils";

// Typography preview styles mapping - shows example text in each style
const typographyStyles: Record<string, { className: string; text: string }> = {
  // Font Categories
  "font-sans-modern": { className: "font-sans tracking-tight", text: "Clean Modern" },
  "font-serif-classic": { className: "font-serif", text: "Classic Elegance" },
  "font-slab-serif": { className: "font-serif font-bold", text: "Bold Slab" },
  "font-script": { className: "font-serif italic", text: "Script Style" },
  "font-display": { className: "font-sans font-black uppercase", text: "DISPLAY" },
  "font-geometric-sans": { className: "font-sans tracking-wide uppercase", text: "GEOMETRIC" },
  "font-rounded": { className: "font-sans", text: "Friendly Rounded" },
  "font-condensed": { className: "font-sans font-semibold tracking-tighter", text: "CONDENSED" },
  "font-bold-heavy": { className: "font-sans font-black", text: "Bold Heavy" },
  "font-light-thin": { className: "font-sans font-light", text: "Light & Thin" },
  // Typography Treatments
  "typo-all-uppercase": { className: "font-sans uppercase tracking-wide", text: "ALL UPPERCASE" },
  "typo-all-lowercase": { className: "font-sans lowercase", text: "all lowercase" },
  "typo-title-case": { className: "font-sans font-medium", text: "Title Case" },
  "typo-mixed-case": { className: "font-sans", text: "MiXeD CaSe" },
  "typo-spaced-letters": { className: "font-sans tracking-[0.3em] uppercase", text: "S P A C E D" },
  "typo-stacked-words": { className: "font-sans font-bold text-center", text: "STACKED" },
  "typo-integrated-icon": { className: "font-sans font-medium", text: "Icon + Text" },
};

function TypographyPreview({ templateId }: { templateId: string }) {
  const style = typographyStyles[templateId];

  if (!style) {
    return <p className="text-xs text-muted-foreground mb-2">Typography style</p>;
  }

  return (
    <div className={cn(
      "text-sm mb-2 py-1 transition-all",
      style.className
    )}>
      {style.text}
    </div>
  );
}

interface LogoTemplateSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  templates: LogoTemplate[];
  selectedId?: string | undefined;
  onSelect: (template: LogoTemplate) => void;
  allowCustom?: boolean;
  customValue?: string;
  onCustomChange?: (value: string) => void;
  category: LogoTemplateCategory;
}

export function LogoTemplateSelectorModal({
  open,
  onOpenChange,
  title,
  templates,
  selectedId,
  onSelect,
  allowCustom = false,
  customValue = "",
  onCustomChange,
  category,
}: LogoTemplateSelectorModalProps) {
  const t = useTranslations("logoGenerator");
  const tCommon = useTranslations("common");
  const tTemplates = useTranslations("logoTemplates");
  const [search, setSearch] = useState("");
  const [localCustomValue, setLocalCustomValue] = useState(customValue);

  // Typography categories that show preview
  const typographyCategories = ["fontCategory", "typographyTreatment"];
  const isTypographyCategory = typographyCategories.includes(category);

  // Helper function to get translated template name and description
  const getTranslatedTemplate = (template: LogoTemplate) => {
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
    return {
      name: template.name,
      description: template.description,
    };
  };

  // Filter templates
  const filteredTemplates = useMemo(() => {
    const searchLower = search.toLowerCase();
    return templates.filter((template) => {
      const translated = getTranslatedTemplate(template);
      return (
        template.name.toLowerCase().includes(searchLower) ||
        template.description.toLowerCase().includes(searchLower) ||
        template.promptFragment.toLowerCase().includes(searchLower) ||
        translated.name.toLowerCase().includes(searchLower) ||
        translated.description.toLowerCase().includes(searchLower)
      );
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates, search, category]);

  const handleSelect = (template: LogoTemplate) => {
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
      <DialogContent className="sm:max-w-[1100px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="px-6 py-4 border-b bg-muted/30 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchTemplates", { count: templates.length })}
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
                    {t("currentlyUsing")}: {customValue}
                  </p>
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                {search
                  ? t("resultsCount", { count: filteredTemplates.length })
                  : t("presetsAvailable", { count: templates.length })}
              </h3>
            </div>

            {filteredTemplates.length === 0 ? (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {filteredTemplates.map((template) => {
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
                        {/* Typography preview - show styled example text for typography categories */}
                        {isTypographyCategory ? (
                          <TypographyPreview templateId={template.id} />
                        ) : (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {translated.description}
                          </p>
                        )}
                        <div className="text-[10px] text-muted-foreground/70 line-clamp-1 font-mono bg-muted/50 rounded px-2 py-1">
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
              ? `${t("selected")}: ${(() => {
                  const selectedTemplate = templates.find((tmpl) => tmpl.id === selectedId);
                  if (selectedTemplate) {
                    return getTranslatedTemplate(selectedTemplate).name;
                  }
                  return "Custom";
                })()}`
              : customValue
                ? `${t("customValue")}: ${customValue}`
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
