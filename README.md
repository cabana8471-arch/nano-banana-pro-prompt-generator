# Nano Banana Pro

An AI-powered image generator application that uses Google's Gemini 3 Pro Image Preview model to create and refine images based on detailed prompts with optional reference images (avatars) for consistent character generation.

## Features

### Photo Generation
- **AI Image Generation**: Generate images using Google Gemini 3 Pro with multi-turn conversation support for refinements
- **Prompt Builder**: Intuitive UI to construct detailed prompts with location, lighting, camera angle, style, and subject options
- **Avatar System**: Upload reference images to maintain consistent characters/objects across generations
- **Preset Management**: Save, load, rename, and delete prompt presets for quick reuse

### Media Library
- **Organized Asset Management**: Dedicated sections for different asset types under the "Media" dropdown menu
- **Avatars**: Reference images for human characters and objects in photo generation
- **Logos**: Brand logos for banner generation with fallback to object type
- **Products**: Product images and packshots for e-commerce banners
- **References**: Style, composition, and color reference images for banner design guidance

### Banner Generator
- **Professional Banner Creation**: Dedicated banner generator for web ads, social media, and marketing materials
- **Multi-Banner Generation**: Generate 1-4 banners simultaneously, similar to photo generation
- **Project Organization**: Organize banners into projects for better workflow management
  - **Required Project Selection**: Choose a project before generating banners
  - **Inline Project Creation**: Create new projects directly from the generator
  - **Post-Generation Assignment**: Add generated banners to different projects via dedicated modal
- **Reference Images**: Upload existing banners/images as references to guide AI generation
  - **3 Reference Types**: Style (visual aesthetics), Composition (layout structure), Color (palette inspiration)
  - **Multi-Reference Support**: Use up to 4 reference images per generation
  - **Reference Library**: Store up to 50 references per user with easy management
- **15 Template Categories**: 520+ presets organized in 4 sections:
  - **Basic Configuration**: Banner Type (~50), Banner Size (~39 + Custom), Industry/Niche (~64)
  - **Visual Style**: Design Style (~47), Color Scheme (~42), Mood/Emotion (~30), Seasonal/Holiday (~37)
  - **Visual Elements**: Background Style (~47), Visual Effects (~42), Icons/Graphics (~20), Promotional Elements (~15)
  - **Layout & Typography**: Layout Style (~25), Text Language, Text Placement (~15), Typography Style (~25 including Inter & Roboto fonts), CTA Button Style (~20)
- **Per-Element Typography Control**: Set different fonts for each text element:
  - **Headline Font**: Typography style specifically for headline text
  - **Body Font**: Typography style for subheadline and tagline text
  - **CTA Font**: Typography style for call-to-action button text
  - **Fallback Support**: General Typography Style applies when specific fonts not set
- **Visual Typography Previews**: Each typography option shows a live preview of how the text style looks
- **Platform Support**: Google Ads (IAB Standard), Facebook, Instagram, Twitter, LinkedIn, YouTube, TikTok, Pinterest, Email, and website banners
- **Banner Sizes**:
  - Google Display Ads: Leaderboard (728x90, 970x90), Rectangle (300x250, 336x280, 300x600), Skyscraper (160x600, 120x600), Billboard (970x250), Mobile (320x50, 320x100)
  - Social Media: Facebook Feed (1200x628, 1080x1080), Instagram Feed (1080x1080, 1080x1350), Instagram Story (1080x1920), Pinterest Pin (1000x1500), TikTok/Reels (1080x1920)
  - Twitter/X: Post (1200x675), Profile Header (1500x500)
  - LinkedIn: Feed Post (1200x627), Company Cover (1584x396)
  - YouTube: Video Thumbnail (1280x720), Channel Banner (2560x1440)
  - Email: Header Standard (600x200)
  - Website: Hero Banner (1920x600, 1920x800), Sidebar (300x250, 300x600), Full Width (1920x400), Ultrawide (2560x1080)
  - Print: A4 Portrait (2480x3508), A4 Landscape (3508x2480)
  - **Custom Size**: Define your own dimensions (50-4096px width/height)
