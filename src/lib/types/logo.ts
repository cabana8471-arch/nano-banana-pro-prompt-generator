// ==========================================
// Logo Generator - TypeScript Types
// ==========================================

// ==========================================
// Logo Template Types
// ==========================================

/**
 * Base template structure for logo presets
 */
export interface LogoTemplate {
  id: string;
  name: string;
  description: string;
  promptFragment: string;
}

// ==========================================
// Logo Text Content
// ==========================================

/**
 * Text content for logo creation
 */
export interface LogoTextContent {
  companyName: string;
  tagline: string;
  abbreviation: string;
}

/**
 * Character limits for logo text fields
 */
export interface LogoCharacterLimits {
  companyName: number;
  tagline: number;
  abbreviation: number;
}

/**
 * Default character limits for logo text
 */
export const DEFAULT_LOGO_CHARACTER_LIMITS: LogoCharacterLimits = {
  companyName: 30,
  tagline: 50,
  abbreviation: 5,
};

// ==========================================
// Logo Builder State
// ==========================================

/**
 * Complete state for the logo builder
 * Contains all selected presets from 12 categories plus text content
 */
export interface LogoBuilderState {
  // Section A: Basic Configuration
  logoType: string;
  industry: string;
  logoFormat: string;

  // Section B: Visual Style
  designStyle: string;
  colorSchemeType: string;
  mood: string;

  // Section C: Icon/Symbol Design
  iconStyle: string;
  symbolElements: string[]; // Multi-select

  // Section D: Typography
  fontCategory: string;
  typographyTreatment: string;

  // Section E: Additional Options
  specialEffects: string;
  backgroundStyle: string;

  // Text Content
  textContent: LogoTextContent;

  // Brand Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;

  // Custom prompt additions
  customPrompt: string;
}

/**
 * Initial/default state for logo builder
 */
export const DEFAULT_LOGO_BUILDER_STATE: LogoBuilderState = {
  logoType: "",
  industry: "",
  logoFormat: "",
  designStyle: "",
  colorSchemeType: "",
  mood: "",
  iconStyle: "",
  symbolElements: [],
  fontCategory: "",
  typographyTreatment: "",
  specialEffects: "",
  backgroundStyle: "",
  textContent: {
    companyName: "",
    tagline: "",
    abbreviation: "",
  },
  primaryColor: "",
  secondaryColor: "",
  accentColor: "",
  customPrompt: "",
};

// ==========================================
// Logo Preset Configuration
// ==========================================

/**
 * Saveable logo preset configuration
 */
export interface LogoPresetConfig {
  // Section A: Basic Configuration
  logoType?: string;
  industry?: string;
  logoFormat?: string;

  // Section B: Visual Style
  designStyle?: string;
  colorSchemeType?: string;
  mood?: string;

  // Section C: Icon/Symbol Design
  iconStyle?: string;
  symbolElements?: string[];

  // Section D: Typography
  fontCategory?: string;
  typographyTreatment?: string;

  // Section E: Additional Options
  specialEffects?: string;
  backgroundStyle?: string;

  // Text Content (optional for presets)
  textContent?: Partial<LogoTextContent>;

  // Brand Colors
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;

  // Custom prompt
  customPrompt?: string;
}

/**
 * Saved logo preset with metadata
 */
