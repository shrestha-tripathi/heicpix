---
title: "Can't open HEIC files? Here's why — and how to fix it on every platform"
description: "Troubleshooting guide for the 'can't open HEIC file' error on Windows, Mac, Android, Chromebook, and WhatsApp. Five paths to a working photo, ranked by effort."
pubDate: 2026-06-06
tags: ["troubleshooting", "heic"]
---

You got sent a `.heic` file. Your computer says "can't open." Or your gallery app shows a broken-image icon. Or WhatsApp won't preview it. This post walks through *why* this happens and gives you five concrete fixes ranked from "fastest" to "most permanent."

If you just want the fix without the explanation, skip to **Solution #1** below.

## Why this is happening

HEIC files use a video codec called HEVC for compression. Apple invented HEIC, ships it everywhere by default, and pays the patent fees for HEVC. Most non-Apple software vendors chose not to pay those fees — so your Windows / Android / Chromebook / browser doesn't include the codec.

When you try to open the file, the software sees `.heic`, recognizes the extension, looks for a decoder, doesn't find one, and gives up. The fix is either to **add the decoder** (one-time setup, somewhat painful) or **convert the file** (instant, repeatable).

Now the solutions, in order of effort:

## Solution #1: Convert in your browser (15 seconds, no install)

Open [HEICPix](/) in any browser. Drop the `.heic` file in. Get a JPG back. Done.

This works on every device — Windows, Mac, Android, iPhone, Chromebook, Linux — because the conversion happens inside the browser via WebAssembly. You don't install anything, don't sign up, don't upload your photo anywhere.

Best for: you have one or a few HEICs to deal with, or you don't want to install codecs.

## Solution #2: Email it to yourself from an iPhone (30 seconds)

If you have access to an iPhone (yours or someone else's), email the HEIC photo to yourself with the iCloud setting "Mail Drop" enabled. iCloud converts HEIC to JPG automatically during email send.

iPhone Settings → Photos → Transfer to Mac or PC → "Automatic" makes HEIC convert when transferred over USB too.

Best for: you have an iPhone available and prefer to handle conversion at the source.

## Solution #3: Install the HEIF codec on Windows (5 minutes, persistent)

If you're on Windows 10/11 and receive HEIC files frequently:

1. Open Microsoft Store
2. Search "HEIF Image Extensions" → install (free)
3. Search "HEVC Video Extensions" → install ($0.99, needed for some HEIC variants)
4. Restart Photos app

Now Windows Photos opens `.heic` directly. File Explorer shows thumbnails. Apps that use Windows' image-decoding pipeline (Paint, PowerPoint) can read HEIC.

But: many apps don't use Windows' decoder. You'll still hit walls in Office 2019, third-party photo viewers, web-based tools, etc. So this fix solves "open in Photos" but doesn't solve everything.

Best for: Windows user who wants Photos to open HEIC without conversion every time.

## Solution #4: Set your iPhone to stop saving HEIC (1 minute, prevents future issues)

If the HEIC files came from your own iPhone, change your camera setting so new photos save as JPG:

iPhone Settings → Camera → Formats → "Most Compatible"

This affects **new** photos only — existing HEICs stay as HEIC. Your photos will be roughly 2× larger after the switch, but they'll open everywhere instantly.

Best for: you're constantly hitting HEIC compatibility issues with your own photos.

## Solution #5: Install HEIC support on Android (varies by phone)

Modern Android (12+) on Pixel and Samsung Galaxy phones supports HEIC natively. If you're on an older Android or a budget phone, you'll need an app:

- **Google Photos** (free, preinstalled on most Androids) — opens HEIC and converts on download
- **Adobe Bridge** (Play Store) — heavy but reliable
- **Various "HEIC Viewer" apps** — most are ad-supported, some are sketchy with permissions

Avoid free HEIC apps on Play Store unless they explicitly say "no internet permission needed" — many quietly upload your photos to ad-tracking servers.

Best for: Android user who handles HEIC files frequently.

## Platform-specific quick reference

### Windows
- **Quick**: Convert via [HEICPix](/) → universal JPG
- **Permanent**: Install HEIF + HEVC extensions from Microsoft Store
- **Bonus**: Try [HEIC to JPG on Windows](/heic-to-jpg-windows) for the detailed walkthrough

### Mac
- HEIC opens natively in Preview, Photos, Finder thumbnails — no fix needed
- Problem appears when sharing to non-Mac users → convert before sharing
- See [HEIC to JPG on Mac](/heic-to-jpg-mac)

### Chromebook
- ChromeOS doesn't support HEIC at all
- Fastest fix: [HEICPix](/) — runs in Chrome, no extension needed
- See [HEIC on Chromebook](/heic-to-jpg-chromebook)

### Android
- Modern Android (12+ on Pixel/Samsung S22+) opens HEIC natively
- Older Android: convert via [HEICPix](/) or install Google Photos
- See [HEIC on Android](/heic-to-jpg-android)

### WhatsApp
- WhatsApp on iOS auto-converts HEIC to JPG during send
- WhatsApp on Android sometimes fails on HEIC uploads
- Safest path: convert via [HEICPix](/) first, then send the JPG

### Instagram
- Same as WhatsApp — iOS auto-converts, Android sometimes rejects
- Convert before posting if you're on Android

### Email (Outlook, Gmail web, Yahoo)
- No inline preview for HEIC attachments
- Recipient sees an unopenable attachment
- Always convert HEIC → JPG before emailing to non-Apple users

## TL;DR

The fastest fix for any "can't open HEIC" problem is to drop the file into [HEICPix](/), wait a second, download the JPG. Works on every device, no install, no upload.

If you're constantly hitting this issue, the long-term fix is either:
- Change your iPhone to save JPG (iPhone Settings → Camera → Formats → Most Compatible)
- Install HEIF codec on Windows (Microsoft Store → HEIF Image Extensions)

Either way, having [HEICPix](/) bookmarked means you've always got the fallback when nothing else works.
