"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useBannerValidation } from "@/hooks/use-banner-validation";
import type { BannerBuilderState, BannerGenerationSettings, BannerBrandAssets } from "@/lib/types/banner";
import type { Avatar } from "@/lib/types/generation";
import { BrandAssetsManager } from "./brand-assets-manager";
import { BasicConfigSection } from "./sections/basic-config-section";
import { LayoutTypographySection } from "./sections/layout-typography-section";
import { VisualElementsSection } from "./sections/visual-elements-section";
import { VisualStyleSection } from "./sections/visual-style-section";
import { TextContentEditor } from "./text-content-editor";

interface BannerBuilderPanelProps {
  // State
  state: BannerBuilderState;
  settings: BannerGenerationSettings;
  brandAssets: BannerBrandAssets;

  // Section A: Basic Configuration setters
  onBannerTypeChange: (value: string) => void;
  onBannerSizeChange: (value: string) => void;
  onIndustryChange: (value: string) => void;

  // Section B: Visual Style setters
  onDesignStyleChange: (value: string) => void;
  onColorSchemeChange: (value: string) => void;
  onMoodChange: (value: string) => void;
  onSeasonalChange: (value: string) => void;

  // Section C: Visual Elements setters
  onBackgroundStyleChange: (value: string) => void;
  onVisualEffectsChange: (value: string) => void;
  onIconGraphicsChange: (value: string) => void;
  onPromotionalElementsChange: (value: string) => void;

  // Section D: Layout & Typography setters
  onLayoutStyleChange: (value: string) => void;
  onTextPlacementChange: (value: string) => void;
  onTypographyStyleChange: (value: string) => void;
  onCtaButtonStyleChange: (value: string) => void;

  // Text content setters
  onHeadlineChange: (value: string) => void;
  onSubheadlineChange: (value: string) => void;
  onCtaTextChange: (value: string) => void;
  onTaglineChange: (value: string) => void;

  // Custom prompt
  onCustomPromptChange: (value: string) => void;

  // Brand assets setters
  onLogoChange: (avatarId: string | undefined) => void;
  onProductImageChange: (avatarId: string | undefined) => void;
  onPrimaryColorChange: (color: string | undefined) => void;
  onSecondaryColorChange: (color: string | undefined) => void;
  onAccentColorChange: (color: string | undefined) => void;

  // Avatar data
  avatars: Avatar[];
  isLoadingAvatars: boolean;
  getAvatarById: (id: string) => Avatar | undefined;
}

export function BannerBuilderPanel({
  state,
  brandAssets,
  onBannerTypeChange,
  onBannerSizeChange,
  onIndustryChange,
  onDesignStyleChange,
  onColorSchemeChange,
  onMoodChange,
  onSeasonalChange,
  onBackgroundStyleChange,
  onVisualEffectsChange,
  onIconGraphicsChange,
  onPromotionalElementsChange,
  onLayoutStyleChange,
  onTextPlacementChange,
  onTypographyStyleChange,
  onCtaButtonStyleChange,
  onHeadlineChange,
  onSubheadlineChange,
  onCtaTextChange,
  onTaglineChange,
  onCustomPromptChange,
  onLogoChange,
  onProductImageChange,
  onPrimaryColorChange,
  onSecondaryColorChange,
  onAccentColorChange,
  avatars,
  isLoadingAvatars,
  getAvatarById,
}: BannerBuilderPanelProps) {
  const t = useTranslations("bannerGenerator");

  // Use validation hook for character limits
  const validation = useBannerValidation({
    textContent: state.textContent,
    bannerSizeId: state.bannerSize,
    primaryColor: brandAssets.primaryColor,
    backgroundColor: undefined, // Could be enhanced later
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Section A: Basic Configuration */}
          <BasicConfigSection
            bannerType={state.bannerType}
            bannerSize={state.bannerSize}
            industry={state.industry}
            onBannerTypeChange={onBannerTypeChange}
            onBannerSizeChange={onBannerSizeChange}
            onIndustryChange={onIndustryChange}
          />

          <Separator />

          {/* Section B: Visual Style */}
          <VisualStyleSection
            designStyle={state.designStyle}
            colorScheme={state.colorScheme}
            mood={state.mood}
            seasonal={state.seasonal}
            onDesignStyleChange={onDesignStyleChange}
            onColorSchemeChange={onColorSchemeChange}
            onMoodChange={onMoodChange}
            onSeasonalChange={onSeasonalChange}
          />

          <Separator />

          {/* Section C: Visual Elements */}
          <VisualElementsSection
            backgroundStyle={state.backgroundStyle}
            visualEffects={state.visualEffects}
            iconGraphics={state.iconGraphics}
            promotionalElements={state.promotionalElements}
            onBackgroundStyleChange={onBackgroundStyleChange}
            onVisualEffectsChange={onVisualEffectsChange}
            onIconGraphicsChange={onIconGraphicsChange}
            onPromotionalElementsChange={onPromotionalElementsChange}
          />

          <Separator />

          {/* Section D: Layout & Typography */}
          <LayoutTypographySection
            layoutStyle={state.layoutStyle}
            textPlacement={state.textPlacement}
            typographyStyle={state.typographyStyle}
            ctaButtonStyle={state.ctaButtonStyle}
            onLayoutStyleChange={onLayoutStyleChange}
            onTextPlacementChange={onTextPlacementChange}
            onTypographyStyleChange={onTypographyStyleChange}
            onCtaButtonStyleChange={onCtaButtonStyleChange}
          />

          <Separator />

          {/* Text Content Editor */}
          <TextContentEditor
            textContent={state.textContent}
            characterLimits={validation.characterLimits}
            onHeadlineChange={onHeadlineChange}
            onSubheadlineChange={onSubheadlineChange}
            onCtaTextChange={onCtaTextChange}
            onTaglineChange={onTaglineChange}
            isOverLimit={validation.isOverLimit}
            getPercentageUsed={validation.getPercentageUsed}
          />

          <Separator />

          {/* Brand Assets Manager */}
          <BrandAssetsManager
            brandAssets={brandAssets}
            avatars={avatars}
            isLoadingAvatars={isLoadingAvatars}
            onLogoChange={onLogoChange}
            onProductImageChange={onProductImageChange}
            onPrimaryColorChange={onPrimaryColorChange}
            onSecondaryColorChange={onSecondaryColorChange}
            onAccentColorChange={onAccentColorChange}
            getAvatarById={getAvatarById}
          />

          <Separator />

          {/* Custom Prompt */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("customPrompt.label")}
            </Label>
            <Textarea
              value={state.customPrompt}
              onChange={(e) => onCustomPromptChange(e.target.value)}
              placeholder={t("customPrompt.placeholder")}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              {t("customPrompt.hint")}
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
