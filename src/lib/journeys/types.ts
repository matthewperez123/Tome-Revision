/**
 * Journeys — the typed, reusable Journey template.
 *
 * A Journey is a fixed-length, day-by-day path through one book: each day
 * pairs a short reading target (real public-domain text, anchored excerpt
 * lines) with a literary context card, a Virgil prompt, and a 3–5 item
 * Trial built from the committed Trial engine families
 * (src/lib/trials/types.ts). Days may carry a milestone Seal; the final
 * day culminates in the book's Seal + Stoa reward and a shareable
 * learning record.
 *
 * ── How another book plugs in ─────────────────────────────────────────
 * 1. Author a new seed file under `content/journeys/<slug>-<days>.json`
 *    matching `JourneyTemplateSchema`. Trial items are validated against
 *    the SAME zod union the Trial engine consumes (`TrialItemSchema`), so
 *    any of the fifteen families work. Excerpt lines carry stable
 *    `anchor` ids; item `anchors`/`evidenceAnchor.paragraphId` reference
 *    those ids (plus an optional verbatim `quote`).
 * 2. Add a route segment `src/app/(standalone)/journeys/<slug>/page.tsx`
 *    that imports the JSON, calls `parseJourneyTemplate`, and renders
 *    `<JourneyExperience template={...} />` (see journeys/macbeth).
 * 3. The book should exist in the committed registry
 *    (src/lib/books/registry.ts) so the palette / sealName / Stoa reward
 *    resolve; `finalReward.stoaRewardId` must be a Stoa catalog id
 *    (src/lib/stoa/rewards.ts).
 * 4. Progress is isolated per journey id in localStorage under
 *    `tome-showcase:journey:<id>` (see ./progress.ts) — showcase-only,
 *    no Supabase writes.
 * 5. Copy `content/journeys/validate-macbeth-14.ts` as a template for a
 *    validation script and run it with `./node_modules/.bin/tsx`.
 *
 * The Macbeth seed (content/journeys/macbeth-14.json) is the reference
 * implementation of this contract.
 */
import { z } from "zod"
import { TrialItemSchema } from "@/lib/trials/types"

// ── Reading target ─────────────────────────────────────

/** One line of the day's anchored reading excerpt (real book text). */
export const JourneyReadingLineSchema = z.object({
  /**
   * Stable anchor id for this line (e.g. "d5-e3"). Trial item anchors
   * reference these ids via PassageAnchor.paragraphId.
   */
  anchor: z.string().min(1),
  /** Dramatic speaker, when the excerpt is dialogue/verse drama. */
  speaker: z.string().optional(),
  /** Verbatim public-domain text of the line (short quotes). */
  text: z.string().min(1),
})
export type JourneyReadingLine = z.infer<typeof JourneyReadingLineSchema>

/** A pointer at one source chapter in the bundled public-domain text. */
export const JourneyChapterRefSchema = z.object({
  /** Chapter index into public/content/<book>/ch-<index>.json. */
  chapterIndex: z.number().int().min(0),
  /** Chapter title as listed in public/content/<book>/meta.json. */
  chapterTitle: z.string().min(1),
})
export type JourneyChapterRef = z.infer<typeof JourneyChapterRefSchema>

export const JourneyReadingTargetSchema = z.object({
  /** Source chapters this day's reading is drawn from. */
  chapterRefs: z.array(JourneyChapterRefSchema).min(1),
  /** Act/scene-style citation shown with the excerpt. */
  citation: z.string().min(1),
  /** Calm-reader heading for the excerpt. */
  excerptTitle: z.string().min(1),
  /** One-sentence lead-in above the excerpt (not counted in card limit). */
  excerptIntro: z.string().optional(),
  /** The anchored excerpt lines the day's Trial items draw on. */
  excerpt: z.array(JourneyReadingLineSchema).min(1),
  /** Estimated reading minutes for the excerpt (from meta.json word counts). */
  estimatedMinutes: z.number().int().min(1),
  /** Honest provenance note (never an invented edition claim). */
  sourceNote: z.string().min(1),
})
export type JourneyReadingTarget = z.infer<typeof JourneyReadingTargetSchema>

