import type { Template } from "@/lib/types/generation";

// ==========================================
// Lighting Templates
// ==========================================
export const lightingTemplates: Template[] = [
  // Natural Lighting
  {
    id: "lighting-golden-hour",
    name: "Golden Hour",
    description: "Warm, soft light during sunrise or sunset with golden tones",
    promptFragment: "illuminated by warm golden hour light with soft shadows and a magical glow",
  },
  {
    id: "lighting-natural",
    name: "Natural Light",
    description: "Soft, diffused natural daylight",
    promptFragment: "illuminated by soft natural daylight creating gentle ambient lighting",
  },
  {
    id: "lighting-overcast",
    name: "Overcast Day",
    description: "Soft, even lighting from cloudy sky",
    promptFragment: "illuminated by soft overcast light with even diffusion and no harsh shadows",
  },
  {
    id: "lighting-blue-hour",
    name: "Blue Hour",
    description: "Cool twilight tones just before sunrise or after sunset",
    promptFragment: "illuminated by cool blue hour twilight creating a magical atmospheric mood",
  },
  {
    id: "lighting-harsh-sun",
    name: "Harsh Sunlight",
    description: "Direct midday sun with strong shadows",
    promptFragment: "illuminated by direct harsh sunlight with strong shadows and high contrast",
  },
  {
    id: "lighting-dappled",
    name: "Dappled Light",
    description: "Light filtering through leaves creating patterns",
    promptFragment: "illuminated by dappled sunlight filtering through leaves creating natural patterns",
  },
  // Studio Lighting
  {
    id: "lighting-studio",
    name: "Studio Lighting",
    description: "Professional studio setup with controlled lighting",
    promptFragment: "illuminated by professional studio lighting with controlled softbox setup",
  },
  {
    id: "lighting-softbox",
    name: "Softbox Setup",
    description: "Soft, flattering light from diffused source",
    promptFragment: "illuminated by diffused softbox lighting creating flattering even illumination",
  },
  {
    id: "lighting-ring-light",
    name: "Ring Light",
    description: "Even, flattering light popular for portraits",
    promptFragment: "illuminated by ring light creating even facial illumination with catchlights",
  },
  {
    id: "lighting-rembrandt",
    name: "Rembrandt Lighting",
    description: "Classic portrait lighting with triangle under eye",
    promptFragment: "illuminated with classic Rembrandt lighting creating a triangle shadow under eye",
  },
  {
    id: "lighting-butterfly",
    name: "Butterfly Lighting",
    description: "Glamour lighting from above creating butterfly shadow",
    promptFragment: "illuminated with butterfly lighting from above for a glamour portrait effect",
  },
  {
    id: "lighting-split",
    name: "Split Lighting",
    description: "Half face lit, half in shadow for dramatic effect",
    promptFragment: "illuminated with dramatic split lighting creating half light half shadow contrast",
  },
  // Dramatic & Artistic
  {
    id: "lighting-dramatic",
    name: "Dramatic Shadows",
    description: "High contrast lighting with deep shadows",
    promptFragment: "illuminated with dramatic chiaroscuro lighting and deep expressive shadows",
  },
  {
    id: "lighting-cinematic",
    name: "Cinematic",
    description: "Film-style lighting with dramatic atmosphere",
    promptFragment: "illuminated with cinematic film-style lighting creating moody atmosphere",
  },
  {
    id: "lighting-backlit",
    name: "Backlit",
    description: "Light source behind the subject creating silhouette effect",
    promptFragment: "illuminated from behind creating rim lighting and glowing silhouette edges",
  },
  {
    id: "lighting-rim",
    name: "Rim Light",
    description: "Highlights edges of subject from behind",
    promptFragment: "illuminated with rim lighting highlighting edges and separating subject from background",
  },
  {
    id: "lighting-low-key",
    name: "Low Key",
    description: "Dark, moody lighting with minimal illumination",
    promptFragment: "illuminated with low key lighting creating dark mysterious atmosphere",
  },
  {
    id: "lighting-high-key",
    name: "High Key",
    description: "Bright, even lighting with minimal shadows",
    promptFragment: "illuminated with bright high key lighting with minimal shadows and clean look",
  },
  {
    id: "lighting-chiaroscuro",
    name: "Chiaroscuro",
    description: "Strong contrast between light and dark areas",
    promptFragment: "illuminated with Renaissance-style chiaroscuro creating dramatic light and shadow",
  },
  // Night & Artificial
  {
    id: "lighting-moonlight",
    name: "Moonlight",
    description: "Cool, ethereal moonlit atmosphere",
    promptFragment: "illuminated by soft moonlight with cool blue tones and ethereal glow",
  },
  {
    id: "lighting-neon",
    name: "Neon Glow",
    description: "Vibrant neon lights with colorful ambient glow",
    promptFragment: "illuminated by vibrant neon lights casting colorful cyberpunk glow",
  },
  {
    id: "lighting-candlelight",
    name: "Candlelight",
    description: "Warm, flickering intimate lighting",
    promptFragment: "illuminated by warm flickering candlelight creating intimate romantic atmosphere",
  },
  {
    id: "lighting-firelight",
    name: "Firelight",
    description: "Warm orange glow from fire source",
    promptFragment: "illuminated by warm orange firelight with dancing shadows",
  },
  {
    id: "lighting-streetlamp",
    name: "Street Lamp",
    description: "Urban night lighting from street lamps",
    promptFragment: "illuminated by street lamp light creating pools of urban night ambiance",
  },
  {
    id: "lighting-neon-sign",
    name: "Neon Sign",
    description: "Colorful glow from neon signage",
    promptFragment: "illuminated by colorful neon sign glow casting vibrant urban night atmosphere",
  },
  {
    id: "lighting-led-strip",
    name: "LED Strip",
    description: "Modern colored LED accent lighting",
    promptFragment: "illuminated by modern LED strip lighting with gradient color accents",
  },
  // Special Effects
  {
    id: "lighting-foggy",
    name: "Foggy Atmosphere",
    description: "Diffused light through fog or mist",
    promptFragment: "illuminated through atmospheric fog creating soft ethereal diffused light",
  },
  {
    id: "lighting-volumetric",
    name: "Volumetric Light",
    description: "Visible light rays through atmosphere",
    promptFragment: "illuminated with volumetric god rays and visible light beams through atmosphere",
  },
  {
    id: "lighting-rainbow",
    name: "Rainbow Light",
    description: "Prismatic colorful light spectrum",
    promptFragment: "illuminated by prismatic rainbow light creating iridescent color spectrum",
  },
  {
    id: "lighting-underwater",
    name: "Underwater Light",
    description: "Filtered blue-green aquatic lighting",
    promptFragment: "illuminated by filtered underwater light with caustic patterns and blue-green tones",
  },
];

