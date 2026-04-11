#!/usr/bin/env node
/**
 * Fix external painting URLs by recomputing correct Wikimedia Commons
 * thumbnail paths using MD5 hashes.
 *
 * Run: node scripts/fix-painting-urls.mjs
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = path.join(__dirname, "..", "public/paintings/manifest.json");
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));

const externals = manifest.filter((p) => p.src.startsWith("http"));
console.log(`Processing ${externals.length} external paintings...`);

/**
 * Extract the bare filename from a Wikimedia URL.
 * Handles both thumb and direct URLs with various encoding.
 */
function extractFilename(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/");
    const thumbIdx = parts.indexOf("thumb");
    if (thumbIdx >= 0 && parts.length > thumbIdx + 3) {
      // Thumb URL: /wikipedia/commons/thumb/{h}/{hh}/{filename}/{WIDTHpx-filename}
      return decodeURIComponent(parts[thumbIdx + 3]);
    }
    // Direct URL: /wikipedia/commons/{h}/{hh}/{filename}
    return decodeURIComponent(parts[parts.length - 1]);
  } catch {
    return null;
  }
}

/**
 * Compute correct Wikimedia Commons thumbnail URL from a filename using MD5.
 */
function computeThumbUrl(filename, width = 1280) {
  const hash = crypto.createHash("md5").update(filename).digest("hex");
  const h1 = hash[0];
  const h12 = hash.slice(0, 2);
  // Wikimedia requires the filename to be URL-encoded in the path
  const encoded = encodeURIComponent(filename).replace(/%2F/g, "/");
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${h1}/${h12}/${encoded}/${width}px-${encoded}`;
}

let fixedCount = 0;

for (const p of externals) {
  const filename = extractFilename(p.src);
  if (!filename) {
    console.warn(`  Could not extract filename: ${p.id}`);
    continue;
  }

  const correctUrl = computeThumbUrl(filename);
  if (p.src !== correctUrl) {
    p.src = correctUrl;
    p.imageUrl = correctUrl;
    fixedCount++;
  }
}

console.log(`Fixed ${fixedCount} URLs (out of ${externals.length} external paintings)`);

// Verify a sample of URLs
console.log("\nVerifying a sample of 10 URLs...");
const sample = externals.slice(0, 10);
const results = await Promise.all(
  sample.map(async (p) => {
    try {
      const resp = await fetch(p.src, { method: "HEAD", redirect: "follow" });
      return { id: p.id, status: resp.status, ok: resp.ok };
    } catch (e) {
      return { id: p.id, status: "error", ok: false, error: e.message };
    }
  })
);

for (const r of results) {
  console.log(`  ${r.ok ? "✓" : "✗"} ${r.id}: ${r.status}`);
}

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\nManifest written.`);
