/**
 * Julius Caesar — Act III glosses.
 * Attaches to the GLOSSES map in seed-julius-caesar-glosses.ts.
 *
 * 3.1 (TIER 1): the assassination. Caesar's "constant as the northern star"
 * immediately before being killed; "Et tu, Brute"; Antony's grief and
 * "Cry havoc!" vow; the servant from Octavius.
 *
 * 3.2 (TIER 1): the two funeral orations — the rhetorical centre of the
 * play. Brutus speaks first in PROSE (philosophical, sincere, abstract:
 * "Not that I loved Caesar less, but that I loved Rome more"); Antony
 * speaks second in VERSE (strategic, incendiary, concrete: will, mantle,
 * wounds). Key glosses:
 *   - "lovers" (L11) in the Elizabethan sense of devoted friends — NOT
 *     romantic. The single most load-bearing correction in the play.
 *   - "ambitious" (L23) carrying Elizabethan political-vice weight,
 *     heavier than modern usage.
 *   - "honourable" (L75, first instance) noting the ironic accumulation
 *     — by the end of the speech the word has become an accusation.
 *   - "Et tu, Brute" (3.1 L75) noting the textual history.
 *
 * 3.3: Cinna the Poet is torn apart by the mob for his name; a scene of
 * mistaken identity and self-referentiality (Shakespeare commenting on
 * poets in political crisis).
 */

interface SeedGloss { line: number; phrase: string; definition: string; }