// ==========================================
// Camera/Composition Templates
// ==========================================
export const cameraTemplates: Template[] = [
  // Standard Shots
  {
    id: "camera-closeup",
    name: "Close-up",
    description: "Tight framing focusing on details",
    promptFragment: "shot as a close-up with tight framing focusing on details",
  },
  {
    id: "camera-extreme-closeup",
    name: "Extreme Close-up",
    description: "Very tight framing on specific feature",
    promptFragment: "shot as an extreme close-up with dramatic proximity to fine details",
  },
  {
    id: "camera-medium-shot",
    name: "Medium Shot",
    description: "Waist-up framing showing body language",
    promptFragment: "shot as a medium shot with waist-up framing showing body language",
  },
  {
    id: "camera-medium-closeup",
    name: "Medium Close-up",
    description: "Head and shoulders framing",
    promptFragment: "shot as a medium close-up with head and shoulders framing",
  },
  {
    id: "camera-wide",
    name: "Wide Shot",
    description: "Full scene view showing environment and context",
    promptFragment: "shot as a wide establishing view showing full environmental context",
  },
  {
    id: "camera-extreme-wide",
    name: "Extreme Wide Shot",
    description: "Vast establishing shot showing full environment",
    promptFragment: "shot as an extreme wide establishing view with epic scale",
  },
  {
    id: "camera-full-body",
    name: "Full Body Shot",
    description: "Complete figure from head to toe",
    promptFragment: "shot as a full body view with complete figure visible head to toe",
  },
  // Angles
  {
    id: "camera-low-angle",
    name: "Low Angle",
    description: "Shot from below looking up, making subject appear powerful",
    promptFragment: "shot from a low angle looking up creating a heroic powerful perspective",
  },
  {
    id: "camera-high-angle",
    name: "High Angle",
    description: "Shot from above looking down",
    promptFragment: "shot from a high angle looking down with elevated perspective",
  },
  {
    id: "camera-birds-eye",
    name: "Bird's Eye",
    description: "Overhead view looking directly down",
    promptFragment: "shot from bird's eye view with overhead top-down perspective",
  },
  {
    id: "camera-worms-eye",
    name: "Worm's Eye View",
    description: "Extreme low angle from ground level",
    promptFragment: "shot from worm's eye view at ground level with dramatic upward perspective",
  },
  {
    id: "camera-dutch",
    name: "Dutch Angle",
    description: "Tilted camera creating dynamic, unsettling feel",
    promptFragment: "shot with dutch angle tilted frame creating dynamic tension",
  },
  {
    id: "camera-eye-level",
    name: "Eye Level",
    description: "Neutral angle at subject's eye level",
    promptFragment: "shot at natural eye level with neutral balanced perspective",
  },
  // Portrait Specific
  {
    id: "camera-portrait",
    name: "Portrait",
    description: "Classic portrait framing with shallow depth of field",
    promptFragment: "shot as a classic portrait with shallow depth of field and bokeh background",
  },
  {
    id: "camera-headshot",
    name: "Headshot",
    description: "Professional head and shoulders portrait",
    promptFragment: "shot as a professional headshot with clean head and shoulders composition",
  },
  {
    id: "camera-three-quarter",
    name: "Three-Quarter View",
    description: "Face turned slightly away from camera",
    promptFragment: "shot in classic three-quarter view with face slightly turned",
  },
  {
    id: "camera-profile",
    name: "Profile Shot",
    description: "Side view of subject",
    promptFragment: "shot in profile from the side showing silhouette perspective",
  },
  // Creative & Technical
  {
    id: "camera-macro",
    name: "Macro",
    description: "Extreme close-up revealing tiny details",
    promptFragment: "shot with macro lens revealing fine intricate details",
  },
  {
    id: "camera-over-shoulder",
    name: "Over-the-shoulder",
    description: "Shot from behind subject's shoulder",
    promptFragment: "shot over-the-shoulder creating conversational POV framing",
  },
  {
    id: "camera-pov",
    name: "Point of View",
    description: "First-person perspective as if through subject's eyes",
    promptFragment: "shot from first-person POV as if through the subject's eyes",
  },
  {
    id: "camera-tilt-shift",
    name: "Tilt-Shift",
    description: "Miniature effect with selective focus",
    promptFragment: "shot with tilt-shift effect creating miniature toy-like selective focus",
  },
  {
    id: "camera-fisheye",
    name: "Fisheye",
    description: "Ultra-wide angle with curved distortion",
    promptFragment: "shot with fisheye lens creating ultra-wide curved distortion",
  },
  {
    id: "camera-telephoto",
    name: "Telephoto Compression",
    description: "Compressed perspective from long lens",
    promptFragment: "shot with telephoto lens compressing perspective and background",
  },
  // Composition Rules
  {
    id: "camera-rule-thirds",
    name: "Rule of Thirds",
    description: "Subject placed at intersection points",
    promptFragment: "composed using rule of thirds with subject at balanced intersection",
  },
  {
    id: "camera-centered",
    name: "Centered Composition",
    description: "Subject placed directly in center",
    promptFragment: "composed with centered symmetrical framing and subject in middle",
  },
  {
    id: "camera-symmetrical",
    name: "Symmetrical",
    description: "Perfect symmetry in composition",
    promptFragment: "composed with perfect symmetrical mirror balance",
  },
  {
    id: "camera-leading-lines",
    name: "Leading Lines",
    description: "Lines guiding eye to subject",
    promptFragment: "composed with leading lines guiding the eye to the subject",
  },
  {
    id: "camera-framing",
    name: "Natural Frame",
    description: "Subject framed by environmental elements",
    promptFragment: "composed with natural framing using environmental elements as frame",
  },
  {
    id: "camera-negative-space",
    name: "Negative Space",
    description: "Lots of empty space around subject",
    promptFragment: "composed with abundant negative space creating minimalist isolation",
  },
  // Depth & Focus
  {
    id: "camera-shallow-dof",
    name: "Shallow Depth of Field",
    description: "Blurred background with sharp subject",
    promptFragment: "shot with shallow depth of field creating bokeh and sharp subject focus",
  },
  {
    id: "camera-deep-focus",
    name: "Deep Focus",
    description: "Everything in sharp focus",
    promptFragment: "shot with deep focus keeping everything sharp with full scene clarity",
  },
  {
    id: "camera-split-diopter",
    name: "Split Diopter",
    description: "Both foreground and background in focus",
    promptFragment: "shot with split diopter keeping both foreground and background sharp",
  },
];

