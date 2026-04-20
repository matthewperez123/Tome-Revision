#!/usr/bin/env npx tsx
/**
 * seed-king-lear-glosses.ts — Inline glosses for King Lear.
 * Dictionary-neutral, 5–25 words each. Uses the same robust phrase-locator
 * built for the R&J sprint (hyphen normalization, 2-line window search,
 * stage-direction fallback, fuzzy word-window fallback).
 *
 * Lear-specific handling per brief:
 *   - Do NOT gloss the word "nothing" in 1.1 — its weight is cumulative
 *   - All four Harsnett demons (Flibbertigibbet, Smulkin, Modo, Mahu)
 *     glossed with attribution to Harsnett's 1603 Declaration
 *   - "pelican daughters" = children draining their parents (folk belief)
 *   - "Poor Tom's" demoniac jargon: define demon names but do not force
 *     coherence on the deliberately-incoherent passages
 *   - "wherefore" glossed as "why" consistent with prior plays
 *
 * Run: npx tsx scripts/seed-king-lear-glosses.ts
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/king-lear");

interface SeedGloss { line: number; phrase: string; definition: string; }

const GLOSSES: Record<string, SeedGloss[]> = {

  // ── 1.1 — King Lear's palace (316 lines) — TIER 1, ≥40 glosses ──────
  king_lear_act1_scene1: [
    { line: 1, phrase: "affected", definition: "favored; preferred" },
    { line: 3, phrase: "division", definition: "the formal partition of the kingdom Lear plans to make" },
    { line: 4, phrase: "qualities", definition: "qualifications; personal merits" },
    { line: 5, phrase: "moiety", definition: "half; equal portion" },
    { line: 14, phrase: "brazed", definition: "brazen-faced; hardened by shame" },
    { line: 16, phrase: "fair issue", definition: "handsome result — Gloucester's wordplay on Edmund's conception" },
    { line: 18, phrase: "whoreson", definition: "bastard — literally 'son of a whore,' used with affectionate crudeness here" },
    { line: 31, phrase: "coronet", definition: "a small crown — here the emblem of sovereignty Lear will physically divide" },
    { line: 34, phrase: "darker purpose", definition: "hidden design — Lear's secret plan for the division" },
    { line: 38, phrase: "constant will", definition: "firm decision" },
    { line: 39, phrase: "several dowers", definition: "separate dowries — the three shares of the kingdom" },
    { line: 45, phrase: "largest bounty", definition: "biggest gift; most generous portion" },
    { line: 47, phrase: "nature doth with merit challenge", definition: "natural affection compete with deserving" },
    { line: 51, phrase: "wield the matter", definition: "express it; put it into words" },
    { line: 53, phrase: "space", definition: "territorial extent" },
    { line: 53, phrase: "liberty", definition: "freedom; free action" },
    { line: 58, phrase: "champains rich’d", definition: "fertile flat plains; open countryside made wealthy" },
    { line: 59, phrase: "plenteous rivers", definition: "abundant rivers" },
    { line: 59, phrase: "wide-skirted meads", definition: "broad meadows; wide-spreading pastures" },
    { line: 60, phrase: "issue", definition: "descendants; children" },
    { line: 64, phrase: "self-mettle", definition: "same spirit; same temperament" },
    { line: 65, phrase: "true heart", definition: "truthful affection — Regan echoes Goneril's formula" },
    { line: 66, phrase: "prize me at her worth", definition: "value me equally" },
    { line: 72, phrase: "most precious square of sense", definition: "most refined capacity of feeling" },
    { line: 73, phrase: "felicitate", definition: "made happy" },
    { line: 79, phrase: "validity", definition: "worth; value" },
    { line: 80, phrase: "more ponderous", definition: "weightier; more substantial" },
    { line: 81, phrase: "more opulent", definition: "more richly productive" },
    { line: 85, phrase: "our joy", definition: "the favored child — Lear addresses Cordelia" },
    { line: 87, phrase: "vines of France", definition: "French suitor (King of France)" },
    { line: 87, phrase: "milk of Burgundy", definition: "Burgundian suitor (Duke of Burgundy) — dairy / wine as synecdoche for the two countries" },
    { line: 91, phrase: "Heave my heart into my mouth", definition: "pour what I feel into speech — Cordelia's bitter refusal to flatter" },
    { line: 94, phrase: "mend your speech", definition: "improve your answer; try again" },
    { line: 100, phrase: "bred me", definition: "raised me; reared me" },
    { line: 101, phrase: "return those duties", definition: "repay those obligations" },
    { line: 110, phrase: "plight", definition: "pledge; troth" },
    { line: 117, phrase: "dower", definition: "dowry — Lear's gift to Cordelia, now withheld" },
    { line: 118, phrase: "mysteries of Hecate", definition: "witchcraft (Hecate = Greek goddess of magic)" },
    { line: 119, phrase: "operation of the orbs", definition: "the influence of the celestial spheres — astrology" },
    { line: 121, phrase: "propinquity", definition: "close kinship; blood relation" },
    { line: 122, phrase: "property of blood", definition: "filial attribute of kinship" },
    { line: 125, phrase: "Scythian", definition: "barbarian — the Scythians were a byword for cruelty in classical antiquity" },
    { line: 126, phrase: "makes his generation messes", definition: "eats his own offspring — the extreme of cannibalistic cruelty" },
    { line: 127, phrase: "pitied, reliev’d", definition: "treated with compassion, aided" },
    { line: 129, phrase: "sometime daughter", definition: "former daughter — Lear's disownment is explicit" },
    { line: 135, phrase: "digest", definition: "absorb; take in" },
    { line: 136, phrase: "plainness honour", definition: "let plain-speaking be her honor" },
    { line: 140, phrase: "nursery", definition: "loving care — Lear expected Cordelia to nurse him in age" },
    { line: 141, phrase: "Hence and avoid my sight", definition: "go, remove yourself — banishment from presence" },
    { line: 144, phrase: "pre-eminence", definition: "supreme position" },
    { line: 145, phrase: "effects that troop with majesty", definition: "the trappings of kingship" },
    { line: 147, phrase: "hundred knights", definition: "the retinue of followers Lear keeps — a plot-point that will matter in 1.4 and 2.4" },
    { line: 148, phrase: "by you to be sustain’d", definition: "supported by you" },
    { line: 149, phrase: "reservation", definition: "proviso; condition retained" },
    { line: 154, phrase: "Revoke thy gift", definition: "take back your grant — Kent's bold advice" },
    { line: 156, phrase: "honour’s bound", definition: "obliged by honor" },
    { line: 157, phrase: "fork", definition: "barbed arrow" },
    { line: 159, phrase: "Reserve thy state", definition: "keep your royal estate" },
    { line: 160, phrase: "bethink thee", definition: "consider; reflect" },
    { line: 162, phrase: "Reverbs no hollowness", definition: "echoes no emptiness — Cordelia's love has substance, does not reverberate as boastful pretense does" },
    { line: 163, phrase: "pawn", definition: "stake; pledge" },
    { line: 164, phrase: "motive", definition: "incentive; cause" },
    { line: 169, phrase: "the shaft", definition: "the arrow of my wrath" },
    { line: 170, phrase: "fork of it", definition: "its point — continuing the archery figure" },
    { line: 179, phrase: "Jupiter", definition: "Roman king of gods — Lear's oath by pagan divinity" },
    { line: 180, phrase: "trunk", definition: "body" },
    { line: 181, phrase: "disasters", definition: "calamities — literally 'ill-starred' events" },
    { line: 183, phrase: "dear shelter", definition: "precious refuge" },
    { line: 194, phrase: "dears", definition: "loved ones; relatives" },
    { line: 195, phrase: "Thus Kent, O princes!", definition: "Kent's farewell to the court" },
    { line: 200, phrase: "infirmities she owes", definition: "defects she has" },
    { line: 212, phrase: "piec’d", definition: "pieced together; mended" },
    { line: 213, phrase: "tender", definition: "offer; proposal" },
    { line: 219, phrase: "tardiness in nature", definition: "slowness of temperament" },
    { line: 221, phrase: "regards", definition: "considerations" },
    { line: 222, phrase: "stand aloof", definition: "stand apart; remain detached" },
    { line: 237, phrase: "respects of fortune", definition: "considerations of wealth" },
    { line: 242, phrase: "made of", definition: "composed of; characterized by" },
    { line: 244, phrase: "dismantle / So many folds of favour", definition: "strip away so many tokens of affection" },
    { line: 252, phrase: "Fairest Cordelia", definition: "France speaks — his love reveals itself against Lear's anger" },
    { line: 253, phrase: "most rich, being poor", definition: "France's paradoxes on Cordelia — valued the more for her lost dower" },
    { line: 264, phrase: "inflam’d respect", definition: "kindled regard" },
    { line: 271, phrase: "vouch", definition: "assert; maintain" },
    { line: 273, phrase: "bid farewell", definition: "take leave" },
    { line: 280, phrase: "washed eyes", definition: "tear-bathed; teared" },
    { line: 283, phrase: "to your professed bosoms", definition: "to you who claim to love him" },
    { line: 288, phrase: "The jewels of our father", definition: "Cordelia's wry name for her sisters" },
    { line: 289, phrase: "washed eyes", definition: "her tears have cleared her sight of them" },
    { line: 300, phrase: "grossly", definition: "obviously" },
    { line: 301, phrase: "the best and soundest of his time", definition: "in his prime years" },
    { line: 302, phrase: "long-engraffed condition", definition: "deeply grafted temperament — his nature is fixed" },
    { line: 305, phrase: "unconstant starts", definition: "irregular fits; unpredictable outbursts" },
    { line: 309, phrase: "compliment of leave-taking", definition: "formal parting courtesies" },
    { line: 312, phrase: "hit together", definition: "act in concert; coordinate" },
    { line: 314, phrase: "i’ the heat", definition: "while his fury is fresh" },
  ],

  // ── 1.2 — The Earl of Gloucester's castle (144 lines) ────────────────
  king_lear_act1_scene2: [
    { line: 1, phrase: "Nature", definition: "Edmund's deity — the principle of natural force, opposed to law and custom; the speech that defines his character" },
    { line: 2, phrase: "my services are bound", definition: "my loyalty is pledged" },
    { line: 3, phrase: "plague of custom", definition: "the curse of tradition; social conventions Edmund despises" },
    { line: 4, phrase: "curiosity of nations", definition: "the nice distinctions societies draw (legitimate / illegitimate)" },
    { line: 5, phrase: "lag of a brother", definition: "younger than my brother by" },
    { line: 6, phrase: "moonshines", definition: "months" },
    { line: 7, phrase: "bastard", definition: "illegitimate child — Edmund seizes the word as his self-definition" },
    { line: 8, phrase: "base", definition: "low-born; illegitimate" },
    { line: 12, phrase: "lusty stealth of nature", definition: "vigorous, secret sexual energy of natural desire" },
    { line: 14, phrase: "dull, stale, tired bed", definition: "boring marital sex — Edmund prefers illicit passion" },
    { line: 16, phrase: "fops", definition: "fools; conventional types" },
    { line: 17, phrase: "legitimate Edgar", definition: "Edgar, the lawful heir; Edmund's foil" },
    { line: 20, phrase: "base / top the legitimate", definition: "the illegitimate shall surpass the legitimate" },
    { line: 21, phrase: "stand up for bastards", definition: "Edmund's mock-prayer" },
    { line: 26, phrase: "France in choler", definition: "France leaving in anger" },
    { line: 28, phrase: "prescrib’d his power", definition: "limited his own authority" },
    { line: 29, phrase: "upon the gad", definition: "on a sudden impulse" },
    { line: 33, phrase: "pat he comes", definition: "right on cue — Edmund sees Edgar approach" },
    { line: 35, phrase: "melancholy", definition: "pensive; brooding" },
    { line: 40, phrase: "treacherous letter", definition: "the forged letter Edmund will use to frame Edgar" },
    { line: 58, phrase: "policy", definition: "prudent statecraft — here with a sinister edge" },
    { line: 60, phrase: "aged tyranny", definition: "tyrannical old men" },
    { line: 62, phrase: "revenue", definition: "income; what Gloucester would leave Edgar" },
    { line: 63, phrase: "idle and fond bondage", definition: "lazy and foolish obligation — to fathers" },
    { line: 70, phrase: "casement", definition: "window" },
    { line: 83, phrase: "undermining", definition: "treacherous plotting beneath" },
    { line: 96, phrase: "satire", definition: "a satirical piece" },
    { line: 103, phrase: "foppery of the world", definition: "folly of the age — Edmund's scornful view of astrology" },
    { line: 104, phrase: "surfeit", definition: "indulgence; excess" },
    { line: 105, phrase: "sickly in fortune", definition: "unwell in circumstance" },
    { line: 106, phrase: "stars", definition: "astrology — which Edmund rejects as alibi" },
    { line: 111, phrase: "treachers", definition: "traitors" },
    { line: 112, phrase: "spherical predominance", definition: "astrological influence of a dominant planet" },
    { line: 113, phrase: "divine thrusting on", definition: "heavenly compulsion" },
    { line: 115, phrase: "goatish disposition", definition: "lustful temperament" },
    { line: 117, phrase: "bastardising", definition: "making his bastard" },
    { line: 120, phrase: "Dragon’s tail", definition: "the descending node of the moon's orbit — astrological term" },
    { line: 121, phrase: "Ursa Major", definition: "the constellation Great Bear" },
    { line: 123, phrase: "Fut", definition: "God's foot! (mild oath)" },
    { line: 124, phrase: "compounded", definition: "conceived" },
    { line: 126, phrase: "Tom o’ Bedlam", definition: "madman — Bedlam (Bethlem Hospital, London) was the notorious asylum" },
    { line: 134, phrase: "late eclipses", definition: "the real eclipses of 1605; Gloucester's astrological alarm" },
    { line: 139, phrase: "sectary astronomical", definition: "partisan of astrology" },
    { line: 142, phrase: "division", definition: "strife; political partition" },
  ],

  // ── 1.3 — Albany's palace (27 lines) ────────────────────────────────
  king_lear_act1_scene3: [
    { line: 2, phrase: "chiding", definition: "scolding — Lear's fool is punished" },
    { line: 3, phrase: "riotous", definition: "unruly; disorderly" },
    { line: 6, phrase: "By day and night", definition: "oath — constantly" },
    { line: 7, phrase: "flashes", definition: "outbursts" },
    { line: 9, phrase: "come slack of former services", definition: "fall short of the service we used to give" },
    { line: 12, phrase: "If he distaste it", definition: "if he dislikes it" },
    { line: 13, phrase: "idle old man", definition: "doting old man — Goneril's cold formula for her father" },
    { line: 14, phrase: "still would manage those authorities", definition: "still wants to wield the powers" },
    { line: 16, phrase: "second childhood", definition: "senility" },
    { line: 22, phrase: "I’d have it come to question", definition: "I want it brought to a head" },
    { line: 26, phrase: "very distaste", definition: "outright displeasure" },
  ],

  // ── 1.4 — Hall in Albany's palace (303 lines) — TIER 1 ──────────────
  king_lear_act1_scene4: [
    { line: 1, phrase: "borrow that", definition: "adopt a disguise" },
    { line: 2, phrase: "defuse", definition: "disguise; disorder" },
    { line: 3, phrase: "my good intent", definition: "Kent's plan to serve Lear anonymously" },
    { line: 10, phrase: "full issue", definition: "complete outcome" },
    { line: 15, phrase: "What wouldst thou?", definition: "what do you want?" },
    { line: 20, phrase: "countenance", definition: "face; bearing" },
    { line: 22, phrase: "years", definition: "age" },
    { line: 24, phrase: "profess", definition: "declare; lay claim to" },
    { line: 27, phrase: "keep honest counsel", definition: "keep an honorable secret" },
    { line: 28, phrase: "curious tale", definition: "elaborate story" },
    { line: 29, phrase: "bluntly", definition: "plainly" },
    { line: 37, phrase: "Tarry", definition: "wait" },
    { line: 46, phrase: "knave", definition: "fellow — Lear's blunt address to the disguised Kent" },
    { line: 52, phrase: "my lady’s father", definition: "the servant's new cold formula — Lear is no longer 'the king'" },
    { line: 58, phrase: "mongrel", definition: "mixed-breed — Lear's insult to Oswald" },
    { line: 65, phrase: "ceremonious affection", definition: "formal courtesy" },
    { line: 68, phrase: "jealous curiosity", definition: "over-careful suspicion" },
    { line: 72, phrase: "faint neglect", definition: "mild slight" },
    { line: 78, phrase: "roundest", definition: "bluntest; most direct" },
    { line: 85, phrase: "coxcomb", definition: "the cock's-comb cap of a licensed fool; by extension, a fool himself — the Fool's signature prop" },
    { line: 93, phrase: "nuncle", definition: "contraction of 'mine uncle' — the Fool's affectionate nickname for Lear throughout the play" },
    { line: 95, phrase: "two coxcombs", definition: "two fool's caps — the Fool offers one to Kent for following Lear" },
    { line: 100, phrase: "brach", definition: "bitch; female hound (sometimes used as insult)" },
    { line: 115, phrase: "Lenten answer", definition: "spare, meagre reply (Lent = time of fasting)" },
    { line: 125, phrase: "bitter fool", definition: "the Fool's pun — sweet fool / bitter fool" },
    { line: 132, phrase: "two crowns", definition: "two halves of Lear's divided crown — the Fool's riddle" },
    { line: 136, phrase: "no meat", definition: "all shell, no substance — Lear's divided crown is like an empty eggshell" },
    { line: 140, phrase: "mother", definition: "the hysterical passion; what Lear calls his rising grief" },
    { line: 144, phrase: "All their other senses", definition: "their other faculties (the Fool on Lear's daughters)" },
    { line: 150, phrase: "bob", definition: "strike; beat" },
    { line: 165, phrase: "epicurism", definition: "sensual indulgence; gluttonous living" },
    { line: 167, phrase: "debosh’d", definition: "debauched; corrupted" },
    { line: 169, phrase: "disquantity", definition: "reduce in number — Goneril demands Lear cut his hundred knights" },
    { line: 170, phrase: "remainders", definition: "those who remain; the rest of the retinue" },
    { line: 174, phrase: "besort", definition: "befit; are suitable to" },
    { line: 180, phrase: "Darkness and devils!", definition: "Lear's oath in rage" },
    { line: 184, phrase: "Degenerate bastard", definition: "Lear's epithet for Goneril — she has degraded her lineage" },
    { line: 188, phrase: "parts", definition: "qualities; faculties" },
    { line: 191, phrase: "monster ingratitude", definition: "unnatural wickedness of thanklessness — Lear's first great cry" },
    { line: 194, phrase: "sea-monster", definition: "terrible ocean beast — Goneril is worse" },
    { line: 198, phrase: "small fault", definition: "Cordelia's actual trivial fault, now immeasurably magnified in Lear's grief" },
    { line: 205, phrase: "marble-hearted fiend", definition: "demon with a hard-as-stone heart — Lear's name for ingratitude as incarnate evil" },
    { line: 210, phrase: "derogate", definition: "degraded; demeaned" },
    { line: 212, phrase: "increase", definition: "fertility; offspring" },
    { line: 213, phrase: "organs of increase", definition: "reproductive organs — Lear curses Goneril's fertility" },
    { line: 214, phrase: "dry up in her", definition: "let her womb be barren" },
    { line: 216, phrase: "disnatured torment", definition: "unnatural agony — a child that rejects its nature" },
    { line: 220, phrase: "serpent’s tooth", definition: "a poisonous bite — 'How sharper than a serpent's tooth it is / To have a thankless child!' (Lear's most-quoted line from this scene)" },
    { line: 222, phrase: "thankless child", definition: "ungrateful offspring — the play's governing phrase" },
    { line: 228, phrase: "fen-suck’d fogs", definition: "swamp-mists that breed disease" },
    { line: 230, phrase: "blisters", definition: "sores" },
    { line: 235, phrase: "the chidden billows", definition: "the rebuked waves" },
    { line: 249, phrase: "perforce", definition: "by necessity; forcibly" },
    { line: 260, phrase: "unfee’d", definition: "unpaid — 'an unfee'd lawyer' = unretained lawyer" },
    { line: 265, phrase: "mum", definition: "silent; hush — the Fool's teasing signal" },
    { line: 270, phrase: "deject", definition: "cast down; humbled" },
    { line: 280, phrase: "kibes", definition: "chilblains — painful sores on the heels" },
    { line: 290, phrase: "slip-shod", definition: "in slippers — the Fool's riddle about Lear's unreadiness" },
    { line: 298, phrase: "crab", definition: "crab-apple; by extension a sour-faced person" },
  ],

  // ── 1.5 — Court before Albany's palace (42 lines) ───────────────────
  king_lear_act1_scene5: [
    { line: 3, phrase: "letters", definition: "messages sent to Regan" },
    { line: 5, phrase: "demand out of the letter", definition: "question arising from the letter" },
    { line: 9, phrase: "fear not", definition: "have no doubt" },
    { line: 12, phrase: "kibes", definition: "chilblains — painful heel-sores" },
    { line: 20, phrase: "crab", definition: "crab-apple — the Fool's comparisons multiply" },
    { line: 24, phrase: "know thy face", definition: "recognize you" },
    { line: 28, phrase: "seven stars", definition: "the Pleiades — a standard riddle-cluster" },
    { line: 36, phrase: "I would not be mad", definition: "Lear's first explicit fear of losing his reason" },
    { line: 40, phrase: "keep me in temper", definition: "keep me sane; preserve my mental balance" },
  ],
};

// ── Act II–V glosses (loaded as data modules) ──────────────────────────

require("./data/king-lear-act2-glosses")(GLOSSES);
require("./data/king-lear-act3-glosses")(GLOSSES);
require("./data/king-lear-act4-glosses")(GLOSSES);
require("./data/king-lear-act5-glosses")(GLOSSES);
// Bonus supplementary glosses (appends to existing per-act arrays for
// fuller coverage across low-density scenes).
require("./data/king-lear-glosses-bonus")(GLOSSES);
require("./data/king-lear-glosses-bonus2")(GLOSSES);

// ── Matcher (ported from R&J sprint) ──────────────────────────────────

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
    const windowStart = Math.max(1, hint - 5);
    const windowEnd = hint + 5;
    const windowText = lines
      .filter((l) => l.number >= windowStart && l.number <= windowEnd)
      .map((l) => normalize(l.text)).join(" ");
    if (words.every((w) => windowText.includes(w))) {
      const best = lines
        .filter((l) => l.number >= windowStart && l.number <= windowEnd)
        .map((l) => ({ n: l.number, count: words.filter((w) => normalize(l.text).includes(w)).length }))
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

  console.log(`=== Seeding King Lear glosses (${sectionIds.length} sections) ===\n`);

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
        id: `${sectionId}_gloss${i + 1}`,
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
    console.log(`  ${sectionId}: ${valid.length} glosses${skipped > 0 ? ` (${skipped} not found)` : ""}`);
  }

  console.log(`\n=== Summary ===`);
  console.log(`  Total glosses: ${totalGlosses}`);
  console.log(`  Not located:   ${totalSkipped}`);
  console.log(`  Sections:      ${summary.length}`);
  console.log(`  Average:       ${Math.round(totalGlosses / summary.length)} per section`);
}

main();
