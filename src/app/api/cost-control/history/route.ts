import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generations } from "@/lib/schema";
import type { CostHistoryResponse, CostHistoryEntry, GenerationType } from "@/lib/types/cost-control";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

/**
 * GET /api/cost-control/history
 * Get paginated cost history for the current user
 */
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, parseInt(searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE), 10))
    );
    const generationType = searchParams.get("type") as GenerationType | null;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build where conditions
    const conditions = [
      eq(generations.userId, userId),
      eq(generations.status, "completed"),
    ];

    if (generationType && ["photo", "banner", "logo"].includes(generationType)) {
      conditions.push(eq(generations.generationType, generationType));
    }

    if (startDate) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) {
        conditions.push(gte(generations.createdAt, start));
      }
    }

    if (endDate) {
      const end = new Date(endDate);
      if (!isNaN(end.getTime())) {
        // Set to end of day
        end.setHours(23, 59, 59, 999);
        conditions.push(lte(generations.createdAt, end));
      }
    }

    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`COUNT(*)::integer` })
      .from(generations)
      .where(and(...conditions));

    const totalCount = countResult?.count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);
    const offset = (page - 1) * pageSize;

    // Fetch paginated data
    const historyData = await db
      .select({
        id: generations.id,
        createdAt: generations.createdAt,
        generationType: generations.generationType,
        prompt: generations.prompt,
        promptTokenCount: generations.promptTokenCount,
        candidatesTokenCount: generations.candidatesTokenCount,
        totalTokenCount: generations.totalTokenCount,
        estimatedCostMicros: generations.estimatedCostMicros,
        status: generations.status,
      })
      .from(generations)
      .where(and(...conditions))
      .orderBy(desc(generations.createdAt))
      .limit(pageSize)
      .offset(offset);

    const entries: CostHistoryEntry[] = historyData.map((row) => ({
      id: row.id,
      createdAt: row.createdAt,
      generationType: row.generationType as GenerationType,
      prompt: row.prompt.length > 100 ? row.prompt.slice(0, 100) + "..." : row.prompt,
      promptTokenCount: row.promptTokenCount,
      candidatesTokenCount: row.candidatesTokenCount,
      totalTokenCount: row.totalTokenCount,
      estimatedCostMicros: row.estimatedCostMicros,
      status: row.status,
    }));

    const response: CostHistoryResponse = {
      entries,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return handleApiError(error, "fetching cost history");
  }
}
