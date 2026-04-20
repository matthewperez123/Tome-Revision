/**
 * Julius Caesar — Act IV glosses.
 * Attaches to the GLOSSES map in seed-julius-caesar-glosses.ts.
 *
 * 4.1: the Second Triumvirate (Antony, Octavius, Lepidus) negotiate
 * the proscription list; Antony plans Lepidus's future dispensability.
 * 4.2: prelude to the quarrel — Brutus receives Cassius with cooling
 * formality outside Brutus's tent.
 * 4.3 (TIER 1): the tent scene. Quarrel and reconciliation; the Poet
 * interrupts; Portia's death (reported twice); Messala's news of the
 * proscriptions; the book; Caesar's Ghost. Heavy gloss density.
 */

interface SeedGloss { line: number; phrase: string; definition: string; }

module.exports = function (GLOSSES: Record<string, SeedGloss[]>) {

  // ── 4.1 — A house in Rome. The Triumvirs proscribe ──────────────────
  GLOSSES.julius_caesar_act4_scene1 = [
    { line: 1, phrase: "prick'd", definition: "marked off on the proscription list — each dot meant a death sentence and confiscation of property" },
    { line: 2, phrase: "Your brother too must die", definition: "the triumvirs bargain over kin — Lepidus consents to his brother's death in exchange for Antony's nephew; chilling political arithmetic" },
    { line: 6, phrase: "with a spot I damn him", definition: "with a mark of the pen I condemn him to death" },
    { line: 9, phrase: "cut off some charge in legacies", definition: "reduce the public bequests Caesar promised in his will — the same will Antony used in 3.2 to inflame the crowd" },
    { line: 11, phrase: "slight unmeritable man", definition: "trivial, undeserving man" },
    { line: 12, phrase: "Meet to be sent on errands", definition: "fit for running errands (nothing more)" },
    { line: 13, phrase: "three-fold world", definition: "the Roman world divided among the three triumvirs: Antony (east), Octavius (west), Lepidus (Africa). The Second Triumvirate, formed November 43 BCE" },
    { line: 17, phrase: "black sentence and proscription", definition: "deadly sentence and proscription (= publicly-posted list of men to be killed with reward); Sulla invented proscription as a Roman political instrument; the triumvirs revived it in 43 BCE" },
    { line: 20, phrase: "divers slanderous loads", definition: "various burdens of slander — the blame for proscription" },
    { line: 21, phrase: "ass bears gold", definition: "the donkey carries treasure — a moral fable from Aesop; Lepidus is the beast of burden" },
    { line: 26, phrase: "empty ass, to shake his ears", definition: "unburdened donkey shaking its ears — insulting image for a dismissed Lepidus" },
    { line: 27, phrase: "graze in commons", definition: "graze on common (public) pasture — demoted to nobody" },
    { line: 30, phrase: "store of provender", definition: "plenty of fodder" },
    { line: 32, phrase: "wind, to stop, to run directly on", definition: "turn, halt, gallop straight on — horseman's commands" },
    { line: 33, phrase: "corporal motion", definition: "bodily movement" },
    { line: 37, phrase: "abjects, orts and imitations", definition: "rejected scraps, leftover morsels, and copied styles — what servants consume after their betters" },
    { line: 38, phrase: "staled by other men", definition: "made stale by others' prior use" },
    { line: 40, phrase: "property", definition: "a stage-property; a thing used and then discarded — Antony's cold theatrical metaphor" },
    { line: 41, phrase: "Listen great things", definition: "hear matters of importance" },
    { line: 42, phrase: "levying powers", definition: "raising armies" },
    { line: 42, phrase: "make head", definition: "raise a fighting force against them; take the field" },
    { line: 46, phrase: "covert matters", definition: "hidden/secret matters" },
    { line: 48, phrase: "at the stake", definition: "tied to the bear-baiting stake (the bear surrounded by dogs) — we are under attack" },
    { line: 49, phrase: "bay'd about", definition: "surrounded by baying hounds — the bear-baiting image continued" },
  ];

  // ── 4.2 — Camp near Sardis. Brutus receives Cassius ──────────────────
  GLOSSES.julius_caesar_act4_scene2 = [
    { line: 2, phrase: "Lucilius", definition: "a loyal officer of Brutus; he will later impersonate Brutus at Philippi (5.4) to let Brutus escape" },
    { line: 3, phrase: "Pindarus", definition: "Cassius's freed-slave attendant; at 5.3 he kills Cassius on order" },
    { line: 4, phrase: "salutation", definition: "formal greeting" },
    { line: 6, phrase: "in his own change, or by ill officers", definition: "either in his own altered disposition or through bad subordinates — Brutus diplomatically reserves judgment" },
    { line: 15, phrase: "familiar instances", definition: "intimate tokens; gestures of close friendship" },
    { line: 16, phrase: "free and friendly conference", definition: "open, friendly conversation" },
    { line: 18, phrase: "hot friend cooling", definition: "a warm friend growing cold — Brutus's diagnosis; the friendship is ending" },
    { line: 20, phrase: "enforced ceremony", definition: "forced formality; stiff courtesy put on when real warmth fails" },
    { line: 22, phrase: "horses hot at hand", definition: "horses fiery when held in (at the start) but fading under pressure" },
    { line: 23, phrase: "mettle", definition: "spirit; temper of character; pun on metal" },
    { line: 24, phrase: "bloody spur", definition: "the spur drawing blood — real test under stress" },
    { line: 25, phrase: "fall their crests", definition: "drop their crests (like losing horses); give up" },
    { line: 25, phrase: "deceitful jades", definition: "untrustworthy broken-down horses" },
    { line: 27, phrase: "Sardis", definition: "ancient city in Asia Minor (western Turkey); Brutus and Cassius's winter camp before Philippi" },
    { line: 28, phrase: "horse in general", definition: "the cavalry as a whole" },
    { line: 43, phrase: "enlarge your griefs", definition: "state your grievances at length (not 'make them larger')" },
  ];

  // ── 4.3 — Brutus's tent. Quarrel, reconciliation, Portia, Ghost (TIER 1) ──
  GLOSSES.julius_caesar_act4_scene3 = [
    { line: 2, phrase: "condemn'd and noted", definition: "publicly censured and marked down as guilty" },
    { line: 2, phrase: "Lucius Pella", definition: "a Roman ally of Cassius, convicted of corruption in the province of Sardis; the historical incident is in Plutarch" },
    { line: 5, phrase: "slighted off", definition: "dismissed contemptuously" },
    { line: 7, phrase: "meet", definition: "fitting; proper" },
    { line: 8, phrase: "every nice offence should bear his comment", definition: "every petty offence should be publicly censured" },
    { line: 10, phrase: "itching palm", definition: "greedy hand (itching for bribes) — proverbial; the play's most direct charge of corruption" },
    { line: 11, phrase: "sell and mart your offices", definition: "sell and traffic in your official appointments — a specific crime of Roman political corruption" },
    { line: 18, phrase: "ides of March remember", definition: "Brutus's damning rhetorical pivot — we killed Caesar FOR this kind of corruption, and you now commit it; the assassination's justification is under threat" },
    { line: 22, phrase: "foremost man of all this world", definition: "Caesar described in superlative terms by the man who killed him — a measure of Brutus's residual honour" },
    { line: 23, phrase: "supporting robbers", definition: "defending bribers and extortioners" },
    { line: 27, phrase: "bay the moon", definition: "howl at the moon (like a dog) — be futilely noisy" },
    { line: 29, phrase: "hedge me in", definition: "confine me; constrain me" },
    { line: 30, phrase: "older in practice", definition: "older in experience; more seasoned" },
    { line: 32, phrase: "Go to", definition: "dismissive exclamation — 'come on,' 'get out'" },
    { line: 35, phrase: "Have mind upon your health", definition: "take care of your own safety — Cassius's veiled threat" },
    { line: 36, phrase: "slight man", definition: "insignificant man — Brutus returns the insult" },
    { line: 38, phrase: "rash choler", definition: "hasty anger (choler = yellow bile, one of the four humours; associated with irascibility)" },
    { line: 42, phrase: "choleric", definition: "angry (from the humoral psychology)" },
    { line: 43, phrase: "bondmen tremble", definition: "make your slaves tremble" },
    { line: 45, phrase: "testy humour", definition: "irritable disposition" },
    { line: 46, phrase: "venom of your spleen", definition: "poison of your bile — the spleen was thought to be the seat of anger" },
    { line: 49, phrase: "waspish", definition: "fretful; stinging like a wasp" },
    { line: 55, phrase: "elder soldier, not a better", definition: "Cassius's climb-down — redefining his claim mid-argument" },
    { line: 61, phrase: "presume too much upon my love", definition: "take my love for granted" },
    { line: 65, phrase: "arm'd so strong in honesty", definition: "fortified by my integrity" },
    { line: 70, phrase: "coin my heart", definition: "mint my own heart into coins — I would rather bleed money from my own body than extort it" },
    { line: 71, phrase: "drop my blood for drachmas", definition: "shed my own blood for coinage (drachma = Greek silver coin)" },
    { line: 72, phrase: "wring from the hard hands of peasants", definition: "extract by force from working men's calloused hands" },
    { line: 73, phrase: "indirection", definition: "crooked means" },
    { line: 78, phrase: "rascal counters", definition: "worthless reckoning-tokens — low money; Brutus's dismissive view of cash" },
    { line: 83, phrase: "rived my heart", definition: "split my heart (rived = cloven)" },
    { line: 84, phrase: "bear his friend's infirmities", definition: "tolerate his friend's weaknesses" },
    { line: 90, phrase: "huge as high Olympus", definition: "as large as Mount Olympus — the classical seat of the gods" },
    { line: 94, phrase: "Check'd like a bondman", definition: "rebuked like a slave" },
    { line: 95, phrase: "conn'd by rote", definition: "memorised by repetition" },
    { line: 99, phrase: "Plutus' mine", definition: "the mine of Plutus, Greek god of wealth; richer than any gold-mine" },
    { line: 102, phrase: "Strike, as thou didst at Caesar", definition: "Cassius offers his breast as Brutus offered his dagger to Caesar — the quarrel repeats the assassination in miniature" },
    { line: 103, phrase: "When thou didst hate him worst, thou lovedst him better", definition: "Cassius's keen wound: Brutus loved Caesar even in killing him more than he ever loved Cassius" },
    { line: 107, phrase: "yoked with a lamb", definition: "paired in harness with a lamb — Brutus's ironic self-description as the mild partner" },
    { line: 108, phrase: "carries anger as the flint bears fire", definition: "holds anger as flint holds fire — sparks only when struck, then cold" },
    { line: 118, phrase: "rash humour which my mother gave me", definition: "the hot temper inherited from his mother — Cassius's half-apology via humoral inheritance" },
    { line: 122, phrase: "POET", definition: "the unnamed Poet who interrupts the reconciliation — a cynical philosopher-poet in Plutarch; here played for comic relief that turns on the poet's uselessness in war" },
    { line: 129, phrase: "cynic rhyme", definition: "Cynic rhyme — verse in the manner of the Cynic philosophers (bare, moralising); Plutarch calls this figure 'Marcus Phaonius,' a follower of Cato who affected Cynic manners" },
    { line: 130, phrase: "saucy fellow", definition: "impudent fellow" },
    { line: 132, phrase: "I'll know his humour, when he knows his time", definition: "I'll tolerate his manner when he learns the right time — i.e. never, mid-war" },
    { line: 133, phrase: "What should the wars do with these jigging fools?", definition: "what use have wars for these rhyme-jigging fools? — the play's dismissive question about poets in political crisis; Shakespeare's metapoetical self-awareness" },
    { line: 134, phrase: "Companion", definition: "fellow (dismissive, as in 'fellow!')" },
    { line: 141, phrase: "Of your philosophy you make no use", definition: "you're not using your Stoic philosophy — Brutus was a professed Stoic; the complaint is apt" },
    { line: 143, phrase: "Portia is dead", definition: "Brutus announces Portia's death; a substantive loss. The double-report problem: he repeats the news later (L183ff) as if hearing it for the first time. Some editors read this as a textual-revision artifact — Shakespeare may have cut one version and failed to remove the other" },
    { line: 146, phrase: "insupportable and touching loss", definition: "unbearable, heart-moving loss" },
    { line: 150, phrase: "fell distract", definition: "became distraught; went mad" },
    { line: 151, phrase: "swallow'd fire", definition: "Portia killed herself by swallowing burning coals — the traditional, Plutarchan account of her suicide; one of the ancient world's most distinctive suicides" },
    { line: 160, phrase: "call in question our necessities", definition: "consider what we need (for the war)" },
    { line: 166, phrase: "Philippi", definition: "city in Macedonia (northern Greece); site of the decisive double battle of October 42 BCE, where Antony and Octavius defeated Brutus and Cassius" },
    { line: 169, phrase: "proscription and bills of outlawry", definition: "the triumvirs' lists of enemies to be killed and property seized; 'bills of outlawry' = public notices of outlawing" },
    { line: 171, phrase: "put to death an hundred senators", definition: "executed a hundred senators — Messala's news of the triumvirate's political purge; Plutarch gives 130; it was a systematic dismantling of the senatorial class" },
    { line: 174, phrase: "Cicero being one", definition: "Cicero was among those killed in the proscriptions of 43 BCE — Antony, whom Cicero had attacked in the *Philippics*, put him on the list" },
    { line: 175, phrase: "Cicero is dead", definition: "Marcus Tullius Cicero, Roman orator, philosopher, and statesman, executed December 7, 43 BCE — the death Messala confirms" },
    { line: 184, phrase: "like a Roman bear the truth", definition: "endure the truth as a Roman should — Stoic fortitude invoked" },
    { line: 190, phrase: "I have as much of this in art as you", definition: "my philosophy (art = learned discipline) teaches me the same lesson — Cassius acknowledges Stoicism but admits his nature can't bear it" },
    { line: 192, phrase: "to our work alive", definition: "to the living business at hand" },
    { line: 199, phrase: "Good reasons must, of force, give place to better", definition: "good reasons must yield to better ones" },
    { line: 214, phrase: "tide in the affairs of men", definition: "a tide in human affairs — Brutus's most-quoted line; a maritime metaphor for opportunity" },
    { line: 215, phrase: "taken at the flood", definition: "caught at high water; seized at the right moment" },
    { line: 217, phrase: "bound in shallows and in miseries", definition: "stuck in shallow waters and troubles — the opportunity missed" },
    { line: 218, phrase: "full sea", definition: "high tide — the moment for action" },
    { line: 224, phrase: "niggard with a little rest", definition: "be stingy with a brief sleep — take only a little" },
    { line: 237, phrase: "o'erwatch'd", definition: "exhausted from over-long watching" },
    { line: 248, phrase: "book", definition: "Brutus is reading a book — with turning pages and a bookmark leaf ('is not the leaf turn'd down'). Roman reading was on scrolls; the codex (book with pages) wasn't common until the 2nd century CE. Another deliberate anachronism that places Rome in an English study" },
    { line: 263, phrase: "murderous slumber", definition: "sleep personified as a murderer" },
    { line: 263, phrase: "leaden mace", definition: "a heavy lead mace — the weapon of Sleep in Renaissance allegory" },
    { line: 268, phrase: "leaf turn'd down", definition: "a page folded over as a bookmark — anachronism confirmed; scrolls don't have leaves to turn down" },
    { line: 272, phrase: "monstrous apparition", definition: "terrible supernatural appearance — Caesar's Ghost" },
    { line: 276, phrase: "Thy evil spirit", definition: "your evil genius — in Roman belief, each person had a guiding spirit (genius); the ghost announces itself as Brutus's shadow-self, not specifically as Caesar. The ambiguity is Shakespeare's" },
    { line: 278, phrase: "Philippi", definition: "the ghost's prophecy — he will appear again at Philippi, where Brutus dies" },
    { line: 285, phrase: "strings, my lord, are false", definition: "Lucius's sleep-talking about his instrument — the strings have gone out of tune; a touching domestic detail amid the supernatural" },
    { line: 298, phrase: "set on his powers betimes", definition: "set his forces marching early" },
  ];

};
