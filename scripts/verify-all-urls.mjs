#!/usr/bin/env node
/**
 * Verify and fix ALL external painting URLs via Wikimedia Commons API.
 * Looks up each painting individually, gets the correct thumbnail URL.
 * Falls back to search by title + artist if the filename doesn't exist.
 *
 * Run: node scripts/verify-all-urls.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = path.join(__dirname, "..", "public/paintings/manifest.json");
const UA = "TomeApp/1.0 (https://tome.app; contact@tome.app)";

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
const externals = manifest.filter((p) => p.src.startsWith("http"));

function extractFilename(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/");
    const thumbIdx = parts.indexOf("thumb");
    if (thumbIdx >= 0 && parts.length > thumbIdx + 3) {
      return decodeURIComponent(parts[thumbIdx + 3]);
    }
    return decodeURIComponent(parts[parts.length - 1]);
  } catch {
    return null;
  }
}

async function getThumbUrl(filename, width = 1280) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&iiurlwidth=${width}&format=json&formatversion=2`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const data = await r.json();
  const page = data.query.pages[0];
  if (page.missing) return null;
  return page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url || null;
}

async function searchAndGetUrl(query, width = 1280) {
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=3&format=json&formatversion=2`;
  const r = await fetch(searchUrl, { headers: { "User-Agent": UA } });
  const data = await r.json();
  const results = data.query?.search || [];
  for (const result of results) {
    const filename = result.title.replace("File:", "");
    const thumbUrl = await getThumbUrl(filename, width);
    if (thumbUrl) return thumbUrl;
  }
  return null;
}

async function main() {
  let fixed = 0;
  let ok = 0;
  let failed = 0;

  for (let i = 0; i < externals.length; i++) {
    const p = externals[i];
    const filename = extractFilename(p.src);

    if (!filename) {
      console.log(`✗ ${p.id}: could not extract filename`);
      failed++;
      continue;
    }

    // Step 1: Try looking up the filename directly
    let thumbUrl = await getThumbUrl(filename);

    // Step 2: If not found, search by title + artist
    if (!thumbUrl) {
      const query = `${p.title} ${p.artist}`;
      thumbUrl = await searchAndGetUrl(query);
    }

    if (thumbUrl) {
      if (p.src !== thumbUrl) {
        p.src = thumbUrl;
        p.imageUrl = thumbUrl;
        fixed++;
        console.log(`⟳ ${p.id}: URL updated`);
      } else {
        ok++;
        console.log(`✓ ${p.id}: URL correct`);
      }
    } else {
      console.log(`✗ ${p.id}: NOT FOUND (${filename})`);
      failed++;
    }

    // Small delay to be polite
    await new Promise((r) => setTimeout(r, 150));

    if ((i + 1) % 25 === 0) {
      console.log(`\n--- Progress: ${i + 1}/${externals.length} ---\n`);
    }
  }

  console.log(`\n=== Results ===`);
  console.log(`OK (unchanged): ${ok}`);
  console.log(`Fixed: ${fixed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${externals.length}`);

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log("Manifest written.");
}

main().catch(console.error);
