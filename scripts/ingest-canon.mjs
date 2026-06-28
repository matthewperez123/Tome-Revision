#!/usr/bin/env node
// ingest-canon.mjs — Standard Ebooks -> Tome chapter ingestion.
// NO Anthropic API. Network = GitHub (download) + Supabase (insert) only.
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtempSync, rmSync, readFileSync, readdirSync, existsSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const exec = promisify(execFile);
const WPM = 250;
const LOG = "NIGHT.md";

// ── COLUMN MAP — verified against Phase 1 live table (matches exactly) ──
const CH = { id:"id", book_id:"book_id", index:"chapter_index", title:"title",
             html:"content_html", words:"word_count", minutes:"estimated_minutes", toc_depth:"toc_depth" };
const BK = { id:"id", se_slug:"se_slug", se_url:"standard_ebooks_url", title:"title",
             chapter_count:"chapter_count", words:"word_count", read_min:"reading_time_minutes",
             est_read:"estimated_reading_time", toc_desc:"toc_description", status:"ingestion_status" };
// chapter row id — Phase 1 confirmed live ids are "moby-dick/ch-1" style → `${bookId}/ch-${idx}`.
const chapterId = (bookId, idx, srcFile) => `${bookId}/ch-${idx}`;
// estimated_reading_time is a TEXT column in this DB → store a "~Xh Ym" label (matches existing rows).
const readLabel = (min) => { const h=Math.floor(min/60), m=min%60;
  return h ? (m ? `~${h}h ${m}m` : `~${h}h`) : `~${m}m`; };

const SB_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SB_URL || !SB_KEY) { console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (load .env.local)."); process.exit(1); }
const db = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });

const argv = process.argv.slice(2);
const cmd = argv[0];
const flag = (n,d=undefined)=>{const i=argv.indexOf(n);return i>=0?(argv[i+1]?.startsWith("--")||i+1>=argv.length?true:argv[i+1]):d;};
const has = (n)=>argv.includes(n);

