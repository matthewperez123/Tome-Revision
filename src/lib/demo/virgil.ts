/**
 * Scripted Virgil — the demo brain for the homepage Virgil drawer.
 *
 * VIRGIL_DEMO_MODE === "scripted": this NEVER calls the network / real
 * `askVirgil`. It returns canned, canon-grounded answers and streams them
 * token-by-token so the demo drawer feels alive without any AI request.
 *
 * Keyed to a fixed passage (The Iliad, Book I) so the suggestion pills and the
 * scholarly note line up with one coherent demo.
 */

export interface ScriptedExchange {
  /** The suggestion pill / prompt text the visitor can tap. */
  prompt: string
  /** Virgil's canned reply. */
  answer: string
}

/** The passage the demo drawer is anchored to. */
export const DEMO_PASSAGE = {
  work: "The Iliad",
  locator: "Book I",
  lines: [
    "Sing, O goddess, the anger of Achilles",
    "son of Peleus, that brought countless ills",
    "upon the Achaeans.",
  ],
  /** The indigo-marked phrase Virgil annotates. */
  marked: "son of Peleus",
  annotationLabel: "Patronymic",
  annotation:
    "\u201cSon of Peleus\u201d is a patronymic \u2014 an epithet identifying Achilles by his father. Homer uses patronymics to root heroes in their lineage and to remind the audience of inherited glory or doom.",
} as const

/** The suggestion pills shown when the drawer opens, with their scripted answers. */
export const DEMO_EXCHANGES: ScriptedExchange[] = [
  {
    prompt: "Why open with Achilles' anger?",
    answer:
      "The anger is the engine of the whole epic. Homer announces his subject in the very first word \u2014 m\u0113nis, wrath \u2014 and frames the Iliad around a single wound to honor. Everything that follows flows from it.",
  },
  {
    prompt: "What is a patronymic?",
    answer:
      "A patronymic names a person by their father: \u201cson of Peleus\u201d for Achilles, \u201cson of Atreus\u201d for Agamemnon. Homer leans on them to place each hero within a lineage \u2014 and to let the meter breathe.",
  },
  {
    prompt: "Who are the Achaeans?",
    answer:
      "The Achaeans are Homer\u2019s name for the Greeks besieging Troy \u2014 he also calls them Argives and Danaans. There was no single word \u201cGreek\u201d yet; these were allied kingdoms under Agamemnon\u2019s command.",
  },
]

const FALLBACK_ANSWER =
  "A fine question. In the demo I answer from a fixed script, but in the reader I draw on the full text beside you \u2014 ask me anything about the passage and I\u2019ll point you to the lines that matter."

/** Resolve the scripted answer for an arbitrary user message. */
export function scriptedReply(message: string): string {
  const normalized = message.trim().toLowerCase()
  const hit = DEMO_EXCHANGES.find(
    (e) =>
      e.prompt.toLowerCase() === normalized ||
      normalized.includes(e.prompt.toLowerCase().replace(/[?']/g, "")),
  )
  return hit?.answer ?? FALLBACK_ANSWER
}

/**
 * Stream a scripted answer token-by-token, mirroring the real askVirgil
 * streaming signature so the drawer UI can be reused verbatim.
 * Returns a cleanup fn to cancel an in-flight stream (on unmount / re-ask).
 */
export function streamScriptedReply(
  message: string,
  onToken: (chunk: string) => void,
  onDone: () => void,
  opts: { reduced?: boolean } = {},
): () => void {
  const answer = scriptedReply(message)

  if (opts.reduced) {
    // Reduced motion: deliver the whole answer at once after a short beat.
    const t = setTimeout(() => {
      onToken(answer)
      onDone()
    }, 250)
    return () => clearTimeout(t)
  }

  const words = answer.split(" ")
  let i = 0
  const timers: ReturnType<typeof setTimeout>[] = []
  let cancelled = false

  const pushNext = () => {
    if (cancelled) return
    if (i >= words.length) {
      onDone()
      return
    }
    onToken((i === 0 ? "" : " ") + words[i])
    i += 1
    const t = setTimeout(pushNext, 28 + Math.random() * 34)
    timers.push(t)
  }

  // Small "thinking" beat before the first token.
  const start = setTimeout(pushNext, 420)
  timers.push(start)

  return () => {
    cancelled = true
    timers.forEach(clearTimeout)
  }
}