// ==========================================
// Style Templates
// ==========================================
export const styleTemplates: Template[] = [
  // Realistic
  {
    id: "style-photorealistic",
    name: "Photorealistic",
    description: "Hyper-realistic, photograph-like quality",
    promptFragment: "rendered in photorealistic style with ultra-realistic photograph quality and fine details",
  },
  {
    id: "style-hyperrealistic",
    name: "Hyperrealistic",
    description: "Beyond photo-real with enhanced details",
    promptFragment: "rendered in hyperrealistic style with extreme detail and lifelike clarity",
  },
  {
    id: "style-raw-photo",
    name: "Raw Photography",
    description: "Unprocessed, natural photo look",
    promptFragment: "rendered as raw photography with unprocessed natural colors and authentic look",
  },
  {
    id: "style-film-photography",
    name: "Film Photography",
    description: "Analog film aesthetic with grain",
    promptFragment: "rendered in analog film photography style with natural grain and nostalgic tones",
  },
  // 3D & CGI
  {
    id: "style-3d-animation",
    name: "3D Animation",
    description: "Modern 3D animated movie style like Pixar",
    promptFragment: "rendered in Pixar-like 3D animation style with smooth CGI surfaces",
  },
  {
    id: "style-3d-render",
    name: "3D Render",
    description: "Clean CGI rendered look",
    promptFragment: "rendered as professional 3D CGI with clean surfaces and realistic materials",
  },
  {
    id: "style-unreal-engine",
    name: "Unreal Engine",
    description: "Game engine cinematic quality",
    promptFragment: "rendered in Unreal Engine style with cinematic RTX lighting and game quality",
  },
  {
    id: "style-octane-render",
    name: "Octane Render",
    description: "High-end GPU rendering aesthetic",
    promptFragment: "rendered with Octane quality featuring subsurface scattering and realistic materials",
  },
  {
    id: "style-claymation",
    name: "Claymation",
    description: "Stop-motion clay animation style",
    promptFragment: "rendered in claymation stop-motion style with handcrafted clay textures",
  },
  // Illustration & Digital Art
  {
    id: "style-digital-art",
    name: "Digital Art",
    description: "Modern digital illustration style",
    promptFragment: "rendered as digital art illustration with clean lines and vibrant colors",
  },
  {
    id: "style-concept-art",
    name: "Concept Art",
    description: "Professional concept art for games/movies",
    promptFragment: "rendered as professional concept art with detailed environmental illustration",
  },
  {
    id: "style-matte-painting",
    name: "Matte Painting",
    description: "Cinematic background painting style",
    promptFragment: "rendered as cinematic matte painting with epic scale and detailed landscapes",
  },
  {
    id: "style-vector",
    name: "Vector Art",
    description: "Clean, scalable vector illustration",
    promptFragment: "rendered in vector art style with clean lines and flat scalable colors",
  },
  {
    id: "style-flat-design",
    name: "Flat Design",
    description: "Minimalist flat illustration style",
    promptFragment: "rendered in flat design style with minimalist shapes and no gradients",
  },
  {
    id: "style-isometric",
    name: "Isometric",
    description: "Isometric 3D illustration style",
    promptFragment: "rendered in isometric 2.5D perspective with clean geometric shapes",
  },
  // Traditional Art
  {
    id: "style-oil-painting",
    name: "Oil Painting",
    description: "Classical oil painting with rich textures",
    promptFragment: "rendered as classical oil painting with rich textures and visible brush strokes",
  },
  {
    id: "style-watercolor",
    name: "Watercolor",
    description: "Soft, flowing watercolor painting aesthetic",
    promptFragment: "rendered in watercolor style with soft washes and flowing artistic colors",
  },
  {
    id: "style-acrylic",
    name: "Acrylic Painting",
    description: "Bold acrylic paint texture",
    promptFragment: "rendered as acrylic painting with bold strokes and vibrant textured pigments",
  },
  {
    id: "style-gouache",
    name: "Gouache",
    description: "Matte opaque watercolor style",
    promptFragment: "rendered in gouache style with matte finish and opaque vintage illustration colors",
  },
  {
    id: "style-pencil-sketch",
    name: "Pencil Sketch",
    description: "Hand-drawn pencil illustration",
    promptFragment: "rendered as hand-drawn pencil sketch with graphite shading",
  },
  {
    id: "style-charcoal",
    name: "Charcoal Drawing",
    description: "Expressive charcoal sketch style",
    promptFragment: "rendered as expressive charcoal drawing with dramatic contrast and fine art quality",
  },
  {
    id: "style-ink-wash",
    name: "Ink Wash",
    description: "Traditional ink wash painting style",
    promptFragment: "rendered in traditional ink wash sumi-e style with elegant monochromatic brush strokes",
  },
  {
    id: "style-pastel",
    name: "Pastel Art",
    description: "Soft pastel chalk artwork",
    promptFragment: "rendered in soft pastel art style with chalky textures and dreamy colors",
  },
  // Animation Styles
  {
    id: "style-anime",
    name: "Anime",
    description: "Japanese animation style with expressive features",
    promptFragment: "rendered in anime style with expressive features and cel shading",
  },
  {
    id: "style-manga",
    name: "Manga",
    description: "Japanese comic black and white style",
    promptFragment: "rendered in manga style with black and white screentones and dynamic lines",
  },
  {
    id: "style-studio-ghibli",
    name: "Studio Ghibli",
    description: "Whimsical Ghibli animation style",
    promptFragment: "rendered in Studio Ghibli style with whimsical hand-painted backgrounds and warm atmosphere",
  },
  {
    id: "style-cartoon",
    name: "Cartoon",
    description: "Western cartoon animation style",
    promptFragment: "rendered in cartoon animation style with exaggerated features and bold outlines",
  },
  {
    id: "style-disney",
    name: "Disney Classic",
    description: "Classic Disney animation aesthetic",
    promptFragment: "rendered in classic Disney hand-drawn animation style with expressive magical characters",
  },
  {
    id: "style-comic-book",
    name: "Comic Book",
    description: "Western comic book illustration",
    promptFragment: "rendered in comic book style with bold lines and halftone dots",
  },
  {
    id: "style-graphic-novel",
    name: "Graphic Novel",
    description: "Mature graphic novel illustration",
    promptFragment: "rendered in graphic novel style with detailed dramatic shading and mature illustration",
  },
  // Vintage & Retro
  {
    id: "style-vintage",
    name: "Vintage",
    description: "Retro, nostalgic aesthetic with aged tones",
    promptFragment: "rendered in vintage retro style with faded nostalgic colors",
  },
  {
    id: "style-film-noir",
    name: "Film Noir",
    description: "Classic black and white with high contrast",
    promptFragment: "rendered in film noir style with high contrast black and white and vintage cinema atmosphere",
  },
  {
    id: "style-retro-80s",
    name: "80s Retro",
    description: "1980s nostalgic aesthetic",
    promptFragment: "rendered in 80s retro synthwave style with neon colors and vintage 1980s aesthetic",
  },
  {
    id: "style-retro-70s",
    name: "70s Retro",
    description: "1970s groovy aesthetic",
    promptFragment: "rendered in 70s retro style with groovy disco era colors and warm earth tones",
  },
  {
    id: "style-art-deco",
    name: "Art Deco",
    description: "1920s Art Deco geometric style",
    promptFragment: "rendered in Art Deco style with geometric patterns and elegant 1920s gold accents",
  },
  {
    id: "style-art-nouveau",
    name: "Art Nouveau",
    description: "Organic flowing Art Nouveau style",
    promptFragment: "rendered in Art Nouveau style with organic flowing curves and nature-inspired ornaments",
  },
  {
    id: "style-victorian",
    name: "Victorian",
    description: "Ornate Victorian era aesthetic",
    promptFragment: "rendered in Victorian style with ornate details and 19th century sepia tones",
  },
  // Modern Artistic Movements
  {
    id: "style-pop-art",
    name: "Pop Art",
    description: "Bold colors and graphic style inspired by Warhol",
    promptFragment: "rendered in pop art style with bold graphic colors inspired by Warhol",
  },
  {
    id: "style-surrealism",
    name: "Surrealism",
    description: "Dreamlike surrealist imagery",
    promptFragment: "rendered in surrealist style with dreamlike impossible imagery inspired by Dali",
  },
  {
    id: "style-impressionism",
    name: "Impressionism",
    description: "Soft brushwork capturing light",
    promptFragment: "rendered in impressionist style with visible brushstrokes capturing light like Monet",
  },
  {
    id: "style-expressionism",
    name: "Expressionism",
    description: "Emotional, distorted artistic expression",
    promptFragment: "rendered in expressionist style with emotional intensity and distorted bold forms",
  },
  {
    id: "style-cubism",
    name: "Cubism",
    description: "Geometric fragmented Picasso style",
    promptFragment: "rendered in cubist style with geometric fragments and multiple perspectives like Picasso",
  },
  {
    id: "style-minimalist",
    name: "Minimalist",
    description: "Clean, simple aesthetic with limited elements",
    promptFragment: "rendered in minimalist style with clean simple composition and negative space",
  },
  {
    id: "style-abstract",
    name: "Abstract",
    description: "Non-representational abstract art",
    promptFragment: "rendered in abstract art style with non-representational shapes and colors",
  },
  // Genre Specific
  {
    id: "style-cyberpunk",
    name: "Cyberpunk",
    description: "Futuristic, neon-lit dystopian aesthetic",
    promptFragment: "rendered in cyberpunk style with neon lights and futuristic dystopian atmosphere",
  },
  {
    id: "style-steampunk",
    name: "Steampunk",
    description: "Victorian-era mechanical aesthetic",
    promptFragment: "rendered in steampunk style with Victorian mechanics and brass gear aesthetic",
  },
  {
    id: "style-fantasy",
    name: "Fantasy Art",
    description: "Epic fantasy illustration style",
    promptFragment: "rendered in epic fantasy art style with magical mythical illustration",
  },
  {
    id: "style-sci-fi",
    name: "Sci-Fi",
    description: "Science fiction futuristic aesthetic",
    promptFragment: "rendered in sci-fi style with futuristic technology and space age aesthetic",
  },
  {
    id: "style-horror",
    name: "Horror",
    description: "Dark, unsettling horror aesthetic",
    promptFragment: "rendered in horror style with dark unsettling gothic atmosphere",
  },
  {
    id: "style-gothic",
    name: "Gothic",
    description: "Dark romantic gothic aesthetic",
    promptFragment: "rendered in gothic style with dark romantic ornate architecture and mystery",
  },
  {
    id: "style-vaporwave",
    name: "Vaporwave",
    description: "Nostalgic internet aesthetic",
    promptFragment: "rendered in vaporwave style with pastel glitch art and 90s retro digital aesthetic",
  },
  {
    id: "style-dark-fantasy",
    name: "Dark Fantasy",
    description: "Grim dark fantasy world",
    promptFragment: "rendered in dark fantasy style with grim medieval atmosphere and ominous mood",
  },
  // Special Effects
  {
    id: "style-double-exposure",
    name: "Double Exposure",
    description: "Multiple images blended together",
    promptFragment: "rendered with double exposure effect blending multiple images artistically",
  },
  {
    id: "style-glitch-art",
    name: "Glitch Art",
    description: "Digital glitch aesthetic",
    promptFragment: "rendered in glitch art style with digital corruption and RGB split distortion",
  },
  {
    id: "style-holographic",
    name: "Holographic",
    description: "Iridescent holographic effect",
    promptFragment: "rendered with holographic iridescent effect and rainbow shimmer",
  },
  {
    id: "style-neon-noir",
    name: "Neon Noir",
    description: "Dark noir with neon accents",
    promptFragment: "rendered in neon noir style with dark atmosphere and vibrant neon accents",
  },
  {
    id: "style-low-poly",
    name: "Low Poly",
    description: "Geometric low polygon 3D style",
    promptFragment: "rendered in low poly style with geometric faceted polygon surfaces",
  },
  {
    id: "style-pixel-art",
    name: "Pixel Art",
    description: "Retro pixel art game style",
    promptFragment: "rendered in retro pixel art style with 8-bit blocky aesthetic",
  },
];

