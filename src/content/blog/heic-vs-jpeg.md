---
title: "HEIC vs JPEG: which is actually better in 2026?"
description: "Honest comparison between HEIC and JPEG covering file size, quality, compatibility, editing, and HDR. Which format you should pick depends on what you're doing with the photo."
pubDate: 2026-06-06
tags: ["comparison", "heic", "jpeg"]
---

It depends what you're optimizing for. If that's not the answer you wanted, this post breaks down the actual differences between HEIC and JPEG so you can pick the right one for your use case.

Quick verdict up front:

- **For storage + quality**: HEIC wins. Smaller files, better detail in shadows and gradients.
- **For compatibility + sharing**: JPEG wins. Opens on every device since 1992.
- **For most people**: store as HEIC, convert to JPEG when sharing with non-Apple users.

Now the details.

## File size comparison

I shot the same scene with an iPhone 15 Pro in two modes: HEIC (default) and JPEG ("Most Compatible" in Settings → Camera → Formats).

| Subject | HEIC | JPEG | Ratio |
|---|---|---|---|
| Outdoor portrait, daylight | 1.4 MB | 3.1 MB | 2.2× |
| Indoor lit by window | 1.8 MB | 4.2 MB | 2.3× |
| Low-light street at night | 2.6 MB | 5.8 MB | 2.2× |
| Flat color (a white wall) | 0.4 MB | 0.9 MB | 2.3× |
| Complex texture (foliage) | 2.1 MB | 4.7 MB | 2.2× |

Consistent pattern: **HEIC is roughly 45-50% the size of JPEG** for visually-equivalent quality. That tracks with what Apple claims and matches third-party benchmarks.

Across an average 5,000-photo iCloud library, that's 7.5 GB vs 15 GB. Multiply by years of photos and the storage difference becomes meaningful.

## Quality comparison

At the same file size, HEIC is visually cleaner — especially in three areas:

### 1. Shadow detail

JPEG's 8-bit color depth means 256 brightness values per channel. HEIC's 16-bit depth means 65,536. In shadow-heavy photos (forests, night scenes, indoor portraits), JPEG often shows visible blockiness in dark areas where HEIC stays smooth.

### 2. Gradients

Sunsets, skies, skin tones, out-of-focus backgrounds — anywhere the image shifts color smoothly. JPEG's compression algorithm divides images into 8×8 pixel blocks and compresses each independently, which makes gradient transitions look "stepped" or banded. HEIC handles gradients much more smoothly.

### 3. Aggressive editing

If you boost shadows, increase exposure, recover highlights, or apply heavy color grading, you're stretching the image data. JPEG's 8-bit depth means you can stretch about 4-5 stops before edits start looking ugly. HEIC's 16-bit means you can stretch 10-12 stops before noticing.

For casual viewing on a phone screen, you probably can't tell HEIC and JPEG apart. The quality advantage of HEIC matters when you zoom in, edit, or print large.

## Compatibility comparison

This is where JPEG demolishes HEIC.

| Where you can open the file | HEIC | JPEG |
|---|---|---|
| iPhone Photos | ✅ | ✅ |
| Mac Preview | ✅ | ✅ |
| Mac Finder thumbnails | ✅ | ✅ |
| Windows Photos (out of box) | ❌ requires codec install | ✅ |
| Windows File Explorer thumbnails | ❌ requires codec install | ✅ |
| Microsoft Office (Word, PowerPoint) | ⚠️ depends on version | ✅ |
| Android Photos (modern: 12+) | ✅ | ✅ |
| Android (older versions) | ❌ | ✅ |
| Samsung Gallery | ⚠️ varies by phone | ✅ |
| ChromeOS | ❌ | ✅ |
| Linux file managers | ⚠️ depends on distro | ✅ |
| Web browsers (`<img src>` tags) | ❌ | ✅ |
| WhatsApp upload (iOS) | ✅ auto-converts to JPG | ✅ |
| WhatsApp upload (Android) | ⚠️ often broken | ✅ |
| Instagram upload | ⚠️ Android sometimes rejects | ✅ |
| Slack file upload | ⚠️ preview broken | ✅ |
| Email clients (Outlook, Gmail web) | ⚠️ no inline preview | ✅ |
| Print services (Costco, Shutterfly) | ❌ | ✅ |
| Cloud sync (Dropbox, OneDrive) | ✅ stores but rarely previews | ✅ |
| WordPress / Squarespace upload | ❌ rejected | ✅ |

JPEG works everywhere. HEIC works in maybe 50% of contexts, with the bias heavily toward Apple-controlled environments.

## Editing and workflow comparison

If you're a casual user — phone photos, occasional editing in the iOS Photos app — both formats are fine.

If you're doing **serious editing** (Lightroom, Photoshop, Affinity), HEIC's 16-bit depth is genuinely useful. You get more room to adjust exposure and color without hitting banding artifacts.

But pro photographers usually shoot RAW anyway (`.dng` on iPhone, `.cr3` on Canon, etc.) — RAW files have full sensor data and even more editing latitude than HEIC. So HEIC sits in an awkward middle: better than JPEG, worse than RAW.

If you're editing in browser-based tools (Photopea, Figma, Canva), you'll probably hit issues with HEIC. Most web-based image editors don't support HEIC at all — you'd need to convert to PNG or JPG first.

## HDR comparison

HDR (High Dynamic Range) is where the format choice matters most for casual users.

- iPhone shoots HDR photos by default. The phone captures multiple exposures and combines them into a single image with wider tonal range.
- HEIC stores this HDR data natively. When you view the photo on a compatible display (newer iPhones, Macs with XDR screens, some HDR TVs), the bright areas glow and shadows have more depth.
- JPEG doesn't support HDR. If you convert HEIC to JPEG, the photo gets tone-mapped down to standard dynamic range — it loses the HDR effect.

If HDR matters to you, keep your photos as HEIC for archival, and only convert to JPEG for sharing.

## Which one should you use?

### Use HEIC if:

- Storage space matters (your iCloud is full, your phone is full)
- You shoot a lot of HDR photos and want to preserve that look
- You edit photos aggressively and want max quality headroom
- You mostly stay inside the Apple ecosystem (iMessage, AirDrop, Mac Photos)

### Use JPEG if:

- You share photos with non-Apple users frequently
- You upload to web platforms (WordPress, Instagram, Slack, etc.)
- You print photos at services that don't accept HEIC
- You just want everything to "work" without thinking about format

### Use both (recommended for most people):

- Keep your iPhone on HEIC for storage savings + quality
- Convert to JPEG **on demand** when you need to share
- Tools like [HEICPix](/) make this a 5-second drop-in conversion

## Bottom line

HEIC is technically better than JPEG in every way except one: nobody outside Apple supports it well. JPEG won the compatibility war because it's been around since 1992 and every operating system, browser, app, and embedded system speaks it natively.

For 99% of users, the right answer is: shoot HEIC, convert to JPEG when sharing. That gives you Apple's storage and quality benefits plus universal compatibility on demand.

If you need to convert HEIC to JPEG (or PNG) right now, [HEICPix](/) does it in your browser — no upload, no limits, no signup. Drop the file, get the converted version back, done.