- **Quick Start Templates**: 46 pre-configured templates:
  - **Core**: E-commerce Sale, SaaS Launch, Restaurant Promo, Fashion Brand, Tech Startup, Holiday Special
  - **Extended**: Luxury Brand, Gaming Promo, Wellness & Spa, Black Friday, Podcast Launch, Fitness Challenge, Eco Friendly, Wedding Elegant, Crypto Launch, Food Delivery
  - **Industry**: Healthcare Clinic, Real Estate, Education Course, Finance & Banking, Travel & Vacation, Automotive Dealer, Beauty & Cosmetics, Legal Services, Music Event, Pet Services, Photography Studio, Charity & Donation
  - **Seasonal**: Valentine's Day, Halloween, Cyber Monday, Mother's Day, New Year, Summer Sale, Chinese New Year, Back to School
  - **Design Styles**: Retro 80s, Glassmorphism, Memphis Playful, Mid-Century Modern, Vaporwave Aesthetic
  - **Special Purpose**: Webinar Event, Free Trial, Newsletter Signup, Testimonials, Coming Soon
- **Text Content Manager**: Separate fields for Headline, Subheadline, CTA Text, and Tagline with character limits per banner size
- **Brand Assets Integration**: Logo and Product Image upload via avatar system, Brand Colors (Primary, Secondary, Accent)
- **Advanced Color Picker**: EyeDropper API integration, 5 predefined palettes, WCAG contrast ratio checker, saved colors (max 8)
- **History & Undo**: Full undo/redo support with history viewer (up to 50 states)
- **Responsive Preview**: 4 preview tabs (Comparison, Desktop, Mobile, Social) with scaled visual cards
- **Quick Actions**: Copy config to clipboard, Randomize all settings, Swap primary/secondary colors, Reset with confirmation
- **Validation System**: Character limits per banner size, contrast checking, missing headline/CTA warnings
- **Export Options**: Download in PNG, JPG, or WebP format with quality settings
- **Multi-Size Export**: Export banners in multiple platform dimensions at once
  - **10 Platform Presets**: Google Ads (9 sizes), Facebook (6), Instagram (4), Twitter/X (3), LinkedIn (4), Pinterest (3), YouTube (4), TikTok (2), Email Marketing (3), Website (5)
  - **Batch Processing**: Select multiple sizes across platforms and export as organized ZIP
  - **Smart Resize**: Automatic image resizing with cover mode to maintain visual quality
  - **Progress Tracking**: Real-time progress indicator during export
- **Native Platform Generation**: Generate AI banners natively for all sizes of a platform at once
  - **9 Platform Bundles**: Select "Google Ads - All Sizes", "Facebook - All Sizes", etc. from Banner Size dropdown
  - **AI-Optimized Layouts**: Each size is generated with layout adapted to its aspect ratio (not just resized)
  - **Sequential Generation**: Banners are generated one by one with real-time progress tracking
  - **Batch Download**: Download all generated platform banners as organized ZIP file
- **Advanced Preset Management**: Comprehensive preset system for banner configurations
  - **Full Preset Editing**: Edit all 20+ configuration fields across 6 sections (Basic, Visual Style, Visual Elements, Layout & Typography, Text Content, Custom Prompt)
  - **Update Existing Presets**: Save changes to existing presets instead of creating duplicates
  - **Preset Preview**: Hover preview showing all configured fields before loading
  - **Partial Load**: Load only selected sections or individual fields from a preset
  - **Preset Comparison**: Side-by-side comparison of two presets with diff highlighting
  - **Duplicate Presets**: Clone presets with custom names from multiple locations
  - **Field Count Badges**: Visual indicators showing how many fields each preset configures

