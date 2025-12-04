"use client";

import { useTranslations } from "next-intl";
import {
  designStyleTemplates,
  colorSchemeTemplates,
  moodTemplates,
  seasonalTemplates,
} from "@/lib/data/banner-templates";
import { BannerTemplateSelector } from "../banner-template-selector";

interface VisualStyleSectionProps {
  designStyle: string;
  colorScheme: string;
  mood: string;
  seasonal: string;
  onDesignStyleChange: (value: string) => void;
  onColorSchemeChange: (value: string) => void;
  onMoodChange: (value: string) => void;
  onSeasonalChange: (value: string) => void;
}

export function VisualStyleSection({
  designStyle,
  colorScheme,
  mood,
  seasonal,
  onDesignStyleChange,
  onColorSchemeChange,
  onMoodChange,
  onSeasonalChange,
}: VisualStyleSectionProps) {
  const t = useTranslations("bannerGenerator");

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
        {t("sections.visualStyle")}
      </h3>

      {/* Design Style */}
      <BannerTemplateSelector
        label={t("categories.designStyle")}
        templates={designStyleTemplates}
        value={designStyle}
        onChange={onDesignStyleChange}
        placeholder={t("placeholders.designStyle")}
        category="designStyle"
      />

      {/* Color Scheme */}
      <BannerTemplateSelector
        label={t("categories.colorScheme")}
        templates={colorSchemeTemplates}
        value={colorScheme}
        onChange={onColorSchemeChange}
        placeholder={t("placeholders.colorScheme")}
        category="colorScheme"
      />

      {/* Mood / Emotion */}
      <BannerTemplateSelector
        label={t("categories.mood")}
        templates={moodTemplates}
        value={mood}
        onChange={onMoodChange}
        placeholder={t("placeholders.mood")}
        category="mood"
      />

      {/* Seasonal / Holiday */}
      <BannerTemplateSelector
        label={t("categories.seasonal")}
        templates={seasonalTemplates}
        value={seasonal}
        onChange={onSeasonalChange}
        placeholder={t("placeholders.seasonal")}
        category="seasonal"
      />
    </div>
  );
}
