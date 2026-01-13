import { GoogleGenAI, Part, Content, ApiError } from "@google/genai";
import { lookup } from "dns/promises";
import { isIP } from "net";
import { eq } from "drizzle-orm";
import { FILE_LIMITS } from "@/lib/constants";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import { userApiKeys } from "@/lib/schema";
import type { GenerationUsage, UsageMetadata } from "@/lib/types/cost-control";
import type {
  ImageResolution,
  AspectRatio,
  AvatarType,
} from "@/lib/types/generation";

/**
 * Simplified history entry for multi-turn conversations
 */
interface HistoryEntry {
  role: "user" | "assistant";
  content: string;
  imageUrls?: string[] | null;
}

// Model for image generation - configurable via environment variable
const MODEL_ID = process.env.GEMINI_MODEL_ID || "gemini-3-pro-image-preview";
const LOCAL_REFERENCE_PATH_PREFIX = "/uploads/";
const DEFAULT_ALLOWED_REFERENCE_HOST_SUFFIXES = [
  "blob.vercel-storage.com",
  "blob.vercel.io",
];
const FETCH_TIMEOUT_MS = 10_000;
const DNS_LOOKUP_TIMEOUT_MS = 2_000;

function getAllowedReferenceHosts(): Set<string> {
  const allowed = new Set<string>();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    try {
      allowed.add(new URL(appUrl).hostname.toLowerCase());
    } catch {
      // Ignore invalid app URL
    }
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    const withProtocol = vercelUrl.includes("://")
      ? vercelUrl
      : `https://${vercelUrl}`;
    try {
      allowed.add(new URL(withProtocol).hostname.toLowerCase());
    } catch {
      // Ignore invalid Vercel URL
    }
  }

  if (process.env.NODE_ENV !== "production") {
    allowed.add("localhost");
    allowed.add("127.0.0.1");
    allowed.add("::1");
  }

  return allowed;
}

const ALLOWED_REFERENCE_HOSTS = getAllowedReferenceHosts();
const APP_URL_HOST = (() => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
  if (!appUrl) return null;
  const withProtocol = appUrl.includes("://") ? appUrl : `https://${appUrl}`;
  try {
    return new URL(withProtocol).hostname.toLowerCase();
  } catch {
    return null;
  }
})();

function isAllowedReferenceHost(hostname: string): boolean {
  const normalized = hostname.toLowerCase();
  if (ALLOWED_REFERENCE_HOSTS.has(normalized)) {
    return true;
  }

  return DEFAULT_ALLOWED_REFERENCE_HOST_SUFFIXES.some(
    (suffix) => normalized === suffix || normalized.endsWith(`.${suffix}`)
  );
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(message));
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

async function resolveHostAddresses(hostname: string): Promise<string[]> {
  try {
    const results = await withTimeout(
      lookup(hostname, { all: true }),
      DNS_LOOKUP_TIMEOUT_MS,
      "DNS lookup timed out"
    );
    if (results.length === 0) {
      throw new Error("No DNS records found");
    }
    return results.map((result) => result.address);
  } catch (error) {
    throw new Error(`Unable to resolve image host: ${hostname}`);
  }
}

function isPrivateOrLoopbackIp(ip: string): boolean {
  const ipType = isIP(ip);
  if (ipType === 4) {
    const parts = ip.split(".").map((part) => Number(part));
    const a = parts[0]!;
    const b = parts[1]!;

    if (a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 0) return true;
  }

  if (ipType === 6) {
    const normalized = ip.toLowerCase();
    if (normalized === "::1") return true;
    if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
    if (normalized.startsWith("fe80")) return true;
  }

  return false;
}

async function assertSafeFetchUrl(fetchUrl: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(fetchUrl);
  } catch {
    throw new Error("Invalid image URL");
  }

  if (url.username || url.password) {
    throw new Error("Image URL credentials are not allowed");
  }

  const hostname = url.hostname.toLowerCase();
  const isDevLocalhost =
    process.env.NODE_ENV !== "production" &&
    url.protocol === "http:" &&
    (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1");

  if (url.protocol !== "https:" && !isDevLocalhost) {
    throw new Error("Only HTTPS image URLs are allowed");
  }

  if (!isAllowedReferenceHost(hostname)) {
    throw new Error("Image URL host is not allowed");
  }

  if (APP_URL_HOST && hostname === APP_URL_HOST) {
    if (!url.pathname.startsWith(LOCAL_REFERENCE_PATH_PREFIX)) {
      throw new Error("Only uploaded images can be used as references");
    }
  }

  if (isIP(hostname)) {
    if (isPrivateOrLoopbackIp(hostname)) {
      const isDevLoopback =
        process.env.NODE_ENV !== "production" &&
        (hostname === "127.0.0.1" || hostname === "::1");
      if (!isDevLoopback) {
        throw new Error("Private or loopback IPs are not allowed");
      }
    }
  } else {
    const isDevLocalhost =
      process.env.NODE_ENV !== "production" && hostname === "localhost";
    if (!isDevLocalhost) {
      const addresses = await resolveHostAddresses(hostname);
      if (addresses.some(isPrivateOrLoopbackIp)) {
        throw new Error("Private or loopback IPs are not allowed");
      }
    }
  }

  return url;
}

