/**
 * Save helpers — write converted files back to user storage.
 *
 * Three paths in priority order:
 *   1. File System Access API (Chromium) → "Save all to folder" UX
 *   2. client-zip streaming download → universal "Download as .zip"
 *   3. Individual <a download> → fallback if user wants one-at-a-time
 */

import { downloadZip } from "client-zip";
import type { QueueItem } from "./convertHeic";

/** Items that have completed successfully (narrowed type). */
type DoneItem = QueueItem & {
  status: Extract<QueueItem["status"], { kind: "done" }>;
};

/** Filter helper — only `done` items are saveable. */
export function doneItems(items: QueueItem[]): DoneItem[] {
  return items.filter(
    (i): i is DoneItem => i.status.kind === "done",
  );
}

/**
 * Save all completed items to a user-chosen directory (Chromium only).
 * Caller must check `hasFileSystemAccess()` before calling.
 *
 * Returns the number of files actually written. May be less than input
 * length if user denied per-file overwrite permissions.
 */
export async function saveToFolder(items: QueueItem[]): Promise<number> {
  // Cast — TS lib.dom may not have these for older targets
  const win = window as typeof window & {
    showDirectoryPicker(opts?: {
      mode?: "read" | "readwrite";
      startIn?: string;
    }): Promise<FileSystemDirectoryHandle>;
  };

  const dirHandle = await win.showDirectoryPicker({
    mode: "readwrite",
    startIn: "pictures",
  });

  let written = 0;
  for (const item of doneItems(items)) {
    try {
      const fileHandle = await dirHandle.getFileHandle(item.status.outName, {
        create: true,
      });
      const writable = await (
        fileHandle as FileSystemFileHandle & {
          createWritable(): Promise<FileSystemWritableFileStream>;
        }
      ).createWritable();
      await writable.write(item.status.outBlob);
      await writable.close();
      written++;
    } catch (e) {
      // Permission denied or quota — skip this file but continue with rest
      console.warn(`Failed to write ${item.status.outName}:`, e);
    }
  }
  return written;
}

/**
 * Generate a sensible default zip filename based on the batch contents.
 * Format: heicpix-N-photos-YYYY-MM-DD.zip
 */
export function defaultZipName(count: number): string {
  const today = new Date().toISOString().slice(0, 10);
  return `heicpix-${count}-photo${count === 1 ? "" : "s"}-${today}.zip`;
}

/**
 * Stream-zip all completed items and trigger download. Works on every
 * browser including Firefox/Safari (which lack File System Access).
 */
export async function downloadAsZip(items: QueueItem[]): Promise<void> {
  const done = doneItems(items);
  if (done.length === 0) return;

  // client-zip wants an iterable of { name, input } objects
  const entries = done.map((item) => ({
    name: item.status.outName,
    input: item.status.outBlob,
  }));

  const zipBlob = await downloadZip(entries).blob();
  const filename = defaultZipName(done.length);

  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Share completed files via Web Share API (mobile-friendly).
 * Returns true if shared, false if cancelled or unavailable.
 */
export async function shareFiles(items: QueueItem[]): Promise<boolean> {
  const done = doneItems(items);
  if (done.length === 0) return false;
  if (typeof navigator === "undefined" || !navigator.canShare || !navigator.share)
    return false;

  // Convert blobs to File objects (Web Share API requires File, not Blob)
  const files = done.map(
    (item) => new File([item.status.outBlob], item.status.outName, {
      type: item.status.outBlob.type,
    }),
  );

  const shareData = { files };
  if (!navigator.canShare(shareData)) return false;

  try {
    await navigator.share(shareData);
    return true;
  } catch (e) {
    // User cancelled (AbortError) or share failed — both → false
    return false;
  }
}
