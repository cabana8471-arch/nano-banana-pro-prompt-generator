"use client";

import { useTranslations } from "next-intl";
import {
  specialEffectsTemplates,
  backgroundStyleTemplates,
} from "@/lib/data/logo-templates";
import { LogoTemplateSelector } from "../logo-template-selector";

interface AdditionalOptionsSectionProps {
  specialEffects: string;
  backgroundStyle: string;
  onSpecialEffectsChange: (value: string) => void;
  onBackgroundStyleChange: (value: string) => void;
}

export function AdditionalOptionsSection({
  specialEffects,
  backgroundStyle,
  onSpecialEffectsChange,
  onBackgroundStyleChange,
}: AdditionalOptionsSectionProps) {
  const t = useTranslations("logoGenerator");

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
        {t("sections.additionalOptions")}
      </h3>

      {/* Special Effects */}
      <LogoTemplateSelector
        label={t("categories.specialEffects")}
        templates={specialEffectsTemplates}
        value={specialEffects}
        onChange={onSpecialEffectsChange}
        placeholder={t("placeholders.specialEffects")}
        category="specialEffects"
      />

      {/* Background Style */}
      <LogoTemplateSelector
        label={t("categories.backgroundStyle")}
        templates={backgroundStyleTemplates}
        value={backgroundStyle}
        onChange={onBackgroundStyleChange}
        placeholder={t("placeholders.backgroundStyle")}
        category="backgroundStyle"
      />
    </div>
  );
}
