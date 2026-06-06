#!/usr/bin/env node
/**
 * Generate PNG favicons + OG image from inline SVG.
 *
 * Run: node scripts/gen-icons.mjs
 *
 * Uses sharp (already used by Astro's image pipeline as a transitive dep).
 * Outputs: favicon-32.png, apple-touch-icon.png (180), icon-192.png,
 * icon-512.png, icon-maskable-512.png, og-image.png (1200x630)
 */
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public");
mkdirSync(outDir, { recursive: true });

// Color palette
const ACCENT = "#60a5fa"; // dark-mode accent — used as fg
const BG_DARK = "#0a0a0a";

// ---- Pixel-grid icon SVG (used for 32/180/192/512) ----
function iconSvg(size) {
  const cell = size / 4;          // 4-unit grid with 1-unit margin
  const margin = cell / 2;
  const s = cell * 0.875;         // 87.5% size for the rounded squares
  const r = s * 0.18;
  const rect = (x, y, op = 1) =>
    `<rect x="${margin + x * cell}" y="${margin + y * cell}" width="${s}" height="${s}" rx="${r}" fill="${ACCENT}" opacity="${op}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${BG_DARK}" rx="${size * 0.15}"/>
    ${rect(0, 0, 0.4)}${rect(1, 0, 0.6)}${rect(2, 0, 0.4)}
    ${rect(0, 1, 0.6)}${rect(1, 1, 1.0)}${rect(2, 1, 0.6)}
    ${rect(0, 2, 0.4)}${rect(1, 2, 0.6)}${rect(2, 2, 0.4)}
  </svg>`;
}

// ---- Maskable icon (safe zone) ----
function maskableSvg(size) {
  // Maskable icons need the "important" content within the inner 80% circle.
  // Pad heavily.
  const inner = size * 0.5;
  const offset = (size - inner) / 2;
  const cell = inner / 4;
  const margin = cell / 2;
  const s = cell * 0.875;
  const r = s * 0.18;
  const rect = (x, y, op = 1) =>
    `<rect x="${offset + margin + x * cell}" y="${offset + margin + y * cell}" width="${s}" height="${s}" rx="${r}" fill="${ACCENT}" opacity="${op}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${BG_DARK}"/>
    ${rect(0, 0, 0.4)}${rect(1, 0, 0.6)}${rect(2, 0, 0.4)}
    ${rect(0, 1, 0.6)}${rect(1, 1, 1.0)}${rect(2, 1, 0.6)}
    ${rect(0, 2, 0.4)}${rect(1, 2, 0.6)}${rect(2, 2, 0.4)}
  </svg>`;
}

// ---- OG image: wordmark + tagline ----
function ogSvg() {
  // 1200x630 — Twitter / OG standard
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${BG_DARK}"/>

    <!-- Pixel-grid icon on left -->
    <g transform="translate(100, 195)">
      ${(() => {
        const cell = 60;
        const s = cell * 0.875;
        const r = s * 0.18;
        const rect = (x, y, op = 1) =>
          `<rect x="${x * cell}" y="${y * cell}" width="${s}" height="${s}" rx="${r}" fill="${ACCENT}" opacity="${op}"/>`;
        return [
          rect(0, 0, 0.4), rect(1, 0, 0.6), rect(2, 0, 0.4),
          rect(0, 1, 0.6), rect(1, 1, 1.0), rect(2, 1, 0.6),
          rect(0, 2, 0.4), rect(1, 2, 0.6), rect(2, 2, 0.4),
        ].join("");
      })()}
    </g>

    <!-- Wordmark + tagline -->
    <text x="380" y="280" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="96" font-weight="900" fill="#fafafa" letter-spacing="-3">HEICPix</text>
    <text x="380" y="360" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="38" font-weight="600" fill="#9ca3af">iPhone HEIC photos → JPG or PNG.</text>
    <text x="380" y="410" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="38" font-weight="600" fill="${ACCENT}">In your browser. Nothing uploads.</text>

    <!-- Footer brand -->
    <text x="1100" y="590" font-family="system-ui, sans-serif" font-size="22" font-weight="500" fill="#6b7280" text-anchor="end">worksoffline.in</text>
  </svg>`;
}

// ---- Pipeline ----
const targets = [
  { name: "favicon-32.png", size: 32, svg: iconSvg(32) },
  { name: "apple-touch-icon.png", size: 180, svg: iconSvg(180) },
  { name: "icon-192.png", size: 192, svg: iconSvg(192) },
  { name: "icon-512.png", size: 512, svg: iconSvg(512) },
  { name: "icon-maskable-512.png", size: 512, svg: maskableSvg(512) },
];

for (const t of targets) {
  const buf = await sharp(Buffer.from(t.svg)).resize(t.size, t.size).png().toBuffer();
  writeFileSync(join(outDir, t.name), buf);
  console.log(`✓ ${t.name} (${t.size}x${t.size})`);
}

// OG image — separate aspect ratio
const ogBuf = await sharp(Buffer.from(ogSvg())).resize(1200, 630).png().toBuffer();
writeFileSync(join(outDir, "og-image.png"), ogBuf);
console.log(`✓ og-image.png (1200x630)`);

// favicon.ico = multi-resolution (16, 32, 48). Sharp can't write .ico
// directly, so write a 32x32 PNG and rename. Modern browsers prefer
// favicon.svg anyway; .ico is for legacy IE/old Edge.
const favIcoBuf = await sharp(Buffer.from(iconSvg(48))).resize(48, 48).png().toBuffer();
writeFileSync(join(outDir, "favicon.ico"), favIcoBuf);
console.log(`✓ favicon.ico (48x48 PNG renamed — browsers don't care)`);

console.log("\nDone. Commit the new public/*.png and the existing favicon.svg.");
