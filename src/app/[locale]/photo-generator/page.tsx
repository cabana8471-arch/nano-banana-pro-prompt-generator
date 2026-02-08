"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiKeyAlert } from "@/components/generate/api-key-alert";
import { GenerationErrorAlert } from "@/components/generate/generation-error-alert";
import { PreviewPanel } from "@/components/generate/preview/preview-panel";
import { PromptBuilderPanel } from "@/components/generate/prompt-builder/prompt-builder-panel";
import { ResultsPanel } from "@/components/generate/results/results-panel";
import { ThreeColumnLayout } from "@/components/generate/three-column-layout";
import { GettingStarted } from "@/components/onboarding/getting-started";
import { useApiKey } from "@/hooks/use-api-key";
import { useGenerateShortcut } from "@/hooks/use-generate-shortcut";
import { useGeneration } from "@/hooks/use-generation";
import { useNotifications } from "@/hooks/use-notifications";
import { useOnboarding } from "@/hooks/use-onboarding";
import { usePresets } from "@/hooks/use-presets";
import { useProjects } from "@/hooks/use-projects";
import { usePromptBuilder } from "@/hooks/use-prompt-builder";
import { usePromptHistory } from "@/hooks/use-prompt-history";
import { useRateLimit } from "@/hooks/use-rate-limit";
import { useSession } from "@/lib/auth-client";
import type { Preset, PresetConfig, UpdatePresetInput } from "@/lib/types/generation";
import type { CreateProjectInput } from "@/lib/types/project";