// ==========================================
// Location Templates
// ==========================================
export const locationTemplates: Template[] = [
  // Urban
  {
    id: "location-urban",
    name: "Urban City",
    description: "Modern cityscape with buildings and streets",
    promptFragment: "set in an urban city environment with modern architecture and metropolitan streets",
  },
  {
    id: "location-downtown",
    name: "Downtown District",
    description: "Busy downtown area with skyscrapers",
    promptFragment: "set in a busy downtown district with towering skyscrapers and commercial streets",
  },
  {
    id: "location-alley",
    name: "Back Alley",
    description: "Narrow urban alleyway",
    promptFragment: "set in a narrow back alley with brick walls and atmospheric urban character",
  },
  {
    id: "location-rooftop",
    name: "Rooftop",
    description: "Building rooftop with city view",
    promptFragment: "set on a rooftop with panoramic city skyline view and elevated perspective",
  },
  {
    id: "location-subway",
    name: "Subway Station",
    description: "Underground metro station",
    promptFragment: "set in an underground subway station with tiled walls and urban transit atmosphere",
  },
  {
    id: "location-parking-garage",
    name: "Parking Garage",
    description: "Multi-level parking structure",
    promptFragment: "set in a concrete parking garage with fluorescent industrial lighting",
  },
  {
    id: "location-bridge",
    name: "City Bridge",
    description: "Urban bridge crossing",
    promptFragment: "set on a city bridge with architectural structure spanning over water",
  },
  // Nature - Forests & Woods
  {
    id: "location-forest",
    name: "Forest",
    description: "Dense woodland with trees and natural elements",
    promptFragment: "set in a dense forest with natural woodland greenery and trees",
  },
  {
    id: "location-enchanted-forest",
    name: "Enchanted Forest",
    description: "Magical mystical woodland",
    promptFragment: "set in an enchanted magical forest with ethereal mystical atmosphere",
  },
  {
    id: "location-bamboo-forest",
    name: "Bamboo Forest",
    description: "Tall bamboo grove",
    promptFragment: "set in a bamboo forest with tall stalks and green filtered light",
  },
  {
    id: "location-autumn-forest",
    name: "Autumn Forest",
    description: "Fall foliage woodland",
    promptFragment: "set in an autumn forest with vibrant fall colors and orange red leaves",
  },
  {
    id: "location-pine-forest",
    name: "Pine Forest",
    description: "Coniferous pine woodland",
    promptFragment: "set in a pine forest with evergreen trees and crisp woodland atmosphere",
  },
  // Nature - Water
  {
    id: "location-beach",
    name: "Beach",
    description: "Coastal scene with sand and ocean",
    promptFragment: "set on a beach with sandy shore and rolling ocean waves",
  },
  {
    id: "location-tropical-beach",
    name: "Tropical Beach",
    description: "Paradise tropical shoreline",
    promptFragment: "set on a tropical paradise beach with palm trees and turquoise water",
  },
  {
    id: "location-rocky-coast",
    name: "Rocky Coastline",
    description: "Dramatic rocky shore",
    promptFragment: "set on a dramatic rocky coastline with cliffs and crashing waves",
  },
  {
    id: "location-lake",
    name: "Lake",
    description: "Serene lakeside setting",
    promptFragment: "set beside a serene lake with calm reflective waters and peaceful atmosphere",
  },
  {
    id: "location-waterfall",
    name: "Waterfall",
    description: "Cascading waterfall scene",
    promptFragment: "set near a cascading waterfall with mist and natural wonder",
  },
  {
    id: "location-river",
    name: "River",
    description: "Flowing river setting",
    promptFragment: "set along a flowing river with natural banks and stones",
  },
  {
    id: "location-underwater",
    name: "Underwater",
    description: "Beneath the water surface",
    promptFragment: "set underwater in an aquatic environment with marine atmosphere",
  },
  // Nature - Mountains & Terrain
  {
    id: "location-mountains",
    name: "Mountains",
    description: "Majestic mountain landscape",
    promptFragment: "set in a majestic mountain landscape with alpine peaks and rocky terrain",
  },
  {
    id: "location-snowy-peaks",
    name: "Snowy Peaks",
    description: "Snow-covered mountain tops",
    promptFragment: "set among snowy mountain peaks with pristine alpine winter landscape",
  },
  {
    id: "location-desert",
    name: "Desert",
    description: "Sandy desert landscape",
    promptFragment: "set in an arid desert landscape with sand dunes and dry terrain",
  },
  {
    id: "location-canyon",
    name: "Canyon",
    description: "Deep canyon with rock walls",
    promptFragment: "set in a deep canyon with dramatic layered rock walls and depth",
  },
  {
    id: "location-meadow",
    name: "Meadow",
    description: "Open grassy field",
    promptFragment: "set in an open meadow with wildflowers and gentle swaying grass",
  },
  {
    id: "location-hilltop",
    name: "Hilltop",
    description: "Elevated hillside view",
    promptFragment: "set on a hilltop with elevated panoramic view of rolling hills",
  },
  {
    id: "location-cave",
    name: "Cave",
    description: "Underground cavern",
    promptFragment: "set inside a cave with underground rock formations and dramatic interior",
  },
  {
    id: "location-glacier",
    name: "Glacier",
    description: "Icy glacial landscape",
    promptFragment: "set on a glacier with blue ice formations and frozen landscape",
  },
  {
    id: "location-volcano",
    name: "Volcano",
    description: "Volcanic landscape",
    promptFragment: "set in a volcanic landscape with dramatic lava rock terrain",
  },
  // Indoor - Residential
  {
    id: "location-living-room",
    name: "Living Room",
    description: "Home living space",
    promptFragment: "set in a cozy living room with comfortable home furnishings",
  },
  {
    id: "location-bedroom",
    name: "Bedroom",
    description: "Personal bedroom space",
    promptFragment: "set in an intimate bedroom with personal furnishings and soft atmosphere",
  },
  {
    id: "location-kitchen",
    name: "Kitchen",
    description: "Home kitchen area",
    promptFragment: "set in a home kitchen with cooking appliances and counters",
  },
  {
    id: "location-bathroom",
    name: "Bathroom",
    description: "Bathroom interior",
    promptFragment: "set in a clean bathroom with tiled interior and modern fixtures",
  },
  {
    id: "location-home-office",
    name: "Home Office",
    description: "Residential workspace",
    promptFragment: "set in a home office with desk setup and personal workspace",
  },
  // Indoor - Commercial
  {
    id: "location-cafe",
    name: "Cafe",
    description: "Cozy cafe or coffee shop interior",
    promptFragment: "set in a cozy cafe with warm coffee shop atmosphere and ambiance",
  },
  {
    id: "location-restaurant",
    name: "Restaurant",
    description: "Dining establishment interior",
    promptFragment: "set in an elegant restaurant with fine dining atmosphere",
  },
  {
    id: "location-bar",
    name: "Bar",
    description: "Bar or pub interior",
    promptFragment: "set in a dim bar interior with bottles and atmospheric lighting",
  },
  {
    id: "location-nightclub",
    name: "Nightclub",
    description: "Dance club interior",
    promptFragment: "set in a vibrant nightclub with colorful dance floor lights and party atmosphere",
  },
  {
    id: "location-hotel-lobby",
    name: "Hotel Lobby",
    description: "Grand hotel entrance",
    promptFragment: "set in a grand hotel lobby with elegant decor and hospitality atmosphere",
  },
  {
    id: "location-office",
    name: "Modern Office",
    description: "Corporate office space",
    promptFragment: "set in a modern corporate office with professional workspace environment",
  },
  {
    id: "location-library",
    name: "Library",
    description: "Room filled with books",
    promptFragment: "set in a library surrounded by bookshelves with scholarly atmosphere",
  },
  {
    id: "location-gym",
    name: "Gym",
    description: "Fitness center interior",
    promptFragment: "set in a gym with fitness equipment and athletic workout environment",
  },
  // Indoor - Special
  {
    id: "location-studio",
    name: "Studio Backdrop",
    description: "Clean studio background for focused portraits",
    promptFragment: "set against a clean professional studio backdrop with neutral background",
  },
  {
    id: "location-photo-studio",
    name: "Photo Studio",
    description: "Professional photography studio",
    promptFragment: "set in a professional photo studio with lighting equipment and creative space",
  },
  {
    id: "location-art-gallery",
    name: "Art Gallery",
    description: "Museum or gallery space",
    promptFragment: "set in an art gallery with white walls and exhibition space atmosphere",
  },
  {
    id: "location-theater",
    name: "Theater",
    description: "Performance venue interior",
    promptFragment: "set in a theater with stage and velvet curtains creating performance atmosphere",
  },
  {
    id: "location-warehouse",
    name: "Warehouse",
    description: "Industrial warehouse space",
    promptFragment: "set in an industrial warehouse with high ceilings and raw brick metal character",
  },
  {
    id: "location-abandoned-building",
    name: "Abandoned Building",
    description: "Derelict structure interior",
    promptFragment: "set in an abandoned building with atmospheric decay and derelict character",
  },
  // Fantasy & Sci-Fi
  {
    id: "location-futuristic",
    name: "Futuristic City",
    description: "Sci-fi environment with advanced technology",
    promptFragment: "set in a futuristic sci-fi environment with advanced technology and sleek design",
  },
  {
    id: "location-space-station",
    name: "Space Station",
    description: "Orbital space habitat",
    promptFragment: "set inside a space station with orbital corridors and futuristic atmosphere",
  },
  {
    id: "location-alien-planet",
    name: "Alien Planet",
    description: "Extraterrestrial world",
    promptFragment: "set on an alien planet with otherworldly extraterrestrial landscape",
  },
  {
    id: "location-medieval-castle",
    name: "Medieval Castle",
    description: "Fantasy castle interior",
    promptFragment: "set in a medieval castle with stone walls and torch-lit fantasy architecture",
  },
  {
    id: "location-throne-room",
    name: "Throne Room",
    description: "Royal throne chamber",
    promptFragment: "set in a royal throne room with grand regal architecture",
  },
  {
    id: "location-magic-realm",
    name: "Magic Realm",
    description: "Mystical magical world",
    promptFragment: "set in a magical realm with enchanted mystical fantasy atmosphere",
  },
  {
    id: "location-cyberpunk-city",
    name: "Cyberpunk City",
    description: "Neon-lit dystopian metropolis",
    promptFragment: "set in a cyberpunk city with neon lights and dystopian high-tech atmosphere",
  },
  // Abstract & Creative
  {
    id: "location-abstract",
    name: "Abstract",
    description: "Non-representational, artistic background",
    promptFragment: "set against an abstract artistic background with creative non-representational elements",
  },
  {
    id: "location-void",
    name: "Void Space",
    description: "Empty infinite space",
    promptFragment: "set in an infinite void space with minimalist empty darkness",
  },
  {
    id: "location-gradient",
    name: "Gradient Background",
    description: "Smooth color gradient backdrop",
    promptFragment: "set against a smooth gradient background with professional color transition",
  },
  {
    id: "location-bokeh",
    name: "Bokeh Background",
    description: "Blurred light circles",
    promptFragment: "set against a dreamy bokeh background with blurred light circles",
  },
  {
    id: "location-dreamscape",
    name: "Dreamscape",
    description: "Surreal dream environment",
    promptFragment: "set in a surreal dreamscape with ethereal dream world atmosphere",
  },
];

