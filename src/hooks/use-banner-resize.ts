import { useCallback } from "react";

/**
 * Resize mode options
 * - cover: Scales image to cover target dimensions, cropping if necessary (maintains aspect ratio)
 * - contain: Scales image to fit within target dimensions, may have letterboxing (maintains aspect ratio)
 * - stretch: Stretches image to exactly match target dimensions (may distort aspect ratio)
 */
export type ResizeMode = "cover" | "contain" | "stretch";

/**
 * Options for resizing an image
 */
export interface ResizeOptions {
  /** Target width in pixels */
  targetWidth: number;
  /** Target height in pixels */
  targetHeight: number;
  /** Resize mode - how to handle aspect ratio differences */
  mode?: ResizeMode;
  /** Background color for letterboxing in contain mode (default: transparent) */
  backgroundColor?: string;
  /** Output format */
  format?: "png" | "jpg" | "webp";
  /** Quality for jpg/webp (0-1, default: 0.92) */
  quality?: number;
}

/**
 * Load an image from a URL and return an HTMLImageElement
 */
async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

/**
 * Get MIME type from format
 */
function getMimeType(format: "png" | "jpg" | "webp"): string {
  switch (format) {
    case "jpg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    default:
      return "image/png";
  }
}

/**
 * Hook for resizing banner images to exact dimensions
 *
 * This hook provides functionality to resize images to specific dimensions,
 * ensuring that banner exports match the expected size regardless of what
 * the AI generation produces.
 */
export function useBannerResize() {
  /**
   * Resize an image to exact target dimensions
   */
  const resizeImage = useCallback(
    async (imageUrl: string, options: ResizeOptions): Promise<Blob> => {
      const {
        targetWidth,
        targetHeight,
        mode = "cover",
        backgroundColor = "transparent",
        format = "png",
        quality = 0.92,
      } = options;

      // Load the source image
      const img = await loadImage(imageUrl);
      const srcWidth = img.width;
      const srcHeight = img.height;

      // Create canvas with target dimensions
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      // Fill background for contain mode or when using non-transparent background
      if (backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      // Calculate draw dimensions based on mode
      let drawWidth: number;
      let drawHeight: number;
      let drawX: number;
      let drawY: number;

      const srcAspect = srcWidth / srcHeight;
      const targetAspect = targetWidth / targetHeight;

      switch (mode) {
        case "cover": {
          // Scale to cover entire target area, cropping excess
          if (srcAspect > targetAspect) {
            // Source is wider - fit height, crop width
            drawHeight = targetHeight;
            drawWidth = srcWidth * (targetHeight / srcHeight);
          } else {
            // Source is taller - fit width, crop height
            drawWidth = targetWidth;
            drawHeight = srcHeight * (targetWidth / srcWidth);
          }
          // Center the image
          drawX = (targetWidth - drawWidth) / 2;
          drawY = (targetHeight - drawHeight) / 2;
          break;
        }

        case "contain": {
          // Scale to fit within target area, may have letterboxing
          if (srcAspect > targetAspect) {
            // Source is wider - fit width, letterbox height
            drawWidth = targetWidth;
            drawHeight = srcHeight * (targetWidth / srcWidth);
          } else {
            // Source is taller - fit height, letterbox width
            drawHeight = targetHeight;
            drawWidth = srcWidth * (targetHeight / srcHeight);
          }
          // Center the image
          drawX = (targetWidth - drawWidth) / 2;
          drawY = (targetHeight - drawHeight) / 2;
          break;
        }

        case "stretch":
        default: {
          // Stretch to exactly fill target dimensions
          drawWidth = targetWidth;
          drawHeight = targetHeight;
          drawX = 0;
          drawY = 0;
          break;
        }
      }

      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw the image
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      // Convert to blob
      const mimeType = getMimeType(format);
      const finalQuality = format === "png" ? undefined : quality;

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create image blob"));
            }
          },
          mimeType,
          finalQuality
        );
      });
    },
    []
  );

  /**
   * Check if an image matches the expected dimensions
   */
  const checkImageDimensions = useCallback(
    async (
      imageUrl: string,
      expectedWidth: number,
      expectedHeight: number
    ): Promise<{ matches: boolean; actualWidth: number; actualHeight: number }> => {
      const img = await loadImage(imageUrl);
      return {
        matches: img.width === expectedWidth && img.height === expectedHeight,
        actualWidth: img.width,
        actualHeight: img.height,
      };
    },
    []
  );

  /**
   * Resize image only if it doesn't match expected dimensions
   */
  const resizeIfNeeded = useCallback(
    async (
      imageUrl: string,
      options: ResizeOptions
    ): Promise<{ blob: Blob; wasResized: boolean }> => {
      const { targetWidth, targetHeight } = options;

      // Check current dimensions
      const dimensionCheck = await checkImageDimensions(imageUrl, targetWidth, targetHeight);

      if (dimensionCheck.matches) {
        // Image already has correct dimensions, just fetch and convert format if needed
        const response = await fetch(imageUrl);
        const originalBlob = await response.blob();

        // If format conversion is needed, still process through canvas
        if (options.format && options.format !== "png") {
          const resizedBlob = await resizeImage(imageUrl, options);
          return { blob: resizedBlob, wasResized: false };
        }

        return { blob: originalBlob, wasResized: false };
      }

      // Resize needed
      const resizedBlob = await resizeImage(imageUrl, options);
      return { blob: resizedBlob, wasResized: true };
    },
    [resizeImage, checkImageDimensions]
  );

  /**
   * Get image dimensions from URL
   */
  const getImageDimensions = useCallback(
    async (imageUrl: string): Promise<{ width: number; height: number }> => {
      const img = await loadImage(imageUrl);
      return { width: img.width, height: img.height };
    },
    []
  );

  return {
    resizeImage,
    checkImageDimensions,
    resizeIfNeeded,
    getImageDimensions,
  };
}