// ── Days ───────────────────────────────────────────────

/** A milestone Seal earned mid-journey (the final Seal lives on finalReward). */
export const JourneyMilestoneSealSchema = z.object({
  /** Stable seal id (drives medallion motif rotation + persistence). */
  sealId: z.string().min(1),
  /** Display name on the medallion + record. */
  name: z.string().min(1),
  /** One line on why this moment earns a Seal. */
  description: z.string().min(1),
})
export type JourneyMilestoneSeal = z.infer<typeof JourneyMilestoneSealSchema>

/** Word counter for the 100-word context-card ceiling. */
function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export const JourneyDaySchema = z.object({
  /** 1-based day number; must be strictly ascending across days[]. */
  day: z.number().int().min(1),
  /** Short day title (shown on the path map node + day header). */
  title: z.string().min(1),
  /** Optional poetic subtitle (storm-palette explore view). */
  subtitle: z.string().optional(),
  readingTarget: JourneyReadingTargetSchema,
  /**
   * Literary context card — max 100 words, enforced. Accuracy matters:
   * dates, sources, and allusions must be real.
   */
  contextCard: z
    .string()
    .min(1)
    .refine((text) => wordCount(text) <= 100, {
      message: "contextCard must be at most 100 words",
    }),
  /**
   * The question Virgil poses before reading and again before the Trial —
   * written in his voice (see src/lib/virgil/copy.ts tone principles).
   */
  virgilPrompt: z.string().min(1),
  /** 3–5 Trial items, any mix of the fifteen committed families. */
  trial: z
    .array(TrialItemSchema)
    .min(3, "each day needs at least 3 Trial items")
    .max(5, "each day caps at 5 Trial items"),
  /** Flat Wisdom bonus for completing the day (on top of per-item Wisdom). */
  wisdomAward: z.number().int().min(1),
  /** Milestone Seal awarded with this day's completion, if any. */
  milestoneSeal: JourneyMilestoneSealSchema.optional(),
})
export type JourneyDay = z.infer<typeof JourneyDaySchema>

// ── Final reward + template ────────────────────────────

export const JourneyFinalRewardSchema = z.object({
  /** The book's Seal name (registry sealName for the seeded book). */
  sealName: z.string().min(1),
  /** Stable seal id for the final Seal medallion + persistence. */
  sealId: z.string().min(1),
  /** Stoa reward id restored on completion (src/lib/stoa/rewards.ts catalog). */
  stoaRewardId: z.string().min(1),
  /** Certificate-style shareable record copy (no fake claims — numbers
   *  are rendered from real persisted progress). */
  shareableRecord: z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
  }),
})
export type JourneyFinalReward = z.infer<typeof JourneyFinalRewardSchema>

export const JourneyTemplateSchema = z
  .object({
    /** Stable journey id — namespaces the progress store. */
    id: z.string().min(1),
    /** Book slug from the committed registry (src/lib/books/registry.ts). */
    bookSlug: z.string().min(1),
    title: z.string().min(1),
    /** Displayed under the title on the path map. */
    tagline: z.string().min(1),
    /** Ordered days; numbers must be 1..N strictly ascending. */
    days: z.array(JourneyDaySchema).min(1),
    finalReward: JourneyFinalRewardSchema,
  })
  .superRefine((template, ctx) => {
    template.days.forEach((day, index) => {
      if (day.day !== index + 1) {
        ctx.addIssue({
          code: "custom",
          path: ["days", index, "day"],
          message: `days must be numbered 1..N in order (expected ${index + 1}, got ${day.day})`,
        })
      }
    })
  })
export type JourneyTemplate = z.infer<typeof JourneyTemplateSchema>

// ── Parse helpers ──────────────────────────────────────

/** Validate an unknown seed (JSON import) into a typed JourneyTemplate. */
export function parseJourneyTemplate(raw: unknown): JourneyTemplate {
  return JourneyTemplateSchema.parse(raw)
}

/** Safe variant — returns null instead of throwing. */
export function safeParseJourneyTemplate(raw: unknown): JourneyTemplate | null {
  const r = JourneyTemplateSchema.safeParse(raw)
  return r.success ? r.data : null
}
