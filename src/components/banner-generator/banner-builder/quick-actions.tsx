"use client";

import { Copy, RotateCcw, Shuffle, ArrowLeftRight } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { allBannerTemplates } from "@/lib/data/banner-templates";
import type { BannerPresetConfig, BannerBrandAssets } from "@/lib/types/banner";

interface QuickActionsProps {
  currentConfig: BannerPresetConfig;
  brandAssets: BannerBrandAssets;
  onLoadConfig: (config: BannerPresetConfig) => void;
  onReset: () => void;
  onSwapColors: () => void;
  disabled?: boolean;
  hasAnySelection: boolean;
}

// Helper function to get a random item from an array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!;
}

// Generate a random banner configuration
function generateRandomConfig(): BannerPresetConfig {
  const config: BannerPresetConfig = {};

  // Randomly select from each category (50% chance per category)
  if (Math.random() > 0.3 && allBannerTemplates.bannerType.length > 0) {
    config.bannerType = getRandomItem(allBannerTemplates.bannerType).id;
  }
  if (Math.random() > 0.5 && allBannerTemplates.bannerSize.length > 0) {
    config.bannerSize = getRandomItem(allBannerTemplates.bannerSize).id;
  }
  if (Math.random() > 0.5 && allBannerTemplates.industry.length > 0) {
    config.industry = getRandomItem(allBannerTemplates.industry).id;
  }
  if (Math.random() > 0.3 && allBannerTemplates.designStyle.length > 0) {
    config.designStyle = getRandomItem(allBannerTemplates.designStyle).id;
  }
  if (Math.random() > 0.3 && allBannerTemplates.colorScheme.length > 0) {
    config.colorScheme = getRandomItem(allBannerTemplates.colorScheme).id;
  }
  if (Math.random() > 0.5 && allBannerTemplates.mood.length > 0) {
    config.mood = getRandomItem(allBannerTemplates.mood).id;
  }
  if (Math.random() > 0.7 && allBannerTemplates.seasonal.length > 0) {
    config.seasonal = getRandomItem(allBannerTemplates.seasonal).id;
  }
  if (Math.random() > 0.5 && allBannerTemplates.backgroundStyle.length > 0) {
    config.backgroundStyle = getRandomItem(allBannerTemplates.backgroundStyle).id;
  }
  if (Math.random() > 0.6 && allBannerTemplates.visualEffects.length > 0) {
    config.visualEffects = getRandomItem(allBannerTemplates.visualEffects).id;
  }
  if (Math.random() > 0.7 && allBannerTemplates.iconGraphics.length > 0) {
    config.iconGraphics = getRandomItem(allBannerTemplates.iconGraphics).id;
  }
  if (Math.random() > 0.6 && allBannerTemplates.promotionalElements.length > 0) {
    config.promotionalElements = getRandomItem(allBannerTemplates.promotionalElements).id;
  }
  if (Math.random() > 0.4 && allBannerTemplates.layoutStyle.length > 0) {
    config.layoutStyle = getRandomItem(allBannerTemplates.layoutStyle).id;
  }
  if (Math.random() > 0.6 && allBannerTemplates.textPlacement.length > 0) {
    config.textPlacement = getRandomItem(allBannerTemplates.textPlacement).id;
  }
  if (Math.random() > 0.5 && allBannerTemplates.typographyStyle.length > 0) {
    config.typographyStyle = getRandomItem(allBannerTemplates.typographyStyle).id;
  }
  if (Math.random() > 0.5 && allBannerTemplates.ctaButtonStyle.length > 0) {
    config.ctaButtonStyle = getRandomItem(allBannerTemplates.ctaButtonStyle).id;
  }

  return config;
}

export function QuickActions({
  currentConfig,
  onLoadConfig,
  onReset,
  onSwapColors,
  disabled = false,
  hasAnySelection,
}: QuickActionsProps) {
  const t = useTranslations("bannerGenerator");

  const handleDuplicate = () => {
    // Just reload the current config (makes a copy in state)
    onLoadConfig(currentConfig);
  };

  const handleRandomize = () => {
    const randomConfig = generateRandomConfig();
    onLoadConfig(randomConfig);
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {/* Duplicate */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleDuplicate}
              disabled={disabled || !hasAnySelection}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("quickActions.duplicate")}</p>
          </TooltipContent>
        </Tooltip>

        {/* Randomize */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleRandomize}
              disabled={disabled}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("quickActions.randomize")}</p>
          </TooltipContent>
        </Tooltip>

        {/* Swap Colors */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onSwapColors}
              disabled={disabled}
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("quickActions.swapColors")}</p>
          </TooltipContent>
        </Tooltip>

        {/* Reset (with confirmation) */}
        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  disabled={disabled || !hasAnySelection}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("quickActions.reset")}</p>
            </TooltipContent>
          </Tooltip>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("quickActions.resetConfirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("quickActions.resetConfirmDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("quickActions.cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={onReset}>
                {t("quickActions.confirmReset")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
