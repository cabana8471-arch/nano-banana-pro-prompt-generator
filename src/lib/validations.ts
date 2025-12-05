/**
 * Centralized Zod validation schemas for API routes
 *
 * This module provides reusable validation schemas to ensure consistent
 * input validation across all API endpoints, eliminating manual validation
 * and reducing code duplication.
 */

import { z } from "zod";
import { locales } from "@/i18n/config";
import { INPUT_LIMITS, FILE_LIMITS, GENERATION } from "@/lib/constants";

// ============================================================================
// Common Schemas
// ============================================================================

/** Validates avatar type - must be "human" or "object" */
export const avatarTypeSchema = z.enum(["human", "object"], {
  message: "Avatar type must be 'human' or 'object'",
});

/** Validates locale - must be one of the supported languages */
export const localeSchema = z.enum(locales, {
  message: `Invalid language. Supported: ${locales.join(", ")}`,
});

/** Validates non-empty trimmed string for names */
export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(INPUT_LIMITS.MAX_NAME_LENGTH, `Name too long. Maximum ${INPUT_LIMITS.MAX_NAME_LENGTH} characters allowed`)
  .transform((val) => val.trim());

/** Validates optional description with length limit */
export const descriptionSchema = z
  .string()
  .max(INPUT_LIMITS.MAX_DESCRIPTION_LENGTH, `Description too long. Maximum ${INPUT_LIMITS.MAX_DESCRIPTION_LENGTH} characters allowed`)
  .transform((val) => val.trim())
  .nullable()
  .optional();

// ============================================================================
// Avatar Schemas
// ============================================================================

/** Schema for creating a new avatar (form data fields) */
export const createAvatarSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  avatarType: avatarTypeSchema,
});

/** Schema for updating an avatar - all fields optional but at least one required */
export const updateAvatarSchema = z
  .object({
    name: nameSchema.optional(),
    description: descriptionSchema,
    avatarType: avatarTypeSchema.optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "No valid fields to update",
  });

// ============================================================================
// Preset Schemas
// ============================================================================

/** Schema for preset configuration - requires subjects array */
export const presetConfigSchema = z
  .object({
    subjects: z.array(z.unknown()),
  })
  .passthrough()
  .refine(
    (config) => JSON.stringify(config).length <= INPUT_LIMITS.MAX_PRESET_CONFIG_SIZE,
    `Preset config too large. Maximum ${INPUT_LIMITS.MAX_PRESET_CONFIG_SIZE} characters allowed`
  );

/** Schema for creating a new preset */
export const createPresetSchema = z.object({
  name: nameSchema,
  config: presetConfigSchema,
});

/** Schema for updating a preset - all fields optional but at least one required */
export const updatePresetSchema = z
  .object({
    name: nameSchema.optional(),
    config: presetConfigSchema.optional(),
  })
  .refine((data) => data.name !== undefined || data.config !== undefined, {
    message: "No valid fields to update",
  });

// ============================================================================
// Generation Schemas
// ============================================================================

/** Schema for image generation request */
export const generateRequestSchema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .max(INPUT_LIMITS.MAX_PROMPT_LENGTH, `Prompt too long. Maximum ${INPUT_LIMITS.MAX_PROMPT_LENGTH} characters allowed`),
  settings: z.object({
    resolution: z.enum(GENERATION.VALID_RESOLUTIONS, {
      message: "Invalid resolution",
    }),
    aspectRatio: z.enum(GENERATION.VALID_ASPECT_RATIOS, {
      message: "Invalid aspect ratio",
    }),
    imageCount: z
      .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
      .optional()
      .default(1),
  }),
  referenceImages: z
    .array(
      z.object({
        avatarId: z.string().uuid({ message: "Invalid avatar ID format" }),
        type: avatarTypeSchema,
      })
    )
    .optional()
    .default([]),
});

/** Schema for refining an existing generation */
export const refineRequestSchema = z.object({
  instruction: z
    .string()
    .min(1, "Instruction is required")
    .max(INPUT_LIMITS.MAX_INSTRUCTION_LENGTH, `Instruction too long. Maximum ${INPUT_LIMITS.MAX_INSTRUCTION_LENGTH} characters allowed`)
    .transform((val) => val.trim()),
  selectedImageId: z.string().uuid().optional(),
});

// ============================================================================
// User Schemas
// ============================================================================

/** Schema for saving API key */
export const saveApiKeySchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
});

/** Schema for user preferences */
export const userPreferencesSchema = z.object({
  language: localeSchema.optional(),
});

// ============================================================================
// File Validation Helpers
// ============================================================================

/** Allowed MIME types for image uploads */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

/** Validates an uploaded file for avatar images */
export function validateImageFile(file: File | null): { success: true } | { success: false; error: string } {
  if (!file) {
    return { success: false, error: "Image is required" };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
    return { success: false, error: "Invalid image type. Allowed: JPEG, PNG, GIF, WEBP" };
  }

  if (file.size > FILE_LIMITS.MAX_FILE_SIZE_BYTES) {
    return { success: false, error: `Image too large. Maximum size is ${FILE_LIMITS.MAX_FILE_SIZE_MB}MB` };
  }

  return { success: true };
}

// ============================================================================
// Type Exports
// ============================================================================

export type CreateAvatarInput = z.infer<typeof createAvatarSchema>;
export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>;
export type CreatePresetInput = z.infer<typeof createPresetSchema>;
export type UpdatePresetInput = z.infer<typeof updatePresetSchema>;
export type GenerateRequestInput = z.infer<typeof generateRequestSchema>;
export type RefineRequestInput = z.infer<typeof refineRequestSchema>;
export type SaveApiKeyInput = z.infer<typeof saveApiKeySchema>;
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;