export default function GeneratePage() {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();
  const { hasKey, isLoading: apiKeyLoading } = useApiKey();

  // Prompt builder state
  const {
    state,
    settings,
    setLocation,
    setLighting,
    setCamera,
    setStyle,
    setCustomPrompt,
    setSettings,
    addSubject,
    removeSubject,
    updateSubject,
    linkAvatarToSubject,
    assembledPrompt,
    loadFromPreset,
    loadFromTemplate,
  } = usePromptBuilder();

  // Presets state
  const {
    presets,
    isLoading: presetsLoading,
    createPreset,
    updatePreset,
    deletePreset,
  } = usePresets();

  // Projects state
  const {
    projects,
    isLoading: projectsLoading,
    createProject,
  } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

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
  const { history: promptHistory, addEntry: addHistoryEntry, removeEntry: removeHistoryEntry, clearHistory } = usePromptHistory();

  // Browser notifications
  const { notify, requestPermission } = useNotifications();

  // Onboarding
  const { status: onboardingStatus, shouldShow: showOnboarding, dismiss: dismissOnboarding } = useOnboarding(hasKey);

  // Check for config to load from gallery "Use these settings"
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("nano-banana:load-config");
      if (stored) {
        sessionStorage.removeItem("nano-banana:load-config");
        const { type, config } = JSON.parse(stored);
        if (type === "photo" && config) {
          loadFromPreset(config);
          toast.success("Settings loaded from previous generation");
        }
      }
    } catch {
      // Ignore errors
    }
  }, [loadFromPreset]);

  // Handle generation
  const handleGenerate = async () => {
    if (!assembledPrompt) {
      toast.error("Please build a prompt before generating");
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

    // Get reference images from subjects with avatars
    const referenceImages = state.subjects
      .filter((s) => s.avatarId)
      .map((s) => ({
        avatarId: s.avatarId!,
        type: "human" as const, // We'll need to get the actual type from the avatar
      }));

    const generateInput = {
      prompt: assembledPrompt,
      settings,
      generationType: "photo" as const,
      projectId: selectedProjectId,
      builderConfig: state as unknown as Record<string, unknown>,
      ...(referenceImages.length > 0 && { referenceImages }),
    };
    const result = await generate(generateInput);
    refreshRateLimit();

    if (result) {
      addHistoryEntry(assembledPrompt, "photo");
      toast.success("Images generated successfully!");
      notify("Nano Banana Pro", { body: "Images generated successfully!" });
    }
  };

  // Keyboard shortcut: Ctrl/Cmd + Enter to generate
  useGenerateShortcut(handleGenerate);

  // Request notification permission on first generate attempt
  const handleGenerateWithPermission = async () => {
    requestPermission();
    return handleGenerate();
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
  const handleSavePreset = async (name: string, config: PresetConfig): Promise<boolean> => {
    const success = await createPreset(name, config);
    if (success) {
      toast.success(`Preset "${name}" saved successfully!`);
    } else {
      toast.error("Failed to save preset");
    }
    return success;
  };

  const handleLoadPreset = (preset: Preset) => {
    // Convert PresetConfig to PromptBuilderState (fill in defaults for optional fields)
    loadFromPreset({
      location: preset.config.location ?? "",
      lighting: preset.config.lighting ?? "",
      camera: preset.config.camera ?? "",
      style: preset.config.style ?? "",
      subjects: preset.config.subjects,
      customPrompt: preset.config.customPrompt ?? "",
    });
    toast.success(`Loaded preset "${preset.name}"`);
  };

  const handleUpdatePreset = async (id: string, input: UpdatePresetInput): Promise<boolean> => {
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

  // Get current config for preset saving
  const currentConfig: PresetConfig = {
    ...(state.location && { location: state.location }),
    ...(state.lighting && { lighting: state.lighting }),
    ...(state.camera && { camera: state.camera }),
    ...(state.style && { style: state.style }),
    subjects: state.subjects,
    ...(state.customPrompt && { customPrompt: state.customPrompt }),
  };

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

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Onboarding Checklist */}
      {showOnboarding && (
        <GettingStarted status={onboardingStatus} onDismiss={dismissOnboarding} />
      )}

      {/* API Key Alert - Show at top if no key */}
      {!hasKey && (
        <ApiKeyAlert
          title="API Key Required"
          message="You need to add your Google API key to generate images. Get your key from Google AI Studio."
        />
      )}

      {/* Error Alert */}
      {error && (
        <GenerationErrorAlert
          error={error}
          onDismiss={clearError}
          onRetry={handleGenerateWithPermission}
        />
      )}

      <ThreeColumnLayout
        leftPanel={
          <PromptBuilderPanel
            location={state.location}
            lighting={state.lighting}
            camera={state.camera}
            style={state.style}
            customPrompt={state.customPrompt}
            onLocationChange={setLocation}
            onLightingChange={setLighting}
            onCameraChange={setCamera}
            onStyleChange={setStyle}
            onCustomPromptChange={setCustomPrompt}
            subjects={state.subjects}
            onAddSubject={addSubject}
            onRemoveSubject={removeSubject}
            onUpdateSubject={updateSubject}
            onLinkAvatarToSubject={linkAvatarToSubject}
            onLoadTemplate={loadFromTemplate}
          />
        }
        middlePanel={
          <PreviewPanel
            assembledPrompt={assembledPrompt}
            settings={settings}
            onSettingsChange={setSettings}
            onGenerate={handleGenerateWithPermission}
            isGenerating={isGenerating}
            hasApiKey={hasKey}
            rateLimit={rateLimit}
            promptHistory={promptHistory}
            onSelectHistoryPrompt={setCustomPrompt}
            onRemoveHistoryEntry={removeHistoryEntry}
            onClearHistory={clearHistory}
            historyFilterType="photo"
            currentConfig={currentConfig}
            presets={presets}
            presetsLoading={presetsLoading}
            onSavePreset={handleSavePreset}
            onLoadPreset={handleLoadPreset}
            onUpdatePreset={handleUpdatePreset}
            onDeletePreset={handleDeletePreset}
            projects={projects}
            projectsLoading={projectsLoading}
            selectedProjectId={selectedProjectId}
            onProjectChange={setSelectedProjectId}
            onCreateProject={handleCreateProject}
          />
        }
        rightPanel={
          <ResultsPanel
            images={generatedImages}
            isGenerating={isGenerating}
            expectedCount={settings.imageCount}
            generationId={currentGeneration?.id}
            onRefine={handleRefine}
            isRefining={isRefining}
            onRegenerate={handleGenerateWithPermission}
          />
        }
      />
    </div>
  );
}
