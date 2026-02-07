"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { BannerBuilderPanel } from "@/components/banner-generator/banner-builder/banner-builder-panel";
import { HistoryControls } from "@/components/banner-generator/banner-builder/history-controls";
import { QuickActions } from "@/components/banner-generator/banner-builder/quick-actions";
import { BannerErrorBoundary } from "@/components/banner-generator/banner-error-boundary";
import { ComparePresetsModal } from "@/components/banner-generator/presets/compare-presets-modal";
import { EditBannerPresetSheet } from "@/components/banner-generator/presets/edit-banner-preset-sheet";
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
import { usePlatformGeneration } from "@/hooks/use-platform-generation";
import { useProjects } from "@/hooks/use-projects";
import { usePromptHistory } from "@/hooks/use-prompt-history";
import { useRateLimit } from "@/hooks/use-rate-limit";
import { useSession } from "@/lib/auth-client";
import { isPlatformBundle, getPlatformBundleSizes, getBannerTemplateById, getBannerSizeById } from "@/lib/data/banner-templates";
import type { BannerPreset, BannerPresetConfig, BannerBuilderState, UpdateBannerPresetInput, BannerSizeTemplate } from "@/lib/types/banner";
import { DEFAULT_BANNER_BUILDER_STATE } from "@/lib/types/banner";
import type { CreateProjectInput } from "@/lib/types/project";

