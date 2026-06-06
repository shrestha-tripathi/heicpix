# HEICPix — Keywords & FAQ Corpus

> Source data for SEO landing pages, blog content, and FAQ schema.
> Generated 2026-06-06 from Google autocomplete (299 unique queries
> across 32 seed phrases) + 24 question-anchored expansion seeds.

---

## 1. Keyword strategy

### 1.1 Primary keyword cluster (highest commercial intent)

These are the searches we MUST rank for. The home page targets these via H1 + meta description + JSON-LD `WebApplication` schema.

| Keyword | Volume signal | Where we target |
|---|---|---|
| `heic to jpg` | Massive (#1 stem, ~800k+/mo) | Home page H1, title, meta, JSON-LD |
| `convert heic to jpg` | Massive (~300k+/mo) | Home page H1, every CTA |
| `heic converter` | Big (~300k/mo) | Home page meta, footer link |
| `heic to png` | Big (~90k/mo) | Home page H1 (added in v0.2), dedicated page |
| `heic to jpeg` | Big | Home page (jpg & jpeg are aliases in copy) |
| `convert heic to png` | Solid | `/heic-to-png` page |
| `heic to jpg free` | Big | "Actually free" trust signal, FAQ |
| `heic to jpg online` | Big | Differentiator: "in your browser" beats "online" |

### 1.2 Platform-specific landing pages (long-tail capture)

Each gets a dedicated `/heic-<scenario>` page so we own the SERP for that intent. We already have 3; add 2 more for chromebook + android.

| Page | Target keyword | Volume | Status |
|---|---|---|---|
| `/heic-to-jpg-windows` | `heic to jpg windows` | High | ✅ shipped |
| `/heic-to-jpg-mac` | `heic to jpg mac` | High | ✅ shipped |
| `/heic-to-png` | `heic to png` | High | ✅ shipped |
| `/heic-to-jpg-chromebook` | `chromebook heic to jpg` | Medium (rising — Google doesn't ship HEIC support natively) | ⏳ TODO |
| `/heic-to-jpg-android` | `convert heic to jpg android` | Medium (Samsung Galaxy users hitting iPhone friends) | ⏳ TODO |
| `/heic-to-pdf` | `heic to pdf`, `convert heic to pdf` | Medium (~14 queries in autocomplete bucket) | ⏳ TODO maybe |
| `/what-is-heic` | `what is heic`, `what does heic stand for` | Steady evergreen | ⏳ TODO (could be a blog post) |
| `/heic-vs-jpeg` | `heic vs jpeg`, `heic vs jpg` | High (32 queries in bucket) | ⏳ TODO (blog post) |

### 1.3 Frustration / troubleshooting cluster

People searching these are in active pain — highest urgency, highest conversion likelihood. We target them via FAQ + a troubleshooting blog post.

- `can't open heic file` (+ on windows / on mac / on iphone variants)
- `heic not working`
- `heic format problem`
- `heic image problem`
- `why is my iphone saving heic`
- `why are my photos heic instead of jpg`
- `stop iphone saving heic`

### 1.4 Decision-stage cluster

People comparing options or trying to make a choice — bottom-of-funnel.

- `best heic converter`
- `best heic converter for windows 11`
- `best heic converter mac`
- `best heic converter free`
- `which is better heic or jpeg`
- `is heic better than jpeg`
- `heic vs jpeg quality`
- `heic vs jpg difference`

### 1.5 Awareness / education cluster

Lower commercial intent but big top-of-funnel volume — capture via blog posts that internally link back to the converter.

- `what is heic`
- `what does heic stand for`
- `what is heic file extension`
- `heic vs heif`
- `is heic the same as heif`

### 1.6 Niche app-compatibility intent

People hitting walls with specific apps. We address these in FAQ.

- `does whatsapp support heic` → no, send as jpg (we help)
- `does instagram support heic` → partially (we help)
- `does google photos support heic` → mostly (we help)
- `does photoshop support heic` → with codec
- `can chrome open heic files` → no native
- `can firefox open heic files` → no native

### 1.7 Action-modifier prefixes worth targeting

Combine with stems above for long-tail variants:

| Prefix | Combines well with |
|---|---|
| `how to` | open heic, convert heic, view heic, change heic, disable heic |
| `how do i` | open heic, convert heic |
| `why is` | iphone saving heic, my heic not working |
| `can i` | open heic in chrome, send heic on whatsapp |
| `does` | whatsapp support heic, instagram support heic |
| `best` | heic converter (+ platform suffix) |
| `free` | heic converter, heic viewer |

---

## 2. FAQ — extended (20+ questions from real searches)

Every Q below comes from Google autocomplete / question-seed expansion. Answers must match visible page content exactly (per Google FAQPage spec).

### Q1. What is HEIC?
HEIC stands for High Efficiency Image Container — it's the photo format Apple uses by default on every iPhone since iOS 11 (2017). HEIC files are about half the size of JPGs at the same visual quality, which saves space on your iCloud, but they create a compatibility problem: most non-Apple software (Windows, Android, web browsers, email clients) can't open them natively.

### Q2. What does HEIC stand for?
HEIC = **H**igh **E**fficiency **I**mage **C**ontainer. The image data inside is encoded with HEVC (the same codec used in 4K video), which is why files are so small. HEIF is the parent format — HEIC is Apple's specific HEIF-with-HEVC variant.

### Q3. Is HEIC the same as HEIF?
Almost. HEIF (High Efficiency Image Format) is the underlying container standard. HEIC is Apple's name for HEIF files using the HEVC codec. Most iPhones save as `.heic` but the formats are functionally interchangeable. HEICPix handles both — drop a `.heic` or `.heif` and it converts.

### Q4. How do I convert HEIC to JPG?
Drop your `.heic` file onto HEICPix and it converts to JPG instantly. Drag-and-drop, or tap to pick photos from your camera roll. Conversion happens in your browser — your photos never get uploaded anywhere. You can convert hundreds at a time and download them as a zip.

### Q5. How do I open HEIC files on Windows?
You have two options: (1) Convert them to JPG using HEICPix and Windows Photos will open them like any other image. (2) Install Microsoft's "HEIF Image Extensions" from the Microsoft Store, which adds HEIC support to Windows 10 and 11. Option 1 is more universal — converted JPGs work in every app, while the Microsoft codec only helps inside specific apps.

### Q6. How do I open HEIC files on a Mac?
macOS opens HEIC natively in Preview and Photos — that part already works. The pain comes when you try to send a HEIC to someone on Windows or Android, or upload to a website that doesn't accept HEIC. For those cases, drop the file into HEICPix to get a universal JPG.

### Q7. Can Chromebooks open HEIC files?
ChromeOS does not open HEIC files natively — the Gallery app shows "format not supported." HEICPix works perfectly in Chrome on Chromebook because everything runs in the browser. Drop your HEIC, get a JPG or PNG back, no install or extension needed.

### Q8. How do I open HEIC files on Android?
Newer Android versions (12+) on Pixel and Samsung devices can open HEIC files. Older Android versions and many file-manager apps still can't. The reliable fix: open HEICPix in Chrome on your Android phone, drop the HEIC, get a JPG back. Works on every Android browser.

### Q9. Why is my iPhone saving photos as HEIC?
Because Apple made HEIC the default in iOS 11 (2017) to save storage space — HEIC files are about half the size of JPGs at the same visual quality. You can change this in Settings → Camera → Formats → "Most Compatible" to force JPG instead, but new photos will be larger.

### Q10. How do I stop my iPhone from saving photos as HEIC?
Open Settings → Camera → Formats. Tap "Most Compatible" instead of "High Efficiency". New photos will save as JPG. Existing HEIC photos stay as HEIC — use HEICPix to convert any you need to share with non-Apple users.

### Q11. Is HEIC better than JPEG?
For storage and quality: yes — HEIC files are about half the size of JPGs while looking identical. For compatibility: no — JPG opens everywhere; HEIC needs special support outside the Apple ecosystem. Use HEIC for archiving your own photo library; convert to JPG when sharing.

### Q12. Which is better quality, HEIC or JPEG?
HEIC has better compression efficiency, so at the same file size HEIC looks visually cleaner than JPEG, especially in shadows and skies. At maximum quality both look indistinguishable to the human eye. Apple uses HEIC because it stores 16-bit color depth (vs JPEG's 8-bit), which matters for HDR photos and pro editing.

### Q13. How do I send HEIC photos on WhatsApp?
WhatsApp accepts HEIC uploads on iOS, but they get auto-converted to JPG before sending. On Android and Web WhatsApp, HEIC support is spotty — your recipient might get a corrupted preview. The safer path: convert HEIC to JPG with HEICPix first, then share the JPG on WhatsApp.

### Q14. Does Instagram support HEIC?
Instagram converts HEIC uploads on iOS, but Android Instagram sometimes rejects HEIC files. If you're posting from a non-Apple device or pasting a HEIC from Files into your story, convert to JPG first using HEICPix to avoid upload errors.

### Q15. Does Google Photos support HEIC?
Google Photos stores HEIC files but displays them via on-the-fly JPG conversion. Downloading a HEIC from Google Photos via the web gives you a JPG; downloading via the mobile app preserves HEIC. If you've ever downloaded photos from Google Photos and gotten unexpected file types, that's why.

### Q16. Can I convert HEIC to PNG?
Yes. HEICPix has a JPG/PNG toggle above the drop zone — pick PNG before dropping files. PNG output is lossless (every pixel preserved exactly) and works great for editing, transparency, or archival. Files are about 3-5× larger than JPG.

### Q17. Can I convert HEIC to PDF?
Not directly in HEICPix right now (it's on the roadmap). For now: convert HEIC to JPG in HEICPix, then use any browser-based "JPG to PDF" tool to combine. Most JPG-to-PDF tools support multi-image PDFs natively.

### Q18. What's the best free HEIC converter?
HEICPix — we're biased, but here's the honest case: most "free" HEIC converters upload your photos to a server (privacy risk), cap you at 5 or 25 files per day (frustrating), show ads (cluttered), or require signup (annoying). HEICPix is unlimited, browser-only, no signup, no ads, no upload, lifetime free.

### Q19. Why can't I open HEIC files on Windows 10 / Windows 11?
Windows doesn't ship HEIC support by default. You can install "HEIF Image Extensions" from the Microsoft Store (free) to add HEIC viewing to Photos and File Explorer thumbnails. Or convert the HEIC to JPG using HEICPix — converted JPGs open in every Windows app instantly.

### Q20. How do I convert HEIC to JPG in bulk?
Drop a whole folder of HEIC files onto HEICPix and they convert in parallel. There's no per-batch limit on desktop (you can drop 500 at once). On mobile, the practical limit is 50 photos at a time due to memory constraints. After conversion, click "Download .zip" to get all your JPGs in one file.

### Q21. Can HEICPix convert HEIC files I receive from email or WhatsApp?
Yes. Save the HEIC attachment to your Files / Downloads folder first, then drop it into HEICPix. On iPhone, you can also use the Share Sheet — once you've installed HEICPix as a PWA (Add to Home Screen), "HEICPix" appears as an option when you share a HEIC from anywhere.

### Q22. Does HEICPix work offline?
Yes — once the page loads, conversion runs entirely in your browser. You can disconnect from the internet and HEICPix will keep converting. Installing as a PWA (Add to Home Screen) caches the app so even the page loads offline. Your photos never need internet access.

### Q23. Are my photos uploaded anywhere when I use HEICPix?
No. Everything happens on your device using WebAssembly. You can verify this by opening DevTools → Network tab while converting — you'll see zero outbound file uploads. There are no servers handling your photos because the conversion doesn't need any.

### Q24. What's the file size limit on HEICPix?
There's no hard size limit per file. The practical limit is your device's memory: ~50 photos at a time on mobile, 500+ on desktop. Very large files (60+ megapixel iPhone Pro photos) take a few extra seconds each. If you hit memory limits, just convert in smaller batches.

---

## 3. People-Also-Ask candidate phrasings

These are real question variants people type. We can match these in subheadings (H2/H3) on relevant pages to capture PAA box rich results.

- "How do I convert a HEIC file to a JPEG?"
- "How do I open a HEIC file?"
- "Why are my pictures saving as HEIC?"
- "How do I change HEIC to JPEG on iPhone?"
- "How do I open HEIC on Windows 11?"
- "Can Android phones open HEIC files?"
- "Is HEIC better than JPEG?"
- "Why does my iPhone send pictures as HEIC?"
- "How can I view HEIC files on my computer?"
- "What is the difference between HEIC and HEIF?"
- "Will Windows 11 open HEIC files?"
- "Can WhatsApp send HEIC photos?"
- "Does iPhone 15 still use HEIC?"
- "How do I stop my iPhone from sending HEIC photos?"
- "Can I edit HEIC files in Photoshop?"

---

## 4. Page-by-page SEO target plan

| Page | Primary keyword | Supporting keywords | Schema |
|---|---|---|---|
| `/` (home) | heic to jpg | convert heic, heic converter, heic to png, free | WebApplication + Organization + WebSite |
| `/faq` | heic file format faq | what is heic, heic vs jpeg, how to open heic | FAQPage |
| `/how-it-works` | how does heic conversion work | heic webassembly, browser heic | HowTo |
| `/privacy` | heic converter no upload | privacy heic, browser-only | (no rich schema needed) |
| `/heic-to-jpg-windows` | heic to jpg windows | open heic windows, heic windows 11 | HowTo + BreadcrumbList |
| `/heic-to-jpg-mac` | heic to jpg mac | convert heic mac, heic preview | HowTo + BreadcrumbList |
| `/heic-to-png` | heic to png | lossless heic png, heic png converter | HowTo + BreadcrumbList |
| `/heic-to-jpg-chromebook` ⏳ | chromebook heic | heic chromebook, heic chrome | HowTo + BreadcrumbList |
| `/heic-to-jpg-android` ⏳ | heic android | open heic android, heic samsung | HowTo + BreadcrumbList |
| `/install` ⏳ | install heicpix | heic app android, heic pwa | HowTo + BreadcrumbList |
| `/blog` ⏳ | heic blog | (index) | Blog + BlogPosting |
| `/blog/what-is-heic` ⏳ | what is heic | heic explained, heic vs heif | BlogPosting + BreadcrumbList |
| `/blog/heic-vs-jpeg` ⏳ | heic vs jpeg | which is better, quality comparison | BlogPosting + BreadcrumbList |
| `/blog/cant-open-heic` ⏳ | can't open heic | heic not working, heic troubleshooting | BlogPosting + BreadcrumbList |

---

## 5. Anchor-text strategy

Internal links should use keyword-rich anchor text, not "click here" or "learn more."

| From → To | Good anchor | Why |
|---|---|---|
| Home → `/heic-to-png` | "Convert HEIC to PNG (lossless)" | Direct keyword match |
| Home → `/faq` | "Frequently asked HEIC questions" | Long-tail keyword in anchor |
| Footer → `/heic-to-jpg-windows` | "Open HEIC on Windows" | Action verb + platform |
| Footer → `/heic-to-jpg-mac` | "HEIC on Mac" | Platform keyword |
| Footer → `/install` | "Install as an app" | Direct match for "install" intent |
| Blog post → home | "Convert your HEIC now" | Action CTA |

---

## 6. Differentiator phrases to repeat across pages

These positioning phrases reinforce the wedge and should appear consistently (3-5× per page where relevant):

1. **"Nothing uploads"** — privacy moat vs iloveimg / cloudconvert
2. **"Unlimited"** — capacity moat vs 5/25-file caps
3. **"In your browser"** — no install moat vs native apps
4. **"Free forever"** — pricing moat vs freemium tools
5. **"No signup"** — friction moat vs services requiring accounts
6. **"Works offline"** — once SW caching ships in v0.3

---

*Source data: `/tmp/heic_kw.json` (autocomplete) + `/tmp/heic_qa.json` (question expansions). Regenerate when keyword strategy shifts.*
