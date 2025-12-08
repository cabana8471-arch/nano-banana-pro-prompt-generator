import type { LogoTemplate, LogoQuickStartTemplate } from "@/lib/types/logo";

// ==========================================
// SECTION A: BASIC CONFIGURATION
// ==========================================

// ==========================================
// 1. LOGO TYPE (7 presets)
// ==========================================
export const logoTypeTemplates: LogoTemplate[] = [
  {
    id: "logo-type-wordmark",
    name: "Wordmark",
    description: "Company name stylized as the logo",
    promptFragment: "wordmark logo design where the company name is stylized as the logo, typographic logo, text-based identity",
  },
  {
    id: "logo-type-lettermark",
    name: "Lettermark / Monogram",
    description: "Logo using initials or abbreviation",
    promptFragment: "lettermark logo using initials or abbreviation, monogram design, initial-based identity",
  },
  {
    id: "logo-type-symbol",
    name: "Symbol / Icon",
    description: "Iconic symbol without text",
    promptFragment: "iconic symbol logo without text, memorable and recognizable mark, standalone icon design",
  },
  {
    id: "logo-type-combination",
    name: "Combination Mark",
    description: "Both icon and company name",
    promptFragment: "combination logo with both icon and company name, integrated mark and text design",
  },
  {
    id: "logo-type-emblem",
    name: "Emblem",
    description: "Text integrated within a symbol or badge",
    promptFragment: "emblem-style logo with text integrated within a symbol or badge, crest-style design",
  },
  {
    id: "logo-type-mascot",
    name: "Mascot",
    description: "Character or illustrated figure",
    promptFragment: "mascot logo featuring a character or illustrated figure, brand mascot design",
  },
  {
    id: "logo-type-abstract",
    name: "Abstract Mark",
    description: "Unique geometric or organic shapes",
    promptFragment: "abstract mark logo with unique geometric or organic shapes, non-literal symbolic design",
  },
];

// ==========================================
// 2. INDUSTRY / NICHE (19 presets)
// ==========================================
export const industryTemplates: LogoTemplate[] = [
  {
    id: "industry-technology",
    name: "Technology",
    description: "Tech or software company",
    promptFragment: "for technology or software company, tech industry aesthetic",
  },
  {
    id: "industry-finance",
    name: "Finance",
    description: "Financial services or banking",
    promptFragment: "for financial services or banking, finance industry style, trustworthy financial aesthetic",
  },
  {
    id: "industry-healthcare",
    name: "Healthcare",
    description: "Healthcare or medical industry",
    promptFragment: "for healthcare or medical industry, medical professional aesthetic",
  },
  {
    id: "industry-ecommerce",
    name: "E-commerce",
    description: "E-commerce or retail business",
    promptFragment: "for e-commerce or retail business, shopping and commerce aesthetic",
  },
  {
    id: "industry-food-beverage",
    name: "Food & Beverage",
    description: "Food, restaurant, or beverage brand",
    promptFragment: "for food, restaurant, or beverage brand, culinary aesthetic",
  },
  {
    id: "industry-real-estate",
    name: "Real Estate",
    description: "Real estate or property business",
    promptFragment: "for real estate or property business, property and housing aesthetic",
  },
  {
    id: "industry-education",
    name: "Education",
    description: "Educational institution or e-learning",
    promptFragment: "for educational institution or e-learning platform, academic aesthetic",
  },
  {
    id: "industry-fashion",
    name: "Fashion & Beauty",
    description: "Fashion or beauty brand",
    promptFragment: "for fashion or beauty brand, stylish and elegant aesthetic",
  },
  {
    id: "industry-sports",
    name: "Sports & Fitness",
    description: "Sports or fitness company",
    promptFragment: "for sports or fitness company, athletic and dynamic aesthetic",
  },
  {
    id: "industry-legal",
    name: "Legal Services",
    description: "Law firm or legal services",
    promptFragment: "for law firm or legal services, professional legal aesthetic",
  },
  {
    id: "industry-creative",
    name: "Creative Agency",
    description: "Creative or design agency",
    promptFragment: "for creative or design agency, artistic and innovative aesthetic",
  },
  {
    id: "industry-nonprofit",
    name: "Non-Profit",
    description: "Non-profit or charity organization",
    promptFragment: "for non-profit or charity organization, compassionate and community-focused aesthetic",
  },
  {
    id: "industry-travel",
    name: "Travel & Tourism",
    description: "Travel or tourism company",
    promptFragment: "for travel or tourism company, adventure and exploration aesthetic",
  },
  {
    id: "industry-automotive",
    name: "Automotive",
    description: "Automotive or transportation",
    promptFragment: "for automotive or transportation industry, vehicle and mobility aesthetic",
  },
  {
    id: "industry-construction",
    name: "Construction",
    description: "Construction or architecture",
    promptFragment: "for construction or architecture firm, building and structural aesthetic",
  },
  {
    id: "industry-entertainment",
    name: "Entertainment",
    description: "Entertainment or media company",
    promptFragment: "for entertainment or media company, engaging and dynamic aesthetic",
  },
  {
    id: "industry-outsourcing",
    name: "Outsourcing",
    description: "Business process services company",
    promptFragment: "for outsourcing or business process services company, professional B2B aesthetic, global connectivity",
  },
  {
    id: "industry-nanotechnology",
    name: "Nanotechnology",
    description: "Scientific research company",
    promptFragment: "for nanotechnology or scientific research company, precision science aesthetic, molecular and atomic imagery",
  },
  {
    id: "industry-fire-protection",
    name: "Fire Protection",
    description: "Fire safety or emergency services",
    promptFragment: "for fire protection, safety, or emergency services, safety-focused and authoritative aesthetic",
  },
];

