/**
 * HEIC Viewer logic — drag-drop a HEIC, render preview, show dimensions.
 * Reuses the same libheif worker pool as the converter; encodes to PNG for
 * lossless on-screen display.
 */

import { poolConvert } from "../lib/workerPool";
import { formatBytes } from "../lib/exifTools";
import { b } from "../lib/baseUrl";

const dropzone = document.getElementById("viewer-dropzone") as HTMLDivElement | null;
const input = document.getElementById("viewer-file-input") as HTMLInputElement | null;
const status = document.getElementById("viewer-status") as HTMLDivElement | null;
const errorEl = document.getElementById("viewer-error") as HTMLDivElement | null;
const result = document.getElementById("viewer-result") as HTMLElement | null;
const img = document.getElementById("viewer-image") as HTMLImageElement | null;
const meta = document.getElementById("viewer-meta") as HTMLSpanElement | null;
const pickAgain = document.getElementById("viewer-pick-another") as HTMLButtonElement | null;
const convertLink = document.getElementById("viewer-convert-link") as HTMLAnchorElement | null;

if (convertLink) convertLink.href = b("/");

let currentObjectUrl: string | null = null;

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

function clearPreview() {
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }
  if (img) img.src = "";
  if (meta) meta.textContent = "";
  result?.classList.add("hidden");
}

async function handleFile(file: File) {
  setError("");
  clearPreview();

  if (!/\.(heic|heif)$/i.test(file.name) && !/image\/hei[cf]/i.test(file.type)) {
    setError(`"${file.name}" doesn't look like a HEIC/HEIF file.`);
    return;
  }

  setStatus(`Decoding ${file.name}…`);

  try {
    const buffer = await file.arrayBuffer();
    const decoded = await poolConvert(buffer, { format: "png" });

    currentObjectUrl = URL.createObjectURL(decoded.blob);
    if (img) {
      img.src = currentObjectUrl;
      img.alt = `Preview of ${file.name}`;
    }
    if (meta) {
      meta.textContent = `${file.name} · ${decoded.width}×${decoded.height} · original ${formatBytes(
        file.size,
      )}`;
    }
    result?.classList.remove("hidden");
    setStatus("");
  } catch (e) {
    setStatus("");
    setError(e instanceof Error ? e.message : `Couldn't decode ${file.name}.`);
  }
}

dropzone?.addEventListener("click", () => input?.click());
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
  const file = e.dataTransfer?.files?.[0];
  if (file) void handleFile(file);
});

input?.addEventListener("change", () => {
  const file = input.files?.[0];
  if (file) void handleFile(file);
});

pickAgain?.addEventListener("click", () => {
  clearPreview();
  input?.click();
});
