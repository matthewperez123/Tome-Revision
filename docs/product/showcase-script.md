# The Tome Showcase — Presenter Script

**Route:** `/showcase` · **Length:** 8–10 minutes, one continuous take · **Audience:** investors, school partners
**State:** fully seeded and deterministic — no login, no network, no writes to any database. The same run plays identically every time.

---

## Pre-flight (30 seconds, off-camera)

1. Open `/showcase`.
2. If the run must start clean: click **Reset showcase** (red, top right). This clears the entire `tome-showcase` localStorage namespace — shell state, slice progress, and the Stoa restoration — and returns to the seeded home.
3. Leave the mode toggle on **Guided tour** for a narrated walk, or switch to **Free explore** and follow this script manually.
4. Optional: share the exact configuration with the room — **Copy share link** encodes `?role=&device=&mode=` in the URL.

## The beats

### 0:00–0:45 · Showcase shell
**Show:** the gold **Showcase mode** badge; the role switcher (Reader / Student / Teacher / Parent); the device switcher (Desktop / Tablet / Mobile).
**Say:** "Everything you're about to see is a live product surface, not a video. No login, no demo server — and the same run replays identically every time, which is why we can show it to you cold."
**Do:** flip the device switcher Desktop → Tablet → Mobile. The same responsive UI reflows inside a labeled device frame — not an iframe, not a second app.

### 0:45–1:30 · Reader home & Virgil
**Show:** Virgil greets the returning reader; seeded stats (40 Wisdom, Level 1, 6-day Flame at risk); tonight's shelf.
**Say:** "Virgil is our reading companion — a state machine, not a chatbot overlay. He greets, he glances at the shelf, and he points to tonight's book: Macbeth."
**Do:** optionally click another cover — it answers honestly ("tonight we follow Macbeth"). Then click the **Macbeth cover**.

### 1:30–2:15 · The portal
**Show:** the cover morphs through a shared-element transition into a storm-lit battlement; rain drifts; the registry's portal copy.
**Say:** "Every Tome book is a world you step into. The cover is the door — same element, carried across the seam."
**Do:** **Step through the rain →**

### 2:15–3:30 · The passage
**Show:** Act I, Scene VII — 734 words of the real public-domain text, paragraph-anchored. Virgil reads along.
**Say:** "This is the genuine text — Shakespeare, public domain, curated from our chapter data. Watch what a reader can do with it."
**Do:** drag-select the *"I have no spur… / Vaulting ambition"* lines. A real selection chip appears: **Highlight this line ✦**. (Keyboard-only path: **Highlight Virgil's key line** does the same.) Then **Ask Virgil about this line →**.

### 3:30–4:45 · Virgil answers
**Show:** the split view — reference passage left, Virgil's answer right; thinking → retrieving → answering phases; typed-token streaming; paragraph citation chips.
**Say:** "The answer is grounded in the passage, and every claim carries a citation. Click one." — click a **¶ chip**; the passage scrolls and flashes the exact paragraph. "In production this is our retrieval pipeline; here it's deterministic, so you see the real interaction, not a lucky generation."
**Do:** when the answer settles: **Begin the Trial →**

### 4:45–6:15 · The four-part Trial
**Show:** the Trial engine, seeded — four proofs from the scene just read:
1. **Word in context** — *surcease* (answer: "Cessation — an ending or death")
2. **Find the evidence** — select the final two segments (the spur + vaulting ambition)
3. **Who said it** — *"screw your courage to the sticking-place"* → **Lady Macbeth**
4. **Reflection** — 40+ words; never marked wrong; rubric self-check

**Say:** "Assessment here is a conversation, not a trap. Press **H** — every question has a three-level hint ladder, and hints cost a little Wisdom. Wrong answers cost nothing."
**Do:** answer all four (for the flawless bonus, answer correctly without hints — the crescendo shows exactly what each choice was worth).

### 6:15–7:15 · The reward crescendo
**Show:** the sequenced ceremony, each beat skippable:
- **+120 Wisdom** count-up with the full economy breakdown (daily return 5 · passage 2 · scene 20 · Trial 50 · flawless 25 · no hints 10 · reflection 8)
- **Level-up** — Level 1 → 2 on the economy's own curve
- **Flame** — "Today secured," the hearth holds at 7 days
- **Seal reveal** — *The Dagger in the Dark*
- **Stoa restoration** — dust-to-gold ceremony; Virgil attends

**Say:** "Rewards in Tome are earned, sequenced, and quiet — ceremony is short and never blocks. Every number traces back to a published game economy, not a marketing mockup."

### 7:15–8:00 · The Stoa
**Show:** the restored painting *The Storm over the Heath* in its niche; open the provenance dialog — passage, citation, provenance label, license note, seal.
**Say:** "The reward is the record. Original Tome art, its source passage, its provenance — permanent, inspectable, and it persists." (Optional: open `/stoa` in a new tab — the restoration is there too.)

### 8:00–9:00 · Teacher view
**Do:** role switcher → **Teacher**.
**Show:** assignment status for *Macbeth — Act I*; completion/mastery aggregates; the roster sorted so the two students who need help surface first, each with a concrete note; one reviewed reflection with the teacher's reply.
**Do:** **Export roster CSV** — a real download, generated locally from the same fixture. **Assign next chapter →** stages Act II (labeled as seeded, no real classroom writes).
**Say:** "The teacher sees the classroom at a glance — and exactly who needs what before Friday."

### 9:00–9:45 · Parent view
**Do:** role switcher → **Parent**.
**Show:** weekly minutes chart; Macbeth status and progress; Flame; the Seal still locked with its earning path; the privacy panel.
**Say:** "Parents see the shape of the habit — minutes, streaks, seals — never journal text or conversations. Privacy is the design, not a setting."

### 9:45–10:00 · Close & reset
**Say:** "And the whole thing resets for the next audience in one click."
**Do:** **Reset showcase** — watch it return to the seeded home.

---

## Fallback notes

- **Something looks mid-run** (e.g. the page was reloaded deep in the slice): the slice rail at the top is honest about gating — locked beats explain what to finish first. Click **Reset showcase** for a guaranteed clean start.
- **Reduced motion:** enable it at the OS level and every ceremony collapses to its final state — same information, no choreography. Worth showing deliberately to an accessibility-minded audience.
- **Sound:** Tome's sound pack is muted by default by policy; nothing in the run depends on it.
- **Projector contrast:** the showcase inherits the Living Archive tokens; if the room washes out, the tablet frame narrows the field and reads better at distance.
- **Trial played imperfectly:** the crescendo is honest — the flawless/no-hints lines show "—" and the total reflects the actual run. The canonical path earns exactly +120.
- **Cross-link:** the shell carries a **Book a school demo** link to `/demo`; the return link from `/demo` is owned by the demo-page team.
