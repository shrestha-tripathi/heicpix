---
title: "What is HEIC? The iPhone photo format explained (without the jargon)"
description: "HEIC is the photo format iPhones use by default. Here's what it actually is, why Apple picked it, and what to do when non-Apple devices can't open it."
pubDate: 2026-06-06
tags: ["explainer", "heic", "image-formats"]
---

If you've ever AirDropped a photo to a friend, only to hear "I can't open this — it's a `.heic` file?" — this post is for you.

HEIC is the photo format every iPhone uses by default since iOS 11 (released 2017). It's not new, but it's quietly broken for everyone who doesn't use Apple devices. Let's unpack what it actually is, why Apple chose it, and what to do when you need a universal format.

## What HEIC stands for

HEIC = **High Efficiency Image Container**.

The container holds image data encoded with the **HEVC codec** (also known as H.265). HEVC is the same compression standard used for 4K Blu-ray, Apple TV+ streaming, and most modern digital cinema. Apple took that video codec, applied it to single still images, and called the result HEIC.

There's also **HEIF** (High Efficiency Image Format), which is the parent standard. HEIC is Apple's specific HEIF-with-HEVC variant. For practical purposes the two are the same — your iPhone saves as `.heic`, but a `.heif` file from somewhere else opens in the same apps.

## Why Apple chose HEIC

Three reasons, ranked by how much Apple actually cares about them:

### 1. File size

HEIC files are roughly **half the size** of equivalent-quality JPGs. A 12-megapixel photo from your iPhone is about 1-2 MB as HEIC, vs 3-4 MB as JPG. Across 5,000 photos on your camera roll, that's the difference between 7.5 GB and 15 GB of iCloud storage. Apple charges you per GB of iCloud, so they're motivated to make photos small.

### 2. Quality

HEIC supports **16-bit color depth** (vs JPEG's 8-bit), which means it stores 256× more color values per channel. For HDR photos, low-light shots, and gradients (think sunsets), HEIC preserves smoother transitions and richer shadow detail. JPEG often shows visible banding in skies and skin tones where HEIC doesn't.

In practice, at the same file size, HEIC looks measurably cleaner. At maximum quality, both look indistinguishable to the human eye on a phone screen — but if you ever zoom into a shadow, edit the photo aggressively, or print it large, HEIC has more data to work with.

### 3. Future features

HEIC can store multiple images in one file. That's how Live Photos work (still + 3 seconds of motion), how Burst photos work (10 frames in one container), and how Apple's portrait-mode depth maps work (RGB photo + a separate depth channel). JPEG can't do any of this — Apple would have to invent a parallel format or kludge it with multiple files.

By going with HEIC, Apple set themselves up for richer photo features without needing a separate "Live JPG" or "Portrait JPG" format every time they shipped something new.

## Why everyone else can't open HEIC

The HEVC codec inside HEIC has **patent licensing costs**. The patent pool (MPEG LA + others) charges licensing fees to anyone who ships software that decodes HEVC. Apple pays these fees because they're already paying for the same codec in their video products.

Microsoft, Google, and most browser vendors didn't want to pay the licensing — so they shipped their photo apps and operating systems without HEIC support. The result:

- **Windows 10/11**: Photos app shows "Format not supported" unless you install paid "HEIF Image Extensions" from the Microsoft Store
- **ChromeOS**: Gallery app refuses to open `.heic`
- **Android (older versions, many manufacturers)**: HEIC support varies — Pixel 6+ and Samsung Galaxy S22+ work, others don't
- **Web browsers** (Chrome, Firefox, Safari for non-Apple sites): can't render HEIC inline — `<img src="photo.heic">` shows a broken icon
- **WhatsApp on Android**: often fails to preview HEIC attachments
- **Email clients** (Outlook, Thunderbird, Yahoo): no thumbnail, refuse to inline-display

So even though HEIC is technically superior to JPG, sharing one with a non-Apple user is basically broken.

## What to do about it

If you want to keep HEIC's storage savings but be able to share with non-Apple users on demand, you have three options:

### Option 1: Change your iPhone to save JPG by default

Settings → Camera → Formats → "Most Compatible". New photos save as JPG, lose Apple's storage savings, but work everywhere instantly.

Best for: people who share photos frequently with non-Apple users.

### Option 2: Use iCloud's automatic conversion

When you share via Mail or AirDrop to a non-Apple device, iCloud converts to JPG automatically. When you upload to iCloud Photos and download via the web, you get JPGs. This works invisibly most of the time.

Best for: most casual users — you'll only notice HEIC issues when sharing outside Apple channels (WhatsApp, USB transfer, third-party apps).

### Option 3: Convert HEIC to JPG when you need to

Keep HEIC as your default (save the storage space), but convert specific files when sharing. This is where [HEICPix](/) comes in — drop a HEIC, get a JPG or PNG back, no upload, no signup, no limits.

Best for: people who want the storage + quality benefits of HEIC but occasionally need a portable file.

## TL;DR

- **HEIC** is Apple's photo format since 2017 — half the size of JPG, better quality, supports Live Photos / Portrait / Burst
- **Everyone else** (Windows, Android, web) can't open it natively because the underlying HEVC codec has patent fees
- **Fix**: change your iPhone to save JPG, or convert HEIC to JPG when you need to share

If you've got HEIC files you can't share, drop them into [HEICPix](/) and get JPGs back in seconds. Free, unlimited, runs in your browser.