/**
 * Get the user's decrypted API key from the database
 */
export async function getUserApiKey(userId: string): Promise<string | null> {
  try {
    const result = await db
      .select({
        encryptedKey: userApiKeys.encryptedKey,
        iv: userApiKeys.iv,
      })
      .from(userApiKeys)
      .where(eq(userApiKeys.userId, userId))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    if (!row) {
      return null;
    }

    const { encryptedKey, iv } = row;
    return decrypt(encryptedKey, iv);
  } catch (error) {
    console.error("Error fetching user API key:", error);
    return null;
  }
}

/**
 * Create a Gemini client with the user's API key
 */
function createGeminiClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({ apiKey });
}

/**
 * Convert a URL or base64 string to a Gemini-compatible image part
 */
async function createImagePart(
  imageSource: string,
  mimeType: string = "image/png"
): Promise<Part> {
  // If it's already base64 data
  if (imageSource.startsWith("data:")) {
    const matches = imageSource.match(/^data:([^;]+);base64,(.+)$/);
    if (matches && matches[1] && matches[2]) {
      return {
        inlineData: {
          mimeType: matches[1],
          data: matches[2],
        },
      };
    }
  }

  // If it's a local file path (starts with /), only allow uploads and convert to full URL
  let fetchUrl = imageSource;
  if (imageSource.startsWith("/")) {
    if (!imageSource.startsWith(LOCAL_REFERENCE_PATH_PREFIX)) {
      throw new Error("Only uploaded images can be used as references");
    }
    if (imageSource.includes("..")) {
      throw new Error("Invalid image path");
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    try {
      fetchUrl = new URL(imageSource, appUrl).toString();
    } catch {
      throw new Error("Invalid app URL configuration");
    }
  }

  // If it starts with http or is a local path (now converted to full URL), fetch it
  if (fetchUrl.startsWith("http")) {
    try {
      const safeUrl = await assertSafeFetchUrl(fetchUrl);
      const fetchOptions: RequestInit = {
        redirect: "manual",
      };

      let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
      if (typeof AbortSignal !== "undefined" && "timeout" in AbortSignal) {
        fetchOptions.signal = AbortSignal.timeout(FETCH_TIMEOUT_MS);
      } else {
        const controller = new AbortController();
        timeoutHandle = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
        fetchOptions.signal = controller.signal;
      }

      let response: Response;
      try {
        response = await fetch(safeUrl.toString(), fetchOptions);
      } finally {
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
        }
      }

      if (response.status >= 300 && response.status < 400) {
        throw new Error("Image URL redirects are not allowed");
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Check Content-Length header first to avoid downloading oversized images
      const contentLength = response.headers.get("content-length");
      if (contentLength) {
        const size = parseInt(contentLength, 10);
        if (size > FILE_LIMITS.MAX_REFERENCE_IMAGE_BYTES) {
          throw new Error(
            `Image too large: ${Math.round(size / 1024 / 1024)}MB exceeds ${FILE_LIMITS.MAX_REFERENCE_IMAGE_BYTES / 1024 / 1024}MB limit`
          );
        }
      }

      const arrayBuffer = await response.arrayBuffer();

      // Also check actual size in case Content-Length was missing or incorrect
      if (arrayBuffer.byteLength > FILE_LIMITS.MAX_REFERENCE_IMAGE_BYTES) {
        throw new Error(
          `Image too large: ${Math.round(arrayBuffer.byteLength / 1024 / 1024)}MB exceeds ${FILE_LIMITS.MAX_REFERENCE_IMAGE_BYTES / 1024 / 1024}MB limit`
        );
      }

      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const contentTypeHeader = response.headers.get("content-type");
      const contentType = contentTypeHeader
        ? contentTypeHeader.split(";")[0]?.trim() || mimeType
        : mimeType;
      if (contentType && !contentType.startsWith("image/")) {
        throw new Error("Unsupported content type for image reference");
      }

      return {
        inlineData: {
          mimeType: contentType,
          data: base64,
        },
      };
    } catch (error) {
      console.error("Error fetching image:", error);
      throw new Error(`Failed to fetch image from URL: ${fetchUrl}`);
    }
  }

  // Fallback: treat as raw base64 data
  return {
    inlineData: {
      mimeType,
      data: imageSource,
    },
  };
}

/**
 * Reference image for generation
 */
export interface ReferenceImage {
  imageUrl: string;
  type: AvatarType;
  name?: string;
}

/**
 * Result from image generation
 */
export interface GenerationResult {
  success: boolean;
  images: {
    base64: string;
    mimeType: string;
  }[];
  text?: string;
  error?: string;
  /** Usage metadata from API for cost tracking */
  usage?: GenerationUsage | undefined;
}

/**
 * Build the prompt with reference image context
 * Supports types: human, object, logo, product, reference
 * - reference: Design template to preserve (Product Swap Mode)
 * - product: Product image to insert into the design (Product Swap Mode)
 */
function buildPromptWithReferences(
  prompt: string,
  referenceImages: ReferenceImage[]
): string {
  if (referenceImages.length === 0) {
    return prompt;
  }

  const humanRefs = referenceImages.filter((r) => r.type === "human");
  const objectRefs = referenceImages.filter((r) => r.type === "object" || r.type === "logo");
  const referenceRefs = referenceImages.filter((r) => r.type === "reference");
  const productRefs = referenceImages.filter((r) => r.type === "product");

  let enhancedPrompt = prompt;

  // Product Swap Mode: keep it simple - the prompt already contains clear instructions
  // Don't add extra context that might confuse the AI
  if (referenceRefs.length > 0) {
    // The prompt from use-banner-builder.ts already says "first image" and "second image"
    // No need to add more instructions - keep it clean
  } else {
    // Normal mode (non-Product Swap): handle product refs as regular object refs
    if (productRefs.length > 0) {
      const productName = productRefs[0]?.name || "the product";
      enhancedPrompt += ` Feature ${productName} prominently in the design.`;
    }
  }

  if (humanRefs.length > 0) {
    const humanNames = humanRefs
      .map((r) => r.name || "the person")
      .join(", ");
    enhancedPrompt = `Using the reference images of ${humanNames} for character consistency, ${enhancedPrompt}`;
  }

  if (objectRefs.length > 0) {
    const objectNames = objectRefs
      .map((r) => r.name || "the object")
      .join(", ");
    enhancedPrompt += ` Include ${objectNames} as shown in the reference images.`;
  }

  return enhancedPrompt;
}

/**
 * Extract usage metadata from Gemini response
 */
function extractUsageMetadata(
  response: Awaited<ReturnType<GoogleGenAI["models"]["generateContent"]>>
): GenerationUsage | undefined {
  const usageMetadata = response.usageMetadata;
  if (!usageMetadata) {
    return undefined;
  }

  // Extract detailed token counts by modality if available
  const promptTokensDetails: UsageMetadata["promptTokensDetails"] = {};
  const candidatesTokensDetails: UsageMetadata["candidatesTokensDetails"] = {};

  // Process prompt tokens details
  if (usageMetadata.promptTokensDetails) {
    for (const detail of usageMetadata.promptTokensDetails) {
      if (detail.modality === "TEXT") {
        promptTokensDetails.text = detail.tokenCount || 0;
      } else if (detail.modality === "IMAGE") {
        promptTokensDetails.image = detail.tokenCount || 0;
      } else if (detail.modality === "AUDIO") {
        promptTokensDetails.audio = detail.tokenCount || 0;
      }
    }
  }

  // Process candidates tokens details
  if (usageMetadata.candidatesTokensDetails) {
    for (const detail of usageMetadata.candidatesTokensDetails) {
      if (detail.modality === "TEXT") {
        candidatesTokensDetails.text = detail.tokenCount || 0;
      } else if (detail.modality === "IMAGE") {
        candidatesTokensDetails.image = detail.tokenCount || 0;
      } else if (detail.modality === "AUDIO") {
        candidatesTokensDetails.audio = detail.tokenCount || 0;
      }
    }
  }

  return {
    promptTokenCount: usageMetadata.promptTokenCount || 0,
    candidatesTokenCount: usageMetadata.candidatesTokenCount || 0,
    totalTokenCount: usageMetadata.totalTokenCount || 0,
    usageMetadata:
      Object.keys(promptTokensDetails).length > 0 ||
      Object.keys(candidatesTokensDetails).length > 0
        ? {
            promptTokensDetails:
              Object.keys(promptTokensDetails).length > 0
                ? promptTokensDetails
                : undefined,
            candidatesTokensDetails:
              Object.keys(candidatesTokensDetails).length > 0
                ? candidatesTokensDetails
                : undefined,
          }
        : null,
  };
}

/**
 * Aggregate usage from multiple responses
 */
function aggregateUsage(usages: (GenerationUsage | undefined)[]): GenerationUsage | undefined {
  const validUsages = usages.filter((u): u is GenerationUsage => u !== undefined);
  if (validUsages.length === 0) return undefined;

  return validUsages.reduce((acc, usage) => ({
    promptTokenCount: acc.promptTokenCount + usage.promptTokenCount,
    candidatesTokenCount: acc.candidatesTokenCount + usage.candidatesTokenCount,
    totalTokenCount: acc.totalTokenCount + usage.totalTokenCount,
    usageMetadata: null, // Aggregated usage doesn't have detailed breakdown
  }));
}

/**
 * Extract images and text from Gemini response
 */
function extractFromResponse(
  response: Awaited<ReturnType<GoogleGenAI["models"]["generateContent"]>>
): { images: { base64: string; mimeType: string }[]; textContent: string; usage: GenerationUsage | undefined } {
  const images: { base64: string; mimeType: string }[] = [];
  let textContent = "";

  const candidates = response.candidates;
  if (!candidates || candidates.length === 0) {
    return { images, textContent, usage: extractUsageMetadata(response) };
  }

  const candidate = candidates[0];
  if (!candidate?.content?.parts) {
    return { images, textContent, usage: extractUsageMetadata(response) };
  }

  for (const part of candidate.content.parts) {
    if (part.inlineData) {
      images.push({
        base64: part.inlineData.data || "",
        mimeType: part.inlineData.mimeType || "image/png",
      });
    } else if (part.text) {
      textContent += part.text;
    }
  }

  return { images, textContent, usage: extractUsageMetadata(response) };
}

/**
 * Generate images using the user's API key
 */
export async function generateWithUserKey(
  userId: string,
  prompt: string,
  options: {
    resolution: ImageResolution;
    aspectRatio: AspectRatio;
    imageCount?: number;
    referenceImages?: ReferenceImage[];
    history?: HistoryEntry[];
  }
): Promise<GenerationResult> {
  // Get user's API key
  const apiKey = await getUserApiKey(userId);
  if (!apiKey) {
    return {
      success: false,
      images: [],
      error: "No API key configured. Please add your Google AI API key in your profile settings.",
    };
  }

  try {
    const client = createGeminiClient(apiKey);
    const {
      resolution,
      aspectRatio,
      referenceImages = [],
      history = [],
    } = options;

    // Build the enhanced prompt with reference context
    const enhancedPrompt = buildPromptWithReferences(prompt, referenceImages);

    // Build the content parts
    const parts: Part[] = [];

    // Add reference images first if any
    for (const ref of referenceImages) {
      const imagePart = await createImagePart(ref.imageUrl);
      parts.push(imagePart);
    }

    // Add the text prompt
    parts.push({ text: enhancedPrompt });

    // Build conversation history for multi-turn
    const contents: Content[] = [];

    // Add history if present
    for (const entry of history) {
      const historyParts: Part[] = [];

      // Add any images from this history entry
      if (entry.imageUrls && entry.imageUrls.length > 0) {
        for (const imageUrl of entry.imageUrls) {
          const imagePart = await createImagePart(imageUrl);
          historyParts.push(imagePart);
        }
      }

      // Add the text content
      historyParts.push({ text: entry.content });

      contents.push({
        role: entry.role === "user" ? "user" : "model",
        parts: historyParts,
      });
    }

    // Add the current user message
    contents.push({
      role: "user",
      parts,
    });

    // Generate the image(s)
    // Note: We disable thinking mode to avoid thought_signature requirements in multi-turn conversations
    // This prevents the "Text part is missing a thought_signature" error when refining images
    const response = await client.models.generateContent({
      model: MODEL_ID,
      contents,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: resolution,
        },
        thinkingConfig: {
          thinkingBudget: 0, // Disable thinking mode for image generation
        },
      },
    });

    // Extract images, text, and usage from the response
    const { images, textContent, usage } = extractFromResponse(response);
    const allUsages: (GenerationUsage | undefined)[] = [usage];

    if (images.length === 0) {
      return {
        success: false,
        images: [],
        text: textContent,
        error: textContent || "No images were generated. Please try a different prompt.",
        usage,
      };
    }

    // If we need more images, make additional parallel API calls
    // Gemini doesn't support numberOfImages parameter, so we need multiple calls
    const imageCount = options.imageCount || 1;
    if (imageCount > 1 && images.length === 1) {
      const additionalCalls = imageCount - 1;
      const additionalPromises = Array.from({ length: additionalCalls }, () =>
        client.models.generateContent({
          model: MODEL_ID,
          contents,
          config: {
            responseModalities: ["TEXT", "IMAGE"],
            imageConfig: {
              aspectRatio: aspectRatio,
              imageSize: resolution,
            },
            thinkingConfig: {
              thinkingBudget: 0,
            },
          },
        })
      );

      try {
        const additionalResponses = await Promise.all(additionalPromises);
        for (const additionalResponse of additionalResponses) {
          const { images: additionalImages, usage: additionalUsage } = extractFromResponse(additionalResponse);
          images.push(...additionalImages);
          allUsages.push(additionalUsage);
        }
      } catch (additionalError) {
        console.warn("Some additional image generations failed:", additionalError);
        // Continue with the images we have
      }
    }

    // Aggregate usage from all API calls
    const aggregatedUsage = aggregateUsage(allUsages);

    return {
      success: true,
      images,
      text: textContent,
      usage: aggregatedUsage,
    };
  } catch (error) {
    console.error("Gemini API error:", error);

    // Handle API errors using HTTP status codes (more reliable than string matching)
    if (error instanceof ApiError) {
      // 401 Unauthorized or 403 Forbidden = Invalid API key
      if (error.status === 401 || error.status === 403) {
        return {
          success: false,
          images: [],
          error: "Invalid API key. Please check your API key in profile settings.",
        };
      }
      // 429 Too Many Requests = Rate limit exceeded
      if (error.status === 429) {
        return {
          success: false,
          images: [],
          error: "API rate limit exceeded. Please try again later.",
        };
      }
      // 400 Bad Request - check for safety filter issues
      if (error.status === 400 && error.message.toLowerCase().includes("safety")) {
        return {
          success: false,
          images: [],
          error: "Content was blocked by safety filters. Please modify your prompt.",
        };
      }
      return {
        success: false,
        images: [],
        error: error.message,
      };
    }

    // Handle other Error types
    if (error instanceof Error) {
      return {
        success: false,
        images: [],
        error: error.message,
      };
    }

    return {
      success: false,
      images: [],
      error: "An unexpected error occurred during image generation.",
    };
  }
}

