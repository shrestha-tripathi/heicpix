---
title: "HEIC vs JPG: file size, quality, compatibility — when to use each"
description: "Real-world test: same iPhone shot saved as HEIC vs JPG. Compare file size, visual quality, compatibility, and editing workflow. Plus the decision rule for which to use when."
pubDate: 2026-06-08
tags: ["heic", "jpg", "comparison"]
---

You shoot iPhone photos. They save as HEIC by default. Should you keep them as HEIC or convert them all to JPG? Here's the honest comparison — file size, visual quality, where each works, and the simple decision rule.

## TL;DR

| Dimension | HEIC | JPG |
|---|---|---|
| File size (12 MP photo) | ~1.5 MB | ~3 MB |
| Visual quality | Same | Same |
| iPhone / Mac support | ✓ Native | ✓ Native |
| Windows / Android support | Patchy | ✓ Native |
| Slack / Discord / WhatsApp / WordPress | ✗ Issues | ✓ Universal |
| Photoshop / Lightroom / GIMP | ✓ Modern versions | ✓ Universal |
| Year invented | 2017 | 1992 |

**Default rule:** keep HEIC for iPhone-only photo libraries. Convert to JPG before sharing or uploading externally.

## File size: HEIC wins by 2×

A typical 12-megapixel iPhone photo:

- HEIC: 1.4 – 1.8 MB
- JPG (iOS default quality): 2.5 – 3.5 MB
- PNG (lossless): 8 – 15 MB

HEIC uses HEVC (the same codec as H.265 video) for image compression. It's more efficient than JPG's 1992-era DCT algorithm. The bigger the photo, the more dramatic the savings — a 48 MP iPhone Pro Max photo can be 5 MB as HEIC vs 12 MB as JPG.

For an iPhone user with 30,000 photos, that's the difference between 45 GB and 90 GB of storage. Significant.

## Visual quality: identical at normal viewing

At any normal viewing distance, you cannot tell a HEIC from a JPG of the same photo. Both use lossy compression; both are tuned to be visually transparent at default quality.

If you pixel-peep at 400% zoom:

- HEIC handles smooth gradients (sky, skin) slightly better
- JPG handles sharp edges (text, geometric patterns) slightly better
- Differences are imperceptible for natural photography

The real quality differences only show up if you save at *low* quality (Q=0.5 or below) — but at that point you're losing detail in both formats.

## Compatibility: JPG wins, badly

This is where HEIC's "smaller and better" pitch falls apart in 2026:

### Where HEIC works perfectly
- iPhone / iPad Photos app
- Mac Photos / Preview
- AirDrop between Apple devices
- iCloud Photo Library
- Adobe Lightroom 9+ / Photoshop 2024+
- Modern Android (10+) — but with caveats (see [our Android post](/blog/iphone-photos-wont-open-on-android))

### Where HEIC fails
- Windows by default (codec install required)
- Older Android (9 and below)
- Samsung Gallery on older Galaxy phones
- WhatsApp previews (often broken)
- Slack file uploads
- Discord previews (uploads but no thumbnail)
- WordPress media library (blocked)
- Canva uploads (rejected)
- Old emails, old browsers, any app last updated before ~2020

### Where JPG works
- Everywhere. Literally everywhere. JPG predates the iPhone by 15 years and ships in every operating system, every browser, every image library, every social platform.

## Editing: tied, but JPG is safer

Modern photo editors (Lightroom, Photoshop, Capture One, Affinity Photo) all handle HEIC. So do iPad apps (Procreate, Pixelmator). Both formats are lossy, so editing-then-saving slightly degrades quality each time — that's true of HEIC and JPG equally.

The difference: JPG works in **every** app, including ones that haven't been updated since 2020. If you collaborate with anyone running older software, JPG removes the risk.

## When to use HEIC (keep as-is)

- All your photos stay on iPhone / iCloud / Mac
- You're storage-constrained on your iPhone
- You don't share photos to non-Apple platforms
- You shoot a lot (HEIC's storage savings are real and add up)

## When to convert to JPG

- You're about to upload to Slack / Discord / Outlook / WordPress / Canva
- You're sending to an Android friend
- You're sending to anyone on Windows
- You're posting publicly (Twitter, LinkedIn, blog comments)
- You're attaching to email
- You're editing in older software
- You want one file that works everywhere

[Convert your HEICs to JPG now →](/) — runs in your browser, nothing uploads.

## The Goldilocks alternative: WebP

If you're uploading to your own website, **WebP** is the actual best choice:

- Smaller than JPG (closer to HEIC sizes)
- Compatible with every modern browser since 2020
- Supported by WordPress 5.8+, Canva uploads, Cloudflare image CDN, every modern hosting platform

WebP gives you HEIC's compression efficiency with JPG-level compatibility. [Use the HEIC → WebP converter](/heic-to-webp) if you're publishing on your own site.

## What about AVIF?

AVIF is even smaller than WebP (~30% smaller than JPG at the same quality). But browser support is patchier — Chrome 124+, Firefox 113+, Safari 17.4+. Use it for the cutting-edge case where your audience is on modern browsers and you want minimum file size. [HEIC → AVIF converter](/heic-to-avif).

## TL;DR rule of thumb

- **iPhone-only library?** Keep HEIC.
- **Sharing anywhere outside Apple?** Convert to JPG.
- **Uploading to your own site?** Convert to WebP (or AVIF if you're confident in your audience).

That's it. Don't overthink it.

[Drop your iPhone HEICs in the converter →](/)
