/**
 * Main entry point for converting files. UI layer talks to this; this
 * talks to the worker pool.
 *
 * - Handles file validation
 * - Yields per-file progress via callback
 * - Wraps errors with file context (so UI can show which file failed)
 */

import { poolConvert, poolProbe } from "./workerPool";
import type { OutputFormat } from "./conversionWorker";

export type { OutputFormat };

export type ConversionStatus =
  | { kind: "queued" }
  | { kind: "converting" }
  | { kind: "done"; outBlob: Blob; outName: string; sizeRatio: number }
  | { kind: "error"; message: string };

export interface QueueItem {
  id: string;
  file: File;
  status: ConversionStatus;
}

export interface ConvertSettings {
  format: OutputFormat;
  /**
   * Lossy quality 0..1 — applies to jpg/webp/avif, ignored for png.
   * Optional: each format has a sensible default in the worker.
   */
  quality?: number;
}

/** Re-export so consumers can build a UI without importing the worker module. */
export async function probeFormatSupport(format: OutputFormat): Promise<boolean> {
  return poolProbe(format);
}

/** Per-item progress callback — fires on every status change. */
export type ProgressCb = (item: QueueItem) => void;

const HEIC_MAGIC_OFFSETS = [4]; // 'ftyp' brand starts at offset 4
const HEIC_BRANDS = new Set([
  "heic",
  "heix",
  "heim",
  "heis",
  "hevc",
  "hevx",
  "hevm",
  "hevs",
  "mif1", // generic HEIF — also valid
  "msf1",
]);

/** Sniff the first 16 bytes for an ISO base-media-file-format box header. */
async function isLikelyHeic(file: File): Promise<boolean> {
  if (file.size < 16) return false;
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const ascii = Array.from(head)
    .map((b) => String.fromCharCode(b))
    .join("");
  // boxes look like: <4 bytes len> 'ftyp' <4 bytes brand> ...
  for (const offset of HEIC_MAGIC_OFFSETS) {
    if (ascii.substring(offset, offset + 4) === "ftyp") {
      const brand = ascii.substring(offset + 4, offset + 8).toLowerCase();
      if (HEIC_BRANDS.has(brand)) return true;
    }
  }
  // Fallback: trust the extension if it's .heic / .heif
  const name = file.name.toLowerCase();
  return name.endsWith(".heic") || name.endsWith(".heif");
}

/** Generate output filename by swapping extension. */
function makeOutputName(input: string, format: OutputFormat): string {
  const dot = input.lastIndexOf(".");
  const base = dot >= 0 ? input.slice(0, dot) : input;
  // "jpg" filename suffix; all others use their format name as suffix
  const ext = format === "jpg" ? "jpg" : format;
  return `${base}.${ext}`;
}

/**
 * Convert a single file. Mutates the QueueItem.status and calls onProgress
 * after each transition.
 *
 * Errors caught here become `{ kind: 'error' }` status — never thrown to
 * the caller. UI shows the error message inline.
 */
export async function convertOne(
  item: QueueItem,
  settings: ConvertSettings,
  onProgress: ProgressCb,
): Promise<void> {
  try {
    if (!(await isLikelyHeic(item.file))) {
      item.status = {
        kind: "error",
        message: "Not a HEIC/HEIF file (wrong format or corrupted header)",
      };
      onProgress(item);
      return;
    }

    item.status = { kind: "converting" };
    onProgress(item);

    const buffer = await item.file.arrayBuffer();
    const result = await poolConvert(buffer, {
      format: settings.format,
      quality: settings.quality,
    });

    const outName = makeOutputName(item.file.name, settings.format);
    const sizeRatio = result.blob.size / item.file.size;

    item.status = {
      kind: "done",
      outBlob: result.blob,
      outName,
      sizeRatio,
    };
    onProgress(item);
  } catch (err) {
    item.status = {
      kind: "error",
      message: err instanceof Error ? err.message : String(err),
    };
    onProgress(item);
  }
}

/**
 * Convert a batch — fires off `concurrency` conversions in flight at once,
 * draining the queue as each finishes. Returns when ALL items resolve.
 */
export async function convertBatch(
  items: QueueItem[],
  settings: ConvertSettings,
  onProgress: ProgressCb,
  concurrency = 4,
): Promise<void> {
  const queue = [...items];
  const workers: Promise<void>[] = [];

  async function drain(): Promise<void> {
    while (queue.length > 0) {
      const next = queue.shift();
      if (!next) return;
      await convertOne(next, settings, onProgress);
    }
  }

  for (let i = 0; i < concurrency; i++) {
    workers.push(drain());
  }

  await Promise.all(workers);
}

/**
 * Trigger a browser download for a single Blob with a given filename.
 * Works on all browsers; uses revokeObjectURL to free memory after.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Safari needs a delay before revoke (otherwise download cancels)
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
