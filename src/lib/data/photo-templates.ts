import type { PromptBuilderState } from "@/lib/types/generation";

// ==========================================
// Photo Quick Start Templates
// ==========================================

export type PhotoTemplateCategory = "portrait" | "landscape" | "product" | "street" | "creative";

export interface PhotoQuickStartTemplate {
  id: string;
  name: string;
  description: string;
  category: PhotoTemplateCategory;
  /** Partial PromptBuilderState - subjects are intentionally excluded */
  config: Omit<Partial<PromptBuilderState>, "subjects">;
}

export const photoQuickStartTemplates: PhotoQuickStartTemplate[] = [
  // ---- Portrait ----
  {
    id: "photo-studio-portrait",
    name: "Studio Portrait",
    description: "Classic studio portrait with professional lighting and shallow depth of field",
    category: "portrait",
    config: {
      location: "location-studio",
      lighting: "lighting-studio",
      camera: "camera-portrait",
      style: "style-photorealistic",
    },
  },
  {
    id: "photo-fashion-editorial",
    name: "Fashion Editorial",
    description: "High-fashion editorial look with dramatic lighting and cinematic style",
    category: "portrait",
    config: {
      location: "location-studio",
      lighting: "lighting-dramatic",
      camera: "camera-medium-shot",
      style: "style-hyperrealistic",
    },
  },
  {
    id: "photo-moody-film-noir",
    name: "Moody Film Noir",
    description: "Dark, atmospheric portrait with high-contrast black and white cinema feel",
    category: "portrait",
    config: {
      lighting: "lighting-split",
      camera: "camera-medium-closeup",
      style: "style-film-noir",
    },
  },

  // ---- Landscape ----
  {
    id: "photo-golden-hour-landscape",
    name: "Golden Hour Landscape",
    description: "Sweeping landscape bathed in warm golden sunset light",
    category: "landscape",
    config: {
      location: "location-mountains",
      lighting: "lighting-golden-hour",
      camera: "camera-wide",
      style: "style-photorealistic",
    },
  },
  {
    id: "photo-dramatic-weather",
    name: "Dramatic Weather",
    description: "Moody landscape with overcast skies and atmospheric drama",
    category: "landscape",
    config: {
      location: "location-rocky-coast",
      lighting: "lighting-overcast",
      camera: "camera-extreme-wide",
      style: "style-raw-photo",
    },
  },
  {
    id: "photo-night-city",
    name: "Night City",
    description: "Urban nightscape with neon lights and vibrant city atmosphere",
    category: "landscape",
    config: {
      location: "location-downtown",
      lighting: "lighting-neon",
      camera: "camera-wide",
      style: "style-cyberpunk",
    },
  },

  // ---- Product ----
  {
    id: "photo-product-white",
    name: "Product on White",
    description: "Clean product shot on white background with professional studio lighting",
    category: "product",
    config: {
      location: "location-studio",
      lighting: "lighting-high-key",
      camera: "camera-closeup",
      style: "style-photorealistic",
    },
  },
  {
    id: "photo-flat-lay-product",
    name: "Flat Lay Product",
    description: "Overhead flat lay arrangement with styled product composition",
    category: "product",
    config: {
      location: "location-studio",
      lighting: "lighting-softbox",
      camera: "camera-birds-eye",
      style: "style-photorealistic",
    },
  },

  // ---- Street ----
  {
    id: "photo-street-photography",
    name: "Street Photography",
    description: "Candid urban street scene with natural light and documentary feel",
    category: "street",
    config: {
      location: "location-urban",
      lighting: "lighting-natural",
      camera: "camera-medium-shot",
      style: "style-raw-photo",
    },
  },
  {
    id: "photo-architecture-detail",
    name: "Architecture Detail",
    description: "Dramatic architectural composition with leading lines and geometric patterns",
    category: "street",
    config: {
      location: "location-downtown",
      lighting: "lighting-natural",
      camera: "camera-low-angle",
      style: "style-photorealistic",
    },
  },

  // ---- Creative ----
  {
    id: "photo-cinematic-scene",
    name: "Cinematic Scene",
    description: "Widescreen cinematic shot with dramatic film-style lighting",
    category: "creative",
    config: {
      lighting: "lighting-cinematic",
      camera: "camera-wide",
      style: "style-photorealistic",
    },
  },
  {
    id: "photo-macro-nature",
    name: "Macro Nature",
    description: "Extreme close-up of natural details with vivid colors and textures",
    category: "creative",
    config: {
      location: "location-forest",
      lighting: "lighting-dappled",
      camera: "camera-macro",
      style: "style-hyperrealistic",
    },
  },
  {
    id: "photo-vintage-film",
    name: "Vintage Film",
    description: "Nostalgic analog film aesthetic with natural grain and warm tones",
    category: "creative",
    config: {
      lighting: "lighting-golden-hour",
      camera: "camera-portrait",
      style: "style-film-photography",
    },
  },
  {
    id: "photo-minimalist",
    name: "Minimalist",
    description: "Clean, simple composition with negative space and elegant restraint",
    category: "creative",
    config: {
      lighting: "lighting-natural",
      camera: "camera-negative-space",
      style: "style-minimalist",
    },
  },
];

/** All available photo template categories */
export const photoTemplateCategories: PhotoTemplateCategory[] = [
  "portrait",
  "landscape",
  "product",
  "street",
  "creative",
];
