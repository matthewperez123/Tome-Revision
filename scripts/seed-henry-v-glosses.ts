#!/usr/bin/env npx tsx
/**
 * seed-henry-v-glosses.ts — Inline glosses for Henry V.
 * Same pattern as seed-romeo-and-juliet-glosses.ts. Line hints are
 * approximate; findLineForPhrase auto-locates within a sliding window.
 *
 * Henry V-specific considerations:
 *   - Fluellen's Welsh dialect is glossed AS dialect ("Got" = "God", not
 *     "God" as a correction). Dialect markers preserve characterization.
 *   - French phrases receive English-translation glosses without
 *     replacing the French in the main text.
 *   - The threat to Harfleur (3.3) is not softened — glosses name what
 *     the threat is in plain English.
 *   - Military/heraldic/legal vocabulary is dense in 1.2 (Salic Law),
 *     3.7 (horse caparisons), 4.8 (catalogue of the dead).
 *
 * Run: npx tsx scripts/seed-henry-v-glosses.ts
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/henry-v");

interface SeedGloss { line: number; phrase: string; definition: string; }

const GLOSSES: Record<string, SeedGloss[]> = {

  // ── Prologue — CHORUS: "O for a Muse of fire" (34 lines) ─────────────
  henry_v_prologue: [
    { line: 1, phrase: "Muse of fire", definition: "highest of the classical Muses — associated with inspired, elevated poetry; the element of fire was thought the most noble" },
    { line: 1, phrase: "ascend", definition: "rise up to" },
    { line: 2, phrase: "brightest heaven of invention", definition: "the highest realm of creative imagination — 'invention' means poetic creation" },
    { line: 3, phrase: "A kingdom for a stage", definition: "a whole kingdom to serve as the playing space — the wish for scale the theatre can't supply" },
    { line: 5, phrase: "warlike Harry", definition: "Henry V — 'Harry' is the familiar form of Henry throughout the play" },
    { line: 6, phrase: "port of Mars", definition: "bearing of Mars — the Roman god of war" },
    { line: 7, phrase: "Leash’d in like hounds", definition: "held in check as if leashed — war's catastrophes are Henry's hunting dogs" },
    { line: 7, phrase: "famine, sword and fire", definition: "the three calamities of invasion — starvation, slaughter, and burning" },
    { line: 8, phrase: "Crouch for employment", definition: "wait ready to be unleashed" },
    { line: 8, phrase: "gentles all", definition: "gentlemen all — formal address to the audience" },
    { line: 9, phrase: "flat unraised spirits", definition: "unglorified, ordinary souls — the actors' apology for their own plainness" },
    { line: 10, phrase: "unworthy scaffold", definition: "the stage, humbly described — 'scaffold' here = raised platform, not gallows" },
    { line: 11, phrase: "cockpit", definition: "small enclosed arena — either a pit for cockfighting or the round theatre itself" },
    { line: 12, phrase: "vasty fields of France", definition: "the enormous French battlefields — 'vasty' = vast" },
    { line: 13, phrase: "wooden O", definition: "the Globe Theatre — Shakespeare's round wooden playhouse" },
    { line: 13, phrase: "casques", definition: "helmets" },
    { line: 14, phrase: "Agincourt", definition: "the 1415 battle where Henry defeated a much larger French army" },
    { line: 15, phrase: "crooked figure", definition: "a zero — a curved numeral that multiplies when placed after a digit" },
    { line: 16, phrase: "Attest in little place a million", definition: "stand in a small space for a great sum — the zero's mathematical trick" },
    { line: 17, phrase: "ciphers", definition: "zeros; also, insignificant things" },
    { line: 17, phrase: "accompt", definition: "account; reckoning" },
    { line: 18, phrase: "imaginary forces", definition: "the powers of your imagination" },
    { line: 19, phrase: "girdle", definition: "belt; encircling boundary — i.e. the theatre's walls" },
    { line: 21, phrase: "abutting fronts", definition: "facing coastlines — England and France stare at each other across the Channel" },
    { line: 22, phrase: "perilous narrow ocean", definition: "the dangerous, narrow sea — the English Channel" },
    { line: 23, phrase: "Piece out our imperfections", definition: "fill in what the stage lacks" },
    { line: 25, phrase: "puissance", definition: "military might; armed force" },
    { line: 27, phrase: "Printing their proud hoofs i’ the receiving earth", definition: "stamping their hooves on the soft ground — one of the play's defining verbal images of imagined spectacle" },
    { line: 28, phrase: "deck", definition: "adorn; clothe in splendor" },
    { line: 29, phrase: "jumping o’er times", definition: "skipping across years — the chorus announces its freedom with chronology" },
    { line: 31, phrase: "hourglass", definition: "the running-time of a stage performance" },
    { line: 32, phrase: "Admit me Chorus", definition: "accept me as the Chorus — the classical Greek convention of a narrating voice" },
    { line: 33, phrase: "prologue-like", definition: "in the manner of a prologue" },
    { line: 34, phrase: "Gently to hear, kindly to judge", definition: "to listen patiently and judge with sympathy — the standard petition for indulgence" },
  ],

  // ── 1.1 — London. Canterbury and Ely confer ──────────────────────────
  henry_v_act1_scene1: [
    { line: 1, phrase: "self bill", definition: "same bill — a parliamentary measure that would strip the Church of lands" },
    { line: 3, phrase: "scambling", definition: "turbulent; disorderly" },
    { line: 7, phrase: "temporal lands", definition: "secular holdings — Church-owned estates granted to the Crown" },
    { line: 8, phrase: "devotion", definition: "religious purpose" },
    { line: 9, phrase: "full fifteen earls", definition: "enough to support fifteen earls" },
    { line: 19, phrase: "exhibiters", definition: "sponsors (of the bill) in Parliament" },
    { line: 22, phrase: "mitigation", definition: "softening; relief" },
    { line: 24, phrase: "true lover of the Holy Church", definition: "a sincere defender of the Church — part of the play's early portrait of a reformed Henry" },
    { line: 29, phrase: "Consideration", definition: "moral reflection" },
    { line: 33, phrase: "Hydra-headed wilfulness", definition: "a wilfulness with many heads like the Lernaean Hydra — stubbornness that grows back when cut off" },
    { line: 38, phrase: "bread of heaven", definition: "divine grace — a Eucharistic image" },
    { line: 42, phrase: "straight in expedition", definition: "immediately set in motion" },
    { line: 44, phrase: "Gordian knot", definition: "famously intricate knot cut by Alexander the Great — an image of a problem solved by force rather than untangling" },
    { line: 51, phrase: "cause of policy", definition: "matter of statecraft" },
    { line: 54, phrase: "still and anchor’d", definition: "calm and stable" },
    { line: 59, phrase: "whose blessed wings", definition: "pious metaphor — the Holy Spirit's" },
    { line: 61, phrase: "grace", definition: "divine favor" },
    { line: 67, phrase: "crescive in his faculty", definition: "growing through its own capacity — the medieval idea that souls develop by their own principle" },
    { line: 74, phrase: "fain", definition: "gladly" },
    { line: 79, phrase: "audience", definition: "formal hearing with the King" },
    { line: 84, phrase: "lords temporal", definition: "secular peers (as opposed to bishops and abbots)" },
  ],

  // ── 1.2 — The Presence chamber. Salic Law + tennis balls ─────────────
  henry_v_act1_scene2: [
    { line: 1, phrase: "Where is my gracious Lord of Canterbury", definition: "Henry summons the Archbishop — the scene's legal consultation begins" },
    { line: 5, phrase: "resolved", definition: "fully informed; settled in mind" },
    { line: 9, phrase: "justly and religiously", definition: "in accordance with law and conscience" },
    { line: 11, phrase: "law Salique", definition: "Salic Law — the Frankish legal tradition used to bar royal inheritance through the female line, invoked here against Henry's claim" },
    { line: 13, phrase: "fashion", definition: "shape; misrepresent" },
    { line: 14, phrase: "Or nicely charge your understanding soul", definition: "or subtly burden your conscience" },
    { line: 18, phrase: "impawn", definition: "pledge; stake" },
    { line: 19, phrase: "approbation", definition: "authoritative sanction" },
    { line: 21, phrase: "washes", definition: "reddens; blood-stains" },
    { line: 24, phrase: "waste in brief mortality", definition: "is quickly spent in short human lives" },
    { line: 25, phrase: "conjuration", definition: "solemn appeal" },
    { line: 34, phrase: "In terram Salicam mulieres ne succedant", definition: "Latin: 'Into the Salic land let no women succeed' — the legal tag at the heart of Canterbury's speech" },
    { line: 36, phrase: "Pharamond", definition: "legendary founding king of the Franks, to whom the Salic Law was fictitiously attributed" },
    { line: 39, phrase: "the floods of Sala and of Elbe", definition: "the Saale and Elbe rivers — German waterways central to Canterbury's geography lesson" },
    { line: 40, phrase: "Charles the Great", definition: "Charlemagne (742–814) — king of the Franks and Holy Roman Emperor" },
    { line: 45, phrase: "Meisen", definition: "Meissen — the German region Canterbury insists was the true 'Salic' land, not France" },
    { line: 50, phrase: "Hugh Capet", definition: "founder of the Capetian dynasty of French kings (d. 996)" },
    { line: 55, phrase: "usurp’d the crown", definition: "took the throne unlawfully — Canterbury is systematically questioning French royal legitimacy" },
    { line: 63, phrase: "Lewis the Tenth", definition: "Louis X of France (r. 1314–1316) — Canterbury's test case for inherited female right" },
    { line: 72, phrase: "Pepin", definition: "Pepin the Short — Charlemagne's father, another Carolingian claim cited" },
    { line: 78, phrase: "Lewis the Ninth", definition: "Louis IX — Saint Louis of France (r. 1226–1270)" },
    { line: 88, phrase: "Isabel his grandmother", definition: "Isabel of France, Edward II's queen — through whom Edward III claimed the French throne in the female line that Salic Law would bar" },
    { line: 92, phrase: "unhidden passages", definition: "unobstructed genealogical routes" },
    { line: 95, phrase: "Book of Numbers", definition: "Old Testament citation (Numbers 27:8) permitting daughters to inherit in the absence of sons — Canterbury's biblical trump card" },
    { line: 98, phrase: "Gracious lord", definition: "formal address to the King" },
    { line: 99, phrase: "puissant", definition: "mighty" },
    { line: 100, phrase: "Edward the Third", definition: "English king (r. 1327–1377) whose French claim is the historical basis for Henry's" },
    { line: 103, phrase: "Amazon", definition: "warrior woman — Edward the Black Prince's heraldic image of his mother" },
    { line: 106, phrase: "Black Prince", definition: "Edward of Woodstock, Edward III's eldest son — hero of Crécy (1346) and Poitiers (1356)" },
    { line: 108, phrase: "Crécy", definition: "1346 battle in which the Black Prince helped rout the French" },
    { line: 122, phrase: "unwinding", definition: "gradually disclosing" },
    { line: 130, phrase: "Scot", definition: "Scottish raider — Canterbury shifts to the problem of border defense" },
    { line: 137, phrase: "weasel Scot", definition: "the Scots pictured as a weasel — a small predator that attacks while the lion is away" },
    { line: 140, phrase: "eagle England", definition: "England as an eagle — imperial, predatory" },
    { line: 152, phrase: "David, King of Scots", definition: "David II, taken prisoner at Neville's Cross (1346)" },
    { line: 162, phrase: "cat", definition: "Canterbury's proverb: when the cat's away, the mice will play — if the king goes to France, the Scots will invade" },
    { line: 184, phrase: "division in one's state", definition: "political division within the state" },
    { line: 187, phrase: "honey-bees", definition: "Exeter's famous extended simile of the commonwealth as a beehive — kingdom ordered like a hive" },
    { line: 194, phrase: "magistrates", definition: "officials administering justice" },
    { line: 196, phrase: "mechanic porters", definition: "manual laborers; common workmen" },
    { line: 200, phrase: "tent-royal", definition: "royal pavilion — here, the queen bee's central cell" },
    { line: 218, phrase: "dial's point", definition: "sundial's hand" },
    { line: 222, phrase: "draw three quarters", definition: "take a three-quarters levy" },
    { line: 234, phrase: "Ambassadors from Harry King of England", definition: "Henry's formal title — he is both man and institution" },
    { line: 245, phrase: "Dauphin", definition: "title of the French crown prince (pronounced DOH-fan) — equivalent to the English Prince of Wales" },
    { line: 250, phrase: "tun of treasure", definition: "a cask of valuables — the gift from the Dauphin, which turns out to be insulting" },
    { line: 258, phrase: "tennis-balls", definition: "the Dauphin's mocking gift — Henry's youthful reputation reduced to a children's game" },
    { line: 272, phrase: "chases", definition: "tennis term — a point remembered but not yet scored, awaiting a second stroke; Henry turns the Dauphin's taunt back on him" },
    { line: 280, phrase: "wrangler", definition: "disputant; opponent" },
    { line: 283, phrase: "gun-stones", definition: "cannonballs — the tennis balls reimagined as weapons" },
    { line: 290, phrase: "dazzle all the eyes of France", definition: "blind the French with English arms" },
    { line: 295, phrase: "mock mothers from their sons", definition: "widow them of their children by war" },
    { line: 300, phrase: "well-hallow’d cause", definition: "holy justification — Henry takes the Dauphin's mockery as moral license" },
    { line: 310, phrase: "hasten on our expedition", definition: "speed our military expedition to France" },
  ],

};

// ── Act-level modules ──────────────────────────────────────────────────

require("./data/henry-v-act2-glosses")(GLOSSES);
require("./data/henry-v-act3-glosses")(GLOSSES);
require("./data/henry-v-act4-glosses")(GLOSSES);
require("./data/henry-v-act5-glosses")(GLOSSES);

// ── Seeder ─────────────────────────────────────────────────────────────

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, "-")
    .replace(/\u00A0/g, " ")
    .replace(/[-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findLineForPhrase(
  lines: { number: number; text: string }[],
  phrase: string,
  hint: number,
  stageDirs?: { after_line: number; text: string }[]
): number | null {
  const normPhrase = normalize(phrase.replace(/\s*\/\s*/g, " "));
  const hintLine = lines.find((l) => l.number === hint);
  if (hintLine && normalize(hintLine.text).includes(normPhrase)) return hint;
  for (let delta = 1; delta <= 20; delta++) {
    for (const sign of [-1, 1] as const) {
      const n = hint + sign * delta;
      const l = lines.find((x) => x.number === n);
      if (l && normalize(l.text).includes(normPhrase)) return n;
    }
  }
  const singleLine = lines
    .filter((l) => normalize(l.text).includes(normPhrase))
    .map((l) => ({ n: l.number, dist: Math.abs(l.number - hint) }))
    .sort((a, b) => a.dist - b.dist);
  if (singleLine[0]) return singleLine[0].n;
  for (let i = 0; i < lines.length - 1; i++) {
    const joined = normalize(lines[i].text + " " + lines[i + 1].text);
    if (joined.includes(normPhrase)) return lines[i].number;
  }
  if (stageDirs) {
    const sd = stageDirs.find((sd) => normalize(sd.text).includes(normPhrase));
    if (sd) {
      const anchor = lines.find((l) => l.number === sd.after_line + 1)?.number;
      return anchor ?? (lines[0]?.number ?? null);
    }
  }
  const words = normPhrase.split(" ").filter((w) => w.length >= 4);
  if (words.length > 0) {
    const windowStart = Math.max(1, hint - 6);
    const windowEnd = hint + 6;
    const windowText = lines
      .filter((l) => l.number >= windowStart && l.number <= windowEnd)
      .map((l) => normalize(l.text))
      .join(" ");
    if (words.every((w) => windowText.includes(w))) {
      const best = lines
        .filter((l) => l.number >= windowStart && l.number <= windowEnd)
        .map((l) => {
          const text = normalize(l.text);
          const count = words.filter((w) => text.includes(w)).length;
          return { n: l.number, count };
        })
        .sort((a, b) => b.count - a.count)[0];
      return best?.n ?? hint;
    }
  }
  return null;
}

