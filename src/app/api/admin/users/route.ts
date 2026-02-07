import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import {
  getAllUsers,
  updateUserRole,
  setUserBlocked,
} from "@/lib/authorization";
import { requireAdmin } from "@/lib/require-admin";
import type { UserRole, UserStatus } from "@/lib/types/admin";

/**
 * GET /api/admin/users
 * List users with pagination, search, and filtering (admin only)
 *
 * Query params:
 * - page: number (default: 1)
 * - pageSize: number (default: 20)
 * - search: string (optional, search by name or email)
 * - role: "admin" | "user" | "all" (optional, default: "all")
 * - status: "active" | "blocked" | "all" (optional, default: "all")
 */
export async function GET(request: NextRequest) {
  try {
    const { error, status } = await requireAdmin();
    if (error) {
      return NextResponse.json({ error }, { status: status! });
    }

    const { searchParams } = new URL(request.url);

    // Parse pagination params
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)));

    // Parse filter params
    const search = searchParams.get("search") || undefined;
    const roleParam = searchParams.get("role") || "all";
    const statusParam = searchParams.get("status") || "all";

    // Validate role param
    const validRoles = ["admin", "user", "all"];
    const role = validRoles.includes(roleParam)
      ? (roleParam as UserRole | "all")
      : "all";

    // Validate status param
    const validStatuses = ["active", "blocked", "all"];
    const userStatus = validStatuses.includes(statusParam)
      ? (statusParam as UserStatus | "all")
      : "all";

    const params = {
      page,
      pageSize,
      role,
      status: userStatus,
      ...(search && { search }),
    };

    const result = await getAllUsers(params);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error, "fetching admin users");
  }
}

/**
 * PATCH /api/admin/users
 * Update user role or blocked status (admin only)
 *
 * Body: { userId: string, role?: "admin" | "user", isBlocked?: boolean }
 * - role: Update user role (cannot change admin email users from admin)
 * - isBlocked: Block or unblock user (cannot block admin email users)
 */
export async function PATCH(request: NextRequest) {
  try {
    const { error, status } = await requireAdmin();
    if (error) {
      return NextResponse.json({ error }, { status: status! });
    }

    const body = await request.json();
    const { userId, role, isBlocked } = body;

    // Validate userId
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate that at least one update is provided
    if (role === undefined && isBlocked === undefined) {
      return NextResponse.json(
        { error: "At least one of 'role' or 'isBlocked' is required" },
        { status: 400 }
      );
    }

    // Update role if provided
    if (role !== undefined) {
      const validRoles = ["admin", "user"];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: "Invalid role. Must be 'admin' or 'user'" },
          { status: 400 }
        );
      }

      const roleResult = await updateUserRole(userId, role as UserRole);
      if (!roleResult.success) {
        return NextResponse.json(
          { error: roleResult.error },
          { status: 400 }
        );
      }
    }

    // Update blocked status if provided
    if (isBlocked !== undefined) {
      if (typeof isBlocked !== "boolean") {
        return NextResponse.json(
          { error: "isBlocked must be a boolean" },
          { status: 400 }
        );
      }

      const blockedResult = await setUserBlocked(userId, isBlocked);
      if (!blockedResult.success) {
        return NextResponse.json(
          { error: blockedResult.error },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "updating user");
  }
}
