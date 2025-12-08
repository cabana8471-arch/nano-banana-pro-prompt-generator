/**
 * Client-side image to SVG conversion utility
 * Uses canvas-based color quantization and path tracing
 */

interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface ColorRegion {
  color: Color;
  pixels: Set<number>;
}

/**
 * Converts an image URL to SVG format
 * @param imageUrl - URL of the image to convert
 * @param options - Conversion options
 * @returns Promise<string> - SVG string content
 */
export async function imageToSvg(
  imageUrl: string,
  options: {
    maxColors?: number;
    colorTolerance?: number;
    simplifyTolerance?: number;
    backgroundColor?: string;
  } = {}
): Promise<string> {
  const {
    maxColors = 16,
    colorTolerance = 30,
    simplifyTolerance = 1,
    backgroundColor = "transparent",
  } = options;

  // Load the image
  const img = await loadImage(imageUrl);
  const { width, height } = img;

  // Create canvas and get image data
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  // Draw image
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // Quantize colors
  const colorPalette = quantizeColors(pixels, maxColors, colorTolerance);

  // Create color regions
  const regions = createColorRegions(pixels, colorPalette, colorTolerance);

  // Generate SVG paths for each region
  const paths = generateSvgPaths(regions, width, height, simplifyTolerance);

  // Build SVG document
  const svg = buildSvgDocument(width, height, paths, backgroundColor);

  return svg;
}

/**
 * Loads an image from URL
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

/**
 * Quantizes colors in the image to a limited palette
 */
function quantizeColors(
  pixels: Uint8ClampedArray,
  maxColors: number,
  tolerance: number
): Color[] {
  const colorMap = new Map<string, { color: Color; count: number }>();

  // Count color occurrences
  for (let i = 0; i < pixels.length; i += 4) {
    const rVal = pixels[i];
    const gVal = pixels[i + 1];
    const bVal = pixels[i + 2];
    const aVal = pixels[i + 3];

    // Skip if any value is undefined or alpha is low
    if (rVal === undefined || gVal === undefined || bVal === undefined || aVal === undefined || aVal < 10) continue;

    const r = Math.round(rVal / tolerance) * tolerance;
    const g = Math.round(gVal / tolerance) * tolerance;
    const b = Math.round(bVal / tolerance) * tolerance;

    const key = `${r},${g},${b}`;
    const existing = colorMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      colorMap.set(key, { color: { r, g, b, a: 255 }, count: 1 });
    }
  }

  // Sort by frequency and take top colors
  const sortedColors = Array.from(colorMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, maxColors)
    .map((c) => c.color);

  return sortedColors;
}

/**
 * Creates regions of connected pixels for each color
 */
function createColorRegions(
  pixels: Uint8ClampedArray,
  palette: Color[],
  tolerance: number
): ColorRegion[] {
  const regions: ColorRegion[] = palette.map((color) => ({
    color,
    pixels: new Set<number>(),
  }));

  if (regions.length === 0) return regions;

  // Assign each pixel to nearest palette color
  for (let i = 0; i < pixels.length; i += 4) {
    const pixelIndex = i / 4;
    const r = pixels[i] ?? 0;
    const g = pixels[i + 1] ?? 0;
    const b = pixels[i + 2] ?? 0;
    const a = pixels[i + 3] ?? 0;

    // Skip transparent pixels
    if (a < 10) continue;

    // Find nearest palette color
    let minDist = Infinity;
    let nearestRegion: ColorRegion = regions[0]!;

    for (const region of regions) {
      const dist = colorDistance({ r, g, b, a }, region.color);
      if (dist < minDist) {
        minDist = dist;
        nearestRegion = region;
      }
    }

    if (minDist <= tolerance * 3) {
      nearestRegion.pixels.add(pixelIndex);
    }
  }

  // Filter out empty regions
  return regions.filter((r) => r.pixels.size > 0);
}

/**
 * Calculates color distance
 */
function colorDistance(c1: Color, c2: Color): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

/**
 * Generates SVG path strings for each color region
 */
function generateSvgPaths(
  regions: ColorRegion[],
  width: number,
  height: number,
  simplifyTolerance: number
): Array<{ color: string; path: string }> {
  const paths: Array<{ color: string; path: string }> = [];

  for (const region of regions) {
    // Create a bitmap for this region
    const bitmap = new Uint8Array(width * height);
    for (const pixelIndex of region.pixels) {
      bitmap[pixelIndex] = 1;
    }

    // Trace contours
    const contours = traceContours(bitmap, width, height);

    // Simplify and convert to SVG path
    if (contours.length > 0) {
      const pathData = contoursToPath(contours, simplifyTolerance);
      if (pathData) {
        const color = `rgb(${region.color.r},${region.color.g},${region.color.b})`;
        paths.push({ color, path: pathData });
      }
    }
  }

  return paths;
}

/**
 * Traces contours in a binary bitmap using marching squares
 */
function traceContours(
  bitmap: Uint8Array,
  width: number,
  height: number
): Array<Array<{ x: number; y: number }>> {
  const contours: Array<Array<{ x: number; y: number }>> = [];
  const visited = new Set<string>();

  // Find contour starting points
  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const idx = y * width + x;

      // Check if this is an edge pixel (has both filled and empty neighbors)
      const current = bitmap[idx] === 1;
      const right = x + 1 < width && bitmap[idx + 1] === 1;
      const bottom = y + 1 < height && bitmap[idx + width] === 1;

      if (current !== right || current !== bottom) {
        const key = `${x},${y}`;
        if (!visited.has(key) && current) {
          const contour = traceContour(bitmap, width, height, x, y, visited);
          if (contour.length > 2) {
            contours.push(contour);
          }
        }
      }
    }
  }

  return contours;
}

