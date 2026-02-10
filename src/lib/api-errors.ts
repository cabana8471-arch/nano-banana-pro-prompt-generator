/**
 * API Error Handling Utilities
 *
 * Provides centralized error handling for API routes with:
 * - Specific error types and HTTP status codes
 * - User-friendly error messages
 * - Detailed server-side logging
 */

import { NextResponse } from "next/server";

/**
 * Custom API error class for typed error handling
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public userMessage: string,
    public internalMessage?: string
  ) {
    super(userMessage);
    this.name = "ApiError";
  }
}

/**
 * Error types and their HTTP status codes
 */
export const ErrorTypes = {
  // Database errors
  DATABASE_CONNECTION: { status: 503, message: "Service temporarily unavailable. Please try again." },
  DATABASE_QUERY: { status: 500, message: "A database error occurred. Please try again." },
  DATABASE_CONSTRAINT: { status: 409, message: "This operation conflicts with existing data." },

  // Storage errors
  STORAGE_UPLOAD: { status: 500, message: "Failed to upload file. Please try again." },
  STORAGE_DELETE: { status: 500, message: "Failed to delete file. Please try again." },
  STORAGE_QUOTA: { status: 507, message: "Storage quota exceeded." },

  // External service errors
  EXTERNAL_SERVICE: { status: 502, message: "External service error. Please try again later." },
  EXTERNAL_TIMEOUT: { status: 504, message: "Request timed out. Please try again." },

  // Generic fallback
  INTERNAL: { status: 500, message: "An unexpected error occurred. Please try again." },
} as const;

/**
 * Known database error codes and their patterns
 */
const DATABASE_ERROR_PATTERNS = {
  // PostgreSQL error codes
  CONNECTION_REFUSED: /ECONNREFUSED|connection refused/i,
  CONNECTION_TIMEOUT: /ETIMEDOUT|connection timed out/i,
  UNIQUE_VIOLATION: /unique constraint|duplicate key|23505/i,
  FOREIGN_KEY_VIOLATION: /foreign key constraint|23503/i,
  NOT_NULL_VIOLATION: /not-null constraint|23502/i,
  CHECK_VIOLATION: /check constraint|23514/i,
  TOO_MANY_CONNECTIONS: /too many connections|53300/i,
};

/**
 * Storage error patterns
 */
const STORAGE_ERROR_PATTERNS = {
  QUOTA_EXCEEDED: /quota exceeded|storage limit/i,
  UPLOAD_FAILED: /upload failed|failed to upload/i,
  FILE_NOT_FOUND: /file not found|blob not found/i,
};

/**
 * Detect the type of error and return appropriate error info
 */
function detectErrorType(error: unknown): { status: number; message: string; type: string } {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorName = error instanceof Error ? error.name : "";

  // Check for database errors
  if (DATABASE_ERROR_PATTERNS.CONNECTION_REFUSED.test(errorMessage) ||
      DATABASE_ERROR_PATTERNS.CONNECTION_TIMEOUT.test(errorMessage)) {
    return { ...ErrorTypes.DATABASE_CONNECTION, type: "DATABASE_CONNECTION" };
  }

  if (DATABASE_ERROR_PATTERNS.TOO_MANY_CONNECTIONS.test(errorMessage)) {
    return { ...ErrorTypes.DATABASE_CONNECTION, type: "DATABASE_TOO_MANY_CONNECTIONS" };
  }

  if (DATABASE_ERROR_PATTERNS.UNIQUE_VIOLATION.test(errorMessage)) {
    return { ...ErrorTypes.DATABASE_CONSTRAINT, type: "DATABASE_UNIQUE_VIOLATION" };
  }

  if (DATABASE_ERROR_PATTERNS.FOREIGN_KEY_VIOLATION.test(errorMessage) ||
      DATABASE_ERROR_PATTERNS.NOT_NULL_VIOLATION.test(errorMessage) ||
      DATABASE_ERROR_PATTERNS.CHECK_VIOLATION.test(errorMessage)) {
    return { ...ErrorTypes.DATABASE_CONSTRAINT, type: "DATABASE_CONSTRAINT" };
  }

  // Check for storage errors
  if (STORAGE_ERROR_PATTERNS.QUOTA_EXCEEDED.test(errorMessage)) {
    return { ...ErrorTypes.STORAGE_QUOTA, type: "STORAGE_QUOTA" };
  }

  if (STORAGE_ERROR_PATTERNS.UPLOAD_FAILED.test(errorMessage)) {
    return { ...ErrorTypes.STORAGE_UPLOAD, type: "STORAGE_UPLOAD" };
  }

  // Check for timeout errors
  if (errorName === "TimeoutError" || /timeout|ETIMEDOUT/i.test(errorMessage)) {
    return { ...ErrorTypes.EXTERNAL_TIMEOUT, type: "TIMEOUT" };
  }

  // Check for fetch/network errors
  if (errorName === "FetchError" || /fetch failed|network error/i.test(errorMessage)) {
    return { ...ErrorTypes.EXTERNAL_SERVICE, type: "NETWORK" };
  }

  // Default to internal error
  return { ...ErrorTypes.INTERNAL, type: "INTERNAL" };
}

/**
 * Handle an API error and return appropriate NextResponse
 *
 * @param error - The caught error
 * @param context - Description of the operation (e.g., "fetching avatars", "creating preset")
 * @returns NextResponse with appropriate status and error message
 */
export function handleApiError(
  error: unknown,
  context: string
): NextResponse {
  // Detect error type
  const errorInfo = detectErrorType(error);

  // Log detailed error info server-side
  console.error(`[API Error] ${context}:`, {
    type: errorInfo.type,
    message: error instanceof Error ? error.message : String(error),
    cause: error instanceof Error && error.cause ? String(error.cause) : undefined,
    causeMessage: error instanceof Error && error.cause instanceof Error ? error.cause.message : undefined,
    stack: error instanceof Error ? error.stack : undefined,
  });

  // Return user-friendly response with debug info
  const debugMessage = error instanceof Error ? error.message : String(error);
  const causeMessage = error instanceof Error && error.cause instanceof Error ? error.cause.message : undefined;
  return NextResponse.json(
    { error: errorInfo.message, debug: debugMessage, cause: causeMessage },
    { status: errorInfo.status }
  );
}

/**
 * Create a custom API error that can be thrown and caught
 *
 * @param statusCode - HTTP status code
 * @param userMessage - Message to show to the user
 * @param internalMessage - Optional detailed message for logging
 */
export function createApiError(
  statusCode: number,
  userMessage: string,
  internalMessage?: string
): ApiError {
  return new ApiError(statusCode, userMessage, internalMessage);
}
