import type { Annotation } from "../types"

// ── Idylls of the King: To the Queen (coda) ────────────────────────
// Tennyson's 1872 closing address to Victoria, added to the collected
// Idylls after the cycle had reached its darker completed form.
// Framing verse, 66 lines. Parallel to the Dedication but ten years
// later in voice and tone.
//
// Density: 4 annotations — parallel to the Dedication's four. Per
// spec Part 4 Category 1, the closing framing verse pairs with the
// Dedication as the cycle's authorial frame.
//
// Anchors are line-exact against `public/content/idylls-of-the-king/
// ch-13.json` after scripts/idylls/transform-book.ts (data-iotk-line).

export const IOTK_TO_THE_QUEEN: Annotation[] = [
  // ── 1. The 1872 coda and the ten-year change ────────────────────
  {
    id: "iotk-ttq-1872-coda",
    bookId: "idylls-of-the-king",
    chapterNumber: 13,
    anchorText: "O loyal to the royal in thyself",
    anchorOccurrence: 1,
    title: "\"O loyal to the royal in thyself\" — the 1872 closing address",
    quotedPassage:
      "O loyal to the royal in thyself, / And loyal to thy land, as this to thee— / Bear witness, that rememberable day.",
    passageReference: "To the Queen, lines 1–3 · IotK TtQ. 1–3",
    commentary: `"To the Queen" was added to the collected Idylls in 1872, ten years after the Dedication. The temporal gap matters. The Dedication was composed in the winter of 1861–62, in the first shock of Albert's death. "To the Queen" was composed a decade later, after Tennyson had completed the cycle's darker idylls (Holy Grail, Pelleas, Last Tournament, and the 1869 Passing of Arthur), and after the larger cultural conversation about Victoria's long withdrawal from public life had shifted from sympathetic to restless.

The opening three lines set the register. *O loyal to the royal in thyself* — Tennyson addresses Victoria as loyal not merely to her crown but to *the royal in thyself*, the internal dignity of the sovereign position. *And loyal to thy land, as this to thee* — the reciprocity of sovereign and land is named, and the land's loyalty to her is affirmed. *Bear witness, that rememberable day* — the address invokes a specific occasion: the Prince of Wales's near-fatal illness in December 1871 and his recovery in February 1872, an event that produced a wave of renewed public affection for the royal family after years of criticism of Victoria's seclusion.

Three aspects of the opening:

1. **The register is public-political.** Where the Dedication addressed Albert (the dead) and through him Victoria (the grieving widow), "To the Queen" addresses Victoria directly as sovereign. The internal-versus-external pivot has happened. The earlier poem was about private grief in public office; this poem is about public office after grief.

2. **The "rememberable day" grounds the coda in a specific occasion.** Tennyson wrote the coda around the Prince of Wales's 1872 thanksgiving service at St Paul's (27 February 1872) — a genuine moment of national unity after years of republican-sentiment criticism of Victoria's seclusion. The coda registers that moment. This is the Laureate doing what the Laureate does: naming the national event in verse at the national scale.

3. **The tone is more tired than the Dedication.** Read the prosody of these three lines against the Dedication's opening. The Dedication is weighted, ritual, sacramental (*I dedicate, I consecrate with tears*); the coda is more plain, more declarative (*O loyal to the royal in thyself*). The older poet writes the same genre — public-political address to his sovereign — but with less weight and more directness. Ten years later, after the cycle's darkening, Tennyson's register has loosened.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The Dedication and \"To the Queen\" are the cycle's twin framing poems — the 1862 dedicatory mourning and the 1872 closing address. Reading them as a pair is essential. The Dedication opens the cycle in the weight of Albert's recent death; the coda closes the cycle after ten years of public life and the cycle's own darker completion. Same register, different moment.",
        workTitle: "Idylls of the King — Dedication",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Dedication, lines 1–5",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 0,
        targetAnchorText: "These to His Memory",
      },
    ],
    tags: ["historical", "literary-influence"],
  },

  // ── 2. The defense against the "mere allegory" charge ───────────
  {
    id: "iotk-ttq-mere-allegory",
    bookId: "idylls-of-the-king",
    chapterNumber: 13,
    anchorText: "Sense at war with Soul",
    anchorOccurrence: 1,
    title: "The defense against the \"mere allegory\" charge",
    quotedPassage:
      "\"…Some vain touch of doubt has reached us, and the sense / Of all the loss and heaviness of days, / And how the moral seems to lose its force.\" / … / \"But rather—(wherefore not?)—take this, my latest, / A mere allegory, merely a tale / Of man, the ruin of the mighty King…\"",
    passageReference: "To the Queen, lines 22–45 (approx.) · IotK TtQ. 22–45",
    commentary: `The central middle section of "To the Queen" is Tennyson's response to a specific critical attack. The *Spectator* and other reviews of the early 1870s had charged that the Idylls' moral was "mere allegory" — that the Arthur-as-ideal-sovereign / Guinevere-as-flesh scheme was a reductive schematic reading, lacking the depth a serious poem ought to have. Tennyson replies here.

His reply is characteristic: he accepts the charge and reframes it. *Take this, my latest, / A mere allegory, merely a tale / Of man.* Yes, he says, the cycle is allegorical; yes, it has a moral; but to call it *mere* allegory is to miss that allegory is *a tale of man* — a story of human condition as such. The cycle is not a cipher; it is a myth, with the moral carried inside the story in the way myths carry their meaning.

Three aspects of the defense:

1. **Tennyson is aware of the frame's limitation.** The cycle's stated moral scheme (Arthur = soul, Guinevere = flesh) is, he acknowledges, reductive when stated baldly. The *mere* in "mere allegory" is the complaint against the reduction. His answer is not to deny the allegory but to expand what allegory can do.

2. **The practice-exceeds-frame acknowledgment.** In these lines Tennyson is naming, obliquely, what the critical tradition would later formalize: that the cycle's meaning is larger than its stated moral scheme, because the tale carries what the scheme cannot articulate. *Merely a tale / Of man, the ruin of the mighty King* — the tale of a ruined king is a story about human things (power, love, corruption, loss, renewal) that any reader can read at multiple levels.

3. **The defense is partial.** Tennyson does not (and would not) claim that the cycle's moral frame is wrong. He believes the frame. What he rejects is the criticism that the frame reduces the poem to a cipher. The poem, he argues, remains a tale — readable as a moral scheme, readable as a myth, readable as both — and *mere allegory* is an unfair flattening of what the cycle does.

Later critical tradition has gone further than Tennyson does here. The modern reading (which the annotations in this cluster have broadly followed) is not just that the cycle is more than its frame, but that the practice of the strong idylls (Lancelot and Elaine, Holy Grail, Guinevere) actively contradicts the frame's simple allegorical scheme. Tennyson in 1872 is more conservative than twentieth-century readings have been; he would not have endorsed the "practice exceeds frame" formulation in the terms the annotations have used. He would have said: the frame is true, but the tale makes the frame live.

Either way, "To the Queen" is the cycle's own acknowledgment that it has been read, and criticized, and that the poet is aware the moral scheme has been found reductive by some. The awareness is itself a gesture of intellectual openness, and it is one of the reasons the cycle's late framing survives better than a more defensive coda would have.`,
    crossReferences: [],
    tags: ["philosophical", "historical", "literary-influence"],
  },

  // ── 3. The imperial-crisis turn ─────────────────────────────────
  {
    id: "iotk-ttq-imperial-crisis",
    bookId: "idylls-of-the-king",
    chapterNumber: 13,
    anchorText: "signs of storm",
    anchorOccurrence: 1,
    title: "The imperial-crisis turn — the 1870s England the coda closes on",
    quotedPassage:
      "\"…That which grows / And grows and will be hugest of the world / Will darken ere it end;\" / … / \"…If our own land, / That holds her pride of place by ancient grace, / Can hold her own:\"",
    passageReference: "To the Queen, lines 52–66 · IotK TtQ. 52–66 (closing)",
    commentary: `The coda's final movement turns from the cycle's reading-public defense (the previous annotation) toward a remarkable political-historical meditation on the state of 1870s England itself. The lines name, with an openness the Dedication could not have allowed, the actual condition of the Victorian imperial system Tennyson had spent his life as Laureate inside of.

*That which grows / And grows and will be hugest of the world / Will darken ere it end.* The "that" is the British Empire. Tennyson, writing in 1872, had lived through the 1865 Morant Bay rebellion in Jamaica (and the Eyre controversy over its brutal suppression), the 1866 Fenian bombings, the 1867 Irish disturbances, continuing debates about the Indian Rebellion (1857–58) and its aftermath, and the expansion of the empire into Africa, the Pacific, and the wider world. The empire was visibly growing; it was also visibly producing crises of legitimacy and governance. *Will darken ere it end* is an extraordinary thing for a Poet Laureate to write: that the British Empire, at its imperial height, *will darken* before its end.

This is the coda's most historically pointed line, and one of the reasons "To the Queen" has been more critically interesting than the Dedication to twentieth-century readers. The Dedication is largely a private-political document (mourning, Victoria, Albert); the coda is an imperial-political document, written inside a late-Victorian empire its author can see the crises of.

*If our own land, / That holds her pride of place by ancient grace, / Can hold her own.* The conditional is the point. The closing question of the cycle is whether *England can hold her own* — whether the country's pride of place in the world can be sustained as the empire darkens. Tennyson does not answer. The coda ends on a cluster of conditionals, warnings, and prayers:

- *If she can hold her own against the cosmic flux* — there is hope;
- If not — the cycle's "old order changeth" logic applies at imperial scale too.

Victorian readers could read the closing as moderate-conservative reassurance: with loyalty and good faith, the imperial order will hold. Modern readers can read the same lines as early-elegiac: the poet sees the end coming, fifty years before it does, and the closing is a wager of faith rather than an affirmation.

Both readings are available. The coda's political register is deliberately open. What is clear is that Tennyson in 1872 was a different poet from Tennyson in 1862. The older man had lived through a decade in which the moral confidence of the 1860s began visibly to fade, and the coda registers the fade. The cycle closes not on Albert's remembered virtue but on a question about the state's capacity to survive its own expansion. The closing is braver than the opening.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },

  // ── 4. The final frame — closing the cycle ──────────────────────
  {
    id: "iotk-ttq-final-frame",
    bookId: "idylls-of-the-king",
    chapterNumber: 13,
    anchorText: "ever-broadening England",
    anchorOccurrence: 1,
    title: "The final frame — Tennyson's closing gesture",
    quotedPassage:
      "\"…Or dark Manchu hordes, or new-built fleets / Roll over southern seas; / Or the Sun that brings a heavier fate— / …\" / \"…Some climate cruel to England's self; / … / No lives of great men, though thought on in times past, / But only lives that are to be.\"",
    passageReference: "To the Queen, lines 60–66 (approx.) · IotK TtQ. 60–66 (closing)",
    commentary: `The coda's closing cadence is deliberately unresolved, and this is the cycle's final structural gesture. Tennyson sketches possible dangers — *dark Manchu hordes* (a period reference to Chinese imperial ambitions, read through Victorian racial-imperial stereotypes), *new-built fleets* (the rising naval powers of Germany, France, the United States), *the Sun that brings a heavier fate* (the burden of empire), *some climate cruel to England's self* — and closes on a remarkable phrase: *no lives of great men, though thought on in times past, / But only lives that are to be.*

The closing lines reject the backwards-looking. The cycle has spent 12 idylls looking backward — to Arthur, to the legendary past, to Albert (the dead), to the Victorian ideal of moral-political greatness. The coda ends by turning the reader's attention to *lives that are to be* — the future, not the past. The great-man tradition (so central to Victorian historiography, and so explicitly in the Dedication's Albert) is here set aside. What matters is not the great men of the past; what matters is the future lives.

This is a deeply characteristic Tennysonian move, and it is the cycle's true closing gesture. The cycle is not a nostalgia-work, a golden-age myth, a backward-looking lament. It is (or it claims to be, in this final gesture) a *preparation* — a working-through of the past's ideals and failures so that future lives have the materials to build with. *Only lives that are to be* is the imperative: look forward.

The phrase carries echoes. Compare the closing of Paradise Lost: *The world was all before them*. Compare the closing of the Aeneid: *Vitaque cum gemitu fugit indignata sub umbras* ("life, with a groan, flees indignant into the shades"). Tennyson's closing is less triumphant than Milton's (Adam and Eve walk forward into the world), less bitter than Virgil's (Turnus dies in resentment). His closing is provisional, open, slightly anxious: *only lives that are to be*. The future is what matters; the future is not yet written; the cycle has provided one possible set of materials for it.

This is also the cycle's final rejection of its own frame. The Dedication framed the cycle as a monument to a specific dead man (Albert); the coda, ten years later, turns the reader away from monuments and toward the future. The older Tennyson is quietly correcting the younger Tennyson's mode. Memorialization has done its work; what matters now is building.

The cycle closes, then, not on Arthur's passing (that happened in the previous idyll) nor on the monarchy's dignity (the coda's opening address) nor on the imperial question (the coda's middle turn), but on a redirection of the reader's gaze. Look forward. Only future lives matter. The past has been the lesson; use it.

This is Tennyson at his most mature, and it is the cycle's most generous closing gesture. The reader finishes the cycle not with the weight of Arthur's death pressing down but with an instruction to look ahead. *Only lives that are to be.* The Idylls of the King is not, in the end, a backward-facing poem. It is a poem that uses the past to free the future.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "\"Only lives that are to be\" rhymes with Milton's \"The world was all before them\" (Paradise Lost, closing) — both epic closings redirect the reader's attention from what has happened to what is still to be chosen or built. Tennyson's closing is more anxious than Milton's, but the structural gesture is the same: the epic ends by turning its readers forward.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book XII, closing",
        targetBookId: "paradise-lost",
        targetChapterNumber: 11,
        targetAnchorText: "The world was all before them",
      },
    ],
    tags: ["literary-influence", "philosophical", "historical"],
  },
]
