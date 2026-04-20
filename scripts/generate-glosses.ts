#!/usr/bin/env npx tsx
/**
 * generate-glosses.ts — Generate inline glosses for any Shakespeare play
 * using Claude.
 *
 * Reads structured scene JSONs from content/{work}/, sends each scene to
 * Claude with the glosses system prompt, and writes the glosses back into
 * the JSON files.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... npx tsx scripts/generate-glosses.ts --work othello
 *   npx tsx scripts/generate-glosses.ts --work hamlet --scene hamlet_act3_scene1
 *   npx tsx scripts/generate-glosses.ts --work othello --dry-run
 *
 * Concurrency: 3 (adjustable via --concurrency N)
 */

import * as fs from "fs";
import * as path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { getWorkConfig } from "./config/works";

const ROOT = path.resolve(__dirname, "..");
const PROMPT_PATH = path.join(ROOT, "prompts/glosses-system-prompt.md");

// ── CLI args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const workArg = args.find((a, i) => args[i - 1] === "--work");
if (!workArg) {
  console.error("ERROR: --work <workId> required (e.g. --work othello)");
  process.exit(1);
}
const workConfig = getWorkConfig(workArg);
if (!workConfig) {
  console.error(`ERROR: No config registered for work '${workArg}'`);
  process.exit(1);
}
const CONTENT_DIR = path.join(ROOT, `content/${workConfig.workId}`);

const singleScene = args.find((a, i) => args[i - 1] === "--scene") || null;
const dryRun = args.includes("--dry-run");
const concurrencyArg = args.find((a, i) => args[i - 1] === "--concurrency");
const CONCURRENCY = concurrencyArg ? parseInt(concurrencyArg, 10) : 3;

// ── Types ───────────────────────────────────────────────────────────────────

interface Line {
  number: number;
  speaker?: string;
  text: string;
}

interface Gloss {
  id: string;
  line: number;
  phrase: string;
  definition: string;
}

interface SectionJSON {
  section_id: string;
  lines: Line[];
  glosses: Gloss[];
  [key: string]: unknown;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatSceneForPrompt(section: SectionJSON): string {
  const header = `Scene: ${section.section_id}\n\n`;
  const lines = section.lines
    .map((l) => {
      const speaker = l.speaker ? `[${l.speaker}] ` : "";
      return `L${l.number}: ${speaker}${l.text}`;
    })
    .join("\n");
  return header + lines;
}

async function generateGlossesForScene(
  client: Anthropic,
  section: SectionJSON,
  systemPrompt: string,
  model: string
): Promise<Gloss[]> {
  const sceneText = formatSceneForPrompt(section);
  const maxLineNumber = Math.max(...section.lines.map((l) => l.number));

  const response = await client.messages.create({
    model,
    max_tokens: 8192,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Generate glosses for the following scene. Remember: target 30–60 glosses. Every archaism, Elizabethan phrase, classical allusion, or unusual word should be glossed.\n\n${sceneText}`,
      },
    ],
  });

  // Extract JSON from response
  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Find JSON block in response
  const jsonMatch =
    text.match(/```json\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*"glosses"[\s\S]*\}/);

  if (!jsonMatch) {
    console.error(`  WARNING: No valid JSON in response for ${section.section_id}`);
    console.error(`  Response preview: ${text.substring(0, 200)}`);
    return [];
  }

  const jsonStr = jsonMatch[1] || jsonMatch[0];
  let parsed: { glosses: { line: number; phrase: string; definition: string }[] };

  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    console.error(`  WARNING: JSON parse error for ${section.section_id}: ${e}`);
    return [];
  }

  // Validate and assign IDs
  const validGlosses: Gloss[] = [];
  let glossIndex = 0;

