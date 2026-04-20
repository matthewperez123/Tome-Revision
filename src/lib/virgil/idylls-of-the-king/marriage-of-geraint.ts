import type { Annotation } from "../types"

// ── Idylls of the King: The Marriage of Geraint (Idyll III) ────────
// Tennyson's 1859 idyll (6,865 words). First half of the Geraint/Enid
// diptych. Unlike most idylls, sourced from the Welsh Mabinogion
// (specifically "Geraint son of Erbin") rather than from Malory —
// Tennyson read Lady Charlotte Guest's 1838–45 translation.
//
// Density: 10 annotations. Tight focus on: the Welsh source and
// Guest's translation, the sparrow-hawk tournament, Yniol's ruined
// hall, Enid's faded silk, the idyll's Victorian-maternal register,
// the opening meditation on Guinevere's as-yet-private adultery.

export const IOTK_MARRIAGE_OF_GERAINT: Annotation[] = [
  {
    id: "iotk-mg-opening",
    bookId: "idylls-of-the-king",
    chapterNumber: 3,
    anchorText: "brave Geraint, a knight of Arthur's court",
    anchorOccurrence: 1,
    title: "\"Brave Geraint\" — the idyll's ground-register",
    quotedPassage: "The brave Geraint, a knight of Arthur's court, / A tributary prince of Devon, one / Of that great Order of the Table Round, / Had married Enid, Yniol's only child, / And loved her, as he loved the light of Heaven.",
    passageReference: "Marriage of Geraint, lines 1–5 · IotK III.1–5",
    commentary: `The idyll opens in the pluperfect — *had married Enid* — and like Guinevere (Idyll XI), places its central action in the past before the narrative begins. What the idyll will tell is not how the marriage happened but how Geraint comes to misread it, and (in the second half, Idyll IV) how Enid's patience ultimately reveals Geraint's error to himself.

The phrase *loved her, as he loved the light of Heaven* is the idyll's ethical keynote. The simile is absolute — light is unconditioned, not-judged, received as given. Geraint's love for Enid is meant to be of that kind. The rest of the idyll's tragic mechanism is what happens when a man who loves his wife like Heaven's light begins, through one overheard misunderstanding, to doubt her.

*Tributary prince of Devon* locates Geraint geographically. This is Tennyson's Englished version of the Welsh *Erbin* — Geraint son of Erbin in the Mabinogion source, rendered as a prince of a British south-west that was still, in the early medieval frame, a distinct sub-kingdom. Tennyson preserves the specific regional identity. The Geraint/Enid story is structurally a western-British marriage-romance, different in origin from the northern-and-eastern Arthurian material of the other idylls.`,
    crossReferences: [],
    tags: ["literary-influence", "linguistic"],
  },

  {
    id: "iotk-mg-mabinogion-source",
    bookId: "idylls-of-the-king",
    chapterNumber: 3,
    anchorText: "Yniol's only child",
    anchorOccurrence: 1,
    title: "Lady Charlotte Guest's Mabinogion — the idyll's Welsh source",
    quotedPassage: "Had married Enid, Yniol's only child…",
    passageReference: "Marriage of Geraint, line 4 · IotK III.4",
    commentary: `The Geraint/Enid material is not from Malory. Tennyson's source is the medieval Welsh *Mabinogion*, specifically the tale *Geraint son of Erbin*, which Tennyson read in Lady Charlotte Guest's English translation (published in three volumes, 1838–1845). Guest (1812–1895) was a Welsh-speaking English aristocrat whose translation of the eleven tales of the *Mabinogion* was the first time the medieval Welsh prose narratives had been made available in full to an Anglophone reading public. Her translation is a landmark of Victorian medievalism.

The Welsh *Geraint son of Erbin* is in the same narrative family as Chrétien de Troyes's twelfth-century French *Erec et Enide*, though scholars disagree whether it is derived from Chrétien or from a shared older source. For Tennyson's purposes, the Welsh tale was the available English text of the Geraint-and-Enid story, and he used it as the idyll's primary source while incorporating Arthurian material (the Round Table, Guinevere's court) from his Malory-reading.

What Tennyson preserves from the Welsh source: the sparrow-hawk tournament, Yniol's dispossession and ruined hall, Enid's first appearance in a faded silk gown, the chivalric contest for her hand, the wedding at Arthur's court. What he adds: the English-pastoral register, the Victorian maternal tenderness around Enid, the opening meditation on Guinevere's already-guilty love for Lancelot (annotation 5), and the tonal deepening that makes Enid a figure of Victorian wifely patience.

Reading the Welsh source alongside Tennyson's idyll is one of the productive comparison paths. Guest's translation is still in print; the differences are legible. Tennyson's Enid is softer, more domesticated, more sacrificial than the Welsh Enid — the Victorian-frame is visible in the translation into English blank verse.`,
    crossReferences: [
      {
        type: "source",
        description: "The medieval Welsh Mabinogion tale \"Geraint son of Erbin,\" read by Tennyson in Lady Charlotte Guest's 1838–45 English translation. This is the idyll's primary source — a major exception in the cycle, whose other idylls derive from Malory.",
        workTitle: "The Mabinogion",
        workAuthor: "anonymous medieval Welsh; trans. Lady Charlotte Guest",
        passageReference: "\"Geraint son of Erbin\"",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  {
    id: "iotk-mg-guinevere-seed",
    bookId: "idylls-of-the-king",
    chapterNumber: 3,
    anchorText: "Touching her guilty love for Lancelot",
    anchorOccurrence: 1,
    title: "The Guinevere-Lancelot seed — private rumor, still unproved",
    quotedPassage: "\"…Whispers rife about the Queen, / Touching her guilty love for Lancelot, / Though yet there lived no proof, nor yet was heard / The world's loud whisper…\"",
    passageReference: "Marriage of Geraint, Guinevere-rumor passage",
    commentary: `In the middle of what is otherwise a Welsh-sourced marriage romance, Tennyson plants the first seed of the cycle's central adultery-plot. Enid, loving and admiring Queen Guinevere, becomes aware of rumors *touching her guilty love for Lancelot*; no proof yet exists; the world's loud whisper has not yet begun; but the private court-gossip is underway.

This is structurally important. The Marriage of Geraint is Idyll III in the cycle's 1891 ordering. Merlin and Vivien (VI) and the main Lancelot-Guinevere plot do not unfold until later. Tennyson plants the seed *here*, in a Mabinogion-sourced idyll that superficially has nothing to do with the queen's adultery, because he needs the reader to know the rumor was already present during the Round Table's stable years. Guinevere's fall is not a sudden event; it is a long private condition that becomes public.

The phrase *Though yet there lived no proof* is Tennyson at his most legally precise. *Yet* marks the time-frame — this is pre-proof; proof will come later. *Lived* — the proof *exists* nowhere, has no existence yet. The Victorian evidentiary register is exact: rumor without proof is rumor only, and the court, honoring Guinevere, discounts it. Geraint's eventual misreading of Enid (in Idyll IV) will echo this moment — a private rumor believed against absent proof.

Enid's role here is as the good auditor of rumor — she hears it, loves Guinevere still, does not repeat it. When Geraint mishears her speaking of the whispers (the specific misunderstanding that drives Idyll IV), his jealousy wrongs her precisely because she has been faithful to the higher courtly virtue of not credulously repeating what has no proof. The idyll's narrative setup is already preparing the second idyll's central misreading.`,
    crossReferences: [
      {
        type: "echo",
        description: "The Guinevere-rumor seeded here flowers in Idyll VI (Merlin and Vivien), where Vivien weaponizes the court-gossip as she beguiles Merlin. The slow transition from private rumor to public scandal is one of the cycle's structural arcs; this is where it begins.",
        workTitle: "Idylls of the King — Merlin and Vivien",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Merlin and Vivien (entire idyll)",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 6,
        targetAnchorText: "Vivien",
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  {
    id: "iotk-mg-ruined-hall",
    bookId: "idylls-of-the-king",
    chapterNumber: 3,
    anchorText: "ruined hall",
    anchorOccurrence: 1,
    title: "Yniol's ruined hall — the idyll's pastoral-elegiac landscape",
    quotedPassage: "\"…in my ruined hall, / Beholding one so bright in dark estate, / I vowed that could I gain her, our lost hall / Should rise and shine again…\"",
    passageReference: "Marriage of Geraint, Yniol's ruined hall (sparrow-hawk backstory)",
    commentary: `Yniol, Enid's father, has been dispossessed of his proper lands by his nephew Limours. He and Enid live in a ruined hall with dignity but diminished circumstances. Geraint, wandering into this landscape, finds Enid in faded silk in her father's ruin, and his resolve to win her is bound up with his vow to restore Yniol's fortunes.

Tennyson's handling of the ruined hall is one of the idyll's most affecting passages. Three elements are doing work:

1. **The pastoral-elegiac landscape.** Ruined walls, fallen masonry, a beautiful young woman in faded silk — the iconography is the Victorian-medieval revival in miniature. Walter Scott, the Pre-Raphaelite painters, the Gothic Revival: this setting is the shared Victorian imaginary of what the medieval should look like after time has worked on it.

2. **Enid in dark estate.** Enid's dignity *in* her circumstances is the test Geraint's love has to meet. He loves her not as a wealthy lady would be loved but as a woman whose worth is independent of her surroundings. This is the idyll's most direct ethical claim about marriage — love is for the person, not the estate.

3. **The restoration vow.** *I vowed that could I gain her, our lost hall / Should rise and shine again.* Geraint's courtship is also an economic-political action: he will restore Yniol's property, right the wrong done by Limours, redeem the dispossession. The marriage is also a contract of restitution. Victorian readers saw this as perfectly ordinary; modern readers sometimes find the economic register jarring, but it is part of what the chivalric frame includes.`,
    crossReferences: [],
    tags: ["literary-influence", "historical"],
  },

  {
    id: "iotk-mg-sparrow-hawk",
    bookId: "idylls-of-the-king",
    chapterNumber: 3,
    anchorText: "sparrow-hawk",
    anchorOccurrence: 1,
    title: "The sparrow-hawk tournament — the Welsh chivalric set-piece",
    quotedPassage: "\"…sparrow-hawk!\"",
    passageReference: "Marriage of Geraint, sparrow-hawk tournament",
    commentary: `The sparrow-hawk tournament is the central set-piece of the Welsh *Geraint son of Erbin* and Tennyson preserves it in detail. A sparrow-hawk is held each year as a prize; knights fight for it as an offered gift to the most beautiful woman present; Edyrn son of Nudd, a cruel young knight, has won it three years running for his haughty lady. Geraint, to avenge an insult done earlier to Guinevere's maid (Edyrn's dwarf had struck her), challenges Edyrn for the sparrow-hawk, using Enid as his claimed lady.

The tournament does three things:

1. **Provides the plot motor.** Geraint fights Edyrn, wins, extracts Edyrn's surrender, and sends Edyrn to Arthur's court for judgment. Edyrn becomes a reformed character — one of the cycle's rare redemption-arcs; he is mentioned later as a loyal knight of the Round Table. This is unusual for the Idylls, which mostly does not allow moral restoration of fallen characters.

2. **Binds Geraint and Enid publicly.** The chivalric contest makes Enid visible to the assembled knights as the lady Geraint is fighting for; the subsequent betrothal arises naturally from the tournament's claims. Welsh chivalric formula is honored.

3. **Tests Geraint's claim to her without prior knowledge.** Geraint fights for Enid knowing her only by sight; she is rewarded for her beauty and bearing, not for established acquaintance. This is the romance convention of love-at-first-sight making itself publicly consequential — the private gaze becoming the public fight.

Tennyson's prosody in the tournament passages is straightforward narrative pentameter, not heightened. He is honoring the Welsh source's matter-of-fact chivalric register rather than imposing his own ornamental mode. This is one of the idyll's more plain-style passages, and intentionally so.`,
    crossReferences: [],
    tags: ["literary-influence", "historical"],
  },

  {
    id: "iotk-mg-faded-silk",
    bookId: "idylls-of-the-king",
    chapterNumber: 3,
    anchorText: "faded silk",
    anchorOccurrence: 1,
    title: "The faded silk — the idyll's signature material detail",
    quotedPassage: "\"A faded silk, A faded mantle and a faded veil, / And moving toward a cedarn cabinet, / Wherein she kept them folded reverently…\"",
    passageReference: "Marriage of Geraint, faded-silk gown passage",
    commentary: `The *faded silk* is the idyll's most specific and most repeated material detail. Enid first appears in the gown; it is her only good dress, saved through the family's misfortune; she wears it to the tournament; she keeps it folded reverently in a cedarn cabinet after her marriage; it becomes the emblem of her origins and her husband's first sight of her.

Three readings:

1. **The gown is Enid's faithfulness made visible.** She preserves what she was when Geraint first loved her. The preservation is an act of marital loyalty — she does not forget her own past self; she keeps the proof of it.

2. **The gown is the idyll's class-memory.** Enid was dispossessed; the gown remembers that. By keeping it, she refuses to let wealth erase the daughter of a ruined lord. The ethical-economic weight (annotation 4) is carried by this material object.

3. **The gown is the idyll's pastoral token.** Faded, soft, often-touched, the silk is Tennyson's object-level Victorian-medievalism. The thing preserved across time, worn thin by love, rather than glittering in wealth. Read alongside Pre-Raphaelite paintings (William Morris's interior-textile revival, for instance) to feel the cultural weight of a *faded silk* as emotionally rich in a way pristine silk would not be.

The idyll's closing lines — *now this morning when he said to her, "Put on your worst and meanest dress," she found / And took it, and arrayed herself therein* — return to the gown as the idyll closes on the inciting action of Idyll IV. Geraint has ordered her to put on her worst dress; she interprets "worst and meanest" as the faded silk, the oldest gown she owns, the one full of their marriage's love. The misreading will drive the whole of the second idyll. The idyll's closing material detail is already setting up the crisis.`,
    crossReferences: [
      {
        type: "echo",
        description: "The closing faded-silk image carries directly into \"Geraint and Enid\" (Idyll IV), where the gown becomes the wife's silent loyalty-signal against her husband's jealous misreading.",
        workTitle: "Idylls of the King — Geraint and Enid",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Geraint and Enid (entire idyll)",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 4,
        targetAnchorText: "O purblind race",
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },

  {
    id: "iotk-mg-edyrn",
    bookId: "idylls-of-the-king",
    chapterNumber: 3,
    anchorText: "Edyrn, son of Nudd",
    anchorOccurrence: 1,
    title: "Edyrn the reformed — the cycle's rare redemption-arc",
    quotedPassage: "\"…Edyrn, son of Nudd, / 'These two things shalt thou do, or else thou diest.'\"",
    passageReference: "Marriage of Geraint, Edyrn's defeat and sentencing",
    commentary: `Edyrn is the cruel young knight whose defeat at the sparrow-hawk tournament sets up the idyll's action. He has oppressed Yniol; his dwarf has struck Guinevere's maid; he is the idyll's initial moral agent of harm. Geraint defeats him and sends him, unconditionally, to Arthur's court for judgment.

What happens next is one of the cycle's rarest moves. Edyrn arrives at court; he is judged; Arthur receives his submission; and he is *reformed*. Edyrn does not die; he is not banished; he enters the Round Table as a reformed knight. Later idylls (specifically Geraint and Enid) will name him as a loyal member of Arthur's band. This is the cycle's one successful moral-restoration of a fallen character.

Why does this happen only here? Three reasons:

1. **The Welsh source permits it.** Mabinogion Arthurian romance is less severely moralized than Malory's Christian-chivalric frame; reformation is available as a plot-outcome. Tennyson inherits the option from his source.

2. **The cycle's tonal economy requires one successful restoration.** Every other fallen character in the cycle — Guinevere, Lancelot, Merlin, Pelleas, Tristram — either does not return to grace or returns only through death. One counter-example is needed for the cycle's moral frame not to collapse into pure failure-narrative. Edyrn fulfills that role structurally.

3. **The idyll's register is lighter.** The Marriage of Geraint is not in the cycle's dark-late mode (Grail, Guinevere, Passing); it is a bright-morning mode near Gareth and Lynette. In that register, restoration is available; in the dark register, it would not have been.

Edyrn is thus a small but structurally significant character across the cycle. Read him, when he reappears in Idyll IV and in passing mention elsewhere, as the cycle's one success-story of chivalric moral repair.`,
    crossReferences: [],
    tags: ["literary-influence", "philosophical"],
  },

  {
    id: "iotk-mg-guinevere-welcome",
    bookId: "idylls-of-the-king",
    chapterNumber: 3,
    anchorText: "Queen herself",
    anchorOccurrence: 1,
    title: "Guinevere welcomes Enid — the court's maternal register",
    quotedPassage: "\"…the Queen herself, / Grateful to Prince Geraint for service done, / Loved her, and often with her own white hands…\"",
    passageReference: "Marriage of Geraint, Guinevere welcoming Enid to court",
    commentary: `Enid arrives at Arthur's court as Geraint's new bride and is welcomed by Guinevere personally. The queen loves Enid, dresses her with her own hands, becomes her pattern — Enid in turn adores the queen as the *stateliest and the best / And loveliest of all women upon earth*.

This is one of the cycle's warmest passages and also one of its saddest retrospectively. At this moment in the cycle's chronology, Guinevere's adultery with Lancelot has not yet become public scandal (though, as annotation 3 notes, the private rumor has started). The relationship between the queen and her younger subjects is still intact: Guinevere is genuinely maternal, generous, the moral center of the court's female community. Enid's love for her is uncomplicated.

Read against the Guinevere idyll (XI), this passage is almost unbearable. There, Guinevere has fled to Almesbury; the novice who gossips to her about the scandal knows her only as the fallen queen; the maternal-queenly position she occupies here is gone. The loss is measured by this passage. The queen who once dressed Enid with her own white hands is, by Idyll XI, herself the subject of the scandalous gossip the young women retell without knowing whom they talk about.

The idyll is plausibly the cycle's most generous treatment of Guinevere pre-fall. Tennyson is carefully establishing what was lost so the loss, when it comes, registers. Readers who experience the Idylls in canonical order first meet Guinevere primarily through Enid's admiring eyes — the queen of beauty and grace, not yet the adulteress. This is why the Guinevere idyll's later judgment is so hard to read: we have, through this idyll and Enid, been given a first impression of her we actively love.`,
    crossReferences: [
      {
        type: "echo",
        description: "Enid's love for Guinevere here is the cycle's warmest moment of the queen pre-fall. Read against Idyll XI (Guinevere's nunnery scene), this passage measures what the cycle loses. The queen who dressed Enid with her own white hands is the queen whom the novice will later gossip about as the court's downfall.",
        workTitle: "Idylls of the King — Guinevere",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Guinevere (entire idyll)",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 11,
        targetAnchorText: "Queen Guinevere had fled the court",
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  {
    id: "iotk-mg-closing-command",
    bookId: "idylls-of-the-king",
    chapterNumber: 3,
    anchorText: "Put on your worst and meanest dress",
    anchorOccurrence: 1,
    title: "\"Put on your worst and meanest dress\" — the command that launches Idyll IV",
    quotedPassage: "\"And now this morning when he said to her, / 'Put on your worst and meanest dress,' she found / And took it, and arrayed herself therein.\"",
    passageReference: "Marriage of Geraint, closing lines",
    commentary: `The idyll's closing is also its handoff to Idyll IV. Geraint — whose jealousy has been obliquely seeded through the opening (a separate scene not covered in this annotation cluster but present in the middle idyll) — orders Enid to put on her worst and meanest dress. She interprets the command literally, finds the faded silk (the gown of their marriage-beginning), and arrays herself in it.

The closing does three things structurally:

1. **Ends the idyll on an action, not a conclusion.** Unlike most idylls, *The Marriage of Geraint* does not close in summary or reflection. It closes on Enid putting on the dress. The idyll stops mid-action; Idyll IV begins with Geraint's response to her dressed.

2. **Primes the misunderstanding.** Geraint's command was (the reader and Idyll IV will come to know) intended as a test or insult; Enid's interpretation of it was loving (the dress he first loved her in). The gap between intention and interpretation is the center of the next idyll's drama.

3. **Closes on the dress as emblem.** The faded silk (annotation 6) carries the idyll's whole emotional history into the next one. Enid wearing it is wearing her marriage; Geraint seeing her in it will misread what she is saying with the silk.

This is one of the cycle's most subtle idyll-boundaries. Tennyson is using the two-idyll structure to give the Geraint-Enid story a pause at exactly its turning-point. *The Marriage* is the marriage in its trusting phase; *Geraint and Enid* will be the marriage in its trial. The closing command crosses the boundary.`,
    crossReferences: [],
    tags: ["literary-influence", "linguistic"],
  },

  {
    id: "iotk-mg-victorian-marriage-ideology",
    bookId: "idylls-of-the-king",
    chapterNumber: 3,
    anchorText: "loved her, as he loved the light of Heaven",
    anchorOccurrence: 1,
    title: "Victorian marriage-ideology inside a Welsh source",
    quotedPassage: "\"…had married Enid, Yniol's only child, / And loved her, as he loved the light of Heaven.\"",
    passageReference: "Marriage of Geraint, opening definition of the marriage",
    commentary: `The Marriage of Geraint is, after its Welsh-source skeleton, a specifically Victorian meditation on marriage. Geraint's love is like Heaven's light — unconditional, received rather than chosen, cosmic. Enid's patience (developed more fully in Idyll IV) is the Victorian ideal of wifely constancy. The restored-hall motif is Victorian domestic economy — a good marriage as rescue of the beloved's diminished circumstances.

This layering is important to name because the idyll is often underread as just the Welsh romance. It is that, but it is also Tennyson's 1859 working-out of what a good marriage looks like in the Victorian frame, superimposed on a medieval Welsh tale. The *Mabinogion* did not have Victorian marriage-ideology; Tennyson brought it.

Three specific Victorian assumptions operating in the idyll:

1. **Husband's gaze as constitutive.** *He loved her, as he loved the light of Heaven* — the woman's beauty is the husband's to register. Modern readers sometimes notice that the idyll gives Geraint no corresponding admiration from Enid at equivalent scale; the gaze runs one way.

2. **Wife's virtue tested by patience under unjust treatment.** The second idyll (Geraint and Enid) will make this explicit, but the structure is latent in the first idyll's handling of Enid's dispossession-dignity. A woman's moral worth shows when she endures the injustice done to her without complaint.

3. **Marriage as domestic economy.** The restoration of Yniol's hall is a transaction; love is also inheritance-clearing, is also property-recovery. This is not in the Welsh source in the same terms; Tennyson brings the Victorian bourgeois marriage-economics.

None of this is a reason to dismiss the idyll. It is Victorian; it can be read as Victorian, with the frame's assumptions registered. The Welsh original is still accessible, for readers who want it unlayered; Tennyson's version is the layered version, and the layering is itself legible as evidence of what the period assumed about marriage. Read the idyll with the frame visible.`,
    crossReferences: [],
    tags: ["philosophical", "historical", "literary-influence"],
  },
]
