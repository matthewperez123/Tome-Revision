#!/usr/bin/env node
// resolve-se-slugs.mjs — match Tome book ids to Standard Ebooks GitHub repos by title-slug.
// Input: /tmp/se_repos.txt (one repo name per line, e.g. herman-melville_moby-dick).
// Output: scripts/se-slug-overrides.json  { bookId: repoName }
import { readFileSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const db = createClient(URL, KEY, { auth: { persistSession: false } });

const repos = readFileSync("/tmp/se_repos.txt", "utf8").split("\n").map((s)=>s.trim()).filter(Boolean);
// Index by title segment (parts[1]) AND by every non-author segment (for multi-author repos
// where the title sits in the middle, e.g. ..._the-federalist-papers, ..._lyrical-ballads).
const byTitle = new Map();   // strict: title == parts[1]
const bySeg = new Map();     // loose: title == any segment index >= 1
const add = (map, k, r) => { if (!map.has(k)) map.set(k, []); map.get(k).push(r); };
for (const r of repos) {
  const parts = r.split("_");
  if (parts.length < 2) continue;
  add(byTitle, parts[1], r);
  for (let i = 1; i < parts.length; i++) add(bySeg, parts[i], r);
}

async function page(table, sel){
  const out=[]; let from=0; const n=1000;
  for(;;){ const {data,error}=await db.from(table).select(sel).order("id").range(from,from+n-1);
    if(error) throw error; if(!data.length) break; out.push(...data); if(data.length<n) break; from+=n; }
  return out;
}
const books = await page("books","id, title, author");
const chapBookIds = new Set((await page("chapters","book_id")).map((r)=>r.book_id));

const overrides = {};
let matched=0, ambiguous=[], unmatched=[], alreadyHave=0;
const slug = (s)=> (s||"").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"")
  .replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");

const fewestSeg = (arr) => arr.slice().sort((x,y)=>x.split("_").length-y.split("_").length)[0];
function disambiguate(id, cands, author){
  if (cands.length === 1) return cands[0];
  const a = slug(author);
  const byAuthor = a ? cands.filter((r)=>r.startsWith(a+"_") || r.split("_").includes(a)) : [];
  if (byAuthor.length === 1) return byAuthor[0];
  if (byAuthor.length > 1) { const p=fewestSeg(byAuthor); ambiguous.push(`${id} -> ${byAuthor.join(" | ")} (picked ${p})`); return p; }
  const p = fewestSeg(cands); ambiguous.push(`${id} -> ${cands.join(" | ")} (no author match, picked ${p})`); return p;
}
// Tome ids for SE single-author collections: {type}-{author} -> {author}_{type}[_various-translators]
const COLLECTION = /^(short-fiction|poetry|short-plays|short-science-fiction|short-stories|ghost-stories)-(.+)$/;

// Manually verified (GitHub-confirmed) where slug heuristics can't reach.
const MANUAL = {
  "melville-short-fiction": "herman-melville_short-fiction",
  "plays-roswitha-of-gandersheim": "roswitha-of-gandersheim_plays_christopher-st-john",
  "plays-zeami-motokiyo": "zeami-motokiyo_plays_various-translators",
  "poems-on-various-subjects": "phillis-wheatley_poems-on-various-subjects-religious-and-moral",
  "the-red-thumb-mark": "r-austin-freeman_the-red-thumbmark",
  "the-return-de-la-mare": "walter-de-la-mare_the-return",
  "thoreau-essays": "henry-david-thoreau_essays",
  "scrambles-amongst-the-alps": "edward-whymper_scrambles-amongst-the-alps-in-the-years-1860-69",
  "poetry-henry-van-dyke": "henry-van-dyke-jr_poetry",
  "romance-conrad-ford": "joseph-conrad_ford-madox-ford_romance",
};

for (const b of books) {
  if (chapBookIds.has(b.id)) { alreadyHave++; continue; }
  let pick;
  if (MANUAL[b.id]) { overrides[b.id] = MANUAL[b.id]; matched++; continue; }
  // 1. strict title match
  if (byTitle.has(b.id)) pick = disambiguate(b.id, byTitle.get(b.id), b.author);
  // 2. collection type-author ids
  if (!pick) { const m = b.id.match(COLLECTION);
    if (m) { const author=m[2], type=m[1];
      const cands = repos.filter((r)=>r===`${author}_${type}` || r.startsWith(`${author}_${type}_`));
      if (cands.length) pick = fewestSeg(cands);
    } }
  // 3. any-segment match (multi-author repos where title is a middle segment)
  if (!pick && bySeg.has(b.id)) pick = disambiguate(b.id, bySeg.get(b.id), b.author);
  // 4. strip a trailing -authorhint suffix (e.g. the-shadow-line-conrad) and retry
  if (!pick) { const mm = b.id.match(/^(.*)-([a-z]+)$/);
    if (mm && byTitle.has(mm[1])) pick = disambiguate(b.id, byTitle.get(mm[1]), b.author || mm[2]);
    else if (mm && bySeg.has(mm[1])) pick = disambiguate(b.id, bySeg.get(mm[1]), b.author || mm[2]);
  }
  if (!pick) { unmatched.push(b.id); continue; }
  overrides[b.id] = pick; matched++;
}

writeFileSync("scripts/se-slug-overrides.json", JSON.stringify(overrides, null, 0));
console.log(`books=${books.length} alreadyHaveChapters=${alreadyHave}`);
console.log(`matched=${matched}  ambiguous=${ambiguous.length}  unmatched=${unmatched.length}`);
console.log(`\nUNMATCHED (${unmatched.length}):`);
console.log(unmatched.join(" "));
console.log(`\nAMBIGUOUS (${ambiguous.length}):`);
console.log(ambiguous.slice(0,40).join("\n"));
