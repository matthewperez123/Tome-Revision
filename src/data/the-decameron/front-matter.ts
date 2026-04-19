/**
 * Decameron front matter — authored editorial pieces that frame the
 * reading experience for this work.
 *
 * Five pieces:
 *
 *   1. editorialIntroduction — 800–1000 word editor's introduction,
 *      authored for the Tome catalog (not Standard Ebooks copy).
 *   2. brigataWhoWho         — curated one-liners + voice-notes on each of
 *      the ten storytellers; surfaced as the "Who's Who" page.
 *   3. tenDaysAtAGlance      — table of governor/theme/mood per day.
 *   4. onExplicitContent     — short honest editorial note on the
 *      Decameron's bawdy material.
 *   5. aNoteOnTheText        — brief explanation of why the Payne
 *      translation was chosen.
 *
 * This module exports plain data; rendering is the concern of the
 * reader or book-detail page. The Editor's Introduction and these
 * auxiliary pieces do NOT replace Payne's own translator-preface (which
 * lives in ch-0-adjacent Standard Ebooks front matter and is preserved
 * as-is).
 */

import { BRIGATA, BRIGATA_ORDER } from "./brigata"
import { DAYS } from "./days"

export const editorialIntroduction = {
  title: "Editor's Introduction",
  body: `*The Decameron* is the founding work of European prose fiction. Its one hundred tales, told by ten young Florentines who have fled the plague of 1348 for a countryside villa, are the collective ancestor of the short story, the novella, and the framed tale-collection as forms. Chaucer reads Boccaccio and writes the *Canterbury Tales*. Shakespeare reads Boccaccio — through William Painter's *Palace of Pleasure* — and writes *All's Well That Ends Well*, *Cymbeline*, and a plot-spine of *Much Ado*. Keats reads Boccaccio and writes "Isabella." Lessing reads Boccaccio and writes *Nathan der Weise*. Molière, Cervantes, Henry James — the debt is everywhere.

Boccaccio composed the book in Italian between about 1349 and 1353, in the direct aftermath of the Black Death that killed perhaps half of Florence. He was an eyewitness. His father died in that wave. So did his stepmother. The book opens with what is still the most admired single description of epidemic disease in European prose — and then immediately pivots to a band of seven ladies and three gentlemen escaping the city to tell stories. That pivot is the work's entire argument. *The Decameron* is a book about what survivors do with catastrophe; the answer it proposes is: narrative.

**How to read it.** You do not need to read straight through. Each of the hundred tales is genuinely self-contained — a reader who picks up the book at Day V, Tale IX will meet Federigo and his falcon without needing anything from earlier. But the frame is the point. Pay attention to who is telling what, when, and in response to whom. Seven women speak more tales than three men. Each day has a king or queen who sets its theme. Dioneo — the libertine and formal virtuoso — from Day II onward claims the exclusive privilege of telling the last tale of each day, and of exemption from the day's theme. Fiammetta — Boccaccio's own beloved under the name he gave her elsewhere — tells the work's two most emotionally loaded tales (Ghismonda's defense of love, Federigo's falcon) on consecutive days. The Narrator Tracker in this reader will show you whose voice you are in at any moment. Use it. The frame's meaning is legible only when the narrators are.

**The plague and the villa.** The founding reading of *The Decameron* has always been that the frame is a response to civilizational catastrophe. That reading has been reactivated, sharply, in the years after 2020. Boccaccio's brigata chooses the third of the three possible responses to plague he names in the Introduction: not asceticism, not hedonism, but measured withdrawal in good company with good books. They flee together, cook together, sing together, tell stories. The stories are not escapism — Boccaccio is explicit about this, twice, in the Introduction to Day IV and in the Author's Conclusion. The stories are how the brigata continues to be alive. The frame makes a case that art is a survival skill.

**Why it endures.** The obvious answer is literary influence — every Western framed tale-collection descends from this one. The deeper answer is that the *Decameron* was the first great European work to insist that ordinary people, including women and merchants and servants, were worthy of sustained literary attention. Dante's *Commedia*, a generation earlier, is populated by kings, popes, saints, and epic-traditional figures. Boccaccio's book is populated by gardeners, cooks, innkeepers, notaries, shopkeepers, wives, pirates, friars both good and very bad, bakers, painters, a peasant marchioness, a Jewish moneylender, a Muslim sultan. Three Jewish characters appear in sympathetic roles. Two Muslim rulers — Saladin and a sultan of Babylon — appear as exemplars of nobility. The moral weather of the book is warmer than its age; readers have been catching up to it ever since.

*The Decameron* is a Tier-1 work in this catalog for three reasons: its founding-text status for European prose fiction; its position alongside Dante's *Commedia* and Petrarch's *Canzoniere* as one of the three great Italian Trecento works; and the quality and range of its tales, which at their best — I.1, I.3, II.5, IV.1, IV.5, V.9, VI.9, X.10 — are still as good as short fiction gets. We use John Payne's 1886 translation: Victorian, ornate, Latinate, occasionally too archaic — and, of the freely licensable English versions, the only one whose register stays close to the formal weight of Boccaccio's Tuscan. A vocabulary-gloss overlay is on by default.

Welcome to the garden.`,
}

