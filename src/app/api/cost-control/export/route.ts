import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCost } from "@/lib/pricing";
import { generations } from "@/lib/schema";
import type { GenerationType } from "@/lib/types/cost-control";

/**
 * GET /api/cost-control/export
 * Export cost history as CSV
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
        end.setHours(23, 59, 59, 999);
        conditions.push(lte(generations.createdAt, end));
      }
    }

    // Fetch all data (no pagination for export)
    const data = await db
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
      .orderBy(desc(generations.createdAt));

    // Generate CSV content
    const csvHeaders = [
      "ID",
      "Date",
      "Type",
      "Prompt",
      "Input Tokens",
      "Output Tokens",
      "Total Tokens",
      "Estimated Cost (USD)",
      "Status",
    ];

    const csvRows = data.map((row) => [
      row.id,
      row.createdAt.toISOString(),
      row.generationType,
      // Escape quotes and commas in prompt
      `"${(row.prompt || "").replace(/"/g, '""')}"`,
      row.promptTokenCount?.toString() || "N/A",
      row.candidatesTokenCount?.toString() || "N/A",
      row.totalTokenCount?.toString() || "N/A",
      row.estimatedCostMicros ? formatCost(row.estimatedCostMicros) : "N/A",
      row.status,
    ]);

    const csv = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.join(",")),
    ].join("\n");

    // Generate filename with date range
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const filename = `cost-report-${dateStr}.csv`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return handleApiError(error, "exporting cost data");
  }
}
