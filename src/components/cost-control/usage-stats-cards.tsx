"use client";

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ImageIcon,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UsageStats } from "@/lib/types/cost-control";

interface UsageStatsCardsProps {
  stats: UsageStats;
  translations: {
    title: string;
    totalGenerations: string;
    thisMonth: string;
    lastMonth: string;
    byType: string;
    averageImages: string;
    totalImages: string;
    favoriteType: string;
    monthOverMonth: string;
    noData: string;
    photo: string;
    banner: string;
    logo: string;
  };
}

/** Type-safe label map for generation types */
const TYPE_COLORS: Record<string, string> = {
  photo: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  banner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  logo: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
};

export function UsageStatsCards({ stats, translations: t }: UsageStatsCardsProps) {
  const typeLabels: Record<string, string> = {
    photo: t.photo,
    banner: t.banner,
    logo: t.logo,
  };

  // Calculate month-over-month change for generation count
  const monthChange =
    stats.lastMonthGenerations === 0
      ? stats.thisMonthGenerations > 0
        ? 100
        : 0
      : Math.round(
          ((stats.thisMonthGenerations - stats.lastMonthGenerations) /
            stats.lastMonthGenerations) *
            100
        );

  const isIncrease = monthChange > 0;
  const isDecrease = monthChange < 0;
  const TrendIcon = isIncrease ? TrendingUp : TrendingDown;
  const trendColor = isIncrease ? "text-green-500" : isDecrease ? "text-red-500" : "text-muted-foreground";

  // Find the max type count for proportional bar rendering
  const maxTypeCount = Math.max(
    ...Object.values(stats.generationsByType),
    1 // Avoid division by zero
  );

  if (stats.totalGenerations === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[120px] text-muted-foreground">
            {t.noData}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Generations */}
          <div className="space-y-1 p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t.totalGenerations}</span>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{stats.totalGenerations}</div>
            {stats.favoriteType && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">{t.favoriteType}:</span>
                <Badge variant="secondary" className="text-xs">
                  {typeLabels[stats.favoriteType] ?? stats.favoriteType}
                </Badge>
              </div>
            )}
          </div>

          {/* This Month with MoM Change */}
          <div className="space-y-1 p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t.thisMonth}</span>
              {monthChange !== 0 && (
                <TrendIcon className={`h-4 w-4 ${trendColor}`} />
              )}
            </div>
            <div className="text-2xl font-bold">{stats.thisMonthGenerations}</div>
            <div className="flex items-center gap-1">
              {monthChange !== 0 ? (
                <span className={`text-xs ${trendColor}`}>
                  {t.monthOverMonth.replace("{change}", String(Math.abs(monthChange)))}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  {t.lastMonth}: {stats.lastMonthGenerations}
                </span>
              )}
            </div>
          </div>

          {/* Average Images per Generation */}
          <div className="space-y-1 p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t.averageImages}</span>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{stats.averageImagesPerGeneration}</div>
            <div className="text-xs text-muted-foreground">
              {t.totalImages}: {stats.totalImages}
            </div>
          </div>

          {/* By Type Breakdown with mini bars */}
          <div className="space-y-1 p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t.byType}</span>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-2 pt-1">
              {(["photo", "banner", "logo"] as const).map((type) => {
                const count = stats.generationsByType[type];
                const widthPercent = (count / maxTypeCount) * 100;
                return (
                  <div key={type} className="space-y-0.5">
                    <div className="flex items-center justify-between text-xs">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 ${TYPE_COLORS[type]}`}
                      >
                        {typeLabels[type]}
                      </Badge>
                      <span className="font-medium">{count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${widthPercent}%`,
                          backgroundColor:
                            type === "photo"
                              ? "#3b82f6"
                              : type === "banner"
                                ? "#10b981"
                                : "#f59e0b",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
