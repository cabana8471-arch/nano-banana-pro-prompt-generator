"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiKeyAlert } from "@/components/generate/api-key-alert";
import { GenerationErrorAlert } from "@/components/generate/generation-error-alert";
import { ThreeColumnLayout } from "@/components/generate/three-column-layout";
import { LogoBuilderPanel } from "@/components/logo-generator/logo-builder/logo-builder-panel";
import { LogoPreviewPanel } from "@/components/logo-generator/preview/logo-preview-panel";
import { LogoResultsPanel } from "@/components/logo-generator/results/logo-results-panel";
import { useApiKey } from "@/hooks/use-api-key";
import { useGeneration } from "@/hooks/use-generation";
import { useLogoBuilder } from "@/hooks/use-logo-builder";
import { useLogoHistory } from "@/hooks/use-logo-history";
import { useLogoPresets } from "@/hooks/use-logo-presets";
import { useLogoReferences } from "@/hooks/use-logo-references";
import { useProjects } from "@/hooks/use-projects";
import { usePromptHistory } from "@/hooks/use-prompt-history";
import { useRateLimit } from "@/hooks/use-rate-limit";
import { useSession } from "@/lib/auth-client";
import type {
  LogoPreset,
  LogoPresetConfig,
  LogoBuilderState,
  UpdateLogoPresetInput,
} from "@/lib/types/logo";
import { DEFAULT_LOGO_BUILDER_STATE } from "@/lib/types/logo";
import type { CreateProjectInput } from "@/lib/types/project";

