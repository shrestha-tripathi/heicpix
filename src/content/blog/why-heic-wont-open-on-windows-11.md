---
title: "Why HEIC won't open on Windows 11 (and the actual fix)"
description: "Diagnosis of every reason Windows 11 can't open iPhone HEIC photos by default — codec extensions, paid HEVC, file association quirks — and the one fix that works everywhere."
pubDate: 2026-06-08
tags: ["windows", "heic", "troubleshooting"]
---

You double-clicked an iPhone photo on your Windows 11 PC and got "Windows Photos can't open this file." Or worse — a generic icon and "no preview available."

Here's why, and the one fix that always works.

## The short answer

Windows 11 ships **without** the HEIC codec. Microsoft offers HEIF Image Extensions in the Store (free), but reliably opening every HEIC variant also needs HEVC Video Extensions ($0.99). Even after installing both, some HEIC variants (Live Photos, depth-effect portraits) still misbehave.

**The reliable fix:** convert HEIC to JPG once. Then Windows opens it forever, in every app, on every laptop.

Drop your iPhone photos here: [open the HEIC converter](/) — 30 seconds, runs in your browser, nothing uploads.

## Why this is so confusing in 2026

Microsoft has spent years trying to "fix" HEIC support on Windows. Here's the actual state of play:

### 1. HEIF Image Extensions

A free Microsoft Store package. Installing it makes Windows Photos *display* HEIC thumbnails and previews. But:

- It only handles still images, not variants like Live Photos
- Some Windows 11 builds silently fail to register the codec system-wide — Photos works, File Explorer doesn't
- Pasting HEIC into Word, PowerPoint pre-365, or any third-party app still fails

### 2. HEVC Video Extensions

The companion package. Costs $0.99. Required for HEIC variants that include depth or motion data — many iPhone Portrait mode shots, Live Photos, and burst frames.

Yes — for "image" support, you have to install a "video" codec. Microsoft has been promising to merge these since 2020.

### 3. The OEM exception

If you bought a Dell, HP, Lenovo, or other major OEM laptop, HEVC Extensions came pre-installed for free (Microsoft offers a free OEM-bundled SKU). But if you reformatted or built your own PC, you'll be asked to pay.

### 4. After all that — third-party apps still fail

Even with both codecs installed, the HEIC file remains HEIC. The moment you:

- Email it
- Upload it to a website
- Drop it into Slack / Discord / Teams
- Open it in Photoshop pre-2024, Lightroom pre-12, GIMP, anything older

…it stops working on the receiving end. The codec on YOUR PC only helps YOUR PC view it.

## The clean fix

Convert to JPG once. JPG works:

- Everywhere on Windows (no codec needed)
- In every email client, browser, chat app, and image editor on the planet
- For the recipient when you share it (no "install this codec" message)

Use [{site.name}](/) — drop the HEIC in, pick JPG, download. Nothing uploads. Done.

## Why convert in-browser vs install a desktop app?

You *could* install a desktop converter (CopyTrans HEIC, iMazing, Adobe Bridge). They work fine. But:

- Most cost money or come bundled with adware
- IT-managed laptops often block .exe installs
- One-time conversions don't justify permanent software

A 200-photo browser conversion takes ~30 seconds and leaves nothing behind. Faster than the install.

## Long-term: stop iPhone from creating HEIC

If you regularly receive HEIC from an iPhone user, ask them to flip one setting:

> Settings → Camera → Formats → "Most Compatible"

Their iPhone will start saving new photos as JPG instead of HEIC. Old photos stay HEIC — convert those once with [{site.name}](/) and you're done.

## The TL;DR table

| Symptom | Cause | Fix |
|---|---|---|
| "Windows Photos can't open this file" | No HEIC codec installed | Install HEIF Extensions OR convert to JPG |
| Photo opens in Photos but missing in File Explorer thumbnails | Codec installed but not registered system-wide | Restart File Explorer, or convert to JPG |
| Some HEICs work, some don't | Live Photos / Portrait need HEVC codec ($0.99) | Pay $0.99, or convert to JPG |
| Recipient can't open the photo you sent | Their PC has no codec either | Convert to JPG before sending |
| Slack/Word/Photoshop won't accept the file | App-level HEIC blocklist | Convert to JPG |

Notice the pattern? "Convert to JPG" solves every row.

[Drop your iPhone HEICs into the converter →](/)
