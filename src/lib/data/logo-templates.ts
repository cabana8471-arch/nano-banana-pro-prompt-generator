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
    promptFragment: "designed as a wordmark where the company name itself becomes the visual identity",
  },
  {
    id: "logo-type-lettermark",
    name: "Lettermark / Monogram",
    description: "Logo using initials or abbreviation",
    promptFragment: "designed as a lettermark using the company initials in a distinctive monogram arrangement",
  },
  {
    id: "logo-type-symbol",
    name: "Symbol / Icon",
    description: "Iconic symbol without text",
    promptFragment: "designed as a standalone iconic symbol that works without text",
  },
  {
    id: "logo-type-combination",
    name: "Combination Mark",
    description: "Both icon and company name",
    promptFragment: "designed as a combination mark integrating both icon and company name harmoniously",
  },
  {
    id: "logo-type-emblem",
    name: "Emblem",
    description: "Text integrated within a symbol or badge",
    promptFragment: "designed as an emblem with text integrated within a badge or crest-style frame",
  },
  {
    id: "logo-type-mascot",
    name: "Mascot",
    description: "Character or illustrated figure",
    promptFragment: "designed as a mascot logo featuring a memorable illustrated character",
  },
  {
    id: "logo-type-abstract",
    name: "Abstract Mark",
    description: "Unique geometric or organic shapes",
    promptFragment: "designed as an abstract mark using unique geometric or organic shapes to convey brand essence",
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
    promptFragment: "for the technology sector conveying innovation and digital excellence",
  },
  {
    id: "industry-finance",
    name: "Finance",
    description: "Financial services or banking",
    promptFragment: "for the financial services sector conveying trust and stability",
  },
  {
    id: "industry-healthcare",
    name: "Healthcare",
    description: "Healthcare or medical industry",
    promptFragment: "for the healthcare sector conveying care and professionalism",
  },
  {
    id: "industry-ecommerce",
    name: "E-commerce",
    description: "E-commerce or retail business",
    promptFragment: "for the e-commerce sector conveying convenience and modern shopping",
  },
  {
    id: "industry-food-beverage",
    name: "Food & Beverage",
    description: "Food, restaurant, or beverage brand",
    promptFragment: "for the food and beverage sector conveying freshness and culinary appeal",
  },
  {
    id: "industry-real-estate",
    name: "Real Estate",
    description: "Real estate or property business",
    promptFragment: "for the real estate sector conveying property expertise and reliability",
  },
  {
    id: "industry-education",
    name: "Education",
    description: "Educational institution or e-learning",
    promptFragment: "for the education sector conveying knowledge and academic excellence",
  },
  {
    id: "industry-fashion",
    name: "Fashion & Beauty",
    description: "Fashion or beauty brand",
    promptFragment: "for the fashion and beauty sector conveying style and elegance",
  },
  {
    id: "industry-sports",
    name: "Sports & Fitness",
    description: "Sports or fitness company",
    promptFragment: "for the sports and fitness sector conveying energy and athleticism",
  },
  {
    id: "industry-legal",
    name: "Legal Services",
    description: "Law firm or legal services",
    promptFragment: "for the legal services sector conveying authority and trustworthiness",
  },
  {
    id: "industry-creative",
    name: "Creative Agency",
    description: "Creative or design agency",
    promptFragment: "for the creative industry conveying artistic vision and innovation",
  },
  {
    id: "industry-nonprofit",
    name: "Non-Profit",
    description: "Non-profit or charity organization",
    promptFragment: "for the nonprofit sector conveying compassion and community impact",
  },
  {
    id: "industry-travel",
    name: "Travel & Tourism",
    description: "Travel or tourism company",
    promptFragment: "for the travel and tourism sector conveying adventure and exploration",
  },
  {
    id: "industry-automotive",
    name: "Automotive",
    description: "Automotive or transportation",
    promptFragment: "for the automotive sector conveying performance and mobility",
  },
  {
    id: "industry-construction",
    name: "Construction",
    description: "Construction or architecture",
    promptFragment: "for the construction sector conveying strength and structural expertise",
  },
  {
    id: "industry-entertainment",
    name: "Entertainment",
    description: "Entertainment or media company",
    promptFragment: "for the entertainment sector conveying excitement and engagement",
  },
  {
    id: "industry-outsourcing",
    name: "Outsourcing",
    description: "Business process services company",
    promptFragment: "for the business process outsourcing sector conveying global connectivity and professionalism",
  },
  {
    id: "industry-nanotechnology",
    name: "Nanotechnology",
    description: "Scientific research company",
    promptFragment: "for the nanotechnology and scientific research sector conveying precision and innovation",
  },
  {
    id: "industry-fire-protection",
    name: "Fire Protection",
    description: "Fire safety or emergency services",
    promptFragment: "for the fire protection and safety sector conveying authority and reliability",
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
    promptFragment: "arranged in a horizontal layout with icon positioned to the left of text",
  },
  {
    id: "format-vertical",
    name: "Vertical / Stacked",
    description: "Icon above text",
    promptFragment: "arranged in a vertical stacked layout with icon positioned above text",
  },
  {
    id: "format-icon-only",
    name: "Icon Only",
    description: "Standalone icon without text",
    promptFragment: "arranged as a standalone icon without any text elements",
  },
  {
    id: "format-text-only",
    name: "Text Only",
    description: "Typography-only logo",
    promptFragment: "arranged as a typography-only design without icon elements",
  },
  {
    id: "format-square",
    name: "Square",
    description: "For social media avatars",
    promptFragment: "arranged in a square format optimized for social media and app icons",
  },
  {
    id: "format-circular",
    name: "Circular",
    description: "Enclosed in a circle",
    promptFragment: "arranged within a circular frame creating a badge-style appearance",
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
    promptFragment: "using a modern minimalist approach with clean lines and purposeful simplicity",
  },
  {
    id: "style-vintage",
    name: "Vintage / Retro",
    description: "Classic design elements",
    promptFragment: "using a vintage retro aesthetic with classic design elements and nostalgic charm",
  },
  {
    id: "style-bold",
    name: "Bold & Dynamic",
    description: "Strong visual impact",
    promptFragment: "using a bold dynamic approach with strong visual impact and commanding presence",
  },
  {
    id: "style-elegant",
    name: "Elegant Luxury",
    description: "Sophisticated aesthetics",
    promptFragment: "using an elegant luxury aesthetic with sophisticated and premium design elements",
  },
  {
    id: "style-playful",
    name: "Playful & Fun",
    description: "Approachable feel",
    promptFragment: "using a playful friendly approach with approachable and welcoming design elements",
  },
  {
    id: "style-corporate",
    name: "Corporate Professional",
    description: "Trustworthy and established",
    promptFragment: "using a corporate professional aesthetic conveying trust and established presence",
  },
  {
    id: "style-futuristic",
    name: "Tech / Futuristic",
    description: "Modern tech feel",
    promptFragment: "using a futuristic tech-inspired aesthetic with cutting-edge design elements",
  },
  {
    id: "style-handdrawn",
    name: "Hand-drawn / Artisanal",
    description: "Organic imperfections",
    promptFragment: "using a hand-drawn artisanal approach with organic imperfections and crafted character",
  },
  {
    id: "style-geometric",
    name: "Geometric",
    description: "Precise shapes and patterns",
    promptFragment: "using geometric precision with mathematically precise shapes and patterns",
  },
  {
    id: "style-flat",
    name: "Flat Design",
    description: "Solid colors, no gradients",
    promptFragment: "using flat design principles with solid colors and no gradients or shadows",
  },
  {
    id: "style-3d",
    name: "3D / Dimensional",
    description: "Depth and perspective",
    promptFragment: "using three-dimensional design with depth and perspective for volumetric impact",
  },
  {
    id: "style-lineart",
    name: "Line Art",
    description: "Clean strokes and outlines",
    promptFragment: "using line art technique with clean strokes and refined outlines",
  },
  {
    id: "style-gradient",
    name: "Gradient",
    description: "Smooth color transitions",
    promptFragment: "using modern gradient design with smooth color transitions throughout",
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
    promptFragment: "with a monochrome color scheme using tints and shades of a single color",
  },
  {
    id: "color-two-color",
    name: "Two-Color",
    description: "Contrast and balance",
    promptFragment: "with a two-color palette creating visual contrast and balance",
  },
  {
    id: "color-multicolor",
    name: "Multicolor",
    description: "Vibrant palette",
    promptFragment: "with a multicolor vibrant palette expressing diversity and energy",
  },
  {
    id: "color-black-white",
    name: "Black & White",
    description: "Classic design",
    promptFragment: "with a classic black and white color scheme for timeless elegance",
  },
  {
    id: "color-gradient",
    name: "Gradient Colors",
    description: "Modern dynamic look",
    promptFragment: "with gradient color transitions for a modern dynamic appearance",
  },
  {
    id: "color-pastel",
    name: "Pastel",
    description: "Soft color palette",
    promptFragment: "with a soft pastel color palette conveying gentleness and approachability",
  },
  {
    id: "color-bold",
    name: "Bold / Vibrant",
    description: "High impact colors",
    promptFragment: "with bold vibrant colors for maximum visual impact",
  },
  {
    id: "color-earth",
    name: "Earth Tones",
    description: "Natural colors",
    promptFragment: "with natural earth tone colors conveying organic authenticity",
  },
  {
    id: "color-metallic",
    name: "Metallic",
    description: "Gold, silver, or bronze accents",
    promptFragment: "with metallic accents like gold or silver for premium appeal",
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
    promptFragment: "creating a professional and trustworthy impression",
  },
  {
    id: "mood-friendly",
    name: "Friendly",
    description: "Approachable feel",
    promptFragment: "creating a friendly and welcoming impression",
  },
  {
    id: "mood-innovative",
    name: "Innovative",
    description: "Forward-thinking",
    promptFragment: "creating an innovative and forward-thinking impression",
  },
  {
    id: "mood-traditional",
    name: "Traditional",
    description: "Established presence",
    promptFragment: "creating a traditional and established impression",
  },
  {
    id: "mood-energetic",
    name: "Energetic",
    description: "Dynamic presence",
    promptFragment: "creating an energetic and dynamic impression",
  },
  {
    id: "mood-calm",
    name: "Calm & Serene",
    description: "Peaceful atmosphere",
    promptFragment: "creating a calm and serene impression",
  },
  {
    id: "mood-bold-confident",
    name: "Bold & Confident",
    description: "Strong presence",
    promptFragment: "creating a bold and confident impression",
  },
  {
    id: "mood-sophisticated",
    name: "Sophisticated",
    description: "Refined aesthetic",
    promptFragment: "creating a sophisticated and refined impression",
  },
  {
    id: "mood-playful",
    name: "Playful",
    description: "Lighthearted feel",
    promptFragment: "creating a playful and lighthearted impression",
  },
  {
    id: "mood-authoritative",
    name: "Authoritative",
    description: "Commanding presence",
    promptFragment: "creating an authoritative and commanding impression",
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
    promptFragment: "featuring an abstract geometric icon composed of basic mathematical shapes",
  },
  {
    id: "icon-organic",
    name: "Organic / Natural",
    description: "Flowing curves",
    promptFragment: "featuring an organic icon with flowing curves and nature-inspired forms",
  },
  {
    id: "icon-technical",
    name: "Technical / Angular",
    description: "Precise edges",
    promptFragment: "featuring a technical icon with precise angular edges and engineered appearance",
  },
  {
    id: "icon-pictorial",
    name: "Pictorial / Literal",
    description: "Represents literal concept",
    promptFragment: "featuring a pictorial icon that literally represents the brand concept",
  },
  {
    id: "icon-negative-space",
    name: "Negative Space",
    description: "Clever use of negative space",
    promptFragment: "featuring clever use of negative space to create hidden visual elements",
  },
  {
    id: "icon-interconnected",
    name: "Interconnected",
    description: "Elements showing unity",
    promptFragment: "featuring interconnected elements that express unity and connection",
  },
  {
    id: "icon-simplified",
    name: "Simplified",
    description: "Highly minimal icon",
    promptFragment: "featuring a highly simplified icon reduced to essential forms",
  },
  {
    id: "icon-detailed",
    name: "Detailed / Intricate",
    description: "Fine elements",
    promptFragment: "featuring a detailed intricate icon with fine visual elements",
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
    promptFragment: "incorporating stylized company initials as visual elements",
  },
  {
    id: "symbol-circle",
    name: "Circle Shape",
    description: "Circular element",
    promptFragment: "incorporating circular shapes symbolizing unity and completeness",
  },
  {
    id: "symbol-square",
    name: "Square Shape",
    description: "Square element",
    promptFragment: "incorporating square shapes symbolizing stability and reliability",
  },
  {
    id: "symbol-triangle",
    name: "Triangle Shape",
    description: "Triangular element",
    promptFragment: "incorporating triangular shapes symbolizing dynamism and direction",
  },
  {
    id: "symbol-nature",
    name: "Nature Elements",
    description: "Leaves, trees, or water",
    promptFragment: "incorporating natural elements like leaves or organic forms",
  },
  {
    id: "symbol-tech",
    name: "Tech Elements",
    description: "Circuits, nodes, connections",
    promptFragment: "incorporating technology symbols like circuits or digital nodes",
  },
  {
    id: "symbol-human",
    name: "Human / People",
    description: "Human figures or silhouettes",
    promptFragment: "incorporating human figures or stylized silhouettes",
  },
  {
    id: "symbol-animals",
    name: "Animals",
    description: "Animal symbolism",
    promptFragment: "incorporating animal symbolism reflecting brand characteristics",
  },
  {
    id: "symbol-buildings",
    name: "Buildings / Architecture",
    description: "Architectural elements",
    promptFragment: "incorporating architectural elements or structural forms",
  },
  {
    id: "symbol-arrow",
    name: "Arrow / Direction",
    description: "Movement suggestion",
    promptFragment: "incorporating arrows or directional elements suggesting progress",
  },
  {
    id: "symbol-globe",
    name: "Globe / World",
    description: "Global symbolism",
    promptFragment: "incorporating globe or world imagery suggesting global presence",
  },
  {
    id: "symbol-tools",
    name: "Tools / Objects",
    description: "Relevant tools or objects",
    promptFragment: "incorporating relevant tools or objects representing the industry",
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
    promptFragment: "styled in modern sans-serif typography for clean contemporary appeal",
  },
  {
    id: "font-serif",
    name: "Serif Classic",
    description: "Classic established feel",
    promptFragment: "styled in classic serif typography conveying established elegance",
  },
  {
    id: "font-slab",
    name: "Slab Serif",
    description: "Bold strong presence",
    promptFragment: "styled in bold slab serif typography for commanding presence",
  },
  {
    id: "font-script",
    name: "Script / Handwritten",
    description: "Elegant script",
    promptFragment: "styled in elegant script typography with flowing letterforms",
  },
  {
    id: "font-display",
    name: "Display / Decorative",
    description: "Unique display font",
    promptFragment: "styled in unique display typography with distinctive character",
  },
  {
    id: "font-geometric-sans",
    name: "Geometric Sans",
    description: "Modern tech feel",
    promptFragment: "styled in geometric sans-serif typography for tech-forward appeal",
  },
  {
    id: "font-rounded",
    name: "Rounded",
    description: "Friendly rounded",
    promptFragment: "styled in friendly rounded typography with soft approachable corners",
  },
  {
    id: "font-condensed",
    name: "Condensed",
    description: "Compact design",
    promptFragment: "styled in condensed typography for compact efficient appearance",
  },
  {
    id: "font-bold",
    name: "Bold / Heavy",
    description: "Heavy weight",
    promptFragment: "styled in bold heavy-weight typography for strong visual impact",
  },
  {
    id: "font-light",
    name: "Light / Thin",
    description: "Elegant thin",
    promptFragment: "styled in light thin typography for elegant delicate appearance",
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
    promptFragment: "with all uppercase lettering for commanding presence",
  },
  {
    id: "treatment-lowercase",
    name: "All Lowercase",
    description: "All lowercase letters",
    promptFragment: "with all lowercase lettering for approachable modern feel",
  },
  {
    id: "treatment-title-case",
    name: "Title Case",
    description: "Standard capitalization",
    promptFragment: "with title case lettering for professional readability",
  },
  {
    id: "treatment-mixed",
    name: "Mixed Case",
    description: "Creative mix",
    promptFragment: "with creative mixed case treatment for unique character",
  },
  {
    id: "treatment-spaced",
    name: "Spaced Letters",
    description: "Wide letter tracking",
    promptFragment: "with widely spaced letter tracking for elegant breathing room",
  },
  {
    id: "treatment-stacked",
    name: "Stacked Words",
    description: "Words stacked vertically",
    promptFragment: "with words stacked vertically for compact visual arrangement",
  },
  {
    id: "treatment-integrated",
    name: "Integrated with Icon",
    description: "Typography and icon merged",
    promptFragment: "with typography seamlessly integrated into the icon design",
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
    promptFragment: "enhanced by subtle drop shadow for dimensional depth",
  },
  {
    id: "effect-outline",
    name: "Outline / Stroke",
    description: "Stroke treatment",
    promptFragment: "enhanced by clean outline stroke treatment",
  },
  {
    id: "effect-embossed",
    name: "Embossed",
    description: "Dimensional look",
    promptFragment: "enhanced by embossed effect for raised dimensional appearance",
  },
  {
    id: "effect-glow",
    name: "Glow",
    description: "Subtle glow",
    promptFragment: "enhanced by subtle glow effect for luminous presence",
  },
  {
    id: "effect-texture",
    name: "Texture",
    description: "Subtle texture overlay",
    promptFragment: "enhanced by subtle texture overlay for tactile depth",
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
    promptFragment: "presented on a transparent background for maximum versatility",
  },
  {
    id: "bg-white",
    name: "White",
    description: "Clean white background",
    promptFragment: "presented on a clean white background for crisp visibility",
  },
  {
    id: "bg-dark",
    name: "Dark / Black",
    description: "Dark background",
    promptFragment: "presented on a dark background for dramatic contrast",
  },
  {
    id: "bg-colored",
    name: "Colored",
    description: "Colored background",
    promptFragment: "presented on a colored background complementing the brand palette",
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
