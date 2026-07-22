/**
 * Virgil's prepared, passage-grounded exchange for the showcase.
 *
 * The question is fixed and anchored to the highlighted line; the answer is
 * a fixed sequence of segments, each carrying paragraph citations into the
 * curated passage. The VirgilAsk component reveals the tokens on a fixed
 * cadence (simulated streaming) — the CONTENT is identical on every run,
 * every reset, every device. No model call, no network.
 */

export interface VirgilCitation {
  /** Passage anchor id (mac-1-7-p#). */
  paragraphId: string
  /** Short label rendered on the citation chip. */
  label: string
}

export interface VirgilAnswerSegment {
  /** One beat of the answer; revealed in order. */
  text: string
  /** Citations attached to this beat (chips appear when the beat lands). */
  citations: VirgilCitation[]
}

export interface PreparedExchange {
  /** The prepared question, grounded in the highlighted line. */
  question: string
  /** Short thinking-phase captions for the simulated stream. */
  phases: { thinking: string; retrieving: string }
  /** The answer, in reveal order. */
  segments: VirgilAnswerSegment[]
  /** Virgil's closing follow-up prompt (Socratic, no answer needed). */
  followUp: string
}

export const MACBETH_EXCHANGE: PreparedExchange = {
  question:
    "Macbeth says he has “no spur” to kill Duncan — so what does he admit is the only thing driving him, and why does that admission matter?",
  phases: {
    thinking: "Virgil is reading the highlighted line…",
    retrieving: "Virgil is gathering the surrounding paragraphs…",
  },
  segments: [
    {
      text:
        "Look at the line you marked. A spur drives a horse from outside; Macbeth looks for one and finds nothing — no grievance, no insult, no injury done to him. What remains is “only / Vaulting ambition”: ambition is not a reason he has been given, it is a force he carries.",
      citations: [{ paragraphId: "mac-1-7-p5", label: "¶5 · the spur" }],
    },
    {
      text:
        "He says so only after counting the costs aloud. He is Duncan’s kinsman, subject, and host — three bonds that should “shut the door” against the murderer, not arm him. And Duncan has ruled so cleanly that his virtues will “plead like angels” against the deed.",
      citations: [
        { paragraphId: "mac-1-7-p3", label: "¶3 · double trust" },
        { paragraphId: "mac-1-7-p4", label: "¶4 · Duncan’s virtues" },
      ],
    },
    {
      text:
        "That is why the admission matters: Macbeth has already lost the argument with himself, and knows it. “Vaulting ambition, which o’erleaps itself” is a rider thrown by his own leap — Shakespeare hands him the verdict on his crime a full act before he commits it.",
      citations: [{ paragraphId: "mac-1-7-p5", label: "¶5 · o’erleaps itself" }],
    },
    {
      text:
        "Watch what happens next: he announces “We will proceed no further in this business” — and Lady Macbeth answers not his arguments but his manhood. The reasons survive; the resolve does not.",
      citations: [{ paragraphId: "mac-1-7-p6", label: "¶6 · proceed no further" }],
    },
  ],
  followUp:
    "A question to carry into the Trial: if Macbeth's own reason defeats him, what exactly does Lady Macbeth defeat?",
}
