"use client";

import { DollarSign, TrendingUp, TrendingDown, Zap, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCost, formatTokens, calculatePercentageChange } from "@/lib/pricing";
import type { CostSummary } from "@/lib/types/cost-control";

interface CostOverviewCardsProps {
  summary: CostSummary;
  translations: {
    currentMonth: string;
    previousMonth: string;
    totalCost: string;
    totalTokens: string;
    generations: string;
    vsLastMonth: string;
    increase: string;
    decrease: string;
    budget: string;
    remaining: string;
    exceeded: string;
    nearLimit: string;
    noBudget: string;
  };
}

export function CostOverviewCards({ summary, translations: t }: CostOverviewCardsProps) {
  const percentChange = calculatePercentageChange(
    summary.currentMonth.totalCostMicros,
    summary.previousMonth.totalCostMicros
  );

  const isIncrease = percentChange > 0;
  const TrendIcon = isIncrease ? TrendingUp : TrendingDown;
  const trendColor = isIncrease ? "text-red-500" : "text-green-500";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Current Month Cost */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t.currentMonth}</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCost(summary.currentMonth.totalCostMicros)}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <TrendIcon className={`h-3 w-3 ${trendColor}`} />
            <span className={`text-xs ${trendColor}`}>
              {Math.abs(percentChange)}% {isIncrease ? t.increase : t.decrease}
            </span>
            <span className="text-xs text-muted-foreground">{t.vsLastMonth}</span>
          </div>
        </CardContent>
      </Card>

      {/* Token Usage */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t.totalTokens}</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatTokens(summary.currentMonth.totalTokens)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.currentMonth.generationCount} {t.generations}
          </p>
        </CardContent>
      </Card>

      {/* Budget Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t.budget}</CardTitle>
          <Hash className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {summary.budgetStatus ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">
                  {summary.budgetStatus.percentUsed}%
                </span>
                {summary.budgetStatus.isOverBudget ? (
                  <Badge variant="destructive">{t.exceeded}</Badge>
                ) : summary.budgetStatus.isNearLimit ? (
                  <Badge variant="secondary">{t.nearLimit}</Badge>
                ) : null}
              </div>
              <Progress value={Math.min(100, summary.budgetStatus.percentUsed)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {formatCost(summary.budgetStatus.remainingMicros)} {t.remaining}
              </p>
            </>
          ) : (
            <div className="text-muted-foreground text-sm">{t.noBudget}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
