"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { quickStartTemplates } from "@/lib/data/banner-templates";
import type { BannerPresetConfig } from "@/lib/types/banner";

interface QuickStartTemplatesProps {
  onSelectTemplate: (config: BannerPresetConfig) => void;
  disabled?: boolean;
}

export function QuickStartTemplates({
  onSelectTemplate,
  disabled = false,
}: QuickStartTemplatesProps) {
  const t = useTranslations("bannerGenerator");
  const tTemplates = useTranslations("quickStartTemplates");
  const [open, setOpen] = useState(false);

  const handleSelectTemplate = (config: BannerPresetConfig) => {
    onSelectTemplate(config);
    setOpen(false);
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("quickStart.title")}</DialogTitle>
          <DialogDescription>
            {t("quickStart.description")}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
            {quickStartTemplates.map((template) => {
              // Get translation keys based on template id
              const translationKey = template.id.replace("quick-", "");
              return (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template.config)}
                  className="group relative flex flex-col items-start gap-2 rounded-lg border p-4 hover:bg-accent hover:border-primary/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <h4 className="font-medium text-sm">
                      {tTemplates(`${translationKey}.name`)}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {tTemplates(`${translationKey}.description`)}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
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
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
