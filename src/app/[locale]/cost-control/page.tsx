"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Loader2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  CostOverviewCards,
  GeneratorBreakdown,
  DailyTrendChart,
  CostHistoryTable,
  BudgetSettingsDialog,
} from "@/components/cost-control";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useCostControl } from "@/hooks/use-cost-control";

export default function CostControlPage() {
  const t = useTranslations("costControl");

  const {
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
    loadSummary,
    loadHistory,
    loadBudget,
    loadPricing,
    updateBudget,
    updatePricing,
    exportCSV,
    checkMigrationStatus,
    runMigration,
  } = useCostControl();

  // Load data on mount
  useEffect(() => {
    loadSummary();
    loadHistory();
    loadBudget();
    loadPricing();
    checkMigrationStatus();
  }, [loadSummary, loadHistory, loadBudget, loadPricing, checkMigrationStatus]);

  const handleMigration = async () => {
    const success = await runMigration();
    if (success) {
      // Reload data after migration
      loadSummary();
      loadHistory();
    }
  };

  const isLoading = isLoadingSummary || isLoadingBudget || isLoadingPricing;

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportCSV()}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {t("export.button")}
          </Button>
          <BudgetSettingsDialog
            budget={budget}
            pricing={pricing}
            isLoading={isLoading}
            onSaveBudget={updateBudget}
            onSavePricing={updatePricing}
            translations={{
              title: t("settings.title"),
              description: t("settings.description"),
              budgetTab: t("settings.budgetTab"),
              pricingTab: t("settings.pricingTab"),
              monthlyBudget: t("settings.monthlyBudget"),
              monthlyBudgetDesc: t("settings.monthlyBudgetDesc"),
              alertThreshold: t("settings.alertThreshold"),
              alertThresholdDesc: t("settings.alertThresholdDesc"),
              enableAlerts: t("settings.enableAlerts"),
              enableAlertsDesc: t("settings.enableAlertsDesc"),
              inputTokenPrice: t("settings.inputTokenPrice"),
              outputTextPrice: t("settings.outputTextPrice"),
              outputImagePrice: t("settings.outputImagePrice"),
              per1kTokens: t("settings.per1kTokens"),
              resetToDefaults: t("settings.resetToDefaults"),
              save: t("settings.save"),
              saving: t("settings.saving"),
              cancel: t("settings.cancel"),
              noLimit: t("settings.noLimit"),
            }}
          />
        </div>
      </div>

      {/* Migration Banner */}
      {migrationStatus?.needsMigration && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("migration.title")}</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              {t("migration.description", { count: migrationStatus.pendingMigrations })}
            </span>
            <Button
              size="sm"
              onClick={handleMigration}
              disabled={isMigrating}
            >
              {isMigrating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("migration.running")}
                </>
              ) : (
                t("migration.button")
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Content */}
      {isLoadingSummary ? (
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : summary ? (
        <div className="space-y-6">
          {/* Overview Cards */}
          <CostOverviewCards
            summary={summary}
            translations={{
              currentMonth: t("currentMonth"),
              previousMonth: t("previousMonth"),
              totalCost: t("totalCost"),
              totalTokens: t("totalTokens"),
              generations: t("generations"),
              vsLastMonth: t("vsLastMonth"),
              increase: t("increase"),
              decrease: t("decrease"),
              budget: t("budget.title"),
              remaining: t("budget.remaining"),
              exceeded: t("budget.exceeded"),
              nearLimit: t("budget.nearLimit"),
              noBudget: t("budget.noBudget"),
            }}
          />

          {/* Generator Breakdown */}
          <GeneratorBreakdown
            summary={summary.currentMonth}
            translations={{
              title: t("breakdown.title"),
              description: t("breakdown.description"),
              photo: t("breakdown.photo"),
              banner: t("breakdown.banner"),
              logo: t("breakdown.logo"),
              tokens: t("breakdown.tokens"),
              cost: t("breakdown.cost"),
              count: t("breakdown.count"),
              noData: t("noData"),
            }}
          />

          {/* Daily Trend */}
          <DailyTrendChart
            data={summary.dailyTrend}
            translations={{
              title: t("trend.title"),
              description: t("trend.description"),
              cost: t("trend.cost"),
              date: t("trend.date"),
              noData: t("noData"),
            }}
          />

          {/* History Table */}
          <CostHistoryTable
            history={history}
            isLoading={isLoadingHistory}
            onLoadHistory={loadHistory}
            translations={{
              title: t("history.title"),
              description: t("history.description"),
              date: t("history.date"),
              type: t("history.type"),
              prompt: t("history.prompt"),
              tokens: t("history.tokens"),
              cost: t("history.cost"),
              noData: t("noData"),
              previous: t("history.previous"),
              next: t("history.next"),
              page: t("history.page"),
              of: t("history.of"),
              all: t("history.all"),
              photo: t("breakdown.photo"),
              banner: t("breakdown.banner"),
              logo: t("breakdown.logo"),
              filterByType: t("history.filterByType"),
            }}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-[400px] text-muted-foreground">
          {t("noData")}
        </div>
      )}
    </div>
  );
}
