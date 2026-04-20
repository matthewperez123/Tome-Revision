/**
 * Julius Caesar — Act V glosses.
 * Attaches to the GLOSSES map in seed-julius-caesar-glosses.ts.
 *
 * 5.1: parley on the plains of Philippi; insults traded; Cassius's
 * birthday reflection on the eagles-and-ravens omens; Brutus and
 * Cassius's "forever farewell."
 * 5.2: Brutus's hurried battle order to Messala.
 * 5.3: Cassius's suicide via Pindarus; Titinius's suicide.
 * 5.4: Cato dies; Lucilius impersonates Brutus; Antony spares Lucilius.
 * 5.5 (TIER 1): Brutus's suicide on Strato's sword; Antony's epitaph
 * ("This was the noblest Roman of them all"); Octavius orders a
 * soldier's burial — the new political order beginning.
 */

interface SeedGloss { line: number; phrase: string; definition: string; }

module.exports = function (GLOSSES: Record<string, SeedGloss[]>) {

  // ── 5.1 — The plains of Philippi. The parley ────────────────────────
  GLOSSES.julius_caesar_act5_scene1 = [
    { line: 5, phrase: "warn us at Philippi", definition: "challenge us at Philippi (warn = summon to battle)" },
    { line: 7, phrase: "I am in their bosoms", definition: "I am inside their confidence; I know their minds" },
    { line: 10, phrase: "fearful bravery", definition: "a bravado that masks fear" },
    { line: 14, phrase: "bloody sign of battle", definition: "the red flag (vexillum) raised before a Roman battle to announce engagement" },
    { line: 18, phrase: "exigent", definition: "a pressing moment; a critical juncture" },
    { line: 19, phrase: "I do not cross you; but I will do so", definition: "Octavius's quiet assertion of independence from Antony — a precursor of the coming rupture between triumvirs" },
    { line: 20, phrase: "parley", definition: "a formal conference between opposing commanders before battle, under flag of truce" },
    { line: 23, phrase: "answer on their charge", definition: "respond when they attack" },
    { line: 33, phrase: "Hybla bees", definition: "bees from Mount Hybla in Sicily — proverbial for producing the sweetest honey" },
    { line: 37, phrase: "threat before you sting", definition: "bees buzz before stinging — Brutus's image for Antony's rhetoric" },
    { line: 42, phrase: "damned Casca, like a cur, behind", definition: "damned Casca struck from behind like a dog — Antony's version of the assassination, emphasizing cowardice" },
    { line: 52, phrase: "three and thirty wounds", definition: "Caesar's wound-count per Plutarch (who also gives 23 in another place); Shakespeare rounds up. The precise number mattered to Roman historians as a measure of ritualised violence" },
    { line: 58, phrase: "noblest of thy strain", definition: "noblest of your family stock" },
    { line: 60, phrase: "peevish schoolboy", definition: "petulant schoolboy — Cassius's contempt for Octavius, who was 19; the dismissal proves catastrophic, as Octavius becomes Augustus" },
    { line: 61, phrase: "masker and a reveller", definition: "a party-goer and carouser — Antony's public reputation for loose living" },
    { line: 66, phrase: "swell billow and swim bark", definition: "let the wave swell and the ship sail — nautical surrender to fortune" },
    { line: 67, phrase: "all is on the hazard", definition: "everything is at stake on the throw" },
    { line: 72, phrase: "birth-day", definition: "Cassius's birthday — October 23 per Plutarch; he fights Philippi on his own birthday and dies on it" },
    { line: 75, phrase: "As Pompey was", definition: "as Pompey was at Pharsalus (48 BCE) — compelled against his tactical judgment to stake everything on a single battle against Caesar. Cassius consciously invokes the precedent of the defeated side" },
    { line: 77, phrase: "Epicurus", definition: "Greek philosopher (341–270 BCE); his school rejected divine intervention and dismissed portents as superstition. Cassius is abandoning his Epicureanism in the face of the eagles' flight" },
    { line: 80, phrase: "former ensign", definition: "the leading standard of the army" },
    { line: 81, phrase: "Two mighty eagles", definition: "eagles perching on standards were an auspicious Roman omen; their departure is disastrous. Plutarch reports this incident" },
    { line: 85, phrase: "ravens, crows and kites", definition: "carrion birds — scavengers of battlefield dead; their presence is the Roman worst omen for an army" },
    { line: 88, phrase: "canopy most fatal", definition: "a most death-bringing canopy — the shadow of carrion birds overhead" },
    { line: 89, phrase: "give up the ghost", definition: "die; yield up life" },
    { line: 95, phrase: "Lovers in peace", definition: "devoted friends in peacetime — Elizabethan 'lover' again; Cassius hopes they may live to old age as friends (not romantically)" },
    { line: 102, phrase: "Cato", definition: "Marcus Porcius Cato the Younger, Portia's father; committed suicide at Utica in 46 BCE rather than submit to Caesar. Brutus's in-law and model of Stoic self-killing" },
    { line: 104, phrase: "cowardly and vile", definition: "Brutus once considered suicide cowardly; he is about to revise his position (and does — he kills himself in 5.5)" },
    { line: 106, phrase: "arming myself with patience", definition: "steeling myself with patience — the Stoic virtue" },
    { line: 107, phrase: "stay the providence of some high powers", definition: "await the decision of higher powers — Providence rather than self-determination" },
    { line: 109, phrase: "led in triumph", definition: "paraded as a defeated general in the victor's triumphal procession through Rome — a public humiliation that preceded execution" },
    { line: 114, phrase: "end that work the ides of March begun", definition: "finish what the assassination began — Brutus expects to die, closing the circle" },
    { line: 117, phrase: "Forever, and forever, farewell", definition: "Brutus and Cassius's formal parting — the play's most affecting private moment between them" },
  ];

  // ── 5.2 — The field of battle. Brutus's order ──────────────────────
  GLOSSES.julius_caesar_act5_scene2 = [
    { line: 1, phrase: "bills", definition: "written orders; dispatches" },
    { line: 2, phrase: "alarum", definition: "a call to arms; a trumpet signal for battle" },
    { line: 4, phrase: "cold demeanour", definition: "lack of aggression; cold fighting spirit" },
    { line: 5, phrase: "sudden push", definition: "a swift charge" },
  ];

  // ── 5.3 — Another part of the field. Cassius and Titinius die ──────
  GLOSSES.julius_caesar_act5_scene3 = [
    { line: 1, phrase: "the villains fly", definition: "Cassius's own troops are fleeing — his left wing has broken" },
    { line: 3, phrase: "ensign", definition: "standard-bearer; here, the man carrying the legionary standard" },
    { line: 7, phrase: "fell to spoil", definition: "stopped to loot — a classical tactical error; Brutus's men were plundering Octavius's camp instead of pressing the attack" },
    { line: 12, phrase: "This hill is far enough", definition: "Cassius halts his retreat — the battlefield vantage from which he mistakes Titinius's capture for death" },
    { line: 21, phrase: "sight was ever thick", definition: "my eyesight has always been poor — the visual error that causes his suicide" },
    { line: 23, phrase: "This day I breathed first", definition: "today is my birthday (echoing 5.1); now I die on the day I was born" },
    { line: 25, phrase: "life is run his compass", definition: "my life has run its full circle" },
    { line: 36, phrase: "Parthia", definition: "the Parthian Empire east of Rome (modern Iran); Cassius campaigned there under Crassus in 53 BCE, where Pindarus became his prisoner" },
    { line: 41, phrase: "That ran through Caesar's bowels", definition: "the very sword Cassius used to kill Caesar — now turned upon himself; a perfect Roman poetic justice" },
    { line: 44, phrase: "Caesar, thou art revenged", definition: "Caesar is avenged — Cassius acknowledges the moral symmetry of his death" },
    { line: 50, phrase: "change", definition: "turn of fortune; reverse — Messala's mistaken good news" },
    { line: 58, phrase: "Cassius is no more", definition: "Cassius is dead (announced by Titinius)" },
    { line: 59, phrase: "setting sun", definition: "the evening sun — classical image for a great man's death; Julius Caesar was called the sun of Rome; now so is Cassius" },
    { line: 61, phrase: "sun of Rome is set", definition: "Rome's great day has ended — Titinius's lament for Cassius extends the solar metaphor to the Republic itself" },
    { line: 63, phrase: "Mistrust of my success hath done this deed", definition: "distrust in my victory caused this — Cassius's misreading of Titinius's fate killed him" },
    { line: 65, phrase: "melancholy's child", definition: "melancholy's offspring — error as the child of a morbid temperament" },
    { line: 79, phrase: "crown'd dead Cassius", definition: "placed a victory-wreath on Cassius's head — Titinius's last service before killing himself" },
    { line: 86, phrase: "Roman's part", definition: "the Roman role — Stoic suicide as performance of Roman virtue" },
    { line: 94, phrase: "spirit walks abroad", definition: "the ghost roams free — Caesar's revenge is spreading" },
    { line: 94, phrase: "In our own proper entrails", definition: "in our very own guts — we are killing ourselves; the suicides of 5.3 continue in 5.5" },
    { line: 98, phrase: "last of all the Romans", definition: "Brutus's epitaph for Cassius — the last true Roman of the old school; an elegy for the Republic itself. The play argues through Brutus that the Republic died with Cassius" },
    { line: 103, phrase: "Thasos", definition: "Greek island in the north Aegean, not far from Philippi; Brutus sends Cassius's body there for burial" },
    { line: 105, phrase: "discomfort us", definition: "dishearten our troops (not modern 'discomfort')" },
  ];

  // ── 5.4 — Another part of the field. Cato, Lucilius ────────────────
  GLOSSES.julius_caesar_act5_scene4 = [
    { line: 2, phrase: "bastard", definition: "no true Roman; one not born of Roman stock (Cato's taunt)" },
    { line: 4, phrase: "son of Marcus Cato", definition: "young Cato, Portia's brother, Cato the Younger's son; he dies at Philippi" },
    { line: 5, phrase: "foe to tyrants", definition: "Cato's family slogan; the inherited republican identity" },
    { line: 7, phrase: "I am Brutus, Marcus Brutus, I", definition: "Lucilius pretends to be Brutus, drawing fire away from the real Brutus; Plutarch records this ruse" },
    { line: 12, phrase: "Only I yield to die", definition: "I yield only to die (not as a captive)" },
    { line: 21, phrase: "The gods defend him from so great a shame", definition: "may the gods keep Brutus from the shame of being taken alive — Lucilius's plea that Brutus has died freely" },
    { line: 26, phrase: "A prize no less in worth", definition: "Antony recognises Lucilius's loyalty as itself valuable — an act of mercy that characterises him" },
  ];

  // ── 5.5 — Another part of the field. Brutus's suicide (TIER 1) ─────
  GLOSSES.julius_caesar_act5_scene5 = [
    { line: 1, phrase: "poor remains of friends", definition: "the few friends left; the remnant" },
    { line: 2, phrase: "Statilius show'd the torch-light", definition: "Statilius signalled with a torch that the other wing of the army was still whole — his failure to return meant the news was bad" },
    { line: 4, phrase: "slaying is the word", definition: "killing is the order of the day" },
    { line: 12, phrase: "noble vessel full of grief", definition: "noble man filled with grief — Clitus's image for Brutus as a vessel overflowing" },
    { line: 16, phrase: "ghost of Caesar hath appear'd to me", definition: "Caesar's Ghost, which Brutus first saw in 4.3, has returned — at Philippi, as the Ghost foretold. The prophecy is fulfilled" },
    { line: 17, phrase: "Sardis once", definition: "the visitation in 4.3 at Sardis" },
    { line: 19, phrase: "I know my hour is come", definition: "I know my death is at hand — the Stoic's acceptance" },
    { line: 22, phrase: "beat us to the pit", definition: "driven us into the pit like hunted animals — the boar-hunt metaphor" },
    { line: 23, phrase: "more worthy to leap in ourselves / Than tarry till they push us", definition: "more honourable to kill ourselves than wait for the enemy to do it — Brutus's revised position on suicide, abandoning 5.1's stance" },
    { line: 27, phrase: "Hold thou my sword-hilts", definition: "the Roman suicide method: a friend holds the sword while you run onto the point. A ritualised, honourable death" },
    { line: 35, phrase: "glory by this losing day", definition: "honour from this day of defeat — Brutus's final Stoic claim: honour lies in the manner of losing" },
    { line: 37, phrase: "vile conquest", definition: "base victory — Brutus dismisses the triumvirs' win as dishonourable" },
    { line: 45, phrase: "smatch of honour", definition: "a taste of honour; some measure of it" },
    { line: 49, phrase: "Runs on his sword", definition: "Brutus's suicide, achieved with Strato's help — the model Roman death: honourable, voluntary, assisted by a faithful servant" },
    { line: 49, phrase: "Caesar, now be still", definition: "Caesar, now rest quiet — Brutus addresses Caesar's spirit; his death lays the ghost" },
    { line: 50, phrase: "I kill'd not thee with half so good a will", definition: "I killed you with less willingness than I now kill myself — the play's most devastating half-line; Brutus's admission at the end that Caesar's murder was the harder deed" },
    { line: 55, phrase: "Brutus only overcame himself", definition: "Brutus alone defeated Brutus — Strato's epitaph; honourable self-conquest" },
    { line: 61, phrase: "prefer me to you", definition: "recommend me to your service" },
    { line: 66, phrase: "noblest Roman of them all", definition: "Antony's epitaph for Brutus — the play's most famous closing tribute. But note: Antony is consolidating power even while eulogizing; the generosity is also political theatre, binding former enemies to the new regime" },
    { line: 68, phrase: "in envy of great Caesar", definition: "out of jealousy of Caesar — Antony exempts Brutus alone from this charge, preserving the myth of the idealistic assassin" },
    { line: 69, phrase: "general honest thought", definition: "an honest concern for the general good" },
    { line: 71, phrase: "elements / So mix'd in him", definition: "the four elements (earth, water, air, fire) were thought to compose the human constitution; 'well-mixed' meant temperamentally balanced; a Renaissance paean to the ideal man" },
    { line: 73, phrase: "This was a man!", definition: "here was a true man — Antony's closing valuation. Within fifteen years of this speech (by 27 BCE), the young Octavius will have become Augustus, first emperor; the Republic the conspirators sought to preserve will be gone. Antony's generosity to Brutus coincides with the Republic's end" },
    { line: 75, phrase: "rites of burial", definition: "proper funeral ceremonies" },
    { line: 77, phrase: "order'd honourably", definition: "arranged with honour; a soldier's funeral" },
    { line: 79, phrase: "part the glories", definition: "divide the spoils of victory — the triumvirs (eventually just Octavius) will carve up the Roman world. The play ends with the partition that makes Augustan rule possible" },
  ];

};