// ==========================================
// 3. LOGO FORMAT / LAYOUT (6 presets)
// ==========================================
export const logoFormatTemplates: LogoTemplate[] = [
  {
    id: "format-horizontal",
    name: "Horizontal",
    description: "Icon to the left of text",
    promptFragment: "horizontal layout with icon to the left of text, landscape orientation",
  },
  {
    id: "format-vertical",
    name: "Vertical / Stacked",
    description: "Icon above text",
    promptFragment: "vertical stacked layout with icon above text, portrait orientation",
  },
  {
    id: "format-icon-only",
    name: "Icon Only",
    description: "Standalone icon without text",
    promptFragment: "standalone icon without text, symbol-only design",
  },
  {
    id: "format-text-only",
    name: "Text Only",
    description: "Typography-only logo",
    promptFragment: "typography-only logo without icon, text-based design",
  },
  {
    id: "format-square",
    name: "Square",
    description: "For social media avatars",
    promptFragment: "square format logo suitable for social media avatars, 1:1 aspect ratio",
  },
  {
    id: "format-circular",
    name: "Circular",
    description: "Enclosed in a circle",
    promptFragment: "circular format logo enclosed in a circle, round badge design",
  },
];

// ==========================================
// SECTION B: VISUAL STYLE
// ==========================================

