import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userBudgets } from "@/lib/schema";
import type { UserBudget } from "@/lib/types/cost-control";

// Validation schema for budget updates
const updateBudgetSchema = z.object({
  monthlyBudgetMicros: z.number().min(0).max(1_000_000_000_000), // Max $1,000,000
  alertThreshold: z.number().min(0).max(100),
  alertEnabled: z.boolean(),
});

/**
 * GET /api/cost-control/budget
 * Get budget settings for the current user
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [budget] = await db
      .select()
      .from(userBudgets)
      .where(eq(userBudgets.userId, session.user.id));

    if (!budget) {
      // Return default budget settings
      const defaultBudget: UserBudget = {
        monthlyBudgetMicros: 0,
        alertThreshold: 80,
        alertEnabled: true,
      };
      return NextResponse.json(defaultBudget);
    }

    const userBudget: UserBudget = {
      monthlyBudgetMicros: budget.monthlyBudgetMicros,
      alertThreshold: budget.alertThreshold,
      alertEnabled: budget.alertEnabled,
    };

    return NextResponse.json(userBudget);
  } catch (error) {
    return handleApiError(error, "fetching budget settings");
  }
}

/**
 * PUT /api/cost-control/budget
 * Update budget settings for the current user
 */
export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = updateBudgetSchema.safeParse(body);

    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || "Invalid request data" },
        { status: 400 }
      );
    }

    const { monthlyBudgetMicros, alertThreshold, alertEnabled } = parseResult.data;

    // Upsert the budget settings
    const [existingBudget] = await db
      .select()
      .from(userBudgets)
      .where(eq(userBudgets.userId, session.user.id));

    let updatedBudget;
    if (existingBudget) {
      [updatedBudget] = await db
        .update(userBudgets)
        .set({
          monthlyBudgetMicros,
          alertThreshold,
          alertEnabled,
        })
        .where(eq(userBudgets.userId, session.user.id))
        .returning();
    } else {
      [updatedBudget] = await db
        .insert(userBudgets)
        .values({
          userId: session.user.id,
          monthlyBudgetMicros,
          alertThreshold,
          alertEnabled,
        })
        .returning();
    }

    const userBudget: UserBudget = {
      monthlyBudgetMicros: updatedBudget!.monthlyBudgetMicros,
      alertThreshold: updatedBudget!.alertThreshold,
      alertEnabled: updatedBudget!.alertEnabled,
    };

    return NextResponse.json(userBudget);
  } catch (error) {
    return handleApiError(error, "updating budget settings");
  }
}
