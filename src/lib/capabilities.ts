/**
 * Browser capability detection.
 *
 * Centralized so we don't pepper `if (typeof X !== 'undefined')` across
 * the codebase. Each check returns a stable boolean.
 *
 * All checks are SAFE in SSR (Astro build): they short-circuit on
 * `typeof window === 'undefined'`.
 */

const inBrowser = typeof window !== "undefined";

/** Chromium-only: drag-and-drop folders + save to native directory. */
export function hasFileSystemAccess(): boolean {
  return inBrowser && "showDirectoryPicker" in window;
}

/** Web Share API outbound (Mobile Safari + Android Chrome). */
export function hasWebShare(): boolean {
  return inBrowser && typeof navigator !== "undefined" && "share" in navigator;
}

/** Can share FILES (not just text/URLs) — narrower support. */
export function canShareFiles(): boolean {
  if (!inBrowser || !navigator.canShare) return false;
  try {
    // Empty File[] check — actual file objects checked at share time
    return navigator.canShare({ files: [] });
  } catch {
    return false;
  }
}

/** PWA installed (display-mode: standalone). */
export function isPwa(): boolean {
  return (
    inBrowser &&
    (window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

/** Device memory in GB. Returns 4 (safe default) if unknown. */
export function deviceMemoryGB(): number {
  if (!inBrowser) return 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return typeof mem === "number" ? mem : 4;
}

/** Rough mobile detection (UA). Not for security — just for worker sizing. */
export function isMobile(): boolean {
  if (!inBrowser) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Mobile/i.test(
    navigator.userAgent,
  );
}

/** Optimal worker pool size given device. Cap at 4 on desktop, 1 on mobile. */
export function optimalWorkerCount(): number {
  if (!inBrowser) return 1;
  if (isMobile() || deviceMemoryGB() < 4) return 1;
  const cores = navigator.hardwareConcurrency ?? 4;
  return Math.min(4, Math.max(1, Math.floor(cores / 2)));
}

/** Hard cap on simultaneous queued files to avoid OOM. */
export function maxBatchSize(): number {
  if (isMobile()) return 50;
  if (deviceMemoryGB() < 4) return 100;
  return 500;
}
