/**
 * Pricing utilities for Cost Control
 * Handles cost calculation based on token usage and user pricing settings
 */

import type {
  GenerationUsage,
  PricingSettings,
  UsageMetadata,
} from "@/lib/types/cost-control";

// Default Gemini 3 Pro Image Preview pricing (as of Dec 2024)
// Prices in microdollars per 1000 tokens (1 microdollar = $0.000001)
export const DEFAULT_PRICING: PricingSettings = {
  inputTokenPriceMicros: 1250, // $0.00125 per 1K tokens
  outputTextPriceMicros: 5000, // $0.005 per 1K tokens
  outputImagePriceMicros: 40000, // $0.04 per 1K tokens (image generation is more expensive)
};

/**
 * Calculate cost in microdollars based on token usage
 * @param usage - Token usage from generation
 * @param pricing - User's pricing settings (or defaults)
 * @returns Cost in microdollars
 */
export function calculateCostMicros(
  usage: GenerationUsage,
  pricing: PricingSettings = DEFAULT_PRICING
): number {
  let inputCost = 0;
  let outputCost = 0;

  // Calculate input cost
  if (usage.usageMetadata?.promptTokensDetails) {
    const details = usage.usageMetadata.promptTokensDetails;
    // All input tokens use the same price
    const totalInputTokens =
      (details.text || 0) + (details.image || 0) + (details.audio || 0);
    inputCost = (totalInputTokens / 1000) * pricing.inputTokenPriceMicros;
  } else if (usage.promptTokenCount > 0) {
    // Fallback: use total prompt token count
    inputCost =
      (usage.promptTokenCount / 1000) * pricing.inputTokenPriceMicros;
  }

  // Calculate output cost (differentiate between text and image tokens)
  if (usage.usageMetadata?.candidatesTokensDetails) {
    const details = usage.usageMetadata.candidatesTokensDetails;
    // Text output
    outputCost += ((details.text || 0) / 1000) * pricing.outputTextPriceMicros;
    // Image output (more expensive)
    outputCost +=
      ((details.image || 0) / 1000) * pricing.outputImagePriceMicros;
    // Audio output (use text price as fallback)
    outputCost += ((details.audio || 0) / 1000) * pricing.outputTextPriceMicros;
  } else if (usage.candidatesTokenCount > 0) {
    // Fallback: assume image output for image generation tasks
    outputCost =
      (usage.candidatesTokenCount / 1000) * pricing.outputImagePriceMicros;
  }

  return Math.round(inputCost + outputCost);
}

/**
 * Estimate cost for existing generations without real token counts
 * Based on prompt length and generation settings
 */
export function estimateCostForLegacyGeneration(
  prompt: string,
  settings: {
    resolution?: string;
    imageCount?: number;
  },
  pricing: PricingSettings = DEFAULT_PRICING
): number {
  // Estimate input tokens: ~4 characters per token
  const estimatedInputTokens = Math.ceil(prompt.length / 4);

  // Estimate output tokens based on resolution and image count
  const imageCount = settings.imageCount || 1;
  let outputTokensPerImage: number;

  switch (settings.resolution) {
    case "4K":
      outputTokensPerImage = 8000;
      break;
    case "2K":
      outputTokensPerImage = 4000;
      break;
    case "1K":
    default:
      outputTokensPerImage = 2000;
      break;
  }

  const estimatedOutputTokens = outputTokensPerImage * imageCount;

  // Calculate cost
  const inputCost =
    (estimatedInputTokens / 1000) * pricing.inputTokenPriceMicros;
  const outputCost =
    (estimatedOutputTokens / 1000) * pricing.outputImagePriceMicros;

  return Math.round(inputCost + outputCost);
}

/**
 * Format microdollars as a human-readable currency string
 * @param micros - Cost in microdollars
 * @param locale - Locale for formatting (default: en-US)
 * @returns Formatted currency string
 */
export function formatCost(micros: number, locale: string = "en-US"): string {
  const dollars = micros / 1_000_000;

  // For very small amounts, show more decimal places
  if (dollars < 0.01) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    }).format(dollars);
  }

  // For normal amounts
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(dollars);
}

/**
 * Format microdollars as a compact number (e.g., "$1.23K")
 */
export function formatCostCompact(
  micros: number,
  locale: string = "en-US"
): string {
  const dollars = micros / 1_000_000;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(dollars);
}

/**
 * Format token count for display
 */
export function formatTokens(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Convert usage metadata to a serializable format for database storage
 */
export function serializeUsageMetadata(
  metadata: UsageMetadata | null | undefined
): UsageMetadata | null {
  if (!metadata) return null;

  return {
    promptTokensDetails: metadata.promptTokensDetails
      ? {
          text: metadata.promptTokensDetails.text,
          image: metadata.promptTokensDetails.image,
          audio: metadata.promptTokensDetails.audio,
        }
      : undefined,
    candidatesTokensDetails: metadata.candidatesTokensDetails
      ? {
          text: metadata.candidatesTokensDetails.text,
          image: metadata.candidatesTokensDetails.image,
          audio: metadata.candidatesTokensDetails.audio,
        }
      : undefined,
  };
}
