/**
 * Julius Caesar — Act II glosses.
 * Attaches to the GLOSSES map in seed-julius-caesar-glosses.ts.
 *
 * 2.1 is Tier-1: Brutus's garden soliloquy ("It must be by his death"),
 * the oath refusal, the Portia scene (wounded thigh, Cato's daughter).
 * 2.2 mirrors 2.1 structurally: Calpurnia pleading with Caesar to stay
 * home; Decius manipulating Caesar out of the dream. 2.3 is Artemidorus's
 * warning letter. 2.4 is Portia's anxious vigil with the Soothsayer.
 *
 * Key load-bearing glosses:
 *   - "Clock strikes" (2.1 after L191) — anachronism; mechanical clocks
 *     didn't exist until c. 1300 CE. Glossed at "clock hath stricken three"
 *   - "unbraced" (2.1, 2.2) — doublet unlaced; another Renaissance costume
 *     anachronism
 *   - "augurers" (2.2), "entrails of an offering" — Roman divination
 *   - "Cato's daughter" (2.1) — Portia's philosophical lineage (Stoic)
 */

interface SeedGloss { line: number; phrase: string; definition: string; }

module.exports = function (GLOSSES: Record<string, SeedGloss[]>) {

  // ── 2.1 — Brutus's orchard. Garden soliloquy; oath; Portia (TIER 1) ──
  GLOSSES.julius_caesar_act2_scene1 = [
    { line: 7, phrase: "taper", definition: "slender candle" },
    { line: 11, phrase: "spurn at", definition: "kick at; lash out against" },
    { line: 12, phrase: "for the general", definition: "for the common good; for the general public" },
    { line: 14, phrase: "bright day that brings forth the adder", definition: "warm weather brings out the snake — Brutus arguing that Caesar's crown would activate latent tyranny" },
    { line: 15, phrase: "craves wary walking", definition: "demands that we walk carefully" },
    { line: 19, phrase: "disjoins Remorse from power", definition: "separates pity/conscience from political authority" },
    { line: 21, phrase: "common proof", definition: "commonly-demonstrated truth" },
    { line: 22, phrase: "lowliness is young ambition's ladder", definition: "humility is the rung by which a rising ambitious man climbs — a Plutarchan proverb" },
    { line: 24, phrase: "upmost round", definition: "topmost rung of the ladder" },
    { line: 26, phrase: "base degrees", definition: "lower rungs; humble beginnings" },
    { line: 27, phrase: "So Caesar may", definition: "the turning-point of Brutus's argument — he reasons from what Caesar 'may' do, not from what he has done; a logical weakness" },
    { line: 28, phrase: "lest he may, prevent", definition: "to prevent what he might do — Brutus convinces himself to act on hypothetical, not actual, cause" },
    { line: 29, phrase: "quarrel", definition: "cause for dispute; grievance" },
    { line: 30, phrase: "Fashion it thus", definition: "frame the argument this way" },
    { line: 32, phrase: "serpent's egg", definition: "a snake-egg — kill the threat before it hatches into something deadly" },
    { line: 35, phrase: "closet", definition: "private study; small inner room" },
    { line: 36, phrase: "flint", definition: "a piece of flint for striking sparks — the period's means of lighting a candle" },
    { line: 40, phrase: "ides of March", definition: "March 15 — the assassination date" },
    { line: 43, phrase: "exhalations", definition: "meteors; fiery vapours believed to rise from the earth and ignite in the sky" },
    { line: 46, phrase: "Speak, strike, redress", definition: "the forged letter's command — speak out, strike (kill Caesar), set things right" },
    { line: 53, phrase: "Tarquin", definition: "Tarquinius Superbus, the last Roman king; expelled in 509 BCE by Lucius Junius Brutus (Marcus's legendary ancestor); his expulsion founded the Roman Republic" },
    { line: 58, phrase: "March is wasted fourteen days", definition: "fourteen days of March have passed — it is therefore March 15, the Ides" },
    { line: 60, phrase: "whet me against", definition: "sharpened my resolve against (as one whets a blade)" },
    { line: 64, phrase: "phantasma", definition: "phantasm; nightmarish hallucination" },
    { line: 65, phrase: "Genius and the mortal instruments", definition: "guiding spirit and the physical body/faculties — Neoplatonic psychology; the interval between impulse and action" },
    { line: 67, phrase: "little kingdom", definition: "the self conceived as a miniature polity — the body-politic metaphor turned inward" },
    { line: 68, phrase: "insurrection", definition: "rebellion within a state — here, a rebellion within the self" },
    { line: 71, phrase: "moe", definition: "more (archaic)" },
    { line: 73, phrase: "pluck'd about their ears", definition: "pulled down over their ears — hats pulled low to disguise identity" },
    { line: 76, phrase: "mark of favour", definition: "distinguishing feature of the face" },
    { line: 79, phrase: "evils are most free", definition: "when wickedness is least constrained — i.e. by night" },
    { line: 84, phrase: "Erebus", definition: "in Greek mythology, the primordial deity of darkness; the dark region of the underworld between earth and Hades" },
    { line: 85, phrase: "prevention", definition: "being forestalled; being stopped before acting" },
    { line: 99, phrase: "watchful cares", definition: "anxious concerns that keep one awake" },
    { line: 104, phrase: "fret the clouds", definition: "streak or etch the clouds (as a carved frieze)" },
    { line: 115, phrase: "sufferance of our souls", definition: "the patient endurance of our spirits — what we have endured" },
    { line: 116, phrase: "break off betimes", definition: "stop now, in good time" },
    { line: 118, phrase: "high-sighted tyranny", definition: "soaring, far-ranging tyranny — like a high-flying hawk surveying its prey" },
    { line: 119, phrase: "drop by lottery", definition: "fall one by one as chosen by chance — under tyrannical proscription" },
    { line: 126, phrase: "palter", definition: "prevaricate; equivocate; break faith" },
    { line: 129, phrase: "cautelous", definition: "cautious; wary; deceitful" },
    { line: 130, phrase: "carrions", definition: "decaying bodies; metaphor for worn-out men" },
    { line: 134, phrase: "insuppressive mettle", definition: "unconquerable spirit (mettle = essential character; pun on metal)" },
    { line: 138, phrase: "several bastardy", definition: "a separate act of bastardry — each Roman's blood is dishonoured if he breaks his word" },
    { line: 141, phrase: "sound him", definition: "test his willingness; probe his opinion" },
    { line: 144, phrase: "silver hairs", definition: "grey hair — sign of venerable age" },
    { line: 149, phrase: "gravity", definition: "dignity; solemn authority of age" },
    { line: 150, phrase: "break with him", definition: "tell him (the secret); open the matter to him" },
    { line: 155, phrase: "well urged", definition: "well argued; a good point" },
    { line: 158, phrase: "shrewd contriver", definition: "cunning schemer" },
    { line: 160, phrase: "annoy us all", definition: "injure or harm us all (stronger than modern 'annoy')" },
    { line: 164, phrase: "Like wrath in death and envy afterwards", definition: "as though killing Caesar in rage and then dismembering his corpse in malice" },
    { line: 166, phrase: "sacrificers, but not butchers", definition: "we perform a religious sacrifice, not a slaughter — Brutus's self-deception about the assassination's moral character" },
    { line: 173, phrase: "carve him as a dish fit for the gods", definition: "slay Caesar as a ceremonial offering — elevated, sanctified violence" },
    { line: 180, phrase: "purgers", definition: "purifiers; those who cleanse the body politic (a surgical metaphor)" },
    { line: 184, phrase: "ingrafted", definition: "deeply rooted; grafted in (as a tree-graft)" },
    { line: 191, phrase: "clock hath stricken three", definition: "mechanical clocks are anachronistic — they didn't exist until c. 1300 CE, some 1,350 years after the play's setting. Shakespeare's Rome is deliberately English-inflected" },
    { line: 195, phrase: "superstitious grown", definition: "become superstitious" },
    { line: 197, phrase: "fantasy, of dreams and ceremonies", definition: "imagination, dreams, and religious rituals" },
    { line: 200, phrase: "augurers", definition: "Roman priests who divined the will of the gods by reading bird-flight, entrails, and other signs" },
    { line: 204, phrase: "unicorns may be betray'd with trees", definition: "unicorns were said to be caught by provoking them to charge at a tree, where their horn stuck fast — a fable Decius claims Caesar enjoys" },
    { line: 206, phrase: "toils", definition: "nets; snares" },
    { line: 210, phrase: "give his humour the true bent", definition: "bend his mood in the right direction — manipulate him correctly" },
    { line: 213, phrase: "uttermost", definition: "the latest (time); the outside limit" },
    { line: 215, phrase: "Caius Ligarius doth bear Caesar hard", definition: "Caius Ligarius holds a grudge against Caesar" },
    { line: 216, phrase: "rated him", definition: "scolded him; rebuked him" },
    { line: 220, phrase: "fashion him", definition: "shape him to our purpose; win him over" },
    { line: 225, phrase: "put on our purposes", definition: "reveal our intentions by our faces" },
    { line: 227, phrase: "formal constancy", definition: "the measured self-possession of a stage actor — Brutus invokes Roman theatre as model for political dissembling" },
    { line: 230, phrase: "honey-heavy dew of slumber", definition: "heavy sweet dew of sleep — Brutus's envy of the boy's untroubled sleep" },
    { line: 231, phrase: "figures", definition: "mental images; imaginings" },
    { line: 246, phrase: "wafture", definition: "wave (of the hand)" },
    { line: 250, phrase: "effect of humour", definition: "symptom of a bodily humour — a temporary mood tied to physiology" },
    { line: 262, phrase: "physical", definition: "medicinal; health-giving" },
    { line: 262, phrase: "unbraced", definition: "with doublet unlaced and open at the chest — the Renaissance garment again, not a Roman toga" },
    { line: 266, phrase: "rheumy and unpurged air", definition: "damp, disease-carrying air before the sun has cleaned it" },
    { line: 271, phrase: "charm you", definition: "entreat; solemnly adjure (not modern 'charm')" },
    { line: 273, phrase: "incorporate and make us one", definition: "united us into one body — the marriage vow" },
    { line: 285, phrase: "suburbs", definition: "the outskirts of a city — proverbially the location of brothels in Elizabethan London; Portia accuses Brutus of relegating her to the margins of his life" },
    { line: 287, phrase: "harlot", definition: "prostitute; whore" },
    { line: 289, phrase: "ruddy drops", definition: "drops of red blood" },
    { line: 295, phrase: "Cato's daughter", definition: "Portia is the daughter of Marcus Porcius Cato the Younger, the famous Roman Stoic philosopher and Caesar's chief senatorial opponent; her Stoic lineage is her claim to fortitude" },
    { line: 300, phrase: "voluntary wound", definition: "self-inflicted wound — Portia stabs her thigh (Plutarch, *Life of Brutus*) to prove her ability to bear pain and thus her husband's secrets" },
    { line: 301, phrase: "in the thigh", definition: "the wound Portia inflicted on her own thigh; a detail directly from North's Plutarch" },
    { line: 308, phrase: "charactery", definition: "what is written; the characters (letters) legible on a face" },
    { line: 314, phrase: "Vouchsafe", definition: "be pleased to grant; deign to accept" },
    { line: 316, phrase: "kerchief", definition: "a cloth tied around the head — sign of illness in the period" },
    { line: 323, phrase: "honourable loins", definition: "noble ancestry; descended from honourable stock" },
    { line: 324, phrase: "exorcist", definition: "one who raises spirits — not a modern exorcist (who expels), but a summoner" },
    { line: 325, phrase: "mortified spirit", definition: "deadened, subdued spirit" },
  ];

  // ── 2.2 — Caesar's house. Calpurnia's plea; Decius's manipulation ──
  GLOSSES.julius_caesar_act2_scene2 = [
    { line: 2, phrase: "Thrice hath Calpurnia in her sleep cried out", definition: "three times in sleep Calpurnia has shouted — a significant number in Roman augury" },
    { line: 5, phrase: "present sacrifice", definition: "immediate ritual offering — to read omens from the victim's entrails" },
    { line: 13, phrase: "stood on ceremonies", definition: "insisted on ritual observances; been superstitious" },
    { line: 17, phrase: "lioness hath whelped in the streets", definition: "a lioness has given birth in the streets — a Roman prodigy; such unnatural events portended disaster" },
    { line: 18, phrase: "graves have yawn'd", definition: "graves have opened wide (yawned) and given up their dead — the standard apocalyptic prodigy" },
    { line: 19, phrase: "fiery warriors fought upon the clouds", definition: "armies seen battling in the air — a portent recorded in Plutarch and classical historians for Caesar's death" },
    { line: 22, phrase: "hurtled", definition: "crashed; clashed noisily" },
    { line: 25, phrase: "beyond all use", definition: "beyond all common experience; outside the natural order" },
    { line: 30, phrase: "When beggars die, there are no comets seen", definition: "the heavens do not mark commoners' deaths with portents — only princes'. Calpurnia's political cosmology justifies her fear" },
    { line: 32, phrase: "Cowards die many times before their deaths", definition: "the cowardly imagine their death often before it comes — Caesar's famous line justifying reckless valour" },
    { line: 38, phrase: "augurers", definition: "Roman priests (augurs) who read signs from bird-flight, animal entrails, and weather" },
    { line: 40, phrase: "Plucking the entrails of an offering", definition: "tearing out the guts of a sacrificial animal — haruspicy, Roman divination from entrails" },
    { line: 41, phrase: "could not find a heart within the beast", definition: "the sacrificial animal had no heart — the worst possible omen in Roman augury; the heart was the seat of life" },
    { line: 47, phrase: "two lions litter'd in one day", definition: "twin lions born the same day — Caesar figures himself and Danger as twins, himself the elder" },
    { line: 50, phrase: "wisdom is consumed in confidence", definition: "your wisdom is swallowed up by overconfidence" },
    { line: 57, phrase: "for thy humour", definition: "to humour you; for your mood" },
    { line: 59, phrase: "all hail", definition: "formal greeting — 'hail to you all'" },
    { line: 68, phrase: "graybeards", definition: "old men (the senators)" },
    { line: 77, phrase: "statua", definition: "statue (Elizabethan Latinate variant spelling)" },
    { line: 79, phrase: "lusty", definition: "vigorous; hearty" },
    { line: 85, phrase: "vision fair and fortunate", definition: "a lucky, favourable dream" },
    { line: 88, phrase: "from you great Rome shall suck / Reviving blood", definition: "Rome will draw revitalising blood from Caesar — Decius's deliberate misreading, flattering Caesar as a saintly source of national life" },
    { line: 90, phrase: "tinctures, stains, relics and cognizance", definition: "colours, blood-marks, keepsakes and badges of office — the tokens believers took from a martyr's body; Decius turns the dream into sanctification" },
    { line: 98, phrase: "mock / Apt to be render'd", definition: "a mockery that is likely to be made" },
    { line: 114, phrase: "ague", definition: "fever, especially a malarial one with alternating chills" },
    { line: 117, phrase: "revels long o' nights", definition: "stays up late partying" },
    { line: 125, phrase: "aside and so near will I be", definition: "I will be aside but so near — Trebonius's ominous aside; he plans to detain Antony outside during the murder" },
    { line: 129, phrase: "That every like is not the same", definition: "a friend in appearance is not always a friend in fact — Brutus's mournful aside" },
  ];

  // ── 2.3 — A street near the Capitol. Artemidorus's warning letter ──
  GLOSSES.julius_caesar_act2_scene3 = [
    { line: 1, phrase: "Caesar, beware of Brutus", definition: "opening of Artemidorus's petition — naming each conspirator in turn; Plutarch's *Life of Caesar* records this warning" },
    { line: 5, phrase: "security gives way to conspiracy", definition: "complacency opens the way to plots — the tragic moral of Caesar's refusal to read this letter" },
    { line: 6, phrase: "lover", definition: "in Elizabethan usage, a devoted friend or well-wisher; NOT romantic" },
    { line: 8, phrase: "suitor", definition: "petitioner; one who presents a request" },
    { line: 10, phrase: "teeth of emulation", definition: "the biting jaws of envy; ambitious rivalry figured as a predator" },
    { line: 12, phrase: "Fates with traitors do contrive", definition: "the three Fates (classical goddesses who spin, measure, and cut the thread of life) conspire with the traitors" },
  ];

  // ── 2.4 — Before Brutus's house. Portia, Lucius, Soothsayer ────────
  GLOSSES.julius_caesar_act2_scene4 = [
    { line: 1, phrase: "I prithee", definition: "I pray thee; please (contracted)" },
    { line: 6, phrase: "O constancy, be strong upon my side", definition: "Portia invokes constancy — the Stoic virtue of steadfastness, her claim (2.1) and lineage (Cato's daughter) — to hold her tongue" },
    { line: 8, phrase: "man's mind, but a woman's might", definition: "a man's intelligence but a woman's (smaller) strength — Portia's gendered self-description; the play treats gender as a limit on constancy" },
    { line: 9, phrase: "keep counsel", definition: "keep a secret" },
    { line: 18, phrase: "bustling rumour, like a fray", definition: "a noise of commotion, like a scuffle" },
    { line: 20, phrase: "Sooth", definition: "truly; in truth" },
    { line: 23, phrase: "ninth hour", definition: "about 9 a.m. — the Roman and Elizabethan hour (sunrise was the first hour)" },
    { line: 30, phrase: "beseech him to befriend himself", definition: "beg him to act in his own interest — the Soothsayer's second warning, now obliquely stated" },
    { line: 35, phrase: "praetors", definition: "Roman magistrates, ranked below consuls; Brutus held a praetorship in 44 BCE" },
    { line: 36, phrase: "void", definition: "empty; less crowded" },
    { line: 42, phrase: "Brutus hath a suit", definition: "Brutus has a petition (Portia knows the truth; she disguises her outburst as concern for a business matter)" },
    { line: 44, phrase: "commend me to my lord", definition: "carry my greetings to my husband" },
  ];

};
