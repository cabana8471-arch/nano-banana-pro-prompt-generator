/**
 * Mock Google Gemini API for testing
 */
import { vi } from "vitest";

export const mockGeminiGenerate = vi.fn().mockResolvedValue({
  images: ["/uploads/generated-1.png"],
  text: "Generated image successfully",
  usageMetadata: {
    promptTokenCount: 100,
    candidatesTokenCount: 200,
    totalTokenCount: 300,
  },
});

vi.mock("@/lib/gemini", () => ({
  generateImage: (...args: unknown[]) => mockGeminiGenerate(...args),
}));

export function resetMockGemini() {
  mockGeminiGenerate.mockResolvedValue({
    images: ["/uploads/generated-1.png"],
    text: "Generated image successfully",
    usageMetadata: {
      promptTokenCount: 100,
      candidatesTokenCount: 200,
      totalTokenCount: 300,
    },
  });
}
