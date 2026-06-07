/**
 * EXIF reader + stripper utilities for HEIC.
 *
 * - readExif(file): parse all EXIF tags via exifr (works directly on HEIC)
 * - prettyExif(parsed): turn raw EXIF into [{label, value}] rows for display
 * - stripExifViaJpg(file): decode HEIC → re-encode as JPG (canvas re-encode
 *   has NO EXIF, so this naturally strips all metadata including GPS).
 *
 * exifr handles HEIC directly without needing libheif — it parses the ISOBMFF
 * container and finds Exif boxes natively. ~50KB gzipped, lazy-loaded.
 */

import exifr from "exifr";
import { poolConvert } from "./workerPool";
import { extFor, type OutputFormat } from "./conversionWorker";

export interface ExifRow {
  label: string;
  value: string;
  /** Whether this row contains PII (used to highlight in UI). */
  sensitive?: boolean;
}

export interface ExifReadResult {
  rows: ExifRow[];
  gps: { lat: number; lon: number } | null;
  raw: Record<string, unknown>;
  hasAny: boolean;
}

/**
 * Read EXIF from a HEIC/HEIF file. Returns structured rows + GPS coords
 * (if present). Safe on files without EXIF — returns hasAny=false.
 */
export async function readExif(file: File): Promise<ExifReadResult> {
  let raw: Record<string, unknown> = {};
  let gps: { lat: number; lon: number } | null = null;

  try {
    const parsed = await exifr.parse(file, {
      // Pick the popular tags; full parse is too verbose
      tiff: true,
      exif: true,
      gps: true,
      xmp: false,
      icc: false,
      iptc: false,
      mergeOutput: true,
      reviveValues: true,
      translateValues: true,
    });
    raw = (parsed ?? {}) as Record<string, unknown>;
  } catch {
    // exifr throws on totally unsupported files; treat as no metadata
  }

  try {
    const g = await exifr.gps(file);
    if (g && typeof g.latitude === "number" && typeof g.longitude === "number") {
      gps = { lat: g.latitude, lon: g.longitude };
    }
  } catch {
    // ignore — gps may legitimately not exist
  }

  const rows: ExifRow[] = [];
  const push = (label: string, value: unknown, opts?: { sensitive?: boolean }) => {
    if (value === null || value === undefined || value === "") return;
    rows.push({ label, value: String(value), sensitive: opts?.sensitive });
  };

  // Camera
  push("Camera make", raw.Make);
  push("Camera model", raw.Model);
  push("Lens", raw.LensModel ?? raw.Lens);
  push("Software", raw.Software);

  // Capture
  const date = raw.DateTimeOriginal ?? raw.CreateDate ?? raw.DateTime;
  push("Date taken", date instanceof Date ? date.toLocaleString() : date, { sensitive: true });
  push("Orientation", raw.Orientation);

  // Exposure
  if (typeof raw.ExposureTime === "number") {
    const t = raw.ExposureTime;
    push("Shutter speed", t < 1 ? `1/${Math.round(1 / t)}s` : `${t}s`);
  }
  if (typeof raw.FNumber === "number") push("Aperture", `f/${raw.FNumber}`);
  if (typeof raw.ISO === "number") push("ISO", raw.ISO);
  if (typeof raw.FocalLength === "number") push("Focal length", `${raw.FocalLength}mm`);
  if (typeof raw.FocalLengthIn35mmFormat === "number")
    push("35mm equivalent", `${raw.FocalLengthIn35mmFormat}mm`);
  push("Flash", raw.Flash);
  push("White balance", raw.WhiteBalance);
  push("Metering", raw.MeteringMode);
  push("Exposure program", raw.ExposureProgram);

  // Image
  push("Width", raw.ExifImageWidth ?? raw.ImageWidth);
  push("Height", raw.ExifImageHeight ?? raw.ImageHeight);
  push("Color space", raw.ColorSpace);

  // GPS — flagged as sensitive
  if (gps) {
    push("GPS latitude", gps.lat.toFixed(6), { sensitive: true });
    push("GPS longitude", gps.lon.toFixed(6), { sensitive: true });
  }
  push("GPS altitude", raw.GPSAltitude, { sensitive: true });

  return { rows, gps, raw, hasAny: rows.length > 0 };
}

/**
 * Strip ALL metadata from a HEIC by decoding + re-encoding into the chosen
 * output format. The browser's canvas re-encode naturally produces
 * metadata-free output for any encoder (jpg/png/webp/avif), so the result
 * has zero EXIF / GPS / camera info regardless of format.
 *
 * Why no HEIC option: re-encoding to HEIC would require an HEVC encoder.
 * No browser ships one, and no WASM library bundles one (the only HEVC
 * encoders — x265, kvazaar — are GPL and >2 MB). True HEIC-preserving EXIF
 * strip would require parsing the ISOBMFF container and surgically deleting
 * the `Exif` item box; that's planned for a future release (see
 * heicpix-project skill, "v0.7 future work").
 *
 * Returns a Blob (image/{jpg|png|webp|avif}) with no metadata.
 */
export async function stripExifInto(
  file: File,
  format: OutputFormat,
  quality?: number,
): Promise<{ blob: Blob; width: number; height: number; outName: string; format: OutputFormat }> {
  const buf = await file.arrayBuffer();
  const result = await poolConvert(buf, { format, quality });
  const dot = file.name.lastIndexOf(".");
  const base = dot >= 0 ? file.name.slice(0, dot) : file.name;
  return {
    blob: result.blob,
    width: result.width,
    height: result.height,
    outName: `${base}-clean.${extFor(format)}`,
    format,
  };
}

/**
 * Backwards-compatible wrapper — JPG-only strip. Retained so old callers
 * (and external links from blog posts mentioning "*-stripped.jpg") don't
 * break. New code should prefer `stripExifInto`.
 *
 * @deprecated use stripExifInto(file, "jpg", quality)
 */
export async function stripExifViaJpg(
  file: File,
  quality = 0.92,
): Promise<{ blob: Blob; width: number; height: number; outName: string }> {
  const result = await stripExifInto(file, "jpg", quality);
  // Preserve the OLD output name suffix (-stripped.jpg) for any pre-existing
  // call sites that might pattern-match it. New stripExifInto uses -clean.
  const dot = file.name.lastIndexOf(".");
  const base = dot >= 0 ? file.name.slice(0, dot) : file.name;
  return {
    blob: result.blob,
    width: result.width,
    height: result.height,
    outName: `${base}-stripped.jpg`,
  };
}

/**
 * Format bytes as KB/MB/GB.
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