/**
 * Traces a single contour starting from given point
 */
function traceContour(
  bitmap: Uint8Array,
  width: number,
  height: number,
  startX: number,
  startY: number,
  visited: Set<string>
): Array<{ x: number; y: number }> {
  const contour: Array<{ x: number; y: number }> = [];
  const directions = [
    { dx: 1, dy: 0 },
    { dx: 1, dy: 1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: -1, dy: -1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: -1 },
  ];

  let x = startX;
  let y = startY;
  let dir = 0;
  const maxSteps = width * height;
  let steps = 0;

  do {
    const key = `${x},${y}`;
    if (!visited.has(key)) {
      contour.push({ x, y });
      visited.add(key);
    }

    // Find next edge pixel
    let found = false;
    for (let i = 0; i < 8; i++) {
      const nextDir = (dir + i + 5) % 8;
      const direction = directions[nextDir];
      if (!direction) continue;

      const nx = x + direction.dx;
      const ny = y + direction.dy;

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const idx = ny * width + nx;
        if (bitmap[idx] === 1) {
          // Check if this is an edge pixel
          const isEdge = checkEdge(bitmap, width, height, nx, ny);
          if (isEdge) {
            x = nx;
            y = ny;
            dir = nextDir;
            found = true;
            break;
          }
        }
      }
    }

    if (!found) break;
    steps++;
  } while ((x !== startX || y !== startY) && steps < maxSteps);

  return contour;
}

/**
 * Checks if a pixel is on the edge
 */
function checkEdge(
  bitmap: Uint8Array,
  width: number,
  height: number,
  x: number,
  y: number
): boolean {
  const idx = y * width + x;
  if (bitmap[idx] !== 1) return false;

  // Check neighbors
  const neighbors: [number, number][] = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
  ];

  for (const neighbor of neighbors) {
    const dx = neighbor[0];
    const dy = neighbor[1];
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) return true;
    if (bitmap[ny * width + nx] !== 1) return true;
  }

  return false;
}

/**
 * Converts contours to SVG path data
 */
function contoursToPath(
  contours: Array<Array<{ x: number; y: number }>>,
  tolerance: number
): string {
  const pathParts: string[] = [];

  for (const contour of contours) {
    if (contour.length < 3) continue;

    // Simplify contour
    const simplified = simplifyContour(contour, tolerance);
    if (simplified.length < 3) continue;

    // Create path
    const first = simplified[0];
    if (!first) continue;

    let path = `M${first.x} ${first.y}`;

    for (let i = 1; i < simplified.length; i++) {
      const point = simplified[i];
      if (point) {
        path += ` L${point.x} ${point.y}`;
      }
    }

    path += " Z";
    pathParts.push(path);
  }

  return pathParts.join(" ");
}

/**
 * Simplifies a contour using Ramer-Douglas-Peucker algorithm
 */
function simplifyContour(
  points: Array<{ x: number; y: number }>,
  tolerance: number
): Array<{ x: number; y: number }> {
  if (points.length <= 2) return points;

  // Find point with maximum distance
  let maxDist = 0;
  let maxIndex = 0;
  const first = points[0];
  const last = points[points.length - 1];

  if (!first || !last) return points;

  for (let i = 1; i < points.length - 1; i++) {
    const point = points[i];
    if (!point) continue;
    const dist = perpendicularDistance(point, first, last);
    if (dist > maxDist) {
      maxDist = dist;
      maxIndex = i;
    }
  }

  // If max distance > tolerance, recursively simplify
  if (maxDist > tolerance) {
    const left = simplifyContour(points.slice(0, maxIndex + 1), tolerance);
    const right = simplifyContour(points.slice(maxIndex), tolerance);
    return [...left.slice(0, -1), ...right];
  }

  return [first, last];
}

/**
 * Calculates perpendicular distance from point to line
 */
function perpendicularDistance(
  point: { x: number; y: number },
  lineStart: { x: number; y: number },
  lineEnd: { x: number; y: number }
): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;

  if (dx === 0 && dy === 0) {
    return Math.sqrt(
      Math.pow(point.x - lineStart.x, 2) + Math.pow(point.y - lineStart.y, 2)
    );
  }

  const t = Math.max(
    0,
    Math.min(
      1,
      ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) /
        (dx * dx + dy * dy)
    )
  );

  const projX = lineStart.x + t * dx;
  const projY = lineStart.y + t * dy;

  return Math.sqrt(Math.pow(point.x - projX, 2) + Math.pow(point.y - projY, 2));
}

/**
 * Builds the final SVG document
 */
function buildSvgDocument(
  width: number,
  height: number,
  paths: Array<{ color: string; path: string }>,
  backgroundColor: string
): string {
  const svgParts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`,
  ];

  // Add background if not transparent
  if (backgroundColor !== "transparent") {
    svgParts.push(`  <rect width="100%" height="100%" fill="${backgroundColor}"/>`);
  }

  // Add paths
  for (const { color, path } of paths) {
    if (path) {
      svgParts.push(`  <path fill="${color}" d="${path}"/>`);
    }
  }

  svgParts.push("</svg>");

  return svgParts.join("\n");
}

/**
 * Downloads an SVG string as a file
 */
export function downloadSvg(svgContent: string, filename: string = "logo.svg"): void {
  const blob = new Blob([svgContent], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Converts an image to SVG and downloads it
 */
export async function exportAsSvg(
  imageUrl: string,
  filename: string = "logo.svg",
  options?: Parameters<typeof imageToSvg>[1]
): Promise<void> {
  const svg = await imageToSvg(imageUrl, options);
  downloadSvg(svg, filename);
}
