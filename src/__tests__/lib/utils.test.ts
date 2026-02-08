import { describe, it, expect } from "vitest";
import { escapeLikePattern } from "@/lib/utils";

describe("escapeLikePattern", () => {
  it("returns empty string unchanged", () => {
    expect(escapeLikePattern("")).toBe("");
  });

  it("returns plain text unchanged", () => {
    expect(escapeLikePattern("hello world")).toBe("hello world");
  });

  it("escapes percent sign", () => {
    expect(escapeLikePattern("100%")).toBe("100\\%");
  });

  it("escapes underscore", () => {
    expect(escapeLikePattern("user_name")).toBe("user\\_name");
  });

  it("escapes backslash", () => {
    expect(escapeLikePattern("path\\to")).toBe("path\\\\to");
  });

  it("escapes multiple special characters", () => {
    expect(escapeLikePattern("%_\\")).toBe("\\%\\_\\\\");
  });

  it("escapes special characters mixed with normal text", () => {
    expect(escapeLikePattern("test%user_name\\end")).toBe("test\\%user\\_name\\\\end");
  });

  it("does not escape other special characters", () => {
    expect(escapeLikePattern("hello@world.com")).toBe("hello@world.com");
    expect(escapeLikePattern("foo*bar?baz")).toBe("foo*bar?baz");
  });

  it("handles string with only special characters", () => {
    expect(escapeLikePattern("%%%")).toBe("\\%\\%\\%");
    expect(escapeLikePattern("___")).toBe("\\_\\_\\_");
  });

  it("handles unicode characters", () => {
    expect(escapeLikePattern("café%")).toBe("café\\%");
  });
});
