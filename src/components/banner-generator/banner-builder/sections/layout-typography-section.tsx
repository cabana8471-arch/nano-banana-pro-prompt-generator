"use client";

import { useTranslations } from "next-intl";
import {
  layoutStyleTemplates,
  textLanguageTemplates,
  textPlacementTemplates,
  typographyStyleTemplates,
  ctaButtonStyleTemplates,
} from "@/lib/data/banner-templates";
import { BannerTemplateSelector } from "../banner-template-selector";

interface LayoutTypographySectionProps {
  layoutStyle: string;
  textLanguage: string;
  textPlacement: string;
  typographyStyle: string;
  headlineTypography: string;
  bodyTypography: string;
  ctaTypography: string;
  ctaButtonStyle: string;
  onLayoutStyleChange: (value: string) => void;
  onTextLanguageChange: (value: string) => void;
  onTextPlacementChange: (value: string) => void;
  onTypographyStyleChange: (value: string) => void;
  onHeadlineTypographyChange: (value: string) => void;
  onBodyTypographyChange: (value: string) => void;
  onCtaTypographyChange: (value: string) => void;
  onCtaButtonStyleChange: (value: string) => void;
}

export function LayoutTypographySection({
  layoutStyle,
  textLanguage,
  textPlacement,
  typographyStyle,
  headlineTypography,
  bodyTypography,
  ctaTypography,
  ctaButtonStyle,
  onLayoutStyleChange,
  onTextLanguageChange,
  onTextPlacementChange,
  onTypographyStyleChange,
  onHeadlineTypographyChange,
  onBodyTypographyChange,
  onCtaTypographyChange,
  onCtaButtonStyleChange,
}: LayoutTypographySectionProps) {
  const t = useTranslations("bannerGenerator");

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
        {t("sections.layoutTypography")}
      </h3>

      {/* Layout Style */}
      <BannerTemplateSelector
        label={t("categories.layoutStyle")}
        templates={layoutStyleTemplates}
        value={layoutStyle}
        onChange={onLayoutStyleChange}
        placeholder={t("placeholders.layoutStyle")}
        category="layoutStyle"
      />

      {/* Text Language */}
      <BannerTemplateSelector
        label={t("categories.textLanguage")}
        templates={textLanguageTemplates}
        value={textLanguage}
        onChange={onTextLanguageChange}
        placeholder={t("placeholders.textLanguage")}
        category="textLanguage"
      />

      {/* Text Placement */}
      <BannerTemplateSelector
        label={t("categories.textPlacement")}
        templates={textPlacementTemplates}
        value={textPlacement}
        onChange={onTextPlacementChange}
        placeholder={t("placeholders.textPlacement")}
        category="textPlacement"
      />

      {/* Typography Style (General/Fallback) */}
      <BannerTemplateSelector
        label={t("categories.typographyStyle")}
        templates={typographyStyleTemplates}
        value={typographyStyle}
        onChange={onTypographyStyleChange}
        placeholder={t("placeholders.typographyStyle")}
        category="typographyStyle"
        description={t("descriptions.typographyStyle")}
      />

      {/* Headline Typography */}
      <BannerTemplateSelector
        label={t("categories.headlineTypography")}
        templates={typographyStyleTemplates}
        value={headlineTypography}
        onChange={onHeadlineTypographyChange}
        placeholder={t("placeholders.headlineTypography")}
        category="headlineTypography"
      />

      {/* Body Typography (Subheadline & Tagline) */}
      <BannerTemplateSelector
        label={t("categories.bodyTypography")}
        templates={typographyStyleTemplates}
        value={bodyTypography}
        onChange={onBodyTypographyChange}
        placeholder={t("placeholders.bodyTypography")}
        category="bodyTypography"
      />

      {/* CTA Typography */}
      <BannerTemplateSelector
        label={t("categories.ctaTypography")}
        templates={typographyStyleTemplates}
        value={ctaTypography}
        onChange={onCtaTypographyChange}
        placeholder={t("placeholders.ctaTypography")}
        category="ctaTypography"
      />

      {/* CTA Button Style */}
      <BannerTemplateSelector
        label={t("categories.ctaButtonStyle")}
        templates={ctaButtonStyleTemplates}
        value={ctaButtonStyle}
        onChange={onCtaButtonStyleChange}
        placeholder={t("placeholders.ctaButtonStyle")}
        category="ctaButtonStyle"
      />
    </div>
  );
}
