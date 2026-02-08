import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleApiError, createApiError, ApiError } from "@/lib/api-errors";

describe("handleApiError", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns 503 for database connection errors", () => {
    const error = new Error("ECONNREFUSED");
    const response = handleApiError(error, "test");
    expect(response.status).toBe(503);
  });

  it("returns 503 for connection timeout errors", () => {
    const error = new Error("ETIMEDOUT");
    const response = handleApiError(error, "test");
    expect(response.status).toBe(503);
  });

  it("returns 409 for unique constraint violations", () => {
    const error = new Error("unique constraint violation");
    const response = handleApiError(error, "test");
    expect(response.status).toBe(409);
  });

  it("returns 409 for duplicate key errors", () => {
    const error = new Error("duplicate key value violates unique constraint");
    const response = handleApiError(error, "test");
    expect(response.status).toBe(409);
  });

  it("returns 409 for foreign key violations", () => {
    const error = new Error("foreign key constraint violation");
    const response = handleApiError(error, "test");
    expect(response.status).toBe(409);
  });

  it("returns 507 for storage quota errors", () => {
    const error = new Error("quota exceeded");
    const response = handleApiError(error, "test");
    expect(response.status).toBe(507);
  });

  it("returns 504 for timeout errors", () => {
    const error = new Error("request timeout");
    error.name = "TimeoutError";
    const response = handleApiError(error, "test");
    expect(response.status).toBe(504);
  });

  it("returns 502 for network errors", () => {
    const error = new Error("fetch failed");
    error.name = "FetchError";
    const response = handleApiError(error, "test");
    expect(response.status).toBe(502);
  });

  it("returns 500 for unknown errors", () => {
    const error = new Error("something weird happened");
    const response = handleApiError(error, "test");
    expect(response.status).toBe(500);
  });

  it("handles non-Error objects", () => {
    const response = handleApiError("string error", "test");
    expect(response.status).toBe(500);
  });

  it("logs error details to console", () => {
    const error = new Error("test error");
    handleApiError(error, "testing context");
    expect(console.error).toHaveBeenCalledWith(
      "[API Error] testing context:",
      expect.objectContaining({
        message: "test error",
        type: expect.any(String),
      })
    );
  });

  it("returns JSON body with error message", async () => {
    const response = handleApiError(new Error("test"), "test");
    const body = await response.json();
    expect(body).toHaveProperty("error");
    expect(typeof body.error).toBe("string");
  });
});

describe("createApiError", () => {
  it("creates ApiError with correct properties", () => {
    const error = createApiError(400, "Bad request", "internal details");
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(400);
    expect(error.userMessage).toBe("Bad request");
    expect(error.internalMessage).toBe("internal details");
  });

  it("creates ApiError without internal message", () => {
    const error = createApiError(404, "Not found");
    expect(error.internalMessage).toBeUndefined();
  });

  it("is throwable as Error", () => {
    const error = createApiError(500, "Server error");
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ApiError");
    expect(error.message).toBe("Server error");
  });
});
