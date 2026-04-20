import type { Annotation } from "../types"

// ── Idylls of the King: Balin and Balan (Idyll V) ──────────────────
// Tennyson's latest-composed major idyll (1885, published in the
// final collected edition). 5,029 words. Added specifically to
// thicken the corruption-sequence leading to "Merlin and Vivien"
// (Idyll VI). The tragedy of brother-knights who kill each other
// unknowing. Malory II.1–19 source (Balin le Savage); Tennyson
// significantly restructures, most crucially by introducing Vivien
// as the idyll's moral solvent.
//
// Density: 10 annotations.

export const IOTK_BALIN_AND_BALAN: Annotation[] = [
  {
    id: "iotk-bb-opening",
    bookId: "idylls-of-the-king",
    chapterNumber: 5,
    anchorText: "Pellam the King",
    anchorOccurrence: 1,
    title: "\"Pellam the King\" — the idyll opens on political tribute",
    quotedPassage: "Pellam the King, who held and lost with Lot / In that first war, and had his realm restored / But rendered tributary, failed of late / To send his tribute…",
    passageReference: "Balin and Balan, lines 1–4 · IotK V.1–4",
    commentary: `The idyll opens abruptly in political-administrative register — a king failing to send tribute, Arthur's treasurer dispatched to collect. The opening is the driest in the entire cycle; no landscape, no character-introduction, just fiscal-sovereign mechanics. Tennyson is doing this deliberately.

This is the latest-composed idyll (1885), written specifically to fill a structural gap in the cycle. Arthur's kingdom has been established (Idyll I), its successful early domestic life has been shown (Gareth, Geraint/Enid), and the next large action will be the seduction of Merlin by Vivien (Idyll VI) and the catastrophic corruption that follows. Tennyson needed a transition-idyll that would begin to introduce the corruption-forces without yet bringing them to full power. Balin and Balan does that job.

The dry opening is part of the design. The cycle is entering its darker phase; the register cools; the bright-morning tonal work of *Gareth and Lynette* is over. From here on, every idyll's opening will be heavier than the one before — until the mist-obscured battle of *The Passing of Arthur*. Balin's idyll is the first cooling.

*Pellam the King* is a minor figure (in Malory, he is the wounded Grail-king of Corbenic, though Tennyson does not develop the Grail-king dimension here). The political setup — tribute unpaid, authority to be enforced — is the idyll's pretext for sending Balin and his brother into the journey that will destroy them. The opening's flatness is the key.`,
    crossReferences: [],
    tags: ["literary-influence", "historical"],
  },

  {
    id: "iotk-bb-1885-addition",
    bookId: "idylls-of-the-king",
    chapterNumber: 5,
    anchorText: "Balin and Balan sitting statuelike",
    anchorOccurrence: 1,
    title: "The brothers at the spring — Tennyson's 1885 introduction",
    quotedPassage: "\"Balin and Balan sitting statuelike, / Brethren, to right and left the spring…\"",
    passageReference: "Balin and Balan, brothers-at-spring opening scene",
    commentary: `Arthur's treasurer, on the road, comes upon Balin and Balan sitting by a spring — the two knights Arthur had exiled from court three years earlier for Balin's violent outburst. They sit *statuelike*, *brethren to right and left the spring* — a Wordsworthian pictorial image, stillness in the landscape, the pair before their reintegration.

This opening-composition is one of Tennyson's last major narrative constructions. The 1885 composition-date is important for reading the idyll: Tennyson was 76, working on the cycle's final form, filling in structural gaps. The idyll is therefore the *oldest poet's* handling of brotherhood-and-tragedy, and the register is accordingly grave — closer to the late style of *The Passing of Arthur* (also 1869/1885) than to the earlier middle-cycle idylls.

The brothers' backstory is introduced quickly: Balin's *savage* mood caused violence at court; both were exiled; now Arthur welcomes them back, gives Balin the honor-name *Balin the Savage* (as a reminder, not a celebration), and Balin vows to reform himself by following the example of Lancelot, whom he especially admires. The reform-plan is the idyll's tragic hope. Balin wants to change; he has a model; he will try. Everything that follows is the collapse of that trying.

Tennyson's structural move — the 1885 idyll that adds the brothers to the cycle — is worth honoring. Without this idyll, the corruption-sequence would begin directly with Merlin and Vivien. Balin and Balan soften the transition, making the collapse feel more like a slow fall than a sudden calamity. The older poet knew the cycle needed this.`,
    crossReferences: [],
    tags: ["literary-influence", "historical"],
  },

  {
    id: "iotk-bb-malory-departure",
    bookId: "idylls-of-the-king",
    chapterNumber: 5,
    anchorText: "addition thine",
    anchorOccurrence: 1,
    title: "\"Balin the Savage\" — Tennyson's reshaping of Malory",
    quotedPassage: "\"'Savage' —that addition thine — / My brother and my better, this man here, Balan…\"",
    passageReference: "Balin and Balan, Balin's name-speech",
    commentary: `Tennyson's idyll compresses and reshapes Malory's long *Tale of Balin le Savage* (Book II, 19 chapters). The Malory tale includes the sword-gift-and-curse sequence, the Dolorous Stroke of the wounded Pellam with the sacred spear, the madness and pursuit that destroy multiple knights, and the eventual fatal combat of Balin and Balan in the courtyard of a mysterious castle where they unknowingly fight each other.

Tennyson keeps the closing fatal-combat (the brothers killing each other unrecognizing) but omits almost everything else. The Dolorous Stroke — Malory's most mythically loaded moment, the sacred spear of Longinus piercing the Grail-king — is gone entirely. Balin's role as the inadvertent destroyer of multiple knights' lives is compressed. The sacred-violence dimension is stripped out.

In its place, Tennyson adds: the reform-plan (Balin trying to become Lancelot), the Lancelot-Guinevere glimpse that destabilizes him, and — most consequentially — the encounter with Vivien, which is entirely Tennyson's invention and not in Malory at all. The shift is from Malory's sacred-violence tragedy to Tennyson's moral-corruption tragedy. Balin dies in Malory because he cannot escape the sacred consequences of his acts. Balin dies in Tennyson because rumor poisons his capacity for self-trust.

This is the idyll's most load-bearing structural move. The cycle's moral-architecture depends on rumor and misreading as the agents of collapse — not sacred violence. Tennyson's Balin and Balan fits the cycle's frame because it has been rewritten to do so. The source's mythic-Catholic apparatus is set aside; the Victorian-psychological reading replaces it.

Reading Malory II.1–19 and Tennyson's idyll side by side is one of the productive comparison paths. The differences reveal what the 1885 Tennyson needed the Arthurian material to become for the cycle to work.`,
    crossReferences: [
      {
        type: "source",
        description: "Malory's Tale of Balin le Savage (Book II, 19 chapters) is the source. Tennyson preserves the final fratricidal combat but omits the Dolorous Stroke, compresses the madness-sequence, and adds Vivien as the idyll's moral-destabilizer. The Malory-sacred-violence frame is replaced by the Tennyson-moral-corruption frame.",
        workTitle: "Le Morte d'Arthur",
        workAuthor: "Sir Thomas Malory",
        passageReference: "Book II.1–19",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  {
    id: "iotk-bb-lancelot-admiration",
    bookId: "idylls-of-the-king",
    chapterNumber: 5,
    anchorText: "crown-royal upon shield",
    anchorOccurrence: 1,
    title: "The crown-royal shield — Balin's emblem for his reform",
    quotedPassage: "\"…a crown-royal upon shield, / Whereat she smiled and turned her to the King…\"",
    passageReference: "Balin and Balan, Balin's chosen shield-emblem",
    commentary: `Balin, admitted back to court and committed to his reform, asks Guinevere if he may bear her personal emblem on his shield — the crown-royal — as a sign of his devotion to chivalric virtue through the queen's example. Guinevere permits it. The shield becomes Balin's pattern: he will be loyal, courteous, brave, as a knight-devotee of the queen's ideal.

This is Tennyson's invention (not in Malory) and structurally load-bearing. The reform-plan's central symbol is the queen's emblem. When Balin later glimpses Lancelot and Guinevere in apparent intimacy in the garden (the scene that shatters his reform), the shattering is a specifically *visual-symbolic* one — his shield-emblem is revealed as false because its source is adulterous. He cannot continue to bear the emblem of a queen who is herself not what he thought.

Three readings:

1. **The reform-model collapsing.** Balin's chosen pattern of virtue is the queen's example. When the example is revealed (or rumored) as flawed, the reform has no foundation. The idyll's specific argument is that chivalric virtue depends on the visible moral integrity of those it takes as models; when models fail, imitators fall.

2. **The crown-royal as inadvertent Grail-token.** The shield-emblem echoes, at low volume, the Grail-crown imagery of Idyll VIII (the sacred crown associated with the Grail-king at Corbenic). Tennyson does not develop this, but the faint resonance is there — Balin's shield is a sub-Grail token, a private emblem that points toward the larger Grail-crisis the cycle will soon enact.

3. **The shield as public sign of private devotion.** Medieval heraldic convention: the shield is the knight's identity rendered heraldically. Balin chooses to be a knight *of the queen*, publicly and visibly. His later breaking of the shield (he breaks it against a tree when his reform collapses) is a public renunciation of that identity.`,
    crossReferences: [],
    tags: ["literary-influence", "mythological"],
  },

  {
    id: "iotk-bb-garden-glimpse",
    bookId: "idylls-of-the-king",
    chapterNumber: 5,
    anchorText: "garlandage of flowers",
    anchorOccurrence: 1,
    title: "The garden glimpse — the rumor that unmakes the reform",
    quotedPassage: "\"…garlandage of flowers, / Along the walls and down the board…\"",
    passageReference: "Balin and Balan, garden/banquet scene",
    commentary: `Balin, the night before his reform-tour in Arthur's name, witnesses Lancelot and Guinevere together in an ambiguous moment — a glimpse through a window in the garden, at a banquet-evening, Lancelot and the queen in what appears to be intimate attention. What Balin actually sees is minor (there is no kiss, no explicit act); what he interprets is enough. The court's private-rumor (seeded in Idyll III) becomes, for Balin, private-conviction.

Three things the scene does:

1. **Makes the rumor operational for the first time in the cycle.** Earlier idylls mentioned the rumor; this idyll *enacts* it. A specific character's perception, at a specific moment, is reorganized by what he takes to be visible evidence. The adultery has begun to leave traces, even if those traces are still deniable.

2. **Converts Balin's reform into despair.** If the queen whose emblem he bears is an adulteress, the reform has no ground. The idyll's tragedy is specifically Balin's inability to continue to hope after his visual evidence. Other knights could discount the rumor (Enid does, in Idyll III); Balin cannot.

3. **Sets up the encounter with Vivien.** Balin, already destabilized by what he saw, rides out into the forest. Vivien — about to come into her full role in the next idyll — finds him. His destabilization is her entry-point. The adultery-rumor, the moral-breakdown, the corruption-agent: the cycle is assembling its Merlin-and-Vivien forces.`,
    crossReferences: [
      {
        type: "echo",
        description: "The garden-glimpse operationalizes the Guinevere-Lancelot rumor first seeded in \"The Marriage of Geraint\" (Idyll III, line ~100). The cycle is tracking the rumor's slow transition from private gossip to public-knowledge across multiple idylls; Balin's visual confirmation is a key step.",
        workTitle: "Idylls of the King — The Marriage of Geraint",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Marriage of Geraint, early court-rumor passage",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 3,
        targetAnchorText: "Touching her guilty love for Lancelot",
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  {
    id: "iotk-bb-vivien-appears",
    bookId: "idylls-of-the-king",
    chapterNumber: 5,
    anchorText: "Vivien, with her Squire",
    anchorOccurrence: 1,
    title: "Vivien appears — the cycle's first encounter with her",
    quotedPassage: "\"…Vivien, with her Squire…\"",
    passageReference: "Balin and Balan, Vivien's first appearance",
    commentary: `Vivien enters the cycle here, in Balin and Balan. This is her first appearance; she will dominate Idyll VI completely and will reappear in *Merlin and Vivien* as the cycle's most flattened-villainous character. Her entrance in Balin's idyll is, in a sense, her small-scale rehearsal.

What she does in this idyll: finds the destabilized Balin in the forest, engages him in conversation, plants additional poison-rumors about Guinevere, mocks his crown-royal shield as a false token, and accelerates his breakdown. The encounter is short (perhaps 100 lines) but structurally consequential — Vivien pushes Balin from merely-disturbed to fully-undone. When he leaves her, he smashes the shield against a tree, renouncing his reform. His subsequent violent encounter with Balan (who mistakes him in his savage condition for an attacking stranger) is made possible by this undoing.

Tennyson's introduction of Vivien here is his single most important 1885 move, and it is worth naming what it accomplishes:

1. **It prepares the reader for Idyll VI.** A reader encountering *Merlin and Vivien* cold, without prior Vivien-exposure, would find the character's flattening even more jarring than it already is. Balin's idyll gives Vivien a less-central appearance first; the reader gets to calibrate.

2. **It makes the corruption a spreading phenomenon.** Vivien is not confined to Merlin. She affects knights across the court, radiating moral damage. This is Tennyson's argument: the corruption agent is active, not local.

3. **It gives Balin's tragedy its specific cause.** Without Vivien, Balin's tragedy would be a Malory-style sacred-violence story. With her, his tragedy is a moral-rumor story. Vivien's role converts the idyll from pre-cycle material into cycle-structural material.

The annotations on Vivien in the idylls-level commentary (in Idyll VI's cluster) address the critical consensus that her handling is Tennyson's weakest. Here her appearance is briefer, and the flattening is less severe, because she is not yet centered. This is possibly her best-handled appearance in the cycle — she functions as a plot-catalyst rather than a character-study, and Tennyson is more at ease with her in that role.`,
    crossReferences: [
      {
        type: "echo",
        description: "Vivien's entrance here prepares for her centered-role in Idyll VI (Merlin and Vivien). The critical consensus on her handling is that the flattening in VI is severe; this earlier appearance, where she functions more as plot-catalyst than character-study, is her best-handled scene in the cycle.",
        workTitle: "Idylls of the King — Merlin and Vivien",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Merlin and Vivien (entire idyll)",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 6,
        targetAnchorText: "wily Vivien",
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  {
    id: "iotk-bb-savagery-return",
    bookId: "idylls-of-the-king",
    chapterNumber: 5,
    anchorText: "brother beast",
    anchorOccurrence: 1,
    title: "\"Brother beast\" — the return of the savagery Balin had outgrown",
    quotedPassage: "\"…brother beast, whose anger was his lord.\"",
    passageReference: "Balin and Balan, Balin's savagery returning",
    commentary: `After the encounter with Vivien, Balin returns to his old *savage* mood. Tennyson's phrase for the regression — *brother beast, whose anger was his lord* — is precise. *Brother beast* is the animal-kinship figure for anger as kin to the knight's humanity, a sibling-force that shares the self. *Whose anger was his lord* completes it: the anger governs rather than serves.

This is the idyll's key psychological moment. Balin's reform was a genuine attempt to bring his anger under service to the higher pattern (the crown-royal shield's devotion, Lancelot's example). The reform failed; anger reasserts lordship; he becomes again *Balin the Savage*. The name Arthur gave him as warning becomes again his condition.

Tennyson's psychology here is Victorian-sophisticated. Character is not fixed; virtue is a hard-won habit that can be lost; the old self lives under the reformed self as a present possibility of regression. Balin's reform was not superficial — it was real, chosen, loved — but reform does not eliminate the temperament it is trying to tame. When conditions change (when his model is proved imperfect, when Vivien's poison enters his mind), the temperament returns. He has not become a new person; he has been managing the old person well, and the management has broken down.

This is also one of Tennyson's darker claims about human nature. The cycle's frame — Arthur as ideal soul, the Round Table as moral civilization — depends on a hopeful view of character change. Balin's idyll is one of the cycle's direct challenges to that hope. Character can regress; reform is precarious; *anger as lord* is always available as a relapse condition. The kingdom's larger moral collapse (in the next idylls) operates at scale: Balin's personal collapse is the small model of the large ruin coming.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },

  {
    id: "iotk-bb-mistaken-combat",
    bookId: "idylls-of-the-king",
    chapterNumber: 5,
    anchorText: "Balin's horse",
    anchorOccurrence: 1,
    title: "Balin's horse and Balan's — the preparation for mistaken combat",
    quotedPassage: "\"…Balin's horse / Was fast beside an alder, on the left / Of Balan's near a poplartree…\"",
    passageReference: "Balin and Balan, horses-before-combat passage",
    commentary: `The geographical-visual detail here sets up the fatal encounter. Balin's horse is tied to an alder on one side of the meadow; Balan's horse to a poplar on the other. The two brothers are within a few hundred yards of each other; they do not know they are brothers to each other on sight — Balin's savage condition and Balan's unfamiliarity with Balin's current armor make recognition fail.

Tennyson's prose-like specificity (alder, poplar, left and right) does unexpected work. The landscape is made precise so the tragedy will not feel abstract. These are two particular trees; two particular horses tied to them; two particular brothers. When the combat happens, it happens in a specified space.

This specificity matters because the subsequent combat is narratively almost unbearable. The brothers fight in thick forest; they cannot see each other's faces through the helms; each takes the other for an unknown hostile knight; they wound each other mortally before the helm-removal reveals who it is.

Tennyson preserves Malory's recognition-in-death scene (II.18–19) nearly intact — it is the one Malory element he did not reshape. The recognition-scene works because the scheme that made it happen is both Malory's (the mistaken-identity combat structure) and Tennyson's (the psychological-rumor buildup that put Balin in his regressed condition). The form is from the source; the emotional preparation is from Tennyson.

This annotation's anchor — the specific description of the tied horses — is the moment the idyll goes from "this could resolve" to "this will not." Tennyson is quietly marking the landscape of the tragedy.`,
    crossReferences: [],
    tags: ["literary-influence", "linguistic"],
  },

  {
    id: "iotk-bb-recognition-death",
    bookId: "idylls-of-the-king",
    chapterNumber: 5,
    anchorText: "Goodnight, true brother",
    anchorOccurrence: 1,
    title: "\"Goodnight, true brother\" — the brothers recognize each other dying",
    quotedPassage: "\"…Goodnight, true brother here! goodmorrow there! / We two were born together, and we die / Together by one doom…\"",
    passageReference: "Balin and Balan, closing death-scene",
    commentary: `The idyll's closing is one of Tennyson's most affecting death-scenes. Balin, realizing whom he has fought, tries to say *goodnight* — meaning "farewell in this life, good day in the next." Balan, dying simultaneously, completes the phrase: *Goodnight, true brother here! goodmorrow there!* — farewell to this life (here), welcome to the life-to-come (there). Then: *we two were born together, and we die / Together by one doom*.

Three elements:

1. **The doubled *brother* word.** *True brother here* and *true brother* (Balin's opening). The word *brother* is the closing's repeated note, reclaiming the sibling-reality that was lost during the savage-mistake combat. Whatever Balin became in Vivien's corruption, whatever Balan mistook him for in the forest, the dying restores them to brothers.

2. **The eschatological closing.** *Here* and *there* map mortal and immortal existence; *goodnight* and *goodmorrow* map the transition. Tennyson is using the Victorian-Christian consolation grammar (death is a passage, not an ending) without specifying doctrine. The brothers can say goodnight here and goodmorrow there because their bond persists across the boundary.

3. **The closing embrace.** *Closed his death-drowsing eyes, and slept the sleep / With Balin, either locked in either's arm.* The brothers die in each other's arms. The physical embrace at death undoes the combat-distance that produced the mutual wound. Tennyson's cycle, which does not often allow restoration-of-bond, allows it here — but only in dying. The idyll's hope is preserved by being deferred to the afterlife.

The passage is the idyll's single most beautiful moment and also its darkest logic. The bond is restored only because both are dying; reform in life was not available to Balin; only death corrects what life broke. This is the cycle entering its dark-idyll phase. The logic of Balin and Balan — *restoration only in death* — will come to dominate the rest of the cycle, culminating in Arthur's translation in Idyll XII.`,
    crossReferences: [],
    tags: ["literary-influence", "linguistic", "philosophical"],
  },

  {
    id: "iotk-bb-structural-function",
    bookId: "idylls-of-the-king",
    chapterNumber: 5,
    anchorText: "locked in either's arm",
    anchorOccurrence: 1,
    title: "The idyll's structural role — Tennyson's 1885 bridge",
    quotedPassage: "\"…either locked in either's arm.\"",
    passageReference: "Balin and Balan, closing image",
    commentary: `Stepping back to name the idyll's cycle-structural role. Tennyson composed *Balin and Balan* in 1885, when he was 76, as the final major addition to the Idylls. It sits between *Geraint and Enid* (Idyll IV, bright middle) and *Merlin and Vivien* (Idyll VI, the catastrophic collapse). It is the cycle's bridge from the stable middle to the dark end.

Structurally it does four things:

1. **Eases the transition.** The cycle needed a darkening-idyll between the Geraint/Enid success and the Merlin/Vivien catastrophe. Without Balin, the corruption would hit without warning. With Balin, the cycle's mood shifts gradually.

2. **Introduces Vivien in minor-key.** See annotation 6. Her idyll-centered role in VI is less jarring after this brief earlier appearance.

3. **Makes the adultery-rumor operationally consequential.** Balin's garden-glimpse is the first time the rumor actually destroys a life. From this idyll on, the rumor has demonstrated cost; the cycle's later catastrophes are the large-scale continuation of what Balin's tragedy is the small case of.

4. **Establishes the "restoration only in death" logic.** Balin and Balan can be reconciled only as they die. Arthur's own translation in XII will repeat this logic: Arthur can be at peace only in the Avalon-departure. The idyll plants the architectural note that the cycle's final consolations are all past-mortem.

This is one of the cycle's most compositional-deliberate idylls. The older poet knew what the cycle needed structurally and wrote it in at 76. Reading the idyll with that awareness — a late-writing bridge-idyll, composed to fill an architectural gap — reveals Tennyson's mature craftsmanship. It is not a high-lyric idyll; it is a *structural* idyll, doing the work of making the cycle's whole shape hang together.

Read it as such: the idyll Tennyson wrote to make the cycle finally coherent, at the end of his life's most ambitious project.`,
    crossReferences: [],
    tags: ["historical", "literary-influence"],
  },
]