// ==========================================
// Pose Templates
// ==========================================
export const poseTemplates: Template[] = [
  // Standing
  {
    id: "pose-standing",
    name: "Standing",
    description: "Upright standing position",
    promptFragment: "in a confident upright standing pose",
  },
  {
    id: "pose-standing-relaxed",
    name: "Relaxed Standing",
    description: "Casual relaxed standing",
    promptFragment: "in a relaxed casual standing pose with weight shifted to one leg",
  },
  {
    id: "pose-standing-confident",
    name: "Power Pose",
    description: "Confident assertive stance",
    promptFragment: "in a confident power pose with hands on hips and assertive stance",
  },
  {
    id: "pose-standing-crossed-arms",
    name: "Arms Crossed",
    description: "Standing with folded arms",
    promptFragment: "in a confident pose with arms crossed",
  },
  {
    id: "pose-hands-in-pockets",
    name: "Hands in Pockets",
    description: "Casual hands in pockets",
    promptFragment: "in a casual relaxed pose with hands in pockets",
  },
  {
    id: "pose-contrapposto",
    name: "Contrapposto",
    description: "Classic weight shift pose",
    promptFragment: "in an elegant classical contrapposto pose with weight shifted",
  },
  // Sitting
  {
    id: "pose-sitting",
    name: "Sitting",
    description: "Seated position on chair or surface",
    promptFragment: "in a relaxed seated pose",
  },
  {
    id: "pose-sitting-crossed-legs",
    name: "Cross-Legged",
    description: "Sitting with legs crossed",
    promptFragment: "in an elegant seated pose with legs crossed",
  },
  {
    id: "pose-sitting-floor",
    name: "Floor Sitting",
    description: "Sitting on the ground",
    promptFragment: "in a relaxed pose sitting on the floor",
  },
  {
    id: "pose-sitting-edge",
    name: "Perched",
    description: "Sitting on edge of surface",
    promptFragment: "in an alert perched pose sitting on the edge",
  },
  {
    id: "pose-lounging",
    name: "Lounging",
    description: "Relaxed lounging position",
    promptFragment: "in a comfortable lounging pose with relaxed recline",
  },
  {
    id: "pose-meditation",
    name: "Meditation",
    description: "Cross-legged meditation pose",
    promptFragment: "in a peaceful meditation pose with zen lotus position",
  },
  // Leaning
  {
    id: "pose-leaning",
    name: "Leaning",
    description: "Leaning against wall or surface",
    promptFragment: "in a casual leaning pose resting against a surface",
  },
  {
    id: "pose-leaning-wall",
    name: "Wall Lean",
    description: "Leaning against a wall",
    promptFragment: "in a relaxed pose leaning casually against a wall",
  },
  {
    id: "pose-leaning-forward",
    name: "Forward Lean",
    description: "Leaning forward with interest",
    promptFragment: "in an engaged forward leaning pose showing attentive interest",
  },
  {
    id: "pose-leaning-back",
    name: "Backward Lean",
    description: "Leaning back casually",
    promptFragment: "in a casual backward leaning pose with relaxed recline",
  },
  // Lying
  {
    id: "pose-lying",
    name: "Lying Down",
    description: "Horizontal resting position",
    promptFragment: "in a reclined lying down pose",
  },
  {
    id: "pose-lying-side",
    name: "Side Lying",
    description: "Lying on one side",
    promptFragment: "in a comfortable pose lying on one side",
  },
  {
    id: "pose-lying-back",
    name: "Lying on Back",
    description: "Supine position facing up",
    promptFragment: "in a supine pose lying on back facing up",
  },
  {
    id: "pose-lying-stomach",
    name: "Lying on Stomach",
    description: "Prone position facing down",
    promptFragment: "in a prone pose lying on stomach",
  },
  // Dynamic Movement
  {
    id: "pose-walking",
    name: "Walking",
    description: "Mid-stride walking motion",
    promptFragment: "in a natural walking pose captured mid-stride",
  },
  {
    id: "pose-running",
    name: "Running",
    description: "Dynamic running motion",
    promptFragment: "in a dynamic running pose with athletic movement",
  },
  {
    id: "pose-jumping",
    name: "Jumping",
    description: "Mid-air jumping action",
    promptFragment: "in an energetic jumping pose captured mid-air",
  },
  {
    id: "pose-crouching",
    name: "Crouching",
    description: "Low crouching or squatting position",
    promptFragment: "in a low crouching pose with squatting stance",
  },
  {
    id: "pose-kneeling",
    name: "Kneeling",
    description: "On one or both knees",
    promptFragment: "in a kneeling pose on one or both knees",
  },
  {
    id: "pose-turning",
    name: "Mid-Turn",
    description: "Caught mid-turn movement",
    promptFragment: "in a dynamic mid-turn pose with twisting motion",
  },
  {
    id: "pose-stepping",
    name: "Stepping Forward",
    description: "Taking a step forward",
    promptFragment: "in a purposeful pose stepping forward",
  },
  // Action Poses
  {
    id: "pose-reaching",
    name: "Reaching",
    description: "Reaching for something",
    promptFragment: "in a reaching pose with extended arm",
  },
  {
    id: "pose-pointing",
    name: "Pointing",
    description: "Pointing gesture",
    promptFragment: "in a directional pointing pose with indicating gesture",
  },
  {
    id: "pose-waving",
    name: "Waving",
    description: "Hand wave gesture",
    promptFragment: "in a friendly waving pose with raised hand greeting",
  },
  {
    id: "pose-stretching",
    name: "Stretching",
    description: "Full body stretch",
    promptFragment: "in a flexible stretching pose with extended limbs",
  },
  {
    id: "pose-dancing",
    name: "Dance Pose",
    description: "Elegant dance position",
    promptFragment: "in an elegant graceful dance pose",
  },
  {
    id: "pose-action-hero",
    name: "Action Hero",
    description: "Dynamic heroic stance",
    promptFragment: "in a powerful dynamic action hero pose",
  },
  {
    id: "pose-defensive",
    name: "Defensive Stance",
    description: "Guarded protective position",
    promptFragment: "in a guarded defensive pose with protective stance",
  },
  // Professional/Casual
  {
    id: "pose-arms-behind-back",
    name: "Arms Behind Back",
    description: "Hands clasped behind",
    promptFragment: "in a formal pose with arms behind back and hands clasped",
  },
  {
    id: "pose-chin-rest",
    name: "Chin Rest",
    description: "Hand resting under chin",
    promptFragment: "in a thoughtful pose with hand resting under chin",
  },
  {
    id: "pose-head-tilt",
    name: "Head Tilt",
    description: "Slight head tilt",
    promptFragment: "in a curious pose with slight head tilt",
  },
  {
    id: "pose-looking-away",
    name: "Looking Away",
    description: "Gaze directed off-camera",
    promptFragment: "in a contemplative pose looking away from camera",
  },
  {
    id: "pose-over-shoulder",
    name: "Over Shoulder Look",
    description: "Looking back over shoulder",
    promptFragment: "in a turned pose looking back over shoulder",
  },
];