### Logo Generator
- **Professional Logo Creation**: Dedicated AI-powered logo generator for brand identity design
- **Multi-Logo Generation**: Generate 1-4 logo variations simultaneously
- **Project Organization**: Organize logos into projects, same workflow as banners
- **12 Template Categories**: Comprehensive logo design options:
  - **Basic Configuration**: Logo Type (Wordmark, Lettermark, Symbol, Combination, Emblem, Mascot, Abstract), Industry/Niche (19 industries including Tech, Finance, Healthcare, etc.), Logo Format (Horizontal, Vertical, Icon Only, Text Only, Square, Circular)
  - **Visual Style**: Design Style (13 styles: Modern Minimalist, Vintage, Bold, Elegant, Playful, Corporate, Tech, Hand-drawn, Geometric, Flat, 3D, Line Art, Gradient), Color Scheme Type (9 types: Monochrome, Two-Color, Multicolor, B&W, Gradient, Pastel, Bold, Earth Tones, Metallic), Mood/Tone (10 moods: Professional, Friendly, Innovative, Traditional, Energetic, Calm, Bold, Sophisticated, Playful, Authoritative)
  - **Icon/Symbol Design**: Icon Style (8 styles: Abstract Geometric, Organic, Technical, Pictorial, Negative Space, Interconnected, Simplified, Detailed), Symbol Elements (10 types: Letters, Shapes, Nature, Tech, Human, Animals, Buildings, Tools, Arrow, Globe)
  - **Typography**: Font Category (10 categories: Sans-Serif, Serif, Slab Serif, Script, Display, Geometric Sans, Rounded, Condensed, Bold, Light), Typography Treatment (7 treatments: Uppercase, Lowercase, Title Case, Mixed Case, Spaced Letters, Stacked Words, Integrated)
  - **Additional Options**: Special Effects (None, Drop Shadow, Outline, Embossed, Glow, Texture), Background Style (Transparent, White, Dark, Colored)
- **Text Content Manager**: Company Name (30 chars), Tagline (50 chars), Abbreviation (5 chars) with character limits and validation
- **Brand Colors**: Primary, Secondary, and Accent color pickers with:
  - **EyeDropper API**: Pick colors from anywhere on screen
  - **5 Color Palettes**: Brand, Neutral, Professional, Vibrant, Nature
  - **WCAG Contrast Checker**: Real-time accessibility compliance checking
  - **Color Swap**: Quick swap between primary and secondary colors
- **Logo Reference Images**: Upload existing logos as references for style guidance
  - **Reference Library**: Store references per user with easy management
  - **Multi-Reference Support**: Use multiple reference images per generation
- **Quick Start Templates**: 13 pre-configured logo templates:
  - Tech Startup, Law Firm, Organic Food, Fashion Brand, Sports Team, Creative Agency, Healthcare, Restaurant, Finance, Kids Brand, Outsourcing Company, Nanotechnology, Fire Protection
- **Preset Management**: Save, load, duplicate, and manage logo configuration presets
- **SVG Export**: Client-side vectorization for scalable logo output
  - **Color Quantization**: Intelligent color palette extraction
  - **Path Tracing**: Contour detection with Ramer-Douglas-Peucker simplification
  - **Clean SVG Output**: Optimized vector paths for professional use
- **Export Options**: Download in PNG, JPG, WebP, or SVG format
- **Refinement System**: Iterative logo refinement with AI suggestions (simpler, bolder, more modern, different colors, larger icon, better typography, more minimal, more unique)
- **History & Undo**: Full state history tracking for logo configurations

### Social Features
- **Gallery**: Browse and share generated images with the community
- **Gallery Filtering**: Filter gallery by generation type (All, Photos, Banners) and by project
- **Like System**: Like and discover popular images from other users

### Cost Control
- **Usage Monitoring**: Track API costs for all generation types (Photo, Banner, Logo)
- **Dashboard Overview**: View current month's total cost, token usage, and generation count
- **Month-over-Month Comparison**: Compare costs with previous month with percentage change indicators
- **Daily Trend Chart**: Visualize cost trends over the last 30 days with interactive recharts graph
- **Generator Breakdown**: Pie chart showing cost distribution by generation type
- **Generation History**: Paginated table of all generations with cost details and filtering by type
- **Budget Management**: Set monthly budget limits with customizable alert thresholds
- **Custom Pricing**: Configure your own pricing per 1K tokens (input, output text, output image)
- **CSV Export**: Download detailed cost reports for accounting and analysis
- **Legacy Migration**: One-click cost estimation for existing generations without usage data

