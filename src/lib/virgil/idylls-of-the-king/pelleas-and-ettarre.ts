import type { Annotation } from "../types"

// ── Idylls of the King: Pelleas and Ettarre (Idyll IX) ─────────────
// Tennyson's 1869 idyll (5,025 words). The tonal turning-point into
// despair. Young knight comes to Camelot expecting the ideal; finds
// the cruel Ettarre and the betraying Gawain instead; rides off in
// bitter disillusion. Based on Malory IV.21–23, but Tennyson omits
// Malory's happy-reversal ending (the enchantment by Nimuë) to keep
// the disillusion unresolved.
//
// Density: 10 annotations.

export const IOTK_PELLEAS_AND_ETTARRE: Annotation[] = [
  {
    id: "iotk-pe-opening",
    bookId: "idylls-of-the-king",
    chapterNumber: 9,
    anchorText: "King Arthur made new knights to fill the gap",
    anchorOccurrence: 1,
    title: "\"Fill the gap\" — the opening image of a court rebuilding after loss",
    quotedPassage: "King Arthur made new knights to fill the gap / Left by the Holy Quest; and as he sat / In hall at old Caerleon, the high doors / Were softly sundered, and through these a youth, / Pelleas, and the sweet smell of the fields / Past, and the sunshine came along with him.",
    passageReference: "Pelleas and Ettarre, lines 1–6 · IotK IX.1–6",
    commentary: `The opening is structurally important. Arthur makes *new knights to fill the gap / Left by the Holy Quest* — the Grail-scattering of Idyll VIII has depleted the Round Table, and Arthur is recruiting replacements. Pelleas, a young knight arriving from the country, is one of these new recruits.

This frames the whole idyll. The court the reader is about to enter is not the pre-Grail court of the middle-cycle idylls. It is a post-Grail court, operating with replacement knights, many of its greatest figures gone (Galahad vanished, Percivale at Almesbury, Bors withdrawn). The moral-level of the court has dropped; the newcomers are idealistic but the stable structure they are entering has been weakened. Pelleas's disillusionment, when it comes, is the disillusionment of a young person arriving at an institution past its prime.

The three details of his entrance — *the sweet smell of the fields / Past, and the sunshine came along with him* — are Tennyson's pastoral-signature. Pelleas is the country-bright youth, uncomplicated, carrying with him the field-air of his unsullied origin. The bright-morning register of Gareth and Lynette is echoed here, briefly, one last time in the cycle. After this idyll, no new character will be introduced with this pastoral lightness. Pelleas is the last of the bright-young knights.

Which makes his fate the cycle's most efficient tonal statement. The bright-young knight arrives; the court corrupts or disillusions him; he rides off ruined. The idyll is the cycle's case-study in what the court had become by the late idylls. Pelleas is the reader's envoy into post-Grail Camelot.`,
    crossReferences: [],
    tags: ["literary-influence", "linguistic"],
  },

  {
    id: "iotk-pe-malory-departure",
    bookId: "idylls-of-the-king",
    chapterNumber: 9,
    anchorText: "great lady in her land",
    anchorOccurrence: 1,
    title: "The Malory departure — Nimuë's rescue omitted",
    quotedPassage: "\"Ettarre, / And she was a great lady in her land.\"",
    passageReference: "Pelleas and Ettarre, Ettarre's introduction",
    commentary: `Malory's source for this idyll (Book IV, chapters 21–23) is the Tale of Sir Pelleas and Lady Ettarde. Malory's narrative: Pelleas falls in love with the scornful Ettarde; Gawain offers to intercede on his behalf and instead sleeps with her himself; Pelleas, discovering the betrayal, falls into despair; Nimuë (the lake-lady, Merlin's earlier seductress in Malory) finds him in his despair and enchants Ettarde to love Pelleas (who no longer wants her) while enchanting Pelleas to love Nimuë. Pelleas and Nimuë marry; Ettarde dies of unrequited love. A fairy-tale reversal, with pre-established morality and happy ending.

Tennyson keeps the opening half (the seduction, the betrayal, the despair) but *omits Nimuë's intervention entirely*. Pelleas in Tennyson's version is not rescued by Nimuë; he rides off from the court in disillusion and later reappears as a hostile presence in the cycle's remaining idylls. The happy-reversal is gone; the disillusionment is unresolved.

This is Tennyson's single most important structural choice in the idyll. Malory's ending would have given Pelleas a soft landing — he gets a different and better lady; the tragedy resolves in comedy. Tennyson refuses the soft landing. Pelleas's disillusionment becomes the cycle's tonal turning-point into despair, exactly because it is not mitigated.

Why? The cycle's larger moral architecture requires that disillusionment be real. If the disillusioned young knight can be magically rescued into a better love, the disillusionment was not serious. By omitting the rescue, Tennyson makes Pelleas's ruin permanent — and the cycle's arc toward Arthur's fall can proceed unchecked. The decision is a tonal choice that has structural consequences.

The departure is also one of the cycle's most legible cases of Tennyson choosing darkness over his source's hope. Read Malory IV.21–23 alongside this idyll; the difference is the cycle's whole tonal commitment.`,
    crossReferences: [
      {
        type: "source",
        description: "Malory's Tale of Sir Pelleas and Lady Ettarde (IV.21–23) ends happily — Nimuë enchants both lovers to reverse the situation, Pelleas and Nimuë marry, Ettarde dies. Tennyson omits the rescue entirely. Pelleas's disillusionment becomes the cycle's tonal turning-point into despair.",
        workTitle: "Le Morte d'Arthur",
        workAuthor: "Sir Thomas Malory",
        passageReference: "Book IV.21–23",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  {
    id: "iotk-pe-ettarre-cruelty",
    bookId: "idylls-of-the-king",
    chapterNumber: 9,
    anchorText: "Ettarre",
    anchorOccurrence: 1,
    title: "Ettarre — the cycle's figure of feminine cruelty",
    quotedPassage: "\"…Ettarre, / And she was a great lady in her land.\"",
    passageReference: "Pelleas and Ettarre, Ettarre's character",
    commentary: `Ettarre is one of the cycle's harsher female characters, and — like Vivien — she is a Tennyson construction whose flatness should be named. Unlike Vivien, Ettarre is less often the subject of critical debate, partly because she is less central to the cycle's plot and partly because Tennyson's handling of her is slightly less editorial. But the flattening is present.

Ettarre accepts Pelleas's courtship as a game; she imposes harsh tests on him (she requires him to wait outside her castle, to endure her servants' abuse, to keep returning); she delights in his humiliation; she does not love him and never will; when Gawain arrives with his false promise to woo her on Pelleas's behalf, she immediately takes Gawain as her lover. Her register in the idyll is *harsh rose and ice* (the speaker-palette note) — cold beauty, sexual availability to the wrong person, cruelty to the right one.

Three readings:

1. **The structural villain.** Ettarre serves the idyll's plot-needs: she is the cruel lady who produces Pelleas's disillusionment. Without her specific coldness, Pelleas's ruin would not register. The character does what the plot needs her to do, and her flatness is part of her function.

2. **The cycle's female-cruelty type.** Tennyson's cycle has Vivien, Ettarre, and (to a lesser extent) Lynette-pre-reform as its *cold* or *cruel* women. All three are given a palette-register of rose-and-silver-and-hard-light. This is a type, not an individual, and the type is Victorian-gendered.

3. **The honest-feminist reading.** Ettarre's cruelty is framed as personal vice, not as survival-strategy in a chivalric system that objectified her. A more sympathetic reading would notice that Ettarre, too, is inside a system that makes her responses to men limited — the chivalric frame gave her the power of refusal and not much else. Her cruelty is the available-instrument in a system that denied her other forms of agency. This does not justify her cruelty but complicates the idyll's flat moral-reading of it.

As with Vivien (see annotation 2 of the Merlin and Vivien cluster), the annotations should not reproduce Tennyson's uncritical framing of the female antagonist. Ettarre is cruel; the idyll's structural need for her cruelty does not mean her cruelty is all she could have been. The period's gender-politics made her flattening culturally available; the flattening is still real.`,
    crossReferences: [],
    tags: ["philosophical", "historical", "literary-influence"],
  },

  {
    id: "iotk-pe-gawain-betrayal",
    bookId: "idylls-of-the-king",
    chapterNumber: 9,
    anchorText: "Gawain, looking at the villainy done",
    anchorOccurrence: 1,
    title: "Gawain's betrayal — the court's moral center fails",
    quotedPassage: "\"Gawain, looking at the villainy done, / Forbore, but in his heat and eagerness / Trembled…\"",
    passageReference: "Pelleas and Ettarre, Gawain's response to finding Pelleas tormented",
    commentary: `Gawain is one of the cycle's major knights — Arthur's nephew, a senior member of the Round Table. In this idyll, he comes upon Pelleas bound and humiliated by Ettarre's men; he frees Pelleas; he offers to go woo Ettarre on Pelleas's behalf, promising to return within seven days if he succeeds. Pelleas trusts him.

What follows is one of the cycle's cleanest betrayals. Gawain arrives at Ettarre's castle; he woos her; he sleeps with her himself; he does not return within seven days; Pelleas, eventually coming to find out what has happened, discovers Gawain and Ettarre in bed together and stands over them with a drawn sword — then, in an extraordinary moment, refuses to kill them and simply leaves his sword across their throats as a silent indictment.

This is the idyll's most morally serious scene. Three things happening:

1. **A Round Table knight has failed the most basic chivalric trust.** Gawain was trusted with a sacred task (interceding on a fellow knight's behalf); he used the occasion for his own pleasure; he broke his word. This is the chivalric frame breaking at its institutional level, and Pelleas's trust in the institution breaks with it.

2. **Pelleas refuses violence.** The drawn sword, not-used, left as sign-across-throats, is a remarkable restraint. Pelleas could have killed both; he chose not to. The sword-across-throats is his message: *I could have; I didn't; know that I could have*. The restraint is aristocratic, chivalric, morally elevated — and wholly wasted on the sleeping adulterers who will only understand it as mercy.

3. **The court's moral authority collapses for Pelleas.** If Gawain — a senior knight, Arthur's nephew — behaves this way, the Round Table's ideal is a lie. Not a flawed institution with occasional individual failures, but a lie: the institution's own senior members operate without the honor the institution claims as its basis. Pelleas's disillusionment is therefore well-reasoned; his conclusion is proportionate to his evidence.

This is the cycle's clearest case of *the frame is not what the frame says*. The chivalric ideal Arthur preached in *The Coming of Arthur* — conscience-as-king, fidelity, courtly love as moral-formation — has been inverted by Gawain's action. The idyll's structural purpose is to document this inversion cleanly. Every later idyll's corruption is downstream of this scene's discovery.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },

  {
    id: "iotk-pe-sword-left",
    bookId: "idylls-of-the-king",
    chapterNumber: 9,
    anchorText: "sword-handle",
    anchorOccurrence: 1,
    title: "The sword across the throats — the idyll's silent indictment",
    quotedPassage: "\"…his sword-handle, yet he turned and laid his blade / Across their throats as message…\"",
    passageReference: "Pelleas and Ettarre, sword-across-throats scene",
    commentary: `The sword-scene is one of the cycle's quietest and most devastating moments. Pelleas discovers Gawain and Ettarre asleep together; he draws his sword; he stands over them; he does not strike. He lays the blade across their throats, not cutting, and leaves. When they wake, the blade is on them — evidence that he was here, that he saw, that he could have killed, and that he chose not to.

Three readings:

1. **Chivalric mercy.** Pelleas refuses murder-of-sleeping-adulterers because the chivalric code forbids violence against the unarmed-and-sleeping. The restraint is his honoring of the code even as the people who betrayed him have violated it. This is the idyll's most complete moral-statement: the wronged knight's honor exceeds the wrongdoers'.

2. **Despair-disguised-as-restraint.** An alternative reading: Pelleas's restraint is not code-honoring but world-ending. He does not kill because killing would still mean that the system was worth defending. Leaving the sword is leaving the system entirely; he will not participate in it, even to punish its breakers. This reading makes the gesture more nihilistic than chivalric.

3. **Silent evidence for the record.** The blade on their throats is Pelleas's witness-statement. They will wake and see; they will know what he saw; they will know the ethical-catastrophe that has happened between them. No speaker is required; the sword testifies. This is the gesture at its simplest: the wronged party makes the wrong visible to the wrongdoers without speaking.

The idyll does not choose among these readings. All three live in the text simultaneously. The sword-gesture is the idyll's hinge: after this, Pelleas is no longer a young knight of the court; he is a ruined-and-silent figure riding into the wilderness, carrying the evidence of what the court became.

The scene is also quietly anticipated and then repeated in miniature at the idyll's close, where Pelleas confronts Guinevere and Lancelot in the hall and, hissing *I have no sword*, sees that he has left his sword at Ettarre's castle. His chivalric unarming — the sword gone — is literal and symbolic. The knight no longer has the instrument of honor; he has left it on the throats of the people who made honor meaningless.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },

  {
    id: "iotk-pe-disillusionment",
    bookId: "idylls-of-the-king",
    chapterNumber: 9,
    anchorText: "shame",
    anchorOccurrence: 1,
    title: "Pelleas's disillusionment — the tonal turning-point",
    quotedPassage: "\"…shamed to say it — I cannot bide Sir Baby…\"",
    passageReference: "Pelleas and Ettarre, Pelleas's disillusionment-speech",
    commentary: `Pelleas's disillusionment is not conveyed in a single aria but in a sequence of small moments across the idyll's last quarter — his riding-away with bitter muttering, his encounter with other knights whom he mocks as empty-costumed, his discovery that the court is nothing like what he had come to believe. The idyll makes the disillusionment cumulative rather than climactic.

What makes this the cycle's turning-point? Three factors:

1. **Pelleas is the reader's proxy.** We came to court through him; he is the bright-young-arrival whose first impressions we shared. His disillusionment is therefore, for the reader, a re-evaluation of what the court has been all along. Everything the earlier idylls showed as warm, generous, morally sustained is here revealed as partial — the court was always also this other thing.

2. **The disillusionment is unrescued.** Per annotation 2, Tennyson omits Nimuë's magical reversal. Pelleas rides into the cycle's remaining idylls as a hostile figure — his shadow appears at court, his anger persists, he threatens the court's composure in late scenes. The wound does not heal; the disillusioned young knight becomes the court's ongoing internal opposition.

3. **It names what the rest of the cycle will be.** After Pelleas's disillusionment, the cycle's remaining idylls (Last Tournament, Guinevere, Passing of Arthur) operate in the register his disillusionment introduced. The cycle does not return to bright-morning; it does not return to Gareth-and-Lynette lightness; it continues along the disillusioned-arc Pelleas opened. His idyll is the cycle's pivot from stable-middle into dark-end.

The idyll is therefore structurally comparable to Merlin and Vivien (the sage's silencing as the intelligence-loss) but operates at the emotional rather than the intellectual level. Merlin and Vivien loses the kingdom's *sight*; Pelleas and Ettarre loses the kingdom's *heart*. The two idylls together do the double-work of unmaking the Round Table's sustaining conditions.`,
    crossReferences: [
      {
        type: "echo",
        description: "Pelleas's disillusionment is the emotional-level counterpart to Merlin's silencing in Idyll VI. The two idylls together strip the kingdom of its sustaining capacities — Merlin and Vivien removes intelligence, Pelleas and Ettarre removes hope. From here the cycle can only descend.",
        workTitle: "Idylls of the King — Merlin and Vivien",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Merlin and Vivien (entire idyll)",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 6,
        targetAnchorText: "lost to life and use and name and fame",
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },

  {
    id: "iotk-pe-final-hall-scene",
    bookId: "idylls-of-the-king",
    chapterNumber: 9,
    anchorText: "I have no sword",
    anchorOccurrence: 1,
    title: "\"I have no sword\" — Pelleas's return to court, unarmed",
    quotedPassage: "\"…he, hissing 'I have no sword,' / Sprang from the door into the dark.\"",
    passageReference: "Pelleas and Ettarre, return-to-court scene (closing)",
    commentary: `The idyll closes with Pelleas returning to the court, confronting Guinevere and Lancelot, and discovering that he has *no sword* — he left it at Ettarre's castle on the throats of Gawain and Ettarre (annotation 5). The weapon of chivalric honor is not with him; he cannot strike; he can only *hiss* and leave.

Three layers:

1. **The literal loss.** Pelleas's sword is still at Ettarre's. He left it there as evidence; he has not taken it back. When he needs it — at the court, confronting the corrupt queen and her lover — it is not available to him.

2. **The symbolic loss.** The sword is the chivalric-honor-instrument. Pelleas has, structurally, given up his place in the Round Table's violence-economy. He will not kill; he cannot kill; his renunciation has become a condition, not just a single gesture.

3. **The gothic register.** *Sprang from the door into the dark* is the idyll's closing visual. Pelleas exits into the night as a haunted-figure. The cycle from here on has this figure moving through it — the sword-less knight, the disillusioned wound that will not heal, the court's shadow.

The closing lines include a remarkable moment: Guinevere and Lancelot, after Pelleas leaves, *looked hard upon each other; / And each foresaw the dolorous day to be*. They see what is coming. The lover and the queen, after Pelleas's spring-into-the-dark, know that they will be the ones to produce the cycle's final catastrophe. This is Tennyson's most explicit pre-statement of the cycle's end, embedded near the close of this idyll.

*Then a long silence came upon the hall, / And Modred thought, "The time is hard at hand."* Modred, the traitor-to-come, also sees what is coming — his moment. The idyll's closing silence is the silence before the fall. Pelleas's disillusionment has pushed the court into the state where the fall is inevitable and everyone, including the lovers and the traitor, knows it.

This is one of the cycle's most concentrated closings. Read the whole final passage aloud; the silence, the foreseeing, the sprang-into-the-dark, the hissed *I have no sword* — the combination is Tennyson's most efficient pre-statement of the catastrophe that the remaining three idylls will narrate.`,
    crossReferences: [],
    tags: ["literary-influence", "linguistic", "philosophical"],
  },

  {
    id: "iotk-pe-dolorous-day",
    bookId: "idylls-of-the-king",
    chapterNumber: 9,
    anchorText: "the dolorous day to be",
    anchorOccurrence: 1,
    title: "\"The dolorous day to be\" — the cycle foreseen by its protagonists",
    quotedPassage: "\"The Queen / Looked hard upon her lover, he on her; / And each foresaw the dolorous day to be…\"",
    passageReference: "Pelleas and Ettarre, closing penultimate passage",
    commentary: `This small passage — Guinevere and Lancelot looking at each other after Pelleas's exit and *foreseeing the dolorous day to be* — is the idyll's most psychologically advanced moment and the cycle's clearest inter-idyll prolepsis.

*Dolorous* is medieval-chivalric for *suffering, sorrowful*. The *Dolorous Stroke* in Malory is Balin's wounding of Pellam (which Tennyson omitted from Idyll V). The *dolorous day* here is the day the kingdom falls, which Guinevere and Lancelot see coming because Pelleas has just demonstrated that the court's ethical core is exposed — the court's corruption is now visible to outsiders, to the young, to disillusioned witnesses. From here, the cycle's catastrophe is a matter of time.

What makes this moment startling is that Tennyson gives Guinevere and Lancelot the *foresight* directly. They are not passive participants in an unfolding tragedy; they are consciously-watching participants in a tragedy they can see coming. This is unusual for the cycle — most characters are blind to what they are making. Here, at this single moment, the adulterers see.

Why does Tennyson give them this vision here? Two readings:

1. **Tragic consciousness.** The Victorian-tragic mode requires characters to recognize their doom before it arrives. Giving Guinevere and Lancelot this foresight makes their subsequent scenes (especially Guinevere's confrontation in Idyll XI) more tragic — they are not surprised by the fall; they have been watching it approach.

2. **Pelleas as prophet.** Pelleas's disillusionment becomes, in this passage, an oracle. His hissing exit into the dark has told Guinevere and Lancelot what is coming — not explicitly, but by being the first public-evidence that the court's moral core is failing. Where Merlin was silenced in Idyll VI, Pelleas speaks (even in hiss) in IX, and what he says — *I have no sword* — is prophecy.

The lovers' *looked hard upon each other* is also one of the cycle's most naked intimate moments. They know what they have done; they know what it will cost; they have only each other and the knowledge they share. Read this moment as the cycle's most honest portrait of the adulterous lovers in their actual condition — not heroic, not villainous, just the two people who have looked at each other and seen the end.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },

  {
    id: "iotk-pe-modred-listening",
    bookId: "idylls-of-the-king",
    chapterNumber: 9,
    anchorText: "The time is hard at hand",
    anchorOccurrence: 1,
    title: "\"The time is hard at hand\" — Modred's silent opportunism",
    quotedPassage: "\"…And Modred thought, 'The time is hard at hand.'\"",
    passageReference: "Pelleas and Ettarre, closing line",
    commentary: `The idyll ends on Modred's silent thought. Modred — Arthur's illegitimate son, the cycle's principal traitor — has been watching Pelleas's exit and Guinevere-and-Lancelot's foreseeing. He thinks to himself: *the time is hard at hand*. His moment is approaching.

This is Tennyson's most direct plant of the cycle's betrayer. Modred has existed in the cycle's background throughout (mentioned in passing, implied in Vivien's slanders, present at court); here, at the end of Idyll IX, he receives his first explicit interior-line. His single sentence tells the reader what he is and what he is waiting for.

*The time is hard at hand.* The phrase is quietly sinister. *Hard at hand* is the idiom for *very close*. Modred is not acting yet; he is waiting. He sees what the idyll has just shown — Pelleas's disillusionment, the lovers' foreseen doom, the court's moral collapse becoming visible — and he knows his moment is coming into range.

Three readings:

1. **Modred as patient predator.** He has been waiting for the right moment to strike. The right moment is *when the court is ready to fall*. Pelleas's disillusionment has created that moment. Modred will not need to destabilize anything; he only needs to wait until the fall is imminent and then accelerate it.

2. **Modred as reader-surrogate for the cycle's fall.** He knows the cycle's arc; his thought synchronizes with the cycle's narrative-need. Tennyson is using Modred here almost as a chorus-figure — the character whose awareness matches the reader's awareness that the catastrophe is coming.

3. **Modred as the structural pivot to the cycle's final three idylls.** From this line onward, the cycle's next idyll (Last Tournament) will show the court in open-cynicism; Guinevere will flee; Arthur will fall at the last battle. Modred has said *the time is hard at hand*, and the cycle's answer is to deliver the time.

The idyll ends on this five-word thought because Tennyson wants the reader to finish the idyll with Modred's awareness installed. Every subsequent scene of corruption has Modred's silent presence as its interpretive ground. He is the waiting figure behind the last three idylls, and this closing line is where Tennyson puts him into the reader's mind.`,
    crossReferences: [
      {
        type: "echo",
        description: "Modred's thought \"the time is hard at hand\" is the cycle's structural pivot from middle-decline (Merlin, Grail, Pelleas) into final-collapse (Last Tournament, Guinevere, Passing of Arthur). The cycle's final three idylls operate under this thought's shadow.",
        workTitle: "Idylls of the King — The Passing of Arthur",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Passing of Arthur (Modred's treason and Arthur's death)",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 12,
        targetAnchorText: "Modred",
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  {
    id: "iotk-pe-structural-role",
    bookId: "idylls-of-the-king",
    chapterNumber: 9,
    anchorText: "having heard the King",
    anchorOccurrence: 1,
    title: "The idyll's structural role — the court's moral collapse made visible",
    quotedPassage: "\"…for having heard…\"",
    passageReference: "Pelleas and Ettarre (idyll-level structural annotation)",
    commentary: `Stepping back to name the cycle-structural function of this idyll. *Pelleas and Ettarre* is the tonal turning-point of the cycle's second half. The cycle's architecture:

- **Idylls I–V** (Coming of Arthur, Gareth, Geraint I, Geraint II, Balin): establishing and middle. Bright-morning and stable. Rumors of Guinevere's adultery are private.
- **Idyll VI** (Merlin and Vivien): the hinge. Merlin is silenced. Vivien's slanders make the private rumor operational.
- **Idylls VII–VIII** (Lancelot and Elaine, The Holy Grail): the great middle-tragedies. The adultery becomes morally-consequential; the Grail quest scatters the knights.
- **Idyll IX** (Pelleas and Ettarre): the tonal turn. The disillusionment becomes unrescued and public.
- **Idylls X–XII** (Last Tournament, Guinevere, Passing of Arthur): the fall. Open cynicism, Guinevere's flight, Arthur's death.

Pelleas and Ettarre is the hinge between the great middle-tragedies (which still contain moral beauty — Elaine's song, Galahad's vision, Arthur's critique-of-the-quest) and the openly-despairing final three. It does the specific work of making the court's moral failure *visible to outsiders*. Before this idyll, the adultery is a private affair with court-rumor consequences. After this idyll, the young men coming to court see what the court is and ride away from it.

This is the cycle's argument about how moral institutions actually fail. They do not fail by direct attack; they fail by losing the capacity to produce new recruits. Once the young see the institution as it is, the institution's reproduction-chain breaks. No more new Garetths will come to the court; only disillusioned Pelleases. The institution, even if it continues for one more generation, has lost the next.

Read the idyll for this structural argument. The cycle is explaining something about how civilizations end — not through catastrophe but through the young turning away. Pelleas's ride into the dark is the cycle's most specific image of civilizational failure at the recruitment-level. Tennyson in 1869 was writing, with this idyll, one of the Victorian period's clearest statements about how a culture's ideals lose their grip.`,
    crossReferences: [],
    tags: ["philosophical", "historical", "literary-influence"],
  },
]
