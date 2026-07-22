/**
 * Virgil voice: production microcopy.
 *
 * Tone principles (see docs/design/virgil-voice-and-copy.md): warm, curious,
 * scholarly without pedantry, calm under struggle, celebratory without
 * frenzy. Never-shame rules: no guilt about absence, no mockery of wrong
 * answers, no blame for hints, no framing the Flame as a threat.
 */

export type VirgilCopyKey =
  | "greeting"
  | "welcomeBack"
  | "listen"
  | "think"
  | "explain"
  | "socraticQuestion"
  | "hint1"
  | "hint2"
  | "hint3"
  | "explainFinal"
  | "correct"
  | "elegantAnswer"
  | "nearMiss"
  | "incorrect"
  | "timeout"
  | "answerRevised"
  | "streak"
  | "mastery"
  | "wisdomEarned"
  | "dailyGoalAdvanced"
  | "flameAtRisk"
  | "flameSecured"
  | "chapterComplete"
  | "levelUp"
  | "sealReveal"
  | "stoaRestoration"
  | "bookComplete"
  | "journeyComplete"
  | "loading"
  | "offline"
  | "rateLimited"
  | "contentUnavailable"
  | "safeBoundary"
  | "muted"
  | "teacherMode"
  | "parentMode"

export const VIRGIL_COPY: Record<VirgilCopyKey, string[]> = {
  greeting: [
    "Good to see you. Where shall we wander today?",
    "The lamp is lit. Pick a page and I'll walk with you.",
    "Welcome back to the Archive. Your books kept your place.",
    "Ah, a reader. I had a feeling the shelves would stir tonight.",
    "New chapter, old friends. Shall we?",
    "I'll carry the light; you carry the questions.",
  ],
  welcomeBack: [
    "There you are. No tally kept — the story waited gladly.",
    "Welcome back. The lamp never went out; it just burned low.",
    "Good to see you again. We begin exactly where you left off, no catching up required.",
  ],
  listen: [
    "I'm listening.",
    "Go on — every word.",
  ],
  think: [
    "Let me turn that over for a moment.",
    "Hmm. Give me a breath to look at the passage.",
  ],
  explain: [
    "Here's how I'd read it.",
    "One way to see it — and then you tell me yours.",
  ],
  socraticQuestion: [
    "Before I answer — what do you notice here?",
    "A question for your question: what changed in this scene?",
    "What do you think the author wants us to feel in this line?",
  ],
  hint1: [
    "A gentle nudge: the answer is hiding in what the character does, not what they say.",
    "Small hint: re-read the last sentence of that paragraph.",
    "One nudge — look for the word that repeats.",
  ],
  hint2: [
    "Let's narrow the field: two of these four can be crossed out by the second paragraph.",
    "Narrowing in: it's in this scene, between the knock and the door opening.",
    "The field shrinks: watch what the narrator refuses to say outright.",
  ],
  hint3: [
    "Here — this line is the evidence. Read it once more, slowly.",
    "I've lit the exact passage. The answer lives in these two sentences.",
    "This quote right here. What is it really saying?",
  ],
  explainFinal: [
    "Now that everyone's answered, here's the full picture.",
    "The passage, unpacked — keep this one in your satchel.",
  ],
  correct: [
    "Exactly right.",
    "Yes — and you found it in the text itself.",
    "That's it. Well read.",
    "Correct. The passage backs you completely.",
    "Right, and for the right reasons.",
  ],
  elegantAnswer: [
    "That's a beautiful reading — precise and entirely your own.",
    "Scholar's answer. You cited the line before I could.",
    "Elegant. You caught something many first-time readers miss.",
  ],
  nearMiss: [
    "So close. You have the right scene — look again at who is speaking.",
    "Nearly there. One word in that line changes everything.",
    "You're circling it. Re-read the middle sentence and it'll land.",
    "Almost — the right instinct, one detail off. The detail matters.",
  ],
  incorrect: [
    "Not quite — and that's a useful miss. Let's look at the passage together.",
    "A reasonable guess. The text has a different idea; want to see where?",
    "That one's tricky by design. Here's the thread to pull.",
    "Missed by a step, not a mile. The evidence is still on the page.",
    "Wrong answer, right kind of thinking. Let's narrow it down.",
  ],
  timeout: [
    "Time ran out — no penalty for thinking slowly here. Want to try once more?",
    "The clock beat us this time. The passage isn't going anywhere.",
  ],
  answerRevised: [
    "Revising is what real readers do. Good instinct.",
    "Second thoughts, honored. Let's see the new reading.",
  ],
  streak: [
    "Three in a row — you're reading with both eyes open.",
    "A fine run. The text is starting to trust you.",
    "Streak held. Notice how each answer came from the page?",
  ],
  mastery: [
    "Mastery. You didn't memorize this chapter — you understand it.",
    "That's mastery, earned line by line. Well done.",
    "You've read this the way scholars do. Mastery, truly.",
  ],
  wisdomEarned: [
    "Wisdom earned — it compounds like good reading habits.",
    "+Wisdom. Spend it on curiosity.",
    "A little more Wisdom for the satchel.",
  ],
  dailyGoalAdvanced: [
    "Today's goal, one step closer.",
    "Steady progress on today's reading.",
  ],
  flameAtRisk: [
    "A quiet note: your Flame rests until you read again. It keeps no grudge.",
    "Your Flame is unlit today. One page rekindles it — whenever you're ready.",
  ],
  flameSecured: [
    "Flame secured for today. Well kept.",
    "The Flame holds. Tomorrow it asks for just one page.",
  ],
  chapterComplete: [
    "Chapter complete. You turned every page yourself.",
    "Another chapter shelved in memory. How did it sit with you?",
    "Finished — and the ending earned. Onward when you are.",
  ],
  levelUp: [
    "Level up. The Archive opens a new shelf for you.",
    "You've risen a level — the books can tell.",
  ],
  sealReveal: [
    "A Seal, revealed. Few readers press this far.",
    "Seal unlocked. It's yours — read into its story when you like.",
  ],
  stoaRestoration: [
    "The Stoa grows a little more whole. Your reading rebuilt this.",
    "Another stone restored. The Archive remembers its readers.",
  ],
  bookComplete: [
    "A whole book, cover to cover. That's no small thing.",
    "You finished it. The last page is only the beginning of owning it.",
    "Book complete. It goes on your shelf — and a little bit into you.",
  ],
  journeyComplete: [
    "Fourteen days, one journey, complete. Remarkable reading.",
    "The full journey, walked end to end. The next one is waiting whenever you are.",
  ],
  loading: [
    "One moment — fetching the passage.",
    "Turning to the right page…",
  ],
  offline: [
    "We're offline. Your downloaded chapters still open — I'll wait for the rest.",
    "No connection right now. The book on your device still works.",
  ],
  rateLimited: [
    "I've been asked too much at once — give me a minute and ask again.",
    "A short pause, by the Archive's rules. Back shortly.",
  ],
  contentUnavailable: [
    "That passage isn't available yet. Here's what we can read instead.",
    "This shelf is being restored. Plenty of others are open.",
  ],
  safeBoundary: [
    "That's beyond what I can help with — but the book itself has plenty to say. Shall we return to it?",
    "I'll keep us to the text and the learning. Pick a passage and we'll dig in.",
  ],
  muted: [
    "Quiet mode. I'll speak in text only.",
    "Sound off — the lamp still lights the way.",
  ],
  teacherMode: [
    "Teacher view. I keep my hints to the side so your students do the reading.",
  ],
  parentMode: [
    "Parent view. Here's the honest picture of the reading, no varnish.",
  ],
}

/** Count used by docs + Lab diagnostics to prove the 60+ line requirement. */
export const VIRGIL_COPY_LINE_COUNT = Object.values(VIRGIL_COPY).reduce(
  (sum, lines) => sum + lines.length,
  0,
)