### Infrastructure
- **BYOK (Bring Your Own Key)**: Users provide their own Google AI API key, stored securely with AES-256-GCM encryption
- **Google OAuth Security**: Account security managed by Google with direct link to Google Security settings for 2FA configuration
- **Internationalization (i18n)**: Full support for English and Romanian languages with locale-based URL routing (`/en/`, `/ro/`)
- **Intuitive Error Messages**: Client-side validation for file uploads with specific error messages (file size limits, invalid file types) displayed instantly before server requests

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with Google OAuth
- **AI**: Google Gemini via `@google/genai` SDK
- **Storage**: Vercel Blob (production) / local filesystem (development)
- **UI**: shadcn/ui with Tailwind CSS v4
- **i18n**: next-intl for internationalization with locale-based routing

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials
- pnpm (recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nano-banana-pro
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   ```

4. Configure your `.env` file:
   ```env
   # Database
   POSTGRES_URL="postgresql://username:password@localhost:5432/nano_banana"

   # Authentication
   BETTER_AUTH_SECRET="your-random-32-character-secret-key"

   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # App URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # Optional: Vercel Blob storage (leave empty for local storage)
   BLOB_READ_WRITE_TOKEN=""
   ```

5. Set up the database:
   ```bash
   pnpm db:migrate
   ```

6. Start the development server:
   ```bash
   pnpm dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Usage

### Getting Started
1. **Sign in** with your Google account
2. **Add your Google AI API key** in settings (get one from [Google AI Studio](https://aistudio.google.com/apikey))
3. **Create avatars** by uploading reference images for consistent character generation
4. **Change language** in your profile settings (English/Romanian)

### Image Generation
1. **Build your prompt** using the Prompt Builder interface
2. **Generate images** and refine them with follow-up prompts
3. **Share to gallery** by making images public for the community to see

### Banner Generation
1. Navigate to `/banner-generator`
2. **Select a Quick Start template** or configure from scratch
3. **Choose banner settings**: type, size (IAB standard, social media, or custom dimensions), industry
   - **For platform bundles**: Select "Google Ads - All Sizes" or similar to generate all platform sizes natively
4. **Customize design**: style, colors, mood, seasonal theme
5. **Add visual elements**: background, effects, icons, promotional badges
6. **Configure layout**: text placement, typography style (or set per-element: headline, body, CTA fonts), CTA button style
7. **Enter text content**: headline, subheadline, CTA text, tagline
8. **Upload brand assets**: logo and product images via avatar system
9. **Add reference images** (optional): upload existing banners for style, composition, or color guidance
10. **Preview and generate** your professional banner
11. **Download** in PNG, JPG, or WebP format
12. **Export Multi-Size**: Use "Export for Platforms" to batch-export the same banner in multiple dimensions for different platforms (ZIP download)
13. **Native Platform Generation**: When a platform bundle is selected, AI generates each size with optimized layout

## Internationalization

The application supports multiple languages with locale-based URL routing:

- **English**: Access via `/en/` prefix (e.g., `/en/generate`, `/en/gallery`)
- **Romanian**: Access via `/ro/` prefix (e.g., `/ro/generate`, `/ro/gallery`)

### Changing Language

1. Navigate to your **Profile** page (`/en/profile` or `/ro/profile`)
2. Find the **Language** section
3. Select your preferred language from the dropdown
4. The page will automatically redirect to the new locale

### URL Structure

```
/                    → Redirects to /en/ (default locale)
/en/                 → English homepage
/ro/                 → Romanian homepage
/en/photo-generator  → Photo generation (English)
/ro/photo-generator  → Photo generation (Romanian)
/en/banner-generator → Banner generator (English)
/ro/banner-generator → Banner generator (Romanian)
/en/gallery          → Gallery with filtering (English)
/ro/gallery          → Gallery with filtering (Romanian)
/en/cost-control     → Cost Control dashboard (English)
/ro/cost-control     → Cost Control dashboard (Romanian)

Media Library:
/en/avatars          → Avatar management (English)
/en/logos            → Logo management (English)
/en/products         → Product images (English)
/en/references       → Reference images (English)
```

## Development Commands

```bash
pnpm dev              # Start dev server with Turbopack
pnpm build            # Build for production
pnpm lint             # Run ESLint
pnpm typecheck        # Run TypeScript type checking
pnpm check            # Run both lint and typecheck
pnpm format           # Format code with Prettier
```

### Database Commands

```bash
pnpm db:push          # Push schema changes (development)
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio GUI
pnpm db:reset         # Drop and recreate all tables
```

## Project Structure

```
src/
├── app/
│   ├── api/                  # API routes (no locale prefix)
│   └── [locale]/             # Locale-based pages (en, ro)
│       ├── photo-generator/  # Photo generation page
│       ├── banner-generator/ # Banner generation page
│       ├── logo-generator/   # Logo generation page
│       ├── gallery/          # Gallery pages with filtering
│       ├── cost-control/     # Cost monitoring dashboard
│       ├── profile/          # User profile & settings
│       ├── avatars/          # Avatar management
│       ├── logos/            # Logo management
│       ├── products/         # Product image management
│       └── references/       # Reference image management
├── components/
│   ├── generate/             # Prompt builder and generation UI
│   ├── media/                # Reusable media page component for logos/products/references
│   ├── banner-generator/     # Banner generator components
│   │   ├── banner-builder/   # Builder panel with sections
│   │   │   ├── sections/     # 4 section components (basic, visual style, elements, layout)
│   │   │   ├── quick-actions.tsx        # Duplicate, randomize, swap, reset
│   │   │   ├── history-controls.tsx     # Undo/redo with history viewer
│   │   │   ├── advanced-color-picker.tsx # EyeDropper, palettes, contrast
│   │   │   ├── text-content-editor.tsx  # Headline, subheadline, CTA, tagline
│   │   │   ├── brand-assets-manager.tsx # Logo, product image, brand colors
│   │   │   └── banner-reference-manager.tsx # Reference images upload & selection
│   │   ├── preview/          # Preview panel
│   │   │   ├── banner-preview-panel.tsx # Main preview with generation settings
│   │   │   └── responsive-preview.tsx   # Multi-device preview comparison
│   │   ├── results/          # Results panel
│   │   │   ├── banner-results-panel.tsx # Grid with download options
│   │   │   ├── banner-refine-input.tsx  # Refinement input
│   │   │   └── export-multi-size-modal.tsx # Multi-platform batch export
│   │   ├── presets/          # Preset management
│   │   │   ├── quick-start-templates.tsx      # 46 pre-configured templates
│   │   │   ├── save-banner-preset-modal.tsx   # Save/update presets with diff preview
│   │   │   ├── load-banner-preset-dropdown.tsx # Load with preview & partial load
│   │   │   ├── manage-banner-presets-modal.tsx # Edit/delete/duplicate presets
│   │   │   ├── edit-banner-preset-sheet.tsx   # Full preset configuration editor
│   │   │   ├── partial-load-modal.tsx         # Section/field-level partial load
│   │   │   ├── compare-presets-modal.tsx      # Side-by-side preset comparison
│   │   │   ├── banner-preset-card.tsx         # Expandable preset preview card
│   │   │   ├── banner-preset-list.tsx         # Preset list with actions
│   │   │   ├── duplicate-preset-dialog.tsx    # Duplicate with custom name
│   │   │   └── shared/                        # Shared preset utilities
│   │   │       ├── preset-section-summary.tsx # Section field summaries
│   │   │       ├── preset-config-diff.tsx     # Configuration diff viewer
│   │   │       └── preset-field-checkbox.tsx  # Individual field selection
│   │   └── projects/         # Project organization
│   │       ├── project-selector.tsx       # Dropdown with create option
│   │       ├── create-project-modal.tsx   # New project dialog
│   │       └── add-to-project-modal.tsx   # Assign banner to project
│   ├── presets/              # Photo preset components
│   │   ├── save-preset-modal.tsx
│   │   ├── load-preset-dropdown.tsx
│   │   └── manage-presets-modal.tsx # Edit/delete presets
│   ├── cost-control/         # Cost monitoring components
│   │   ├── cost-overview-cards.tsx    # Summary cards with trends
│   │   ├── generator-breakdown.tsx    # Pie chart by type
│   │   ├── daily-trend-chart.tsx      # Line chart with recharts
│   │   ├── cost-history-table.tsx     # Paginated history table
│   │   └── budget-settings-dialog.tsx # Budget & pricing config
│   ├── auth/                 # Authentication components
│   ├── gallery/              # Gallery components
│   ├── avatars/              # Avatar components
│   └── ui/                   # shadcn/ui components
├── hooks/                    # Custom React hooks
│   ├── use-avatars.ts        # Avatar management
│   ├── use-generation.ts     # Image generation logic
│   ├── use-prompt-builder.ts # Prompt builder state
│   ├── use-banner-builder.ts # Banner builder state (15 categories + text + brand assets)
│   ├── use-banner-history.ts # Undo/redo history (max 50 entries)
│   ├── use-banner-presets.ts # Banner preset CRUD with compare & duplicate
│   ├── use-preset-editor.ts  # Preset editor state management
│   ├── use-banner-references.ts # Banner reference images CRUD operations
│   ├── use-banner-validation.ts # Character limits, contrast checking, warnings
│   ├── use-projects.ts       # Project CRUD operations
│   └── use-cost-control.ts   # Cost monitoring state & API calls
├── i18n/                     # Internationalization
│   ├── config.ts             # Locale configuration (en, ro)
│   ├── request.ts            # Server-side i18n setup
│   └── routing.ts            # Locale-aware navigation
├── messages/                 # Translation files
│   ├── en.json               # English translations (~2500 keys)
│   └── ro.json               # Romanian translations (~2500 keys)
└── lib/
    ├── gemini.ts             # Gemini API integration
    ├── schema.ts             # Database schema (includes projects table)
    ├── storage.ts            # File storage abstraction
    ├── auth.ts               # Authentication config
    ├── types/
    │   ├── banner.ts         # Banner generator types (BannerBuilderState, BannerTextContent, PLATFORM_PRESETS, etc.)
    │   ├── generation.ts     # Image generation types
    │   ├── project.ts        # Project types (Project, CreateProjectInput, etc.)
    │   └── cost-control.ts   # Cost monitoring types (CostSummary, UserBudget, PricingSettings, etc.)
    ├── pricing.ts            # Cost calculation utilities
    └── data/
        └── banner-templates.ts # 520+ banner presets organized in 15 categories:
                              # bannerTypeTemplates, bannerSizeTemplates, industryTemplates,
                              # designStyleTemplates, colorSchemeTemplates, moodTemplates,
                              # seasonalTemplates, backgroundTemplates, visualEffectsTemplates,
                              # iconGraphicsTemplates, promotionalTemplates, layoutTemplates,
                              # textPlacementTemplates, typographyTemplates, ctaButtonTemplates,
                              # + 46 quickStartTemplates
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `POSTGRES_URL` | Yes | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | 32+ character secret for auth |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `NEXT_PUBLIC_APP_URL` | Yes | Application URL |
| `BLOB_READ_WRITE_TOKEN` | No | Vercel Blob token (uses local storage if not set) |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

The application will automatically use Vercel Blob for storage when `BLOB_READ_WRITE_TOKEN` is configured.

## License

MIT License - see [LICENSE](LICENSE) for details.
