import type { Annotation } from "../types"

// ── Idylls of the King: Dedication — Opus cluster ──────────────────────
// Tennyson's Dedication, added to the collected Idylls in 1862 after
// the death of Prince Albert (Dec 1861). Framing verse (55 lines) that
// establishes the cycle's explicit moral-political reading: Arthur as
// figure of ideal sovereignty, Albert as his modern analogue, the
// Round Table as the civilization both figures preside over.
//
// Density per spec Part 4: the Dedication and "To the Queen" together
// carry two substantial framing annotation-clusters. Here: four
// annotations covering (1) the 1862 political act; (2) the Arthur–
// Albert analogy as the cycle's stated moral reading; (3) the
// "blameless life" trope and Victorian moral-public rhetoric; (4) the
// direct address to Victoria and the Dedication's theological coda.
//
// Anchors are line-exact against `public/content/idylls-of-the-king/
// ch-0.json` after the scripts/idylls/transform-book.ts pass
// (data-iotk-line="N").

export const IOTK_DEDICATION: Annotation[] = [
  // ── 1. The public-political act of 1862 ──────────────────────────
  {
    id: "iotk-ded-public-mourning",
    bookId: "idylls-of-the-king",
    chapterNumber: 0,
    anchorText: "These to His Memory",
    anchorOccurrence: 1,
    title: "\"These to His Memory\" — the 1862 public mourning-poem",
    quotedPassage:
      "These to His Memory—since he held them dear, / Perchance as finding there unconsciously / Some image of himself—I dedicate, / I dedicate, I consecrate with tears— / These Idylls.",
    passageReference: "Dedication, lines 1–5 · IotK Ded. 1–5",
    commentary: `The Dedication was composed in the winter of 1861–62, in the weeks and months following Prince Albert's death on 14 December 1861, and published with the first collected edition of the Idylls in 1862. Tennyson had been Poet Laureate since 1850, Victoria's laureate — and the Dedication is, in the first place, a laureate's public act of mourning written to and for a sovereign in her grief.

The syntactic arc of the opening reveals the argument. "These to His Memory" is a dedicatory formula: the poems are consecrated to the dead. "Since he held them dear" narrows the claim to something personal — Albert, a known reader, loved these poems as Tennyson published their early installments across the 1850s. "Perchance as finding there unconsciously / Some image of himself" places the analogy carefully: not that Albert *was* Arthur, but that in reading about Arthur he may (*perchance*, *unconsciously*) have recognized something. The hedge protects the claim and asserts it at once.

The doubled "I dedicate, I dedicate" — the second repetition rare in Tennyson and all the more weighted — is the ritual signature of the inscription. "I consecrate with tears" raises the register to the sacramental. The enjambment across "I dedicate, / I dedicate, I consecrate with tears— / These Idylls" suspends the object of all three verbs until the final foot of a line, so the poem-itself arrives at the reader only after the dedication's full weight has been borne.

This is Tennyson operating at the uppermost end of the public-poet register. The Dedication is a political document — an act of state consolation — as much as it is a literary one. Victorian readers recognized the register; modern readers, to whom the idiom of public mourning-verse is largely unfamiliar, often find the Dedication's high formality off-putting. Read it as what it is: an official public act on behalf of a widowed sovereign, performed in verse because the Laureate's office made verse the available instrument.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Tennyson's \"In Memoriam A.H.H.\" (1850, not in catalog) — his long elegy for Arthur Hallam — is the private model that the Dedication converts into public form. Where In Memoriam addresses a private friend in a private grief (\"'Tis better to have loved and lost\"), the Dedication addresses a sovereign and a state in a public one. The same poet; two registers of the same loss-work.",
        workTitle: "In Memoriam A.H.H.",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Prologue",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "literary-influence"],
  },

  // ── 2. Arthur–Albert analogy: the cycle's stated moral reading ──
  {
    id: "iotk-ded-arthur-albert",
    bookId: "idylls-of-the-king",
    chapterNumber: 0,
    anchorText: "ideal knight",
    anchorOccurrence: 1,
    title: "\"My king's ideal knight\" — the Arthur–Albert analogy",
    quotedPassage:
      "And indeed He seems to me / Scarce other than my king's ideal knight, / \"Who reverenced his conscience as his king; / Whose glory was, redressing human wrong; / Who spake no slander, no, nor listened to it; / Who loved one only and who clave to her—\"",
    passageReference: "Dedication, lines 6–11 · IotK Ded. 6–11",
    commentary: `Tennyson here makes explicit what the rest of the Dedication keeps in a more careful hedge: Albert is "scarce other than" Arthur's ideal knight. The word *scarce* — 'hardly anything other than' — is in the lexical space of *virtually*, and it is the most direct moral equation the Dedication will permit itself.

The four lines in quotation marks are a self-citation. Tennyson is quoting himself, from "Guinevere" (Idyll XI, line 468 and following), where Arthur delivers his long forgiveness-speech to the kneeling queen and describes the king's ideal of knighthood — the Round Table oath that held "The King would have his Table Round" and that Guinevere's adultery has unmade. By quoting those lines here, in the Dedication, Tennyson binds the cycle's deepest moral passage to the dead consort: the ideal knight Arthur describes *is* Albert, and the realm that failed to live up to the ideal is not only Camelot but — by implication — any state that loses its moral compass. The embedded quotation is the Dedication's engine of identification.

The four ideals listed are, point for point, Victorian public-man virtues: conscience-as-king (the internalized moral law), redressing-human-wrong (active benevolence), no-slander (the discretion a public figure requires), and conjugal fidelity. All four were (and are) attributable to Albert on the documentary record — his disciplined character, his work on public welfare reforms and the Great Exhibition, his reputation for probity in cabinet, and his famously devoted marriage to Victoria. The equation is not ornamental. Tennyson believed it.

The analogy is also the cycle's stated moral reading. The whole Idylls becomes, in the Dedication's light, a figure for Victorian civilization: Arthur the ideal sovereign, Guinevere the flesh that fails the spirit, the Round Table the moral polity, the adultery the corruption that unmakes the state. Critics have long observed that Tennyson's practice in the idylls themselves often exceeds this frame — that his Guinevere, particularly in her own idyll, is more humane than the scheme requires, and that the Grail-quest material resists easy moralization. The Dedication states the frame honestly; the cycle does not always obey it. Hold both in mind as you read.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Tennyson is quoting himself — the four lines within quotation marks are from Arthur's speech in \"Guinevere\" (Idyll XI), the cycle's emotional climax. Reading the Dedication and \"Guinevere\" together is reading the cycle's frame as a circuit: the ideal is named at the entrance, the failure of the ideal is what the cycle closes on, and the ideal is invoked again over the fallen queen.",
        workTitle: "Idylls of the King — Guinevere (Idyll XI)",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Guinevere, lines 465–475 (approx.)",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 11,
        targetAnchorText: "reverenced his conscience",
      },
    ],
    tags: ["literary-influence", "philosophical", "historical"],
  },

  // ── 3. "The white flower of a blameless life" ──────────────────
  {
    id: "iotk-ded-blameless-life",
    bookId: "idylls-of-the-king",
    chapterNumber: 0,
    anchorText: "Wearing the white flower of a blameless life",
    anchorOccurrence: 1,
    title: "\"Wearing the white flower of a blameless life\"",
    quotedPassage:
      "For pleasure; but through all this tract of years / Wearing the white flower of a blameless life, / Before a thousand peering littlenesses, / In that fierce light which beats upon a throne, / And blackens every blot: for where is he, / Who dares foreshadow for an only son / A lovelier life, a more unstained, than his?",
    passageReference: "Dedication, lines 24–30 · IotK Ded. 24–30",
    commentary: `This is the Dedication's most famous image and the one that secured Tennyson's reading of Albert in the Victorian imagination. The phrase *white flower of a blameless life* passed immediately into common usage; it was repeated in sermons, eulogies, and obituaries through the rest of the century; it is the phrase by which Albert was remembered in the way the dedicated verse intended him to be remembered.

The figure is botanical — a white flower, worn as an emblem — and the whiteness does a great deal of moral work. *Blameless* is a legal term: not-to-be-blamed, free of chargeable fault. The blameless life is the life against which no indictment can be laid, and the white flower is the visible sign of that forensic innocence. Behind the image is the medieval-heraldic tradition of the white rose (of Yorkshire, of Albion, of the Virgin Mary, in various contexts) as a token of purity.

What gives the figure its power is the next two lines: "Before a thousand peering littlenesses, / In that fierce light which beats upon a throne." Tennyson is naming the specific difficulty of sovereign virtue — that it must be blameless *in public*, under the scrutiny of "a thousand peering littlenesses," under a "fierce light." Royalty, in the Victorian conception, lives under surveillance; every small failing is visible; the blameless life of a monarch or consort is therefore harder, not easier, than a private person's. Albert, who did live under that scrutiny (the press accused him, in his lifetime, of everything from German sympathy to political interference), is being vindicated against the charges the Dedication itself does not name.

The rhetorical question "for where is he, / Who dares foreshadow for an only son / A lovelier life, a more unstained, than his?" is addressed at once to the reader and, unmistakably, to Victoria. The "only son" is the Prince of Wales (the future Edward VII), whose conduct in his youth had already become public embarrassment (the Nellie Clifden affair of 1861 had, according to Victoria's own later account, "killed" Albert). The lines are thus a discreet but unmistakable political comfort: no one dares project a finer life for Bertie than Albert's was. This is Tennyson performing the work of a laureate at the most delicate edge of his office — comforting the widow, affirming the dead consort, and obliquely addressing the problem of the living heir, all in one image.

Modern readers often find *blameless* a reductive term for the emotional complexity of any actual person, and the phrase became a cliché partly because Victorians did, too. Hold the reservation, and notice also the rhetorical precision. The Dedication is not a naïve text. It works.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Compare Spenser's Redcrosse Knight in the Faerie Queene, who bears the red cross on his armor as \"the dear remembrance of his dying Lord\" (I.i.2) — the Christian-chivalric ideal of visible moral emblematics from which Tennyson's white flower descends. The Idylls inherit Spenser's Arthurian-moral project; this image is one of the bridge points.",
        workTitle: "The Faerie Queene",
        workAuthor: "Edmund Spenser",
        passageReference: "Book I, Canto i, stanza 2",
        targetBookId: "the-faerie-queene",
        targetChapterNumber: 2,
        targetAnchorText: "dear remembrance of his dying Lord",
      },
    ],
    tags: ["literary-influence", "historical", "linguistic"],
  },

  // ── 4. The direct address to Victoria and theological coda ─────
  {
    id: "iotk-ded-to-victoria",
    bookId: "idylls-of-the-king",
    chapterNumber: 0,
    anchorText: "Break not, O woman's-heart",
    anchorOccurrence: 1,
    title: "\"Break not, O woman's-heart\" — the address to the widow Queen",
    quotedPassage:
      "Break not, O woman's-heart, but still endure; / Break not, for thou art Royal, but endure, / Remembering all the beauty of that star / Which shone so close beside Thee that ye made / One light together, but has past and leaves / The Crown a lonely splendour.",
    passageReference: "Dedication, lines 47–52 · IotK Ded. 47–52",
    commentary: `The Dedication's final movement turns from Albert to Victoria, and from the past (what he was) to the present imperative (what she must do). The apostrophe *O woman's-heart* is an extraordinary figure. Tennyson addresses not Victoria-as-sovereign but *Victoria-the-widow*, and the abstraction *woman's-heart* places her in the universal position of a grieving woman before it acknowledges her royal one. The two lines that follow correct the order: "Break not, for thou art Royal, but endure." The sequence — woman first, Royal second — is the sequence of the grief itself, with the public office as the added duty that the grief must not be allowed to break.

The image of Albert and Victoria as two stars making "One light together" is a commonplace of nineteenth-century marital imagination, but Tennyson turns the figure with the next phrase: "but has past and leaves / The Crown a lonely splendour." The word *splendour* is doing load-bearing work. It is a glorifying word — the Crown remains splendid — but paired with *lonely* it names the exact Victorian cultural fact of the 1860s: Victoria's withdrawal from public life in the years after Albert's death, her retreat to Balmoral and Osborne, her wearing of mourning for the remaining forty years of her reign. The Dedication gives that withdrawal a noble framing it would not otherwise receive — the Crown is not abandoned; it has become lonely-splendid because one of its two lights is gone.

The closing lines of the Dedication — "Till God's love set Thee at his side again!" — complete the movement into the explicitly theological. The final image is of reunion in an afterlife Tennyson is not quite ready to name as heaven. The theological register is deliberately ambiguous: this is the Tennyson of "In Memoriam," whose religious language is hopeful without being doctrinally specific, whose consolation for the bereaved turns on a *trust* rather than a *creed*. The line works whether the reader is orthodoxly Christian or (as many of Tennyson's contemporary readers already were) in the condition of "honest doubt."

The Dedication thus traces a full arc: from the dedicatory act (lines 1–5), to the Arthur–Albert analogy (6–13), to the catalogue of Albert's virtues (14–46), to the direct address to Victoria (47–52), to the theological consolation (53–55). It is a five-movement public poem performed with the instruments of the laureate's office, and it is the frame under which the whole cycle first reached the Victorian reading public.

A last note. The "Break not" imperative is one of the most Tennysonian rhythmic signatures — the heavy stress on the opening syllable, the repetition, the slow caesura. Read aloud, the line slows almost to a standstill. The prosody enacts the *endurance* it urges. Tennyson is teaching Victoria how to breathe.`,
    crossReferences: [],
    tags: ["literary-influence", "philosophical", "historical"],
  },
]
