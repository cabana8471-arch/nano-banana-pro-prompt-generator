"use client";

import { useTranslations } from "next-intl";
import {
  bannerTypeTemplates,
  bannerSizeTemplates,
  industryTemplates,
} from "@/lib/data/banner-templates";
import { BannerTemplateSelector } from "../banner-template-selector";

interface BasicConfigSectionProps {
  bannerType: string;
  bannerSize: string;
  industry: string;
  onBannerTypeChange: (value: string) => void;
  onBannerSizeChange: (value: string) => void;
  onIndustryChange: (value: string) => void;
}

export function BasicConfigSection({
  bannerType,
  bannerSize,
  industry,
  onBannerTypeChange,
  onBannerSizeChange,
  onIndustryChange,
}: BasicConfigSectionProps) {
  const t = useTranslations("bannerGenerator");

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
        {t("sections.basicConfig")}
      </h3>

      {/* Banner Type */}
      <BannerTemplateSelector
        label={t("categories.bannerType")}
        templates={bannerTypeTemplates}
        value={bannerType}
        onChange={onBannerTypeChange}
        placeholder={t("placeholders.bannerType")}
        category="bannerType"
      />

      {/* Banner Size */}
      <BannerTemplateSelector
        label={t("categories.bannerSize")}
        templates={bannerSizeTemplates}
        value={bannerSize}
        onChange={onBannerSizeChange}
        placeholder={t("placeholders.bannerSize")}
        category="bannerSize"
      />

      {/* Industry */}
      <BannerTemplateSelector
        label={t("categories.industry")}
        templates={industryTemplates}
        value={industry}
        onChange={onIndustryChange}
        placeholder={t("placeholders.industry")}
        category="industry"
      />
    </div>
  );
}