// ==========================================
// Action Templates
// ==========================================
export const actionTemplates: Template[] = [
  // Emotions/Expressions as Actions
  {
    id: "action-smiling",
    name: "Smiling",
    description: "Happy, smiling expression",
    promptFragment: "smiling warmly with a happy genuine expression",
  },
  {
    id: "action-laughing",
    name: "Laughing",
    description: "Genuine laughter expression",
    promptFragment: "laughing with genuine joyful expression",
  },
  {
    id: "action-thinking",
    name: "Thinking",
    description: "Contemplative, thoughtful expression",
    promptFragment: "thinking deeply with a contemplative pensive expression",
  },
  {
    id: "action-talking",
    name: "Talking",
    description: "Engaged in conversation",
    promptFragment: "talking mid-conversation with expressive gestures",
  },
  {
    id: "action-whispering",
    name: "Whispering",
    description: "Speaking softly, secretive",
    promptFragment: "whispering softly with a secretive intimate gesture",
  },
  {
    id: "action-shouting",
    name: "Shouting",
    description: "Calling out loudly",
    promptFragment: "shouting energetically with raised voice and intensity",
  },
  // Work & Productivity
  {
    id: "action-working",
    name: "Working",
    description: "Engaged in work or task",
    promptFragment: "working focused on a task with productive concentration",
  },
  {
    id: "action-typing",
    name: "Typing",
    description: "Typing on keyboard or device",
    promptFragment: "typing on keyboard focused on screen",
  },
  {
    id: "action-writing",
    name: "Writing",
    description: "Writing by hand",
    promptFragment: "writing by hand with pen focused on paper",
  },
  {
    id: "action-reading",
    name: "Reading",
    description: "Reading a book or document",
    promptFragment: "reading intently holding a book with focused attention",
  },
  {
    id: "action-studying",
    name: "Studying",
    description: "Intense focused learning",
    promptFragment: "studying with concentrated learning surrounded by materials",
  },
  {
    id: "action-presenting",
    name: "Presenting",
    description: "Giving a presentation",
    promptFragment: "presenting confidently with public speaking gestures",
  },
  {
    id: "action-meeting",
    name: "In a Meeting",
    description: "Participating in discussion",
    promptFragment: "participating in a business meeting discussion",
  },
  // Physical Activities
  {
    id: "action-dancing",
    name: "Dancing",
    description: "Dynamic dancing movement",
    promptFragment: "dancing with dynamic rhythmic movement",
  },
  {
    id: "action-exercising",
    name: "Exercising",
    description: "Physical workout activity",
    promptFragment: "exercising during a physical workout with exertion",
  },
  {
    id: "action-yoga",
    name: "Yoga",
    description: "Yoga practice pose",
    promptFragment: "practicing yoga with mindful stretching and zen focus",
  },
  {
    id: "action-running",
    name: "Running",
    description: "Jogging or sprinting",
    promptFragment: "running with athletic dynamic motion",
  },
  {
    id: "action-swimming",
    name: "Swimming",
    description: "Swimming motion",
    promptFragment: "swimming with athletic strokes in water",
  },
  {
    id: "action-climbing",
    name: "Climbing",
    description: "Climbing activity",
    promptFragment: "climbing with ascending motion gripping holds",
  },
  {
    id: "action-jumping",
    name: "Jumping",
    description: "Mid-jump action",
    promptFragment: "jumping airborne in a dynamic leaping motion",
  },
  // Leisure Activities
  {
    id: "action-playing-music",
    name: "Playing Music",
    description: "Playing an instrument",
    promptFragment: "playing music on an instrument with artistic performance",
  },
  {
    id: "action-singing",
    name: "Singing",
    description: "Vocal performance",
    promptFragment: "singing with vocal performance and musical expression",
  },
  {
    id: "action-painting",
    name: "Painting",
    description: "Creating art",
    promptFragment: "painting with brush in hand creating art",
  },
  {
    id: "action-cooking",
    name: "Cooking",
    description: "Preparing food",
    promptFragment: "cooking and preparing food with culinary focus",
  },
  {
    id: "action-gaming",
    name: "Gaming",
    description: "Playing video games",
    promptFragment: "gaming with controller in hand playing video games",
  },
  {
    id: "action-gardening",
    name: "Gardening",
    description: "Tending to plants",
    promptFragment: "gardening outdoors tending to plants",
  },
  {
    id: "action-photography",
    name: "Taking Photos",
    description: "Using a camera",
    promptFragment: "taking photos with camera capturing the moment",
  },
  // Social Actions
  {
    id: "action-hugging",
    name: "Hugging",
    description: "Embracing someone",
    promptFragment: "hugging in an affectionate warm embrace",
  },
  {
    id: "action-handshake",
    name: "Handshake",
    description: "Formal greeting",
    promptFragment: "shaking hands in a formal business greeting",
  },
  {
    id: "action-waving",
    name: "Waving",
    description: "Greeting wave",
    promptFragment: "waving with a friendly greeting gesture",
  },
  {
    id: "action-cheering",
    name: "Cheering",
    description: "Celebratory cheering",
    promptFragment: "cheering excitedly with arms raised in celebration",
  },
  {
    id: "action-applauding",
    name: "Applauding",
    description: "Clapping hands",
    promptFragment: "applauding with clapping hands showing appreciation",
  },
  {
    id: "action-toasting",
    name: "Toasting",
    description: "Raising glass for toast",
    promptFragment: "toasting with glass raised in celebration",
  },
  // Daily Activities
  {
    id: "action-eating",
    name: "Eating",
    description: "Enjoying food",
    promptFragment: "eating and enjoying food during a meal",
  },
  {
    id: "action-drinking",
    name: "Drinking",
    description: "Having a beverage",
    promptFragment: "drinking a beverage with refreshment",
  },
  {
    id: "action-coffee",
    name: "Drinking Coffee",
    description: "Enjoying coffee",
    promptFragment: "drinking coffee holding a cup in morning routine",
  },
  {
    id: "action-sleeping",
    name: "Sleeping",
    description: "Asleep or resting",
    promptFragment: "sleeping peacefully with eyes closed in rest",
  },
  {
    id: "action-stretching",
    name: "Stretching",
    description: "Morning stretch or workout stretch",
    promptFragment: "stretching with flexible extended limbs",
  },
  {
    id: "action-phone-call",
    name: "Phone Call",
    description: "On the phone",
    promptFragment: "on a phone call having a mobile conversation",
  },
  {
    id: "action-texting",
    name: "Texting",
    description: "Using smartphone",
    promptFragment: "texting on smartphone with focused attention",
  },
  {
    id: "action-walking",
    name: "Walking",
    description: "Casual walking",
    promptFragment: "walking casually moving forward with natural stride",
  },
  // Contemplative Actions
  {
    id: "action-meditating",
    name: "Meditating",
    description: "Mindfulness practice",
    promptFragment: "meditating with peaceful mindful concentration",
  },
  {
    id: "action-daydreaming",
    name: "Daydreaming",
    description: "Lost in thought",
    promptFragment: "daydreaming lost in thought with distant gaze",
  },
  {
    id: "action-stargazing",
    name: "Stargazing",
    description: "Looking at the sky",
    promptFragment: "stargazing looking up at the sky with contemplative wonder",
  },
  {
    id: "action-watching",
    name: "Watching",
    description: "Observing something",
    promptFragment: "watching intently with focused observant attention",
  },
];

