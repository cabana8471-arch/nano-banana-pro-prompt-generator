"use client";

import { useState, useCallback } from "react";
import type { BannerSizeTemplate } from "@/lib/types/banner";
import type {
  GenerationSettings,
  GenerationWithImages,
  AvatarType,
  GenerationType,
} from "@/lib/types/generation";

/**
 * Progress state for platform bundle generation
 */
export interface PlatformGenerationProgress {
  /** Total number of sizes to generate */
  total: number;
  /** Current size index (0-based) */
  current: number;
  /** Current size being generated */
  currentSize: BannerSizeTemplate | null;
  /** Completed generations */
  completed: {
    size: BannerSizeTemplate;
    generation: GenerationWithImages;
    images: string[];
  }[];
  /** Failed generations */
  failed: {
    size: BannerSizeTemplate;
    error: string;
  }[];
  /** Whether generation is in progress */
  isGenerating: boolean;
  /** Overall status */
  status: "idle" | "generating" | "completed" | "error";
}

interface GenerateInput {
  prompt: string;
  settings: GenerationSettings;
  generationType?: GenerationType;
  referenceImages?: {
    avatarId?: string;
    imageUrl?: string;
    type: AvatarType;
  }[];
  projectId?: string;
}

interface UsePlatformGenerationReturn {
  progress: PlatformGenerationProgress;
  generateForPlatform: (
    sizes: BannerSizeTemplate[],
    baseInput: GenerateInput,
    buildPromptForSize: (size: BannerSizeTemplate) => string
  ) => Promise<void>;
  cancelGeneration: () => void;
  reset: () => void;
  /** All generated images from all sizes */
  allImages: string[];
  /** All generations from platform bundle */
  allGenerations: GenerationWithImages[];
}

const initialProgress: PlatformGenerationProgress = {
  total: 0,
  current: 0,
  currentSize: null,
  completed: [],
  failed: [],
  isGenerating: false,
  status: "idle",
};

/**
 * Helper function to determine the closest supported aspect ratio for a banner size
 */
function getAspectRatioForBannerSize(
  width: number,
  height: number
): "1:1" | "16:9" | "9:16" | "4:3" | "3:4" | "21:9" {
  const ratio = width / height;

  const aspectRatios: { key: "1:1" | "16:9" | "9:16" | "4:3" | "3:4" | "21:9"; value: number }[] = [
    { key: "1:1", value: 1 },
    { key: "16:9", value: 16 / 9 },
    { key: "9:16", value: 9 / 16 },
    { key: "4:3", value: 4 / 3 },
    { key: "3:4", value: 3 / 4 },
    { key: "21:9", value: 21 / 9 },
  ];

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

export function usePlatformGeneration(): UsePlatformGenerationReturn {
  const [progress, setProgress] = useState<PlatformGenerationProgress>(initialProgress);
  const [cancelled, setCancelled] = useState(false);

  const generateForPlatform = useCallback(
    async (
      sizes: BannerSizeTemplate[],
      baseInput: GenerateInput,
      buildPromptForSize: (size: BannerSizeTemplate) => string
    ): Promise<void> => {
      if (sizes.length === 0) return;

      setCancelled(false);
      setProgress({
        total: sizes.length,
        current: 0,
        currentSize: sizes[0] ?? null,
        completed: [],
        failed: [],
        isGenerating: true,
        status: "generating",
      });

      const completed: PlatformGenerationProgress["completed"] = [];
      const failed: PlatformGenerationProgress["failed"] = [];

      for (let i = 0; i < sizes.length; i++) {
        // Check if cancelled
        if (cancelled) {
          break;
        }

        const size = sizes[i];
        if (!size) continue;

        setProgress((prev) => ({
          ...prev,
          current: i,
          currentSize: size,
        }));

        try {
          // Build prompt for this specific size
          const sizePrompt = buildPromptForSize(size);

          // Calculate aspect ratio for this size
          const aspectRatio = getAspectRatioForBannerSize(size.width, size.height);

          const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...baseInput,
              prompt: sizePrompt,
              settings: {
                ...baseInput.settings,
                aspectRatio,
                imageCount: 1, // Always 1 for platform bundle generation
              },
            }),
          });

          // Handle timeout or non-JSON responses
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            // Check for Vercel timeout
            if (text.includes("timed out") || response.status === 504) {
              throw new Error(
                "Generation timed out. Try a simpler prompt or reduce image complexity."
              );
            }
            throw new Error(text || "Server returned an invalid response");
          }

          const data = await response.json();

          if (!response.ok) {
            failed.push({
              size,
              error: data.error || "Failed to generate",
            });
          } else {
            const generation = data.generation as GenerationWithImages;
            completed.push({
              size,
              generation,
              images: generation.images.map((img) => img.imageUrl),
            });
          }
        } catch (err) {
          failed.push({
            size,
            error: err instanceof Error ? err.message : "Unknown error",
          });
        }

        // Update progress after each generation
        setProgress((prev) => ({
          ...prev,
          current: i + 1,
          completed: [...completed],
          failed: [...failed],
        }));

        // Small delay between generations to avoid rate limiting
        if (i < sizes.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      // Final state
      setProgress((prev) => ({
        ...prev,
        isGenerating: false,
        currentSize: null,
        status: failed.length === sizes.length ? "error" : "completed",
      }));
    },
    [cancelled]
  );

  const cancelGeneration = useCallback(() => {
    setCancelled(true);
  }, []);

  const reset = useCallback(() => {
    setCancelled(false);
    setProgress(initialProgress);
  }, []);

  // Compute all images from completed generations
  const allImages = progress.completed.flatMap((c) => c.images);
  const allGenerations = progress.completed.map((c) => c.generation);

  return {
    progress,
    generateForPlatform,
    cancelGeneration,
    reset,
    allImages,
    allGenerations,
  };
}
