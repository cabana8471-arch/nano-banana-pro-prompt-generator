/**
 * Get file extension from a MIME type.
 */
export function extensionFromMimeType(mimeType: string): string {
  const map: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
  };
  return map[mimeType] || "png";
}

/**
 * Download an image from a URL with the correct file extension based on its actual MIME type.
 */
export async function downloadImage(url: string, filenameBase: string): Promise<void> {
  const response = await fetch(url);
  const blob = await response.blob();
  const ext = extensionFromMimeType(blob.type);
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `${filenameBase}.${ext}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}

/**
 * Copy an image to the clipboard from a URL.
 * Falls back to writing a text link if the Clipboard API doesn't support image writes.
 */
export async function copyImageToClipboard(url: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    // The Clipboard API only supports PNG for images in most browsers.
    // If the image is already PNG, copy directly. Otherwise, convert via canvas.
    let pngBlob: Blob;
    if (blob.type === "image/png") {
      pngBlob = blob;
    } else {
      pngBlob = await convertToPngBlob(blob);
    }

    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": pngBlob }),
    ]);
    return true;
  } catch {
    // Fallback: copy the URL as text
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Convert an image blob to PNG format using a canvas.
 */
function convertToPngBlob(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((pngBlob) => {
        if (pngBlob) {
          resolve(pngBlob);
        } else {
          reject(new Error("Failed to convert to PNG"));
        }
      }, "image/png");
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(blob);
  });
}
