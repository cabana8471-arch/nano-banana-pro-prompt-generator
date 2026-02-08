import { describe, it, expect } from "vitest";
import {
  nameSchema,
  descriptionSchema,
  avatarTypeSchema,
  generationTypeSchema,
  createAvatarSchema,
  updateAvatarSchema,
  createPresetSchema,
  updatePresetSchema,
  generateRequestSchema,
  refineRequestSchema,
  saveApiKeySchema,
  updateProfileSchema,
  createProjectSchema,
  validateImageFile,
} from "@/lib/validations";

describe("nameSchema", () => {
  it("accepts valid names", () => {
    expect(nameSchema.safeParse("John Doe").success).toBe(true);
  });

  it("rejects empty string", () => {
    expect(nameSchema.safeParse("").success).toBe(false);
  });

  it("trims whitespace", () => {
    const result = nameSchema.safeParse("  John Doe  ");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("John Doe");
    }
  });

  it("rejects string exceeding max length", () => {
    expect(nameSchema.safeParse("a".repeat(300)).success).toBe(false);
  });
});

describe("descriptionSchema", () => {
  it("accepts valid description", () => {
    expect(descriptionSchema.safeParse("A description").success).toBe(true);
  });

  it("accepts null", () => {
    expect(descriptionSchema.safeParse(null).success).toBe(true);
  });

  it("accepts undefined", () => {
    expect(descriptionSchema.safeParse(undefined).success).toBe(true);
  });

  it("rejects overly long description", () => {
    expect(descriptionSchema.safeParse("a".repeat(5000)).success).toBe(false);
  });
});

describe("avatarTypeSchema", () => {
  it("accepts valid avatar types", () => {
    const validTypes = ["human", "object", "logo", "product", "reference"];
    for (const type of validTypes) {
      expect(avatarTypeSchema.safeParse(type).success).toBe(true);
    }
  });

  it("rejects invalid avatar type", () => {
    expect(avatarTypeSchema.safeParse("invalid").success).toBe(false);
  });
});

describe("generationTypeSchema", () => {
  it("accepts photo, banner, logo", () => {
    expect(generationTypeSchema.safeParse("photo").success).toBe(true);
    expect(generationTypeSchema.safeParse("banner").success).toBe(true);
    expect(generationTypeSchema.safeParse("logo").success).toBe(true);
  });

  it("rejects invalid type", () => {
    expect(generationTypeSchema.safeParse("video").success).toBe(false);
  });
});

