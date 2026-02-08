/**
 * Mock Better Auth for testing
 */
import { vi } from "vitest";
import { createMockSession } from "../factories";

const defaultSession = createMockSession();

export const mockGetSession = vi.fn().mockResolvedValue(defaultSession);

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

/**
 * Set the mock session for the next auth check
 */
export function setMockSession(session: ReturnType<typeof createMockSession> | null) {
  mockGetSession.mockResolvedValue(session);
}

/**
 * Reset auth mocks to default authenticated state
 */
export function resetMockAuth() {
  const newSession = createMockSession();
  mockGetSession.mockResolvedValue(newSession);
  return newSession;
}