function main() {
  const sectionIds = Object.keys(GLOSSES);
  let totalGlosses = 0;
  let totalSkipped = 0;
  const summary: { id: string; count: number; skipped: number }[] = [];

  console.log(`=== Seeding Henry V glosses (${sectionIds.length} sections) ===\n`);

  for (const sectionId of sectionIds) {
    const filePath = path.join(CONTENT_DIR, `${sectionId}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn(`  MISSING FILE: ${sectionId}.json — skipping`);
      continue;
    }
    const section = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const glossList = GLOSSES[sectionId];
    const valid: { id: string; line: number; phrase: string; definition: string }[] = [];
    let skipped = 0;

    for (let i = 0; i < glossList.length; i++) {
      const g = glossList[i];
      const actualLine = findLineForPhrase(section.lines, g.phrase, g.line, section.stage_directions);
      if (actualLine === null) {
        console.warn(`  ${sectionId}: cannot locate "${g.phrase}" near L${g.line}`);
        skipped++;
        continue;
      }
      valid.push({
        id: `${sectionId}_gloss${i + 1 - skipped}`,
        line: actualLine,
        phrase: g.phrase,
        definition: g.definition,
      });
    }

    section.glosses = valid;
    fs.writeFileSync(filePath, JSON.stringify(section, null, 2));

    totalGlosses += valid.length;
    totalSkipped += skipped;
    summary.push({ id: sectionId, count: valid.length, skipped });
    console.log(
      `  ${sectionId}: ${valid.length} glosses${skipped > 0 ? ` (${skipped} not found)` : ""}`
    );
  }

  console.log(`\n=== Summary ===`);
  console.log(`  Total glosses: ${totalGlosses}`);
  console.log(`  Not located:   ${totalSkipped}`);
  console.log(`  Sections:      ${summary.length}`);
  console.log(`  Average:       ${Math.round(totalGlosses / summary.length)} per section`);
}

main();
