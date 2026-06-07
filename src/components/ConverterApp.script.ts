/**
 * The converter app — vanilla TS, hydrates DropZone.astro.
 *
 * Imports lazily from `convertHeic.ts` (which pulls in the worker bundle)
 * so this script can be the entry point and bundlers split correctly.
 */

import { convertBatch, type QueueItem, type OutputFormat } from "../lib/convertHeic";
import { saveToFolder, downloadAsZip, shareFiles, doneItems } from "../lib/savingPaths";
import {
  hasFileSystemAccess,
  canShareFiles,
  maxBatchSize,
  optimalWorkerCount,
} from "../lib/capabilities";

// ------------------------------------------------------------------ refs

const dropzone = document.getElementById("dropzone") as HTMLDivElement;
const fileInput = document.getElementById("file-input") as HTMLInputElement;
const fileList = document.getElementById("file-list") as HTMLUListElement;
const batchSummary = document.getElementById("batch-summary") as HTMLDivElement;
const batchProgressText = document.getElementById(
  "batch-progress-text",
) as HTMLSpanElement;
const saveAllBar = document.getElementById("save-all-bar") as HTMLDivElement;
const saveAllLabel = document.getElementById("save-all-label") as HTMLSpanElement;
const btnSaveFolder = document.getElementById("btn-save-folder") as HTMLButtonElement;
const btnDownloadZip = document.getElementById(
  "btn-download-zip",
) as HTMLButtonElement;
const btnShare = document.getElementById("btn-share") as HTMLButtonElement;
const btnClear = document.getElementById("btn-clear") as HTMLButtonElement;
const errorsBlock = document.getElementById("errors-block") as HTMLDivElement;
const errorsText = document.getElementById("errors-text") as HTMLSpanElement;

if (
  !dropzone ||
  !fileInput ||
  !fileList ||
  !batchSummary ||
  !saveAllBar
) {
  // We're not on the converter page — bail silently.
  // (Astro will still bundle this file but the script body short-circuits.)
}

// ------------------------------------------------------------------ state
//
// IMPORTANT: state must be declared BEFORE init() is called. If init()
// runs first, it registers event listeners that reference `items` in
// their closures. If the user clicks a button (e.g. format toggle)
// before line 52 executes, the listener fires and hits a TDZ error
// because `const items` is hoisted-but-uninitialized.

const items: QueueItem[] = [];
let nextId = 1;
let activeConversions = 0;

// ------------------------------------------------------------------ init
//
// ⚠️ The actual init() invocation lives at the BOTTOM of this file.
// DO NOT move it here — module-level const declarations below (e.g.
// VALID_FORMATS at the bottom of the file) will be in TDZ when init()
// runs synchronously during module evaluation. We learned this twice:
//   v0.4 — `items` was below init() → "Cannot access items"
//   v0.5.1 — `VALID_FORMATS` was below init() → "Cannot access Y"
// See skill: module-init-order-tdz-bug. Always invoke init() last.

function init(): void {
  // File picker
  fileInput.addEventListener("change", () => {
    if (fileInput.files) enqueue(Array.from(fileInput.files));
    fileInput.value = ""; // reset so picking same file again re-fires change
  });

  // Drag and drop
  ["dragenter", "dragover"].forEach((ev) => {
    dropzone.addEventListener(ev, (e) => {
      e.preventDefault();
      dropzone.dataset.state = "active";
    });
  });
  ["dragleave", "drop"].forEach((ev) => {
    dropzone.addEventListener(ev, (e) => {
      e.preventDefault();
      dropzone.dataset.state = "idle";
    });
  });
  dropzone.addEventListener("drop", (e) => {
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) enqueue(Array.from(files));
  });

  // Keyboard
  dropzone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInput.click();
    }
  });

  // Save / Share / Clear
  btnDownloadZip.addEventListener("click", onDownloadZip);
  btnSaveFolder.addEventListener("click", onSaveFolder);
  btnShare.addEventListener("click", onShare);
  btnClear.addEventListener("click", onClear);

  // Show / hide capability-gated buttons
  if (hasFileSystemAccess()) {
    btnSaveFolder.classList.remove("hidden");
  }
  if (canShareFiles()) {
    btnShare.classList.remove("hidden");
  }

  // Watch format toggle for live-update of saveAllLabel + PNG hint
  document.addEventListener("heicpix:format-change", ((e: CustomEvent) => {
    renderSaveAllBar();
    const hint = document.getElementById("png-hint");
    if (hint) {
      hint.classList.toggle("hidden", e.detail.format !== "png");
    }
  }) as EventListener);

  // Quality slider changes just need to re-render existing rows so
  // the user sees the new label, but DON'T re-encode (the user may
  // adjust then convert; if they change quality mid-batch, the next
  // file picks up the new quality).
  document.addEventListener("heicpix:quality-change", (() => {
    /* no-op for now — quality is read fresh on each enqueue */
  }) as EventListener);

  // Initial PNG-hint visibility (in case page loads with PNG already chosen)
  const initialHint = document.getElementById("png-hint");
  if (initialHint && currentFormat() === "png") {
    initialHint.classList.remove("hidden");
  }
}

