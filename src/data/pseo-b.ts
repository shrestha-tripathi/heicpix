import type { PseoPage } from "./pseo-types";

const common = (app: string) => [
  { name: "Open the converter", text: "In any browser on phone or computer." },
  { name: "Drop your HEIC photos", text: "Pick from your library or drag files in." },
  { name: "Choose JPG", text: `JPG is universally accepted by ${app}.` },
  { name: `Upload to ${app}`, text: "Attach or upload the converted JPGs as usual." },
];

export const pseoB: PseoPage[] = [
  {
    slug: "heic-for-facebook",
    crumb: "HEIC for Facebook",
    title: "HEIC for Facebook — fix iPhone photos that won't upload",
    description: "Facebook, Marketplace and Messenger on desktop sometimes reject or mangle HEIC. Convert to JPG in your browser first — free, unlimited, nothing uploads to us.",
    h1: "Uploading iPhone HEIC photos to Facebook",
    intro: "The Facebook iPhone app converts HEIC for you. The desktop site, Marketplace listings from a PC and Pages tools are less forgiving — you'll see greyed-out files in the picker, failed uploads, or rotated images.",
    tldr: "Convert HEIC to JPG here, then upload the JPGs to Facebook. Converted files have EXIF/GPS removed, which is also safer for Marketplace listings.",
    sections: [
      { h2: "Common symptoms", list: [
        "The file picker on Windows hides .heic files or greys them out.",
        "\"Your photo couldn't be uploaded\" after selecting HEIC in Business Suite.",
        "Marketplace photos uploaded from a PC appear sideways.",
      ] },
      { h2: "Privacy bonus", body: "iPhone photos can embed your exact GPS location. Converted JPGs don't carry metadata, so a Marketplace photo won't reveal where you live." },
    ],
    steps: common("Facebook"),
    cta: "Convert HEIC for Facebook →",
    related: ["/heic-for-instagram", "/strip-heic-exif", "/heic-for-whatsapp"],
  },
  {
    slug: "heic-for-instagram",
    crumb: "HEIC for Instagram",
    title: "HEIC for Instagram — post iPhone photos from a computer",
    description: "Instagram on the web and Creator Studio tools often choke on HEIC. Convert to JPG (or keep full quality) in your browser. Free, no upload, unlimited.",
    h1: "Posting HEIC photos to Instagram",
    intro: "Instagram's iPhone app handles HEIC natively. Posting from instagram.com on a PC, scheduling tools, or photos that went through Google Drive/Dropbox is where HEIC breaks.",
    tldr: "Convert HEIC to JPG at 90–95% quality, then upload. Instagram recompresses everything anyway, so a clean high-quality JPG gives the best result.",
    sections: [
      { h2: "Best settings for Instagram", list: [
        "Format: JPG (Instagram converts everything to JPG internally).",
        "Quality: 90–95%. Higher just makes a bigger upload with no visible gain.",
        "Resolution: kept in full; Instagram downsizes to 1080 px wide itself.",
      ] },
      { h2: "Scheduling tools", body: "Later, Buffer, Hootsuite and Meta Business Suite frequently reject .heic. Convert a whole batch once and upload the JPGs." },
    ],
    steps: common("Instagram"),
    cta: "Convert HEIC for Instagram →",
    related: ["/heic-for-facebook", "/heic-to-jpg-without-losing-quality", "/heic-for-canva"],
  },
  {
    slug: "heic-for-teams",
    crumb: "HEIC for Microsoft Teams",
    title: "HEIC in Microsoft Teams — make iPhone photos preview for everyone",
    description: "HEIC photos in Teams chats often show as a file icon with no preview for Windows users. Convert to JPG in your browser first. Free, nothing uploads.",
    h1: "Sharing HEIC photos in Microsoft Teams",
    intro: "Drop a .heic into a Teams chat or channel and colleagues on Windows usually see a generic file tile instead of an image — and can't open it without the HEVC codec.",
    tldr: "Convert HEIC to JPG here and post the JPG. It previews inline for everyone on Teams desktop, web and mobile. Works on locked-down work PCs — nothing to install.",
    sections: [
      { h2: "Why Teams doesn't preview HEIC", body: "Teams renders image previews using the viewer's platform codecs. Windows machines without the HEVC extension (common on managed corporate PCs) can't decode HEIC, so Teams falls back to a file attachment." },
      { h2: "Good for IT-restricted machines", body: "The converter runs as a web page: no admin rights, no Store access, no install. Photos stay on the device, which keeps compliance teams happy." },
    ],
    steps: common("Teams"),
    cta: "Convert HEIC for Teams →",
    related: ["/heic-for-outlook", "/heic-for-slack", "/open-heic-windows-11"],
  },
  {
    slug: "heic-for-notion",
    crumb: "HEIC for Notion",
    title: "HEIC in Notion — get iPhone photos to display inline",
    description: "Notion stores HEIC uploads as file attachments that don't render on Windows or Android. Convert to JPG or WebP in your browser first. Free, no upload.",
    h1: "Adding HEIC photos to Notion",
    intro: "Upload a HEIC to a Notion image block and it may render on your Mac but show as a broken image or a download link for teammates on Windows, Android or Chrome.",
    tldr: "Convert HEIC to JPG (or WebP for smaller pages) before adding to Notion. Images then render for every viewer and page loads get faster.",
    sections: [
      { h2: "Which format for Notion", list: [
        "JPG: renders everywhere, including exported PDFs and Markdown.",
        "WebP: 25–35% smaller than JPG — faster-loading Notion pages and public sites.",
        "PNG: only for screenshots or when you need lossless.",
      ] },
      { h2: "Workspace storage", body: "Free Notion workspaces cap single uploads at 5 MB. JPG at 85% from a 12 MP iPhone photo usually lands around 2–4 MB." },
    ],
    steps: common("Notion"),
    cta: "Convert HEIC for Notion →",
    related: ["/heic-to-webp", "/heic-for-canva", "/heic-for-wordpress"],
  },
  {
    slug: "heic-for-shopify",
    crumb: "HEIC for Shopify",
    title: "HEIC for Shopify — upload iPhone product photos without errors",
    description: "Shopify doesn't accept HEIC for product images. Batch convert iPhone product photos to JPG or WebP in your browser. Free, unlimited, nothing uploads.",
    h1: "Uploading iPhone product photos to Shopify",
    intro: "Shooting product photos on an iPhone is fast — until Shopify rejects them. Shopify accepts JPG, PNG, WebP and GIF for product media, not HEIC.",
    tldr: "Batch convert your HEIC product shots to JPG (or WebP), then drag them into Shopify Admin → Products. Metadata including GPS is removed automatically.",
    sections: [
      { h2: "Recommended settings for stores", list: [
        "Format: JPG for broad compatibility, or WebP for smaller files (Shopify's CDN serves WebP anyway).",
        "Quality: 85–90% — product zoom still looks crisp.",
        "Keep full resolution: Shopify supports up to 4472×4472 px and generates smaller sizes.",
        "Use PNG only for items on a transparent background you've already cut out.",
      ] },
      { h2: "Also works for Etsy, eBay, Amazon, WooCommerce", body: "Most marketplaces reject or mishandle HEIC. One batch conversion gives you files that work on all of them." },
    ],
    steps: common("Shopify"),
    cta: "Convert product photos →",
    related: ["/bulk-heic-to-jpg", "/heic-to-webp", "/heic-for-wordpress"],
  },
];
