// ==========================================
// Banner Generator - TypeScript Types
// ==========================================

// ==========================================
// Banner Template Types
// ==========================================

/**
 * Base template structure for banner presets
 */
export interface BannerTemplate {
  id: string;
  name: string;
  description: string;
  promptFragment: string;
}

/**
 * Extended template with additional metadata for banner sizes
 */
export interface BannerSizeTemplate extends BannerTemplate {
  width: number;
  height: number;
  platform: BannerPlatform;
  category: BannerSizeCategory;
}

/**
 * Platforms for banner sizes
 */
export type BannerPlatform =
  | "google-ads"
  | "facebook"
  | "instagram"
  | "website"
  | "twitter"
  | "linkedin"
  | "custom";

/**
 * Banner size categories
 */
export type BannerSizeCategory =
  | "leaderboard"
  | "rectangle"
  | "skyscraper"
  | "billboard"
  | "mobile"
  | "feed"
  | "story"
  | "cover"
  | "hero"
  | "sidebar"
  | "cta"
  | "custom";

// ==========================================
// Banner Text Content
// ==========================================

/**
 * Text content for banner creation
 */
export interface BannerTextContent {
  headline: string;
  subheadline: string;
  ctaText: string;
  tagline: string;
}

/**
 * Character limits based on banner size
 */
export interface CharacterLimits {
  headline: number;
  subheadline: number;
  ctaText: number;
  tagline: number;
}

/**
 * Default character limits for different banner size categories
 */
export const DEFAULT_CHARACTER_LIMITS: Record<BannerSizeCategory, CharacterLimits> = {
  mobile: { headline: 25, subheadline: 0, ctaText: 10, tagline: 15 },
  leaderboard: { headline: 50, subheadline: 80, ctaText: 15, tagline: 30 },
  rectangle: { headline: 40, subheadline: 60, ctaText: 15, tagline: 25 },
  skyscraper: { headline: 30, subheadline: 50, ctaText: 12, tagline: 20 },
  billboard: { headline: 60, subheadline: 100, ctaText: 15, tagline: 40 },
  feed: { headline: 60, subheadline: 100, ctaText: 15, tagline: 35 },
  story: { headline: 40, subheadline: 60, ctaText: 12, tagline: 25 },
  cover: { headline: 50, subheadline: 80, ctaText: 15, tagline: 30 },
  hero: { headline: 80, subheadline: 150, ctaText: 20, tagline: 50 },
  sidebar: { headline: 35, subheadline: 50, ctaText: 12, tagline: 20 },
  cta: { headline: 50, subheadline: 80, ctaText: 15, tagline: 30 },
  custom: { headline: 60, subheadline: 100, ctaText: 15, tagline: 35 },
};

// ==========================================
// Banner Builder State
// ==========================================

/**
 * Complete state for the banner builder
 * Contains all selected presets from 15 categories plus text content
 */
export interface BannerBuilderState {
  // Section A: Basic Configuration
  bannerType: string;
  bannerSize: string;
  industry: string;

  // Custom banner size dimensions (used when bannerSize is "size-custom")
  customWidth: number | null;
  customHeight: number | null;

  // Section B: Visual Style
  designStyle: string;
  colorScheme: string;
  mood: string;
  seasonal: string;

  // Section C: Visual Elements
  backgroundStyle: string;
  visualEffects: string;
  iconGraphics: string;
  promotionalElements: string;

  // Section D: Layout & Typography
  layoutStyle: string;
  textPlacement: string;
  typographyStyle: string;
  ctaButtonStyle: string;

  // Text Content
  textContent: BannerTextContent;

  // Custom prompt additions
  customPrompt: string;
}

/**
 * Initial/default state for banner builder
 */
export const DEFAULT_BANNER_BUILDER_STATE: BannerBuilderState = {
  bannerType: "",
  bannerSize: "",
  industry: "",
  customWidth: null,
  customHeight: null,
  designStyle: "",
  colorScheme: "",
  mood: "",
  seasonal: "",
  backgroundStyle: "",
  visualEffects: "",
  iconGraphics: "",
  promotionalElements: "",
  layoutStyle: "",
  textPlacement: "",
  typographyStyle: "",
  ctaButtonStyle: "",
  textContent: {
    headline: "",
    subheadline: "",
    ctaText: "",
    tagline: "",
  },
  customPrompt: "",
};

// ==========================================
// Banner Preset Configuration
// ==========================================

/**
 * Saveable banner preset configuration
 */
export interface BannerPresetConfig {
  // Section A: Basic Configuration
  bannerType?: string;
  bannerSize?: string;
  industry?: string;

  // Custom banner size dimensions
  customWidth?: number | null;
  customHeight?: number | null;

  // Section B: Visual Style
  designStyle?: string;
  colorScheme?: string;
  mood?: string;
  seasonal?: string;

  // Section C: Visual Elements
  backgroundStyle?: string;
  visualEffects?: string;
  iconGraphics?: string;
  promotionalElements?: string;

  // Section D: Layout & Typography
  layoutStyle?: string;
  textPlacement?: string;
  typographyStyle?: string;
  ctaButtonStyle?: string;