const VALID_FORMATS = new Set(["jpg", "png", "webp", "avif"]);
function currentFormat(): OutputFormat {
  const f = document.documentElement.dataset.format;
  return f && VALID_FORMATS.has(f) ? (f as OutputFormat) : "jpg";
}

function currentQuality(): number {
  const q = parseFloat(document.documentElement.dataset.quality ?? "");
  return q >= 0.3 && q <= 1 ? q : 0.92;
}

// ------------------------------------------------------------------ enqueue

async function enqueue(files: File[]): Promise<void> {
  // Filter to HEIC/HEIF extensions or MIME (validation lives in convertHeic)
  const accepted = files.filter((f) => {
    const name = f.name.toLowerCase();
    return (
      name.endsWith(".heic") ||
      name.endsWith(".heif") ||
      f.type === "image/heic" ||
      f.type === "image/heif" ||
      // Some browsers report image/* generically; let convertOne sniff
      f.type === "" ||
      f.type === "application/octet-stream"
    );
  });

  if (accepted.length === 0) {
    showError(
      "No HEIC files found. Drop .heic or .heif files (the format iPhones use).",
    );
    return;
  }

  // Enforce batch cap
  const remaining = maxBatchSize() - items.length;
  if (remaining <= 0) {
    showError(`Batch limit reached (${maxBatchSize()} files max).`);
    return;
  }
  const toAdd = accepted.slice(0, remaining);
  if (accepted.length > toAdd.length) {
    showError(
      `Added first ${toAdd.length} files; batch limit is ${maxBatchSize()}.`,
    );
  } else {
    hideError();
  }

  for (const file of toAdd) {
    const item: QueueItem = {
      id: `f${nextId++}`,
      file,
      status: { kind: "queued" },
    };
    items.push(item);
    renderRow(item);
  }
  updateBatchSummary();
  compactDropzoneIfNeeded();

  // Kick off conversion
  const settings = {
    format: currentFormat(),
    quality: currentQuality(),
  };
  const newItems = items.filter((i) => i.status.kind === "queued");
  if (newItems.length === 0) return;

  activeConversions++;
  await convertBatch(newItems, settings, onProgress, optimalWorkerCount());
  activeConversions--;
  updateBatchSummary();
  renderSaveAllBar();
}

function compactDropzoneIfNeeded(): void {
  dropzone.dataset.compact = items.length > 0 ? "true" : "false";
}

function onProgress(item: QueueItem): void {
  // Re-render that one row
  const row = document.getElementById(rowId(item.id));
  if (!row) return;
  row.replaceWith(makeRow(item));
  updateBatchSummary();
  // Reveal save-all bar as soon as at least one done
  if (item.status.kind === "done" && saveAllBar.classList.contains("hidden")) {
    renderSaveAllBar();
  }
}

// ------------------------------------------------------------------ rendering

function rowId(id: string): string {
  return `row-${id}`;
}

function makeRow(item: QueueItem): HTMLLIElement {
  const li = document.createElement("li");
  li.id = rowId(item.id);
  li.className = "flex items-center gap-3 py-3";

  const icon = document.createElement("span");
  icon.className = "text-2xl shrink-0";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "🖼";

  const mid = document.createElement("div");
  mid.className = "flex-1 min-w-0";

  const topRow = document.createElement("div");
  topRow.className = "flex items-baseline justify-between gap-2";

  const name = document.createElement("span");
  name.className = "font-medium truncate text-sm";
  name.textContent = item.file.name;

  const sizeLabel = document.createElement("span");
  sizeLabel.className = "text-xs text-[var(--color-muted)] shrink-0 tabular-nums";

  const progressTrack = document.createElement("div");
  progressTrack.className =
    "mt-1 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden";
  const progressFill = document.createElement("div");
  progressFill.className = "h-full transition-all duration-200";
  progressTrack.appendChild(progressFill);

  const status = document.createElement("span");
  status.className = "shrink-0 text-sm";

  // Assemble DOM FIRST so the per-status case can replaceWith on already-mounted nodes
  topRow.appendChild(name);
  topRow.appendChild(sizeLabel);
  mid.appendChild(topRow);
  mid.appendChild(progressTrack);
  li.appendChild(icon);
  li.appendChild(mid);
  li.appendChild(status);

  // Populate based on status
  switch (item.status.kind) {
    case "queued":
      sizeLabel.textContent = formatBytes(item.file.size);
      progressFill.style.width = "0%";
      progressFill.style.backgroundColor = "var(--color-muted)";
      status.textContent = "queued";
      status.classList.add("text-[var(--color-muted)]");
      break;
    case "converting":
      sizeLabel.textContent = formatBytes(item.file.size);
      progressFill.style.width = "65%";
      progressFill.style.backgroundColor = "var(--color-accent)";
      progressFill.classList.add("animate-pulse");
      status.textContent = "converting…";
      status.classList.add("text-[var(--color-accent)]");
      break;
    case "done": {
      sizeLabel.textContent = `${formatBytes(item.file.size)} → ${formatBytes(
        item.status.outBlob.size,
      )}`;
      progressFill.style.width = "100%";
      progressFill.style.backgroundColor = "var(--color-success)";
      status.textContent = "✓";
      status.classList.add("text-[var(--color-success)]", "font-bold");
      // Per-file download: swap the filename span for a clickable <a>.
      // Capture status into a const so TS narrowing survives the closure.
      const done = item.status;
      const link = document.createElement("a");
      link.className =
        "font-medium truncate text-sm text-[var(--color-accent)] hover:underline cursor-pointer";
      link.textContent = done.outName;
      link.href = "#";
      link.title = `Download ${done.outName}`;
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const url = URL.createObjectURL(done.outBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = done.outName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      });
      name.replaceWith(link);
      break;
    }
    case "error":
      sizeLabel.textContent = item.status.message;
      sizeLabel.classList.add("text-[var(--color-error)]");
      progressFill.style.width = "100%";
      progressFill.style.backgroundColor = "var(--color-error)";
      status.textContent = "failed";
      status.classList.add("text-[var(--color-error)]");
      break;
  }

  return li;
}

