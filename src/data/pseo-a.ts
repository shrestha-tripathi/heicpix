import { site } from "../site.config";
import type { PseoPage } from "./pseo-types";

const n = site.name;

export const pseoA: PseoPage[] = [
  {
    slug: "bulk-heic-to-jpg",
    crumb: "Bulk HEIC to JPG",
    title: "Bulk HEIC to JPG — batch convert hundreds of iPhone photos at once",
    description: `Batch convert HEIC to JPG in your browser. Drop 10 or 500 iPhone photos, download one .zip. No 5-file cap, no upload, no signup. Free with ${n}.`,
    h1: "Batch convert HEIC to JPG — no file limit",
    intro: "Most online converters cap you at 5 files, or 25 per day, and upload every photo to their servers. Here the whole batch is converted inside your browser tab, in parallel, and you download one zip.",
    tldr: `Select all your .heic files, drop them on ${n}, pick JPG, then click "Download .zip". Conversion runs locally across multiple CPU cores; nothing uploads and there's no daily cap.`,
    sections: [
      { h2: "Why batch conversion is usually painful", list: [
        "Upload-based tools throttle free users with 5–25 file limits.",
        "Uploading 300 photos over home broadband can take longer than the conversion itself.",
        "Your whole camera roll — faces, kids, documents, GPS — ends up on someone else's server.",
      ] },
      { h2: "How the batch runs here", body: "Each file is decoded by libheif (WebAssembly) in a pool of Web Workers — typically four on desktop, one on phones to save memory. Files stream through the pool, so a 200-photo batch starts producing JPGs within a second. When they're done you can save straight into a folder (Chrome/Edge), download a single .zip, or share." },
      { h2: "Tips for very large batches", list: [
        "On desktop, a few hundred files per batch is comfortable; split thousand-photo exports into chunks.",
        "Keep the tab in the foreground — background tabs are throttled by the browser.",
        "Use quality 85–92% for JPG: visually identical to the HEIC, much smaller than 100%.",
      ] },
    ],
    steps: [
      { name: "Export HEICs", text: "Copy the .heic files off your iPhone (Photos app, AirDrop, iCloud, or USB)." },
      { name: "Drop them all", text: "Select everything (Ctrl/Cmd+A) and drag onto the drop zone." },
      { name: "Pick JPG", text: "Choose JPG and a quality level before or during the batch." },
      { name: "Download .zip", text: "Grab every converted JPG in one zip, or save to a folder." },
    ],
    faqs: [
      { q: "Is there a limit on how many HEIC files I can convert?", a: "No daily limit. Per batch the cap depends on device memory — a few hundred on desktop — and you can start another batch immediately." },
      { q: "Are the files uploaded?", a: "No. Everything happens in your browser. You can disconnect from the internet after the page loads and it still works." },
    ],
    cta: "Batch convert HEIC to JPG →",
    related: ["/iphone-photos-to-jpg", "/heic-to-jpg-without-losing-quality", "/heic-to-jpg-windows"],
  },
  {
    slug: "iphone-photos-to-jpg",
    crumb: "iPhone photos to JPG",
    title: "Convert iPhone photos to JPG — free, in the browser, nothing uploads",
    description: "Turn iPhone HEIC photos into JPG on any device. Works in Safari, Chrome, Edge, Firefox. Unlimited, no app to install, no upload, no signup.",
    h1: "Convert iPhone photos to JPG",
    intro: "Since iOS 11, iPhones save photos as HEIC to save space. That's great on Apple devices and annoying everywhere else: Windows, older Android phones, web forms and many apps can't open them. JPG opens everywhere.",
    tldr: `Open ${n} in any browser (including Safari on the iPhone itself), tap the drop zone, pick photos, choose JPG. Converted files save to Files/Downloads. No app, no upload.`,
    sections: [
      { h2: "On the iPhone itself", body: "Open this site in Safari, tap the drop zone and choose Photo Library. Pick your photos, choose JPG, then Share → Save to Files or Save Image. Installing the site as a home-screen app adds it to your Share sheet for one-tap conversion." },
      { h2: "On a Windows PC or Chromebook", body: "Copy the photos over (USB, iCloud for Windows, Google Drive, email) and drop the .heic files onto the page. JPGs come back instantly; batch as many as you want." },
      { h2: "Stop future HEICs (optional)", body: "Settings → Camera → Formats → Most Compatible makes the camera shoot JPG. You lose HEIC's ~50% space saving, so many people prefer to keep HEIC and convert when sharing." },
    ],
    steps: [
      { name: "Open the converter", text: "Any modern browser on iPhone, Android, Windows, Mac or Chromebook." },
      { name: "Add photos", text: "Tap to pick from your library or drag files in." },
      { name: "Choose JPG", text: "JPG is the most compatible format there is." },
      { name: "Save", text: "Download individually, as a zip, or share." },
    ],
    faqs: [
      { q: "Does converting iPhone photos to JPG lose quality?", a: "At 90%+ quality the difference is not visible. JPG files are larger than HEIC for the same look." },
      { q: "Is the photo location removed?", a: "Yes — converted files are re-encoded from pixels, so EXIF and GPS data are not carried over." },
    ],
    cta: "Convert iPhone photos to JPG →",
    related: ["/bulk-heic-to-jpg", "/heic-to-jpg-without-losing-quality", "/install"],
  },
  {
    slug: "heic-to-jpg-without-losing-quality",
    crumb: "HEIC to JPG without losing quality",
    title: "HEIC to JPG without losing quality — which settings actually matter",
    description: "How to convert HEIC to JPG with no visible quality loss: full resolution, 92–100% quality, or lossless PNG. Free browser converter, nothing uploads.",
    h1: "HEIC to JPG without losing quality",
    intro: "HEIC and JPG are both lossy formats, so any conversion re-encodes the image. The good news: at the right settings the result is indistinguishable from the original, at full resolution.",
    tldr: "Keep the default 92% JPG quality (or push the slider to 100%) — resolution is never reduced. If you need truly lossless output, choose PNG instead.",
    sections: [
      { h2: "What actually affects quality", list: [
        "Resolution: always preserved — a 12 MP HEIC becomes a 12 MP JPG. No downscaling.",
        "JPG quality: 92% default is visually lossless for photos; 100% is overkill but available.",
        "Colour: images are decoded to sRGB. Wide-gamut (Display P3) nuance may flatten slightly on some browsers.",
        "HDR / depth maps / Live Photo motion are not part of a JPG and are dropped.",
      ] },
      { h2: "Recommended settings", list: [
        "Sharing, email, web: JPG at 85–92%.",
        "Printing or archiving: JPG at 95–100%, or PNG.",
        "Editing in Photoshop/Lightroom: PNG (lossless, no generational loss).",
        "Smallest files with great quality: WebP or AVIF.",
      ] },
      { h2: "Why the file gets bigger", body: "HEIC compresses about twice as efficiently as JPG. A 2 MB HEIC often becomes a 3–5 MB JPG at high quality. Bigger file doesn't mean better quality — it's the less efficient codec." },
    ],
    steps: [
      { name: "Choose JPG or PNG", text: "JPG for compatibility, PNG for truly lossless." },
      { name: "Set quality", text: "Leave at 92% or raise to 100% for archival copies." },
      { name: "Drop your HEICs", text: "Full resolution is kept automatically." },
      { name: "Save", text: "Download, zip or save to folder." },
    ],
    cta: "Convert at full quality →",
    related: ["/heic-to-png", "/heic-to-avif", "/bulk-heic-to-jpg"],
  },
  {
    slug: "open-heic-windows-11",
    crumb: "Open HEIC on Windows 10/11",
    title: "How to open HEIC files on Windows 10 and Windows 11 (free, no codec)",
    description: "Windows 10/11 can't open iPhone HEIC photos without paid HEVC extensions. View or convert them free in your browser instead — no install, nothing uploads.",
    h1: "Open HEIC files on Windows 10 & 11",
    intro: "Double-click an iPhone photo on Windows and you'll often get \"This file format isn't supported\" or a prompt to buy the HEVC Video Extensions from the Microsoft Store. You don't need to.",
    tldr: `Use the free ${n} HEIC viewer to look at the photo, or convert it to JPG in the browser. No codec purchase, no admin rights, nothing uploads.`,
    sections: [
      { h2: "Why Windows can't open HEIC", body: "HEIC images are compressed with HEVC (H.265). Windows ships the HEIF container support but the HEVC decoder is a separate Store extension (sometimes $0.99, sometimes preinstalled by the PC maker). Without it, Photos shows an error and File Explorer shows no thumbnails." },
      { h2: "Your options", list: [
        "View in the browser: open our HEIC viewer and drop the file — works on locked-down work PCs.",
        "Convert to JPG: drop one or hundreds of files and get JPGs that open everywhere.",
        "Install codecs: HEIF Image Extensions + HEVC Video Extensions from the Microsoft Store (needs a Microsoft account).",
        "Prevent it: on the iPhone, Settings → Photos → Transfer to Mac or PC → Automatic sends JPGs over USB.",
      ] },
    ],
    steps: [
      { name: "Open Edge or Chrome", text: "Any browser on Windows 10 or 11 works." },
      { name: "Drop the HEIC", text: "Drag from File Explorer onto the page." },
      { name: "View or convert", text: "Preview it, or pick JPG to convert." },
      { name: "Save to folder", text: "Edge/Chrome can write JPGs straight into a folder." },
    ],
    faqs: [
      { q: "Do I need to buy HEVC Video Extensions?", a: "No. The browser converter decodes HEIC with its own WebAssembly decoder, so no Windows codec is required." },
    ],
    cta: "Convert HEIC on Windows →",
    related: ["/heic-to-jpg-windows", "/heic-viewer", "/blog/why-heic-wont-open-on-windows-11"],
  },
  {
    slug: "heic-for-google-photos",
    crumb: "HEIC for Google Photos",
    title: "HEIC and Google Photos — download iPhone photos as JPG",
    description: "Google Photos stores iPhone HEICs as-is, so downloads come out as .heic. Convert them to JPG in your browser before sharing or editing — free, nothing uploads.",
    h1: "Google Photos and HEIC files",
    intro: "Google Photos happily backs up and displays HEIC. The problem shows up when you download: you get the original .heic, which Windows, older Android apps and web forms often can't open.",
    tldr: "Download the photos from Google Photos (or Takeout), drop the .heic files here, choose JPG, and download a zip. Conversion is local — the photos don't go anywhere new.",
    sections: [
      { h2: "Where HEICs show up", list: [
        "Download from photos.google.com → original .heic files.",
        "Google Takeout exports → folders full of .HEIC plus JSON sidecars.",
        "Shared albums downloaded by friends on Windows → unopenable files.",
      ] },
      { h2: "Converting a Takeout export", body: "Unzip the Takeout archive, search the folder for *.heic, select all and drop them on the converter. The JSON sidecars are ignored. You get one zip of JPGs back." },
    ],
    steps: [
      { name: "Download from Google Photos", text: "Select photos → Download, or use Google Takeout." },
      { name: "Drop the .heic files", text: "Drag the whole selection onto the converter." },
      { name: "Choose JPG", text: "Or PNG/WebP if you prefer." },
      { name: "Download .zip", text: "Every converted file in one archive." },
    ],
    cta: "Convert Google Photos HEICs →",
    related: ["/bulk-heic-to-jpg", "/heic-to-jpg-android", "/heic-for-gmail"],
  },
];