// ==========================================
// 4. DESIGN STYLE (13 presets)
// ==========================================
export const designStyleTemplates: LogoTemplate[] = [
  {
    id: "style-modern-minimal",
    name: "Modern Minimalist",
    description: "Clean, simple lines and shapes",
    promptFragment: "clean, minimal design with simple lines and shapes, modern minimalist aesthetic",
  },
  {
    id: "style-vintage",
    name: "Vintage / Retro",
    description: "Classic design elements",
    promptFragment: "vintage retro style with classic design elements, nostalgic aesthetic",
  },
  {
    id: "style-bold",
    name: "Bold & Dynamic",
    description: "Strong visual impact",
    promptFragment: "bold, dynamic design with strong visual impact, powerful presence",
  },
  {
    id: "style-elegant",
    name: "Elegant Luxury",
    description: "Sophisticated aesthetics",
    promptFragment: "elegant, luxurious design with sophisticated aesthetics, premium feel",
  },
  {
    id: "style-playful",
    name: "Playful & Fun",
    description: "Approachable feel",
    promptFragment: "playful, friendly design with approachable feel, fun aesthetic",
  },
  {
    id: "style-corporate",
    name: "Corporate Professional",
    description: "Trustworthy and established",
    promptFragment: "professional corporate design, trustworthy and established appearance",
  },
  {
    id: "style-futuristic",
    name: "Tech / Futuristic",
    description: "Modern tech feel",
    promptFragment: "futuristic tech-inspired design with modern feel, cutting-edge aesthetic",
  },
  {
    id: "style-handdrawn",
    name: "Hand-drawn / Artisanal",
    description: "Organic imperfections",
    promptFragment: "hand-drawn artisanal style with organic imperfections, crafted feel",
  },
  {
    id: "style-geometric",
    name: "Geometric",
    description: "Precise shapes and patterns",
    promptFragment: "geometric design with precise shapes and patterns, mathematical precision",
  },
  {
    id: "style-flat",
    name: "Flat Design",
    description: "Solid colors, no gradients",
    promptFragment: "flat design style with solid colors, no gradients or shadows",
  },
  {
    id: "style-3d",
    name: "3D / Dimensional",
    description: "Depth and perspective",
    promptFragment: "3D dimensional design with depth and perspective, volumetric feel",
  },
  {
    id: "style-lineart",
    name: "Line Art",
    description: "Clean strokes and outlines",
    promptFragment: "line art style using clean strokes and outlines, linear design",
  },
  {
    id: "style-gradient",
    name: "Gradient",
    description: "Smooth color transitions",
    promptFragment: "modern gradient design with smooth color transitions, gradient aesthetic",
  },
];

// ==========================================
// 5. COLOR SCHEME TYPE (9 presets)
// ==========================================
export const colorSchemeTypeTemplates: LogoTemplate[] = [
  {
    id: "color-monochrome",
    name: "Monochrome",
    description: "Single color with tints and shades",
    promptFragment: "monochrome design using single color with tints and shades",
  },
  {
    id: "color-two-color",
    name: "Two-Color",
    description: "Contrast and balance",
    promptFragment: "two-color palette for contrast and balance, dual-tone design",
  },
  {
    id: "color-multicolor",
    name: "Multicolor",
    description: "Vibrant palette",
    promptFragment: "multicolor vibrant palette, colorful design",
  },
  {
    id: "color-black-white",
    name: "Black & White",
    description: "Classic design",
    promptFragment: "classic black and white design, timeless monochromatic",
  },
  {
    id: "color-gradient",
    name: "Gradient Colors",
    description: "Modern dynamic look",
    promptFragment: "gradient colors for modern dynamic look, color transition",
  },
  {
    id: "color-pastel",
    name: "Pastel",
    description: "Soft color palette",
    promptFragment: "soft pastel color palette, gentle and light colors",
  },
  {
    id: "color-bold",
    name: "Bold / Vibrant",
    description: "High impact colors",
    promptFragment: "bold vibrant colors for high impact, saturated palette",
  },
  {
    id: "color-earth",
    name: "Earth Tones",
    description: "Natural colors",
    promptFragment: "natural earth tone colors, organic and grounded palette",
  },
  {
    id: "color-metallic",
    name: "Metallic",
    description: "Gold, silver, or bronze accents",
    promptFragment: "metallic colors like gold, silver, or bronze accents, premium metallic finish",
  },
];

// ==========================================
// 6. MOOD / TONE (10 presets)
// ==========================================
export const moodTemplates: LogoTemplate[] = [
  {
    id: "mood-professional",
    name: "Professional",
    description: "Trustworthy appearance",
    promptFragment: "professional and trustworthy appearance, business-appropriate",
  },
  {
    id: "mood-friendly",
    name: "Friendly",
    description: "Approachable feel",
    promptFragment: "friendly and approachable feel, welcoming aesthetic",
  },
  {
    id: "mood-innovative",
    name: "Innovative",
    description: "Forward-thinking",
    promptFragment: "innovative and forward-thinking appearance, cutting-edge feel",
  },
  {
    id: "mood-traditional",
    name: "Traditional",
    description: "Established presence",
    promptFragment: "traditional and established appearance, classic feel",
  },
  {
    id: "mood-energetic",
    name: "Energetic",
    description: "Dynamic presence",
    promptFragment: "energetic and dynamic appearance, active feel",
  },
  {
    id: "mood-calm",
    name: "Calm & Serene",
    description: "Peaceful atmosphere",
    promptFragment: "calm and serene atmosphere, peaceful aesthetic",
  },
  {
    id: "mood-bold-confident",
    name: "Bold & Confident",
    description: "Strong presence",
    promptFragment: "bold and confident presence, assertive appearance",
  },
  {
    id: "mood-sophisticated",
    name: "Sophisticated",
    description: "Refined aesthetic",
    promptFragment: "sophisticated and refined appearance, elegant feel",
  },
  {
    id: "mood-playful",
    name: "Playful",
    description: "Lighthearted feel",
    promptFragment: "playful and lighthearted appearance, fun aesthetic",
  },
  {
    id: "mood-authoritative",
    name: "Authoritative",
    description: "Commanding presence",
    promptFragment: "authoritative and commanding presence, leadership aesthetic",
  },
];