export interface LogoPreset {
  id: string;
  userId: string;
  name: string;
  config: LogoPresetConfig;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input for creating a new logo preset
 */
export interface CreateLogoPresetInput {
  name: string;
  config: LogoPresetConfig;
}

/**
 * Input for updating a logo preset
 */
export interface UpdateLogoPresetInput {
  name?: string;
  config?: LogoPresetConfig;
}

// ==========================================
// Logo Generation Settings
// ==========================================

/**
 * Export format options for logos
 */
export type LogoExportFormat = "png" | "jpg" | "webp";

/**
 * Logo count options for generation
 */
export type LogoCount = 1 | 2 | 3 | 4;

/**
 * Logo resolution options
 */
export type LogoResolution = "1K" | "2K" | "4K";

/**
 * Logo variant generation options
 */
export interface LogoVariantOptions {
  horizontal: boolean; // Icon + text horizontal layout
  vertical: boolean; // Icon + text stacked vertically
  iconOnly: boolean; // Icon without text
  textOnly: boolean; // Text/wordmark only
}

/**
 * Logo generation settings
 */
export interface LogoGenerationSettings {
  format: LogoExportFormat;
  logoCount: LogoCount;
  resolution: LogoResolution;
  generateVariants: LogoVariantOptions;
  monochromeVersion: boolean;
  svgExport: boolean;
}

/**
 * Default generation settings
 */
export const DEFAULT_LOGO_GENERATION_SETTINGS: LogoGenerationSettings = {
  format: "png",
  logoCount: 1,
  resolution: "2K",
  generateVariants: {
    horizontal: false,
    vertical: false,
    iconOnly: false,
    textOnly: false,
  },
  monochromeVersion: false,
  svgExport: false,
};

// ==========================================
// Logo References
// ==========================================

/**
 * Reference type for logo references (inspiration images)
 * - style: Use this logo as a style/visual reference
 * - composition: Use this logo for layout/composition guidance
 * - color: Use this logo's color palette as reference
 */
export type LogoReferenceType = "style" | "composition" | "color";

/**
 * Logo reference image for generation
 */
export interface LogoReference {
  id: string;
  userId: string;
  name: string;
  description?: string;
  imageUrl: string;
  referenceType: LogoReferenceType;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input for creating a new logo reference
 */
export interface CreateLogoReferenceInput {
  name: string;
  description?: string;
  referenceType: LogoReferenceType;
}

/**
 * Input for updating a logo reference
 */
export interface UpdateLogoReferenceInput {
  name?: string;
  description?: string;
  referenceType?: LogoReferenceType;
}

/**
 * Selected logo reference for generation
 */
export interface SelectedLogoReference {
  referenceId: string;
  type: LogoReferenceType;
}

// ==========================================
// Logo Validation
// ==========================================

/**
 * Validation warning types
 */
export type LogoWarningType =
  | "company-name-too-long"
  | "tagline-too-long"
  | "abbreviation-too-long"
  | "missing-company-name"
  | "low-contrast-colors"
  | "too-many-colors";

/**
 * Validation warning
 */
export interface LogoValidationWarning {
  type: LogoWarningType;
  message: string;
  field?: keyof LogoTextContent;
  severity: "warning" | "error";
}

// ==========================================
// Quick Start Templates
// ==========================================

/**
 * Pre-configured combinations for common scenarios
 */
export interface LogoQuickStartTemplate {
  id: string;
  name: string;
  description: string;
  config: LogoPresetConfig;
}

// ==========================================
// Template Categories
// ==========================================

/**
 * All logo template category keys
 */
export type LogoTemplateCategory =
  | "logoType"
  | "industry"
  | "logoFormat"
  | "designStyle"
  | "colorSchemeType"
  | "mood"
  | "iconStyle"
  | "symbolElements"
  | "fontCategory"
  | "typographyTreatment"
  | "specialEffects"
  | "backgroundStyle";

/**
 * Section groupings for the UI
 */
export type LogoSection =
  | "basicConfig"
  | "visualStyle"
  | "iconSymbol"
  | "typography"
  | "additionalOptions";

/**
 * Mapping of categories to sections
 */
export const LOGO_CATEGORY_TO_SECTION: Record<LogoTemplateCategory, LogoSection> = {
  logoType: "basicConfig",
  industry: "basicConfig",
  logoFormat: "basicConfig",
  designStyle: "visualStyle",
  colorSchemeType: "visualStyle",
  mood: "visualStyle",
  iconStyle: "iconSymbol",
  symbolElements: "iconSymbol",
  fontCategory: "typography",
  typographyTreatment: "typography",
  specialEffects: "additionalOptions",
  backgroundStyle: "additionalOptions",
};

/**
 * Categories organized by section for UI rendering
 */
export const LOGO_SECTION_CATEGORIES: Record<LogoSection, LogoTemplateCategory[]> = {
  basicConfig: ["logoType", "industry", "logoFormat"],
  visualStyle: ["designStyle", "colorSchemeType", "mood"],
  iconSymbol: ["iconStyle", "symbolElements"],
  typography: ["fontCategory", "typographyTreatment"],
  additionalOptions: ["specialEffects", "backgroundStyle"],
};

// ==========================================
// Logo Output Formats (for export)
// ==========================================

/**
 * Logo output format preset
 */
export interface LogoOutputFormat {
  id: string;
  name: string;
  width: number;
  height: number;
  description: string;
}

/**
 * Standard logo output formats
 */
export const LOGO_OUTPUT_FORMATS: LogoOutputFormat[] = [
  {
    id: "favicon",
    name: "Favicon",
    width: 32,
    height: 32,
    description: "Browser tab icon",
  },
  {
    id: "favicon-lg",
    name: "Favicon Large",
    width: 180,
    height: 180,
    description: "Apple touch icon",
  },
  {
    id: "social-profile",
    name: "Social Profile",
    width: 400,
    height: 400,
    description: "Social media profile picture",
  },
  {
    id: "standard",
    name: "Standard",
    width: 500,
    height: 500,
    description: "Standard logo size",
  },
  {
    id: "large",
    name: "Large",
    width: 1000,
    height: 1000,
    description: "High-resolution logo",
  },
  {
    id: "print",
    name: "Print Ready",
    width: 2000,
    height: 2000,
    description: "Print-quality resolution",
  },
  {
    id: "horizontal",
    name: "Horizontal",
    width: 1200,
    height: 400,
    description: "Horizontal/landscape layout",
  },
  {
    id: "vertical",
    name: "Vertical",
    width: 400,
    height: 600,
    description: "Vertical/portrait layout",
  },
];

// ==========================================
// Generated Logo Variant
// ==========================================

/**
 * Variant type for generated logos
 */
export type LogoVariantType = "primary" | "horizontal" | "vertical" | "icon-only" | "text-only" | "monochrome";

/**
 * Generated logo variant with metadata
 */
export interface GeneratedLogoVariant {
  id: string;
  generationId: string;
  imageUrl: string;
  variantType: LogoVariantType;
  width: number;
  height: number;
  createdAt: Date;
}
