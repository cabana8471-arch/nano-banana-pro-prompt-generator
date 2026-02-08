"use client";

import { useState, useMemo } from "react";
import { Search, Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  photoQuickStartTemplates,
  photoTemplateCategories,
} from "@/lib/data/photo-templates";
import type {
  PhotoTemplateCategory,
  PhotoQuickStartTemplate,
} from "@/lib/data/photo-templates";
import type { PromptBuilderState } from "@/lib/types/generation";
import { cn } from "@/lib/utils";

interface PhotoQuickStartTemplatesProps {
  onSelectTemplate: (config: Partial<PromptBuilderState>) => void;
  disabled?: boolean;
}

export function PhotoQuickStartTemplates({
  onSelectTemplate,
  disabled = false,
}: PhotoQuickStartTemplatesProps) {
  const t = useTranslations("photoTemplates");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<PhotoTemplateCategory | "all">("all");

  /** Get the i18n translation key from a template ID (strip the "photo-" prefix) */
  const getTranslationKey = (templateId: string): string => {
    return templateId.replace("photo-", "");
  };

  /** Resolve translated name and description, falling back to the static English values */
  const getTranslatedTemplate = (template: PhotoQuickStartTemplate) => {
    const key = getTranslationKey(template.id);
    try {
      return {
        name: t(`templates.${key}.name`),
        description: t(`templates.${key}.description`),
      };
    } catch {
      return { name: template.name, description: template.description };
    }
  };

  /** Get the translated label for a category */
  const getCategoryLabel = (category: PhotoTemplateCategory | "all"): string => {
    if (category === "all") return t("allCategories");
    return t(category);
  };

  // Filter templates by search query and active category
  const filteredTemplates = useMemo(() => {
    let results = photoQuickStartTemplates;

    // Filter by category
    if (activeCategory !== "all") {
      results = results.filter((tpl) => tpl.category === activeCategory);
    }

    // Filter by search text
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      results = results.filter((tpl) => {
        const translated = getTranslatedTemplate(tpl);
        return (
          tpl.name.toLowerCase().includes(searchLower) ||
          tpl.description.toLowerCase().includes(searchLower) ||
          translated.name.toLowerCase().includes(searchLower) ||
          translated.description.toLowerCase().includes(searchLower)
        );
      });
    }

    return results;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeCategory]);

  const handleSelectTemplate = (config: Omit<Partial<PromptBuilderState>, "subjects">) => {
    onSelectTemplate(config);
    setOpen(false);
    setSearch("");
    setActiveCategory("all");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {t("title")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1100px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-xl">{t("title")}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {t("description")}
          </p>
        </DialogHeader>

        {/* Search and category filter */}
        <div className="px-6 py-4 border-b bg-muted/30 shrink-0 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search")}
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

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-full border transition-colors",
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50"
              )}
            >
              {getCategoryLabel("all")}
            </button>
            {photoTemplateCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-full border transition-colors",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50"
                )}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-6">
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                {filteredTemplates.length === photoQuickStartTemplates.length
                  ? t("templatesAvailable", { count: photoQuickStartTemplates.length })
                  : t("resultsCount", { count: filteredTemplates.length })}
              </h3>
            </div>

            {filteredTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-muted-foreground mb-2">
                  {t("noResults")}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("all");
                  }}
                >
                  {t("clearFilters")}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredTemplates.map((template) => {
                  const translated = getTranslatedTemplate(template);
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template.config)}
                      className={cn(
                        "group relative p-4 text-left rounded-xl border-2 transition-all duration-200",
                        "hover:border-primary/50 hover:bg-accent/50 hover:shadow-md",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        "border-border bg-card"
                      )}
                    >
                      {/* Icon */}
                      <div className="absolute top-3 right-3 p-1.5 rounded-md bg-primary/10 text-primary">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>

                      {/* Content */}
                      <div className="pr-8">
                        <h4 className="font-semibold text-sm mb-1 text-foreground group-hover:text-primary transition-colors">
                          {translated.name}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {translated.description}
                        </p>
                        <span className="text-[10px] px-1.5 py-0.5 bg-secondary rounded-full capitalize">
                          {getCategoryLabel(template.category)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t bg-muted/30 shrink-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {tCommon("cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
