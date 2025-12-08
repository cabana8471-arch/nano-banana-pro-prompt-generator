"use client";

import { useTranslations } from "next-intl";
import {
  fontCategoryTemplates,
  typographyTreatmentTemplates,
} from "@/lib/data/logo-templates";
import { LogoTemplateSelector } from "../logo-template-selector";

interface TypographySectionProps {
  fontCategory: string;
  typographyTreatment: string;
  onFontCategoryChange: (value: string) => void;
  onTypographyTreatmentChange: (value: string) => void;
}

export function TypographySection({
  fontCategory,
  typographyTreatment,
  onFontCategoryChange,
  onTypographyTreatmentChange,
}: TypographySectionProps) {
  const t = useTranslations("logoGenerator");

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
        {t("sections.typography")}
      </h3>

      {/* Font Category */}
      <LogoTemplateSelector
        label={t("categories.fontCategory")}
        templates={fontCategoryTemplates}
        value={fontCategory}
        onChange={onFontCategoryChange}
        placeholder={t("placeholders.fontCategory")}
        category="fontCategory"
      />

      {/* Typography Treatment */}
      <LogoTemplateSelector
        label={t("categories.typographyTreatment")}
        templates={typographyTreatmentTemplates}
        value={typographyTreatment}
        onChange={onTypographyTreatmentChange}
        placeholder={t("placeholders.typographyTreatment")}
        category="typographyTreatment"
      />
    </div>
  );
}
