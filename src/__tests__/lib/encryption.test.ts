import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { encrypt, decrypt, getKeyHint, isValidGoogleApiKey } from "@/lib/encryption";

// Generate a valid 32-byte hex key for testing
const TEST_KEY_HEX = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

describe("encrypt/decrypt", () => {
  beforeEach(() => {
    vi.stubEnv("ENCRYPTION_SECRET", TEST_KEY_HEX);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("encrypts and decrypts a string roundtrip", () => {
    const plaintext = "AIzaSyTest1234567890abcdefghijklmno";
    const result = encrypt(plaintext);
    expect(result).not.toBeNull();
    expect(result!.encrypted).toBeTruthy();
    expect(result!.iv).toBeTruthy();

    const decrypted = decrypt(result!.encrypted, result!.iv);
    expect(decrypted).toBe(plaintext);
  });

  it("produces different ciphertext for same plaintext", () => {
    const plaintext = "test-api-key-12345";
    const result1 = encrypt(plaintext);
    const result2 = encrypt(plaintext);
    expect(result1!.encrypted).not.toBe(result2!.encrypted);
    expect(result1!.iv).not.toBe(result2!.iv);
  });

  it("handles empty string", () => {
    const result = encrypt("");
    expect(result).not.toBeNull();
    const decrypted = decrypt(result!.encrypted, result!.iv);
    expect(decrypted).toBe("");
  });

  it("handles unicode characters", () => {
    const plaintext = "key-with-unicodé-🔑";
    const result = encrypt(plaintext);
    expect(result).not.toBeNull();
    const decrypted = decrypt(result!.encrypted, result!.iv);
    expect(decrypted).toBe(plaintext);
  });

  it("handles long strings", () => {
    const plaintext = "a".repeat(10000);
    const result = encrypt(plaintext);
    expect(result).not.toBeNull();
    const decrypted = decrypt(result!.encrypted, result!.iv);
    expect(decrypted).toBe(plaintext);
  });

  it("returns null when ENCRYPTION_SECRET is missing", () => {
    vi.stubEnv("ENCRYPTION_SECRET", "");
    const result = encrypt("test");
    expect(result).toBeNull();
  });

  it("fails decryption with wrong IV", () => {
    const result = encrypt("test-data");
    expect(result).not.toBeNull();

    // Use a different IV
    const wrongIv = Buffer.from("aabbccddeeff1122aabbccdd", "hex").toString("base64");
    const decrypted = decrypt(result!.encrypted, wrongIv);
    expect(decrypted).toBeNull();
  });

  it("fails decryption with tampered ciphertext", () => {
    const result = encrypt("test-data");
    expect(result).not.toBeNull();

    // Tamper with the encrypted data
    const tampered = "X" + result!.encrypted.slice(1);
    const decrypted = decrypt(tampered, result!.iv);
    expect(decrypted).toBeNull();
  });
});

describe("getKeyHint", () => {
  it("returns last 4 characters with prefix", () => {
    expect(getKeyHint("AIzaSyTest1234567890abcdefgh")).toBe("****efgh");
  });

  it("returns masked hint for short keys", () => {
    expect(getKeyHint("ab")).toBe("****");
  });

  it("handles exact 4 character key", () => {
    expect(getKeyHint("abcd")).toBe("****abcd");
  });
});

describe("isValidGoogleApiKey", () => {
  it("accepts valid Google API key", () => {
    expect(isValidGoogleApiKey("AIzaSyBtest1234567890abcdefghijklmno")).toBe(true);
  });

  it("rejects empty string", () => {
    expect(isValidGoogleApiKey("")).toBe(false);
  });

  it("rejects key without AIza prefix", () => {
    expect(isValidGoogleApiKey("BIzaSyBtest1234567890abcdefghijklmno")).toBe(false);
  });

  it("rejects key that is too short", () => {
    expect(isValidGoogleApiKey("AIzaSyBtest12345678")).toBe(false);
  });

  it("rejects key that is too long", () => {
    expect(isValidGoogleApiKey("AIza" + "a".repeat(50))).toBe(false);
  });

  it("rejects key with special characters", () => {
    expect(isValidGoogleApiKey("AIzaSyBtest1234567890abcdef@#$%^&*")).toBe(false);
  });

  it("accepts key with hyphens and underscores", () => {
    expect(isValidGoogleApiKey("AIzaSyBtest-1234_567890abcdefghijklmn")).toBe(true);
  });
});