export const aNoteOnTheText = {
  title: "A Note on the Text",
  body: `This edition uses the John Payne translation (London, 1886), via Standard Ebooks (2020). Payne was a poet and an obsessive medievalist — he also Englished all of the *Arabian Nights* — and his Decameron is the most verbally rich of the freely available English versions. He preserves the Latinate architecture of Boccaccio's Italian and reaches for a deliberately archaic register: *methinketh*, *whilom*, *natheless*, *meseemeth*.

The archaisms are load-bearing. Payne is trying to convey something about the formal weight of Boccaccio's prose — which was itself reaching for classical gravity, for the *volgare illustre* that Dante had theorized in his *De vulgari eloquentia*. A modern plain-English translation (Mark Musa and Peter Bondanella's 1982 Penguin, G. H. McWilliam's 1972, Wayne Rebhorn's 2013) loses that weight by design, and gains transparency in exchange. They are all good. They are all under copyright.

Readers meeting Payne's register for the first time may find the first few pages slow going. A vocabulary-gloss overlay is enabled by default; any dotted-underlined word can be tapped for a one-sentence definition. Most of the friction in the opening pages is lexical, and most of the lexical friction resolves after the first few tales.

Payne spells two of the narrators' names with Victorian conventions that modern scholarship has revised: Payne's *Pamfilo* is the *Panfilo* of Branca and McWilliam; Payne's *Elisa* is the *Elissa* of the modern editions. The reader uses Payne's spellings throughout — which is to say, the spellings the reader will actually encounter in the prose.

Standard Ebooks has corrected typographical errors in the 1886 edition, normalized punctuation to modern standards, and added extensive endnotes keyed to a separate glossary page. Payne's own footnotes — which preserve medieval Italian names, identify historical figures, and discuss occasional translation choices — are retained.`,
}

export const onExplicitContent = {
  title: "On the Explicit Content",
  body: `*The Decameron* contains tales whose sexual material is frankly bawdy, and whose anticlerical satire targets specific contemporary religious practices with some force. Neither is incidental. Boccaccio defends both at length inside the work itself — twice, at the Introduction to Day IV and again in the Author's Conclusion — and we commend those self-defenses as primary reading. They remain among the most articulate defenses of secular imaginative literature ever written.

Tome presents the work as Payne translated it. Nothing is excised or abridged. Day III Tale X (Alibech and Rustico), Day V Tale X (Pietro di Vinciolo), Day VII Tale II (Peronella in the wine-cask), Day VII Tale IX (the pear-tree), Day IX Tale II (the abbess's breeches) — all are present in full. Victorian translators sometimes left III.10 in Italian or Latin; Payne translated it into English, and we follow Payne.

The anticlerical satire — friars who prey on the pious, nuns in compromising positions, a false saint canonized in Day I Tale I, an abbot purging his "guilty" monk's wife in III.8 — is load-bearing for the book's worldview. It is not anti-religion. Boccaccio ended his own life close to monastic friends in Certaldo. What the book resists is the gap between religious profession and lived behavior, and it resists in proportion to the severity with which the professing party chastises others.

Readers should encounter the book as an adult work about adult lives. The editorial posture here is to contextualize, not to warn.`,
}

export interface DayGlance {
  day: number
  roman: string
  governor: string
  governorColor: string
  governorTitle: string
  theme: string
  mood: string
}

const ROMAN: Record<number, string> = { 1:"I",2:"II",3:"III",4:"IV",5:"V",6:"VI",7:"VII",8:"VIII",9:"IX",10:"X" }

export const tenDaysAtAGlance: DayGlance[] = DAYS.map((d) => ({
  day: d.day,
  roman: ROMAN[d.day],
  governor: BRIGATA[d.governor].name,
  governorColor: BRIGATA[d.governor].color,
  governorTitle: d.governorTitle,
  theme: d.theme,
  mood: d.moodEpigraph,
}))

export const brigataWhoWho = BRIGATA_ORDER.map((id) => {
  const m = BRIGATA[id]
  return {
    id: m.id,
    name: m.name,
    color: m.color,
    etymology: m.etymology,
    oneLiner: m.oneLiner,
    voiceNote: m.voiceNote,
    rulesDay: m.rulesDay,
  }
})

/** Everything-in-one bundle for the book detail page's front-matter tab. */
export const decameronFrontMatter = {
  editorialIntroduction,
  aNoteOnTheText,
  onExplicitContent,
  tenDaysAtAGlance,
  brigataWhoWho,
}
