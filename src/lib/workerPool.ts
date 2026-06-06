/**
 * Worker pool — round-robin distributes convert() calls across N workers.
 *
 * Why a pool instead of a single worker:
 *   - libheif decode is CPU-bound; one worker means serial conversion
 *   - 4 workers on a 4+ core desktop = roughly 3.5x throughput vs single
 *   - Mobile/low-memory devices use 1 worker (prevents OOM)
 *
 * The pool is a module-level singleton — we create workers on first request
 * and reuse them for the lifetime of the page. They're cheap (~5MB each
 * with WASM loaded), so there's no point tearing down between batches.
 */

import * as Comlink from "comlink";
import type { ConvertWorker, OutputFormat } from "./conversionWorker";
import { optimalWorkerCount } from "./capabilities";

interface PoolEntry {
  worker: Worker;
  proxy: Comlink.Remote<ConvertWorker>;
  /** Active job count — used for round-robin selection. */
  pending: number;
}

let pool: PoolEntry[] | null = null;
let rrIndex = 0;

function ensurePool(): PoolEntry[] {
  if (pool) return pool;

  const count = optimalWorkerCount();
  pool = [];

  for (let i = 0; i < count; i++) {
    // Vite's `new Worker(new URL(...), { type: 'module' })` pattern.
    const worker = new Worker(
      new URL("./conversionWorker.ts", import.meta.url),
      { type: "module", name: `heicpix-convert-${i}` },
    );
    const proxy = Comlink.wrap<ConvertWorker>(worker);
    pool.push({ worker, proxy, pending: 0 });
  }

  return pool;
}

/**
 * Convert one HEIC buffer using the worker with the lightest queue.
 *
 * Caller transfers the ArrayBuffer ownership to the worker. After this
 * resolves, the original buffer is detached — do NOT reuse it on the
 * caller side.
 */
export async function poolConvert(
  buffer: ArrayBuffer,
  options: { format: OutputFormat; quality?: number },
): ReturnType<Comlink.Remote<ConvertWorker>["convert"]> {
  const workers = ensurePool();

  // Pick worker with fewest pending jobs (load balancing).
  // Fall back to round-robin on ties.
  let chosen = workers[0]!;
  let minPending = chosen.pending;
  for (const w of workers) {
    if (w.pending < minPending) {
      chosen = w;
      minPending = w.pending;
    }
  }
  if (minPending === chosen.pending) {
    chosen = workers[rrIndex % workers.length]!;
    rrIndex++;
  }

  chosen.pending++;
  try {
    return await chosen.proxy.convert(Comlink.transfer(buffer, [buffer]), options);
  } finally {
    chosen.pending--;
  }
}

/**
 * Cheap encoder-capability probe — asks worker[0] to encode a 1x1 of the
 * given format and returns whether the browser honored the MIME request.
 * Results cached for the page lifetime since browser support doesn't
 * change between calls.
 */
const probeCache = new Map<OutputFormat, Promise<boolean>>();

export function poolProbe(format: OutputFormat): Promise<boolean> {
  const cached = probeCache.get(format);
  if (cached) return cached;
  const workers = ensurePool();
  const promise = workers[0]!.proxy.probeFormat(format);
  probeCache.set(format, promise);
  return promise;
}

/** Cleanup — useful for tests; not called in production. */
export function destroyPool(): void {
  if (!pool) return;
  for (const { worker, proxy } of pool) {
    proxy[Comlink.releaseProxy]();
    worker.terminate();
  }
  pool = null;
  rrIndex = 0;
}
