---
title: "iPhone photos won't open on Android: the actual reason and the 30-second fix"
description: "Samsung Galaxy, Google Pixel, OnePlus, and other Android phones often can't preview iPhone HEIC files even on Android 10+. Here's why, and how to fix it without installing anything."
pubDate: 2026-06-08
tags: ["android", "iphone", "heic"]
---

You opened a WhatsApp photo from your iPhone friend, and your Samsung Galaxy showed "couldn't load image." Or you tried to forward an AirDropped photo from your iPhone-using sister and your Pixel rejected it. The reason is HEIC, and the fix takes 30 seconds.

## The short answer

Android **does** support HEIC natively since Android 10 (2019). But:

- Many older Android phones (Android 9 or earlier) don't
- Several Samsung Gallery apps can't render HEIC even on newer Android builds
- WhatsApp on Android often fails to preview HEIC attachments
- Cloud uploads (Dropbox, OneDrive) preserve HEIC, so the recipient hits the same wall
- Third-party apps (file managers, image editors) often skip HEIC entirely

Convert iPhone photos to JPG once — works on every Android phone, in every app. Use [{site.name}](/) in your phone's browser, no install needed.

## Why this happens

HEIC (High Efficiency Image Container) is Apple's wrapper around the HEVC codec. While Android 10+ technically supports HEVC decoding for video, the situation for HEIC stills is messier:

### 1. OS-level support exists, app-level support doesn't

Google added system HEIF support in Android 10. But every app has to opt in — and many didn't bother. The result: your Files app on Android 12 might preview HEIC fine, while WhatsApp on the same phone refuses to.

### 2. Samsung's Gallery app is its own thing

Samsung ships its own Gallery (not Google Photos) on Galaxy devices. For years, that app couldn't render HEIC at all. Recent Samsung devices fixed this, but plenty of older ones haven't gotten the update — or never will (devices stop getting Samsung software updates after ~3 years).

### 3. Patent royalties

HEVC (the codec inside HEIC) requires patent royalties to MPEG-LA. Apple paid for that. Android OEMs picked and chose: some pay, some don't, some patch in support after the device ships. Inconsistent across phones, even within the same Android version.

### 4. WhatsApp's preview pipeline

WhatsApp's media pipeline generates previews server-side. Until recently, WhatsApp's server-side preview pipeline didn't handle HEIC. So the file got uploaded fine, but the preview thumbnail was broken — and the Android client showed "couldn't load image" instead of falling back to the full file.

## The fix (no install)

Open [{site.name}](/) in your phone's browser. Pick the HEIC from your camera roll. Pick JPG. Download. Share to whoever, in whatever app — works everywhere.

It runs entirely in your browser (no upload, no signup, no Play Store install), so it works on Samsung Internet, Chrome, Firefox, Edge — every Android browser.

## Install it as an Android app (optional)

If you fix HEIC files regularly, install {site.name} as a Progressive Web App:

1. Open [{site.name}](/) in Chrome
2. Tap the three-dot menu → "Add to Home screen"
3. Confirm

Now {site.name} appears in your **Share** sheet on Android. Long-press a HEIC anywhere, tap Share, tap {site.shortName} — the file lands in the converter automatically.

## Long-term fix: stop the iPhone sender

If you keep getting HEIC from the same iPhone user, ask them to:

> Settings → Camera → Formats → **Most Compatible**

That makes their new photos save as JPG, which all Androids handle natively. Existing HEICs they've already taken still need [conversion](/) — that toggle only affects future captures.

## Quick reference: when Android handles HEIC vs when it doesn't

| Scenario | Works? |
|---|---|
| Android 10+ Files app | ✓ Usually |
| Android 10+ Google Photos | ✓ |
| Android 10+ WhatsApp preview | ✗ Often broken |
| Android 10+ Samsung Gallery (older Samsung) | ✗ |
| Android 9 or earlier | ✗ |
| Android sharing HEIC to another Android app | ✗ Often fails |
| Android with HEIC file → JPG → any app | ✓ Always |

The pattern: convert HEIC to JPG once, and the file just works everywhere on Android.

[Open {site.name} on your Android browser →](/)
