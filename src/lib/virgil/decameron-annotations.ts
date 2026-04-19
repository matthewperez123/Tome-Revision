/**
 * Decameron annotations — hand-written scholarly notes on Boccaccio's
 * *Il Decamerone* in John Payne's 1886 English.
 *
 * Scope: seed set covering the ten load-bearing passages identified in
 * the ingestion spec (Proem; the Plague Introduction to Day I; I.1
 * Ciappelletto; I.3 Melchizedek; the Day IV Introduction where Boccaccio
 * breaks frame to defend his work; IV.1 Tancredi and Ghismonda; IV.5
 * Lisabetta's pot of basil; V.9 Federigo's falcon; VI.9 Cavalcanti;
 * X.10 Griselda; the Author's Conclusion) plus the Dante and Shakespeare
 * cross-reference wiring. Annotations elsewhere in the work are seeded
 * lightly so every tale has at least one; deep annotation of the other
 * tales is a subsequent pass.
 *
 * Indexing convention:
 *   - `bookId` is "the-decameron"
 *   - `chapterNumber` is the flat meta.json index (0–122); see the map
 *     in src/data/the-decameron/chapter-metadata.ts for the structural
 *     decoding. Proem = 0, Plague Introduction = 2, I.1 = 3, I.3 = 5,
 *     Day IV Introduction (the author intervention) = 38, IV.1 = 39,
 *     IV.5 = 43, V.9 = 59, VI.9 = 71, X.10 (Griselda) = 120, Author's
 *     Conclusion = 121.
 *   - `anchorText` is a verbatim substring from Payne's translation as
 *     rendered in public/content/the-decameron/ch-N.json — many short,
 *     distinctive. Anchors were verified against the served HTML.
 *
 * Voice: Virgil's — scholarly, first-person, warm; the same voice as the
 * Commedia and Odyssey annotation sets.
 */

import type { Annotation } from "./types"

