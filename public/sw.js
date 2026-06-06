/**
 * HEICPix Service Worker — Web Share Target handler.
 *
 * The OS "Share to HEICPix" sheet POSTs a multipart/form-data request to
 * /share with the shared files. We intercept it, stash the files in
 * IndexedDB, and redirect the PWA to /?shared=1 where the main script
 * pulls them out and feeds them to the converter.
 *
 * Beyond Share Target this SW does NOTHING — no offline caching, no
 * background sync. Adding those is v0.4 scope.
 */

const DB_NAME = "heicpix";
const STORE = "shared";
const KEY = "pending";

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onerror = () => reject(req.error);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
  });
}

async function pushSharedFiles(files) {
  if (files.length === 0) return;
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const entries = files.map((f) => ({
      name: f.name,
      type: f.type,
      blob: f,
    }));
    store.put(entries, KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Web Share Target handler
  if (url.pathname === "/share" && event.request.method === "POST") {
    event.respondWith(handleShare(event.request));
    return;
  }

  // Otherwise pass through (no caching in v0.2)
});

async function handleShare(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((v) => v instanceof File);
    if (files.length > 0) {
      await pushSharedFiles(files);
    }
    // Redirect to landing with ?shared=1 so the main script knows to ingest
    return Response.redirect("/?shared=1", 303);
  } catch (e) {
    console.error("share-target handler failed:", e);
    return Response.redirect("/?shared=error", 303);
  }
}
