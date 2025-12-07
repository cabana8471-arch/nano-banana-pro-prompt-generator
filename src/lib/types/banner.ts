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
  | "pinterest"
  | "tiktok"
  | "youtube"
  | "email"
  | "print"
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
  textLanguage: string;
  textPlacement: string;
  typographyStyle: string; // Legacy: applies to all text if specific ones not set
  headlineTypography: string; // Typography for headline
  bodyTypography: string; // Typography for subheadline and tagline
  ctaTypography: string; // Typography for CTA button text
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
  textLanguage: "",
  textPlacement: "",
  typographyStyle: "",
  headlineTypography: "",
  bodyTypography: "",
  ctaTypography: "",
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
  textLanguage?: string;
  textPlacement?: string;
  typographyStyle?: string;
  headlineTypography?: string;
  bodyTypography?: string;
  ctaTypography?: string;
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
 * Banner count options for generation
 */
export type BannerCount = 1 | 2 | 3 | 4;

/**
 * Banner resolution options (same as ImageResolution from generation.ts)
 */
export type BannerResolution = "1K" | "2K" | "4K";

/**
 * Banner generation settings
 */
export interface BannerGenerationSettings {
  format: BannerExportFormat;
  withText: boolean; // Generate with text overlay or just visual
  bannerCount: BannerCount; // Number of banners to generate
  resolution: BannerResolution; // Image resolution
}

/**
 * Default generation settings
 */
export const DEFAULT_BANNER_GENERATION_SETTINGS: BannerGenerationSettings = {
  format: "png",
  withText: true,
  bannerCount: 1,
  resolution: "2K",
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
  | "textLanguage"
  | "textPlacement"
  | "typographyStyle"
  | "headlineTypography"
  | "bodyTypography"
  | "ctaTypography"
  | "ctaButtonStyle";

/**
 * Section groupings for the UI
 */
export type BannerSection = "basicConfig" | "visualStyle" | "visualElements" | "layoutTypography";

// ==========================================
// Platform Export Presets (Multi-Size Export)
// ==========================================

/**
 * A single size preset for a platform
 */
export interface PlatformSizePreset {
  name: string;
  width: number;
  height: number;
}

/**
 * Platform preset with multiple sizes
 */
export interface PlatformPreset {
  id: string;
  name: string;
  icon: string;
  sizes: PlatformSizePreset[];
}

/**
 * All available platform presets for multi-size export
 */
export const PLATFORM_PRESETS: PlatformPreset[] = [
  {
    id: "google-ads",
    name: "Google Ads",
    icon: "google",
    sizes: [
      { name: "Leaderboard", width: 728, height: 90 },
      { name: "Medium Rectangle", width: 300, height: 250 },
      { name: "Large Rectangle", width: 336, height: 280 },
      { name: "Wide Skyscraper", width: 160, height: 600 },
      { name: "Half Page", width: 300, height: 600 },
      { name: "Billboard", width: 970, height: 250 },
      { name: "Large Leaderboard", width: 970, height: 90 },
      { name: "Mobile Banner", width: 320, height: 50 },
      { name: "Mobile Leaderboard", width: 320, height: 100 },
    ],
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "facebook",
    sizes: [
      { name: "Feed Image", width: 1200, height: 628 },
      { name: "Story", width: 1080, height: 1920 },
      { name: "Cover Photo", width: 820, height: 312 },
      { name: "Event Cover", width: 1920, height: 1005 },
      { name: "Carousel", width: 1080, height: 1080 },
      { name: "Link Ad", width: 1200, height: 627 },
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "instagram",
    sizes: [
      { name: "Square Post", width: 1080, height: 1080 },
      { name: "Portrait Post", width: 1080, height: 1350 },
      { name: "Landscape Post", width: 1080, height: 566 },
      { name: "Story / Reels", width: 1080, height: 1920 },
    ],
  },
  {
    id: "twitter",
    name: "Twitter / X",
    icon: "twitter",
    sizes: [
      { name: "In-Stream Image", width: 1600, height: 900 },
      { name: "Header Photo", width: 1500, height: 500 },
      { name: "Card Image", width: 800, height: 418 },
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "linkedin",
    sizes: [
      { name: "Sponsored Content", width: 1200, height: 627 },
      { name: "Company Cover", width: 1128, height: 191 },
      { name: "Personal Cover", width: 1584, height: 396 },
      { name: "Square Post", width: 1200, height: 1200 },
    ],
  },
  {
    id: "pinterest",
    name: "Pinterest",
    icon: "pin",
    sizes: [
      { name: "Standard Pin", width: 1000, height: 1500 },
      { name: "Square Pin", width: 1000, height: 1000 },
      { name: "Long Pin", width: 1000, height: 2100 },
    ],
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "youtube",
    sizes: [
      { name: "Thumbnail", width: 1280, height: 720 },
      { name: "Channel Art", width: 2560, height: 1440 },
      { name: "Display Ad", width: 300, height: 250 },
      { name: "Overlay Ad", width: 480, height: 70 },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "tiktok",
    sizes: [
      { name: "Video Cover", width: 1080, height: 1920 },
      { name: "Profile Photo", width: 200, height: 200 },
    ],
  },
  {
    id: "email",
    name: "Email Marketing",
    icon: "mail",
    sizes: [
      { name: "Email Header", width: 600, height: 200 },
      { name: "Email Banner", width: 600, height: 300 },
      { name: "Full Width", width: 600, height: 400 },
    ],
  },
  {
    id: "web",
    name: "Website",
    icon: "globe",
    sizes: [
      { name: "Hero Banner", width: 1920, height: 600 },
      { name: "Hero Large", width: 1920, height: 800 },
      { name: "Blog Featured", width: 1200, height: 630 },
      { name: "Sidebar Banner", width: 300, height: 250 },
      { name: "Mobile Hero", width: 750, height: 400 },
    ],
  },
];

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
  textLanguage: "layoutTypography",
  textPlacement: "layoutTypography",
  typographyStyle: "layoutTypography",
  headlineTypography: "layoutTypography",
  bodyTypography: "layoutTypography",
  ctaTypography: "layoutTypography",
  ctaButtonStyle: "layoutTypography",
};

/**
 * Categories organized by section for UI rendering
 */
export const SECTION_CATEGORIES: Record<BannerSection, BannerTemplateCategory[]> = {
  basicConfig: ["bannerType", "bannerSize", "industry"],
  visualStyle: ["designStyle", "colorScheme", "mood", "seasonal"],
  visualElements: ["backgroundStyle", "visualEffects", "iconGraphics", "promotionalElements"],
  layoutTypography: [
    "layoutStyle",
    "textLanguage",
    "textPlacement",
    "typographyStyle",
    "headlineTypography",
    "bodyTypography",
    "ctaTypography",
    "ctaButtonStyle",
  ],
};