export default function LogoGeneratorPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();
  const { hasKey, isLoading: apiKeyLoading } = useApiKey();

  // Logo references state
  const {
    logoReferences,
    isLoading: logoReferencesLoading,
    createLogoReference,
    deleteLogoReference,
  } = useLogoReferences();

  // Logo builder state
  const {
    state,
    settings,
    setLogoType,
    setIndustry,
    setLogoFormat,
    setDesignStyle,
    setColorSchemeType,
    setMood,
    setIconStyle,
    setSymbolElements,
    setFontCategory,
    setTypographyTreatment,
    setSpecialEffects,
    setBackgroundStyle,
    setCompanyName,
    setTagline,
    setAbbreviation,
    setPrimaryColor,
    setSecondaryColor,
    setAccentColor,
    setCustomPrompt,
    setSettings,
    assembledPrompt,
    hasAnySelection,
    loadFromPreset,
    getCurrentConfig,
    reset,
    swapColors,
    selectedLogoReferenceIds,
    setSelectedLogoReferenceIds,
  } = useLogoBuilder();

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
  } = useLogoHistory(DEFAULT_LOGO_BUILDER_STATE);

  // Suppress unused variable warnings for history features not yet exposed in UI
  void historyLength;
  void currentIndex;
  void getRecentHistory;

  // Track state changes for history
  const handleStateChange = useCallback(
    (newState: LogoBuilderState, action: string) => {
      pushState(newState, action);
    },
    [pushState]
  );

  // Helper to convert state to preset config
  const stateToConfig = (s: LogoBuilderState): LogoPresetConfig => {
    const config: LogoPresetConfig = {};
    if (s.logoType) config.logoType = s.logoType;
    if (s.industry) config.industry = s.industry;
    if (s.logoFormat) config.logoFormat = s.logoFormat;
    if (s.designStyle) config.designStyle = s.designStyle;
    if (s.colorSchemeType) config.colorSchemeType = s.colorSchemeType;
    if (s.mood) config.mood = s.mood;
    if (s.iconStyle) config.iconStyle = s.iconStyle;
    if (s.symbolElements.length > 0) config.symbolElements = s.symbolElements;
    if (s.fontCategory) config.fontCategory = s.fontCategory;
    if (s.typographyTreatment) config.typographyTreatment = s.typographyTreatment;
    if (s.specialEffects) config.specialEffects = s.specialEffects;
    if (s.backgroundStyle) config.backgroundStyle = s.backgroundStyle;
    if (s.textContent) config.textContent = s.textContent;
    if (s.primaryColor) config.primaryColor = s.primaryColor;
    if (s.secondaryColor) config.secondaryColor = s.secondaryColor;
    if (s.accentColor) config.accentColor = s.accentColor;
    if (s.customPrompt) config.customPrompt = s.customPrompt;
    return config;
  };

  // Suppress unused variable warning
  void stateToConfig;

  // Push state to history when it changes significantly
  useEffect(() => {
    if (hasAnySelection) {
      handleStateChange(state, "Configuration updated");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.logoType, state.industry, state.logoFormat, state.designStyle, state.colorSchemeType]);

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      const isMod = e.metaKey || e.ctrlKey;

      // Undo: Cmd/Ctrl + Z (without Shift)
      if (isMod && e.key === "z" && !e.shiftKey && !isInput) {
        e.preventDefault();
        if (canUndo) undo();
      }

      // Redo: Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y
      if (isMod && ((e.key === "z" && e.shiftKey) || e.key === "y") && !isInput) {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  // Presets state
  const {
    presets,
    isLoading: presetsLoading,
    createPreset,
    updatePreset,
    deletePreset,
  } = useLogoPresets();

  // Projects state
  const {
    projects,
    isLoading: projectsLoading,
    createProject,
  } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Edit preset state (for future implementation)
  const [editingPreset, setEditingPreset] = useState<LogoPreset | null>(null);
  void editingPreset;

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

  // Handle generation
  const handleGenerate = async () => {
    if (!assembledPrompt) {
      toast.error("Please configure your logo before generating");
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

    // Logos always use 1:1 aspect ratio
    const generateInput = {
      prompt: assembledPrompt,
      settings: {
        imageCount: settings.logoCount,
        resolution: settings.resolution,
        aspectRatio: "1:1" as const,
      },
      generationType: "logo" as const,
      projectId: selectedProjectId,
    };

    const result = await generate(generateInput);
    refreshRateLimit();

    if (result) {
      addHistoryEntry(assembledPrompt, "logo");
      toast.success("Logo generated successfully!");
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
    config: LogoPresetConfig
  ): Promise<boolean> => {
    const success = await createPreset(name, config);
    if (success) {
      toast.success(`Preset "${name}" saved successfully!`);
    } else {
      toast.error("Failed to save preset");
    }
    return success;
  };

  const handleLoadPreset = (preset: LogoPreset) => {
    loadFromPreset(preset.config);
    toast.success(`Loaded preset "${preset.name}"`);
  };

  const handleUpdatePreset = async (id: string, input: UpdateLogoPresetInput): Promise<boolean> => {
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

  const handlePartialLoadPreset = (config: Partial<LogoPresetConfig>) => {
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

  const handleEditPreset = (preset: LogoPreset) => {
    setEditingPreset(preset);
  };

  const handleComparePresets = () => {
    // Compare presets modal (to be implemented)
    toast.info("Compare presets feature coming soon");
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
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session) {
    router.push("/");
    return null;
  }

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
          message="You need to add your Google API key to generate logos. Get your key from Google AI Studio."
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

      <ThreeColumnLayout
        leftPanel={
          <LogoBuilderPanel
            state={state}
            onLogoTypeChange={setLogoType}
            onIndustryChange={setIndustry}
            onLogoFormatChange={setLogoFormat}
            onDesignStyleChange={setDesignStyle}
            onColorSchemeTypeChange={setColorSchemeType}
            onMoodChange={setMood}
            onIconStyleChange={setIconStyle}
            onSymbolElementsChange={setSymbolElements}
            onFontCategoryChange={setFontCategory}
            onTypographyTreatmentChange={setTypographyTreatment}
            onSpecialEffectsChange={setSpecialEffects}
            onBackgroundStyleChange={setBackgroundStyle}
            onCompanyNameChange={setCompanyName}
            onTaglineChange={setTagline}
            onAbbreviationChange={setAbbreviation}
            onPrimaryColorChange={setPrimaryColor}
            onSecondaryColorChange={setSecondaryColor}
            onAccentColorChange={setAccentColor}
            onSwapColors={swapColors}
            onCustomPromptChange={setCustomPrompt}
            logoReferences={logoReferences}
            selectedLogoReferenceIds={selectedLogoReferenceIds}
            isLoadingLogoReferences={logoReferencesLoading}
            onLogoReferenceSelectionChange={setSelectedLogoReferenceIds}
            onCreateLogoReference={createLogoReference}
            onDeleteLogoReference={deleteLogoReference}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
            onReset={handleReset}
          />
        }
        middlePanel={
          <LogoPreviewPanel
            assembledPrompt={assembledPrompt}
            settings={settings}
            onSettingsChange={setSettings}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            hasApiKey={hasKey}
            selectedLogoFormat={state.logoFormat}
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
          <LogoResultsPanel
            images={generatedImages}
            isGenerating={isGenerating}
            expectedCount={settings.logoCount}
            generationId={currentGeneration?.id}
            onRefine={handleRefine}
            isRefining={isRefining}
            exportFormat={settings.format}
            projects={projects}
            projectsLoading={projectsLoading}
            currentProjectId={currentGeneration?.projectId}
            onAddToProject={handleAddToProject}
            onCreateProject={handleCreateProject}
          />
        }
      />
    </div>
  );
}