export const DECAMERON_ANNOTATIONS: Annotation[] = [

  // ═══════════════════════════════════════════════════════════════════
  // PROEM (ch-0) — Boccaccio's opening address
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "decameron-proem-for-ladies",
    bookId: "the-decameron",
    chapterNumber: 0,
    anchorText: "to afford some relief",
    anchorOccurrence: 1,
    title: "The Work's Dedication",
    quotedPassage: "I have, that I may not appear ungrateful, bethought myself, now that I can call myself free, to endeavour, in that little which is possible to me, to afford some relief, in requital of that which I received aforetime — if not to those who succoured me and who, belike, by reason of their good sense or of their fortune, have no occasion therefor — to those, at least, who stand in need thereof.",
    passageReference: "Proem",
    commentary: `Boccaccio opens his century by doing something no previous European writer of his stature had done: he dedicates his great work not to a patron, not to a prince, not to God — but to women in love. The Proem is a programmatic statement. The *Decameron* exists, Boccaccio says, to console *lovesick ladies* who lack the outlets men have (hunting, hawking, trade, politics) and must suffer love in silence, indoors. One hundred tales will be set before them as an antidote.

This is rhetorical ornament — and it is not. The frame narrative that follows will be populated by seven women and three men, and the seven women will speak more tales than the men. No major vernacular work before Boccaccio had imagined women as the primary audience, or as a storytelling company in their own right, or as interpreters of what they hear. The Proem is the formal legal brief for that structural choice.

Notice also how Boccaccio positions himself. He is a survivor — of love (his own, declared past) and soon we will learn of the plague. The *Decameron* is written out of gratitude for consolation received. This will matter in the Day IV self-defense and again in the Author's Conclusion: Boccaccio insists, across his book's long opening and longer closing frames, that the work is not idle but necessary.`,
    crossReferences: [
      {
        type: "compare",
        description: "Dante dedicates the Commedia implicitly to the universal Christian reader; Boccaccio dedicates the Decameron pointedly to women in love. The difference is programmatic: Dante's reader is a soul seeking salvation; Boccaccio's is a lady seeking solace.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Paradiso, canto addressed to the reader",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 67,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  // ═══════════════════════════════════════════════════════════════════
  // DAY I INTRODUCTION (ch-2) — The Plague of 1348
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "decameron-plague-opening",
    bookId: "the-decameron",
    chapterNumber: 2,
    anchorText: "the dolorous remembrance of the late pestiferous mortality",
    anchorOccurrence: 1,
    title: "Eyewitness to the Black Death",
    quotedPassage: "this present work will, to your thinking, have a grievous and a weariful beginning, inasmuch as the dolorous remembrance of the late pestiferous mortality, universally harmful to all who beheld it or otherwise knew it, which it beareth on its forefront, is evermore before the eyes of every one.",
    passageReference: "Day I, Introduction",
    commentary: `What follows here is the most famous description of epidemic disease in European literature before Camus. Boccaccio was in Florence in 1348; he saw what he reports. The bubonic plague pandemic of 1347–51 killed perhaps half the city — some estimates go higher. Boccaccio's father, Boccaccino di Chellino, died in that wave. So did his stepmother. The eyewitness stance of this opening is not literary convention. It is testimony.

Read the next pages for what they document: the gavocciolo (the bubo in the groin and armpit), the black spots on the body, the three-day mortality, the breakdown of family bonds as parents abandoned children and priests refused the sacrament, the three responses he names — ascetic withdrawal, hedonistic excess, and moderate flight. The brigata's decision to leave the city is itself the third response; the frame story begins here, at the choice between three ways of meeting catastrophe.

The echo that is worth hearing behind this prose is Thucydides on the plague at Athens (Histories II.47–54). Boccaccio probably did not know Thucydides directly, but the structural move — pestilence as civilization-destroying event, reported by a witness, that then determines the narrative choices of those who survive — is genuinely Thucydidean. And the echo forward is long: Defoe's *Journal of the Plague Year*, Manzoni's *I Promessi Sposi*, Pepys on 1665, Camus's *La Peste*, and a very large volume of writing produced in and after the 2020 pandemic. This passage is the generative ancestor of every one of them.

Why does Boccaccio *begin* with the worst? Because he is telling you what the stories are a response to. Do not mistake the Decameron for escapism. Boccaccio insists — here, and in the Conclusion — that storytelling is how the survivors live. The garden is not a flight from the plague. It is the answer to it.`,
    crossReferences: [
      {
        type: "echo",
        description: "Thucydides' description of the plague at Athens (Histories II.47–54) is the deep classical precedent: an eyewitness chronicler reporting the dissolution of social bonds under epidemic pressure. Boccaccio almost certainly did not read Thucydides, but the structural homology is exact.",
        workTitle: "The History of the Peloponnesian War",
        workAuthor: "Thucydides",
        passageReference: "II.47–54",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description: "Defoe's Journal of the Plague Year (1722) is the English equivalent of Boccaccio's opening — another survivor-eyewitness, 350 years later, covering the London plague of 1665.",
        workTitle: "A Journal of the Plague Year",
        workAuthor: "Daniel Defoe",
        passageReference: "Opening pages",
        targetBookId: "a-journal-of-the-plague-year",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description: "Dante opens his poem in a dark wood of moral crisis; Boccaccio opens his in a literal crisis of civilization. Both works frame themselves as responses to catastrophe — one interior, one epidemic.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Inferno I",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 0,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "literary-influence"],
  },

  {
    id: "decameron-plague-three-responses",
    bookId: "the-decameron",
    chapterNumber: 2,
    anchorText: "Some there were who conceived",
    anchorOccurrence: 1,
    title: "Three Ways to Meet Catastrophe",
    quotedPassage: "Some there were who conceived that to live moderately and keep themselves from all excess was the best defence against such a danger... Others, inclining to the contrary opinion, maintained that to carouse and make merry and go about singing and frolicking and satisfy the appetite in everything possible... was a very certain remedy for such an ill.",
    passageReference: "Day I, Introduction — the plague's social consequences",
    commentary: `Boccaccio classifies the responses to the plague into three: asceticism (withdraw, pray, purify), hedonism (drink, sing, take everything while you can), and moderate flight (leave the city for healthy air, live cleanly, keep good company). He is writing as a sociologist, and the taxonomy is clear enough that modern epidemic reporters still use it.

The brigata — the ten young Florentines we will meet momentarily — choose the third. They are neither flagellants nor revellers. They will take provisions, servants, music, and books to a country villa. They will tell stories. This is Boccaccio's editorial position: *moderation in a time of catastrophe is not cowardice*. It is an ethical choice, and it is the one that makes narrative possible.

Notice how the frame of the work is pre-validated by the Introduction. By the time Pampinea stands up in Santa Maria Novella and proposes the escape, Boccaccio has already told us which of the three responses is the defensible one. The frame then dramatizes what he has argued.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },

  {
    id: "decameron-pampinea-santa-maria-novella",
    bookId: "the-decameron",
    chapterNumber: 2,
    anchorText: "Santa Maria Novella",
    anchorOccurrence: 1,
    title: "The Brigata Forms",
    quotedPassage: "that, on a Tuesday morning... there were in the venerable Church of Santa Maria Novella... seven young ladies, all knit one to another by friendship or neighbourhood or kinship.",
    passageReference: "Day I, Introduction — the meeting at Santa Maria Novella",
    commentary: `The Dominican basilica of Santa Maria Novella in Florence, built between 1279 and 1357, is a real place — you can stand in it today. Boccaccio's choice of setting is deliberate: the seven ladies are meeting in the most important preaching church in Florence, at the height of the plague, exactly where one would expect to find a sermon on divine punishment. Pampinea's speech that follows is instead a sermon on escape.

This is the founding act of the frame. The whole *Decameron*, all 122 pieces that follow, are made possible by Pampinea's courage here. She is the oldest of the seven. She is the one who looks around the empty church and asks: *why are we still here?* And her argument is practical, moral, and feminist in a specific medieval sense. Women left unprotected in a city without functioning family structure are in more danger than women in the countryside, and women who govern their own company are in more protection than women dependent on male household heads.

The three young men — Pamfilo, Filostrato, and Dioneo — arrive providentially. Boccaccio insists on the propriety of the mixed company. This is important to him: the frame cannot be a scandal, or the work is dead on arrival.`,
    crossReferences: [],
    tags: ["historical"],
  },

  // ═══════════════════════════════════════════════════════════════════
  // I.1 (ch-3) — Ser Ciappelletto
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "decameron-i-1-opening-choice",
    bookId: "the-decameron",
    chapterNumber: 3,
    anchorText: "give it beginning from the holy and admirable name",
    anchorOccurrence: 1,
    title: "Boccaccio's First Move",
    quotedPassage: "It is a seemly thing, dearest ladies, that whatsoever a man doth, he give it beginning from the holy and admirable name of Him who is the maker of all things. Wherefore, it behoving me, as the first, to give commencement to our story-telling, I purpose to begin with one of His marvels.",
    passageReference: "Day I, Tale 1 — Pamfilo's opening",
    commentary: `Pamfilo opens the entire sequence of tales with what sounds like a pious frame — we should begin in God's name — and then delivers a story of a Florentine notary who goes to France, commits every known sin, and on his deathbed lies so accomplishedly in confession that his ignorant confessor declares him holy and the townspeople begin to pray at his tomb.

The audacity of the sequencing is the point. Boccaccio puts this first. Of all hundred tales he could have opened with, he chooses the one most likely to offend the ecclesiastical reader. The mock-piety of "one of His marvels" is dry Tuscan wit: Boccaccio is telling you, four paragraphs into the storytelling, that the Decameron will not be frightened of the Church, of canonization, or of hypocrisy wherever it sits.

The deeper claim — and Auerbach catches it beautifully in *Mimesis* — is that Ciappelletto's false confession is rhetorically *better* than a true one. The tale is partly a demonstration of literary craft. Ciappelletto invents a saintly self and sells it. He is a writer, inside the tale, of the kind of fiction the Decameron itself is. Boccaccio is having a joke about his own art.`,
    crossReferences: [
      {
        type: "compare",
        description: "Auerbach's *Mimesis*, chapter IX ('Frate Alberto'), treats the Decameron's stylistic register at length. The reading of Ciappelletto as a study in rhetorical virtuosity underlies much subsequent scholarship.",
        workTitle: "Mimesis",
        workAuthor: "Erich Auerbach",
        passageReference: "Chapter IX",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  {
    id: "decameron-i-1-saintly-canonization",
    bookId: "the-decameron",
    chapterNumber: 3,
    anchorText: "holy friar",
    anchorOccurrence: 1,
    title: "The Theology at Stake",
    quotedPassage: "a holy friar, a man of very devout and good life and a master of Holy Writ",
    passageReference: "Day I, Tale 1",
    commentary: `The theological machinery Boccaccio is exploiting is specific. Medieval Catholicism held that sincere confession and extreme unction, performed in articulo mortis, could save even a lifelong sinner — contrition was enough. Ciappelletto weaponizes this. His false confession is procedurally perfect; only the interior sincerity is missing, and that the friar cannot see.

What Boccaccio satirizes is not confession as a sacrament — he satirizes the epistemological gap at its center. A confessor cannot verify interior states. He can only listen. Ciappelletto gives him nothing but the audible surface. The friar, in perfect good faith, believes him — and a town converts.

Notice that Boccaccio does not moralize against the friar. The friar is "devout and good." The tale's satiric target is the system, not the man. This is a more dangerous criticism than simple anticlericalism: Boccaccio is saying the Church's own procedures produce saints who are not saints, and there is no fix internal to the system.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },

  // ═══════════════════════════════════════════════════════════════════
  // I.3 (ch-5) — Melchizedek and the Three Rings
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "decameron-i-3-three-rings",
    bookId: "the-decameron",
    chapterNumber: 5,
    anchorText: "three rings",
    anchorOccurrence: 1,
    title: "The Three Rings",
    quotedPassage: "There was once upon a time a great man and a rich, who among other very precious jewels in his treasure had a goodly and costly ring... [he] caused the ring to be privily counterfeited by a skilful artificer and two others made, so like unto the first that scarce he himself who had let make them knew the true from the false.",
    passageReference: "Day I, Tale 3 — Filomena's story of Saladin and Melchizedek",
    commentary: `Saladin, short of cash, tries to trap the Jewish moneylender Melchizedek: which of the three faiths — Jewish, Christian, Muslim — is the true one? If Melchizedek says his own, he offends the Sultan; if he says Islam, he insults his own religion for profit. Melchizedek answers with a parable. A father has one precious ring he means to bequeath; he has three sons and loves them equally, so he has two perfect copies made, and when he dies each son inherits a ring indistinguishable from the original. The tale cannot be decided. Neither can the question.

This is one of the most consequential single pages in European intellectual history. It is not merely a pretty story about tolerance. It is a parable that *suspends the question of which revealed religion is true* and makes that suspension a virtue. In 1349, in a Christian society whose stated theology condemned both Jews and Muslims as enemies of salvation, Boccaccio puts this in the mouth of his most modest narrator (Filomena, the one who blushes) and gives it to us early, on the very first day, while the company is still finding its register.

The direct descendant is Lessing's *Nathan der Weise* (1779), written for the Berlin Enlightenment, which stages the three-rings parable as its philosophical climax. Through Lessing, the tale became foundational for modern religious pluralism — the very tradition that our contemporary constitutional protections for religious freedom rest on. A thread runs from Filomena in 1348 to the German Enlightenment to the First Amendment. Hold that in mind.

Note the Jewish Melchizedek is the *philosopher* in this tale. This is unusual for its era. Boccaccio's other Jewish character, Abraham in I.2, is equally sympathetically drawn. The Decameron's posture toward medieval religious minorities is notably warmer than its ambient culture's.`,
    crossReferences: [
      {
        type: "allusion",
        description: "Lessing's *Nathan der Weise* (1779) makes the three-rings parable the philosophical heart of the play and the founding text of modern religious pluralism. Lessing is explicit that he is adapting Boccaccio.",
        workTitle: "Nathan der Weise",
        workAuthor: "Gotthold Ephraim Lessing",
        passageReference: "Act III, scene 7",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description: "Dante places virtuous pagans in Limbo and extends no such gesture to virtuous Jews or Muslims by faith. Boccaccio's parable is a quiet but structural departure from Dantean theology.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Inferno IV — Limbo",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 3,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence", "historical"],
  },

  // ═══════════════════════════════════════════════════════════════════
  // DAY IV INTRODUCTION (ch-38) — Boccaccio Breaks the Frame
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "decameron-iv-intro-frame-break",
    bookId: "the-decameron",
    chapterNumber: 38,
    anchorText: "the boisterous and burning blast of envy",
    anchorOccurrence: 1,
    title: "The Author Steps Out of the Frame",
    quotedPassage: "Dearest ladies, as well by words of wise men heard as by things many a time both seen and read of myself, I had conceived that the boisterous and burning blast of envy was apt to smite none but lofty towers or the highest summits of the trees; but I find myself mistaken in my conceit.",
    passageReference: "Day IV, Introduction",
    commentary: `This is one of the most extraordinary moves in medieval European literature. Three days of tales have happened. A fourth is about to begin. And Boccaccio — not Filostrato who is about to rule the day, not any of the ten narrators — steps out from behind the frame, speaks in his own voice, and addresses his critics for thirty pages.

No other writer before him does this at this scale. Dante speaks in his own voice throughout the *Commedia* but the voice is inside the fiction (Dante-the-pilgrim is a character). Boccaccio here is explicitly outside the story: he is Giovanni Boccaccio, in 1353, defending his book against people who have read the first three days in manuscript and objected.

What do they object to? He lists their charges:

— You write too much about women. (His reply: yes, and I won't stop.)
— You are too old to be writing about love. (His reply: the Muses love me because I love them.)
— You should be making your bread in some more respectable way. (His reply: Solomon says the idle fool dies, but it is equally true that without the arts, none of us have a shelf of anything to read.)
— Your stories are coarse and secular. (His reply, by implication: so is the world; your objection to the fiction is an objection to the world it mirrors.)

The fable he uses to answer them — the man who raises his son knowing no women, and who, visiting the city, is told "these are geese" and replies "Father, grant me one of these geese" — is itself a comedy in the middle of a self-defense. Boccaccio cannot stop being Boccaccio. Even his apologia is a joke.

This passage is the founding document of the Renaissance defense of secular literature. Sidney's *Apology for Poetry* (1595), Milton's *Areopagitica* (1644), and every subsequent defense of imaginative writing against moral critics descend from it. Read it slowly. It is short and it is extraordinary.`,
    crossReferences: [
      {
        type: "compare",
        description: "Sidney's *Defence of Poesy* (1595) and Milton's *Areopagitica* (1644) both defend imaginative and free letters against moral critics — Boccaccio is their two-centuries-earlier precedent.",
        workTitle: "A Defence of Poesy",
        workAuthor: "Philip Sidney",
        passageReference: "The Apology",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical", "philosophical"],
  },

  {
    id: "decameron-iv-intro-goose-fable",
    bookId: "the-decameron",
    chapterNumber: 38,
    anchorText: "geese",
    anchorOccurrence: 1,
    title: "The Father and the Goose",
    quotedPassage: "the young man said, 'Father, prithee, get me one of these geese'",
    passageReference: "Day IV, Introduction — Boccaccio's illustrative fable",
    commentary: `The fable Boccaccio tells at the heart of his self-defense: a man raises his son on a hilltop, keeping him from all sight of women. At eighteen they go into Florence. The son, never having seen one, asks what women are. His father, flustered, says "they are geese." The son immediately asks for one.

The joke is sharp. Desire does not need instruction. It arises by nature. Boccaccio's point to his critics is: do not blame my tales for producing what my tales only describe. If you kept a library of sermons alone, you would still get the human you got.

The fable is also a piece of philosophical writing older than it looks. It is the Aristotelian position — natural desire cannot be extirpated by social convention — restated in a Tuscan folktale register. That Boccaccio can drop this into the middle of a literary apologia, without fanfare, tells you something about the intellectual range of his prose. He is doing philosophy by anecdote.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },

  // ═══════════════════════════════════════════════════════════════════
  // IV.1 (ch-39) — Tancredi and Ghismonda
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "decameron-iv-1-ghismonda-speech",
    bookId: "the-decameron",
    chapterNumber: 39,
    anchorText: "sorrowful ending of the loves",
    anchorOccurrence: 1,
    title: "Ghismonda's Defense of Natural Love",
    quotedPassage: "Such, then, as you have heard, was the sorrowful ending of the loves of Guiscardo and Ghismonda.",
    passageReference: "Day IV, Tale 1 — Fiammetta's tale of Tancredi and Ghismonda",
    commentary: `When Prince Tancredi discovers that his widowed daughter Ghismonda has been meeting her lover Guiscardo — a man of low birth but noble character — he has Guiscardo strangled and his heart cut out and sent to Ghismonda in a golden cup. Ghismonda's response is one of the most astonishing speeches given to any woman in medieval European literature.

She does not plead. She argues. She tells her father he is wrong about three things at once. First, about *nature*: she is a young widow, she has a body, the desire to love again is given to humans by nature and it is absurd to be surprised that she has it. Second, about *class*: Guiscardo was not noble by blood, but nobility lies in virtue, not in lineage — a position more radical in 1353 than it may seem now. Third, about *justice*: if Tancredi punishes her, she will not shrink from the punishment; but he should know that she chose Guiscardo for his qualities, that her love was not a weakness to hide but a choice to defend, and that she will not recant.

Then she drinks poison over the cup containing Guiscardo's heart and dies.

Ghismonda's speech defending love-across-class has a very long afterlife. Webster's *Duchess of Malfi* (1614) gives the Duchess a parallel defiance before parallel punishment — both works are asking whether a noblewoman may choose her love, both answer that she may and that society will destroy her for it. Boccaccio gets there two and a half centuries earlier. Feminist scholarship since the 1970s has repeatedly returned to Ghismonda as one of the earliest European heroines who argues her own case against patriarchy in her own voice.

Fiammetta is telling this tale. It is worth asking why Boccaccio gives it to her specifically. Fiammetta is the autobiographical figure in his work, named after a real woman he had loved. Her signature day is the next one, Day V, where love stories end well. Here she opens the day of tragic loves with the highest-stakes speech in the collection. The placement is not accidental.`,
    crossReferences: [
      {
        type: "allusion",
        description: "Webster's *The Duchess of Malfi* (1614) gives the Duchess a defiance parallel to Ghismonda's — both noblewomen defending marriages their male kin will not tolerate. Webster may or may not have read Boccaccio directly, but the typology is inherited.",
        workTitle: "The Duchess of Malfi",
        workAuthor: "John Webster",
        passageReference: "Act IV",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description: "Dante's Francesca (Inferno V) is also a noblewoman who loves a man her family does not sanction, and also dies violently. Francesca is passive — a creature of the romance tradition whose book-reading led her to doom. Ghismonda is active — she speaks for herself. Boccaccio's counter-programmatic relationship to Dante is nowhere sharper.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Inferno V",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 4,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical", "historical"],
  },

  // ═══════════════════════════════════════════════════════════════════
  // IV.5 (ch-43) — Lisabetta and the Pot of Basil
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "decameron-iv-5-lisabetta-basil",
    bookId: "the-decameron",
    chapterNumber: 43,
    anchorText: "pot away",
    anchorOccurrence: 1,
    title: "The Pot of Basil",
    quotedPassage: "Alack! ah, who can the ill Christian be, / That stole my pot away?",
    passageReference: "Day IV, Tale 5 — Filomena's tale of Lisabetta",
    commentary: `Lisabetta of Messina loves Lorenzo, a clerk in her brothers' counting-house. The brothers learn of it, take Lorenzo on a walk from which he does not return, and murder him in a remote place. Lisabetta does not know, only that he is gone. She dreams the location of the body. She goes in secret, finds it, cannot lift it, cuts off the head, carries it home, and plants it in a pot of basil, which she waters with her tears and with rosewater. The basil thrives. The brothers, noticing, take the pot away. Lisabetta dies of grief.

The song fragment that closes the tale — "Alack! ah, who can the ill Christian be, / That stole my pot away?" — is a real Sicilian ballad. Boccaccio is reporting that this tale was being sung in his own century. We are reading source literature that was already folklore.

The downstream life of this tale is long. Keats made it into "Isabella; or, the Pot of Basil" (1818), one of the great Romantic long poems; his version amplifies the decadence of the image and makes Isabella a study in mourning as aesthetic experience. Hunt and Holman Hunt both painted it. It is, quietly, the most visually productive tale in the Decameron after Nastagio's pine-wood and Griselda.

Notice that Filomena — the modest one — is the narrator. Boccaccio's narrator-assignments are deliberate. He gives the most erotic and ritualized of the tragic tales to the narrator whose voice is most reserved. The contrast amplifies both.`,
    crossReferences: [
      {
        type: "allusion",
        description: "Keats's *Isabella; or, the Pot of Basil* (1818) adapts this tale directly as a long narrative poem — fifty-three eight-line stanzas in the manner of Boccaccio himself. Keats is explicit about his source.",
        workTitle: "Isabella; or, the Pot of Basil",
        workAuthor: "John Keats",
        passageReference: "Full poem",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  // ═══════════════════════════════════════════════════════════════════
  // V.9 (ch-59) — Federigo's Falcon
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "decameron-v-9-falcon-gift",
    bookId: "the-decameron",
    chapterNumber: 59,
    anchorText: "better husband of his substance",
    anchorOccurrence: 1,
    title: "The Architecture of the Perfect Tale",
    quotedPassage: "he, seeing himself married to a lady of such worth and one whom he had loved so dear and exceeding rich, to boot, became a better husband of his substance and ended his days with her in joy and solace.",
    passageReference: "Day V, Tale 9 — Fiammetta's tale of Federigo",
    commentary: `Federigo degli Alberighi, a young nobleman, has spent his whole fortune courting Monna Giovanna in vain. She is married; she will not have him. At last he retires to a small farm outside Florence with nothing left but a prized falcon. Years pass. Her husband dies. Her young son falls ill and asks, as children will, for the falcon he has seen Federigo fly. The mother, sick with love for her son, overcomes her shame and visits Federigo to ask for the bird. He — not knowing why she has come, wanting only to receive her with honor — kills the falcon and serves it to her for dinner. Only at the end of the meal does she make her request. The falcon she sought is, in every sense, already inside her.

Henry James considered this tale a model of short-form construction. What he admired — and what every subsequent short-story theorist has repeated — is the *single* structural arc: desire → sacrifice → recognition → reward. Each element depends on the one before; none could be removed without collapse. The son dies, but the widow, moved by Federigo's magnificence, marries him. Every premise of the tale is paid off by the ending, and the ending changes, retrospectively, the meaning of every premise.

It is also a tale about the ethics of gift. Federigo gives what he has, not calculating its consequence. What he thinks he is giving is hospitality. What he is actually giving is the structure of his own life — he destroys the last possession he has to honor a guest. Monna Giovanna recognizes this, and her recognition is the tale's moral center: she marries him not out of pity but because she has finally seen what kind of person he is.

Notice that Fiammetta, as queen of Day V, has chosen the day's theme and held this tale for the ninth slot — the slot immediately before Dioneo's privileged tenth. She is placing it deliberately. If the Decameron has a single most perfect tale, many readers, including James, think this is it.`,
    crossReferences: [
      {
        type: "compare",
        description: "Henry James's writings on the short story ('The Art of Fiction' and his prefaces to the New York Edition) repeatedly cite the *Decameron* — and the falcon tale specifically — as a structural model.",
        workTitle: "The Art of Fiction",
        workAuthor: "Henry James",
        passageReference: "The 1884 essay and related prefaces",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  // ═══════════════════════════════════════════════════════════════════
  // VI.9 (ch-71) — Guido Cavalcanti
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "decameron-vi-9-cavalcanti-leap",
    bookId: "the-decameron",
    chapterNumber: 71,
    anchorText: "Guido",
    anchorOccurrence: 1,
    title: "Cavalcanti Among the Tombs",
    quotedPassage: "wherefore, being here, we are in our own house.",
    passageReference: "Day VI, Tale 9 — Elisa's tale of Guido Cavalcanti",
    commentary: `Guido Cavalcanti, a real poet and a real Florentine — Dante's "first friend," to whom the *Vita Nuova* is dedicated — is caught among the ancient tombs of the Baptistery by a company of Florentine young men who want to tease him. He has been called strange, reclusive, philosophical. They corner him. He vaults over a tomb and delivers a one-line retort: in your houses you say what you like to me, but since I am here among these stones, *we are in our own house* — meaning, they are dead, and compared to the life of the mind we poets and philosophers inhabit, so are you.

The tale is four pages long. It is Boccaccio's homage to the Florentine intellectual community he inherited. Cavalcanti died in 1300, when Boccaccio was not yet born; Boccaccio knew him only by reputation and by poems. But in the *Decameron* he makes Cavalcanti a character and preserves a piece of local oral tradition: the poets of Florence made themselves a house by their writing.

This tale is the hinge that binds Boccaccio to Dante. Cavalcanti's father, Cavalcante de' Cavalcanti, sits in Dante's *Inferno* X among the heretics — Dante and Guido's father have a painful scene there about Guido's fate. When Elisa tells this tale, she is telling a story about the father's son, in the city that is also Dante's city, about the literary community that shaped both Dante and Boccaccio. The tale is short because it does not need to be long. It only needs to honor.

The tale's punchline — "we are in our own house" — is also, quietly, a statement about literature as a place to live. Cavalcanti survives among the tombs because his poems do. This is Boccaccio's own bet on behalf of his own book.`,
    crossReferences: [
      {
        type: "compare",
        description: "Dante's Inferno X places Cavalcante de' Cavalcanti — Guido's father — among the Epicurean heretics. The famous scene in which Dante must break bad news about Guido's own fate is the other side of the Florentine literary community Boccaccio honors here.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Inferno X",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 9,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "literary-influence"],
  },

  // ═══════════════════════════════════════════════════════════════════
  // X.10 (ch-120) — Griselda
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "decameron-x-10-griselda-test",
    bookId: "the-decameron",
    chapterNumber: 120,
    anchorText: "Griselda",
    anchorOccurrence: 1,
    title: "The Last Tale",
    quotedPassage: "[Griselda's] constancy being now well approved, he caused her enter into his chamber, clad as she was, and said to her, 'Griselda, it is time that thou shouldst taste of the fruit of thy long patience.'",
    passageReference: "Day X, Tale 10 — Dioneo's closing tale",
    commentary: `The Marquis of Saluzzo, Gualtieri, is pressed by his subjects to marry. He chooses a peasant girl, Griselda, and, once married, sets out to test her obedience. He tells her he has killed their daughter; she accepts it. He tells her he has killed their son; she accepts it. He tells her he is divorcing her; she accepts it. He brings her back to serve as a maidservant at his supposed new wedding; she accepts it, and prepares the bride. Only then does he reveal that the bride is their own daughter, the son is alive, the divorce was a fiction, and that every test has been to prove her worthiness. He restores her to her place and the court acclaims her.

This is the closing tale of the entire Decameron, and it has provoked more commentary than any other. Petrarch was so moved by it that he translated it into Latin — Petrarch, the greatest scholar of his age, chose this tale, alone of all the Decameron, to render in the classical language. Chaucer read Petrarch's Latin version and made it the *Clerk's Tale* in his *Canterbury Tales*. From Petrarch and Chaucer forward, the Griselda story has its own tradition, partly independent of the Decameron.

Modern readers — and some medieval readers too — find the tale disturbing. Gualtieri's testing is cruel beyond reason. Griselda's obedience can read as the erasure of her own humanity. Feminist scholarship since the 1970s has repeatedly asked: is Boccaccio endorsing Griselda's patience, or indicting Gualtieri's sadism, or leaving the tension unresolved? The tale's own narrator — Dioneo — is not innocent of this question. He closes by remarking that the Marquis might better have chosen a wife who, when driven from his house in her shift, found some other man to keep her warm. Dioneo's coda is one of the subtlest pieces of metafictional commentary in the collection. He is telling you that the tale he has just told is not to be swallowed whole.

Note also the structural placement. Boccaccio has spent Day X on magnificence — exemplary greatness. Eight narrators have told tales of noble deeds by kings, knights, merchants. Then Pamfilo, the king, tells Saladin. Then Dioneo closes with Griselda. The entire work ends with a tale in which magnificence is tested past the point where the reader is comfortable calling it magnificent. The effect is not resolution; it is productive unease. Boccaccio is not sending us out of the garden into a tidy lesson. He is sending us out with a question we will have to think about.

That Dioneo, the libertine and rule-breaker, tells the tale of a woman who submits to every test is also structurally rich. His ten tales have been the most formally radical in the collection. He closes with the most formally traditional material in the book — a saint's-life plot about patience — and does so with a comment that undermines its piety. It is a perfect last move for his character.`,
    crossReferences: [
      {
        type: "allusion",
        description: "Petrarch's Latin translation of Griselda ('Historia Griseldis', 1373) made the tale a European classic independent of the Decameron. Chaucer's *Clerk's Tale* derives from Petrarch, not directly from Boccaccio.",
        workTitle: "Epistolae Seniles XVII.3",
        workAuthor: "Francesco Petrarca",
        passageReference: "The Griselda letter",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "allusion",
        description: "Chaucer's *Clerk's Tale* in the *Canterbury Tales* is the great English descendant of the Griselda material — via Petrarch's Latin. Chaucer adds a closing Envoy ('Lenvoy de Chaucer') that ironically undercuts the patient-wife exemplum; Dioneo's ambivalent close here and Chaucer's Envoy there are a single gesture split across two languages and a generation.",
        workTitle: "The Canterbury Tales",
        workAuthor: "Geoffrey Chaucer",
        passageReference: "The Clerk's Tale (Fragment IV)",
        targetBookId: "the-canterbury-tales",
        targetChapterNumber: 9,
        targetAnchorText: "Petrark",
      },
    ],
    tags: ["literary-influence", "philosophical", "historical"],
  },

  // ═══════════════════════════════════════════════════════════════════
  // Author's Conclusion (ch-121)
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "decameron-conclusion-galeotto",
    bookId: "the-decameron",
    chapterNumber: 121,
    anchorText: "Prince Galahalt",
    anchorOccurrence: 1,
    title: "The Book Named Galahalt — Prince of Go-Betweens",
    quotedPassage: "Here endeth the book called Decameron and surnamed Prince Galahalt.",
    passageReference: "Conclusion of the Author — the book's subtitle",
    commentary: `The single most important sentence in the whole work, and Boccaccio gives it to us as the last words of the Conclusion. The *Decameron* is also called *Prencipe Galeotto* — Prince Galehaut; Payne Englishes it "Prince Galahalt." Hold that name carefully. It is the structural counterweight to everything that has come before.

Galehaut, in the Arthurian Lancelot romance, is the king whose intervention arranges the famous kiss between Lancelot and Guinevere. He is the literary figure of the go-between — the one who brings two lovers into private conversation. In Dante's *Inferno* V, Francesca da Rimini tells Dante that she and her brother-in-law Paolo came to their fatal adultery while reading the Lancelot romance together: *Galeotto fu 'l libro e chi lo scrisse* — "Galehaut was the book, and he who wrote it." She blames the book. She damns the book. The book is the go-between that brought her to Hell.

And Boccaccio names his own book *after that damned go-between*. He puts the name on the cover. He affirms it twice, in the title and in the last line of the Conclusion. He is telling us, deliberately and defiantly, that his *Decameron* is *the very kind of book that Francesca's Lancelot was*. It will enable desires. It will carry lovers to each other. It will do what literature does when literature does it well.

This is Boccaccio's answer to Dante. Dante damned the romance tradition for its effects on readers. Boccaccio says: yes, literature produces love; yes, literature has readers who act on what they read; and I am proud to write the kind of book that does. The Proem — a book dedicated to women in love, offered as their consolation — is the Decameron's opening statement of this position. The subtitle is its closing statement. *Prince Galahalt* means: yes, this book will touch your life.

The bibliographic fact is not decorative. Boccaccio and Dante were the two great Italian writers in a generation's distance. Boccaccio revered Dante — he wrote the first major biography of Dante (*Trattatello in laude di Dante*) and gave public lectures on the *Inferno* at Florence. He knew exactly what he was doing when he named his book after the object Francesca curses. This is the single sharpest piece of literary controversy in the fourteenth century. The two works pull in opposite directions. The catalog is richer for containing both.`,
    crossReferences: [
      {
        type: "source",
        description: "Dante's Inferno V, where Francesca calls the book that undid her 'a Galeotto' — 'a go-between.' Boccaccio claims exactly this role for his own work. The bidirectional relationship is the single sharpest literary cross-reference in the Tome catalog.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Inferno V, lines 127–138",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 4,
        targetAnchorText: "Galeotto",
      },
      {
        type: "source",
        description: "Galehaut the go-between comes from the Old French prose Lancelot cycle — the Vulgate Lancelot. The name flows Lancelot → Dante (who damns it) → Boccaccio (who claims it) → Malory (who uses the romance material more conventionally).",
        workTitle: "Le Morte d'Arthur",
        workAuthor: "Thomas Malory",
        passageReference: "Books XVIII–XIX — Lancelot and Guinevere",
        targetBookId: "le-morte-darthur",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical", "historical"],
  },

  {
    id: "decameron-conclusion-defense",
    bookId: "the-decameron",
    chapterNumber: 121,
    anchorText: "I have now, methinketh",
    anchorOccurrence: 1,
    title: "The Second Self-Defense",
    quotedPassage: "Most noble damsels, for whose solace I have addressed myself to so long a labour, I have now, methinketh, with the aid of the Divine favour, (vouchsafed me, as I deem, for your pious prayers and not for my proper merits), throughly accomplished that which I engaged, at the beginning of this present work, to do.",
    passageReference: "Conclusion of the Author — opening",
    commentary: `The Decameron has two self-defenses, not one. The first is the Introduction to Day IV — where Boccaccio, mid-book, steps out to answer objections he has already received from readers of the manuscript. The second is this Conclusion.

The two are not redundant. The Day IV defense was about the book's reception *during* its composition — critics had read the first three days and objected. This Conclusion defends the work *as a whole*, after the reader has finished. The arguments are sharper and shorter. Boccaccio anticipates the objections his critics will make now that the bawdier tales — III.10, V.10, VII.2, the whole of Day VIII — have been read: the book is improper for ladies; the tales are too long, or too short, or too crude; the language is too common; the Author talks too much.

His replies, taken together, amount to a theory of reading. The book is a tool. *Like a knife, it can be used for good or for ill.* If you read it badly, you will be badly served. If you read it well, you will find in it what the Proem promised: consolation. Boccaccio declines to take responsibility for bad readers. He declines to apologize for making a book that varies in register. He declines to sanitize anything. And he ends, serenely, with the book's true title — *Prince Galahalt*.

Read the Day IV Introduction and the Author's Conclusion together. They are bookends. Boccaccio puts the argument for secular literature in a defended structural position, between which he places a hundred tales as evidence. It is one of the most rhetorically confident frames ever built.`,
    crossReferences: [
      {
        type: "compare",
        description: "Read in sequence with the Introduction to Day IV — the two self-defenses bookend the tales and together constitute a coherent apology for secular literature.",
        workTitle: "The Decameron",
        workAuthor: "Giovanni Boccaccio",
        passageReference: "Day IV, Introduction",
        targetBookId: "the-decameron",
        targetChapterNumber: 38,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  // ═══════════════════════════════════════════════════════════════════
  // DISTRIBUTED ANNOTATIONS — Shakespeare source tales
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "decameron-ii-9-cymbeline-source",
    bookId: "the-decameron",
    chapterNumber: 23,
    anchorText: "Bernabo",
    anchorOccurrence: 1,
    title: "The Source of Cymbeline",
    quotedPassage: "Bernabo of Genoa",
    passageReference: "Day II, Tale 9 — Filomena's tale",
    commentary: `Bernabò of Genoa boasts to fellow merchants about his wife's chastity. The villain Ambrogiuolo bets against him, smuggles himself into the bedroom in a chest, observes private marks on the sleeping wife's body, and uses them to convince Bernabò she has been unfaithful. Bernabò orders her killed; she survives, disguises herself as a man, and eventually unmasks the deceiver.

Shakespeare's *Cymbeline* (c. 1609) takes this plot whole. Posthumus is Bernabò; Iachimo is Ambrogiuolo; Imogen is Zinevra. The chest, the bedroom observation, the tokens used to slander the wife, the wife's disguise as a man, the eventual exposure — all of it. Shakespeare came to the tale through William Painter's *Palace of Pleasure* (1566), a large English collection that translated Boccaccio for the Elizabethan stage and made him, indirectly, one of Shakespeare's most important sources.

Boccaccio's version is set in the world of Italian merchants: the wager takes place in Paris among traders, the wife runs a successful business in Alexandria while disguised as a man, the marks on her body are noticed because Ambrogiuolo is in a merchant's chest in a merchant's bedroom. Shakespeare moves the story to pre-Roman Britain and saturates it with tragic poetry. The change in register is enormous; the plot architecture is identical.`,
    crossReferences: [
      {
        type: "allusion",
        description: "Shakespeare's *Cymbeline* adapts this tale directly (via William Painter's *Palace of Pleasure*, 1566). The wager, the chest in the bedroom, the observed marks on the sleeping wife, and the wife's male-disguised survival are all Boccaccio's.",
        workTitle: "Cymbeline",
        workAuthor: "William Shakespeare",
        passageReference: "Act I Scene 4 and Act II Scene 2 — the wager and the chest",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  {
    id: "decameron-iii-9-alls-well-source",
    bookId: "the-decameron",
    chapterNumber: 35,
    anchorText: "Gillette",
    anchorOccurrence: 1,
    title: "The Source of All's Well That Ends Well",
    quotedPassage: "Gillette of Narbonne",
    passageReference: "Day III, Tale 9 — Neifile's tale",
    commentary: `Giletta, a physician's daughter, cures the King of France of a fistula and is granted, as the reward she chooses, marriage to the nobleman she loves — Beltramo of Roussillon. Beltramo refuses the marriage in his heart, sets impossible conditions on any real reconciliation ("when you bear a son by me and show my ring on your finger"), and flees to Italy. Giletta, disguised, arranges a bed-trick — taking the place of a young woman Beltramo is pursuing — and meets his conditions.

Shakespeare's *All's Well That Ends Well* (c. 1604) takes this plot directly. Helena cures the King; is granted Bertram; Bertram flees to Florence; Helena follows in disguise and engineers the bed-trick. The Italian names become English: Giletta becomes Helena, Beltramo becomes Bertram, Beltramo's Countess mother is preserved as the Countess of Rossillion. Again the route is William Painter's *Palace of Pleasure*.

The tale raises the same question in Boccaccio as in Shakespeare: how happy is the ending? Beltramo (Bertram) is forced into fidelity by a trick he does not want. Giletta (Helena) wins her man by deception. Boccaccio's Giletta gets the more unambiguously joyful reunion; Shakespeare lets the ambiguity show on the surface of his text — one reason *All's Well* is among the "problem plays." The answer Boccaccio gave in the fourteenth century is the answer Shakespeare was not sure he could give in the seventeenth.`,
    crossReferences: [
      {
        type: "allusion",
        description: "Shakespeare's *All's Well That Ends Well* adapts this tale directly (via Painter). Helena/Giletta, Bertram/Beltramo, the curing of the King, the impossible conditions, and the bed-trick resolution are all Boccaccio's.",
        workTitle: "All's Well That Ends Well",
        workAuthor: "William Shakespeare",
        passageReference: "Full play",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  {
    id: "decameron-iii-5-much-ado-analogue",
    bookId: "the-decameron",
    chapterNumber: 31,
    anchorText: "Zima",
    anchorOccurrence: 1,
    title: "An Analogue for Much Ado",
    quotedPassage: "Zima",
    passageReference: "Day III, Tale 5 — Elisa's tale",
    commentary: `The deception-plot in which Don John and his confederates stage an apparent meeting between Hero and a lover in order to slander her in Claudio's eyes — in Shakespeare's *Much Ado About Nothing* (1598) — is a story-type with many sources. Boccaccio's III.5 is one plausible strand; Matteo Bandello's *Novelle* (1554) gives a more direct source; Ariosto's *Orlando Furioso* canto V contributes another variant. Painter was the English conduit for the Italian material generally.

Read here with attention to how the deception-through-overseeing-from-below works. Shakespeare's masterstroke in *Much Ado* is making the slander *visual* — Claudio sees, or thinks he sees. That visual deception is ancient; Boccaccio's tales are part of the repertoire from which Shakespeare drew it. The specific sub-plot element that goes most directly from Boccaccio to Shakespeare is the use of a proxy at the window — a servant mistaken, in bad light, for the lady.

This cross-reference is more conjectural than II.9 → *Cymbeline* or III.9 → *All's Well*. Include it as an analogue, not as a direct source.`,
    crossReferences: [
      {
        type: "compare",
        description: "Shakespeare's *Much Ado About Nothing* uses a deception-through-mistaken-identity-at-a-window that descends from a family of Italian tales including this one; the more direct source is Bandello, but the type is Boccaccian.",
        workTitle: "Much Ado About Nothing",
        workAuthor: "William Shakespeare",
        passageReference: "Act III Scene 3 — the window deception",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description: "Ariosto's *Orlando Furioso* canto V contains a closely related variant (Dalinda's deception) that Shakespeare may have known via Spenser or via Harington's 1591 English Orlando. The Italian deception-at-the-window plot has many strands.",
        workTitle: "Orlando Furioso",
        workAuthor: "Ludovico Ariosto",
        passageReference: "Canto V",
        targetBookId: "orlando-furioso",
        targetChapterNumber: 5,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  // ═══════════════════════════════════════════════════════════════════
  // ADDITIONAL DISTRIBUTED ANNOTATIONS
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "decameron-ii-5-andreuccio",
    bookId: "the-decameron",
    chapterNumber: 19,
    anchorText: "Andreuccio",
    anchorOccurrence: 1,
    title: "The Naples Night",
    quotedPassage: "Andreuccio of Perugia",
    passageReference: "Day II, Tale 5 — Fiammetta's tale",
    commentary: `Andreuccio is a provincial young man from Perugia who has come to Naples to buy horses with a heavy purse. In a single extraordinary night he is stripped of his money and clothes by a prostitute passing as his long-lost sister, falls through a latrine into a narrow alley, joins two thieves to rob the recently-entombed Archbishop of Naples, is locked in the tomb when his accomplices run, and escapes by frightening a second set of thieves who come to rob the same tomb. He emerges with the Archbishop's ruby ring and returns home richer than he arrived.

Many readers — and many scholars — consider this the single best-constructed comic tale in the collection. The pacing is extraordinary: each reversal flows from the one before with the inevitability of a well-made clock. Naples is drawn with geographic specificity — the Mal Pertugio, the street of shady women; the cathedral district; the nightwatchman's routes — at a level of urban detail matched nowhere else in the Decameron.

Read it as a picaresque. Andreuccio is the first picaresque hero in European literature, a full century and a half before the Spanish *Lazarillo de Tormes* (1554) invented the genre. The tale is proof that Boccaccio was capable of comic architecture at the highest level when he chose to be.`,
    crossReferences: [],
    tags: ["literary-influence", "historical"],
  },

  {
    id: "decameron-v-8-nastagio-botticelli",
    bookId: "the-decameron",
    chapterNumber: 58,
    anchorText: "Nastagio",
    anchorOccurrence: 1,
    title: "Nastagio and Botticelli's Four Panels",
    quotedPassage: "Nastagio degli Onesti",
    passageReference: "Day V, Tale 8 — Filomena's tale",
    commentary: `Nastagio degli Onesti, rejected by the woman he loves, withdraws into a pine wood outside Ravenna on a Friday. There he sees a damned knight hunting a naked damned lady with hounds; the knight catches her, kills her, and cuts out her heart and feeds it to the dogs. Then the scene resets and plays again. The knight tells Nastagio they are condemned to repeat this on Fridays in punishment for sins of the heart in life. Nastagio invites his beloved and her family to a banquet in the pine wood on the next Friday, where they witness the hunt; she is so terrified by the moral lesson that she relents and accepts him.

The tale is the Decameron's most visually productive. Sandro Botticelli painted four panels of it in 1483 for the Pucci family's wedding; they are now split between the Prado, a private collection, and the Palazzo Pucci. They are among Botticelli's greatest narrative works — shoulder to shoulder with the *Primavera* and the *Birth of Venus*. Botticelli chooses the hunt at its most violent moment, the pine wood, Nastagio in profile, the fleeing lady, the hounds and the knight — and then the banquet in panel four, where the courtship resolves.

Notice that Boccaccio's tale has been read in two opposite ways. Some readers see it as straightforward — rejecting love has consequences; the vision restores the lady to her senses. Others read it, especially in light of the damned woman's punishment, as a critique: a woman is being converted to desire by exposure to graphic misogynistic violence. Both readings are present in the text, and Botticelli's panels reward either.

The Tome Stoa uses a different Botticelli, the *Primavera*, as the cover painting for the Decameron — for the same aesthetic reasons: Boccaccio and Botticelli share a Florence.`,
    crossReferences: [],
    tags: ["literary-influence", "historical"],
  },

  {
    id: "decameron-vii-2-peronella-cask",
    bookId: "the-decameron",
    chapterNumber: 76,
    anchorText: "Peronella",
    anchorOccurrence: 1,
    title: "The Wine-Cask",
    quotedPassage: "Peronella",
    passageReference: "Day VII, Tale 2 — Filostrato's tale",
    commentary: `Peronella, a poor Neapolitan weaver's wife, is in bed with her lover when her husband comes home unexpectedly. She hides the lover in a wine-cask that the husband has actually come home to sell. When the husband calls her down, she says, without missing a beat, that there is a buyer already inside the cask examining it. The lover, hearing this, plays along. The husband is delighted. The lover climbs out. The husband climbs in to scrape it clean for delivery. While the husband is in the cask, Peronella and the lover continue their interrupted business above it, from which she extracts commentary on how the interior should be cleaned.

The tale is the classic cuckold farce. Molière read Boccaccio; so did the commedia dell'arte tradition; so did every later comic dramatist in European drama. The specific joke of a character in a small enclosed space while action continues invisibly outside — the cask, the cupboard, the chest, the bed — is one of the most productive comic devices in world literature, and this is perhaps its purest medieval instance.

Notice the narrator. Filostrato is the melancholy lover. He is on Dioneo's day, telling a tale whose vigor and bawdiness are pure Dioneo territory. Filostrato's voice brightens when he is asked to tell a tale of trickery rather than tragedy; Boccaccio is showing that the brigata's members can work outside their usual modes. Part of the pleasure of Day VII is watching Filostrato and the others inhabit the comic genre.`,
    crossReferences: [],
    tags: ["literary-influence", "historical"],
  },

  {
    id: "decameron-ix-2-abbess-breeches",
    bookId: "the-decameron",
    chapterNumber: 100,
    anchorText: "abbess",
    anchorOccurrence: 1,
    title: "The Abbess and the Breeches",
    quotedPassage: "An abbess",
    passageReference: "Day IX, Tale 2 — Elisa's tale",
    commentary: `An abbess of a strict convent is awakened in the night with the news that a nun has been caught in bed with a lover. The abbess, dressing to come out and deliver a ferocious rebuke, does so in darkness. The nun, when publicly accused, realizes that what the abbess is wearing on her head — what the abbess thinks is her wimple — is a pair of breeches. The lover in the abbess's own cell has provided them. The abbess, seeing the nun glance up at her headgear, understands. She changes her tune. The nun is forgiven. Everyone's lover is maintained.

Read this as the apex of the Decameron's anticlerical satire. It is not about a single corrupt abbess; it is about the entire theatre of religious authority the Middle Ages produced. The abbess, to chastise, must have the moral high ground; the moral high ground depends on appearance; the appearance is literally a pair of another man's breeches. The whole structure of disciplinary authority is, in this tale, a wardrobe malfunction.

Boccaccio gives the tale to Elisa, who has told Guido Cavalcanti's retort in the previous day (VI.9). Elisa's voice is Boccaccio's sharpest. When she tells an anticlerical tale, the steel shows.

On the relation of the anticlerical satire to the work as a whole: Boccaccio is not anti-religion. He was a serious reader of Scripture and of Dante, and he ended his life close to monastic friends in Certaldo. What he is against is the gap between religious profession and lived behavior, and he is against it in proportion to the severity with which the professing party chastises others. The abbess of IX.2 condemns what she is doing herself. That is the satiric target.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },
]