describe("createAvatarSchema", () => {
  it("accepts valid avatar creation data", () => {
    const result = createAvatarSchema.safeParse({
      name: "My Avatar",
      description: "A test avatar",
      avatarType: "human",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = createAvatarSchema.safeParse({
      avatarType: "human",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid avatar type", () => {
    const result = createAvatarSchema.safeParse({
      name: "Test",
      avatarType: "alien",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateAvatarSchema", () => {
  it("accepts partial updates", () => {
    expect(updateAvatarSchema.safeParse({ name: "New Name" }).success).toBe(true);
  });

  it("rejects empty update", () => {
    expect(updateAvatarSchema.safeParse({}).success).toBe(false);
  });
});

describe("createPresetSchema", () => {
  it("accepts valid preset", () => {
    const result = createPresetSchema.safeParse({
      name: "My Preset",
      config: { subjects: [] },
    });
    expect(result.success).toBe(true);
  });

  it("rejects config without subjects", () => {
    const result = createPresetSchema.safeParse({
      name: "My Preset",
      config: {},
    });
    expect(result.success).toBe(false);
  });

  it("rejects overly large config", () => {
    const result = createPresetSchema.safeParse({
      name: "My Preset",
      config: { subjects: [], padding: "x".repeat(200000) },
    });
    expect(result.success).toBe(false);
  });
});

describe("updatePresetSchema", () => {
  it("accepts name-only update", () => {
    expect(updatePresetSchema.safeParse({ name: "New Name" }).success).toBe(true);
  });

  it("accepts config-only update", () => {
    expect(updatePresetSchema.safeParse({ config: { subjects: [] } }).success).toBe(true);
  });

  it("rejects empty update", () => {
    expect(updatePresetSchema.safeParse({}).success).toBe(false);
  });
});

describe("generateRequestSchema", () => {
  it("accepts valid generation request", () => {
    const result = generateRequestSchema.safeParse({
      prompt: "A beautiful sunset",
      settings: {
        resolution: "1K",
        aspectRatio: "1:1",
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty prompt", () => {
    const result = generateRequestSchema.safeParse({
      prompt: "",
      settings: { resolution: "1K", aspectRatio: "1:1" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid resolution", () => {
    const result = generateRequestSchema.safeParse({
      prompt: "test",
      settings: { resolution: "8K", aspectRatio: "1:1" },
    });
    expect(result.success).toBe(false);
  });

  it("defaults generationType to photo", () => {
    const result = generateRequestSchema.safeParse({
      prompt: "test",
      settings: { resolution: "1K", aspectRatio: "1:1" },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.generationType).toBe("photo");
    }
  });

  it("defaults imageCount to 1", () => {
    const result = generateRequestSchema.safeParse({
      prompt: "test",
      settings: { resolution: "1K", aspectRatio: "1:1" },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.settings.imageCount).toBe(1);
    }
  });

  it("accepts valid imageCount values", () => {
    for (const count of [1, 2, 3, 4]) {
      const result = generateRequestSchema.safeParse({
        prompt: "test",
        settings: { resolution: "1K", aspectRatio: "1:1", imageCount: count },
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid imageCount", () => {
    const result = generateRequestSchema.safeParse({
      prompt: "test",
      settings: { resolution: "1K", aspectRatio: "1:1", imageCount: 5 },
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional projectId", () => {
    const result = generateRequestSchema.safeParse({
      prompt: "test",
      settings: { resolution: "1K", aspectRatio: "1:1" },
      projectId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  it("rejects prompt exceeding max length", () => {
    const result = generateRequestSchema.safeParse({
      prompt: "x".repeat(100000),
      settings: { resolution: "1K", aspectRatio: "1:1" },
    });
    expect(result.success).toBe(false);
  });
});

describe("refineRequestSchema", () => {
  it("accepts valid refinement request", () => {
    const result = refineRequestSchema.safeParse({
      instruction: "Make it brighter",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty instruction", () => {
    const result = refineRequestSchema.safeParse({
      instruction: "",
    });
    expect(result.success).toBe(false);
  });

  it("trims instruction whitespace", () => {
    const result = refineRequestSchema.safeParse({
      instruction: "  Make it brighter  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.instruction).toBe("Make it brighter");
    }
  });
});

describe("saveApiKeySchema", () => {
  it("accepts valid API key", () => {
    expect(saveApiKeySchema.safeParse({ apiKey: "test-key" }).success).toBe(true);
  });

  it("rejects empty API key", () => {
    expect(saveApiKeySchema.safeParse({ apiKey: "" }).success).toBe(false);
  });
});

describe("updateProfileSchema", () => {
  it("accepts valid name", () => {
    const result = updateProfileSchema.safeParse({ name: "John Doe" });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = updateProfileSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("trims name whitespace", () => {
    const result = updateProfileSchema.safeParse({ name: "  John  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("John");
    }
  });
});

describe("createProjectSchema", () => {
  it("accepts valid project", () => {
    const result = createProjectSchema.safeParse({
      name: "My Project",
      description: "A test project",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = createProjectSchema.safeParse({
      description: "A test project",
    });
    expect(result.success).toBe(false);
  });
});

describe("validateImageFile", () => {
  it("accepts valid JPEG file", () => {
    const file = new File(["data"], "test.jpg", { type: "image/jpeg" });
    Object.defineProperty(file, "size", { value: 1024 * 1024 }); // 1MB
    expect(validateImageFile(file).success).toBe(true);
  });

  it("accepts valid PNG file", () => {
    const file = new File(["data"], "test.png", { type: "image/png" });
    Object.defineProperty(file, "size", { value: 1024 * 1024 });
    expect(validateImageFile(file).success).toBe(true);
  });

  it("rejects null file", () => {
    const result = validateImageFile(null);
    expect(result.success).toBe(false);
  });

  it("rejects invalid MIME type", () => {
    const file = new File(["data"], "test.pdf", { type: "application/pdf" });
    Object.defineProperty(file, "size", { value: 1024 });
    const result = validateImageFile(file);
    expect(result.success).toBe(false);
  });

  it("rejects oversized file", () => {
    const file = new File(["data"], "test.jpg", { type: "image/jpeg" });
    Object.defineProperty(file, "size", { value: 100 * 1024 * 1024 }); // 100MB
    const result = validateImageFile(file);
    expect(result.success).toBe(false);
  });
});