  // Text Content (optional for presets)
  textContent?: Partial<BannerTextContent>;

  // Custom prompt
  customPrompt?: string;
}

/**
 * Saved banner preset with metadata
 */
export interface BannerPreset {
  id: string;
  userId: string;
  name: string;
  config: BannerPresetConfig;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input for creating a new banner preset
 */
export interface CreateBannerPresetInput {
  name: string;
  config: BannerPresetConfig;
}

/**
 * Input for updating a banner preset
 */
export interface UpdateBannerPresetInput {
  name?: string;
  config?: BannerPresetConfig;
}

// ==========================================
// Banner Generation Settings
// ==========================================

/**
 * Export format options
 */
export type BannerExportFormat = "png" | "jpg" | "webp";

/**
 * Banner generation settings
 */
export interface BannerGenerationSettings {
  format: BannerExportFormat;
  quality: number; // 1-100
  withText: boolean; // Generate with text overlay or just visual
}

/**
 * Default generation settings
 */
export const DEFAULT_BANNER_GENERATION_SETTINGS: BannerGenerationSettings = {
  format: "png",
  quality: 90,
  withText: true,
};

// ==========================================
// Banner Brand Assets
// ==========================================

/**
 * Brand assets for banner creation
 */
export interface BannerBrandAssets {
  logoAvatarId?: string;
  productImageAvatarId?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

// ==========================================
// Banner References
// ==========================================

/**
 * Reference type for banner references
 * - style: Use this banner as a style/visual reference
 * - composition: Use this banner for layout/composition guidance
 * - color: Use this banner's color palette as reference
 */
export type BannerReferenceType = "style" | "composition" | "color";

/**
 * Banner reference image for generation
 */
export interface BannerReference {
  id: string;
  userId: string;
  name: string;
  description?: string;
  imageUrl: string;
  referenceType: BannerReferenceType;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input for creating a new banner reference
 */
export interface CreateBannerReferenceInput {
  name: string;
  description?: string;
  referenceType: BannerReferenceType;
}

/**
 * Input for updating a banner reference
 */
export interface UpdateBannerReferenceInput {
  name?: string;
  description?: string;
  referenceType?: BannerReferenceType;
}

/**
 * Selected banner reference for generation
 */
export interface SelectedBannerReference {
  referenceId: string;
  type: BannerReferenceType;
}

// ==========================================
// Banner Validation
// ==========================================

/**
 * Validation warning types
 */
export type BannerWarningType =
  | "headline-too-long"
  | "subheadline-too-long"
  | "cta-too-long"
  | "tagline-too-long"
  | "low-contrast"
  | "low-resolution-logo"
  | "missing-cta"
  | "missing-headline";

/**
 * Validation warning
 */
export interface BannerValidationWarning {
  type: BannerWarningType;
  message: string;
  field?: keyof BannerTextContent;
  severity: "warning" | "error";
}

// ==========================================
// Quick Start Templates
// ==========================================

/**
 * Pre-configured combinations for common scenarios
 */
export interface QuickStartTemplate {
  id: string;
  name: string;
  description: string;
  config: BannerPresetConfig;
}

// ==========================================
// Template Categories
// ==========================================

/**
 * All banner template category keys
 */
export type BannerTemplateCategory =
  | "bannerType"
  | "bannerSize"
  | "industry"
  | "designStyle"
  | "colorScheme"
  | "mood"
  | "seasonal"
  | "backgroundStyle"
  | "visualEffects"
  | "iconGraphics"
  | "promotionalElements"
  | "layoutStyle"
  | "textPlacement"
  | "typographyStyle"
  | "ctaButtonStyle";

/**
 * Section groupings for the UI
 */
export type BannerSection = "basicConfig" | "visualStyle" | "visualElements" | "layoutTypography";

/**
 * Mapping of categories to sections
 */
export const CATEGORY_TO_SECTION: Record<BannerTemplateCategory, BannerSection> = {
  bannerType: "basicConfig",
  bannerSize: "basicConfig",
  industry: "basicConfig",
  designStyle: "visualStyle",
  colorScheme: "visualStyle",
  mood: "visualStyle",
  seasonal: "visualStyle",
  backgroundStyle: "visualElements",
  visualEffects: "visualElements",
  iconGraphics: "visualElements",
  promotionalElements: "visualElements",
  layoutStyle: "layoutTypography",
  textPlacement: "layoutTypography",
  typographyStyle: "layoutTypography",
  ctaButtonStyle: "layoutTypography",
};

/**
 * Categories organized by section for UI rendering
 */
export const SECTION_CATEGORIES: Record<BannerSection, BannerTemplateCategory[]> = {
  basicConfig: ["bannerType", "bannerSize", "industry"],
  visualStyle: ["designStyle", "colorScheme", "mood", "seasonal"],
  visualElements: ["backgroundStyle", "visualEffects", "iconGraphics", "promotionalElements"],
  layoutTypography: ["layoutStyle", "textPlacement", "typographyStyle", "ctaButtonStyle"],
};
