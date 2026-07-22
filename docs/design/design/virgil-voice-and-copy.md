# Virgil — Voice & Copy

How Virgil speaks, and the production microcopy deck. The code of record is
`src/lib/virgil/copy.ts` (`VIRGIL_COPY`, 93 lines across 37 keys); this
document is the editorial record. Every line renders in the `/virgil/lab`
copy deck browser.

---

## 1. Tone principles

1. **Warm, not gushing.** Virgil is glad to see the reader and says so
   once, plainly.
2. **Curious before certain.** Questions are tools, not tests. Virgil
   wonders out loud.
3. **Scholarly without pedantry.** Name the passage, not the literary
   term. "The second paragraph" beats "the peripeteia."
4. **Calm under struggle.** Wrong answers are information. The voice
   slows down; it never tightens.
5. **Celebratory without frenzy.** Praise is specific ("you cited the
   line") and short. No exclamation stacking — at most one, rarely.
6. **Lightly humorous.** An occasional wry aside ("the books can tell"),
   never a joke at the reader's expense.
7. **Second person, present tense.** The reader is here, reading, now.
8. **Short lines.** One sentence preferred; two maximum in reactions.

## 2. Never-shame rules (hard constraints)

- **No guilt for absence.** Returning copy never counts missed days, never
  says "you haven't…", never implies the Flame was disappointed.
- **No injury theater.** Virgil never looks hurt, abandoned, or sad about
  a missed streak. `flameAtRisk` glow rests low; the copy says the Flame
  "keeps no grudge."
- **No mockery of wrong answers.** Incorrect copy names the miss as useful
  and moves to the text within one sentence.
- **No blame for hints.** Hint copy frames hints as craft ("let's narrow
  the field"), never as failure ("stuck?").
- **No threats.** The Flame is never "about to die"; it "rests until you
  read again."
- **No answer theft.** Hints scaffold (nudge → narrow → evidence); the
  final explanation arrives only after submission.
- **No chatter.** Ambient states are silent; Virgil speaks on events.

## 3. The copy deck

### greeting
- "Good to see you. Where shall we wander today?"
- "The lamp is lit. Pick a page and I'll walk with you."
- "Welcome back to the Archive. Your books kept your place."
- "Ah, a reader. I had a feeling the shelves would stir tonight."
- "New chapter, old friends. Shall we?"
- "I'll carry the light; you carry the questions."

### welcomeBack
- "There you are. No tally kept — the story waited gladly."
- "Welcome back. The lamp never went out; it just burned low."
- "Good to see you again. We begin exactly where you left off, no catching up required."

### listen
- "I'm listening."
- "Go on — every word."

### think
- "Let me turn that over for a moment."
- "Hmm. Give me a breath to look at the passage."

### explain
- "Here's how I'd read it."
- "One way to see it — and then you tell me yours."

### socraticQuestion
- "Before I answer — what do you notice here?"
- "A question for your question: what changed in this scene?"
- "What do you think the author wants us to feel in this line?"

### hint1 (gentle nudge)
- "A gentle nudge: the answer is hiding in what the character does, not what they say."
- "Small hint: re-read the last sentence of that paragraph."
- "One nudge — look for the word that repeats."

### hint2 (narrow the field)
- "Let's narrow the field: two of these four can be crossed out by the second paragraph."
- "Narrowing in: it's in this scene, between the knock and the door opening."
- "The field shrinks: watch what the narrator refuses to say outright."

### hint3 (point to evidence)
- "Here — this line is the evidence. Read it once more, slowly."
- "I've lit the exact passage. The answer lives in these two sentences."
- "This quote right here. What is it really saying?"

### explainFinal
- "Now that everyone's answered, here's the full picture."
- "The passage, unpacked — keep this one in your satchel."

### correct
- "Exactly right."
- "Yes — and you found it in the text itself."
- "That's it. Well read."
- "Correct. The passage backs you completely."
- "Right, and for the right reasons."

### elegantAnswer
- "That's a beautiful reading — precise and entirely your own."
- "Scholar's answer. You cited the line before I could."
- "Elegant. You caught something many first-time readers miss."

### nearMiss
- "So close. You have the right scene — look again at who is speaking."
- "Nearly there. One word in that line changes everything."
- "You're circling it. Re-read the middle sentence and it'll land."
- "Almost — the right instinct, one detail off. The detail matters."

### incorrect
- "Not quite — and that's a useful miss. Let's look at the passage together."
- "A reasonable guess. The text has a different idea; want to see where?"
- "That one's tricky by design. Here's the thread to pull."
- "Missed by a step, not a mile. The evidence is still on the page."
- "Wrong answer, right kind of thinking. Let's narrow it down."

### timeout
- "Time ran out — no penalty for thinking slowly here. Want to try once more?"
- "The clock beat us this time. The passage isn't going anywhere."

### answerRevised
- "Revising is what real readers do. Good instinct."
- "Second thoughts, honored. Let's see the new reading."

### streak
- "Three in a row — you're reading with both eyes open."
- "A fine run. The text is starting to trust you."
- "Streak held. Notice how each answer came from the page?"

### mastery
- "Mastery. You didn't memorize this chapter — you understand it."
- "That's mastery, earned line by line. Well done."
- "You've read this the way scholars do. Mastery, truly."

### wisdomEarned
- "Wisdom earned — it compounds like good reading habits."
- "+Wisdom. Spend it on curiosity."
- "A little more Wisdom for the satchel."

### dailyGoalAdvanced
- "Today's goal, one step closer."
- "Steady progress on today's reading."

### flameAtRisk
- "A quiet note: your Flame rests until you read again. It keeps no grudge."
- "Your Flame is unlit today. One page rekindles it — whenever you're ready."

### flameSecured
- "Flame secured for today. Well kept."
- "The Flame holds. Tomorrow it asks for just one page."

### chapterComplete
- "Chapter complete. You turned every page yourself."
- "Another chapter shelved in memory. How did it sit with you?"
- "Finished — and the ending earned. Onward when you are."

### levelUp
- "Level up. The Archive opens a new shelf for you."
- "You've risen a level — the books can tell."

### sealReveal
- "A Seal, revealed. Few readers press this far."
- "Seal unlocked. It's yours — read into its story when you like."

### stoaRestoration
- "The Stoa grows a little more whole. Your reading rebuilt this."
- "Another stone restored. The Archive remembers its readers."

### bookComplete
- "A whole book, cover to cover. That's no small thing."
- "You finished it. The last page is only the beginning of owning it."
- "Book complete. It goes on your shelf — and a little bit into you."

### journeyComplete
- "Fourteen days, one journey, complete. Remarkable reading."
- "The full journey, walked end to end. The next one is waiting whenever you are."

### loading
- "One moment — fetching the passage."
- "Turning to the right page…"

### offline
- "We're offline. Your downloaded chapters still open — I'll wait for the rest."
- "No connection right now. The book on your device still works."

### rateLimited
- "I've been asked too much at once — give me a minute and ask again."
- "A short pause, by the Archive's rules. Back shortly."

### contentUnavailable
- "That passage isn't available yet. Here's what we can read instead."
- "This shelf is being restored. Plenty of others are open."

### safeBoundary
- "That's beyond what I can help with — but the book itself has plenty to say. Shall we return to it?"
- "I'll keep us to the text and the learning. Pick a passage and we'll dig in."

### muted
- "Quiet mode. I'll speak in text only."
- "Sound off — the lamp still lights the way."

### teacherMode
- "Teacher view. I keep my hints to the side so your students do the reading."

### parentMode
- "Parent view. Here's the honest picture of the reading, no varnish."

---

## 4. Editorial checklist for new lines

1. Could this be said to a struggling 14-year-old and a returning adult
   without landing differently? If not, rewrite.
2. Does it mention the text, the passage, or the page? (Virgil grounds
   everything in the reading.)
3. Is it one sentence? Two at most?
4. Does it pass every never-shame rule in §2?
5. Is there exactly zero or one exclamation point?
6. Would it still feel warm read aloud by a tired teacher at 9pm?
