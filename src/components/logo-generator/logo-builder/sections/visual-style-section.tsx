"use client";

import { useTranslations } from "next-intl";
import {
  designStyleTemplates,
  colorSchemeTypeTemplates,
  moodTemplates,
} from "@/lib/data/logo-templates";
import { LogoTemplateSelector } from "../logo-template-selector";

interface VisualStyleSectionProps {
  designStyle: string;
  colorSchemeType: string;
  mood: string;
  onDesignStyleChange: (value: string) => void;
  onColorSchemeTypeChange: (value: string) => void;
  onMoodChange: (value: string) => void;
}

export function VisualStyleSection({
  designStyle,
  colorSchemeType,
  mood,
  onDesignStyleChange,
  onColorSchemeTypeChange,
  onMoodChange,
}: VisualStyleSectionProps) {
  const t = useTranslations("logoGenerator");

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
        {t("sections.visualStyle")}
      </h3>

      {/* Design Style */}
      <LogoTemplateSelector
        label={t("categories.designStyle")}
        templates={designStyleTemplates}
        value={designStyle}
        onChange={onDesignStyleChange}
        placeholder={t("placeholders.designStyle")}
        category="designStyle"
      />

      {/* Color Scheme Type */}
      <LogoTemplateSelector
        label={t("categories.colorSchemeType")}
        templates={colorSchemeTypeTemplates}
        value={colorSchemeType}
        onChange={onColorSchemeTypeChange}
        placeholder={t("placeholders.colorSchemeType")}
        category="colorSchemeType"
      />

      {/* Mood */}
      <LogoTemplateSelector
        label={t("categories.mood")}
        templates={moodTemplates}
        value={mood}
        onChange={onMoodChange}
        placeholder={t("placeholders.mood")}
        category="mood"
      />
    </div>
  );
}