module.exports = function (GLOSSES: Record<string, SeedGloss[]>) {

  // ── 3.1 — Before the Capitol. The assassination (TIER 1) ───────────
  GLOSSES.julius_caesar_act3_scene1 = [
    { line: 1, phrase: "ides of March are come", definition: "Caesar's taunt to the Soothsayer — implying the feared day has arrived without harm; the Soothsayer's reply 'but not gone' completes the prophecy's edge" },
    { line: 2, phrase: "schedule", definition: "a written petition; a scroll (Artemidorus's warning letter)" },
    { line: 3, phrase: "o'er-read", definition: "read over; peruse" },
    { line: 7, phrase: "What touches us ourself shall be last served", definition: "Caesar's fatal hubris — putting his own safety last, from a public-service ideology that costs him his life" },
    { line: 9, phrase: "Sirrah", definition: "fellow (condescending address to a social inferior)" },
    { line: 12, phrase: "enterprise", definition: "undertaking — here euphemistic for the assassination plot" },
    { line: 18, phrase: "prevention", definition: "being forestalled; having the plot stopped before executed" },
    { line: 21, phrase: "constant", definition: "steadfast; resolute — the Stoic virtue; repeatedly invoked as Cassius slips into panic" },
    { line: 27, phrase: "presently prefer his suit", definition: "immediately present his petition" },
    { line: 29, phrase: "rears your hand", definition: "raises your hand (first to strike)" },
    { line: 32, phrase: "puissant", definition: "powerful; mighty (from French)" },
    { line: 35, phrase: "couchings", definition: "bowings; prostrations (physical obeisance)" },
    { line: 37, phrase: "pre-ordinance and first decree", definition: "established law and original decree — the fixed constitutional order" },
    { line: 38, phrase: "fond", definition: "foolish (not modern 'loving')" },
    { line: 42, phrase: "spaniel-fawning", definition: "fawning like a spaniel dog — obsequious flattery" },
    { line: 42, phrase: "Low-crooked court'sies", definition: "low bows with bent knees; Renaissance court etiquette" },
    { line: 45, phrase: "spurn thee like a cur", definition: "kick you aside like a mongrel dog" },
    { line: 46, phrase: "Caesar doth not wrong, nor without cause", definition: "Caesar does no wrong, and not without cause — Jonson famously ridiculed this line as self-contradicting; it has been emended since the 18th century" },
    { line: 56, phrase: "enfranchisement", definition: "restoration of citizenship; granting of political rights (for an exile, the undoing of banishment)" },
    { line: 59, phrase: "constant as the northern star", definition: "steadfast as Polaris — Caesar claims absolute political stability; the boast is immediately refuted by 23 wounds" },
    { line: 60, phrase: "true-fix'd and resting quality", definition: "firmly-fixed and motionless character — the North Star alone does not move across the night sky" },
    { line: 61, phrase: "fellow in the firmament", definition: "equal among the stars" },
    { line: 66, phrase: "apprehensive", definition: "capable of understanding; sentient (not modern 'anxious')" },
    { line: 73, phrase: "lift up Olympus", definition: "move a whole mountain — Mount Olympus was the home of the gods; proverbial for impossible effort" },
    { line: 74, phrase: "bootless", definition: "in vain; without result" },
    { line: 75, phrase: "Speak, hands for me!", definition: "Casca's cry as he strikes first — the conspirators' agreed signal; 'hands' stand in for voice" },
    { line: 75, phrase: "Et tu, Brute", definition: "Latin: 'and you, Brutus?' — Caesar's famous dying reproach to Brutus. The phrasing is Shakespeare's invention; Suetonius reports Caesar spoke Greek, 'καὶ σύ, τέκνον' ('and you, child'); Plutarch says he said nothing but pulled his toga over his face. The exact Latin is Shakespeare's compressed, English-inflected formulation" },
    { line: 76, phrase: "Tyranny is dead", definition: "Cinna's slogan for the assassination — the conspirators frame the killing as the Republic reasserting itself against incipient monarchy" },
    { line: 78, phrase: "common pulpits", definition: "public speaking platforms (rostra) in the Forum, from which citizens addressed the crowd" },
    { line: 80, phrase: "ambition's debt", definition: "the death that ambition has earned — Brutus's first moralising of the killing" },
    { line: 82, phrase: "confounded", definition: "confused; bewildered" },
    { line: 94, phrase: "doomsday", definition: "the Last Judgment; the apocalypse — an anachronistic Christian image for pagan panic" },
    { line: 100, phrase: "abridged / His time of fearing death", definition: "shortened his time of fearing to die — Brutus's sophistical consolation" },
    { line: 102, phrase: "bathe our hands in Caesar's blood", definition: "wash our hands in Caesar's blood — Brutus's ritual sanctification of murder; an image that Antony will invert in 3.2" },
    { line: 108, phrase: "this our lofty scene", definition: "this noble scene of ours — Cassius imagines the assassination re-staged in future plays in unknown languages, a meta-theatrical gesture" },
    { line: 109, phrase: "accents yet unknown", definition: "languages not yet invented — a prophecy fulfilled by Shakespeare's own play" },
    { line: 111, phrase: "Pompey's basis", definition: "the pedestal of Pompey's statue, at whose base Caesar falls — poetic justice (Plutarch notes this detail)" },
    { line: 126, phrase: "vouchsafe", definition: "grant; deign to allow" },
    { line: 132, phrase: "Thorough", definition: "through" },
    { line: 132, phrase: "untrod state", definition: "uncertain, untested political condition" },
    { line: 140, phrase: "misgiving still / Falls shrewdly to the purpose", definition: "my forebodings hit the mark — Cassius's accurate instinct, which Brutus overrides" },
    { line: 148, phrase: "let blood", definition: "bled — a medical metaphor for killing, dark from Antony's point of view" },
    { line: 148, phrase: "rank", definition: "festering; needing to be bled (of an infected humour)" },
    { line: 154, phrase: "purpled hands do reek and smoke", definition: "bloody hands steam and smoke — the fresh blood still warm" },
    { line: 159, phrase: "choice and master spirits", definition: "select and chief spirits — the best men; Antony flatters the conspirators" },
    { line: 167, phrase: "pity to the general wrong of Rome", definition: "pity for the general wrong done to Rome — pity for the state overrode personal pity for Caesar" },
    { line: 169, phrase: "our swords have leaden points", definition: "our swords are blunted (not to be used against you)" },
    { line: 174, phrase: "disposing of new dignities", definition: "distributing new offices — Cassius promises Antony a share in the spoils" },
    { line: 184, phrase: "Cinna", definition: "Cinna the conspirator — to be distinguished from Cinna the Poet of 3.3" },
    { line: 185, phrase: "Though last, not least in love", definition: "proverbial; Antony's ritual handclasp with each conspirator in turn" },
    { line: 189, phrase: "coward or a flatterer", definition: "Antony pretends to fear being thought one or the other — his false humility" },
    { line: 195, phrase: "corse", definition: "corpse" },
    { line: 200, phrase: "bay'd, brave hart", definition: "brought to bay, brave stag — the hunting metaphor; pun on hart/heart" },
    { line: 201, phrase: "hunters stand", definition: "the huntsmen stand around their kill (the conspirators positioned around Caesar)" },
    { line: 202, phrase: "Sign'd in thy spoil", definition: "marked with your blood; badged with the kill (a hunting ritual in which hunters dip their fingers in the stag's blood)" },
    { line: 202, phrase: "crimson'd in thy lethe", definition: "stained crimson in your life's blood ('lethe' = life-blood, obsolete usage; not the river Lethe of forgetfulness)" },
    { line: 205, phrase: "deer, strucken by many princes", definition: "deer struck down by many princes — extending the hunt metaphor; puns again on deer/dear" },
    { line: 212, phrase: "prick'd in number of our friends", definition: "marked down on the list of our friends (a proscription metaphor)" },
    { line: 225, phrase: "pulpit", definition: "the Rostra, the public speaker's platform in the Forum" },
    { line: 226, phrase: "order of his funeral", definition: "the funeral ceremony; the rites" },
    { line: 239, phrase: "I know not what may fall", definition: "I don't know what may happen — Cassius's prescient unease" },
    { line: 250, phrase: "bleeding piece of earth", definition: "Caesar's corpse; 'earth' in the biblical sense of mortal clay" },
    { line: 251, phrase: "meek and gentle with these butchers", definition: "mild and civil with these slaughterers — Antony's true view, now spoken alone" },
    { line: 259, phrase: "Domestic fury and fierce civil strife", definition: "internal rage and savage civil war — Antony's prophecy, fulfilled in the historical civil wars of 44–31 BCE" },
    { line: 260, phrase: "cumber", definition: "encumber; burden; trouble" },
    { line: 264, phrase: "quarter'd", definition: "cut into four pieces; mutilated" },
    { line: 265, phrase: "custom of fell deeds", definition: "habituation to cruel deeds" },
    { line: 267, phrase: "Ate", definition: "Greek goddess of ruin, reckless impulse, and delusion — she brings on divine vengeance" },
    { line: 269, phrase: "Cry \"Havoc,\"", definition: "the medieval English battle-cry giving soldiers permission to plunder; proclaiming 'havoc' signalled no-quarter warfare. Shakespeare's military-technical anachronism" },
    { line: 269, phrase: "let slip the dogs of war", definition: "release the war-dogs (unleashed mastiffs); launch total war. The play's most-quoted declaration of civil strife" },
    { line: 271, phrase: "carrion men", definition: "dead men rotting unburied; corpses" },
    { line: 282, phrase: "seven leagues", definition: "about 21 miles — a league being roughly three miles" },
    { line: 287, phrase: "borne this corse / Into the market-place", definition: "carried Caesar's body to the Forum — the setting for the funeral oration to come" },
    { line: 290, phrase: "cruel issue", definition: "cruel outcome (of the murder)" },
  ];

  // ── 3.2 — The Forum. The two orations (TIER 1 — the play's rhetorical centre) ──
  GLOSSES.julius_caesar_act3_scene2 = [
    { line: 4, phrase: "part the numbers", definition: "divide the crowd into two parts (one to each speaker)" },
    { line: 10, phrase: "severally we hear", definition: "separately, one at a time, we hear" },
    { line: 10, phrase: "noble Brutus is ascended", definition: "Brutus has climbed up (onto the Rostra, the speaker's platform)" },
    { line: 11, phrase: "lovers", definition: "dear friends; devoted allies. In Elizabethan usage 'lover' frequently means friend or well-wisher — not romantic. Brutus's 'Romans, countrymen, and lovers' is emphatically NOT the modern sense; modern readers who hear it as incongruous or comic have misread the word" },
    { line: 14, phrase: "censure me", definition: "judge me (not modern 'criticise')" },
    { line: 16, phrase: "Brutus' love to Caesar / was no less than his", definition: "my love for Caesar was no less than his friend's — Brutus's rhetorical premise" },
    { line: 18, phrase: "Not that I loved Caesar less, but that I loved Rome more", definition: "Brutus's most-quoted line; the perfect Stoic-republican formula that attempts to make assassination an act of higher love" },
    { line: 20, phrase: "bondman", definition: "slave; bondsman" },
    { line: 23, phrase: "ambitious, I slew him", definition: "Brutus makes 'ambition' the sole justification; in Elizabethan political vocabulary 'ambition' was a specific vice — ungoverned desire for authority — heavier in weight than modern 'ambition'. The charge is more damning than it sounds to a modern ear" },
    { line: 27, phrase: "rude", definition: "barbarous; uncivilised" },
    { line: 33, phrase: "enrolled in the Capitol", definition: "formally recorded in the public archives" },
    { line: 33, phrase: "extenuated", definition: "lessened; diminished — his virtues have not been downplayed" },
    { line: 34, phrase: "enforced", definition: "exaggerated; pressed hard — his faults have not been overstated" },
    { line: 38, phrase: "best lover", definition: "dearest friend — again the Elizabethan sense, not romantic" },
    { line: 42, phrase: "Bring him with triumph home", definition: "bring him home in triumph — the Citizens propose for Brutus the very honour the tribunes rebuked for Caesar in 1.1" },
    { line: 44, phrase: "Let him be Caesar", definition: "the crowd's spontaneous collapse of principle — Brutus has just killed a man for being on the road to Caesarhood; they immediately propose Brutus as Caesar. Shakespeare's sharp moment on democratic volatility" },
    { line: 44, phrase: "Caesar's better parts / Shall be crown'd in Brutus", definition: "Caesar's good qualities shall be crowned in Brutus — the crowd simply transfers the crown-impulse" },
    { line: 58, phrase: "beholding", definition: "obliged; indebted (older form of 'beholden')" },
    { line: 62, phrase: "Caesar was a tyrant", definition: "the First Citizen's firm conviction at this moment — which Antony's speech will reverse" },
    { line: 66, phrase: "Friends, Romans, countrymen, lend me your ears", definition: "Antony's famous opening — 'lend me your ears' is idiom for 'give me your attention.' In context this is strategic manipulation, not sincere address: Antony is asking permission to speak from a crowd that already hates him, establishing false humility before systematically dismantling Brutus's justification" },
    { line: 67, phrase: "bury Caesar, not to praise him", definition: "Antony's opening disclaimer — which the entire rest of the speech contradicts. The structural irony of denying he is making a speech while making the greatest speech in the play" },
    { line: 69, phrase: "interred with their bones", definition: "buried with the dead man's bones; forgotten with the corpse" },
    { line: 71, phrase: "Brutus / Hath told you Caesar was ambitious", definition: "Antony sets up his refrain; 'ambitious' will be the word he dismantles" },
    { line: 72, phrase: "grievous fault", definition: "serious failing" },
    { line: 75, phrase: "Brutus is an honourable man", definition: "Antony's refrain. Each of the six repetitions lowers the word's credit; by the end 'honourable' has become an accusation of hypocrisy. Shakespeare shows how repetition, stripped of tonal sincerity, can reverse a word's meaning" },
    { line: 82, phrase: "general coffers", definition: "the public treasury" },
    { line: 85, phrase: "Ambition should be made of sterner stuff", definition: "Antony's pivot — real ambition is tougher than this; if Caesar wept at the poor, he was no ambitious tyrant" },
    { line: 88, phrase: "Lupercal", definition: "the Lupercalian festival of 1.2, where Antony offered Caesar the crown three times" },
    { line: 89, phrase: "thrice presented him a kingly crown", definition: "three times offered him a crown — Casca's report in 1.2 restaged as evidence of Caesar's moderation" },
    { line: 97, phrase: "O judgment! thou art fled to brutish beasts", definition: "judgment has fled to wild animals — men have lost their reason" },
    { line: 100, phrase: "must pause till it come back to me", definition: "Antony's calculated theatrical pause — false emotion as persuasive device" },
    { line: 121, phrase: "parchment with the seal of Caesar", definition: "a document under Caesar's official seal — his will" },
    { line: 122, phrase: "closet", definition: "private study" },
    { line: 123, phrase: "testament", definition: "last will and testament" },
    { line: 126, phrase: "dip their napkins in his sacred blood", definition: "dip handkerchiefs in his blood — the relic-hunting of martyrs' blood, transferred from Christian practice onto Caesar" },
    { line: 128, phrase: "Bequeathing it as a rich legacy", definition: "leaving it in their own wills as a treasure" },
    { line: 134, phrase: "meet", definition: "fitting; proper" },
    { line: 143, phrase: "o'ershot myself", definition: "overreached; spoken more than I meant to" },
    { line: 149, phrase: "ring about the corpse", definition: "circle around the body" },
    { line: 160, phrase: "mantle", definition: "a cloak; Caesar's outer garment, worn over the toga — bloodied and torn by the daggers. The mantle becomes Antony's physical prop for grief" },
    { line: 163, phrase: "overcame the Nervii", definition: "defeated the Nervii — a Belgic tribe Caesar conquered in 57 BCE; detail from Plutarch, though the 'mantle' anecdote is Shakespeare's invention" },
    { line: 164, phrase: "Cassius' dagger", definition: "Antony's fiction — he cannot know whose dagger made which cut, but the naming makes the wounds personal" },
    { line: 165, phrase: "envious Casca", definition: "malicious Casca; the striker of the first blow" },
    { line: 167, phrase: "cursed steel", definition: "accursed blade" },
    { line: 170, phrase: "unkindly knock'd", definition: "knocked in an unnatural way — pun on kin/kind; betrayal of family-blood feeling" },
    { line: 171, phrase: "Caesar's angel", definition: "Caesar's beloved — Brutus as Caesar's guardian spirit or dearest one" },
    { line: 173, phrase: "most unkindest cut of all", definition: "the cruellest cut — from the 'unkind' (unnatural/unkinned) Brutus; the line enters the language" },
    { line: 177, phrase: "mantle muffling up his face", definition: "covering his face with the cloak — Plutarch's detail; Caesar shrouded himself as he fell" },
    { line: 178, phrase: "Pompey's statua", definition: "Pompey's statue — Caesar fell beneath the statue of his defeated rival; Plutarch notes the fit of revenge" },
    { line: 182, phrase: "bloody treason flourish'd over us", definition: "bloody betrayal triumphed over us" },
    { line: 184, phrase: "dint of pity", definition: "the stroke/stamp of pity; pity's mark" },
    { line: 186, phrase: "vesture", definition: "garment; clothing" },
    { line: 195, phrase: "mutiny", definition: "rebellion; uprising (against authority)" },
    { line: 201, phrase: "I am no orator, as Brutus is", definition: "Antony's crowning false humility — while delivering what will become the most-taught example of public rhetoric in English" },
    { line: 202, phrase: "plain blunt man", definition: "Antony's pose of rustic directness; the opposite of what he is" },
    { line: 205, phrase: "neither wit, nor words, nor worth", definition: "no intelligence, no words, no value — a fisherman's disclaimer from a master rhetorician" },
    { line: 207, phrase: "speak right on", definition: "speak straightforwardly (yet another false claim)" },
    { line: 212, phrase: "ruffle up your spirits", definition: "stir your emotions; rouse you" },
    { line: 214, phrase: "stones of Rome to rise and mutiny", definition: "the very stones of Rome would rebel — the classical trope of hyperbolic civic outrage" },
    { line: 226, phrase: "seventy-five drachmas", definition: "a drachma was a Greek silver coin; roughly a Roman denarius; 75 denarii represented several weeks' labour — a substantial individual bequest" },
    { line: 231, phrase: "private arbours", definition: "enclosed gardens and groves" },
    { line: 232, phrase: "On this side Tiber", definition: "on the Roman (east) bank of the Tiber — Caesar's pleasure-grounds willed to the citizens" },
    { line: 234, phrase: "recreate yourselves", definition: "refresh yourselves; take recreation" },
    { line: 238, phrase: "brands", definition: "burning sticks; firebrands" },
    { line: 240, phrase: "forms", definition: "benches; long seats" },
    { line: 241, phrase: "Mischief, thou art afoot", definition: "mischief is now loose and moving — Antony's grim satisfaction as the mob runs riot" },
    { line: 248, phrase: "Fortune is merry", definition: "Fortune (the goddess of chance) is in a generous mood" },
    { line: 252, phrase: "Belike", definition: "probably; it seems likely" },
  ];

  // ── 3.3 — A street. Cinna the Poet ─────────────────────────────────
  GLOSSES.julius_caesar_act3_scene3 = [
    { line: 2, phrase: "things unluckily charge my fantasy", definition: "ill-omened things burden my imagination" },
    { line: 6, phrase: "married man or a bachelor", definition: "the Citizens' absurd catechism — a parody of Roman legal examination, played for dark comedy" },
    { line: 14, phrase: "bear me a bang", definition: "receive a blow from me — the Citizen's crude threat" },
    { line: 20, phrase: "conspirator", definition: "Cinna the *conspirator* is in the play (1.3, 3.1); Cinna the *poet* is a real historical figure (Gaius Helvius Cinna, contemporary of Catullus); the crowd confuses them and murders the wrong Cinna" },
    { line: 21, phrase: "Cinna the poet", definition: "the historical poet Helvius Cinna, author of the lost epyllion *Zmyrna*; actually killed by the mob at Caesar's funeral per Plutarch. Not the conspirator" },
    { line: 22, phrase: "Tear him for his bad verses", definition: "the absurd excuse — once his name is established they need another reason. Shakespeare's self-referential glance at the poet's precarious place in political crisis" },
    { line: 25, phrase: "turn him going", definition: "send him off; drive him away" },
    { line: 26, phrase: "brands", definition: "firebrands" },
  ];

};