  for (const g of parsed.glosses) {
    // Validate line number is in range
    if (g.line < 1 || g.line > maxLineNumber) {
      console.warn(
        `  SKIP: gloss line ${g.line} out of range [1, ${maxLineNumber}] in ${section.section_id}`
      );
      continue;
    }

    // Validate phrase exists in the line text
    const matchingLine = section.lines.find((l) => l.number === g.line);
    if (!matchingLine) {
      console.warn(`  SKIP: no line ${g.line} in ${section.section_id}`);
      continue;
    }

    // Check phrase is present (case-insensitive for flexibility)
    const lineText = matchingLine.text.toLowerCase();
    const phrase = g.phrase.toLowerCase();
    if (!lineText.includes(phrase)) {
      // Try nearby lines (±1) for multi-line phrases
      const nearbyLines = section.lines.filter(
        (l) => Math.abs(l.number - g.line) <= 1
      );
      const nearbyText = nearbyLines.map((l) => l.text.toLowerCase()).join(" ");
      if (!nearbyText.includes(phrase)) {
        console.warn(
          `  SKIP: phrase "${g.phrase}" not found near line ${g.line} in ${section.section_id}`
        );
        continue;
      }
    }

    glossIndex++;
    validGlosses.push({
      id: `${section.section_id}_gloss${glossIndex}`,
      line: g.line,
      phrase: g.phrase,
      definition: g.definition,
    });
  }

  return validGlosses;
}

// ── Concurrency limiter ─────────────────────────────────────────────────────

async function pMap<T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>,
  concurrency: number
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const i = nextIndex++;
      results[i] = await fn(items[i], i);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () =>
    worker()
  );
  await Promise.all(workers);
  return results;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // Load system prompt
  const systemPrompt = fs.readFileSync(PROMPT_PATH, "utf-8").trim();

  // Initialize Anthropic client
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ERROR: Set ANTHROPIC_API_KEY environment variable");
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  // Find scene files
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.startsWith(`${workConfig.workId}_act`) && f.endsWith(".json"))
    .sort();

  const scenesToProcess = singleScene
    ? files.filter((f) => f === `${singleScene}.json`)
    : files;

  if (scenesToProcess.length === 0) {
    console.error("No scene files found to process");
    process.exit(1);
  }

  // Tier-1 sections route to Opus 4.6; all others to Sonnet 4.6.
  const TIER1 = new Set(workConfig.tier1Sections ?? []);
  const SONNET = "claude-sonnet-4-6";
  const OPUS = "claude-opus-4-6";

  console.log(
    `=== Generating Glosses (${scenesToProcess.length} scenes, concurrency ${CONCURRENCY}) ===`
  );
  if (TIER1.size > 0) {
    console.log(`  Tier-1 → ${OPUS}: ${[...TIER1].join(", ")}`);
    console.log(`  Others → ${SONNET}\n`);
  } else {
    console.log(`  All → ${SONNET}\n`);
  }

  let totalGlosses = 0;

  await pMap(
    scenesToProcess,
    async (filename, _idx) => {
      const filePath = path.join(CONTENT_DIR, filename);
      const section: SectionJSON = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      const model = TIER1.has(section.section_id) ? OPUS : SONNET;
      const tierTag = TIER1.has(section.section_id) ? " [TIER-1 Opus]" : "";
      console.log(`  Processing ${section.section_id}${tierTag}...`);

      const glosses = await generateGlossesForScene(client, section, systemPrompt, model);

      console.log(
        `  ${section.section_id}: ${glosses.length} glosses generated via ${model}`
      );
      totalGlosses += glosses.length;

      if (!dryRun) {
        section.glosses = glosses;
        fs.writeFileSync(filePath, JSON.stringify(section, null, 2));
      }
    },
    CONCURRENCY
  );

  console.log(`\n=== Summary ===`);
  console.log(`  Total glosses: ${totalGlosses}`);
  console.log(`  Scenes processed: ${scenesToProcess.length}`);
  console.log(`  Average per scene: ${Math.round(totalGlosses / scenesToProcess.length)}`);
  if (dryRun) console.log(`  (DRY RUN — files not modified)`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
