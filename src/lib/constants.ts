/**
 * Application-wide constants and limits
 *
 * These values are used for input validation across API routes
 * to prevent DoS attacks and database bloat.
 */

export const INPUT_LIMITS = {
  /** Maximum length for image generation prompts (characters) */
  MAX_PROMPT_LENGTH: 10000,

  /** Maximum length for refinement instructions (characters) */
  MAX_INSTRUCTION_LENGTH: 5000,

  /** Maximum length for avatar/preset names (characters) */
  MAX_NAME_LENGTH: 100,

  /** Maximum length for avatar descriptions (characters) */
  MAX_DESCRIPTION_LENGTH: 500,

  /** Maximum JSON payload size for preset config (characters when stringified) */
  MAX_PRESET_CONFIG_SIZE: 50000,
} as const;

export const PAGINATION = {
  /** Default page size for list endpoints */
  DEFAULT_PAGE_SIZE: 20,

  /** Maximum page size allowed */
  MAX_PAGE_SIZE: 50,
} as const;

export const FILE_LIMITS = {
  /** Maximum file size for uploads (bytes) - 5MB */
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,

  /** Maximum file size for uploads (MB) */
  MAX_FILE_SIZE_MB: 5,
} as const;

export const GENERATION = {
  /** Valid image resolutions */
  VALID_RESOLUTIONS: ["1K", "2K", "4K"] as const,

  /** Valid aspect ratios */
  VALID_ASPECT_RATIOS: ["1:1", "16:9", "9:16", "4:3", "3:4", "21:9"] as const,

  /** Valid image counts per generation */
  VALID_IMAGE_COUNTS: [1, 2, 3, 4] as const,

  /** Maximum images per generation */
  MAX_IMAGES_PER_GENERATION: 4,
} as const;

export const RATE_LIMITS = {
  /** Maximum avatar uploads per hour per user */
  AVATAR_UPLOADS_PER_HOUR: 10,

  /** Maximum image likes per hour per user */
  IMAGE_LIKES_PER_HOUR: 100,

  /** Rate limit window in milliseconds (1 hour) */
  WINDOW_MS: 60 * 60 * 1000,
} as const;