function renderRow(item: QueueItem): void {
  fileList.appendChild(makeRow(item));
}

function updateBatchSummary(): void {
  const total = items.length;
  if (total === 0) {
    batchSummary.classList.add("hidden");
    return;
  }
  batchSummary.classList.remove("hidden");

  const done = items.filter((i) => i.status.kind === "done").length;
  const errs = items.filter((i) => i.status.kind === "error").length;
  const converting = items.filter((i) => i.status.kind === "converting").length;
  const remaining = total - done - errs;

  let txt = "";
  if (remaining > 0) {
    txt = `Converting ${done + converting}/${total}…`;
  } else if (errs > 0) {
    txt = `${done}/${total} converted · ${errs} failed`;
  } else {
    txt = `✓ ${done}/${total} converted`;
  }
  batchProgressText.textContent = txt;
}

function renderSaveAllBar(): void {
  const done = doneItems(items);
  if (done.length === 0) {
    saveAllBar.classList.add("hidden");
    return;
  }
  saveAllBar.classList.remove("hidden");
  const format = currentFormat().toUpperCase();
  saveAllLabel.textContent = `${done.length} ${format} file${
    done.length === 1 ? "" : "s"
  } ready`;
}

// ------------------------------------------------------------------ actions

async function onDownloadZip(): Promise<void> {
  btnDownloadZip.disabled = true;
  const orig = btnDownloadZip.textContent;
  btnDownloadZip.textContent = "Zipping…";
  try {
    await downloadAsZip(items);
  } catch (e) {
    showError(`Zip failed: ${e instanceof Error ? e.message : String(e)}`);
  } finally {
    btnDownloadZip.disabled = false;
    btnDownloadZip.textContent = orig;
  }
}

async function onSaveFolder(): Promise<void> {
  try {
    const n = await saveToFolder(items);
    saveAllLabel.textContent = `✓ Saved ${n} file${n === 1 ? "" : "s"} to folder`;
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") return; // cancelled
    showError(`Save failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

async function onShare(): Promise<void> {
  const ok = await shareFiles(items);
  if (!ok) {
    showError("Sharing isn't available (or was cancelled).");
  }
}

function onClear(): void {
  items.length = 0;
  nextId = 1;
  fileList.innerHTML = "";
  saveAllBar.classList.add("hidden");
  batchSummary.classList.add("hidden");
  compactDropzoneIfNeeded();
  hideError();
}

// ------------------------------------------------------------------ helpers

function showError(msg: string): void {
  errorsBlock.classList.remove("hidden");
  errorsText.textContent = msg;
}
function hideError(): void {
  errorsBlock.classList.add("hidden");
  errorsText.textContent = "";
}

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

// ------------------------------------------------------------------ Web Share Target

// If the user shared files INTO HEICPix via the OS share sheet, the
// service worker will have stashed them in IndexedDB and redirected the
// PWA here with `?shared=1`. Read + enqueue them automatically.
//
// (Defined here, called once on init.)
(async function maybeIngestSharedFiles() {
  if (!window.location.search.includes("shared=")) return;
  try {
    const mod = await import("../lib/shareIngest");
    const sharedFiles = await mod.popSharedFiles();
    if (sharedFiles.length > 0) {
      enqueue(sharedFiles);
      // Clean URL — don't re-trigger on refresh
      const clean = new URL(window.location.href);
      clean.searchParams.delete("shared");
      window.history.replaceState({}, "", clean.toString());
    }
  } catch (e) {
    console.warn("Failed to ingest shared files:", e);
  }
})();

// ─────────────────────────────────────────────────────────────────────
// init() invocation — ALWAYS LAST in module evaluation order.
//
// This must run AFTER all const declarations (VALID_FORMATS, etc.) so
// that closures registered by init() (event listeners, etc.) can read
// those constants without hitting a Temporal Dead Zone error.
//
// See skill: module-init-order-tdz-bug. Do NOT move this up the file.
// ─────────────────────────────────────────────────────────────────────

if (dropzone && fileInput && fileList && batchSummary && saveAllBar) {
  init();
}
