"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BannerBuilderPanel } from "@/components/banner-generator/banner-builder/banner-builder-panel";
import { HistoryControls } from "@/components/banner-generator/banner-builder/history-controls";
import { QuickActions } from "@/components/banner-generator/banner-builder/quick-actions";
import { QuickStartTemplates } from "@/components/banner-generator/presets/quick-start-templates";
import { BannerPreviewPanel } from "@/components/banner-generator/preview/banner-preview-panel";
import { ResponsivePreview } from "@/components/banner-generator/preview/responsive-preview";
import { BannerResultsPanel } from "@/components/banner-generator/results/banner-results-panel";
import { ApiKeyAlert } from "@/components/generate/api-key-alert";
import { GenerationErrorAlert } from "@/components/generate/generation-error-alert";
import { ThreeColumnLayout } from "@/components/generate/three-column-layout";
import { useApiKey } from "@/hooks/use-api-key";
import { useAvatars } from "@/hooks/use-avatars";
import { useBannerBuilder } from "@/hooks/use-banner-builder";
import { useBannerHistory } from "@/hooks/use-banner-history";
import { useBannerPresets } from "@/hooks/use-banner-presets";
import { useBannerReferences } from "@/hooks/use-banner-references";
import { useGeneration } from "@/hooks/use-generation";
import { useSession } from "@/lib/auth-client";
import type { BannerPreset, BannerPresetConfig, BannerBuilderState } from "@/lib/types/banner";
import { DEFAULT_BANNER_BUILDER_STATE } from "@/lib/types/banner";