/**
 * Refine an existing generation with additional instructions
 */
export async function refineGeneration(
  userId: string,
  existingImageUrl: string,
  instruction: string,
  options: {
    resolution: ImageResolution;
    aspectRatio: AspectRatio;
  }
): Promise<GenerationResult> {
  // Get user's API key
  const apiKey = await getUserApiKey(userId);
  if (!apiKey) {
    return {
      success: false,
      images: [],
      error: "No API key configured. Please add your Google AI API key in your profile settings.",
    };
  }

  try {
    const client = createGeminiClient(apiKey);
    const { resolution, aspectRatio } = options;

    // Build the refinement prompt
    const refinementPrompt = `Based on this image, ${instruction}.`;

    // Create the image part from the existing image
    const imagePart = await createImagePart(existingImageUrl);

    // Build the content
    const contents: Content[] = [
      {
        role: "user",
        parts: [imagePart, { text: refinementPrompt }],
      },
    ];

    // Generate the refined image
    // Note: We disable thinking mode to avoid thought_signature requirements
    const response = await client.models.generateContent({
      model: MODEL_ID,
      contents,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: resolution,
        },
        thinkingConfig: {
          thinkingBudget: 0, // Disable thinking mode for image generation
        },
      },
    });

    // Extract images, text, and usage from the response
    const { images, textContent, usage } = extractFromResponse(response);

    if (images.length === 0) {
      return {
        success: false,
        images: [],
        text: textContent,
        error: textContent || "No images were generated. Please try different instructions.",
        usage,
      };
    }

    return {
      success: true,
      images,
      text: textContent,
      usage,
    };
  } catch (error) {
    console.error("Gemini API refinement error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        images: [],
        error: error.message,
      };
    }

    return {
      success: false,
      images: [],
      error: "An unexpected error occurred during image refinement.",
    };
  }
}