// ==========================================
// Clothing Templates
// ==========================================
export const clothingTemplates: Template[] = [
  // Casual
  {
    id: "clothing-casual",
    name: "Casual",
    description: "Everyday casual wear",
    promptFragment: "wearing casual everyday clothing with a relaxed comfortable look",
  },
  {
    id: "clothing-tshirt-jeans",
    name: "T-Shirt & Jeans",
    description: "Classic casual combination",
    promptFragment: "wearing a t-shirt and jeans in classic casual style",
  },
  {
    id: "clothing-hoodie",
    name: "Hoodie",
    description: "Comfortable hooded sweatshirt",
    promptFragment: "wearing a comfortable hoodie in casual streetwear style",
  },
  {
    id: "clothing-sweater",
    name: "Sweater",
    description: "Cozy knit sweater",
    promptFragment: "wearing a cozy knit sweater for comfortable warmth",
  },
  {
    id: "clothing-cardigan",
    name: "Cardigan",
    description: "Button-up knit cardigan",
    promptFragment: "wearing a button-up cardigan in layered casual style",
  },
  {
    id: "clothing-polo",
    name: "Polo Shirt",
    description: "Smart casual polo",
    promptFragment: "wearing a polo shirt in smart casual style",
  },
  // Formal & Business
  {
    id: "clothing-formal",
    name: "Formal",
    description: "Business or formal attire",
    promptFragment: "wearing formal professional business attire",
  },
  {
    id: "clothing-suit",
    name: "Business Suit",
    description: "Professional suit and tie",
    promptFragment: "wearing a professional business suit with formal styling",
  },
  {
    id: "clothing-blazer",
    name: "Blazer",
    description: "Smart blazer jacket",
    promptFragment: "wearing a smart blazer jacket in semi-formal style",
  },
  {
    id: "clothing-dress-shirt",
    name: "Dress Shirt",
    description: "Formal button-down shirt",
    promptFragment: "wearing a formal button-down dress shirt",
  },
  {
    id: "clothing-tuxedo",
    name: "Tuxedo",
    description: "Black tie formal wear",
    promptFragment: "wearing a tuxedo in elegant black tie formal style",
  },
  {
    id: "clothing-business-casual",
    name: "Business Casual",
    description: "Smart but relaxed office wear",
    promptFragment: "wearing smart business casual office attire",
  },
  // Dresses & Skirts
  {
    id: "clothing-dress",
    name: "Dress",
    description: "Casual or formal dress",
    promptFragment: "wearing an elegant dress with feminine styling",
  },
  {
    id: "clothing-evening-gown",
    name: "Evening Gown",
    description: "Formal evening dress",
    promptFragment: "wearing a formal evening gown with elegant long styling",
  },
  {
    id: "clothing-cocktail-dress",
    name: "Cocktail Dress",
    description: "Semi-formal short dress",
    promptFragment: "wearing a semi-formal cocktail dress for party occasions",
  },
  {
    id: "clothing-sundress",
    name: "Sundress",
    description: "Light summer dress",
    promptFragment: "wearing a light casual sundress for summer style",
  },
  {
    id: "clothing-maxi-dress",
    name: "Maxi Dress",
    description: "Long flowing dress",
    promptFragment: "wearing a long flowing maxi dress in bohemian style",
  },
  {
    id: "clothing-skirt",
    name: "Skirt",
    description: "Various skirt styles",
    promptFragment: "wearing a versatile skirt in feminine style",
  },
  // Athletic & Active
  {
    id: "clothing-athletic",
    name: "Athletic",
    description: "Sports or workout clothing",
    promptFragment: "wearing athletic sports clothing for workout activity",
  },
  {
    id: "clothing-yoga",
    name: "Yoga Wear",
    description: "Flexible yoga attire",
    promptFragment: "wearing flexible yoga attire for stretchy movement",
  },
  {
    id: "clothing-running-gear",
    name: "Running Gear",
    description: "Running attire",
    promptFragment: "wearing athletic running gear with shorts and performance top",
  },
  {
    id: "clothing-swimwear",
    name: "Swimwear",
    description: "Swimming attire",
    promptFragment: "wearing swimwear in beach or pool style",
  },
  {
    id: "clothing-sports-uniform",
    name: "Sports Uniform",
    description: "Team sports attire",
    promptFragment: "wearing a team sports uniform with athletic jersey",
  },
  // Streetwear & Urban
  {
    id: "clothing-streetwear",
    name: "Streetwear",
    description: "Urban street fashion style",
    promptFragment: "wearing trendy streetwear in urban fashion style",
  },
  {
    id: "clothing-hypebeast",
    name: "Hypebeast",
    description: "High-end streetwear",
    promptFragment: "wearing designer hypebeast streetwear in exclusive urban fashion",
  },
  {
    id: "clothing-urban-layers",
    name: "Urban Layers",
    description: "Layered street style",
    promptFragment: "wearing urban layered clothing with multiple street fashion layers",
  },
  {
    id: "clothing-denim-jacket",
    name: "Denim Jacket",
    description: "Classic jean jacket",
    promptFragment: "wearing a classic denim jacket in casual style",
  },
  {
    id: "clothing-bomber-jacket",
    name: "Bomber Jacket",
    description: "Classic bomber style",
    promptFragment: "wearing a classic bomber jacket in casual cool style",
  },
  // Elegant & Luxury
  {
    id: "clothing-elegant",
    name: "Elegant",
    description: "Sophisticated, upscale fashion",
    promptFragment: "wearing elegant sophisticated upscale fashion",
  },
  {
    id: "clothing-haute-couture",
    name: "Haute Couture",
    description: "High fashion designer wear",
    promptFragment: "wearing haute couture high fashion designer clothing",
  },
  {
    id: "clothing-designer",
    name: "Designer Wear",
    description: "Luxury brand clothing",
    promptFragment: "wearing luxury designer brand clothing with premium style",
  },
  {
    id: "clothing-silk",
    name: "Silk Attire",
    description: "Luxurious silk garments",
    promptFragment: "wearing luxurious silk garments with elegant fabric draping",
  },
  // Vintage & Retro
  {
    id: "clothing-vintage",
    name: "Vintage",
    description: "Retro or period-appropriate clothing",
    promptFragment: "wearing vintage retro fashion from a classic era",
  },
  {
    id: "clothing-retro-50s",
    name: "1950s Style",
    description: "Classic 50s fashion",
    promptFragment: "wearing 1950s retro fashion in classic fifties style",
  },
  {
    id: "clothing-retro-70s",
    name: "1970s Style",
    description: "Groovy 70s fashion",
    promptFragment: "wearing 1970s groovy fashion in disco era style",
  },
  {
    id: "clothing-retro-80s",
    name: "1980s Style",
    description: "Bold 80s fashion",
    promptFragment: "wearing bold 1980s fashion in retro eighties style",
  },
  {
    id: "clothing-retro-90s",
    name: "1990s Style",
    description: "90s grunge and minimalist",
    promptFragment: "wearing 1990s fashion in grunge minimalist nineties style",
  },
  // Cultural & Traditional
  {
    id: "clothing-traditional",
    name: "Traditional Wear",
    description: "Cultural traditional clothing",
    promptFragment: "wearing traditional cultural heritage clothing",
  },
  {
    id: "clothing-kimono",
    name: "Kimono",
    description: "Traditional Japanese garment",
    promptFragment: "wearing an elegant traditional Japanese kimono",
  },
  {
    id: "clothing-hanbok",
    name: "Hanbok",
    description: "Traditional Korean attire",
    promptFragment: "wearing a colorful traditional Korean hanbok",
  },
  {
    id: "clothing-saree",
    name: "Saree",
    description: "Traditional Indian garment",
    promptFragment: "wearing an elegant traditional Indian saree with draping",
  },
  {
    id: "clothing-cheongsam",
    name: "Cheongsam",
    description: "Traditional Chinese dress",
    promptFragment: "wearing an elegant fitted traditional Chinese cheongsam",
  },
  // Special & Themed
  {
    id: "clothing-uniform",
    name: "Uniform",
    description: "Professional or school uniform",
    promptFragment: "wearing a professional standardized uniform",
  },
  {
    id: "clothing-military",
    name: "Military Style",
    description: "Military-inspired fashion",
    promptFragment: "wearing military-inspired tactical fashion",
  },
  {
    id: "clothing-punk",
    name: "Punk",
    description: "Punk rock fashion",
    promptFragment: "wearing rebellious punk fashion with leather and studs",
  },
  {
    id: "clothing-goth",
    name: "Gothic",
    description: "Gothic fashion style",
    promptFragment: "wearing dark gothic fashion with dramatic black attire",
  },
  {
    id: "clothing-bohemian",
    name: "Bohemian",
    description: "Boho chic style",
    promptFragment: "wearing free-spirited bohemian boho chic fashion",
  },
  {
    id: "clothing-minimalist",
    name: "Minimalist",
    description: "Clean simple fashion",
    promptFragment: "wearing minimalist fashion with clean simple lines and neutral colors",
  },
  // Outerwear
  {
    id: "clothing-winter-coat",
    name: "Winter Coat",
    description: "Heavy winter outerwear",
    promptFragment: "wearing a heavy winter coat for cold weather",
  },
  {
    id: "clothing-leather-jacket",
    name: "Leather Jacket",
    description: "Classic leather jacket",
    promptFragment: "wearing a classic leather jacket in edgy style",
  },
  {
    id: "clothing-trench-coat",
    name: "Trench Coat",
    description: "Classic trench style",
    promptFragment: "wearing a classic trench coat in sophisticated style",
  },
  {
    id: "clothing-raincoat",
    name: "Raincoat",
    description: "Weather protection",
    promptFragment: "wearing a waterproof raincoat for weather protection",
  },
  // Fantasy & Costume
  {
    id: "clothing-fantasy-armor",
    name: "Fantasy Armor",
    description: "Medieval or fantasy armor",
    promptFragment: "wearing fantasy warrior armor in medieval plate style",
  },
  {
    id: "clothing-royal-robes",
    name: "Royal Robes",
    description: "Regal royal garments",
    promptFragment: "wearing majestic royal robes in regal style",
  },
  {
    id: "clothing-futuristic",
    name: "Futuristic",
    description: "Sci-fi inspired fashion",
    promptFragment: "wearing futuristic sci-fi fashion with advanced textile design",
  },
  {
    id: "clothing-cyberpunk",
    name: "Cyberpunk Fashion",
    description: "Tech-enhanced urban wear",
    promptFragment: "wearing cyberpunk tech-enhanced fashion with neon accents",
  },
];

