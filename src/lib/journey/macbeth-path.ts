// ─────────────────────────────────────────────
// Journey Home — Macbeth path data
// ─────────────────────────────────────────────
// The current-book journey path, built from the REAL Macbeth structure in
// public/content/macbeth/meta.json (34 chapters: front matter + Acts I–V).
// Chapters are grouped into day nodes along the book's 14-day journey
// (registry journeyLengthDays), with Trial nodes after each act block, the
// Seal at mastery, and the Stoa restoration at the end.
//
// States are seeded to tell a story: the reader has finished days 1–4 and
// passed Trial I; Day 5 is current; everything beyond is locked. Nodes
// completed live during the showcase (guided loop) come from
// src/lib/journey/state.ts and are merged in by resolveNodeStates().

import type { PathNodeSpec } from "@/components/game/PathMap"

export type JourneyNodeKind = PathNodeSpec["kind"]
export type JourneyNodeState = PathNodeSpec["state"]

export interface JourneyNodeDef {
  id: string
  kind: JourneyNodeKind
  /** Short node label rendered under the map node. */
  label: string
  /** Full accessible name, used in aria copy and the legend. */
  title: string
  /** Macbeth chapter indices (meta.json `index`) covered by this node. */
  chapters: readonly number[]
  /** viewBox coordinates (400 × 900 map). */
  x: number
  y: number
}

// ── Seeded demo story ────────────────────────

/** Nodes already done when the demo opens (days 1–4 + Trial I). */
export const SEEDED_DONE_NODE_IDS: readonly string[] = [
  "day-1",
  "day-2",
  "trial-1",
  "day-3",
  "day-4",
]

/** Node the reader is on when the demo opens. */
export const SEEDED_CURRENT_NODE_ID = "day-5"

// ── Real Macbeth structure (public/content/macbeth/meta.json) ──

export const MACBETH_CHAPTER_COUNT = 34
export const MACBETH_ESTIMATED_MINUTES = 91
/** Trials gating the act blocks (I, II–III, IV–V). */
export const MACBETH_TRIAL_COUNT = 3

// ── Path nodes ───────────────────────────────
// Zigzag down a 400×900 viewBox; PathMap bows each segment.

const X_LEFT = 120
const X_RIGHT = 280
const Y_TOP = 44
const Y_STEP = 56

function nodePosition(index: number): { x: number; y: number } {
  return { x: index % 2 === 0 ? X_LEFT : X_RIGHT, y: Y_TOP + index * Y_STEP }
}

type NodeSeed = Omit<JourneyNodeDef, "x" | "y">

const NODE_SEEDS: readonly NodeSeed[] = [
  {
    id: "day-1",
    kind: "chapter",
    label: "Day 1",
    title: "Day 1 · The Heath — Act I, Scenes i–iii",
    chapters: [0, 1, 2, 3, 4],
  },
  {
    id: "day-2",
    kind: "chapter",
    label: "Day 2",
    title: "Day 2 · A King's Welcome — Act I, Scenes iv–vii",
    chapters: [5, 6, 7, 8],
  },
  {
    id: "trial-1",
    kind: "trial",
    label: "Trial I",
    title: "Trial I · Prophecy and Ambition",
    chapters: [],
  },
  {
    id: "day-3",
    kind: "chapter",
    label: "Day 3",
    title: "Day 3 · The Dagger — Act II, Scenes i–ii",
    chapters: [9, 10, 11],
  },
  {
    id: "day-4",
    kind: "chapter",
    label: "Day 4",
    title: "Day 4 · The Discovery — Act II, Scenes iii–iv",
    chapters: [12, 13],
  },
  {
    id: "day-5",
    kind: "chapter",
    label: "Day 5",
    title: "Day 5 · The Serpent's Egg — Act III, Scenes i–ii",
    chapters: [14, 15, 16],
  },
  {
    id: "day-6",
    kind: "chapter",
    label: "Day 6",
    title: "Day 6 · Banquo's Ghost — Act III, Scenes iii–vi",
    chapters: [17, 18, 19, 20],
  },
  {
    id: "trial-2",
    kind: "trial",
    label: "Trial II",
    title: "Trial II · Blood and Guilt",
    chapters: [],
  },
  {
    id: "day-7",
    kind: "chapter",
    label: "Day 7",
    title: "Day 7 · The Cauldron — Act IV, Scene i",
    chapters: [21, 22],
  },
  {
    id: "day-8",
    kind: "chapter",
    label: "Day 8",
    title: "Day 8 · Macduff — Act IV, Scenes ii–iii",
    chapters: [23, 24],
  },
  {
    id: "trial-3",
    kind: "trial",
    label: "Trial III",
    title: "Trial III · Equivocation",
    chapters: [],
  },
  {
    id: "day-9",
    kind: "chapter",
    label: "Day 9",
    title: "Day 9 · Sleepwalking — Act V, Scenes i–ii",
    chapters: [25, 26, 27],
  },
  {
    id: "day-10",
    kind: "chapter",
    label: "Day 10",
    title: "Day 10 · Birnam Wood — Act V, Scenes iii–v",
    chapters: [28, 29, 30],
  },
  {
    id: "day-11",
    kind: "chapter",
    label: "Day 11",
    title: "Day 11 · Tomorrow — Act V, Scenes vi–viii",
    chapters: [31, 32, 33],
  },
  {
    id: "seal-1",
    kind: "seal",
    label: "Seal",
    title: "Seal · The Dagger in the Dark",
    chapters: [],
  },
  {
    id: "stoa-1",
    kind: "stoa",
    label: "Stoa",
    title: "Stoa · The Storm over the Heath",
    chapters: [],
  },
]

