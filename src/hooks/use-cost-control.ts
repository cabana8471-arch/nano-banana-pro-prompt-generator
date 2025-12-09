"use client";

import { useState, useCallback } from "react";
import type {
  CostSummary,
  CostHistoryResponse,
  UserBudget,
  PricingSettings,
  CostHistoryQueryParams,
  GenerationType,
} from "@/lib/types/cost-control";

interface MigrationStatus {
  pendingMigrations: number;
  needsMigration: boolean;
}

interface UseCostControlReturn {
  // Data
  summary: CostSummary | null;
  history: CostHistoryResponse | null;
  budget: UserBudget | null;
  pricing: PricingSettings | null;
  migrationStatus: MigrationStatus | null;

  // Loading states
  isLoadingSummary: boolean;
  isLoadingHistory: boolean;
  isLoadingBudget: boolean;
  isLoadingPricing: boolean;
  isExporting: boolean;
  isMigrating: boolean;

  // Error states
  summaryError: string | null;
  historyError: string | null;
  budgetError: string | null;
  pricingError: string | null;

  // Actions
  loadSummary: () => Promise<void>;
  loadHistory: (params?: CostHistoryQueryParams) => Promise<void>;
  loadBudget: () => Promise<void>;
  loadPricing: () => Promise<void>;
  updateBudget: (budget: UserBudget) => Promise<boolean>;
  updatePricing: (pricing: PricingSettings) => Promise<boolean>;
  exportCSV: (filters?: { type?: GenerationType; startDate?: string; endDate?: string }) => Promise<void>;
  checkMigrationStatus: () => Promise<void>;
  runMigration: () => Promise<boolean>;
}

export function useCostControl(): UseCostControlReturn {
  // Data state
  const [summary, setSummary] = useState<CostSummary | null>(null);
  const [history, setHistory] = useState<CostHistoryResponse | null>(null);
  const [budget, setBudget] = useState<UserBudget | null>(null);
  const [pricing, setPricing] = useState<PricingSettings | null>(null);
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus | null>(null);

  // Loading state
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingBudget, setIsLoadingBudget] = useState(false);
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

  // Error state
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [budgetError, setBudgetError] = useState<string | null>(null);
  const [pricingError, setPricingError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    setIsLoadingSummary(true);
    setSummaryError(null);

    try {
      const response = await fetch("/api/cost-control/summary");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to load summary");
      }
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      setSummaryError(error instanceof Error ? error.message : "Failed to load summary");
    } finally {
      setIsLoadingSummary(false);
    }
  }, []);

  const loadHistory = useCallback(async (params?: CostHistoryQueryParams) => {
    setIsLoadingHistory(true);
    setHistoryError(null);

    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", params.page.toString());
      if (params?.pageSize) searchParams.set("pageSize", params.pageSize.toString());
      if (params?.generationType) searchParams.set("type", params.generationType);
      if (params?.startDate) searchParams.set("startDate", params.startDate);
      if (params?.endDate) searchParams.set("endDate", params.endDate);

      const url = `/api/cost-control/history${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const response = await fetch(url);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to load history");
      }
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      setHistoryError(error instanceof Error ? error.message : "Failed to load history");
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const loadBudget = useCallback(async () => {
    setIsLoadingBudget(true);
    setBudgetError(null);

    try {
      const response = await fetch("/api/cost-control/budget");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to load budget");
      }
      const data = await response.json();
      setBudget(data);
    } catch (error) {
      setBudgetError(error instanceof Error ? error.message : "Failed to load budget");
    } finally {
      setIsLoadingBudget(false);
    }
  }, []);

  const loadPricing = useCallback(async () => {
    setIsLoadingPricing(true);
    setPricingError(null);

    try {
      const response = await fetch("/api/cost-control/pricing");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to load pricing");
      }
      const data = await response.json();
      setPricing(data);
    } catch (error) {
      setPricingError(error instanceof Error ? error.message : "Failed to load pricing");
    } finally {
      setIsLoadingPricing(false);
    }
  }, []);

  const updateBudget = useCallback(async (newBudget: UserBudget): Promise<boolean> => {
    setIsLoadingBudget(true);
    setBudgetError(null);

    try {
      const response = await fetch("/api/cost-control/budget", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBudget),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update budget");
      }

      const data = await response.json();
      setBudget(data);
      return true;
    } catch (error) {
      setBudgetError(error instanceof Error ? error.message : "Failed to update budget");
      return false;
    } finally {
      setIsLoadingBudget(false);
    }
  }, []);

  const updatePricing = useCallback(async (newPricing: PricingSettings): Promise<boolean> => {
    setIsLoadingPricing(true);
    setPricingError(null);

    try {
      const response = await fetch("/api/cost-control/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPricing),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update pricing");
      }

      const data = await response.json();
      setPricing(data);
      return true;
    } catch (error) {
      setPricingError(error instanceof Error ? error.message : "Failed to update pricing");
      return false;
    } finally {
      setIsLoadingPricing(false);
    }
  }, []);

  const exportCSV = useCallback(async (filters?: { type?: GenerationType; startDate?: string; endDate?: string }) => {
    setIsExporting(true);

    try {
      const searchParams = new URLSearchParams();
      if (filters?.type) searchParams.set("type", filters.type);
      if (filters?.startDate) searchParams.set("startDate", filters.startDate);
      if (filters?.endDate) searchParams.set("endDate", filters.endDate);

      const url = `/api/cost-control/export${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      // Get the filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "cost-report.csv";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match?.[1]) filename = match[1];
      }

      // Download the file
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  const checkMigrationStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/cost-control/migrate");
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setMigrationStatus(data);
    } catch (error) {
      console.error("Failed to check migration status:", error);
    }
  }, []);

  const runMigration = useCallback(async (): Promise<boolean> => {
    setIsMigrating(true);

    try {
      const response = await fetch("/api/cost-control/migrate", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Migration failed");
      }

      // Refresh migration status after successful migration
      await checkMigrationStatus();
      return true;
    } catch (error) {
      console.error("Migration failed:", error);
      return false;
    } finally {
      setIsMigrating(false);
    }
  }, [checkMigrationStatus]);

  return {
    summary,
    history,
    budget,
    pricing,
    migrationStatus,
    isLoadingSummary,
    isLoadingHistory,
    isLoadingBudget,
    isLoadingPricing,
    isExporting,
    isMigrating,
    summaryError,
    historyError,
    budgetError,
    pricingError,
    loadSummary,
    loadHistory,
    loadBudget,
    loadPricing,
    updateBudget,
    updatePricing,
    exportCSV,
    checkMigrationStatus,
    runMigration,
  };
}