// ==========================================
// Expression Templates
// ==========================================
export const expressionTemplates: Template[] = [
  // Positive Emotions
  {
    id: "expression-neutral",
    name: "Neutral",
    description: "Calm, neutral facial expression",
    promptFragment: "with a neutral calm expression and relaxed features",
  },
  {
    id: "expression-happy",
    name: "Happy",
    description: "Joyful, pleased expression",
    promptFragment: "with a happy joyful expression radiating positive energy",
  },
  {
    id: "expression-joyful",
    name: "Joyful",
    description: "Radiating with joy",
    promptFragment: "with a joyful beaming expression and radiant smile",
  },
  {
    id: "expression-content",
    name: "Content",
    description: "Peaceful satisfaction",
    promptFragment: "with a content peaceful expression and gentle satisfied smile",
  },
  {
    id: "expression-excited",
    name: "Excited",
    description: "Enthusiastic and thrilled",
    promptFragment: "with an excited enthusiastic expression full of thrill",
  },
  {
    id: "expression-amused",
    name: "Amused",
    description: "Entertained smirk",
    promptFragment: "with an amused entertained expression and playful smirk",
  },
  {
    id: "expression-proud",
    name: "Proud",
    description: "Self-satisfied pride",
    promptFragment: "with a proud self-satisfied expression showing accomplishment",
  },
  {
    id: "expression-loving",
    name: "Loving",
    description: "Warm affectionate gaze",
    promptFragment: "with a loving warm expression and affectionate tender gaze",
  },
  {
    id: "expression-hopeful",
    name: "Hopeful",
    description: "Optimistic and expecting",
    promptFragment: "with a hopeful optimistic expression full of expectation",
  },
  // Confident & Serious
  {
    id: "expression-confident",
    name: "Confident",
    description: "Self-assured, bold expression",
    promptFragment: "with a confident self-assured expression and bold demeanor",
  },
  {
    id: "expression-determined",
    name: "Determined",
    description: "Resolute and focused",
    promptFragment: "with a determined resolute expression showing focused resolve",
  },
  {
    id: "expression-serious",
    name: "Serious",
    description: "Focused, serious demeanor",
    promptFragment: "with a serious focused expression and determined demeanor",
  },
  {
    id: "expression-stern",
    name: "Stern",
    description: "Strict serious look",
    promptFragment: "with a stern strict expression and unyielding demeanor",
  },
  {
    id: "expression-intense",
    name: "Intense",
    description: "Deep concentrated gaze",
    promptFragment: "with an intense concentrated expression and penetrating gaze",
  },
  {
    id: "expression-stoic",
    name: "Stoic",
    description: "Emotionless and controlled",
    promptFragment: "with a stoic emotionless expression and controlled demeanor",
  },
  // Thoughtful & Contemplative
  {
    id: "expression-thoughtful",
    name: "Thoughtful",
    description: "Deep in thought",
    promptFragment: "with a thoughtful contemplative expression deep in thought",
  },
  {
    id: "expression-pensive",
    name: "Pensive",
    description: "Lost in deep thought",
    promptFragment: "with a pensive reflective expression lost in thought",
  },
  {
    id: "expression-curious",
    name: "Curious",
    description: "Interested and questioning",
    promptFragment: "with a curious interested expression showing questioning engagement",
  },
  {
    id: "expression-wondering",
    name: "Wondering",
    description: "Imaginative pondering",
    promptFragment: "with a wondering imaginative expression in dreamy pondering",
  },
  {
    id: "expression-skeptical",
    name: "Skeptical",
    description: "Doubtful and questioning",
    promptFragment: "with a skeptical doubtful expression questioning something",
  },
  {
    id: "expression-focused",
    name: "Focused",
    description: "Concentrated attention",
    promptFragment: "with a focused concentrated expression showing attentive engagement",
  },
  // Surprised & Amazed
  {
    id: "expression-surprised",
    name: "Surprised",
    description: "Shocked or amazed expression",
    promptFragment: "with a surprised shocked expression and wide eyes",
  },
  {
    id: "expression-amazed",
    name: "Amazed",
    description: "Wonder and astonishment",
    promptFragment: "with an amazed wonder-filled expression showing astonishment",
  },
  {
    id: "expression-shocked",
    name: "Shocked",
    description: "Stunned disbelief",
    promptFragment: "with a shocked stunned expression showing disbelief",
  },
  {
    id: "expression-bewildered",
    name: "Bewildered",
    description: "Confused amazement",
    promptFragment: "with a bewildered confused expression and puzzled look",
  },
  // Negative & Complex Emotions
  {
    id: "expression-sad",
    name: "Sad",
    description: "Sorrowful expression",
    promptFragment: "with a sad sorrowful expression and downcast demeanor",
  },
  {
    id: "expression-melancholic",
    name: "Melancholic",
    description: "Deep sadness and longing",
    promptFragment: "with a melancholic expression showing deep wistful sadness",
  },
  {
    id: "expression-worried",
    name: "Worried",
    description: "Anxious and concerned",
    promptFragment: "with a worried anxious expression showing concern",
  },
  {
    id: "expression-fearful",
    name: "Fearful",
    description: "Scared and alarmed",
    promptFragment: "with a fearful scared expression showing alarm",
  },
  {
    id: "expression-angry",
    name: "Angry",
    description: "Rage and frustration",
    promptFragment: "with an angry furious expression showing intense emotion",
  },
  {
    id: "expression-frustrated",
    name: "Frustrated",
    description: "Annoyed and vexed",
    promptFragment: "with a frustrated annoyed expression showing vexation",
  },
  {
    id: "expression-disgusted",
    name: "Disgusted",
    description: "Revulsion and distaste",
    promptFragment: "with a disgusted expression showing revulsion and distaste",
  },
  {
    id: "expression-disappointed",
    name: "Disappointed",
    description: "Let down and dismayed",
    promptFragment: "with a disappointed expression feeling let down and dismayed",
  },
  // Mysterious & Enigmatic
  {
    id: "expression-mysterious",
    name: "Mysterious",
    description: "Enigmatic, intriguing expression",
    promptFragment: "with a mysterious enigmatic expression and intriguing gaze",
  },
  {
    id: "expression-secretive",
    name: "Secretive",
    description: "Hiding something",
    promptFragment: "with a secretive knowing expression hiding something",
  },
  {
    id: "expression-smirking",
    name: "Smirking",
    description: "Knowing half-smile",
    promptFragment: "with a smirking clever expression and knowing half-smile",
  },
  {
    id: "expression-mischievous",
    name: "Mischievous",
    description: "Playfully naughty",
    promptFragment: "with a mischievous playful expression and impish grin",
  },
  {
    id: "expression-seductive",
    name: "Seductive",
    description: "Alluring and enticing",
    promptFragment: "with a seductive alluring expression and enticing gaze",
  },
  // Other Expressions
  {
    id: "expression-dreamy",
    name: "Dreamy",
    description: "Lost in fantasy",
    promptFragment: "with a dreamy faraway expression lost in fantasy",
  },
  {
    id: "expression-sleepy",
    name: "Sleepy",
    description: "Drowsy and tired",
    promptFragment: "with a sleepy drowsy expression and tired eyes",
  },
  {
    id: "expression-bored",
    name: "Bored",
    description: "Uninterested and dull",
    promptFragment: "with a bored uninterested expression and dull demeanor",
  },
  {
    id: "expression-embarrassed",
    name: "Embarrassed",
    description: "Flustered and shy",
    promptFragment: "with an embarrassed flustered expression and shy demeanor",
  },
  {
    id: "expression-awkward",
    name: "Awkward",
    description: "Uncomfortable and uneasy",
    promptFragment: "with an awkward uncomfortable expression and uneasy demeanor",
  },
  {
    id: "expression-blank",
    name: "Blank",
    description: "Empty expressionless face",
    promptFragment: "with a blank expressionless face and vacant look",
  },
];

// ==========================================
// All Templates Export
// ==========================================
export const allTemplates = {
  lighting: lightingTemplates,
  camera: cameraTemplates,
  style: styleTemplates,
  location: locationTemplates,
  pose: poseTemplates,
  action: actionTemplates,
  clothing: clothingTemplates,
  expression: expressionTemplates,
};

export type TemplateCategory = keyof typeof allTemplates;

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: TemplateCategory): Template[] {
  return allTemplates[category];
}

/**
 * Get a template by ID from any category
 */
export function getTemplateById(id: string): Template | undefined {
  for (const templates of Object.values(allTemplates)) {
    const template = templates.find((t) => t.id === id);
    if (template) return template;
  }
  return undefined;
}
