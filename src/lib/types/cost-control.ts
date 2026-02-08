/**
 * Cost Control Types
 * Types for usage tracking, budget management, and cost analytics
 */

// ==========================================
// Usage Metadata from Gemini API
// ==========================================

export interface ModalityTokenCount {
  text?: number | undefined;
  image?: number | undefined;
  audio?: number | undefined;
}

export interface UsageMetadata {
  promptTokensDetails?: ModalityTokenCount | undefined;
  candidatesTokensDetails?: ModalityTokenCount | undefined;
}

export interface GenerationUsage {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
  usageMetadata: UsageMetadata | null;
}

// ==========================================
// Cost Calculation
// ==========================================

export interface PricingSettings {
  inputTokenPriceMicros: number; // Price per 1K input tokens in microdollars
  outputTextPriceMicros: number; // Price per 1K output text tokens in microdollars
  outputImagePriceMicros: number; // Price per 1K output image tokens in microdollars
}

export const DEFAULT_PRICING: PricingSettings = {
  inputTokenPriceMicros: 1250, // $0.00125 per 1K tokens
  outputTextPriceMicros: 5000, // $0.005 per 1K tokens
  outputImagePriceMicros: 40000, // $0.04 per 1K tokens
};

// ==========================================
// Budget Settings
// ==========================================

export interface UserBudget {
  monthlyBudgetMicros: number; // 0 = no limit
  alertThreshold: number; // Percentage (0-100)
  alertEnabled: boolean;
}

export interface BudgetStatus {
  budget: UserBudget;
  currentUsageMicros: number;
  percentUsed: number;
  isOverBudget: boolean;
  isNearLimit: boolean; // >= alertThreshold
  remainingMicros: number;
}

// ==========================================
// Cost Summary & Analytics
// ==========================================

export interface GeneratorBreakdown {
  tokens: number;
  costMicros: number;
  count: number;
}

export interface MonthSummary {
  totalTokens: number;
  totalCostMicros: number;
  generationCount: number;
  byType: {
    photo: GeneratorBreakdown;
    banner: GeneratorBreakdown;
    logo: GeneratorBreakdown;
  };
}

export interface DailyTrendEntry {
  date: string; // ISO date string (YYYY-MM-DD)
  tokens: number;
  costMicros: number;
  count: number;
}

export interface CostSummary {
  currentMonth: MonthSummary;
  previousMonth: {
    totalTokens: number;
    totalCostMicros: number;
    generationCount: number;
  };
  dailyTrend: DailyTrendEntry[];
  budgetStatus: BudgetStatus | null;
}

// ==========================================
// Cost History
// ==========================================

export type GenerationType = "photo" | "banner" | "logo";

export interface CostHistoryEntry {
  id: string;
  createdAt: Date;
  generationType: GenerationType;
  prompt: string;
  promptTokenCount: number | null;
  candidatesTokenCount: number | null;
  totalTokenCount: number | null;
  estimatedCostMicros: number | null;
  status: string;
}

export interface CostHistoryResponse {
  entries: CostHistoryEntry[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

// ==========================================
// API Request/Response Types
// ==========================================

export interface CostHistoryQueryParams {
  page?: number;
  pageSize?: number;
  generationType?: GenerationType;
  startDate?: string;
  endDate?: string;
}

export interface UpdateBudgetRequest {
  monthlyBudgetMicros: number;
  alertThreshold: number;
  alertEnabled: boolean;
}

export interface UpdatePricingRequest {
  inputTokenPriceMicros: number;
  outputTextPriceMicros: number;
  outputImagePriceMicros: number;
}

// ==========================================
// Usage Statistics
// ==========================================

export interface UsageStats {
  totalGenerations: number;
  thisMonthGenerations: number;
  lastMonthGenerations: number;
  generationsByType: Record<GenerationType, number>;
  favoriteType: GenerationType | null;
  averageImagesPerGeneration: number;
  totalImages: number;
}

// ==========================================
// Export CSV Types
// ==========================================

export interface ExportOptions {
  startDate?: string;
  endDate?: string;
  generationType?: GenerationType;
}
