/**
 * Strip-EXIF logic. For each HEIC file:
 *   1. Decode via libheif worker
 *   2. Re-encode as JPG (no metadata by canvas spec)
 *   3. Append a row with download link + "before/after" byte counts
 *
 * Batch download zips all stripped JPGs together via client-zip.
 */

import { downloadZip } from "client-zip";
import { stripExifViaJpg, formatBytes } from "../lib/exifTools";
import { downloadBlob } from "../lib/convertHeic";

interface StrippedItem {
  id: string;
  originalName: string;
  originalSize: number;
  outBlob: Blob;
  outName: string;
}

const dropzone = document.getElementById("strip-dropzone") as HTMLDivElement | null;
const input = document.getElementById("strip-file-input") as HTMLInputElement | null;
const status = document.getElementById("strip-status") as HTMLDivElement | null;
const errorEl = document.getElementById("strip-error") as HTMLDivElement | null;
const listEl = document.getElementById("strip-list") as HTMLUListElement | null;
const summaryBar = document.getElementById("strip-summary-bar") as HTMLDivElement | null;
const summaryLabel = document.getElementById("strip-summary-label") as HTMLSpanElement | null;
const zipBtn = document.getElementById("btn-strip-zip") as HTMLButtonElement | null;
const clearBtn = document.getElementById("btn-strip-clear") as HTMLButtonElement | null;

const items: StrippedItem[] = [];

function setStatus(msg: string) {
  if (!status) return;
  status.textContent = msg;
  status.classList.toggle("hidden", !msg);
}

function setError(msg: string) {
  if (!errorEl) return;
  errorEl.textContent = msg;
  errorEl.classList.toggle("hidden", !msg);
}

function refreshSummary() {
  if (!summaryBar || !summaryLabel) return;
  if (items.length === 0) {
    summaryBar.classList.add("hidden");
    return;
  }
  const total = items.reduce((sum, i) => sum + i.outBlob.size, 0);
  summaryLabel.textContent = `${items.length} clean ${
    items.length === 1 ? "photo" : "photos"
  } · ${formatBytes(total)} total · metadata removed`;
  summaryBar.classList.remove("hidden");
}

function appendRow(item: StrippedItem) {
  if (!listEl) return;
  const li = document.createElement("li");
  li.className = "flex items-center justify-between py-3 gap-3";

  const info = document.createElement("div");
  info.className = "min-w-0 flex-1";

  const name = document.createElement("p");
  name.className = "text-sm font-medium truncate";
  name.textContent = item.outName;

  const sizeLine = document.createElement("p");
  sizeLine.className = "text-xs text-[var(--color-muted)] mt-0.5";
  sizeLine.textContent = `${formatBytes(item.originalSize)} HEIC → ${formatBytes(
    item.outBlob.size,
  )} clean JPG · no GPS, no camera info, no date`;

  info.appendChild(name);
  info.appendChild(sizeLine);

  const dlBtn = document.createElement("button");
  dlBtn.type = "button";
  dlBtn.className =
    "shrink-0 px-3 py-1.5 rounded-md border border-[var(--color-border)] hover:bg-[var(--color-surface)] text-xs font-semibold transition-colors";
  dlBtn.textContent = "Download";
  dlBtn.addEventListener("click", () => downloadBlob(item.outBlob, item.outName));

  li.appendChild(info);
  li.appendChild(dlBtn);
  listEl.appendChild(li);
}

async function processOne(file: File) {
  if (!/\.(heic|heif)$/i.test(file.name) && !/image\/hei[cf]/i.test(file.type)) {
    setError(`"${file.name}" doesn't look like a HEIC/HEIF file — skipped.`);
    return;
  }

  try {
    const stripped = await stripExifViaJpg(file);
    const item: StrippedItem = {
      id: crypto.randomUUID(),
      originalName: file.name,
      originalSize: file.size,
      outBlob: stripped.blob,
      outName: stripped.outName,
    };
    items.push(item);
    appendRow(item);
    refreshSummary();
  } catch (e) {
    setError(`Failed on ${file.name}: ${e instanceof Error ? e.message : String(e)}`);
  }
}

async function handleFiles(files: FileList | File[]) {
  setError("");
  const arr = Array.from(files);
  if (arr.length === 0) return;

  let done = 0;
  for (const file of arr) {
    setStatus(`Stripping ${++done}/${arr.length}…`);
    await processOne(file);
  }
  setStatus("");
}

// NOTE: do NOT add a `dropzone.click → input.click()` handler. The <input>
// is positioned `absolute inset-0` and already receives clicks natively.
// Adding an explicit forward causes a double-trigger: picker #1 fires from
// the native input click, then bubbles to the dropzone and fires picker #2.
// On desktop this looks like "had to pick twice"; on iOS Safari it silently
// dismisses both (one user-gesture = one picker). Keyboard activation is
// handled below since the <input> doesn't get keyboard focus.
dropzone?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    input?.click();
  }
});
dropzone?.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.setAttribute("data-state", "active");
});
dropzone?.addEventListener("dragleave", () => {
  dropzone.setAttribute("data-state", "idle");
});
dropzone?.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.setAttribute("data-state", "idle");
  if (e.dataTransfer?.files) void handleFiles(e.dataTransfer.files);
});
input?.addEventListener("change", () => {
  if (input.files) void handleFiles(input.files);
});

zipBtn?.addEventListener("click", async () => {
  if (items.length === 0) return;
  try {
    const blob = await downloadZip(
      items.map((i) => ({ name: i.outName, input: i.outBlob, lastModified: new Date() })),
    ).blob();
    downloadBlob(blob, "heic-stripped.zip");
  } catch (e) {
    setError(`Failed to build zip: ${e instanceof Error ? e.message : String(e)}`);
  }
});

clearBtn?.addEventListener("click", () => {
  items.length = 0;
  if (listEl) listEl.innerHTML = "";
  refreshSummary();
  setError("");
});
