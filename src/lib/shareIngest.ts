/**
 * Read files stashed by the service worker /share POST handler.
 *
 * Flow:
 *   1. User shares HEICs from iOS Files / Android Photos → OS hits /share
 *   2. Service worker intercepts POST, reads FormData, stores blobs in
 *      IDB under key "heicpix-shared-pending", redirects to /?shared=1
 *   3. Main page loads, calls popSharedFiles() which reads + clears IDB
 */

const DB_NAME = "heicpix";
const STORE = "shared";
const KEY = "pending";

interface StoredEntry {
  name: string;
  type: string;
  blob: Blob;
}

function openDb(): Promise<IDBDatabase> {
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

/**
 * Atomic read-and-clear of the shared-files queue.
 * Returns [] if nothing is queued.
 */
export async function popSharedFiles(): Promise<File[]> {
  const db = await openDb();
  return new Promise<File[]>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const getReq = store.get(KEY);

    getReq.onerror = () => reject(getReq.error);
    getReq.onsuccess = () => {
      const stored: StoredEntry[] | undefined = getReq.result;
      if (!stored || stored.length === 0) {
        resolve([]);
        return;
      }
      // Clear after read
      store.delete(KEY);
      const files = stored.map(
        (e) => new File([e.blob], e.name, { type: e.type }),
      );
      tx.oncomplete = () => resolve(files);
      tx.onerror = () => reject(tx.error);
    };
  });
}

/**
 * Called from the service worker (which has its own module context).
 * Exported for parity / testing — production SW inlines this logic.
 */
export async function pushSharedFiles(files: File[]): Promise<void> {
  if (files.length === 0) return;
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const entries: StoredEntry[] = files.map((f) => ({
      name: f.name,
      type: f.type,
      blob: f,
    }));
    store.put(entries, KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
