/**
 * Web Worker: HEIC decode → JPG / PNG / WebP / AVIF encode.
 *
 * Runs in its own thread so the main UI stays responsive even on 50-file
 * batches. Exposed via comlink as the `ConvertWorker` object.
 *
 * libheif-js loads a ~1.5MB WASM blob on first use. We instantiate lazily
 * (first call to `convert`) so cold-start doesn't block worker boot.
 *
 * Encoder support matrix (via OffscreenCanvas.convertToBlob):
 *   - image/jpeg : ALL browsers (universal)
 *   - image/png  : ALL browsers (universal)
 *   - image/webp : Chrome 32+, Firefox 65+, Safari 14+ (2020+) — effectively universal
 *   - image/avif : Chrome 124+ ONLY (April 2024) — Firefox/Safari fall back to PNG silently
 *
 * The main thread MUST check capabilities first via probeFormat() before
 * showing AVIF as an option, otherwise users get PNG bytes wrapped in an
 * .avif filename which is worse than not offering it.
 */

import * as Comlink from "comlink";
// Bundled WASM build of libheif. Vite handles the WASM asset URL.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — no type defs for libheif-js bundle
import libheif from "libheif-js/wasm-bundle";

export type OutputFormat = "jpg" | "png" | "webp" | "avif";

/** Whether the format honors the quality knob. PNG is always lossless. */
export function isLossy(format: OutputFormat): boolean {
  return format !== "png";
}

/** MIME type for a given output format. */
export function mimeFor(format: OutputFormat): string {
  switch (format) {
    case "jpg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
  }
}

/** Filename extension for a given output format. */
export function extFor(format: OutputFormat): string {
  return format === "jpg" ? "jpg" : format;
}

export interface ConvertOptions {
  format: OutputFormat;
  /**
   * Lossy-format quality 0..1 (ignored for PNG).
   * Defaults: jpg=0.92 (matches iOS export), webp=0.85, avif=0.65.
   * AVIF needs much lower quality numbers to match equivalent visual
   * quality — it's a more efficient codec.
   */
  quality?: number;
}

export interface ConvertResult {
  blob: Blob;
  width: number;
  height: number;
  /** decoded image size in bytes (the canvas buffer, not the encoded blob). */
  rawBytes: number;
}

/** Default quality per lossy format. PNG ignored. */
const DEFAULT_QUALITY: Record<OutputFormat, number> = {
  jpg: 0.92,
  png: 1, // ignored
  webp: 0.85,
  avif: 0.65,
};

// Singleton libheif decoder — instantiated on first convert() call.
let decoder: { decode(buf: ArrayBuffer): unknown[] } | null = null;

async function getDecoder() {
  if (decoder) return decoder;
  // libheif-js bundle exports a factory returning a Promise<HeifDecoder>.
  // Some versions export it as default, others as named. Handle both.
  const factory = (libheif as { default?: unknown }).default ?? libheif;
  const instance =
    typeof factory === "function" ? await (factory as () => unknown)() : factory;
  // Some bundle variants expose HeifDecoder constructor; others a ready instance
  const Decoder =
    (instance as { HeifDecoder?: new () => typeof decoder })?.HeifDecoder;
  decoder = Decoder ? new Decoder()! : (instance as typeof decoder);
  return decoder!;
}

/**
 * Decode one HEIC file and encode to the requested format.
 *
 * Throws on:
 *   - Non-HEIC file (libheif rejects)
 *   - Corrupted HEIC
 *   - OOM (Canvas refuses to allocate)
 *   - Browser doesn't support the requested encoder (returns wrong MIME)
 */
async function convert(
  buffer: ArrayBuffer,
  options: ConvertOptions,
): Promise<ConvertResult> {
  const dec = await getDecoder();
  const images = dec.decode(buffer) as Array<{
    get_width(): number;
    get_height(): number;
    display(
      imageData: ImageData,
      callback: (display: ImageData | null) => void,
    ): void;
  }>;

  if (!images || images.length === 0) {
    throw new Error("No images found in HEIC file");
  }

  // HEIC can contain multiple images (e.g. burst, depth) — take the primary.
  const img = images[0]!;
  const width = img.get_width();
  const height = img.get_height();
  const rawBytes = width * height * 4;

  // OffscreenCanvas keeps everything off-DOM (faster, available in workers)
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d", { willReadFrequently: false });
  if (!ctx) throw new Error("Could not get 2D context");

  const imageData = ctx.createImageData(width, height);

  // libheif's display() is callback-style. Wrap in a promise.
  await new Promise<void>((resolve, reject) => {
    try {
      img.display(imageData, (display) => {
        if (!display) return reject(new Error("HEIF decode returned null"));
        ctx.putImageData(display, 0, 0);
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  });

  // Encode to requested format
  const mimeType = mimeFor(options.format);
  const quality = isLossy(options.format)
    ? (options.quality ?? DEFAULT_QUALITY[options.format])
    : undefined;

  const blob = await canvas.convertToBlob({ type: mimeType, quality });

  // Verify the browser actually honored the encoder request. Chrome 124+
  // is the only browser that encodes AVIF; older Chrome / Firefox / Safari
  // silently fall back to image/png. If we asked for AVIF and got PNG, the
  // user saved a PNG renamed .avif which is worse than refusing.
  if (mimeType !== "image/png" && blob.type === "image/png") {
    throw new Error(
      `Your browser doesn't support encoding ${options.format.toUpperCase()}. ` +
        `Try Chrome 124+ for AVIF, or switch to JPG/PNG/WebP.`,
    );
  }

  return { blob, width, height, rawBytes };
}

/**
 * Probe whether the worker's browser can actually encode a given format.
 *
 * Encodes a 1x1 canvas and checks the returned MIME. Cheap (~few ms),
 * runs once per format at app startup from the main thread via comlink.
 */
async function probeFormat(format: OutputFormat): Promise<boolean> {
  if (format === "jpg" || format === "png") return true; // universal
  try {
    const canvas = new OffscreenCanvas(1, 1);
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 1, 1);
    const mime = mimeFor(format);
    const blob = await canvas.convertToBlob({ type: mime, quality: 0.5 });
    return blob.type === mime;
  } catch {
    return false;
  }
}

/** Comlink-exposed API. Add new methods here as needed. */
const api = { convert, probeFormat };
export type ConvertWorker = typeof api;

Comlink.expose(api);