const stripTags = (h)=>h.replace(/<[^>]+>/g," ").replace(/&[a-z#0-9]+;/gi," ");
const wordCount = (h)=>{const t=stripTags(h).trim();return t?t.split(/\s+/).length:0;};
const m1 = (s,re)=>{const x=s.match(re);return x?x[1]:null;};

function findEpubRoot(root){
  if (existsSync(join(root,"src","epub","content.opf"))) return join(root,"src","epub");
  for (const e of readdirSync(root,{withFileTypes:true}))
    if (e.isDirectory() && existsSync(join(root,e.name,"src","epub","content.opf")))
      return join(root,e.name,"src","epub");
  throw new Error("content.opf not found");
}
function transformBody(xhtml){
  let b = m1(xhtml,/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (b == null) throw new Error("no <body>");
  return b.replace(/\sepub:type=/g," data-epub-type=")
          .replace(/\sepub:prefix="[^"]*"/g,"")
          .replace(/\sxmlns:epub="[^"]*"/g,"").trim();
}
function parseBook(root){
  const ep = findEpubRoot(root);
  const opf = readFileSync(join(ep,"content.opf"),"utf8");
  const manifest = {};
  for (const tag of opf.matchAll(/<item\b[^>]*\/?>/g)) {
    const id = m1(tag[0],/\bid="([^"]+)"/), href = m1(tag[0],/\bhref="([^"]+)"/);
    if (id && href) manifest[id] = href;
  }
  const spine = [...opf.matchAll(/<itemref\b[^>]*\bidref="([^"]+)"/g)].map((m)=>m[1]);
  const title = m1(opf,/<dc:title[^>]*id="fulltitle"[^>]*>([\s\S]*?)<\/dc:title>/)
             || m1(opf,/<dc:title[^>]*>([\s\S]*?)<\/dc:title>/);
  const chapters = [];
  let idx = 0;
  for (const idref of spine) {
    const href = manifest[idref];
    if (!href || !href.endsWith(".xhtml")) continue;
    const fp = join(ep, href);
    if (!existsSync(fp)) continue;
    const xhtml = readFileSync(fp,"utf8");
    const label = (m1(xhtml,/<title>([\s\S]*?)<\/title>/) || idref.replace(/\.xhtml$/,"")).trim();
    const html = transformBody(xhtml);
    const wc = wordCount(html);
    idx += 1;
    chapters.push({ chapter_index:idx, source_file:href, title:label, content_html:html,
                    word_count:wc, estimated_minutes:Math.max(1,Math.round(wc/WPM)) });
  }
  const words = chapters.reduce((a,c)=>a+c.word_count,0);
  return { title, chapter_count:chapters.length, word_count:words,
           reading_time_minutes:Math.max(1,Math.round(words/WPM)), chapters };
}

// Known GitHub repo names where the SE URL's translator chain doesn't match the repo slug,
// merged with the catalog-matched map produced by scripts/resolve-se-slugs.mjs.
let SLUG_OVERRIDES = { "metamorphoses": "ovid_metamorphoses_various-translators" };
try {
  const j = JSON.parse(readFileSync(new URL("./se-slug-overrides.json", import.meta.url), "utf8"));
  SLUG_OVERRIDES = { ...j, ...SLUG_OVERRIDES };
} catch {}
function repoSlug(row){
  if (SLUG_OVERRIDES[row[BK.id]]) return SLUG_OVERRIDES[row[BK.id]];
  if (row[BK.se_slug]) return row[BK.se_slug];
  const url = row[BK.se_url] || "";
  const m = url.match(/\/ebooks\/(.+?)\/?$/);
  if (!m) return null;
  return m[1].split("/").filter(Boolean).join("_");
}
async function fetchRepo(slug, branch){
  const dir = mkdtempSync(join(tmpdir(),"se-"));
  const tgz = join(dir,"r.tar.gz");
  const branches = branch===true || !branch ? ["master","main"] : [branch];
  for (const b of branches) {
    try {
      await exec("curl",["-fsSL",`https://codeload.github.com/standardebooks/${slug}/tar.gz/refs/heads/${b}`,"-o",tgz]);
      await exec("tar",["xzf",tgz,"-C",dir]);
      return dir;
    } catch {}
  }
  rmSync(dir,{recursive:true,force:true});
  throw new Error(`download failed for ${slug}`);
}

async function distinctChapterBookIds(){
  const set = new Set();
  let from = 0; const page = 1000;
  for (;;) {
    const { data, error } = await db.from("chapters").select(CH.book_id).range(from, from+page-1);
    if (error) throw error;
    if (!data.length) break;
    for (const r of data) set.add(r[CH.book_id]);
    if (data.length < page) break;
    from += page;
  }
  return set;
}
async function allBooks(){
  const out = [];
  let from = 0; const page = 1000;
  for (;;) {
    const { data, error } = await db.from("books")
      .select(`${BK.id}, ${BK.title}, ${BK.se_slug}, ${BK.se_url}`)
      .order(BK.id).range(from, from+page-1);
    if (error) throw error;
    if (!data.length) break;
    out.push(...data);
    if (data.length < page) break;
    from += page;
  }
  return out;
}
async function booksWithoutChapters(){
  const [books, withCh] = await Promise.all([allBooks(), distinctChapterBookIds()]);
  return books.filter((b)=>!withCh.has(b[BK.id]));
}
async function insertChapters(bookId, parsed){
  const rows = parsed.chapters.map((c)=>({
    [CH.id]: chapterId(bookId, c.chapter_index, c.source_file),
    [CH.book_id]: bookId, [CH.index]: c.chapter_index, [CH.title]: c.title,
    [CH.html]: c.content_html, [CH.words]: c.word_count, [CH.minutes]: c.estimated_minutes,
    [CH.toc_depth]: 0,
  }));
  for (let i=0;i<rows.length;i+=500) {
    const { error } = await db.from("chapters").upsert(rows.slice(i,i+500),{ onConflict: CH.id });
    if (error) throw error;
  }
  return rows.length;
}
async function updateBook(bookId, parsed){
  const toc = parsed.chapters.slice(0,12).map((c)=>c.title).join(" · ");
  const { error } = await db.from("books").update({
    [BK.chapter_count]: parsed.chapter_count, [BK.words]: parsed.word_count,
    [BK.read_min]: parsed.reading_time_minutes, [BK.est_read]: readLabel(parsed.reading_time_minutes),
    [BK.toc_desc]: toc, [BK.status]: "success",
  }).eq(BK.id, bookId);
  if (error) throw error;
}
const log = (line)=>{ try { appendFileSync(LOG, line+"\n"); } catch {} };

async function probe(){
  const { data: chSample, error } = await db.from("chapters").select("*").eq(CH.book_id,"moby-dick").order(CH.index).limit(3);
  if (error) { console.error("chapters read failed:", error.message); return; }
  if (!chSample?.length) { console.log("No moby-dick chapters found — check the reference book id."); return; }
  console.log("LIVE chapters columns:", Object.keys(chSample[0]).join(", "));
  console.log("\nmoby-dick sample ids / indices / titles:");
  for (const r of chSample) console.log(`  ${JSON.stringify(r[CH.id])}  idx=${r[CH.index]}  ${JSON.stringify(r[CH.title])}`);
  console.log("\ncontent_html[0] head:\n"+String(chSample[0][CH.html]).slice(0,300));
}
async function worklist(){
  const list = await booksWithoutChapters();
  console.log(`Books with ZERO chapter rows: ${list.length}`);
  const sourceable = list.filter((b)=>repoSlug(b));
  console.log(`Of these, with a usable SE source: ${sourceable.length}\n`);
  for (const b of sourceable.slice(0,25)) console.log(`  ${b[BK.id]}  ${repoSlug(b)}  — ${b[BK.title]}`);
  if (sourceable.length>25) console.log(`  … +${sourceable.length-25} more sourceable`);
  const missing = list.filter((b)=>!repoSlug(b));
  if (missing.length) console.log(`\n⚠ ${missing.length} have no se_slug / standard_ebooks_url and will be skipped.`);
}
async function run(){
  const dry = has("--dry");
  const conc = Number(flag("--concurrency",5)) || 5;
  const branch = flag("--branch");
  const only = flag("--only");
  const limit = Number(flag("--limit",0)) || 0;
  let list = await booksWithoutChapters();
  if (only) list = list.filter((b)=>b[BK.id]===only).length ? list.filter((b)=>b[BK.id]===only)
                                                            : [{ [BK.id]:only, [BK.se_slug]:null, [BK.se_url]:null, [BK.title]:only }];
  if (limit) list = list.slice(0,limit);
  console.log(`${dry?"[DRY] ":""}Processing ${list.length} book(s), concurrency ${conc}.`);
  log(`\n## Ingestion run ${new Date().toISOString()} — ${list.length} books${dry?" (dry)":""}`);
  let ok=0, fail=0, done=0;
  const queue = [...list];
  async function worker(){
    for (;;) {
      const b = queue.shift();
      if (!b) return;
      const id = b[BK.id]; const slug = repoSlug(b);
      const tag = `[${++done}/${list.length}] ${id}`;
      if (!slug) { console.warn(`${tag}  SKIP (no slug)`); log(`- SKIP ${id} (no slug)`); fail++; continue; }
      let dir;
      try {
        dir = await fetchRepo(slug, branch);
        const parsed = parseBook(dir);
        if (!parsed.chapter_count) throw new Error("0 sections parsed");
        if (dry) {
          console.log(`${tag}  OK(dry) ${parsed.chapter_count} sec, ${parsed.word_count.toLocaleString()}w`);
        } else {
          const n = await insertChapters(id, parsed);
          await updateBook(id, parsed);
          console.log(`${tag}  ✓ ${n} chapters, ${parsed.word_count.toLocaleString()}w`);
          log(`- ✓ ${id} — ${n} chapters`);
        }
        ok++;
      } catch (e) {
        console.error(`${tag}  ✗ ${e.message}`);
        log(`- ✗ ${id} (${slug}) — ${e.message}`);
        fail++;
      } finally {
        if (dir) rmSync(dir,{recursive:true,force:true});
      }
    }
  }
  await Promise.all(Array.from({length:Math.min(conc,list.length)}, worker));
  console.log(`\nDone. ok=${ok} fail=${fail}`);
  log(`Run complete: ok=${ok} fail=${fail}`);
}

const main = { probe, worklist, run }[cmd];
if (!main) { console.error("commands: probe | worklist | run"); process.exit(1); }
main().catch((e)=>{ console.error(e); process.exit(1); });
