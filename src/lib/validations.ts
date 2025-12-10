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

/** Validates avatar type - human, object, logo, product, or reference */
export const avatarTypeSchema = z.enum(["human", "object", "logo", "product", "reference"], {
  message: "Avatar type must be 'human', 'object', 'logo', 'product', or 'reference'",
});

/** Validates generation type - photo or banner */
export const generationTypeSchema = z.enum(["photo", "banner"], {
  message: "Generation type must be 'photo' or 'banner'",
});

/** Validates banner reference type - must be "style", "composition", or "color" */
export const bannerReferenceTypeSchema = z.enum(["style", "composition", "color"], {
  message: "Reference type must be 'style', 'composition', or 'color'",
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
// Banner Reference Schemas
// ============================================================================

/** Schema for creating a new banner reference (form data fields) */
export const createBannerReferenceSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  referenceType: bannerReferenceTypeSchema,
});

/** Schema for updating a banner reference - all fields optional but at least one required */
export const updateBannerReferenceSchema = z
  .object({
    name: nameSchema.optional(),
    description: descriptionSchema,
    referenceType: bannerReferenceTypeSchema.optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "No valid fields to update",
  });

// ============================================================================
// Banner Preset Schemas
// ============================================================================

/** Schema for banner preset configuration - flexible object */
export const bannerPresetConfigSchema = z
  .object({})
  .passthrough()
  .refine(
    (config) => JSON.stringify(config).length <= INPUT_LIMITS.MAX_PRESET_CONFIG_SIZE,
    `Preset config too large. Maximum ${INPUT_LIMITS.MAX_PRESET_CONFIG_SIZE} characters allowed`
  );

/** Schema for creating a new banner preset */
export const createBannerPresetSchema = z.object({
  name: nameSchema,
  config: bannerPresetConfigSchema,
});

/** Schema for updating a banner preset - all fields optional but at least one required */
export const updateBannerPresetSchema = z
  .object({
    name: nameSchema.optional(),
    config: bannerPresetConfigSchema.optional(),
  })
  .refine((data) => data.name !== undefined || data.config !== undefined, {
    message: "No valid fields to update",
  });

// ============================================================================
// Logo Reference Schemas
// ============================================================================

/** Validates logo reference type - must be "style", "composition", or "color" */
export const logoReferenceTypeSchema = z.enum(["style", "composition", "color"], {
  message: "Reference type must be 'style', 'composition', or 'color'",
});

/** Schema for creating a new logo reference (form data fields) */
export const createLogoReferenceSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  referenceType: logoReferenceTypeSchema,
});

/** Schema for updating a logo reference - all fields optional but at least one required */
export const updateLogoReferenceSchema = z
  .object({
    name: nameSchema.optional(),
    description: descriptionSchema,
    referenceType: logoReferenceTypeSchema.optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "No valid fields to update",
  });

// ============================================================================
// Logo Preset Schemas
// ============================================================================

/** Schema for logo preset configuration - flexible object */
export const logoPresetConfigSchema = z
  .object({})
  .passthrough()
  .refine(
    (config) => JSON.stringify(config).length <= INPUT_LIMITS.MAX_PRESET_CONFIG_SIZE,
    `Preset config too large. Maximum ${INPUT_LIMITS.MAX_PRESET_CONFIG_SIZE} characters allowed`
  );

/** Schema for creating a new logo preset */
export const createLogoPresetSchema = z.object({
  name: nameSchema,
  config: logoPresetConfigSchema,
});

/** Schema for updating a logo preset - all fields optional but at least one required */
export const updateLogoPresetSchema = z
  .object({
    name: nameSchema.optional(),
    config: logoPresetConfigSchema.optional(),
  })
  .refine((data) => data.name !== undefined || data.config !== undefined, {
    message: "No valid fields to update",
  });

// ============================================================================
// Project Schemas
// ============================================================================

/** Schema for creating a new project */
export const createProjectSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
});

/** Schema for updating a project - all fields optional but at least one required */
export const updateProjectSchema = z
  .object({
    name: nameSchema.optional(),
    description: descriptionSchema,
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "No valid fields to update",
  });

/** Schema for adding generation to project */
export const addToProjectSchema = z.object({
  projectId: z.string().uuid({ message: "Invalid project ID" }).nullable(),
});

// ============================================================================
// Generation Schemas
// ============================================================================

/** Schema for reference image in generation - supports both avatarId (for avatars) and imageUrl (for banner references) */
export const referenceImageSchema = z.object({
  avatarId: z.string().uuid({ message: "Invalid avatar ID format" }).optional(),
  imageUrl: z.string().url({ message: "Invalid image URL format" }).optional(),
  type: avatarTypeSchema,
}).refine(
  (data) => data.avatarId || data.imageUrl,
  { message: "Either avatarId or imageUrl must be provided" }
);

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
  generationType: generationTypeSchema.optional().default("photo"),
  projectId: z.string().uuid({ message: "Invalid project ID" }).optional().nullable(),
  referenceImages: z
    .array(referenceImageSchema)
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
export type CreateBannerReferenceInput = z.infer<typeof createBannerReferenceSchema>;
export type UpdateBannerReferenceInput = z.infer<typeof updateBannerReferenceSchema>;
export type CreateBannerPresetInput = z.infer<typeof createBannerPresetSchema>;
export type UpdateBannerPresetInput = z.infer<typeof updateBannerPresetSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type AddToProjectInput = z.infer<typeof addToProjectSchema>;
export type GenerateRequestInput = z.infer<typeof generateRequestSchema>;
export type RefineRequestInput = z.infer<typeof refineRequestSchema>;
export type SaveApiKeyInput = z.infer<typeof saveApiKeySchema>;
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;
