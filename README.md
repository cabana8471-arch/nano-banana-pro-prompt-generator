# Nano Banana Pro

An AI-powered image generator application that uses Google's Gemini 3 Pro Image Preview model to create and refine images based on detailed prompts with optional reference images (avatars) for consistent character generation.

## Features

### Image Generation
- **AI Image Generation**: Generate images using Google Gemini 3 Pro with multi-turn conversation support for refinements
- **Prompt Builder**: Intuitive UI to construct detailed prompts with location, lighting, camera angle, style, and subject options
- **Avatar System**: Upload reference images to maintain consistent characters/objects across generations

### Banner Generator
- **Professional Banner Creation**: Dedicated banner generator for web ads, social media, and marketing materials
- **15 Template Categories**: 385+ presets covering banner types, sizes, industries, design styles, colors, moods, backgrounds, effects, layouts, typography, and CTA buttons
- **Platform Support**: Google Ads (IAB Standard), Facebook, Instagram, Twitter, LinkedIn, and website banners
- **Quick Start Templates**: Pre-configured templates for common scenarios (e-commerce, tech, food, fashion, services, events)
- **Advanced Color Picker**: EyeDropper API integration, predefined palettes, WCAG contrast checker, saved colors
- **History & Undo**: Full undo/redo support with history viewer (up to 50 states)
- **Responsive Preview**: Side-by-side comparison across desktop, mobile, and social platforms
- **Quick Actions**: Duplicate config, randomize settings, swap colors, reset with confirmation

### Social Features
- **Gallery**: Browse and share generated images with the community
- **Like System**: Like and discover popular images from other users

### Infrastructure
- **BYOK (Bring Your Own Key)**: Users provide their own Google AI API key, stored securely with AES-256-GCM encryption
- **Internationalization (i18n)**: Full support for English and Romanian languages with locale-based URL routing (`/en/`, `/ro/`)

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
3. **Choose banner settings**: type, size (IAB standard or social media), industry
4. **Customize design**: style, colors, mood, seasonal theme
5. **Add visual elements**: background, effects, icons, promotional badges
6. **Configure layout**: text placement, typography, CTA button style
7. **Enter text content**: headline, subheadline, CTA text, tagline
8. **Upload brand assets**: logo and product images via avatar system
9. **Preview and generate** your professional banner
10. **Download** in PNG, JPG, or WebP format

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
/en/generate         → Image generation (English)
/ro/generate         → Image generation (Romanian)
/en/banner-generator → Banner generator (English)
/ro/banner-generator → Banner generator (Romanian)
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
│       ├── generate/         # Image generation page
│       ├── banner-generator/ # Banner generation page
│       ├── gallery/          # Gallery pages
│       ├── profile/          # User profile & settings
│       └── avatars/          # Avatar management
├── components/
│   ├── generate/             # Prompt builder and generation UI
│   ├── banner-generator/     # Banner generator components
│   │   ├── banner-builder/   # Builder panel, sections, quick actions
│   │   ├── preview/          # Preview panel, responsive preview
│   │   ├── results/          # Results panel, download options
│   │   └── presets/          # Quick start templates, preset management
│   ├── auth/                 # Authentication components
│   ├── gallery/              # Gallery components
│   ├── avatars/              # Avatar components
│   └── ui/                   # shadcn/ui components
├── hooks/                    # Custom React hooks
│   ├── use-avatars.ts        # Avatar management
│   ├── use-generation.ts     # Image generation logic
│   ├── use-prompt-builder.ts # Prompt builder state
│   ├── use-banner-builder.ts # Banner builder state
│   ├── use-banner-history.ts # Undo/redo history
│   └── use-banner-presets.ts # Banner preset management
├── i18n/                     # Internationalization
│   ├── config.ts             # Locale configuration (en, ro)
│   ├── request.ts            # Server-side i18n setup
│   └── routing.ts            # Locale-aware navigation
├── messages/                 # Translation files
│   ├── en.json               # English translations (~2500 keys)
│   └── ro.json               # Romanian translations (~2500 keys)
└── lib/
    ├── gemini.ts             # Gemini API integration
    ├── schema.ts             # Database schema
    ├── storage.ts            # File storage abstraction
    ├── auth.ts               # Authentication config
    ├── types/
    │   └── banner.ts         # Banner generator types
    └── data/
        └── banner-templates.ts # 385+ banner presets (15 categories)
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
