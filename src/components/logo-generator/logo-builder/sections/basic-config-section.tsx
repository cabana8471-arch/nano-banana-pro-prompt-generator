"use client";

import { useTranslations } from "next-intl";
import {
  logoTypeTemplates,
  industryTemplates,
  logoFormatTemplates,
} from "@/lib/data/logo-templates";
import { LogoTemplateSelector } from "../logo-template-selector";

interface BasicConfigSectionProps {
  logoType: string;
  industry: string;
  logoFormat: string;
  onLogoTypeChange: (value: string) => void;
  onIndustryChange: (value: string) => void;
  onLogoFormatChange: (value: string) => void;
}

export function BasicConfigSection({
  logoType,
  industry,
  logoFormat,
  onLogoTypeChange,
  onIndustryChange,
  onLogoFormatChange,
}: BasicConfigSectionProps) {
  const t = useTranslations("logoGenerator");

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
        {t("sections.basicConfig")}
      </h3>

      {/* Logo Type */}
      <LogoTemplateSelector
        label={t("categories.logoType")}
        templates={logoTypeTemplates}
        value={logoType}
        onChange={onLogoTypeChange}
        placeholder={t("placeholders.logoType")}
        category="logoType"
      />

      {/* Industry */}
      <LogoTemplateSelector
        label={t("categories.industry")}
        templates={industryTemplates}
        value={industry}
        onChange={onIndustryChange}
        placeholder={t("placeholders.industry")}
        category="industry"
      />

      {/* Logo Format */}
      <LogoTemplateSelector
        label={t("categories.logoFormat")}
        templates={logoFormatTemplates}
        value={logoFormat}
        onChange={onLogoFormatChange}
        placeholder={t("placeholders.logoFormat")}
        category="logoFormat"
      />
    </div>
  );
}
