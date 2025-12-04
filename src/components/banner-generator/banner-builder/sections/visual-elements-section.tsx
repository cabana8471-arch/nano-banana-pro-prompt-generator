"use client";

import { useTranslations } from "next-intl";
import {
  backgroundStyleTemplates,
  visualEffectsTemplates,
  iconGraphicsTemplates,
  promotionalTemplates,
} from "@/lib/data/banner-templates";
import { BannerTemplateSelector } from "../banner-template-selector";

interface VisualElementsSectionProps {
  backgroundStyle: string;
  visualEffects: string;
  iconGraphics: string;
  promotionalElements: string;
  onBackgroundStyleChange: (value: string) => void;
  onVisualEffectsChange: (value: string) => void;
  onIconGraphicsChange: (value: string) => void;
  onPromotionalElementsChange: (value: string) => void;
}

export function VisualElementsSection({
  backgroundStyle,
  visualEffects,
  iconGraphics,
  promotionalElements,
  onBackgroundStyleChange,
  onVisualEffectsChange,
  onIconGraphicsChange,
  onPromotionalElementsChange,
}: VisualElementsSectionProps) {
  const t = useTranslations("bannerGenerator");

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
        {t("sections.visualElements")}
      </h3>

      {/* Background Style */}
      <BannerTemplateSelector
        label={t("categories.backgroundStyle")}
        templates={backgroundStyleTemplates}
        value={backgroundStyle}
        onChange={onBackgroundStyleChange}
        placeholder={t("placeholders.backgroundStyle")}
        category="backgroundStyle"
      />

      {/* Visual Effects */}
      <BannerTemplateSelector
        label={t("categories.visualEffects")}
        templates={visualEffectsTemplates}
        value={visualEffects}
        onChange={onVisualEffectsChange}
        placeholder={t("placeholders.visualEffects")}
        category="visualEffects"
      />

      {/* Icon / Graphics */}
      <BannerTemplateSelector
        label={t("categories.iconGraphics")}
        templates={iconGraphicsTemplates}
        value={iconGraphics}
        onChange={onIconGraphicsChange}
        placeholder={t("placeholders.iconGraphics")}
        category="iconGraphics"
      />

      {/* Promotional Elements */}
      <BannerTemplateSelector
        label={t("categories.promotionalElements")}
        templates={promotionalTemplates}
        value={promotionalElements}
        onChange={onPromotionalElementsChange}
        placeholder={t("placeholders.promotionalElements")}
        category="promotionalElements"
      />
    </div>
  );
}