// ==========================================
// SECTION C: ICON/SYMBOL DESIGN
// ==========================================

// ==========================================
// 7. ICON STYLE (8 presets)
// ==========================================
export const iconStyleTemplates: LogoTemplate[] = [
  {
    id: "icon-abstract-geometric",
    name: "Abstract Geometric",
    description: "Basic shapes composition",
    promptFragment: "abstract geometric icon with basic shapes, mathematical forms",
  },
  {
    id: "icon-organic",
    name: "Organic / Natural",
    description: "Flowing curves",
    promptFragment: "organic natural icon with flowing curves, nature-inspired forms",
  },
  {
    id: "icon-technical",
    name: "Technical / Angular",
    description: "Precise edges",
    promptFragment: "technical angular icon with precise edges, engineered appearance",
  },
  {
    id: "icon-pictorial",
    name: "Pictorial / Literal",
    description: "Represents literal concept",
    promptFragment: "pictorial icon representing literal concept, recognizable imagery",
  },
  {
    id: "icon-negative-space",
    name: "Negative Space",
    description: "Clever use of negative space",
    promptFragment: "clever use of negative space in icon design, hidden elements",
  },
  {
    id: "icon-interconnected",
    name: "Interconnected",
    description: "Elements showing unity",
    promptFragment: "interconnected elements showing unity, linked forms",
  },
  {
    id: "icon-simplified",
    name: "Simplified",
    description: "Highly minimal icon",
    promptFragment: "highly simplified minimal icon, essential forms only",
  },
  {
    id: "icon-detailed",
    name: "Detailed / Intricate",
    description: "Fine elements",
    promptFragment: "detailed intricate icon with fine elements, complex design",
  },
];

// ==========================================
// 8. SYMBOL ELEMENTS (Multi-select, 10 presets)
// ==========================================
export const symbolElementsTemplates: LogoTemplate[] = [
  {
    id: "symbol-letters",
    name: "Letters / Initials",
    description: "Company initials",
    promptFragment: "incorporating company initials or letters",
  },
  {
    id: "symbol-circle",
    name: "Circle Shape",
    description: "Circular element",
    promptFragment: "using circle as primary element, circular symbolism",
  },
  {
    id: "symbol-square",
    name: "Square Shape",
    description: "Square element",
    promptFragment: "using square as primary element, stability symbolism",
  },
  {
    id: "symbol-triangle",
    name: "Triangle Shape",
    description: "Triangular element",
    promptFragment: "using triangle as primary element, dynamic symbolism",
  },
  {
    id: "symbol-nature",
    name: "Nature Elements",
    description: "Leaves, trees, or water",
    promptFragment: "incorporating natural elements like leaves, trees, or water",
  },
  {
    id: "symbol-tech",
    name: "Tech Elements",
    description: "Circuits, nodes, connections",
    promptFragment: "with technology symbols like circuits, nodes, or connections",
  },
  {
    id: "symbol-human",
    name: "Human / People",
    description: "Human figures or silhouettes",
    promptFragment: "featuring human figures or silhouettes",
  },
  {
    id: "symbol-animals",
    name: "Animals",
    description: "Animal symbolism",
    promptFragment: "with animal symbolism, creature-based design",
  },
  {
    id: "symbol-buildings",
    name: "Buildings / Architecture",
    description: "Architectural elements",
    promptFragment: "incorporating architectural elements, building forms",
  },
  {
    id: "symbol-arrow",
    name: "Arrow / Direction",
    description: "Movement suggestion",
    promptFragment: "with arrow or directional elements suggesting movement and progress",
  },
  {
    id: "symbol-globe",
    name: "Globe / World",
    description: "Global symbolism",
    promptFragment: "with globe or world symbolism, international presence",
  },
  {
    id: "symbol-tools",
    name: "Tools / Objects",
    description: "Relevant tools or objects",
    promptFragment: "featuring relevant tools or objects, functional imagery",
  },
];