export default function BannerGeneratorPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();
  const t = useTranslations("bannerGenerator");
  const { hasKey, isLoading: apiKeyLoading } = useApiKey();

  // Avatars state (for logo and product images) - auto-refresh when window gains focus
  const { avatars, isLoading: avatarsLoading, getAvatarById } = useAvatars({ autoRefresh: true });

  // Banner references state - auto-refresh when window gains focus
  const {
    bannerReferences,
    isLoading: bannerReferencesLoading,
    createBannerReference,
    deleteBannerReference,
  } = useBannerReferences({ autoRefresh: true });

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
    setTextLanguage,
    setTextPlacement,
    setTypographyStyle,
    setHeadlineTypography,
    setBodyTypography,
    setCtaTypography,
    setCtaButtonStyle,
    setHeadline,
    setSubheadline,
    setCtaText,
    setTagline,
    setCustomPrompt,
    setProductSwapMode,
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
    if (s.textLanguage) config.textLanguage = s.textLanguage;
    if (s.textPlacement) config.textPlacement = s.textPlacement;
    if (s.typographyStyle) config.typographyStyle = s.typographyStyle;
    if (s.headlineTypography) config.headlineTypography = s.headlineTypography;
    if (s.bodyTypography) config.bodyTypography = s.bodyTypography;
    if (s.ctaTypography) config.ctaTypography = s.ctaTypography;
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
    updatePreset,
    deletePreset,
  } = useBannerPresets();

  // Projects state
  const {
    projects,
    isLoading: projectsLoading,
    createProject,
  } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Compare & Edit preset modal state
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<BannerPreset | null>(null);

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

  // Rate limit status
  const { status: rateLimit, refresh: refreshRateLimit } = useRateLimit();

  // Prompt history
  const { addEntry: addHistoryEntry } = usePromptHistory();

  // Platform generation state (for multi-size native generation)
  const {
    progress: platformProgress,
    generateForPlatform,
    cancelGeneration: cancelPlatformGeneration,
    reset: resetPlatformGeneration,
    allImages: platformImages,
  } = usePlatformGeneration();

  // Check if current selection is a platform bundle
  const isPlatformBundleSelected = useMemo(() => {
    return state.bannerSize ? isPlatformBundle(state.bannerSize) : false;
  }, [state.bannerSize]);

  // Get platform bundle sizes if selected
  const platformBundleSizes = useMemo(() => {
    if (!isPlatformBundleSelected || !state.bannerSize) return [];
    return getPlatformBundleSizes(state.bannerSize);
  }, [isPlatformBundleSelected, state.bannerSize]);

  // Build prompt for a specific size (used for platform bundle generation)
  const buildPromptForSize = useCallback((size: BannerSizeTemplate): string => {
    const parts: string[] = [];

    // Start with a base banner prompt
    parts.push("Professional web banner design");

    // Add banner type/purpose
    if (state.bannerType) {
      const template = getBannerTemplateById(state.bannerType);
      if (template) parts.push(template.promptFragment);
    }

    // Add industry/niche context
    if (state.industry) {
      const template = getBannerTemplateById(state.industry);
      if (template) parts.push(template.promptFragment);
    }

    // Add design style
    if (state.designStyle) {
      const template = getBannerTemplateById(state.designStyle);
      if (template) parts.push(template.promptFragment);
    }

    // Add color scheme
    if (state.colorScheme) {
      const template = getBannerTemplateById(state.colorScheme);
      if (template) parts.push(template.promptFragment);
    }

    // Add mood/emotion
    if (state.mood) {
      const template = getBannerTemplateById(state.mood);
      if (template) parts.push(template.promptFragment);
    }

    // Add seasonal/holiday theme
    if (state.seasonal) {
      const template = getBannerTemplateById(state.seasonal);
      if (template) parts.push(template.promptFragment);
    }

    // Add background style
    if (state.backgroundStyle) {
      const template = getBannerTemplateById(state.backgroundStyle);
      if (template) parts.push(template.promptFragment);
    }

    // Add visual effects
    if (state.visualEffects) {
      const template = getBannerTemplateById(state.visualEffects);
      if (template) parts.push(template.promptFragment);
    }

    // Add icon/graphics
    if (state.iconGraphics) {
      const template = getBannerTemplateById(state.iconGraphics);
      if (template) parts.push(template.promptFragment);
    }

    // Add promotional elements
    if (state.promotionalElements) {
      const template = getBannerTemplateById(state.promotionalElements);
      if (template) parts.push(template.promptFragment);
    }

    // Add layout style
    if (state.layoutStyle) {
      const template = getBannerTemplateById(state.layoutStyle);
      if (template) parts.push(template.promptFragment);
    }

    // Add text language
    if (state.textLanguage) {
      const template = getBannerTemplateById(state.textLanguage);
      if (template) parts.push(template.promptFragment);
    }

    // Add text placement
    if (state.textPlacement) {
      const template = getBannerTemplateById(state.textPlacement);
      if (template) parts.push(template.promptFragment);
    }

    // Add typography style
    if (state.typographyStyle) {
      const template = getBannerTemplateById(state.typographyStyle);
      if (template) parts.push(template.promptFragment);
    }

    // Add CTA button style
    if (state.ctaButtonStyle) {
      const template = getBannerTemplateById(state.ctaButtonStyle);
      if (template) parts.push(template.promptFragment);
    }

    // Add size-specific context
    parts.push(size.promptFragment);
    parts.push(
      `IMPORTANT: The generated image MUST be exactly ${size.width}x${size.height} pixels. Do not deviate from these exact dimensions.`
    );

    // Add text content
    const textParts: string[] = [];
    if (state.textContent.headline) {
      textParts.push(`headline text: "${state.textContent.headline}"`);
    }
    if (state.textContent.subheadline) {
      textParts.push(`subheadline text: "${state.textContent.subheadline}"`);
    }
    if (state.textContent.ctaText) {
      textParts.push(`call-to-action button with text: "${state.textContent.ctaText}"`);
    }
    if (state.textContent.tagline) {
      textParts.push(`tagline or offer text: "${state.textContent.tagline}"`);
    }

    if (textParts.length > 0) {
      parts.push(`Text elements: ${textParts.join(", ")}`);
    }

    // Add brand colors if specified
    if (brandAssets.primaryColor || brandAssets.secondaryColor || brandAssets.accentColor) {
      const colorParts: string[] = [];
      if (brandAssets.primaryColor) {
        colorParts.push(`primary brand color ${brandAssets.primaryColor}`);
      }
      if (brandAssets.secondaryColor) {
        colorParts.push(`secondary color ${brandAssets.secondaryColor}`);
      }
      if (brandAssets.accentColor) {
        colorParts.push(`accent color ${brandAssets.accentColor}`);
      }
      parts.push(`Using ${colorParts.join(", ")}`);
    }

    // Add custom prompt at the end
    if (state.customPrompt) {
      parts.push(state.customPrompt);
    }

    // Final quality instructions
    parts.push("High quality, professional advertising design, clean and impactful");

    return parts.filter(Boolean).join(". ");
  }, [state, brandAssets]);

  // Handle generation (supports both single and platform bundle)
  const handleGenerate = async () => {
    if (!assembledPrompt) {
      toast.error("Please configure your banner before generating");
      return;
    }

    if (!hasKey) {
      toast.error("Please add your Google API key in your profile");
      return;
    }

    if (!selectedProjectId) {
      toast.error("Please select a project before generating");
      return;
    }

    // Build reference images for generation
    // Type can include avatarId (for avatars) or imageUrl (for banner references)
    const referenceImages: {
      avatarId?: string;
      imageUrl?: string;
      type: "human" | "object" | "reference" | "product";
    }[] = [];

    // In Product Swap Mode, add banner reference first (as design template)
    if (state.productSwapMode && selectedBannerReferenceIds.length > 0) {
      const selectedBannerRef = bannerReferences.find((r) =>
        selectedBannerReferenceIds.includes(r.id)
      );
      if (selectedBannerRef) {
        referenceImages.push({
          imageUrl: selectedBannerRef.imageUrl,
          type: "reference",
        });
      }
    }

    // Add product image (as "product" type in Product Swap mode, "object" otherwise)
    if (brandAssets.productImageAvatarId) {
      referenceImages.push({
        avatarId: brandAssets.productImageAvatarId,
        type: state.productSwapMode ? "product" : "object",
      });
    }

    // Add logo
    if (brandAssets.logoAvatarId) {
      referenceImages.push({ avatarId: brandAssets.logoAvatarId, type: "object" });
    }

    // Check if this is a platform bundle generation
    if (isPlatformBundleSelected && platformBundleSizes.length > 0) {
      // Reset previous platform generation
      resetPlatformGeneration();

      // Get the bundle template for toast message
      const bundleTemplate = getBannerSizeById(state.bannerSize);
      toast.info(`Generating ${platformBundleSizes.length} banner sizes for ${bundleTemplate?.name || "platform"}...`);

      // Generate for all platform sizes
      await generateForPlatform(
        platformBundleSizes,
        {
          prompt: "", // Will be built per size
          settings: {
            imageCount: 1, // Always 1 per size for platform bundle
            resolution: settings.resolution,
            aspectRatio: "1:1", // Will be calculated per size
          },
          generationType: "banner",
          projectId: selectedProjectId,
          ...(referenceImages.length > 0 && { referenceImages }),
        },
        buildPromptForSize
      );

      addHistoryEntry(assembledPrompt, "banner");
      toast.success(`Platform generation completed! ${platformBundleSizes.length} banners generated.`);
      refreshRateLimit();
      return;
    }

    // Regular single-size generation
    const aspectRatio = selectedBannerSize
      ? getAspectRatioForBannerSize(selectedBannerSize.width, selectedBannerSize.height)
      : "1:1";

    const generateInput = {
      prompt: assembledPrompt,
      settings: {
        imageCount: settings.bannerCount,
        resolution: settings.resolution,
        aspectRatio,
      },
      generationType: "banner" as const,
      projectId: selectedProjectId,
      ...(referenceImages.length > 0 && { referenceImages }),
    };

    const result = await generate(generateInput);
    refreshRateLimit();

    if (result) {
      addHistoryEntry(assembledPrompt, "banner");
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

  const handleUpdatePreset = async (id: string, input: UpdateBannerPresetInput): Promise<boolean> => {
    const preset = presets.find((p) => p.id === id);
    const success = await updatePreset(id, input);
    if (success) {
      toast.success(`Preset "${preset?.name}" updated`);
    } else {
      toast.error("Failed to update preset");
    }
    return success;
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

  const handlePartialLoadPreset = (config: Partial<BannerPresetConfig>) => {
    loadFromPreset(config);
    toast.success("Partial preset loaded");
  };

  const handleDuplicatePreset = async (id: string, newName?: string): Promise<boolean> => {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return false;
    const duplicateName = newName || `${preset.name} (Copy)`;
    const success = await createPreset(duplicateName, preset.config);
    if (success) {
      toast.success(`Preset duplicated as "${duplicateName}"`);
    } else {
      toast.error("Failed to duplicate preset");
    }
    return success;
  };

  const handleEditPreset = (preset: BannerPreset) => {
    setEditingPreset(preset);
  };

  const handleComparePresets = () => {
    setCompareModalOpen(true);
  };

  const handleSaveEditedPreset = async (id: string, input: UpdateBannerPresetInput): Promise<boolean> => {
    const success = await updatePreset(id, input);
    if (success) {
      toast.success(`Preset "${input.name || 'Preset'}" updated successfully!`);
      setEditingPreset(null);
    } else {
      toast.error("Failed to update preset");
    }
    return success;
  };

  // Project handlers
  const handleCreateProject = async (input: CreateProjectInput) => {
    const project = await createProject(input);
    if (project) {
      toast.success(`Project "${input.name}" created!`);
      setSelectedProjectId(project.id);
    } else {
      toast.error("Failed to create project");
    }
    return project;
  };

  const handleAddToProject = async (generationId: string, projectId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/generations/${generationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      if (response.ok) {
        const project = projects.find((p) => p.id === projectId);
        toast.success(`Added to project "${project?.name}"`);
        return true;
      }
      toast.error("Failed to add to project");
      return false;
    } catch {
      toast.error("Failed to add to project");
      return false;
    }
  };

  // Get current config for preset saving
  const currentConfig = getCurrentConfig();

  // Get generated image URLs
  const generatedImages = currentGeneration?.images.map((img) => img.imageUrl) ?? [];

  // Auth check
  if (sessionPending || apiKeyLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">{t("loading")}</span>
        </div>
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
    <BannerErrorBoundary>
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
            onTextLanguageChange={setTextLanguage}
            onTextPlacementChange={setTextPlacement}
            onTypographyStyleChange={setTypographyStyle}
            onHeadlineTypographyChange={setHeadlineTypography}
            onBodyTypographyChange={setBodyTypography}
            onCtaTypographyChange={setCtaTypography}
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
            productSwapMode={state.productSwapMode}
            onProductSwapModeChange={setProductSwapMode}
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
            rateLimit={rateLimit}
            currentConfig={currentConfig}
            presets={presets}
            presetsLoading={presetsLoading}
            onSavePreset={handleSavePreset}
            onLoadPreset={handleLoadPreset}
            onPartialLoadPreset={handlePartialLoadPreset}
            onUpdatePreset={handleUpdatePreset}
            onDeletePreset={handleDeletePreset}
            onDuplicatePreset={handleDuplicatePreset}
            onEditPreset={handleEditPreset}
            onComparePresets={handleComparePresets}
            projects={projects}
            projectsLoading={projectsLoading}
            selectedProjectId={selectedProjectId}
            onProjectChange={setSelectedProjectId}
            onCreateProject={handleCreateProject}
          />
        }
        rightPanel={
          <BannerResultsPanel
            images={generatedImages}
            isGenerating={isGenerating || platformProgress.isGenerating}
            expectedCount={isPlatformBundleSelected ? platformBundleSizes.length : settings.bannerCount}
            generationId={currentGeneration?.id}
            onRefine={handleRefine}
            isRefining={isRefining}
            selectedBannerSize={selectedBannerSize}
            exportFormat={settings.format}
            projects={projects}
            projectsLoading={projectsLoading}
            currentProjectId={currentGeneration?.projectId}
            onAddToProject={handleAddToProject}
            onCreateProject={handleCreateProject}
            platformProgress={platformProgress}
            platformImages={platformImages}
            onCancelPlatformGeneration={cancelPlatformGeneration}
          />
        }
      />

      {/* Compare Presets Modal */}
      <ComparePresetsModal
        presets={presets}
        open={compareModalOpen}
        onOpenChange={setCompareModalOpen}
        onLoad={handleLoadPreset}
      />

        {/* Edit Preset Sheet */}
        <EditBannerPresetSheet
          preset={editingPreset}
          open={!!editingPreset}
          onOpenChange={(open) => !open && setEditingPreset(null)}
          onSave={handleSaveEditedPreset}
          onDuplicate={handleDuplicatePreset}
        />
      </div>
    </BannerErrorBoundary>
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
