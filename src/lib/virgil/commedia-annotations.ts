/**
 * Commedia annotations — hand-written scholarly notes for Dante's
 * Divine Comedy, Longfellow translation.
 *
 * Scope: seed set covering demo-critical cantos of Inferno only
 * (I, V, XXVI, XXXIII, XXXIV). Produced by hand before any API batch
 * runs so we can verify the reader UX and the annotation voice before
 * burning Opus tokens on the remaining 95 cantos.
 *
 * Indexing convention matches the rest of the Commedia pipeline:
 *   - `bookId` is the unified catalog slug ("the-divine-comedy")
 *   - `chapterNumber` is the FLAT canto index (0–99), not a
 *     canticle-local number. Inferno I = 0, Inferno V = 4, XXVI = 25,
 *     XXXIII = 32, XXXIV = 33.
 *
 * Voice: Virgil's — scholarly, first-person, unafraid of a question,
 * never devotional. No invented citations; where an annotation wants
 * to gesture at Auerbach/Singleton/Hollander it does so without
 * pretending to quote them.
 */

import type { Annotation } from "./types"

export const COMMEDIA_ANNOTATIONS: Annotation[] = [

  // ═══════════════════════════════════════════════
  // INFERNO — CANTO I (flat index 0)
  // ═══════════════════════════════════════════════

  {
    id: "commedia-inferno-1-dark-wood",
    bookId: "the-divine-comedy",
    chapterNumber: 0,
    anchorText: "Midway upon the journey of our life",
    anchorOccurrence: 1,
    title: "The First Line",
    quotedPassage: "Midway upon the journey of our life / I found myself within a forest dark, / For the straightforward pathway had been lost.",
    passageReference: "Inferno I, 1–3",
    commentary: `Listen to the Italian: *Nel mezzo del cammin di nostra vita* — "in the middle of the journey of our life." Note *nostra*, "our." Not "my." Dante is thirty-five, and the Book of Psalms gives the span of a life as seventy. He is at the precise center. But by saying "our," he makes the midlife crisis structural: anyone old enough to open this poem is already in the wood.

Longfellow's "Midway upon the journey of our life" preserves the *nostra*. Many translators drop it for "my," and the poem shrinks. Keep the plural: you are being addressed.

The "forest dark" — *selva oscura* — is moral, not geographic. Dante will not tell us which sin put him there. That vagueness is part of the design. The wood is whatever your own failure looks like from the inside.`,
    crossReferences: [
      {
        type: "source",
        description: "The descent into a dark place as the gateway to self-knowledge is older than Dante. The Aeneid Book VI, where Aeneas enters the underworld under the sibyl's guidance, is the explicit model for Virgil's role here.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI",
        targetBookId: "the-aeneid",
        targetChapterNumber: 6,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "philosophical"],
  },

  {
    id: "commedia-inferno-1-virgil-appears",
    bookId: "the-divine-comedy",
    chapterNumber: 0,
    anchorText: "Who seemed from long-continued silence hoarse",
    anchorOccurrence: 1,
    title: "My Appearance",
    quotedPassage: "While I was rushing downward to the lowland, / Before mine eyes did one present himself, / Who seemed from long-continued silence hoarse.",
    passageReference: "Inferno I, 61–63",
    commentary: `I arrive "hoarse from long silence" — *chi per lungo silenzio parea fioco*. It is a peculiar line to introduce a guide. Homer's Muse sings; mine is out of practice. The silence is the thousand-plus years between the Aeneid and 1300: centuries in which no one, in Dante's view, had tried to write a poem of my scale in the vernacular.

Dante is also saying something more delicate. I am a pagan. I am in Limbo. I cannot speak of salvation because I do not have it. The hoarseness is theological. What I can teach him — human reason, the classical inheritance — is real but insufficient. I will take him as far as the Earthly Paradise and then Beatrice will take over. Read this opening knowing that I will leave.`,
    crossReferences: [
      {
        type: "echo",
        description: "The Aeneid opens 'Arma virumque cano' — 'Arms and the man I sing.' Dante's hoarse Virgil is the Aeneid's singer, a thousand years later, rusted out.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book I, opening",
        targetBookId: "the-aeneid",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  // ═══════════════════════════════════════════════
  // INFERNO — CANTO V (flat index 4)
  // ═══════════════════════════════════════════════

  {
    id: "commedia-inferno-5-contrapasso",
    bookId: "the-divine-comedy",
    chapterNumber: 4,
    anchorText: "The infernal hurricane",
    anchorOccurrence: 1,
    title: "The Contrapasso of the Lustful",
    quotedPassage: "The infernal hurricane that never rests / Hurtles the spirits onward in its rapine; / Whirling them round, and smiting, it molests them.",
    passageReference: "Inferno V, 31–33",
    commentary: `Here is your first clear look at the principle that governs the whole Inferno: the *contrapasso* — the punishment that fits the sin by embodying it. The lustful in life were swept along by passion without the ballast of reason. In death they are literally swept along, a storm that never settles, bodies carried wherever the wind blows.

Dante does not invent this logic; he gets it from Aquinas and, behind Aquinas, from Aristotle's notion that the punishment reveals the sin's inner shape. But the Commedia's achievement is to render the logic as *image*. You feel the wind before you hear the theology.

Notice what the contrapasso is *not*: it is not revenge, and it is not arbitrary cruelty. Every punishment in Hell is the sinner's own desire, eternalized. The damned are not tortured from outside; they are frozen in the act of being themselves.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },

  {
    id: "commedia-inferno-5-francesca",
    bookId: "the-divine-comedy",
    chapterNumber: 4,
    anchorText: "Love, that on gentle heart doth swiftly seize",
    anchorOccurrence: 1,
    title: "Francesca's Three Loves",
    quotedPassage: "Love, that on gentle heart doth swiftly seize, / Seized this man for the person beautiful / That was ta’en from me, and still the mode offends me. / Love, that exempts no one beloved from loving, / Seized me with pleasure of this man so strongly, / That, as thou seest, it doth not yet desert me; / Love has conducted us unto one death.",
    passageReference: "Inferno V, 100–106",
    commentary: `Francesca speaks in a sonnet's worth of anaphora — "Love… Love… Love…" — *Amor, ch'al cor gentil ratto s'apprende*. She is quoting, almost verbatim, the lyric poetry of Guido Guinizelli and the *dolce stil novo* that Dante himself helped invent. This is the crucial move of the canto: Dante is making the sinner speak with *his own poetic style*.

Hear what she is saying. "Love seized him. Love seized me. Love led us to death." Three clauses, each with "Love" as the grammatical subject, each with Francesca as the object. She has written herself out of the sentence. In the philosophy of her own story, she did not act. Love acted through her.

This is why she is here. Not because she loved, but because she built a system of thought in which she could not have chosen otherwise — and Dante the poet, who had written in that same register, now has to put her in Hell for believing what his own early poems implied. When the canto ends and Dante the pilgrim faints from pity, he is also fainting from recognition. The penitent reader should feel implicated in this one.`,
    crossReferences: [
      {
        type: "allusion",
        description: "Francesca says she and Paolo were reading of Lancelot and Guinevere when they were first kissed — 'the book and he who wrote it were a Galeotto.' The romance tradition Malory will later compile (Book XVIII of Le Morte d'Arthur) is, in Francesca's speech, the pander of her damnation.",
        workTitle: "Le Morte d'Arthur",
        workAuthor: "Thomas Malory",
        passageReference: "Book XVIII, Ch. 1",
        targetBookId: "le-morte-darthur",
        targetChapterNumber: 433,
        targetAnchorText: "Sir Launcelot began to resort unto Queen Guenever again",
      },
    ],
    tags: ["literary-influence", "linguistic", "philosophical"],
  },

  // ═══════════════════════════════════════════════
  // INFERNO — CANTO XXVI (flat index 25)
  // ═══════════════════════════════════════════════

  {
    id: "commedia-inferno-26-ulysses",
    bookId: "the-divine-comedy",
    chapterNumber: 25,
    anchorText: "Within there are tormented",
    anchorOccurrence: 1,
    title: "Dante's Ulysses",
    quotedPassage: "Within there are tormented Ulysses / And Diomed, and thus together they / Unto revenge do run as unto wrath.",
    passageReference: "Inferno XXVI, 55–57",
    commentary: `Dante had not read Homer. Neither had I — or rather, I had read him, Dante had not. The Greek was lost to the Latin West for the whole medieval period. What Dante knew of Odysseus he knew from my Aeneid, from Ovid, and from medieval romance. So when he meets the hero here, he is meeting a rumor.

And he does something extraordinary with the rumor. He invents an ending that Homer did not write. In Dante's version, Odysseus never reaches Ithaca. After the Cyclops, after Circe, he gathers his old crew for one last voyage — past the Pillars of Hercules, into the empty Atlantic, until a whirlwind sinks him within sight of a mountain (which the reader eventually realizes is Purgatory). He is damned, in Dante's reading, not for the Trojan Horse or the Cyclops trick, but for refusing the limit that heaven had set.

If you have read the Odyssey, hold Homer's ending next to this one. Homer ends in an embrace. Dante ends his Odysseus in shipwreck. The two poets disagree about the deepest question the figure raises: is restless intelligence a virtue or a transgression?`,
    crossReferences: [
      {
        type: "source",
        description: "Homer's Odyssey ends with Odysseus reunited with Penelope at the rooted bed. Dante has not read that scene, and invents the opposite. Read Odyssey XXIII alongside this canto.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XXIII",
        targetBookId: "the-odyssey",
        targetChapterNumber: 23,
        targetAnchorText: "threw her arms about his neck",
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  {
    id: "commedia-inferno-26-folle-volo",
    bookId: "the-divine-comedy",
    chapterNumber: 25,
    anchorText: "Consider ye the seed from which ye sprang",
    anchorOccurrence: 1,
    title: "The Mad Flight",
    quotedPassage: "Consider ye the seed from which ye sprang; / Ye were not made to live like unto brutes, / But for pursuit of virtue and of knowledge.",
    passageReference: "Inferno XXVI, 118–120",
    commentary: `This is the most famous speech in the Inferno and it is a speech by a damned soul. Keep that in mind.

"You were not made to live like unto brutes, but for pursuit of virtue and of knowledge" — *fatti non foste a viver come bruti, ma per seguir virtute e canoscenza*. It is beautiful. It could be the motto of the Renaissance. And it is Ulysses, in Hell, persuading his elderly crew to sail to their deaths.

Dante calls what follows a *folle volo* — a "mad flight." The word is careful: *folle* is not simply foolish. It is a flight that exceeds the human measure. The sin is not curiosity as such. The sin is the refusal to accept that knowledge has a boundary set by something other than your own desire for it.

The Commedia will ultimately endorse the pursuit of knowledge — the whole poem is one — but within a different frame: guided, humble, proportioned to what the knower can bear. Ulysses' flight is a parody of Dante's own journey. Read this canto knowing that Dante is frightened of becoming him.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },

  // ═══════════════════════════════════════════════
  // INFERNO — CANTO XXXIII (flat index 32)
  // ═══════════════════════════════════════════════

  {
    id: "commedia-inferno-33-ugolino",
    bookId: "the-divine-comedy",
    chapterNumber: 32,
    anchorText: "Thou hast to know I was Count Ugolino",
    anchorOccurrence: 1,
    title: "Ugolino's Silence",
    quotedPassage: "Thou hast to know I was Count Ugolino, / And this one was Ruggieri the Archbishop; / Now I will tell thee why I am such a neighbour.",
    passageReference: "Inferno XXXIII, 13–15",
    commentary: `Ugolino tells the worst story in the Inferno, and tells it while gnawing on the skull of the man who killed him. Count Ugolino della Gherardesca was locked with his sons and grandsons in a tower in Pisa by Archbishop Ruggieri. The key was thrown into the Arno. They starved.

The canto's cruelty is in the detail Ugolino withholds. His sons, one by one, offer their bodies: "Father, if thou eatest of us, our pain will be less." Then silence. Then "I, already blind, began to grope / Over them, and for two days called them / After they were dead." Then the line: *Poscia, più che 'l dolor, poté 'l digiuno* — "Then hunger did what grief could not."

Does that mean he ate them? Dante does not say. Seven hundred years of readers have argued. I think the ambiguity is the point. The canto is about how even the extremity of grief cannot finally name what starvation does to a father. Ugolino is a traitor — he is here in the ice of Antenora, the circle of those who betrayed their country — but Dante lets him tell it in a voice that makes the political judgment tremble.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },

  // ═══════════════════════════════════════════════
  // INFERNO — CANTO XXXIV (flat index 33)
  // ═══════════════════════════════════════════════

  {
    id: "commedia-inferno-34-lucifer",
    bookId: "the-divine-comedy",
    chapterNumber: 33,
    anchorText: "Vexilla Regis prodeunt Inferni",
    anchorOccurrence: 1,
    title: "The Pivot of the Universe",
    quotedPassage: "“Vexilla Regis prodeunt Inferni / Towards us; therefore look in front of thee,” / My Master said, “if thou discernest him.”",
    passageReference: "Inferno XXXIV, 1–3",
    commentary: `The canto opens in Latin: *Vexilla regis prodeunt inferni*. Dante steals a Good Friday hymn ("*Vexilla regis prodeunt*" — the banners of the king advance) and adds *inferni*. It is parody with theological weight: Lucifer is the anti-Christ not morally but structurally, a mirror fixed at the bottom of everything.

Lucifer has three faces — chewing Judas, Brutus, and Cassius. The three worst traitors in Christian and imperial history, one per mouth. The choice of Brutus and Cassius for assassinating Caesar tells you how seriously Dante took the idea of the Empire as part of Providence; he will double down on this in Paradiso VI.

The canto's great trick is the descent past Lucifer. We climb *down* his body, hit the center of the earth, and suddenly we are climbing *up* — Dante's gravity has flipped, and the same motion that was descending into Hell is now ascending out of it. Evil, in the Commedia's physics, is not a direction but a point you pass through. On the other side, you are headed to the stars — *a riveder le stelle*, the canto's final line. Every canticle of the Commedia ends on that word. Remember it when you reach the last line of Paradiso.`,
    crossReferences: [
      {
        type: "echo",
        description: "The final line of each canticle ends with 'stars' (*stelle*): Inferno 'to rebehold the stars,' Purgatorio 'ready to ascend unto the stars,' Paradiso 'the Love which moves the sun and the other stars.' Dante has designed the poem's structure into its last words.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Closing lines of all three canticles",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 99,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "philosophical", "historical"],
  },

  // ═══════════════════════════════════════════════
  // INFERNO — CANTO V (flat 4) · DECAMERON CROSS-REFERENCE
  // ═══════════════════════════════════════════════

  {
    id: "commedia-inferno-5-galeotto-decameron",
    bookId: "the-divine-comedy",
    chapterNumber: 4,
    anchorText: "Galeotto",
    anchorOccurrence: 1,
    title: "Galeotto and the Decameron",
    quotedPassage: "Galeotto was the book and he who wrote it.",
    passageReference: "Inferno V, 137",
    commentary: `Francesca gives us the word that will echo across the next century of Italian letters. *Galeotto fu 'l libro e chi lo scrisse* — "Galehaut was the book, and he who wrote it." Galehaut is the go-between in the prose Lancelot cycle; he is the one who arranges the first kiss between Lancelot and Guinevere. Francesca uses his name as a common noun: *a galeotto*, the book-that-pimps, the book-that-enables-the-forbidden-kiss. Francesca is saying that her reading and Paolo's reading *did to them* what Galehaut did to Lancelot and Guinevere. She damns the book and the author who wrote it.

Dante's reader, hearing this in 1320, could hardly imagine that thirty-odd years later the greatest living Italian prose writer would hear Francesca's curse and reply *by naming his own book after it*. Boccaccio's *Decameron* — composed in the aftermath of the 1348 plague — carries the subtitle *Prencipe Galeotto*, "Prince Galehaut." It is on the first page and the last. Payne Englishes it "Prince Galahalt."

What Boccaccio is doing is audacious. He is claiming the role Dante's Francesca damns. Yes, he says, my book will be a go-between; yes, it will carry lovers to one another; yes, it will do what literature does to readers who are capable of being moved. The Proem of the *Decameron* — a dedication to women in love, offered explicitly as their consolation — is the programmatic statement; the subtitle is the signature.

The two works converse across decades. Dante presents Francesca as a warning: literature can damn you. Boccaccio replies: literature can save you too, especially if you are one of the ladies who cannot go hunting or sailing and whose sorrow has no outlet. Francesca is the ghost in every Decameron tale that a woman tells of a woman in love.

Read Inferno V with the Decameron open. The two books are in direct structural dialogue.`,
    crossReferences: [
      {
        type: "allusion",
        description: "Boccaccio's *Decameron* carries the subtitle *Prencipe Galeotto* — 'Prince Galehaut' — in explicit answer to Francesca's curse. The affirmative repurposing of the damned name is one of the most pointed literary gestures of the fourteenth century.",
        workTitle: "The Decameron",
        workAuthor: "Giovanni Boccaccio",
        passageReference: "Author's Conclusion — the subtitle 'Prince Galahalt'",
        targetBookId: "the-decameron",
        targetChapterNumber: 121,
        targetAnchorText: "Prince Galahalt",
      },
      {
        type: "source",
        description: "The Old French prose Lancelot cycle (the Vulgate Lancelot) is the source for Galehaut the go-between. Malory later uses the same Lancelot material without the Dantean moral weight.",
        workTitle: "Le Morte d'Arthur",
        workAuthor: "Thomas Malory",
        passageReference: "Books XVIII–XIX",
        targetBookId: "le-morte-darthur",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical", "historical"],
  },

  // ═══════════════════════════════════════════════
  // INFERNO — CANTO X (flat 9) · CAVALCANTI / DECAMERON VI.9
  // ═══════════════════════════════════════════════

  {
    id: "commedia-inferno-10-cavalcanti-decameron",
    bookId: "the-divine-comedy",
    chapterNumber: 9,
    anchorText: "Cavalcante",
    anchorOccurrence: 1,
    title: "The Cavalcanti — Father and Son",
    quotedPassage: "'If through this blind prison thou goest / By loftiness of genius, where is my son? / And why is he not with thee?'",
    passageReference: "Inferno X, 58–60",
    commentary: `Cavalcante de' Cavalcanti — father of Guido Cavalcanti, Dante's "first friend" — rises from the burning tomb of the Epicurean heretics and asks Dante where his son is. The scene is one of the most painful moments in the *Inferno*. Dante stumbles over a verb tense and Cavalcante, misreading the hesitation, assumes that Guido is already dead. He falls back into the tomb in grief.

Hold this moment against Boccaccio's *Decameron* VI.9, where Guido himself appears alive and philosophical among the tombs of the Baptistery in Florence. Boccaccio tells a brief tale — Elisa's, the witty one — of Guido leaping over a tomb and delivering a retort to some young men who have been mocking him: *in your houses you can say what you like; here among these stones, we are in our own house*. The scholars of Florence — the poets, the philosophers — live where the dead seem to live, because what they make lasts.

Boccaccio had read Dante. He wrote the first major life of Dante and gave public lectures on the *Inferno* at Santo Stefano di Badia in Florence. He knew this Cavalcante scene. And in VI.9 he is, gently, rewriting it. Where Dante gives us a father damned and a son whose fate the father cannot learn, Boccaccio gives us the son alive, witty, vaulting a tomb, at home among the stones. The small tale is Boccaccio's correction of Dante's framing: the Florentine literary community survives in its own way, and the tombs are not a prison but a house.

Read the two scenes together. The Florence that produced Dante, Cavalcanti, Boccaccio, and Petrarch is in both, but the angle of view is different. Dante looks up from the damned tomb; Boccaccio looks down from the poet leaping over it.`,
    crossReferences: [
      {
        type: "allusion",
        description: "Boccaccio's Decameron VI.9 gives Guido Cavalcanti — the son about whose fate Dante stumbles here — a brief set-piece tale in which he is alive and vaults a tomb while delivering a witty riposte. Boccaccio is gently correcting Dante's framing of the Florentine literary community.",
        workTitle: "The Decameron",
        workAuthor: "Giovanni Boccaccio",
        passageReference: "Day VI, Tale 9",
        targetBookId: "the-decameron",
        targetChapterNumber: 71,
        targetAnchorText: "Guido",
      },
    ],
    tags: ["historical", "literary-influence"],
  },
]

/** Convenience lookup by flat canto index. */
export function getCommediaAnnotationsForCanto(flatIndex: number): Annotation[] {
  return COMMEDIA_ANNOTATIONS.filter(a => a.chapterNumber === flatIndex)
}