// ==========================================
// SECTION D: TYPOGRAPHY
// ==========================================

// ==========================================
// 9. FONT CATEGORY (10 presets)
// ==========================================
export const fontCategoryTemplates: LogoTemplate[] = [
  {
    id: "font-sans-serif",
    name: "Sans-Serif Modern",
    description: "Modern sans-serif",
    promptFragment: "modern sans-serif typography, clean and contemporary",
  },
  {
    id: "font-serif",
    name: "Serif Classic",
    description: "Classic established feel",
    promptFragment: "classic serif typography for established feel, traditional elegance",
  },
  {
    id: "font-slab",
    name: "Slab Serif",
    description: "Bold strong presence",
    promptFragment: "bold slab serif for strong presence, sturdy typography",
  },
  {
    id: "font-script",
    name: "Script / Handwritten",
    description: "Elegant script",
    promptFragment: "elegant script or handwritten typography, flowing letters",
  },
  {
    id: "font-display",
    name: "Display / Decorative",
    description: "Unique display font",
    promptFragment: "unique display typography, decorative letterforms",
  },
  {
    id: "font-geometric-sans",
    name: "Geometric Sans",
    description: "Modern tech feel",
    promptFragment: "geometric sans-serif for modern tech feel, mathematical precision",
  },
  {
    id: "font-rounded",
    name: "Rounded",
    description: "Friendly rounded",
    promptFragment: "friendly rounded typography, soft corners",
  },
  {
    id: "font-condensed",
    name: "Condensed",
    description: "Compact design",
    promptFragment: "condensed typography for compact design, narrow letterforms",
  },
  {
    id: "font-bold",
    name: "Bold / Heavy",
    description: "Heavy weight",
    promptFragment: "bold heavy weight typography, impactful presence",
  },
  {
    id: "font-light",
    name: "Light / Thin",
    description: "Elegant thin",
    promptFragment: "light elegant thin typography, delicate appearance",
  },
];

// ==========================================
// 10. TYPOGRAPHY TREATMENT (7 presets)
// ==========================================
export const typographyTreatmentTemplates: LogoTemplate[] = [
  {
    id: "treatment-uppercase",
    name: "All Uppercase",
    description: "All caps letters",
    promptFragment: "text in all uppercase letters, commanding presence",
  },
  {
    id: "treatment-lowercase",
    name: "All Lowercase",
    description: "All lowercase letters",
    promptFragment: "text in all lowercase letters, approachable feel",
  },
  {
    id: "treatment-title-case",
    name: "Title Case",
    description: "Standard capitalization",
    promptFragment: "text in title case, professional standard",
  },
  {
    id: "treatment-mixed",
    name: "Mixed Case",
    description: "Creative mix",
    promptFragment: "creative mixed case treatment, unique styling",
  },
  {
    id: "treatment-spaced",
    name: "Spaced Letters",
    description: "Wide letter tracking",
    promptFragment: "widely spaced letter tracking, airy feel",
  },
  {
    id: "treatment-stacked",
    name: "Stacked Words",
    description: "Words stacked vertically",
    promptFragment: "words stacked vertically, layered arrangement",
  },
  {
    id: "treatment-integrated",
    name: "Integrated with Icon",
    description: "Typography and icon merged",
    promptFragment: "typography integrated with icon element, unified design",
  },
];

// ==========================================
// SECTION E: ADDITIONAL OPTIONS
// ==========================================

