---
title: "Why iPhone saves HEIC by default (and the one Settings toggle that stops it)"
description: "iPhone has been saving HEIC instead of JPG since iOS 11. The why, what you lose by switching to 'Most Compatible' mode, and exactly which Settings toggle to flip."
pubDate: 2026-06-08
tags: ["iphone", "heic", "settings"]
---

If you've ever AirDropped a photo to a friend's Android phone and they said "I can't open it" — that's HEIC. iPhone has been saving photos as HEIC instead of JPG by default since iOS 11 (September 2017). Here's the why, what changing it actually costs, and the one toggle to switch.

## The one-line fix

> Settings → Camera → Formats → **Most Compatible**

That's it. New photos save as JPG. Existing HEICs still need [conversion](/) — that toggle only affects future captures.

## Why does iPhone save HEIC in the first place?

HEIC stands for High Efficiency Image Container. It's Apple's photo wrapper around the HEVC video codec (yes, the same codec used for H.265 video).

The pitch is simple: HEIC files are roughly **50% smaller** than JPG at the same visual quality.

On an iPhone with 50,000 photos, that's the difference between 100 GB and 50 GB of storage. Apple flipped HEIC on by default because it saved their users — and Apple's iCloud servers — enormous amounts of space.

## What you lose by switching back to JPG

| What changes | Magnitude |
|---|---|
| File size | ~2× bigger photos |
| Storage on phone | Future photos take 2× space |
| iCloud sync | 2× bandwidth, 2× space |
| AirDrop / share | Slightly slower upload |
| Visual quality | **Zero change** — JPG at default iPhone quality looks identical |
| HDR / Live Photo support | Live Photo still works; HDR still works |

You don't lose anything visually. You just consume more storage. For most users, that's a fair trade for "every photo I take just works everywhere."

## What you gain by switching back to JPG

| What gains | Why it matters |
|---|---|
| Send to Android | They can preview without converting |
| Upload anywhere | Slack, Discord, WordPress, Canva, Outlook — all accept JPG natively |
| Open on Windows | No codec install needed |
| Edit in older apps | Word 2016, Photoshop CS6, GIMP all work |
| Send via Gmail / WhatsApp | Recipients see inline preview |
| AirDrop to Mac | No codec friction (Mac handles both, but JPG just works) |

If you're an iPhone user whose friends, family, or coworkers use Android, Windows, or older software — JPG removes a lot of friction.

## What about photos I've already taken?

Switching the format setting **doesn't convert** anything already saved. Existing HEICs stay HEIC.

For those: drop them into [{site.name}](/) — it converts in your browser, with no upload, no signup, and supports JPG / PNG / WebP / AVIF output.

## Should you switch?

| You are | Recommendation |
|---|---|
| iPhone user, everyone you share with also has iPhone / Mac | Keep HEIC (storage savings) |
| iPhone user, you regularly share with Android / Windows | Switch to JPG ("Most Compatible") |
| iPhone user, you upload a lot to WordPress / Canva / Slack | Switch to JPG |
| Storage-constrained iPhone | Keep HEIC (50% storage savings is huge) |
| Take 1000+ photos a year | Switch to JPG and stop converting forever |

## Bonus: what about screen recordings + video?

The same Settings → Camera → Formats screen also has a "Most Compatible" choice for video. Without it, iPhone records video as HEVC (H.265) — which has the same compatibility problem.

If you ever Send-Anywhere a video to a Windows friend and they can't play it, that's HEVC. The same toggle fixes both photos and videos.

## TL;DR

- iPhone defaults to HEIC because it saves ~50% storage
- Switching to "Most Compatible" makes new photos save as JPG
- Old photos stay HEIC — [convert them in your browser](/)
- Quality difference is invisible; the storage cost is real but minor
- If you share with non-Apple users often: switch. If everyone you know has an iPhone: don't bother.

[Convert your existing HEICs →](/)
