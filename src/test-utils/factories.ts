/**
 * Test data factories for creating mock objects
 */

import { randomUUID } from "crypto";

export function createMockUser(overrides: Record<string, unknown> = {}) {
  return {
    id: randomUUID(),
    name: "Test User",
    email: "test@example.com",
    emailVerified: true,
    image: null,
    role: "user",
    isBlocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function createMockSession(overrides: Record<string, unknown> = {}) {
  const user = createMockUser(overrides.user as Record<string, unknown> | undefined);
  return {
    user,
    session: {
      id: randomUUID(),
      token: `tok_${randomUUID()}`,
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: "127.0.0.1",
      userAgent: "test-agent",
      ...overrides.session as Record<string, unknown> | undefined,
    },
  };
}

export function createMockGeneration(overrides: Record<string, unknown> = {}) {
  return {
    id: randomUUID(),
    userId: randomUUID(),
    projectId: null,
    prompt: "A test generation prompt",
    settings: { resolution: "1K", aspectRatio: "1:1", imageCount: 1 },
    status: "completed",
    generationType: "photo",
    errorMessage: null,
    builderConfig: null,
    promptTokenCount: 100,
    candidatesTokenCount: 200,
    totalTokenCount: 300,
    usageMetadata: null,
    estimatedCostMicros: 1000,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function createMockGeneratedImage(overrides: Record<string, unknown> = {}) {
  return {
    id: randomUUID(),
    generationId: randomUUID(),
    imageUrl: `/uploads/test-image-${randomUUID()}.png`,
    isPublic: false,
    shareToken: null,
    createdAt: new Date(),
    ...overrides,
  };
}

export function createMockPreset(overrides: Record<string, unknown> = {}) {
  return {
    id: randomUUID(),
    userId: randomUUID(),
    name: "Test Preset",
    config: { subjects: [] },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function createMockAvatar(overrides: Record<string, unknown> = {}) {
  return {
    id: randomUUID(),
    userId: randomUUID(),
    name: "Test Avatar",
    imageUrl: "/uploads/test-avatar.png",
    description: "A test avatar",
    avatarType: "human",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function createMockTag(overrides: Record<string, unknown> = {}) {
  return {
    id: randomUUID(),
    userId: randomUUID(),
    name: "Test Tag",
    color: "#6366f1",
    createdAt: new Date(),
    ...overrides,
  };
}
