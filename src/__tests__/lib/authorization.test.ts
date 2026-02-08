import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAdminEmails, isAdminEmail } from "@/lib/authorization";
import { getServerEnv } from "@/lib/env";

// vi.mock calls are hoisted by vitest automatically
vi.mock("@/lib/env", () => ({
  getServerEnv: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {},
}));

const mockGetServerEnv = vi.mocked(getServerEnv);

describe("getAdminEmails", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns empty array when ADMIN_EMAILS is undefined", () => {
    mockGetServerEnv.mockReturnValue({
      ADMIN_EMAILS: undefined,
    } as ReturnType<typeof getServerEnv>);
    expect(getAdminEmails()).toEqual([]);
  });

  it("returns empty array when ADMIN_EMAILS is empty string", () => {
    mockGetServerEnv.mockReturnValue({
      ADMIN_EMAILS: "",
    } as ReturnType<typeof getServerEnv>);
    expect(getAdminEmails()).toEqual([]);
  });

  it("parses single admin email", () => {
    mockGetServerEnv.mockReturnValue({
      ADMIN_EMAILS: "admin@example.com",
    } as ReturnType<typeof getServerEnv>);
    expect(getAdminEmails()).toEqual(["admin@example.com"]);
  });

  it("parses multiple admin emails", () => {
    mockGetServerEnv.mockReturnValue({
      ADMIN_EMAILS: "admin@example.com,super@example.com",
    } as ReturnType<typeof getServerEnv>);
    expect(getAdminEmails()).toEqual(["admin@example.com", "super@example.com"]);
  });

  it("trims whitespace from emails", () => {
    mockGetServerEnv.mockReturnValue({
      ADMIN_EMAILS: " admin@example.com , super@example.com ",
    } as ReturnType<typeof getServerEnv>);
    expect(getAdminEmails()).toEqual(["admin@example.com", "super@example.com"]);
  });

  it("normalizes emails to lowercase", () => {
    mockGetServerEnv.mockReturnValue({
      ADMIN_EMAILS: "Admin@Example.COM",
    } as ReturnType<typeof getServerEnv>);
    expect(getAdminEmails()).toEqual(["admin@example.com"]);
  });

  it("returns empty array when getServerEnv throws", () => {
    mockGetServerEnv.mockImplementation(() => {
      throw new Error("Missing env");
    });
    expect(getAdminEmails()).toEqual([]);
  });
});

describe("isAdminEmail", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockGetServerEnv.mockReturnValue({
      ADMIN_EMAILS: "admin@example.com,super@test.com",
    } as ReturnType<typeof getServerEnv>);
  });

  it("returns true for admin email", () => {
    expect(isAdminEmail("admin@example.com")).toBe(true);
  });

  it("returns true for admin email regardless of case", () => {
    expect(isAdminEmail("ADMIN@EXAMPLE.COM")).toBe(true);
    expect(isAdminEmail("Admin@Example.Com")).toBe(true);
  });

  it("returns false for non-admin email", () => {
    expect(isAdminEmail("user@example.com")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isAdminEmail("")).toBe(false);
  });

  it("returns false for partial match", () => {
    expect(isAdminEmail("admin@example")).toBe(false);
    expect(isAdminEmail("admin@example.com.evil.com")).toBe(false);
  });

  it("returns true for second admin email", () => {
    expect(isAdminEmail("super@test.com")).toBe(true);
  });

  it("returns false when no admin emails configured", () => {
    mockGetServerEnv.mockReturnValue({
      ADMIN_EMAILS: undefined,
    } as ReturnType<typeof getServerEnv>);
    expect(isAdminEmail("admin@example.com")).toBe(false);
  });
});