// ==========================================
// 11. SPECIAL EFFECTS (6 presets)
// ==========================================
export const specialEffectsTemplates: LogoTemplate[] = [
  {
    id: "effect-none",
    name: "None",
    description: "No special effects",
    promptFragment: "",
  },
  {
    id: "effect-shadow",
    name: "Drop Shadow",
    description: "Subtle depth",
    promptFragment: "subtle drop shadow for depth, dimensional effect",
  },
  {
    id: "effect-outline",
    name: "Outline / Stroke",
    description: "Stroke treatment",
    promptFragment: "outline stroke treatment, bordered design",
  },
  {
    id: "effect-embossed",
    name: "Embossed",
    description: "Dimensional look",
    promptFragment: "embossed effect for dimensional look, raised appearance",
  },
  {
    id: "effect-glow",
    name: "Glow",
    description: "Subtle glow",
    promptFragment: "subtle glow effect, luminous appearance",
  },
  {
    id: "effect-texture",
    name: "Texture",
    description: "Subtle texture overlay",
    promptFragment: "subtle texture overlay, tactile feel",
  },
];

// ==========================================
// 12. BACKGROUND STYLE (4 presets)
// ==========================================
export const backgroundStyleTemplates: LogoTemplate[] = [
  {
    id: "bg-transparent",
    name: "Transparent",
    description: "No background",
    promptFragment: "on transparent background, isolated design",
  },
  {
    id: "bg-white",
    name: "White",
    description: "Clean white background",
    promptFragment: "on clean white background, bright presentation",
  },
  {
    id: "bg-dark",
    name: "Dark / Black",
    description: "Dark background",
    promptFragment: "on dark black background, dramatic presentation",
  },
  {
    id: "bg-colored",
    name: "Colored",
    description: "Colored background",
    promptFragment: "on colored background matching brand palette",
  },
];

