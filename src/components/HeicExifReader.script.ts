/**
 * HEIC EXIF reader logic. Uses exifr to parse the HEIC container; renders
 * results into a table. Highlights sensitive fields (GPS, date) in accent
 * color so users see why they might want to strip them.
 */

import { readExif, formatBytes } from "../lib/exifTools";
import { b } from "../lib/baseUrl";

const dropzone = document.getElementById("exif-dropzone") as HTMLDivElement | null;
const input = document.getElementById("exif-file-input") as HTMLInputElement | null;
const status = document.getElementById("exif-status") as HTMLDivElement | null;
const errorEl = document.getElementById("exif-error") as HTMLDivElement | null;
const result = document.getElementById("exif-result") as HTMLDivElement | null;
const summary = document.getElementById("exif-summary") as HTMLDivElement | null;
const tableWrap = document.getElementById("exif-table-wrap") as HTMLDivElement | null;
const tbody = document.getElementById("exif-tbody") as HTMLTableSectionElement | null;
const gpsWrap = document.getElementById("exif-gps-wrap") as HTMLDivElement | null;
const gpsLink = document.getElementById("exif-gps-link") as HTMLAnchorElement | null;
const noExif = document.getElementById("exif-noexif") as HTMLDivElement | null;
const pickAgain = document.getElementById("exif-pick-another") as HTMLButtonElement | null;
const stripLink = document.getElementById("exif-strip-link") as HTMLAnchorElement | null;

if (stripLink) stripLink.href = b("/strip-heic-exif");

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

function clearResult() {
  result?.classList.add("hidden");
  if (tbody) tbody.innerHTML = "";
  gpsWrap?.classList.add("hidden");
  noExif?.classList.add("hidden");
  tableWrap?.classList.remove("hidden");
}

async function handleFile(file: File) {
  setError("");
  clearResult();

  if (!/\.(heic|heif)$/i.test(file.name) && !/image\/hei[cf]/i.test(file.type)) {
    setError(`"${file.name}" doesn't look like a HEIC/HEIF file.`);
    return;
  }

  setStatus(`Parsing metadata in ${file.name}…`);

  try {
    const exif = await readExif(file);
    setStatus("");

    if (summary) {
      summary.textContent = `${file.name} · ${formatBytes(file.size)}`;
    }

    if (!exif.hasAny) {
      tableWrap?.classList.add("hidden");
      noExif?.classList.remove("hidden");
    } else if (tbody) {
      for (const row of exif.rows) {
        const tr = document.createElement("tr");
        const tdLabel = document.createElement("td");
        tdLabel.textContent = row.label;
        const tdValue = document.createElement("td");
        tdValue.textContent = row.value;
        if (row.sensitive) tdValue.classList.add("sensitive");
        tr.appendChild(tdLabel);
        tr.appendChild(tdValue);
        tbody.appendChild(tr);
      }
    }

    if (exif.gps && gpsWrap && gpsLink) {
      gpsLink.href = `https://www.openstreetmap.org/?mlat=${exif.gps.lat}&mlon=${exif.gps.lon}#map=14/${exif.gps.lat}/${exif.gps.lon}`;
      gpsWrap.classList.remove("hidden");
    }

    result?.classList.remove("hidden");
  } catch (e) {
    setStatus("");
    setError(e instanceof Error ? e.message : `Couldn't read metadata from ${file.name}.`);
  }
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
  const file = e.dataTransfer?.files?.[0];
  if (file) void handleFile(file);
});

input?.addEventListener("change", () => {
  const file = input.files?.[0];
  if (file) void handleFile(file);
});

pickAgain?.addEventListener("click", () => {
  clearResult();
  input?.click();
});
