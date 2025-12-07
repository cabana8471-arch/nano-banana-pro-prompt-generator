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
import { quickStartTemplates } from "@/lib/data/banner-templates";
import type { BannerPresetConfig } from "@/lib/types/banner";
import { cn } from "@/lib/utils";

interface QuickStartTemplatesProps {
  onSelectTemplate: (config: BannerPresetConfig) => void;
  disabled?: boolean;
}

export function QuickStartTemplates({
  onSelectTemplate,
  disabled = false,
}: QuickStartTemplatesProps) {
  const t = useTranslations("bannerGenerator");
  const tCommon = useTranslations("common");
  const tTemplates = useTranslations("quickStartTemplates");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Get translated name and description for a template
  const getTranslatedTemplate = (templateId: string) => {
    const translationKey = templateId.replace("quick-", "");
    try {
      return {
        name: tTemplates(`${translationKey}.name`),
        description: tTemplates(`${translationKey}.description`),
      };
    } catch {
      return { name: templateId, description: "" };
    }
  };

  // Filter templates based on search
  const filteredTemplates = useMemo(() => {
    if (!search.trim()) return quickStartTemplates;

    const searchLower = search.toLowerCase();
    return quickStartTemplates.filter((template) => {
      const translated = getTranslatedTemplate(template.id);
      return (
        template.name.toLowerCase().includes(searchLower) ||
        template.description.toLowerCase().includes(searchLower) ||
        translated.name.toLowerCase().includes(searchLower) ||
        translated.description.toLowerCase().includes(searchLower)
      );
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSelectTemplate = (config: BannerPresetConfig) => {
    onSelectTemplate(config);
    setOpen(false);
    setSearch("");
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
          {t("quickStart.buttonLabel")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1100px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-xl">{t("quickStart.title")}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {t("quickStart.description")}
          </p>
        </DialogHeader>

        {/* Search */}
        <div className="px-6 py-4 border-b bg-muted/30 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchTemplates", { count: quickStartTemplates.length })}
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

        {/* Templates Grid */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-6">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                {search
                  ? t("resultsCount", { count: filteredTemplates.length })
                  : t("presetsAvailable", { count: quickStartTemplates.length })}
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
                  const translated = getTranslatedTemplate(template.id);
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
                        <div className="flex flex-wrap gap-1">
                          {template.config.bannerType && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-secondary rounded-full">
                              {t("categories.bannerType")}
                            </span>
                          )}
                          {template.config.designStyle && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-secondary rounded-full">
                              {t("categories.designStyle")}
                            </span>
                          )}
                          {template.config.colorScheme && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-secondary rounded-full">
                              {t("categories.colorScheme")}
                            </span>
                          )}
                          {template.config.layoutStyle && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-secondary rounded-full">
                              {t("categories.layoutStyle")}
                            </span>
                          )}
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
        <div className="flex items-center justify-end px-6 py-4 border-t bg-muted/30 shrink-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {tCommon("cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