export default function BannerGeneratorPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();
  const { hasKey, isLoading: apiKeyLoading } = useApiKey();

  // Avatars state (for logo and product images)
  const { avatars, isLoading: avatarsLoading, getAvatarById } = useAvatars();

  // Banner references state
  const {
    bannerReferences,
    isLoading: bannerReferencesLoading,
    createBannerReference,
    deleteBannerReference,
  } = useBannerReferences();

  // Banner builder state
  const {
    state,
    settings,
    brandAssets,
    setBannerType,
    setBannerSize,
    setIndustry,
    setCustomWidth,
    setCustomHeight,
    setDesignStyle,
    setColorScheme,
    setMood,
    setSeasonal,
    setBackgroundStyle,
    setVisualEffects,
    setIconGraphics,
    setPromotionalElements,
    setLayoutStyle,
    setTextPlacement,
    setTypographyStyle,
    setCtaButtonStyle,
    setHeadline,
    setSubheadline,
    setCtaText,
    setTagline,
    setCustomPrompt,
    setSettings,
    setLogoAvatarId,
    setProductImageAvatarId,
    setBrandAssets,
    assembledPrompt,
    selectedBannerSize,
    hasAnySelection,
    loadFromPreset,
    getCurrentConfig,
    reset,
    swapColors,
    selectedBannerReferenceIds,
    setSelectedBannerReferenceIds,
  } = useBannerBuilder();

  // History state for undo/redo
  const {
    canUndo,
    canRedo,
    historyLength,
    currentIndex,
    pushState,
    undo,
    redo,
    clearHistory,
    getRecentHistory,
  } = useBannerHistory(DEFAULT_BANNER_BUILDER_STATE);

  // Track state changes for history
  const handleStateChange = useCallback(
    (newState: BannerBuilderState, action: string) => {
      pushState(newState, action);
    },
    [pushState]
  );

  // Helper to convert state to preset config
  const stateToConfig = (s: BannerBuilderState): BannerPresetConfig => {
    const config: BannerPresetConfig = {};
    if (s.bannerType) config.bannerType = s.bannerType;
    if (s.bannerSize) config.bannerSize = s.bannerSize;
    if (s.industry) config.industry = s.industry;
    if (s.bannerSize === "size-custom") {
      if (s.customWidth) config.customWidth = s.customWidth;
      if (s.customHeight) config.customHeight = s.customHeight;
    }
    if (s.designStyle) config.designStyle = s.designStyle;
    if (s.colorScheme) config.colorScheme = s.colorScheme;
    if (s.mood) config.mood = s.mood;
    if (s.seasonal) config.seasonal = s.seasonal;
    if (s.backgroundStyle) config.backgroundStyle = s.backgroundStyle;
    if (s.visualEffects) config.visualEffects = s.visualEffects;
    if (s.iconGraphics) config.iconGraphics = s.iconGraphics;
    if (s.promotionalElements) config.promotionalElements = s.promotionalElements;
    if (s.layoutStyle) config.layoutStyle = s.layoutStyle;
    if (s.textPlacement) config.textPlacement = s.textPlacement;
    if (s.typographyStyle) config.typographyStyle = s.typographyStyle;
    if (s.ctaButtonStyle) config.ctaButtonStyle = s.ctaButtonStyle;
    if (s.textContent) config.textContent = s.textContent;
    if (s.customPrompt) config.customPrompt = s.customPrompt;
    return config;
  };

  // Restore state from history
  const handleUndo = useCallback(() => {
    const previousState = undo();
    if (previousState) {
      loadFromPreset(stateToConfig(previousState));
      toast.info("Undo successful");
    }
  }, [undo, loadFromPreset]);

  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState) {
      loadFromPreset(stateToConfig(nextState));
      toast.info("Redo successful");
    }
  }, [redo, loadFromPreset]);

  // Push state to history when it changes significantly
  useEffect(() => {
    // This effect pushes state changes to history
    // We use a simple debounce-like approach by checking if state has content
    if (hasAnySelection) {
      handleStateChange(state, "Configuration updated");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.bannerType, state.bannerSize, state.industry, state.designStyle, state.colorScheme]);

  // Presets state
  const {
    presets,
    isLoading: presetsLoading,
    createPreset,
    deletePreset,
  } = useBannerPresets();

  // Generation state
  const {
    currentGeneration,
    isGenerating,
    isRefining,
    error,
    generate,
    refine,
    clearError,
  } = useGeneration();

  // Handle generation
  const handleGenerate = async () => {
    if (!assembledPrompt) {
      toast.error("Please configure your banner before generating");
      return;
    }

    if (!hasKey) {
      toast.error("Please add your Google API key in your profile");
      return;
    }

    // Get reference images from brand assets (logo and product)
    const referenceImages: { avatarId: string; type: "human" | "object" }[] = [];
    if (brandAssets.logoAvatarId) {
      referenceImages.push({ avatarId: brandAssets.logoAvatarId, type: "object" });
    }
    if (brandAssets.productImageAvatarId) {
      referenceImages.push({ avatarId: brandAssets.productImageAvatarId, type: "object" });
    }

    // Determine aspect ratio from banner size
    const aspectRatio = selectedBannerSize
      ? getAspectRatioForBannerSize(selectedBannerSize.width, selectedBannerSize.height)
      : "1:1";

    const generateInput = {
      prompt: assembledPrompt,
      settings: {
        imageCount: 1 as const,
        resolution: "2K" as const,
        aspectRatio,
      },
      generationType: "banner" as const,
      ...(referenceImages.length > 0 && { referenceImages }),
    };

    const result = await generate(generateInput);

    if (result) {
      toast.success("Banner generated successfully!");
    }
  };

  // Handle refinement
  const handleRefine = async (instruction: string, selectedImageId?: string) => {
    if (!currentGeneration) return;

    const refineInput = {
      generationId: currentGeneration.id,
      instruction,
      ...(selectedImageId && { selectedImageId }),
    };
    const result = await refine(refineInput);

    if (result) {
      toast.success("Refinement complete!");
    }
  };

  // Preset handlers
  const handleSavePreset = async (
    name: string,
    config: BannerPresetConfig
  ): Promise<boolean> => {
    const success = await createPreset(name, config);
    if (success) {
      toast.success(`Preset "${name}" saved successfully!`);
    } else {
      toast.error("Failed to save preset");
    }
    return success;
  };

  const handleLoadPreset = (preset: BannerPreset) => {
    loadFromPreset(preset.config);
    toast.success(`Loaded preset "${preset.name}"`);
  };

  const handleDeletePreset = async (id: string): Promise<boolean> => {
    const preset = presets.find((p) => p.id === id);
    const success = await deletePreset(id);
    if (success) {
      toast.success(`Preset "${preset?.name}" deleted`);
    } else {
      toast.error("Failed to delete preset");
    }
    return success;
  };

  // Get current config for preset saving
  const currentConfig = getCurrentConfig();

  // Get generated image URLs
  const generatedImages = currentGeneration?.images.map((img) => img.imageUrl) ?? [];

  // Auth check
  if (sessionPending || apiKeyLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session) {
    router.push("/");
    return null;
  }

  // Handler for Quick Start template selection
  const handleQuickStartSelect = (config: BannerPresetConfig) => {
    loadFromPreset(config);
    toast.success("Quick start template applied!");
  };

  // Handler for reset
  const handleReset = () => {
    reset();
    clearHistory();
    toast.success("Configuration reset!");
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {/* API Key Alert - Show at top if no key */}
      {!hasKey && (
        <ApiKeyAlert
          title="API Key Required"
          message="You need to add your Google API key to generate banners. Get your key from Google AI Studio."
        />
      )}

      {/* Error Alert */}
      {error && (
        <GenerationErrorAlert
          error={error}
          onDismiss={clearError}
          onRetry={handleGenerate}
        />
      )}

      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between mb-4 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <QuickStartTemplates
            onSelectTemplate={handleQuickStartSelect}
            disabled={isGenerating}
          />
          <ResponsivePreview
            selectedBannerSize={selectedBannerSize}
            disabled={isGenerating}
          />
        </div>
        <div className="flex items-center gap-2">
          <HistoryControls
            canUndo={canUndo}
            canRedo={canRedo}
            historyLength={historyLength}
            currentIndex={currentIndex}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClearHistory={clearHistory}
            recentHistory={getRecentHistory(10)}
            disabled={isGenerating}
          />
          <div className="w-px h-6 bg-border" />
          <QuickActions
            currentConfig={currentConfig}
            brandAssets={brandAssets}
            onLoadConfig={loadFromPreset}
            onReset={handleReset}
            onSwapColors={swapColors}
            hasAnySelection={hasAnySelection}
            disabled={isGenerating}
          />
        </div>
      </div>

      <ThreeColumnLayout
        leftPanel={
          <BannerBuilderPanel
            state={state}
            settings={settings}
            brandAssets={brandAssets}
            onBannerTypeChange={setBannerType}
            onBannerSizeChange={setBannerSize}
            onIndustryChange={setIndustry}
            onCustomWidthChange={setCustomWidth}
            onCustomHeightChange={setCustomHeight}
            onDesignStyleChange={setDesignStyle}
            onColorSchemeChange={setColorScheme}
            onMoodChange={setMood}
            onSeasonalChange={setSeasonal}
            onBackgroundStyleChange={setBackgroundStyle}
            onVisualEffectsChange={setVisualEffects}
            onIconGraphicsChange={setIconGraphics}
            onPromotionalElementsChange={setPromotionalElements}
            onLayoutStyleChange={setLayoutStyle}
            onTextPlacementChange={setTextPlacement}
            onTypographyStyleChange={setTypographyStyle}
            onCtaButtonStyleChange={setCtaButtonStyle}
            onHeadlineChange={setHeadline}
            onSubheadlineChange={setSubheadline}
            onCtaTextChange={setCtaText}
            onTaglineChange={setTagline}
            onCustomPromptChange={setCustomPrompt}
            onLogoChange={setLogoAvatarId}
            onProductImageChange={setProductImageAvatarId}
            onPrimaryColorChange={(color) => {
              if (color !== undefined) {
                setBrandAssets({ primaryColor: color });
              }
            }}
            onSecondaryColorChange={(color) => {
              if (color !== undefined) {
                setBrandAssets({ secondaryColor: color });
              }
            }}
            onAccentColorChange={(color) => {
              if (color !== undefined) {
                setBrandAssets({ accentColor: color });
              }
            }}
            avatars={avatars}
            isLoadingAvatars={avatarsLoading}
            getAvatarById={getAvatarById}
            bannerReferences={bannerReferences}
            selectedBannerReferenceIds={selectedBannerReferenceIds}
            isLoadingBannerReferences={bannerReferencesLoading}
            onBannerReferenceSelectionChange={setSelectedBannerReferenceIds}
            onCreateBannerReference={createBannerReference}
            onDeleteBannerReference={deleteBannerReference}
          />
        }
        middlePanel={
          <BannerPreviewPanel
            assembledPrompt={assembledPrompt}
            settings={settings}
            onSettingsChange={setSettings}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            hasApiKey={hasKey}
            selectedBannerSize={selectedBannerSize}
            currentConfig={currentConfig}
            presets={presets}
            presetsLoading={presetsLoading}
            onSavePreset={handleSavePreset}
            onLoadPreset={handleLoadPreset}
            onDeletePreset={handleDeletePreset}
          />
        }
        rightPanel={
          <BannerResultsPanel
            images={generatedImages}
            isGenerating={isGenerating}
            expectedCount={1}
            generationId={currentGeneration?.id}
            onRefine={handleRefine}
            isRefining={isRefining}
            selectedBannerSize={selectedBannerSize}
            exportFormat={settings.format}
          />
        }
      />
    </div>
  );
}

/**
 * Helper function to determine the closest supported aspect ratio for a banner size
 */
function getAspectRatioForBannerSize(
  width: number,
  height: number
): "1:1" | "16:9" | "9:16" | "4:3" | "3:4" | "21:9" {
  const ratio = width / height;

  // Define aspect ratios and their numerical values
  const aspectRatios: { key: "1:1" | "16:9" | "9:16" | "4:3" | "3:4" | "21:9"; value: number }[] = [
    { key: "1:1", value: 1 },
    { key: "16:9", value: 16 / 9 },
    { key: "9:16", value: 9 / 16 },
    { key: "4:3", value: 4 / 3 },
    { key: "3:4", value: 3 / 4 },
    { key: "21:9", value: 21 / 9 },
  ];

  // Find the closest match
  let closest = aspectRatios[0]!;
  let minDiff = Math.abs(ratio - closest.value);

  for (const ar of aspectRatios) {
    const diff = Math.abs(ratio - ar.value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = ar;
    }
  }

  return closest.key;
}
