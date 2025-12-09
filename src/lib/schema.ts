import { pgTable, text, timestamp, boolean, index, uuid, jsonb, unique, integer } from "drizzle-orm/pg-core";

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("user_email_idx").on(table.email)]
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("session_user_id_idx").on(table.userId),
    index("session_token_idx").on(table.token),
  ]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    index("account_provider_account_idx").on(table.providerId, table.accountId),
  ]
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// ==========================================
// Nano Banana Pro Tables
// ==========================================

// User API Keys - Encrypted Google GenAI API key storage
export const userApiKeys = pgTable(
  "user_api_keys",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    encryptedKey: text("encrypted_key").notNull(),
    iv: text("iv").notNull(), // Initialization vector for AES-256-GCM
    hint: text("hint").notNull(), // Last 4 characters for display
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("user_api_keys_user_id_idx").on(table.userId)]
);

// Avatars - Reusable reference images for image-to-image generation
export const avatars = pgTable(
  "avatars",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),
    description: text("description"),
    avatarType: text("avatar_type").notNull().default("human"), // "human" | "object" | "logo" | "product" | "reference"
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("avatars_user_id_idx").on(table.userId)]
);

// Presets - Saved prompt configurations
export const presets = pgTable(
  "presets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    config: jsonb("config").notNull(), // Full prompt builder configuration
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("presets_user_id_idx").on(table.userId)]
);

// Projects - User project organization for banner generations
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("projects_user_id_idx").on(table.userId)]
);

// Generations - Parent record for each generation session
export const generations = pgTable(
  "generations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
    prompt: text("prompt").notNull(),
    settings: jsonb("settings").notNull(), // Resolution, aspect ratio, etc.
    status: text("status").notNull().default("pending"), // "pending" | "processing" | "completed" | "failed"
    generationType: text("generation_type").notNull().default("photo"), // "photo" | "banner" | "logo"
    errorMessage: text("error_message"),
    // Cost Control - Token usage tracking
    promptTokenCount: integer("prompt_token_count"),
    candidatesTokenCount: integer("candidates_token_count"),
    totalTokenCount: integer("total_token_count"),
    usageMetadata: jsonb("usage_metadata"), // Detailed token breakdown by modality
    estimatedCostMicros: integer("estimated_cost_micros"), // Cost in microdollars (1/1,000,000 USD)
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("generations_user_id_idx").on(table.userId),
    index("generations_status_idx").on(table.status),
    index("generations_type_idx").on(table.generationType),
    index("generations_project_id_idx").on(table.projectId),
    index("generations_created_at_idx").on(table.createdAt), // For cost control date range queries
  ]
);

// Generated Images - Individual images from a generation
export const generatedImages = pgTable(
  "generated_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    generationId: uuid("generation_id")
      .notNull()
      .references(() => generations.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    isPublic: boolean("is_public").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("generated_images_generation_id_idx").on(table.generationId),
    index("generated_images_is_public_idx").on(table.isPublic),
  ]
);

// Generation History - Multi-turn conversation history for refinements
export const generationHistory = pgTable(
  "generation_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    generationId: uuid("generation_id")
      .notNull()
      .references(() => generations.id, { onDelete: "cascade" }),
    role: text("role").notNull(), // "user" | "assistant"
    content: text("content").notNull(),
    imageUrls: jsonb("image_urls"), // Array of image URLs for this turn
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("generation_history_generation_id_idx").on(table.generationId)]
);

// Image Likes - Track user likes on public images
export const imageLikes = pgTable(
  "image_likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    imageId: uuid("image_id")
      .notNull()
      .references(() => generatedImages.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("image_likes_image_id_idx").on(table.imageId),
    index("image_likes_user_id_idx").on(table.userId),
    // Unique constraint: one like per user per image
    unique("image_likes_unique").on(table.imageId, table.userId),
  ]
);

// User Preferences - User settings including language preference
export const userPreferences = pgTable(
  "user_preferences",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    language: text("language").notNull().default("en"), // "en" | "ro"
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("user_preferences_user_id_idx").on(table.userId)]
);

// Banner References - Reference images for banner generation
export const bannerReferences = pgTable(
  "banner_references",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    imageUrl: text("image_url").notNull(),
    referenceType: text("reference_type").notNull().default("style"), // "style" | "composition" | "color"
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("banner_references_user_id_idx").on(table.userId)]
);

// Banner Presets - Saved banner configuration presets
export const bannerPresets = pgTable(
  "banner_presets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    config: jsonb("config").notNull(), // Full banner builder configuration
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("banner_presets_user_id_idx").on(table.userId)]
);

// ==========================================
// Logo Generator Tables
// ==========================================

// Logo Presets - Saved logo configuration presets
export const logoPresets = pgTable(
  "logo_presets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    config: jsonb("config").notNull(), // Full logo builder configuration (LogoPresetConfig)
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("logo_presets_user_id_idx").on(table.userId)]
);

// Logo References - Reference/inspiration images for logo generation
export const logoReferences = pgTable(
  "logo_references",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    imageUrl: text("image_url").notNull(),
    referenceType: text("reference_type").notNull().default("style"), // "style" | "composition" | "color"
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("logo_references_user_id_idx").on(table.userId)]
);

// ==========================================
// Cost Control Tables
// ==========================================

// User Budgets - Monthly budget limits and alert settings
export const userBudgets = pgTable(
  "user_budgets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    monthlyBudgetMicros: integer("monthly_budget_micros").notNull().default(0), // 0 = no limit, stored in microdollars
    alertThreshold: integer("alert_threshold").notNull().default(80), // Percentage (0-100)
    alertEnabled: boolean("alert_enabled").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("user_budgets_user_id_idx").on(table.userId)]
);

// User Pricing Settings - Configurable token pricing per user
export const userPricingSettings = pgTable(
  "user_pricing_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    // Prices stored in microdollars per 1000 tokens
    inputTokenPriceMicros: integer("input_token_price_micros").notNull().default(1250), // $0.00125 per 1K tokens
    outputTextPriceMicros: integer("output_text_price_micros").notNull().default(5000), // $0.005 per 1K tokens
    outputImagePriceMicros: integer("output_image_price_micros").notNull().default(40000), // $0.04 per 1K tokens
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("user_pricing_settings_user_id_idx").on(table.userId)]
);