// ==========================================
// QUICK START TEMPLATES
// ==========================================
export const logoQuickStartTemplates: LogoQuickStartTemplate[] = [
  {
    id: "quick-tech-startup",
    name: "Tech Startup",
    description: "Modern minimalist with geometric icon",
    config: {
      logoType: "logo-type-combination",
      industry: "industry-technology",
      logoFormat: "format-horizontal",
      designStyle: "style-modern-minimal",
      colorSchemeType: "color-two-color",
      mood: "mood-innovative",
      iconStyle: "icon-abstract-geometric",
      fontCategory: "font-geometric-sans",
      typographyTreatment: "treatment-lowercase",
      specialEffects: "effect-none",
      backgroundStyle: "bg-transparent",
      primaryColor: "#0052CC",
      secondaryColor: "#FFFFFF",
    },
  },
  {
    id: "quick-law-firm",
    name: "Law Firm",
    description: "Classic serif with emblem style",
    config: {
      logoType: "logo-type-emblem",
      industry: "industry-legal",
      logoFormat: "format-square",
      designStyle: "style-corporate",
      colorSchemeType: "color-two-color",
      mood: "mood-authoritative",
      iconStyle: "icon-pictorial",
      symbolElements: ["symbol-buildings"],
      fontCategory: "font-serif",
      typographyTreatment: "treatment-uppercase",
      specialEffects: "effect-none",
      backgroundStyle: "bg-transparent",
      primaryColor: "#1A365D",
      secondaryColor: "#D4AF37",
    },
  },
  {
    id: "quick-organic-food",
    name: "Organic Food",
    description: "Hand-drawn with nature elements",
    config: {
      logoType: "logo-type-combination",
      industry: "industry-food-beverage",
      logoFormat: "format-horizontal",
      designStyle: "style-handdrawn",
      colorSchemeType: "color-earth",
      mood: "mood-friendly",
      iconStyle: "icon-organic",
      symbolElements: ["symbol-nature"],
      fontCategory: "font-rounded",
      typographyTreatment: "treatment-title-case",
      specialEffects: "effect-none",
      backgroundStyle: "bg-transparent",
      primaryColor: "#2D5016",
      secondaryColor: "#8B4513",
    },
  },
  {
    id: "quick-fashion-brand",
    name: "Fashion Brand",
    description: "Elegant wordmark with script typography",
    config: {
      logoType: "logo-type-wordmark",
      industry: "industry-fashion",
      logoFormat: "format-text-only",
      designStyle: "style-elegant",
      colorSchemeType: "color-black-white",
      mood: "mood-sophisticated",
      fontCategory: "font-script",
      typographyTreatment: "treatment-title-case",
      specialEffects: "effect-none",
      backgroundStyle: "bg-transparent",
      primaryColor: "#000000",
      secondaryColor: "#D4AF37",
    },
  },
  {
    id: "quick-sports-team",
    name: "Sports Team",
    description: "Bold dynamic with mascot/emblem",
    config: {
      logoType: "logo-type-mascot",
      industry: "industry-sports",
      logoFormat: "format-square",
      designStyle: "style-bold",
      colorSchemeType: "color-bold",
      mood: "mood-energetic",
      iconStyle: "icon-detailed",
      symbolElements: ["symbol-animals"],
      fontCategory: "font-bold",
      typographyTreatment: "treatment-uppercase",
      specialEffects: "effect-shadow",
      backgroundStyle: "bg-transparent",
      primaryColor: "#DC2626",
      secondaryColor: "#FBBF24",
    },
  },
  {
    id: "quick-creative-agency",
    name: "Creative Agency",
    description: "Abstract geometric with multicolor",
    config: {
      logoType: "logo-type-abstract",
      industry: "industry-creative",
      logoFormat: "format-horizontal",
      designStyle: "style-geometric",
      colorSchemeType: "color-multicolor",
      mood: "mood-innovative",
      iconStyle: "icon-abstract-geometric",
      fontCategory: "font-sans-serif",
      typographyTreatment: "treatment-lowercase",
      specialEffects: "effect-none",
      backgroundStyle: "bg-transparent",
      primaryColor: "#7C3AED",
      secondaryColor: "#EC4899",
      accentColor: "#06B6D4",
    },
  },
  {
    id: "quick-healthcare",
    name: "Healthcare",
    description: "Clean minimal with cross/heart symbol",
    config: {
      logoType: "logo-type-combination",
      industry: "industry-healthcare",
      logoFormat: "format-horizontal",
      designStyle: "style-modern-minimal",
      colorSchemeType: "color-two-color",
      mood: "mood-calm",
      iconStyle: "icon-simplified",
      fontCategory: "font-sans-serif",
      typographyTreatment: "treatment-title-case",
      specialEffects: "effect-none",
      backgroundStyle: "bg-transparent",
      primaryColor: "#0891B2",
      secondaryColor: "#10B981",
    },
  },
  {
    id: "quick-restaurant",
    name: "Restaurant",
    description: "Vintage style with decorative typography",
    config: {
      logoType: "logo-type-emblem",
      industry: "industry-food-beverage",
      logoFormat: "format-circular",
      designStyle: "style-vintage",
      colorSchemeType: "color-earth",
      mood: "mood-traditional",
      iconStyle: "icon-pictorial",
      fontCategory: "font-display",
      typographyTreatment: "treatment-uppercase",
      specialEffects: "effect-texture",
      backgroundStyle: "bg-transparent",
      primaryColor: "#7C2D12",
      secondaryColor: "#FEF3C7",
    },
  },
  {
    id: "quick-finance",
    name: "Finance",
    description: "Corporate professional with shield icon",
    config: {
      logoType: "logo-type-combination",
      industry: "industry-finance",
      logoFormat: "format-horizontal",
      designStyle: "style-corporate",
      colorSchemeType: "color-two-color",
      mood: "mood-professional",
      iconStyle: "icon-pictorial",
      symbolElements: ["symbol-buildings"],
      fontCategory: "font-serif",
      typographyTreatment: "treatment-title-case",
      specialEffects: "effect-none",
      backgroundStyle: "bg-transparent",
      primaryColor: "#1E3A5F",
      secondaryColor: "#6B7280",
    },
  },
  {
    id: "quick-kids-brand",
    name: "Kids Brand",
    description: "Playful with rounded fonts",
    config: {
      logoType: "logo-type-combination",
      industry: "industry-education",
      logoFormat: "format-horizontal",
      designStyle: "style-playful",
      colorSchemeType: "color-multicolor",
      mood: "mood-playful",
      iconStyle: "icon-organic",
      fontCategory: "font-rounded",
      typographyTreatment: "treatment-lowercase",
      specialEffects: "effect-none",
      backgroundStyle: "bg-transparent",
      primaryColor: "#F472B6",
      secondaryColor: "#38BDF8",
      accentColor: "#FBBF24",
    },
  },
  {
    id: "quick-outsourcing",
    name: "Outsourcing Company",
    description: "Corporate professional with global symbols",
    config: {
      logoType: "logo-type-combination",
      industry: "industry-outsourcing",
      logoFormat: "format-horizontal",
      designStyle: "style-corporate",
      colorSchemeType: "color-two-color",
      mood: "mood-professional",
      iconStyle: "icon-interconnected",
      symbolElements: ["symbol-globe"],
      fontCategory: "font-sans-serif",
      typographyTreatment: "treatment-title-case",
      specialEffects: "effect-none",
      backgroundStyle: "bg-transparent",
      primaryColor: "#1E40AF",
      secondaryColor: "#60A5FA",
    },
  },
  {
    id: "quick-nanotechnology",
    name: "Nanotechnology",
    description: "Futuristic tech with molecular icons",
    config: {
      logoType: "logo-type-combination",
      industry: "industry-nanotechnology",
      logoFormat: "format-horizontal",
      designStyle: "style-futuristic",
      colorSchemeType: "color-gradient",
      mood: "mood-innovative",
      iconStyle: "icon-abstract-geometric",
      symbolElements: ["symbol-tech", "symbol-circle"],
      fontCategory: "font-geometric-sans",
      typographyTreatment: "treatment-uppercase",
      specialEffects: "effect-glow",
      backgroundStyle: "bg-transparent",
      primaryColor: "#6366F1",
      secondaryColor: "#A855F7",
    },
  },
  {
    id: "quick-fire-protection",
    name: "Fire Protection",
    description: "Bold safety with shield/flame symbols",
    config: {
      logoType: "logo-type-emblem",
      industry: "industry-fire-protection",
      logoFormat: "format-square",
      designStyle: "style-bold",
      colorSchemeType: "color-two-color",
      mood: "mood-authoritative",
      iconStyle: "icon-pictorial",
      fontCategory: "font-bold",
      typographyTreatment: "treatment-uppercase",
      specialEffects: "effect-none",
      backgroundStyle: "bg-transparent",
      primaryColor: "#DC2626",
      secondaryColor: "#FCD34D",
    },
  },
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get a template by its ID from any category
 */
export function getLogoTemplateById(id: string): LogoTemplate | undefined {
  const allTemplates = [
    ...logoTypeTemplates,
    ...industryTemplates,
    ...logoFormatTemplates,
    ...designStyleTemplates,
    ...colorSchemeTypeTemplates,
    ...moodTemplates,
    ...iconStyleTemplates,
    ...symbolElementsTemplates,
    ...fontCategoryTemplates,
    ...typographyTreatmentTemplates,
    ...specialEffectsTemplates,
    ...backgroundStyleTemplates,
  ];
  return allTemplates.find((t) => t.id === id);
}

/**
 * Get quick start template by ID
 */
export function getLogoQuickStartById(id: string): LogoQuickStartTemplate | undefined {
  return logoQuickStartTemplates.find((t) => t.id === id);
}

/**
 * Get all templates for a specific category
 */
export function getLogoTemplatesByCategory(category: string): LogoTemplate[] {
  const categoryMap: Record<string, LogoTemplate[]> = {
    logoType: logoTypeTemplates,
    industry: industryTemplates,
    logoFormat: logoFormatTemplates,
    designStyle: designStyleTemplates,
    colorSchemeType: colorSchemeTypeTemplates,
    mood: moodTemplates,
    iconStyle: iconStyleTemplates,
    symbolElements: symbolElementsTemplates,
    fontCategory: fontCategoryTemplates,
    typographyTreatment: typographyTreatmentTemplates,
    specialEffects: specialEffectsTemplates,
    backgroundStyle: backgroundStyleTemplates,
  };
  return categoryMap[category] || [];
}
