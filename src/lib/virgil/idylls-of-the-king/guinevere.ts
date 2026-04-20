import type { Annotation } from "../types"

// ── Idylls of the King: Guinevere (Idyll XI) ────────────────────────
// Tennyson's 1859 idyll (698 lines) — the cycle's emotional climax and
// its most morally contested passage. Guinevere has fled to the nunnery
// at Almesbury; Arthur comes to her; his long speech of forgiveness-
// with-judgment is the central moral crux of the Idylls.
//
// Density: 12 annotations. Primary categories:
//   - Spec Part 4 Category 16: moral-debate framing of Arthur's speech;
//     Tennyson's psychological depth of Guinevere's interior; specific
//     Malory departures.
//   - Spec Part 4 Category 3: the stated moral scheme at its tightest,
//     and where it exceeds (or fails) the practice.
//
// The spec's injunction is load-bearing: "Do not flatten Guinevere into
// Tennyson's moralized frame. The poem is larger than its stated moral,
// particularly in the 'Guinevere' idyll itself. Annotations should
// surface Tennyson's humanity toward her even when the frame is
// punitive."
//
// Anchors are line-exact against `public/content/idylls-of-the-king/
// ch-11.json` after scripts/idylls/transform-book.ts (data-iotk-line).

export const IOTK_GUINEVERE: Annotation[] = [
  // ── 1. Opening — Queen Guinevere in the nunnery ─────────────────
  {
    id: "iotk-guin-opening",
    bookId: "idylls-of-the-king",
    chapterNumber: 11,
    anchorText: "Queen Guinevere had fled the court",
    anchorOccurrence: 1,
    title: "\"Queen Guinevere had fled the court\" — the opening pluperfect",
    quotedPassage:
      "Queen Guinevere had fled the court, and sat / There in the holy house at Almesbury / Weeping, none with her save a little maid, / A novice.",
    passageReference: "Guinevere, lines 1–4 · IotK XI.1–4",
    commentary: `The idyll opens in the pluperfect: *had fled*. The action is already complete before the narrative begins. This is Tennyson's most radical formal choice in the idyll — the fall has already happened, offstage, and what we see is only the aftermath. All the plot-material that Malory develops at length (the discovery of the affair, Arthur's response, Mordred's revolt, the battles, the armored troops at the door) is compressed into the single past-perfect verb: *had fled*.

What we see, instead, is a single scene of weeping. Guinevere, the novice, the holy house, the silence. The idyll's 698 lines will essentially be this scene — extended, attended by Arthur's visit, closing on her entering the nunnery's full community — but not in any way a narrative of the kingdom's collapse. The collapse is already the past; this idyll is *psychology*, not *action*.

Three consequences:

1. **The idyll is the cycle's most interior.** Most of the 698 lines are Guinevere's consciousness or Arthur's long speech. There is almost no external event. The idyll's dramatic weight is entirely in what is felt and said.

2. **The reader meets Guinevere after judgment has already occurred.** She has already judged herself — she has fled; she is weeping — and that self-judgment precedes anything Arthur will say. This is important. Tennyson is not staging a trial; he is staging a confrontation with someone who has already accepted the terms of her fall.

3. **The novice's presence is structural.** The young woman — *a little maid, / A novice* — who sits with Guinevere is not Guinevere's peer; she is a new religious, unattached to the court, without history, without knowledge of who this weeping woman is. The novice's position is the reader's: outside the court, meeting the fallen queen for the first time, waiting to be told what has happened. The first 200 lines of the idyll will be the novice's scene — and it is one of the most delicately managed pieces of dramatic irony in Victorian poetry.`,
    crossReferences: [],
    tags: ["literary-influence", "linguistic", "philosophical"],
  },

  // ── 2. The novice and the court-gossip ──────────────────────────
  {
    id: "iotk-guin-novice-scene",
    bookId: "idylls-of-the-king",
    chapterNumber: 11,
    anchorText: "a little maid",
    anchorOccurrence: 1,
    title: "The novice's scene — painful dramatic irony",
    quotedPassage:
      "\"Late, late, so late! and dark the night and chill! / Late, late, so late! but we can enter still. / Too late, too late! ye cannot enter now.\" / … / \"Tell me, good mother, who is that weeping lady?\" / \"Nay, nay,\" said the novice, \"I had heard of her / Only some whisper in the hall before I came…\"",
    passageReference: "Guinevere, lines 155–200 (approx.) · IotK XI.155–200",
    commentary: `The novice's scene with Guinevere is one of Tennyson's most subtle dramatic constructions, and the passage the annotations must handle with the most care. The young novice — who has been raised in the convent since childhood, who does not know who Guinevere is — begins gossiping to the weeping woman about court matters she has just heard of: about King Arthur, about his unfaithful queen, about the scandal that has broken the realm.

Guinevere listens. The novice does not know her audience. The novice is innocent, cheerful, curious, the age at which gossip is interesting and the person one is talking about is abstract. She tells, to the queen she has never met, the story of the queen's adultery — in exactly the terms the court has reduced it to — and she does this while Guinevere is mourning her whole life.

The scene's construction is dramatic-ironic at the deepest level. Every line the novice speaks is both innocent and, to Guinevere, unbearable. The reader, who knows who Guinevere is, registers every innocent sentence as a small blow. Guinevere, inside the scene, has to listen to her own self-narrative told by a stranger as rumor.

The interpolated song — "*Late, late, so late!*" — is a lyric Tennyson places in the novice's mouth as a random hymn the novice is learning (it is the parable of the foolish virgins, Matthew 25). The novice sings it because she has been taught it. Guinevere hears, in its refrain, the structure of her own condition: *Late, late, so late… ye cannot enter now*. The foolish virgins who did not prepare their lamps in time, and who are shut out of the wedding feast. The song is Guinevere's unwilling mirror.

This is Tennyson's most sympathetic writing about Guinevere. The scene is devastating precisely because it is delicate — no one is accusing her; no one is judging her; the novice is simply being a novice. And the sheer accumulation of innocent speech about the queen's fall registers, on Guinevere (and on the reader), as more painful than any accusation could be. The idyll's humanity toward her is most visible here, before Arthur arrives.

Tennyson's invention. Nothing like this novice-scene is in Malory. Malory has no extended interior treatment of Guinevere at Almesbury; he simply reports her flight and, much later, her final refusal to see Lancelot again. Tennyson builds the entire first half of the idyll around this invented scene of painful dramatic irony. It is among the clearest examples of how the cycle's practice exceeds its stated moral frame: the frame says Guinevere is the flesh that unmade the kingdom; the practice gives her this scene of suffering such that the reader cannot condemn her without flinching.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "The \"Late, late, so late\" song is the parable of the wise and foolish virgins (Matthew 25:1–13) — ten young women awaiting the bridegroom, five prepared, five not; those without oil for their lamps are shut out of the wedding feast. The allegory mapped onto Guinevere is explicit: she is, structurally, the one who did not prepare and who is now shut out.",
        workTitle: "Gospel of Matthew (King James Bible)",
        workAuthor: "New Testament",
        passageReference: "25:1–13",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "linguistic", "philosophical"],
  },

  // ── 3. Guinevere's interior — the self-recrimination ────────────
  {
    id: "iotk-guin-interior",
    bookId: "idylls-of-the-king",
    chapterNumber: 11,
    anchorText: "I thought I could not breathe",
    anchorOccurrence: 1,
    title: "Guinevere's interior — the self-recrimination passages",
    quotedPassage:
      "\"I thought I could not breathe in that fine air, / That pure severity of perfect light— / I yearned for warmth and colour which I found / In Lancelot.\" / … / \"Mine, O mine the sin! / O mine, the shame! Yea, mine, who here should lie.\"",
    passageReference: "Guinevere, lines 635–680 (approx.) · IotK XI.635–80",
    commentary: `Guinevere's interior monologues are the idyll's largest technical achievement and the cycle's most sustained psychological passages. Tennyson gives her extended self-consciousness — self-reproach, memory, shifting emotional registers — in a way he gives no other woman in the cycle, and few other characters anywhere.

Two of these passages particularly deserve attention.

*I thought I could not breathe in that fine air, / That pure severity of perfect light— / I yearned for warmth and colour which I found / In Lancelot.* This is Guinevere explaining, to herself, why she chose Lancelot over Arthur. Arthur is *pure severity of perfect light* — the same "blameless" figure the Dedication describes, the same ideal-sovereign of the cycle's stated moral reading. Lancelot is *warmth and colour* — the human, the fallible, the lovable. Guinevere is articulating a specific critique of Arthur: he is too perfect to live with; his moral fineness is airless.

This is astonishing writing, and morally serious. Tennyson is letting Guinevere articulate — in her own voice, not as slander but as self-understanding — a critique of the ideal-sovereign figure the Dedication's frame put in the highest moral position. She does not deny the adultery; she does not defend it. She explains why it was Lancelot and not Arthur: because Arthur is unlivable, and she needed to breathe. The confession is, at the same time, an accusation of what the ideal-sovereign costs those close to him.

Readers then and now have found this passage uncomfortable for different reasons. Victorian readers who held the cycle's stated frame found the critique of Arthur difficult to assimilate (Arthur is not supposed to be airless; he is supposed to be exemplary). Modern readers who resist the stated frame often find this passage the idyll's deepest moment of practice-exceeding-frame (Guinevere articulates something the frame cannot contain). Both responses are legitimate. The passage is doing more than the frame can hold.

*Mine, O mine the sin! / O mine, the shame! Yea, mine, who here should lie.* This is the self-recriminating register. Guinevere takes the whole responsibility — for the sin, for the shame, for the ruin — onto herself. She does not excuse herself; she does not offer mitigating circumstances; she claims ownership of the fall as entirely her own. *Yea, mine, who here should lie* — the "lie" being the prostration of repentance she performs in the next passage.

Hold both registers together. Guinevere in the idyll articulates a *real critique* of the ideal-sovereign ideal (the airless light) *and* a *real self-judgment* (mine, the sin). She is not simply a victim of unlivable perfection; she is not simply a penitent; she is a woman capable of both understandings at once. Tennyson's psychological achievement is that he writes her as able to hold both positions. This is among the most humane portraits of a fallen woman in Victorian verse — not because she is excused, but because she is recognizably whole.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 4. Arthur's arrival ────────────────────────────────────────
  {
    id: "iotk-guin-arthur-arrives",
    bookId: "idylls-of-the-king",
    chapterNumber: 11,
    anchorText: "the King",
    anchorOccurrence: 5,
    title: "Arthur arrives at Almesbury — the confrontation Malory does not stage",
    quotedPassage:
      "\"Then came a flash of the great armies—voices / Rolling like thunder past the castle walls— / And as she started up, her shadow fell / Across the little holy house; and then / She heard him enter—the King himself—alone—\"",
    passageReference: "Guinevere, lines 410–440 (approx.) · IotK XI.410–40",
    commentary: `Arthur's arrival at Almesbury is, structurally, Tennyson's single most consequential departure from Malory, and the one that generates the idyll's central moral crisis.

In Malory, Arthur and Guinevere *never meet again* after her flight. Malory's account (Book XXI.9–11) has Arthur die at the last battle while Guinevere is at Almesbury; he sends Lancelot, much later, to see her one final time; she refuses to see Lancelot; they both die in religious retirement separately. The two never confront each other after the adultery becomes public. Malory's Guinevere is never forgiven-with-judgment by her husband because her husband dies first.

Tennyson invents this scene. Arthur rides to Almesbury before going west to the last battle. He enters the nunnery alone. Guinevere is prostrate. He speaks for roughly 150 lines — the longest single speech in the cycle — and he forgives her while judging her. Then he leaves, rides west, dies at the last battle (in "The Passing of Arthur"). Guinevere lives on as abbess.

This invented scene is the idyll's core, and it is the cycle's most morally contested passage. The invention changes everything. A cycle in which husband and wife never meet again after the fall is one kind of moral tragedy (Malory's); a cycle in which the husband delivers a long speech of forgiveness-with-judgment and then rides to his death is a different kind (Tennyson's). Tennyson's version foregrounds Arthur's verbal response to the fall; Malory's foregrounds the irreversibility of what has happened.

Why did Tennyson invent the scene? Three likely reasons:

1. **The cycle's moral frame requires a reckoning.** If the Dedication frames Arthur as ideal sovereignty and Guinevere as the flesh that unmade him, the cycle needs a scene in which the two meet and that unmaking is named. Malory doesn't give it. Tennyson makes it.

2. **Victorian narrative requires confrontation.** The novel-reading Victorian audience expected scenes of direct moral reckoning between characters. A cycle in which Arthur and Guinevere simply never meet again would have felt, in 1859, incomplete.

3. **The scene allows Tennyson to articulate the cycle's moral position directly.** Arthur's speech is (essentially) the cycle's own argument, given in the mouth of the cycle's moral center. Whether or not this was a wise move is the critical question — but it makes the cycle's moral frame speak out loud.

The invention is load-bearing. It is also where Tennyson becomes vulnerable to criticism. Malory's Guinevere retains a certain political-spiritual independence to the end (she becomes Abbess of Almesbury on her own authority); Tennyson's Guinevere, domesticated by Arthur's invented visit, becomes a penitent receiving judgment. The shift is noticeable and has been the focus of feminist critique since the late twentieth century.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Malory's account (XX.9–XXI.11) has Arthur and Guinevere never meet again after her flight. Tennyson's invention of the confrontation at Almesbury is the idyll's most consequential departure from its source, and the one that most changes what kind of tragedy the cycle becomes.",
        workTitle: "Le Morte d'Arthur",
        workAuthor: "Sir Thomas Malory",
        passageReference: "Books XX.9–XXI.11",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  // ── 5. Arthur's speech — opening ────────────────────────────────
  {
    id: "iotk-guin-arthur-speech-open",
    bookId: "idylls-of-the-king",
    chapterNumber: 11,
    anchorText: "Liest thou here so low",
    anchorOccurrence: 1,
    title: "\"Liest thou here so low\" — Arthur's opening address",
    quotedPassage:
      "\"Liest thou here so low, the child of one / I honoured, happy, dead before thy shame? / Well is it that no child is born of thee. / The children born of thee are sword and fire, / Red ruin, and the breaking up of laws.\"",
    passageReference: "Guinevere, lines 422–440 (approx.) · IotK XI.422–40",
    commentary: `This is the opening of Arthur's long speech. It is also, for many readers, the passage where the speech first becomes morally difficult.

Parse the lines carefully:

*Liest thou here so low.* Arthur finds Guinevere on the floor in prostration. The image is biblical — the sinner prostrate before judgment — and the direct question is, grammatically, a rhetorical address to her position. Read innocently, this is Arthur acknowledging her state.

*The child of one I honoured, happy, dead before thy shame.* Arthur invokes Guinevere's father, Leodogran (of the first idyll), who is now dead and thus spared seeing Guinevere's shame. This is a painful invocation — Guinevere's father is summoned as a witness to her fall, in absentia, to deepen her shame — and it is not a gesture the modern reader is likely to applaud. Using a dead parent as reproach is rhetorically severe.

*Well is it that no child is born of thee. / The children born of thee are sword and fire, / Red ruin, and the breaking up of laws.* This is the speech's most quoted and most controversial formulation. Arthur says it is *well* that Guinevere has no biological children (she and Arthur had none in the cycle), because her *children* are figurative: *sword and fire*, *red ruin*, *the breaking up of laws* — the civilizational ruin that the adultery has produced.

Three readings of this formula are available:

1. **The punitive reading.** Arthur is expressing relief that Guinevere has no biological children *because she would have corrupted them* — she who has corrupted the realm. He is using her childlessness as another rod. Many modern readers find this straightforwardly cruel.

2. **The tragic reading.** Arthur is pointing out, elegiacally, that the consequence of Guinevere's action has been civilizational ruin — not because Guinevere intended it but because that is what the adultery has produced. The figure is less blame than diagnosis: this is what your action has yielded, whether you willed it or not.

3. **The theological-patriarchal reading.** Arthur is inhabiting the patriarchal-Christian framework in which a queen's infidelity is structurally a civilizational crime; the *children* of that infidelity are necessarily civic ruin. He is speaking the cycle's stated frame. Under that frame, his words are coherent, if also alien to modern moral intuition.

The reader can hold any of these readings or, more honestly, all three. The passage's force — and its critical controversy — comes from how it weighs the first two. Even sympathetic Victorian readers (Hallam Tennyson, in his Memoir of his father, records his father's ambivalence about how to feel about this passage) found it at the difficult edge. Modern readers more often find it over the edge.

The annotation does not take a side. It names the range, and flags that this is where the cycle's practice hardens into its stated frame most tightly.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 6. Arthur's speech — the ideal and its loss ────────────────
  {
    id: "iotk-guin-arthur-speech-ideal",
    bookId: "idylls-of-the-king",
    chapterNumber: 11,
    anchorText: "I made them lay their hands in mine and swear",
    anchorOccurrence: 1,
    title: "\"I made them lay their hands in mine and swear\" — Arthur's lament for the Round Table",
    quotedPassage:
      "\"I made them lay their hands in mine and swear / To reverence the King, as if he were / Their conscience, and their conscience as their King, / … / To love one maiden only, cleave to her, / And worship her by years of noble deeds, / Until they won her; for indeed I knew / Of no more subtle master under heaven / Than is the maiden passion for a maid, / Not only to keep down the base in man, / But teach high thought, and amiable words / And courtliness, and the desire of fame, / And love of truth, and all that makes a man.\"",
    passageReference: "Guinevere, lines 464–485 · IotK XI.464–85",
    commentary: `Arthur's articulation of the Round Table oath is the cycle's fullest statement of its own stated moral vision. This is the passage Tennyson quoted from, in the Dedication, to describe Albert (the four-line excerpt *Who reverenced his conscience as his king* etc., in the Dedication, is from approximately here).

Read the passage as Arthur's genuine articulation of the chivalric vision. *Conscience-as-King*: the knight's internalized moral law is his sovereign, and the actual king is the visible type of that internalized conscience. *Love one maiden only, cleave to her, and worship her by years of noble deeds, until they won her*: courtly love made the moral school in which a young knight learned high thought, noble speech, courtliness, desire of fame, love of truth — the whole Victorian-chivalric catalog of virtues.

The passage is Arthur's belief. He is not being rhetorical here; he is stating, directly, the principle on which the Round Table was founded and which the adultery has broken. This is important. Arthur is not inventing a retroactive moral scheme to condemn Guinevere; he is describing the moral scheme he actually built.

The critical question is whether the scheme itself is viable. Some of the strongest twentieth-century readings of the Idylls have argued that the Round Table ideal was itself unsustainable — that *love one maiden only until you win her* is a dysfunction disguised as an ideal, that the structural dependence of public virtue on private sexual fidelity is a frame that cannot support real human complexity. Guinevere's earlier self-exposition — *I could not breathe in that fine air* — makes exactly this case from the inside.

Read the two passages together. Arthur's articulation of the ideal (this annotation) and Guinevere's articulation of why the ideal was unlivable (annotation 3) are the idyll's dialectical pair. Tennyson gives both. Which one the cycle ultimately favors is not resolved. The Round Table ideal is articulated in its full beauty; its human cost is articulated by the person it cost. The reader carries both.

Notice also the aphorism *teach high thought, and amiable words / And courtliness, and the desire of fame, / And love of truth, and all that makes a man.* These are the civic virtues Victorian culture prized, and Arthur is arguing they depend on the chivalric-sexual discipline of one-maiden-fidelity. It is an argument about how character is formed. Whether one agrees or not, the argument is serious; it is not window-dressing. Tennyson is making, in Arthur's voice, a real case for the connection between sexual fidelity and public virtue, and the case is tighter than Victorian cliché. The modern reader who dismisses the argument without engaging it has missed what the idyll is really doing.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The passage Tennyson quotes from in the Dedication (\"Who reverenced his conscience as his king; / Whose glory was, redressing human wrong…\") is excerpted from approximately these lines. The Dedication's self-quotation binds Arthur's vision here to Albert's memory; the cycle's frame is closed by this link.",
        workTitle: "Idylls of the King — Dedication",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Dedication, lines 6–13",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 0,
        targetAnchorText: "Who reverenced his conscience as his king",
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 7. Arthur's forgiveness ─────────────────────────────────────
  {
    id: "iotk-guin-arthur-forgives",
    bookId: "idylls-of-the-king",
    chapterNumber: 11,
    anchorText: "I forgive thee",
    anchorOccurrence: 1,
    title: "\"I forgive thee, as Eternal God forgives\" — forgiveness and the range of responses",
    quotedPassage:
      "\"Lo! I forgive thee, as Eternal God / Forgives: do thou for thine own soul the rest. / But how to take last leave of all I loved? / O golden hair, with which I used to play / Not knowing! O imperial-moulded form, / And beauty such as never woman wore, / Until it came a kingdom's curse with thee— / I cannot take thy hand; that too is flesh, / And in the flesh thou hast sinned.\"",
    passageReference: "Guinevere, lines 541–570 (approx.) · IotK XI.541–70",
    commentary: `This is the speech's climactic moment, and the passage around which the critical debate turns. Arthur forgives Guinevere, *as Eternal God forgives*, and then immediately names what he cannot do: take her hand, which is flesh, and in the flesh she has sinned. The grammatical structure — forgiveness given / intimacy withheld — is the exact shape of what has struck some readers as contradictory and others as honestly mixed.

*I forgive thee.* The forgiveness is plain. It is offered unreservedly. It is compared to divine forgiveness — which, in Christian theology, is unconditional. Arthur is performing his spiritual duty toward a fallen soul: the sovereign-as-moral-type is required to forgive.

*Do thou for thine own soul the rest.* The soul's work — the ongoing repentance, sanctification, reconciliation — is Guinevere's. Arthur cannot do it for her. This is, again, theologically sound and pastoral.

*But how to take last leave of all I loved?* Here the tone shifts. Arthur's interior emerges: he is addressing Guinevere as someone he has loved. *O golden hair, with which I used to play not knowing!* is specifically personal — the married husband's intimate memory of casual tenderness. *Imperial-moulded form, and beauty such as never woman wore* is the courtly register; he praises her. Then, *until it came a kingdom's curse with thee*, the register changes again: her beauty, which was royal-perfect, has become the kingdom's doom.

*I cannot take thy hand; that too is flesh, / And in the flesh thou hast sinned.* The refusal of physical contact is the speech's most difficult gesture. Arthur will forgive *as Eternal God forgives*, but he will not take her hand. The refusal is explained — *that too is flesh, and in the flesh thou hast sinned* — and the explanation is rigorously theological (the sin is in the flesh; the flesh remains the site of the sin). But the effect is to make the forgiveness abstract and the judgment concrete. Forgiveness is offered at the highest abstraction (divine); intimacy is refused at the simplest human level (a hand).

The critical debate has long centered on this passage. Readers in the Victorian moment generally found it moving — Arthur shows the true Christian pattern of forgiving-the-sinner-while-hating-the-sin. Readers in the later twentieth century and beyond have more often found it troubling: the forgiveness is rhetorical; the withheld contact is what actually registers. A man forgiving his wife on condition of never touching her again is, in modern moral intuition, not fully forgiving her.

The annotation will not arbitrate. It will name the range, and note that the question is the idyll's central moral crux.

What to hold alongside: Arthur's condition here. He is about to ride west to his own death. This is his last conversation with his wife. He has been betrayed publicly and the kingdom has fallen. Under these circumstances, that he gives forgiveness at all — however stained — is remarkable. A person less spiritually disciplined than Arthur would, in his position, accuse and leave. Arthur forgives and leaves. The forgiveness may be imperfect; the attempt at forgiveness is real.

Read the whole passage, and the whole long speech, as neither villain nor saint. Arthur is doing what Arthur can do, at the end of his reign, with the woman he still loves and who has broken the world he made. His response is neither fully adequate nor fully inadequate; it is what a morally serious man in his position can achieve. That it falls short of modern ideals of spousal forgiveness is the tragedy the idyll both stages and acknowledges.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 8. Arthur's departure ───────────────────────────────────────
  {
    id: "iotk-guin-arthur-departs",
    bookId: "idylls-of-the-king",
    chapterNumber: 11,
    anchorText: "rode, an hour or maybe twain",
    anchorOccurrence: 1,
    title: "Arthur's departure — rhythm and caesura",
    quotedPassage:
      "\"And so the King rode on, / And ever as he went, the lady's weeping followed him: / He turned, but would not weep, / Rode silent, with a long averted face / Toward the coming fight…\"",
    passageReference: "Guinevere, lines 594–630 (approx.) · IotK XI.594–630",
    commentary: `Arthur's departure from Almesbury is one of Tennyson's most deliberate rhythmic passages, and one of the curated sound-passages the prosody panel flags.

The passage works by medial caesurae. Read aloud: *And so the King | rode on, / And ever as he went, | the lady's weeping | followed him: / He turned, | but would not weep, / Rode silent, | with a long averted face / Toward the coming fight.* The pentameter is continually broken by internal pauses — one to four per line — and the effect is of the horse's slow, halting walk, each pause a moment where Arthur almost looks back.

*The lady's weeping followed him.* This is extraordinary prosody. The subject *weeping* (a sound-verb) is given the sentence's main verb (*followed*); the sound travels with him as he rides. The weeping is not something that happens at Almesbury while Arthur goes elsewhere; the weeping is *with him*, sonically attached to his retreat.

*He turned, but would not weep.* The shortest line in the passage, and the most emotionally condensed. Arthur is capable of weeping — he was, earlier in the speech, genuinely wounded — but he refuses the weeping in this moment, because weeping is not what the sovereign riding to his last battle can afford. The compression of the line enacts the compression of the emotion.

*Rode silent, with a long averted face / Toward the coming fight.* The departure becomes a turning-forward. Arthur's face is *averted* — literally, turned away — from Guinevere and toward the fight that will kill him. The idyll's scene is closing; the next idyll ("The Passing of Arthur") will take the reader with him into that fight.

The whole passage is among Tennyson's most technically accomplished in the cycle. It is also among his most emotionally restrained. A lesser poet would have underlined the grief; Tennyson uses prosody and caesura to *enact* the grief without naming it. The reader hears the horse's uneven walk, the attached weeping, the refused tears, the averted face — and these physical-acoustic images carry the full weight of what cannot be stated.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The \"averted face / Toward the coming fight\" links directly forward to the opening of \"The Passing of Arthur\" (Idyll XII), where Arthur is found on the march west. The two idylls are continuous; reading them as a single movement (the confrontation at Almesbury, the ride west, the last battle, the Avalon passage) is one of the cycle's most architecturally complete passages.",
        workTitle: "Idylls of the King — The Passing of Arthur",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Passing of Arthur, opening",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 12,
        targetAnchorText: "That story which the bold Sir Bedivere",
      },
    ],
    tags: ["linguistic", "literary-influence"],
  },

  // ── 9. Guinevere's recognition ──────────────────────────────────
  {
    id: "iotk-guin-recognition",
    bookId: "idylls-of-the-king",
    chapterNumber: 11,
    anchorText: "now I see thee what thou art",
    anchorOccurrence: 1,
    title: "Guinevere's recognition — \"Now I see thee what thou art\"",
    quotedPassage:
      "\"Now I see thee what thou art— / Thou art the highest, and most human too— / Not Lancelot, nor another. Ah, my God, / What might I have made of thee, / Had I but loved thy highest creature here?\"",
    passageReference: "Guinevere, lines 644–665 (approx.) · IotK XI.644–65",
    commentary: `After Arthur has left, Guinevere speaks her recognition of him. This is the idyll's moral peripeteia — the moment when Guinevere sees, fully, what she had in Arthur and what she forfeited.

*Now I see thee what thou art— / Thou art the highest, and most human too.* This is the key line. Tennyson gives Guinevere the understanding that Arthur was not (as she had earlier articulated, in the *I could not breathe* passage) merely *pure severity of perfect light* — he was also, simultaneously, *most human*. The earlier complaint — that Arthur's ideality was unlivable — is here revised. Arthur is the highest-and-human at once; her failure was not to perceive the *and-human*.

*What might I have made of thee, / Had I but loved thy highest creature here?* The counterfactual. If she had loved Arthur as she ought to have, she might have been the partner of a different history — not the agent of civilizational ruin, but the companion of the sovereign. The might-have-been is the deepest form of her grief.

This passage is the idyll's most poignant moment for Guinevere, and it is important to balance with the earlier self-exculpating passages. Earlier, she articulated why she chose Lancelot; here, she revises that reading in the light of Arthur's actual person. She is not switching positions in bad faith; she is seeing clearly for the first time after the confrontation that has occasioned the clarity. The idyll's psychological realism depends on this revision being possible. Tennyson is arguing that self-understanding can shift under the pressure of real encounter; that Guinevere, post-confrontation, understands Arthur differently than she did pre-confrontation; that this is what people are like.

The recognition also *completes* the moral scheme the stated frame required. Tennyson has his frame: Guinevere's adultery unmade the realm; the cycle is the working-out of that unmaking; Guinevere in her own idyll recognizes and repents. The Victorian reading public needed this moral completion, and Tennyson provides it. But he provides it through the psychological route of *real recognition*, not the ideological route of *didactic rebuke*. The frame closes here because Guinevere herself closes it, in her own voice, not because the poem forces it on her.

This is an important distinction. Many nineteenth-century moral poems about fallen women force the moral closure through rebuke — the narrator condemns, the woman suffers, the lesson is complete. Tennyson does not do this. His Guinevere recognizes Arthur on her own and closes the frame from inside. The difference is what saves the idyll from didacticism.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 10. Guinevere becomes Abbess (diminished from Malory) ───────
  {
    id: "iotk-guin-abbess",
    bookId: "idylls-of-the-king",
    chapterNumber: 11,
    anchorText: "chosen Abbess",
    anchorOccurrence: 1,
    title: "Guinevere as Abbess — the Malory departure and its feminist reading",
    quotedPassage:
      "\"So she came to be / A nun, and reverenced by all the sisters, / And at length was made Abbess— / … / And lived in peace.\"",
    passageReference: "Guinevere, lines 685–698 (approx.) · IotK XI.685–98",
    commentary: `The idyll closes with Guinevere's entry into the nunnery's full community and, eventually, her elevation to abbess. Malory's account (XXI.7) is similar in outline — Guinevere lives her remaining years at Almesbury and dies as abbess — but the two versions differ in tone and emphasis, and the difference is feminist-critically consequential.

Malory's Guinevere becomes abbess on her own authority. She takes religious life as her own final choice; the position of abbess is one of genuine spiritual authority; she refuses a final meeting with Lancelot on her own terms, and dies in a spiritual position she has achieved. Malory's account, compressed as it is, preserves Guinevere's agency-at-the-end.

Tennyson's Guinevere becomes abbess in the penultimate sentence of the idyll, almost incidentally, after the idyll's emotional center has been the scene of her confrontation with Arthur. The abbess-position is *reported* rather than *developed*. Her spiritual authority is real but muted — she is *reverenced by all the sisters*, *at length made Abbess*, *lived in peace*. The tone is closural, summarizing, without the spiritual-political weight Malory gave.

The feminist critique of this difference (established in the late twentieth century — see Ann Howey, Alison Stone, and others on Victorian Arthurianism and gender) is that Tennyson's idyll domesticates Guinevere. The Malory figure who wielded genuine spiritual authority becomes, in Tennyson, a figure primarily defined by her penitence and her deference to the ideal-sovereign husband. Her agency at the end is reduced to peace-in-the-cloister, not abbess-by-her-own-authority.

The critique is fair, and it is part of honest reading to name it. The Victorian gender frame that made this domestication available (the "woman question" debates of the 1860s, the Matrimonial Causes Act of 1857, the contested status of women's autonomy generally) is visible in the idyll's handling of its protagonist. Tennyson's Guinevere cannot, in the frame of the cycle, be given Malory's full spiritual authority — because the cycle's stated reading requires her to be the penitent flesh, not the self-authorizing abbess.

And yet. Two complications of the feminist critique:

1. **The idyll's humane psychological writing** (the novice-scene, the interior monologues, the recognition) gives Guinevere a consciousness and dignity that exceed what the frame requires. The final summary is diminished from Malory; the psychological body of the idyll is richer than Malory. The two readings need to be held together.

2. **The frame is legible.** Tennyson's choice to domesticate Guinevere is not invisible in the idyll; any reader attuned to the Malory-departure can see it, and Tennyson himself (in the Dedication's stated frame) has told the reader what he is doing. The idyll does not hide its moral structure; it displays it. Modern readers who disagree with the frame can argue with it, because the frame is there to be argued with. This is, in its way, honest. A poem that hid its moral scheme would be harder to critique; a poem that names its scheme invites the critique.

Read the ending, then, as the cycle's moral frame closing tightly around a figure the idyll's practice has given a richer life than the frame can quite contain. The closing is the frame; the body of the idyll is the life. Both are Tennyson. Both are the Victorian Guinevere.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Malory's Guinevere becomes Abbess of Almesbury on her own authority (XXI.7), retains spiritual independence to the end, and refuses Lancelot's final visit on her own terms. Tennyson's Guinevere is abbess-but-diminished — a figure reported rather than developed. The feminist critique of this departure has been an important twentieth- and twenty-first-century reading.",
        workTitle: "Le Morte d'Arthur",
        workAuthor: "Sir Thomas Malory",
        passageReference: "Book XXI.7",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical", "philosophical"],
  },

  // ── 11. The "woman question" and Victorian context ──────────────
  {
    id: "iotk-guin-woman-question",
    bookId: "idylls-of-the-king",
    chapterNumber: 11,
    anchorText: "voluptuous day",
    anchorOccurrence: 1,
    title: "The idyll and the Victorian \"woman question\"",
    quotedPassage:
      "(Cross-idyll context — the idyll's larger frame and reception)",
    passageReference: "Guinevere (idyll-level context)",
    commentary: `This annotation is an idyll-level context-note rather than a line-specific gloss. It is placed here because the Guinevere idyll is the cycle's most directly engaged with the Victorian "woman question," and a full reading of the idyll requires the context.

The "woman question" was the contemporaneous debate, active throughout the Idylls' composition (1859–85), about women's legal, political, educational, and sexual autonomy. Key milestones:

- **Matrimonial Causes Act 1857**: liberalized divorce law in England, permitting civil divorce and specifying (asymmetrically) that a woman's adultery alone was sufficient grounds for a husband, while a man's adultery required additional cruelty/desertion.
- **John Stuart Mill, *The Subjection of Women*** (composed 1861, published 1869): the most influential liberal-feminist argument of the period, making the case for women's full political and economic equality.
- **Florence Nightingale**'s *Cassandra* (written 1852, privately circulated, published posthumously 1928): a fierce critique of Victorian domestic confinement for educated women.
- **Married Women's Property Acts** (1870, 1882): gradually restored property rights women had lost upon marriage.
- **Harriet Taylor Mill / Harriet Martineau**: public-intellectual women contesting the "separate spheres" ideology.

Tennyson was aware of these debates. He was friends with intellectual figures across the spectrum (F. D. Maurice, the Cambridge Apostles, Henry Sidgwick); his wife Emily was a reader of feminist-adjacent writers. Victoria herself wrote privately (1870) that "this mad, wicked folly of Woman's Rights" should be "whipped" out of its advocates — a view many Victorians held, and one Tennyson broadly shared in practice while remaining more sympathetic in tone.

The Guinevere idyll sits inside this debate. Its handling of its protagonist — the forgiveness-with-judgment, the domesticated-Abbess ending, the refusal of Malory's Guinevere's independent spiritual authority — is legible as a specifically Victorian-gendered treatment. Where Malory's Guinevere is a Catholic-medieval figure with her own spiritual standing, Tennyson's Guinevere is a Victorian-Protestant figure defined by her relation to her husband and by her penitence.

This is not to say Tennyson is simply anti-feminist. His psychological sympathy for Guinevere — the novice-scene, the interior monologues, the recognition — exceeds what the gender frame of 1859 required. He wrote her as a whole person, not as a sermon; a woman whose love for Lancelot was real and for whom Arthur's ideality was genuinely difficult. This is more humane than many contemporaneous Victorian treatments of fallen women (compare Mrs. Henry Wood's *East Lynne*, 1861, which is closer to a cautionary tale).

But the idyll also closes down the psychological complexity into a closural moral frame that is recognizably the frame Victorian culture provided for women in Guinevere's structural position. The idyll participates in, and is to some degree shaped by, the period's gender ideology.

Twentieth- and twenty-first-century feminist readings of the idyll have been among the most productive critical engagements with the cycle. Readers such as Carol T. Christ, Nicola Thompson, Ann Howey, and more recently post-secular and feminist-theological readers have argued that Tennyson's practice (in the psychological body of the idyll) opens a space his stated frame closes. Reading the idyll this way — the humane practice straining against the moral frame — is the most productive modern approach.

None of this is a reason to dismiss the idyll. It is, rather, the context in which to read it honestly. Tennyson was a Victorian writing for Victorians; the idyll is inside its gender frame; the frame is argued with, inside the idyll itself, by the idyll's own psychological writing. Read the tension; do not erase either side.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },

  // ── 12. Honest reading — the cycle's hardest passage ────────────
  {
    id: "iotk-guin-honest-reading",
    bookId: "idylls-of-the-king",
    chapterNumber: 11,
    anchorText: "beyond these voices there is peace",
    anchorOccurrence: 1,
    title: "How to read the idyll — neither villain nor saint",
    quotedPassage:
      "(Idyll-level reading guidance)",
    passageReference: "Guinevere (reading frame)",
    commentary: `This annotation steps back from the text to suggest how the idyll can be read honestly — because it is the cycle's hardest passage, and an untutored reading will likely push into one of the readings the idyll actually holds in tension.

The three least helpful readings of "Guinevere":

1. **The pious-Victorian reading.** Arthur is an ideal sovereign; Guinevere's adultery is the kingdom's doom; her penitence is the moral resolution; the idyll teaches the connection between private virtue and public order. This reading gives Tennyson's stated frame total authority. It was the reading Hallam Tennyson (the poet's son) gave in his 1897 Memoir, and much Victorian criticism. Its problem: it flattens the idyll's psychological body into its moral frame, erases Guinevere's real critique of Arthur's unlivable perfection, and treats the closural ending as if it were the idyll's whole argument.

2. **The strict feminist-rejection reading.** Arthur's speech is unforgivable paternalism; the forgiveness-with-judgment is cruelty in rhetorical disguise; Guinevere's recognition is forced by the poet; the idyll is a patriarchal document whose moral frame cannot be recovered. This reading gives Guinevere's interior humanity no weight against the ideological frame. Its problem: it treats the idyll as a pure ideological artifact, erases the genuinely moving psychological writing, and refuses Tennyson any sympathy for his protagonist that the text clearly contains.

3. **The dismissive-modernist reading.** The idyll is Victorian kitsch — overwrought, moralizing, gender-stereotyped, not worth serious attention. This reading is simply lazy. The idyll contains some of Tennyson's best writing; its moral problems are real but are the problems of a serious poem, not the embarrassments of a bad one.

The honest reading, and the one the annotations across this idyll have been attempting, is what I would call the *tension reading*:

- Take the idyll's moral frame seriously as what Tennyson believed and argued.
- Take the idyll's psychological practice seriously as what exceeds the frame in ways the frame cannot quite contain.
- Notice the specific Malory-departures and what they do (domesticating the Guinevere figure).
- Notice the specific places where the frame hardens (Arthur's *children are sword and fire*, the refused hand) and the specific places where the practice softens the frame (the novice-scene, *I could not breathe in that fine air*, *now I see thee what thou art*).
- Do not resolve the tension. Hold the idyll as a contested text.

Above all: *do not flatten Guinevere*. Her consciousness is the idyll's largest and most sustained achievement. Whatever judgment the frame places on her, the psychological body of the idyll has given her a whole life, a capacity for genuine critique and genuine recognition, a voice that sounds like a person rather than a moral type. The idyll's humanity toward her exceeds its frame's condemnation of her. This is the truth about the idyll that Victorian readers who wanted moral closure underread and that modernist readers who wanted moral rejection overread. The truth is in the middle, which is the harder place to stand but the true one.

Read, in summary, for the whole idyll: the frame and the practice, the moral scheme and the human cost, Arthur's sincerity and the difficulty of his speech, Guinevere's wrong and Guinevere's whole self. *Liest thou here so low* is not the idyll's last word. *Now I see thee what thou art, thou art the highest, and most human too* is closer. But neither is the whole. The whole is the tension between them, and that tension is the idyll.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },
]