/** The Macbeth journey path, in walking order, with map coordinates. */
export const MACBETH_PATH: readonly JourneyNodeDef[] = NODE_SEEDS.map(
  (seed, index) => ({ ...seed, ...nodePosition(index) }),
)

// ── State derivation ─────────────────────────

/**
 * Merge the seeded story with live showcase completions into PathNodeSpecs.
 * A node is "done" when seeded or completed live; the first node not done is
 * "current"; everything after it is "locked". Completing the current node
 * therefore flips the next one unlocked — PathNode plays its wake-pop.
 */
export function resolveNodeStates(
  liveCompleted: readonly string[],
): PathNodeSpec[] {
  const done = new Set([...SEEDED_DONE_NODE_IDS, ...liveCompleted])
  let currentAssigned = false
  return MACBETH_PATH.map((node) => {
    let state: JourneyNodeState
    if (done.has(node.id)) {
      state = "done"
    } else if (!currentAssigned) {
      state = "current"
      currentAssigned = true
    } else {
      state = "locked"
    }
    return {
      id: node.id,
      kind: node.kind,
      state,
      label: node.label,
      x: node.x,
      y: node.y,
    }
  })
}

/** Look up a path node definition by id. */
export function getJourneyNode(id: string): JourneyNodeDef | undefined {
  return MACBETH_PATH.find((node) => node.id === id)
}

/** The first incomplete node — what "Continue reading" resumes. */
export function currentJourneyNode(
  liveCompleted: readonly string[],
): JourneyNodeDef {
  const done = new Set([...SEEDED_DONE_NODE_IDS, ...liveCompleted])
  return MACBETH_PATH.find((node) => !done.has(node.id)) ?? MACBETH_PATH[MACBETH_PATH.length - 1]!
}

/** Chapters read so far, counting chapter nodes that are done. */
export function chaptersRead(liveCompleted: readonly string[]): number {
  const done = new Set([...SEEDED_DONE_NODE_IDS, ...liveCompleted])
  return MACBETH_PATH.filter(
    (node) => node.kind === "chapter" && done.has(node.id),
  ).reduce((sum, node) => sum + node.chapters.length, 0)
}

/** Trials passed so far. */
export function trialsPassed(liveCompleted: readonly string[]): number {
  const done = new Set([...SEEDED_DONE_NODE_IDS, ...liveCompleted])
  return MACBETH_PATH.filter(
    (node) => node.kind === "trial" && done.has(node.id),
  ).length
}

/** The next Trial on the path (first trial node not done). */
export function nextTrial(
  liveCompleted: readonly string[],
): JourneyNodeDef | undefined {
  const done = new Set([...SEEDED_DONE_NODE_IDS, ...liveCompleted])
  return MACBETH_PATH.find((node) => node.kind === "trial" && !done.has(node.id))
}

/** The node that must complete before `id` unlocks (for locked-node copy). */
export function unlockRequirement(id: string): JourneyNodeDef | undefined {
  const index = MACBETH_PATH.findIndex((node) => node.id === id)
  return index > 0 ? MACBETH_PATH[index - 1] : undefined
}
