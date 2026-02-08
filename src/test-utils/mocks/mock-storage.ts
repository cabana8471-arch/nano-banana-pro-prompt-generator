/**
 * Mock Storage abstraction for testing
 */
import { vi } from "vitest";

export const mockStorage = {
  uploadFile: vi.fn().mockResolvedValue("/uploads/mock-file.png"),
  deleteFile: vi.fn().mockResolvedValue(undefined),
  getFileUrl: vi.fn().mockImplementation((path: string) => path),
};

vi.mock("@/lib/storage", () => ({
  uploadFile: (...args: unknown[]) => mockStorage.uploadFile(...args),
  deleteFile: (...args: unknown[]) => mockStorage.deleteFile(...args),
  getFileUrl: (...args: unknown[]) => mockStorage.getFileUrl(...args),
}));

export function resetMockStorage() {
  mockStorage.uploadFile.mockResolvedValue("/uploads/mock-file.png");
  mockStorage.deleteFile.mockResolvedValue(undefined);
  mockStorage.getFileUrl.mockImplementation((path: string) => path);
}
