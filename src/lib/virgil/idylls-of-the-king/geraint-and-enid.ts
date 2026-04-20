import type { Annotation } from "../types"

// ── Idylls of the King: Geraint and Enid (Idyll IV) ────────────────
// Tennyson's 1859 idyll (7,963 words), second half of the Geraint/
// Enid diptych. The trial-by-misunderstanding. Mabinogion-sourced
// via Guest (1838–45). The cycle's most explicitly gender-political
// idyll — Victorian wifely-patience ideology superimposed on a
// Welsh medieval source.
//
// Density: 10 annotations. The idyll is the cycle's most morally
// uncomfortable for modern readers after Guinevere; the annotations
// must honor the gender-political difficulty honestly without either
// erasing Tennyson's frame or apologizing it away.

export const IOTK_GERAINT_AND_ENID: Annotation[] = [
  {
    id: "iotk-ge-purblind-opening",
    bookId: "idylls-of-the-king",
    chapterNumber: 4,
    anchorText: "O purblind race of miserable men",
    anchorOccurrence: 1,
    title: "\"O purblind race of miserable men\" — Tennyson's moral editorial",
    quotedPassage: "O purblind race of miserable men, / How many among us at this very hour / Do forge a life-long trouble for ourselves, / By taking true for false, or false for true; / Here, through the feeble twilight of this world / Groping, how many, until we pass and reach / That other, where we see as we are seen!",
    passageReference: "Geraint and Enid, lines 1–7 · IotK IV.1–7",
    commentary: `The idyll opens with its own interpretive frame stated explicitly — a seven-line editorial from the narrator before any character speaks. Tennyson gives the reader the key to the misunderstanding before it is narrated: the suffering of men who, *through the feeble twilight of this world*, take *true for false, or false for true*, and spend their lives forging trouble from their own error.

This is unusual. Most of the Idylls are narrative-third-person without heavy editorial framing; Tennyson in his more confident passages lets the story speak. Here he intervenes directly. Why?

The reason is gender-political honesty, and it works both ways. Tennyson knows that the idyll he is about to tell — a wife patiently enduring her husband's unjust suspicion until her fidelity proves itself — is structurally close to a cruelty he is not celebrating. The opening frames Geraint's behavior as *error* — not as lesson, not as discipline, not as authority. He is *purblind* (partly blind, unable to see clearly), *miserable*, groping in twilight. The idyll's moralization is of the husband's mistake, not the wife's submission.

This is important to register. The idyll has been read as Victorian wifely-patience propaganda — and in places (annotation 5) it partly is — but the opening frame explicitly names the husband as the source of the trouble, not the wife's submissiveness as the solution. Enid's patience *vindicates* her against a false accusation; it does not *correct* her. She was right all along; Geraint is the one who had to come to see.

*Here, through the feeble twilight of this world / Groping* — the Platonic register is doing work. We see badly now; we will see rightly only in the life-to-come. The opening is quietly eschatological. Earthly marriage is partial vision; full vision is later. The idyll is more theologically heavy at its opening than it looks.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence", "linguistic"],
  },

  {
    id: "iotk-ge-geraint-jealousy",
    bookId: "idylls-of-the-king",
    chapterNumber: 4,
    anchorText: "Effeminate as I am",
    anchorOccurrence: 1,
    title: "Geraint's self-accusation — \"effeminate as I am\"",
    quotedPassage: "\"Effeminate as I am, / I will not fight my way with gilded arms, / All shall be iron.\"",
    passageReference: "Geraint and Enid, Geraint's preparation for the ride",
    commentary: `Geraint, before setting out on the trial-ride with Enid, announces that he will fight in plain iron armor — rejecting his usual courtly *gilded arms*. The gesture is simultaneously a moral-severity (the renunciation of courtly ornament) and, in his own self-accusation, a self-correction of *effeminacy*.

The word *effeminate* here is Tennyson's characteristic Victorian usage. It does not mean weak or unmasculine in any simple sense; it means *softened by too much domestic time with women*, *over-polished by court life*, *diminished in martial virtue by the pleasures of the hearth*. Geraint's complaint against himself is that his marriage to Enid has made him too fond of home, too remote from knightly action. He heard something — the rumor-scene that preceded the idyll's opening — that made him suspect Enid of regretting his *loss of manhood* under her influence.

The self-accusation is mistaken. Enid was actually lamenting his loss of reputation at court (she had overheard the court's talk of him as softened, and she was regretting *for him*, not *against him*); Geraint misheard her as regretting his effeminacy in a more damning sense. Hence the fatal misunderstanding.

The idyll is thus, at its inciting condition, a misreading of a wifely grief. Enid was grieving *with* her husband for something real (his diminished standing); Geraint construes her grief as being *against* him. *Taking true for false, or false for true* (annotation 1): this is the specific instance the opening editorial was forecasting.

The idyll's gender politics get their first complication here. Geraint's *effeminate* self-accusation reveals the particular Victorian masculine anxiety he is working under — that a good domestic life endangers masculine honor. This is Tennyson's frame, not a universal truth; Victorian masculinity was structured so that this anxiety was felt; the idyll registers the anxiety while also showing the damage it does to the marriage. Reading attentively, Tennyson is not endorsing Geraint's fear; he is showing where the fear comes from and what it costs.`,
    crossReferences: [],
    tags: ["historical", "philosophical", "literary-influence"],
  },

  {
    id: "iotk-ge-ride-before",
    bookId: "idylls-of-the-king",
    chapterNumber: 4,
    anchorText: "ride before",
    anchorOccurrence: 1,
    title: "\"Ride before\" — the silence-command and its violence",
    quotedPassage: "\"…ride before…\"",
    passageReference: "Geraint and Enid, Geraint's command to Enid to ride ahead in silence",
    commentary: `Geraint orders Enid to ride before him on the trial-journey, and — more importantly — to speak not a word unless spoken to. The silence-command is the idyll's specific cruelty. Enid is made to go ahead of him alone on a dangerous road, forbidden to warn him of threats she might see, forbidden to address him except when permitted.

This is hard to read. A modern reader registers the silence-command as controlling-behavior in a marriage, as emotional abuse, as the exact pattern that would be named in twenty-first-century language as coercive control. Tennyson, writing in 1859, does not use that vocabulary — but he is not unaware of what the command is. The idyll's dramatic structure depends on Enid *disobeying* the silence-command at moments of threat (she calls out warnings when bandits approach; she speaks to save his life) — and her disobedience is presented as the test that proves her love.

Three readings live here:

1. **The Victorian reading.** The silence-command is a trial, not a permanent condition. Geraint tests Enid's patience and fidelity; she passes by showing that she would rather break his command to save him than keep his command and see him harmed. Her willingness to risk his displeasure for his good is the idyll's proof of a deeper obedience than literal compliance. This is the Victorian wifely-patience reading.

2. **The modern reading.** The silence-command is an abuse, regardless of its outcome. Geraint's right to impose it is unjust; Enid's obligation to submit is not a virtue; the idyll's resolution (she passes the test, he sees his error, the marriage is restored) naturalizes a coercive dynamic the idyll itself generated. This is the reading that twentieth- and twenty-first-century feminist critics have developed.

3. **The layered reading.** Both readings are available in the text; the Victorian frame is honestly articulated, the modern critique is honestly supported by the text's own details (Enid's suffering, Geraint's continued unjust commands even after her first saving-acts). The idyll stages a cruelty it does not fully condemn, and readers are left to hold the tension.

Read the ride-sequences with the tension visible. Do not flatten the idyll into either "wholesome Victorian marriage-lesson" or "pure patriarchal harm." It is doing both, in exact proportion to the frame Tennyson lived inside.`,
    crossReferences: [],
    tags: ["philosophical", "historical", "literary-influence"],
  },

  {
    id: "iotk-ge-bandits",
    bookId: "idylls-of-the-king",
    chapterNumber: 4,
    anchorText: "bandit-haunted holds",
    anchorOccurrence: 1,
    title: "The bandit-country — the journey's landscape",
    quotedPassage: "\"…bandit-haunted holds, / Gray swamps and pools, waste places of the hern, / And wildernesses…\"",
    passageReference: "Geraint and Enid, bandit-country passage",
    commentary: `The trial-ride takes Geraint and Enid through a dangerous hinterland — *bandit-haunted holds, gray swamps and pools, waste places of the hern, and wildernesses*. The landscape is the idyll's third character. It threatens them; it tests them; it produces the crises (bandit-attacks, Doorm's captive-hall) in which Enid disobeys the silence-command to save Geraint.

Tennyson's landscape-writing here is dense. The *waste places of the hern* (heron) is a typical Tennysonian detail — the bird that haunts marshes, imagined as the landscape's wild inhabitant. *Gray swamps and pools* has the flat-sky, wet-ground palette of Northern British wilderness. *Bandit-haunted holds* — *holds* is medieval-chivalric for strongholds; the adjective makes them places where banditry has settled.

The landscape's function is ethical. In the Victorian frame, the wild lands test the marriage; the couple's crossing of them becomes the proof of what their love is. In the Welsh source (via Guest), the landscape is more matter-of-fact — bandits are simply the road's dangers, not moral crucible. Tennyson moralizes the landscape. Every wilderness is also a trial.

The prosody is slow, heavy, continuant-filled. Read aloud, the passage's long vowels (*bandit-haunted holds*, *gray swamps and pools*) and soft consonants (*waste places of the hern*) produce a mood of dampness and threat. This is curated sound-painting; Tennyson knows what he is doing at the ear-level.`,
    crossReferences: [],
    tags: ["literary-influence", "linguistic"],
  },

  {
    id: "iotk-ge-earl-doorm",
    bookId: "idylls-of-the-king",
    chapterNumber: 4,
    anchorText: "Doorm, whom his shaking vassals called the Bull",
    anchorOccurrence: 1,
    title: "Earl Doorm the Bull — the idyll's brute villain",
    quotedPassage: "\"…Doorm, whom his shaking vassals called the Bull, / Went Enid with her sullen follower on.\"",
    passageReference: "Geraint and Enid, Earl Doorm's hall",
    commentary: `Earl Doorm, *whom his shaking vassals called the Bull*, is the idyll's second antagonist. (The first is Limours, a disposable early challenge; Doorm is the major one.) Doorm finds Geraint unconscious from a wound, brings him and Enid to his hall, and attempts to bully Enid into eating, drinking, and consenting to his approaches while Geraint lies supposedly dying.

Doorm is one of Tennyson's clearest brute-figures in the cycle. Unlike Modred (cold-malevolent) or Mark (dark-iron), Doorm is written as straightforwardly *bullish* — physically large, domineering, instinctually violent. He is the idyll's test of Enid's resolution: will she eat with her captor, accept his hospitality, consent to his increasing demands? Enid refuses every one, shielding the unconscious Geraint, and when Doorm strikes her, Geraint — who has been pretending unconsciousness to see her response — rises and kills Doorm with one blow.

The scene is staged as the idyll's revelation. Geraint has been faking unconsciousness to observe Enid; her behavior under Doorm's pressure is what finally proves her to him. The pretense is not incidental; it is the idyll's final cruelty from Geraint (he lets Enid believe him dying or dead while he watches), and its final test that resolves.

Modern readers often find this passage the idyll's most difficult — Geraint's deceit of Enid at the moment of her greatest vulnerability is hard to defend. The idyll's frame presents it as the necessary condition of the revelation; a reader could fairly say it is an escalation of the earlier silence-command's injustice. Either way, Doorm's killing and Geraint's rising are the idyll's turning-point. After this scene, Geraint knows; his repentance begins; the marriage restores.`,
    crossReferences: [],
    tags: ["literary-influence", "philosophical"],
  },

  {
    id: "iotk-ge-reconciliation",
    bookId: "idylls-of-the-king",
    chapterNumber: 4,
    anchorText: "embraced her friend",
    anchorOccurrence: 1,
    title: "The reconciliation — Guinevere clothes Enid \"in apparel like the day\"",
    quotedPassage: "\"…embraced her friend, / And clothed her in apparel like the day.\"",
    passageReference: "Geraint and Enid, restoration-at-court passage",
    commentary: `After Doorm's death, Geraint and Enid ride back toward Arthur's court. The reconciliation scene — Guinevere welcomes Enid with a kiss and dresses her in radiant gown — is one of the idyll's quietest grace-notes. The *apparel like the day* image is the opposite of the faded silk she has been wearing throughout the trial. Enid, who went into the wilderness in her marriage-beginning gown, is dressed by the queen into day-bright cloth.

The image is Tennyson's most direct use of clothing-as-ethics. The faded silk was preservation, memory, the marriage's first vow. The day-bright apparel is restoration, reward, the marriage's renewed public life. Guinevere's own white hands — the same phrase used in *The Marriage of Geraint* when Guinevere first welcomed the new bride — dress Enid again, completing the arc.

This is also one of the cycle's warmest queen-passages. Guinevere, who has not yet become the public scandal, continues to function as the maternal-queenly figure of the court. Her embrace of Enid is uncomplicated affection. The reader, if reading in canonical order, has not yet met the Guinevere of the nunnery idyll (XI) and receives this Guinevere as the generous court-mother Enid loves. The two impressions will collide later; for now, only the first is present.

Tennyson's sequencing is deliberate. The Geraint/Enid idylls are III and IV; the fall of Guinevere does not begin publicly until VI (Merlin and Vivien). By placing the queen's unblemished maternal scenes in these earlier idylls, Tennyson banks the emotional credit that the later fall will spend. The idyll closes on what the cycle will soon lose.`,
    crossReferences: [
      {
        type: "echo",
        description: "The queen's white-handed dressing of Enid echoes the same white-handed dressing in \"The Marriage of Geraint\" (Idyll III). The two dressings form an inclusio around the Geraint/Enid diptych. Both happen in the queen's pre-fall unblemished presence.",
        workTitle: "Idylls of the King — The Marriage of Geraint",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Marriage of Geraint, Guinevere welcoming Enid",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 3,
        targetAnchorText: "Queen herself",
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },

  {
    id: "iotk-ge-enid-the-good",
    bookId: "idylls-of-the-king",
    chapterNumber: 4,
    anchorText: "Enid the Good",
    anchorOccurrence: 1,
    title: "\"Enid the Good\" — the idyll's closing epithet",
    quotedPassage: "\"…But Enid, whom her ladies loved to call / Enid the Fair, a grateful people named / Enid the Good…\"",
    passageReference: "Geraint and Enid, closing lines",
    commentary: `The idyll closes by giving Enid an epithet — *Enid the Good* — to replace the earlier *Enid the Fair*. The shift is Tennyson's formalization of the idyll's moral arc. She began as the beautiful dispossessed daughter of the ruined hall; she ends as the woman whose goodness has become a people's name for her. Beauty was the Welsh-romance register; goodness is the Victorian-moral one.

Tennyson's use of epithet here is structurally like Homer's. Odysseus is *polytropos* (of many turns); Hector is *andropholos* (man-killer); Enid is *Fair* early in the story, *Good* by its end. The epithet marks a life's work. Enid has earned her name by what she has endured.

Compare the *Dedication*'s *Albert the Good* (the same epithet applied to Prince Albert). The repetition is not accidental. Albert was *the Good* by consort-virtue, his blameless life; Enid is *the Good* by wifely-virtue, her patience under trial. The two epithets are structurally the same Victorian moral category: the private figure whose private conduct has been adequate to public scrutiny, whose life can be named for its virtue. Tennyson is mapping the Victorian public-private virtue onto Arthurian material. The Dedication frames the cycle; the Geraint/Enid diptych inside the cycle enacts the same frame at the domestic level.

This is one of the idyll's signature Victorian moves, and one of the places where the frame is most visible. Read *Enid the Good* with the Dedication's *Albert the Good* audible. The cycle is Victorian England's Arthurian self-portrait, and Enid is its domestic female type as Albert was its public male one.`,
    crossReferences: [
      {
        type: "echo",
        description: "\"Enid the Good\" as an epithet echoes the Dedication's \"Albert the Good\" — the same Victorian moral-category applied to public and domestic virtue. The idyll and the Dedication are doing the same work at different scales.",
        workTitle: "Idylls of the King — Dedication",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Dedication, closing of virtue-catalog",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 0,
        targetAnchorText: "Albert the Good",
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  {
    id: "iotk-ge-feminist-reading",
    bookId: "idylls-of-the-king",
    chapterNumber: 4,
    anchorText: "nor did he doubt her more",
    anchorOccurrence: 1,
    title: "The feminist critique — the idyll's gender politics honestly named",
    quotedPassage: "\"…nor did he doubt her more, / But rested in her fealty…\"",
    passageReference: "Geraint and Enid, closing lines",
    commentary: `The idyll ends with Geraint no longer doubting Enid. *Rested in her fealty* — the verb *rested* is doing work; Geraint comes to a *stop*, the anxiety ceases, the marriage settles. Enid's fidelity has been the resting-place Geraint was unable to rest in until he tested it to its limit.

The line is affecting on its Victorian terms, and it is also the exact place where modern feminist critique has pressed hardest on the idyll. Read the closing with the cumulative weight of what preceded it:

- Enid endured the silence-command, riding ahead alone, not permitted to speak.
- She endured two violent trials (Limours's assault, Doorm's captivity).
- She endured the nearly-unbearable scene of Doorm's blow while Geraint pretended unconsciousness.
- She maintained her fidelity under every pressure, including being struck.
- Geraint, having caused all of this through his own misunderstanding, *rests*.

The asymmetry is severe. Enid suffered; Geraint rested. The idyll's restoration is genuine — he repents, the marriage does actually improve, Enid becomes *Enid the Good* — but the distribution of the testing is unequal. Enid's fidelity was tested to near-destruction; Geraint's fidelity was never tested at all.

The feminist reading names this: the Victorian-marriage-trial plot structurally tests the wife alone. A comparable plot in which the husband were tested (by the wife's unjust suspicion, by her silence-command, by dangers he had to endure while she watched unconscious) is structurally unavailable in the genre. The idyll inherits the Welsh material and Victorian frame as they come; the asymmetry is built in; Tennyson's handling participates in the asymmetry.

What Tennyson does *right*, within the frame, is name Geraint's behavior as *error* (annotation 1's opening) and end with Geraint's repentance rather than Enid's submission. The frame makes her the tested one; the moral distribution at the end is somewhat equalized by making him the repentant one. This is as far as the Victorian frame could be pressed toward gender-political justice; it is not as far as modern readers want it pressed.

Read the idyll with the critique visible. It is not a simple pro-patriarchy poem; it is also not a proto-feminist one; it is a Victorian text doing the best the Victorian frame allowed with a Welsh source whose gender-politics were already difficult. Hold the complexity; do not erase either the idyll's real humanity or its real limits.`,
    crossReferences: [],
    tags: ["philosophical", "historical", "literary-influence"],
  },

  {
    id: "iotk-ge-heathen-death",
    bookId: "idylls-of-the-king",
    chapterNumber: 4,
    anchorText: "blameless King",
    anchorOccurrence: 1,
    title: "Geraint's death — \"fighting for the blameless King\"",
    quotedPassage: "\"…a happy life with a fair death, / And fell / Against the heathen of the Northern Sea / In battle, fighting for the blameless King.\"",
    passageReference: "Geraint and Enid, closing sentence",
    commentary: `The idyll closes on Geraint's eventual death — he *fell against the heathen of the Northern Sea / In battle, fighting for the blameless King*. The closing line's *blameless King* is Arthur, the moral-ideal sovereign of the Dedication and the cycle's stated frame.

Three readings:

1. **The heroic closure.** Geraint dies not in private disgrace but in public service — defending the realm against heathen invaders, in battle, for his king. His story ends well within the chivalric frame; the marriage was restored, the man died honorably, the life was complete. This is the idyll's offered reading.

2. **The Geraint/Enid story's place in the cycle.** Of the knights whose names recur across the cycle, Geraint is one of the few whose story ends in a good private death (compare Lancelot's divided guilt, Tristram's cynical end, Pelleas's bitterness, Modred's treason). The Geraint/Enid diptych is therefore, in the cycle's larger logic, a *rescuable* story — marriages can be restored, knights can die honorably, the cycle is not uniform ruin. This is structurally important; the cycle needs one or two successful-marriage models.

3. **The phrase "blameless King" as echo.** *Blameless* is the Dedication's word for Albert — *the white flower of a blameless life*. Applying it to Arthur here closes a small ring: Albert is Arthur, Arthur is blameless, and knights who die fighting for Arthur die fighting for the ideal-sovereign type whose modern analogue was Albert. The Dedication's moral scheme reaches into the Geraint idyll's closing word.

The idyll is the cycle's only one where a knight's death is fully good — no ambiguity, no compromise, no partial vision. Enid, Geraint, the restored marriage, the honorable death: the Geraint/Enid diptych is a small enclave of chivalric success inside the cycle's larger pattern of failure. It is the enclave you can point to when someone claims the Idylls is only despair. Tennyson did permit himself one domestic success-story. This is it.`,
    crossReferences: [],
    tags: ["literary-influence", "philosophical"],
  },

  {
    id: "iotk-ge-twinned-idylls",
    bookId: "idylls-of-the-king",
    chapterNumber: 4,
    anchorText: "Enids and Geraints",
    anchorOccurrence: 1,
    title: "\"Enids and Geraints of times to be\" — marriage as succession",
    quotedPassage: "\"…and in their halls arose / The cry of children, Enids and Geraints / Of times to be…\"",
    passageReference: "Geraint and Enid, closing passage",
    commentary: `The idyll's penultimate image is of the marriage's children — *Enids and Geraints of times to be*. The plural-proper-names device is Victorian-sentimental (*Enids* as a plural of the mother's type, *Geraints* as a plural of the father's), and it locates the marriage's achievement in its succession. Not only were the two reconciled; they produced *Enids and Geraints*, future-lives of the pattern they had redeemed.

Three readings:

1. **Marriage as continuance.** Victorian marriage was understood, at its most hopeful, as a project of producing virtuous future citizens. The children are the marriage's publicly-valuable outcome; they matter because they are *of times to be*, carrying the marriage's proved virtue forward.

2. **Counter-image to Arthur and Guinevere.** Arthur and Guinevere have no children in the cycle (Modred is Arthur's illegitimate son, not Guinevere's). The succession-of-virtue available to Geraint and Enid is *not available* to the royal marriage at the cycle's center. The Geraint/Enid story succeeds at what the royal story fails at. This is structurally important.

3. **Continuity against cycle's ending.** *Of times to be* is a forward-looking phrase near the cycle's midpoint. The later idylls (Grail, Pelleas, Tournament, Guinevere, Passing) will be about the kingdom ending, not continuing. This idyll closes on succession-to-the-future; the later idylls close on Arthur's translation-out-of-the-future. The contrast is the cycle's internal tension.

The phrase *Enids and Geraints / Of times to be* also anticipates "To the Queen"'s closing *only lives that are to be* (annotation 12 of the To the Queen cluster). Tennyson is using the forward-life figure consistently across the cycle: what matters is what comes after, the children, the lives still to be. The cycle is less a nostalgia-work than this idyll already shows. Read this small phrase as one of the cycle's quiet arguments about what marriages and kingdoms are *for*.`,
    crossReferences: [
      {
        type: "echo",
        description: "The \"of times to be\" future-oriented closing echoes directly forward to \"To the Queen\" (Idyll XIII), whose closing gesture is \"only lives that are to be.\" Tennyson uses the forward-life figure consistently; this idyll is an early appearance of the cycle's more general argument.",
        workTitle: "Idylls of the King — To the Queen",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "To the Queen, closing",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 13,
        targetAnchorText: "ever-broadening England",
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },
]
