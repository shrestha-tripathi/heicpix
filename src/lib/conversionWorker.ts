/**
 * Web Worker: HEIC decode → JPG / PNG encode.
 *
 * Runs in its own thread so the main UI stays responsive even on 50-file
 * batches. Exposed via comlink as the `ConvertWorker` object.
 *
 * libheif-js loads a ~1.5MB WASM blob on first use. We instantiate lazily
 * (first call to `convert`) so cold-start doesn't block worker boot.
 */

import * as Comlink from "comlink";
// Bundled WASM build of libheif. Vite handles the WASM asset URL.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — no type defs for libheif-js bundle
import libheif from "libheif-js/wasm-bundle";

export type OutputFormat = "jpg" | "png";

export interface ConvertOptions {
  format: OutputFormat;
  /** JPG quality 0..1 (ignored for PNG). Default 0.92 matches iOS export. */
  quality?: number;
}

export interface ConvertResult {
  blob: Blob;
  width: number;
  height: number;
  /** decoded image size in bytes (the canvas buffer, not the encoded blob). */
  rawBytes: number;
}

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
  const mimeType = options.format === "jpg" ? "image/jpeg" : "image/png";
  const quality = options.format === "jpg" ? (options.quality ?? 0.92) : undefined;

  const blob = await canvas.convertToBlob({ type: mimeType, quality });

  return { blob, width, height, rawBytes };
}

/** Comlink-exposed API. Add new methods here as needed. */
const api = { convert };
export type ConvertWorker = typeof api;

Comlink.expose(api);
