"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  customWidth: number | null;
  customHeight: number | null;
  onBannerTypeChange: (value: string) => void;
  onBannerSizeChange: (value: string) => void;
  onIndustryChange: (value: string) => void;
  onCustomWidthChange: (value: number | null) => void;
  onCustomHeightChange: (value: number | null) => void;
}

export function BasicConfigSection({
  bannerType,
  bannerSize,
  industry,
  customWidth,
  customHeight,
  onBannerTypeChange,
  onBannerSizeChange,
  onIndustryChange,
  onCustomWidthChange,
  onCustomHeightChange,
}: BasicConfigSectionProps) {
  const t = useTranslations("bannerGenerator");

  const isCustomSize = bannerSize === "size-custom";

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      onCustomWidthChange(null);
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue >= 0) {
        onCustomWidthChange(Math.min(numValue, 4096));
      }
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      onCustomHeightChange(null);
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue >= 0) {
        onCustomHeightChange(Math.min(numValue, 4096));
      }
    }
  };

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

      {/* Custom Size Inputs */}
      {isCustomSize && (
        <div className="space-y-3 p-3 bg-muted/50 rounded-lg border">
          <p className="text-xs text-muted-foreground">
            {t("customSize.description")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="custom-width" className="text-xs">
                {t("customSize.width")}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="custom-width"
                  type="number"
                  min={50}
                  max={4096}
                  placeholder="1920"
                  value={customWidth ?? ""}
                  onChange={handleWidthChange}
                  className="h-9"
                />
                <span className="text-xs text-muted-foreground">px</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="custom-height" className="text-xs">
                {t("customSize.height")}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="custom-height"
                  type="number"
                  min={50}
                  max={4096}
                  placeholder="600"
                  value={customHeight ?? ""}
                  onChange={handleHeightChange}
                  className="h-9"
                />
                <span className="text-xs text-muted-foreground">px</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("customSize.limits")}
          </p>
        </div>
      )}

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
