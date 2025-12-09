import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generations, userBudgets } from "@/lib/schema";
import type { CostSummary, BudgetStatus, MonthSummary, DailyTrendEntry } from "@/lib/types/cost-control";

/**
 * GET /api/cost-control/summary
 * Get cost summary for the current user
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();

    // Calculate date ranges
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Query current month data grouped by generation type
    const currentMonthByType = await db
      .select({
        generationType: generations.generationType,
        totalTokens: sql<number>`COALESCE(SUM(${generations.totalTokenCount}), 0)::integer`,
        totalCost: sql<number>`COALESCE(SUM(${generations.estimatedCostMicros}), 0)::integer`,
        count: sql<number>`COUNT(*)::integer`,
      })
      .from(generations)
      .where(
        and(
          eq(generations.userId, userId),
          eq(generations.status, "completed"),
          gte(generations.createdAt, startOfCurrentMonth)
        )
      )
      .groupBy(generations.generationType);

    // Build current month summary
    const currentMonth: MonthSummary = {
      totalTokens: 0,
      totalCostMicros: 0,
      generationCount: 0,
      byType: {
        photo: { tokens: 0, costMicros: 0, count: 0 },
        banner: { tokens: 0, costMicros: 0, count: 0 },
        logo: { tokens: 0, costMicros: 0, count: 0 },
      },
    };

    for (const row of currentMonthByType) {
      currentMonth.totalTokens += row.totalTokens;
      currentMonth.totalCostMicros += row.totalCost;
      currentMonth.generationCount += row.count;

      const type = row.generationType as "photo" | "banner" | "logo";
      if (type in currentMonth.byType) {
        currentMonth.byType[type] = {
          tokens: row.totalTokens,
          costMicros: row.totalCost,
          count: row.count,
        };
      }
    }

    // Query previous month totals
    const [previousMonthData] = await db
      .select({
        totalTokens: sql<number>`COALESCE(SUM(${generations.totalTokenCount}), 0)::integer`,
        totalCost: sql<number>`COALESCE(SUM(${generations.estimatedCostMicros}), 0)::integer`,
        count: sql<number>`COUNT(*)::integer`,
      })
      .from(generations)
      .where(
        and(
          eq(generations.userId, userId),
          eq(generations.status, "completed"),
          gte(generations.createdAt, startOfPreviousMonth),
          lte(generations.createdAt, endOfPreviousMonth)
        )
      );

    const previousMonth = {
      totalTokens: previousMonthData?.totalTokens || 0,
      totalCostMicros: previousMonthData?.totalCost || 0,
      generationCount: previousMonthData?.count || 0,
    };

    // Query daily trend for last 30 days
    const dailyTrendRaw = await db
      .select({
        date: sql<string>`DATE(${generations.createdAt})::text`,
        tokens: sql<number>`COALESCE(SUM(${generations.totalTokenCount}), 0)::integer`,
        cost: sql<number>`COALESCE(SUM(${generations.estimatedCostMicros}), 0)::integer`,
        count: sql<number>`COUNT(*)::integer`,
      })
      .from(generations)
      .where(
        and(
          eq(generations.userId, userId),
          eq(generations.status, "completed"),
          gte(generations.createdAt, thirtyDaysAgo)
        )
      )
      .groupBy(sql`DATE(${generations.createdAt})`)
      .orderBy(sql`DATE(${generations.createdAt})`);

    const dailyTrend: DailyTrendEntry[] = dailyTrendRaw.map((row) => ({
      date: row.date,
      tokens: row.tokens,
      costMicros: row.cost,
      count: row.count,
    }));

    // Get budget status
    let budgetStatus: BudgetStatus | null = null;
    const [budget] = await db
      .select()
      .from(userBudgets)
      .where(eq(userBudgets.userId, userId));

    if (budget && budget.monthlyBudgetMicros > 0) {
      const percentUsed = Math.round(
        (currentMonth.totalCostMicros / budget.monthlyBudgetMicros) * 100
      );

      budgetStatus = {
        budget: {
          monthlyBudgetMicros: budget.monthlyBudgetMicros,
          alertThreshold: budget.alertThreshold,
          alertEnabled: budget.alertEnabled,
        },
        currentUsageMicros: currentMonth.totalCostMicros,
        percentUsed,
        isOverBudget: currentMonth.totalCostMicros > budget.monthlyBudgetMicros,
        isNearLimit: percentUsed >= budget.alertThreshold,
        remainingMicros: Math.max(0, budget.monthlyBudgetMicros - currentMonth.totalCostMicros),
      };
    }

    const summary: CostSummary = {
      currentMonth,
      previousMonth,
      dailyTrend,
      budgetStatus,
    };

    return NextResponse.json(summary);
  } catch (error) {
    return handleApiError(error, "fetching cost summary");
  }
}
