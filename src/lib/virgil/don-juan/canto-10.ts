import type { Annotation } from "../types"

// ── Don Juan Canto X — hand-authored scholarly annotations ──────────────
// ch-11 in public/content/don-juan/ch-11.json. Canto X (87 stanzas):
// Juan is Catherine's favorite in St Petersburg, grows ill, and is sent
// south as her envoy to England. Byron satirizes Russian court life,
// the favorite system, and then — as Juan approaches London from
// Shooter's Hill — begins the English cantos that will close the poem.

export const DON_JUAN_CANTO_10: Annotation[] = [
  {
    id: "dj-10-newton",
    bookId: "don-juan",
    chapterNumber: 11,
    anchorText: "When Newton saw an apple fall",
    anchorOccurrence: 1,
    title: "\"When Newton saw an apple fall\" — the Fall as philosophical pun",
    quotedPassage:
      "When Newton saw an apple fall, he found / In that slight startle from his contemplation — / 'Tis said (for I'll not answer above ground / For any sage's creed or calculation) — / A mode of proving that the Earth turned round / In a most natural whirl, called \"gravitation;\" / And this is the sole mortal who could grapple, / Since Adam — with a fall — or with an apple.",
    passageReference: "Canto X, stanza 1 · DJ X.1",
    commentary: `Canto X opens with a joke that is also the poem's most concise philosophical claim. The Fall — the theological one, from Paradise Lost — and the fall of Newton's apple in the orchard at Woolsthorpe (1666, according to Newton's own account to his biographer Stukeley) are collapsed into a single pun. Both involve apples; both result in a new knowledge; the first is a catastrophe, the second is Enlightenment science. Byron's couplet — "this is the sole mortal who could grapple, / Since Adam — with a fall — or with an apple" — puts Newton and Adam on the same historical line.

The stanza is funny, but the argument underneath is genuinely Byronic: the Christian myth of the Fall has been replaced, in the modern intellectual settlement, by the secular myth of scientific discovery. Both myths require an apple; neither can be proved above ground (the closing couplet of stanza 1 and the parenthetical "for I'll not answer above ground / For any sage's creed or calculation" announce Byron's sceptical stance toward both). The Enlightenment has given us new knowledge but not new certainty; Newton is a modern Adam, and modernity is what comes after that second fall.

Canto X as a whole sits at the hinge of the poem: the oriental-military sequence (Cantos V–VIII) is behind us; the English-society sequence (XI–XVII) is about to open. The Newton stanza is a philosophical marker signaling the shift — from swords and harems to a European intellectual tradition whose typical question is the same question Adam was supposed to have answered and did not.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "The Fall in Paradise Lost (Books IX–X) is the prior apple. Byron's pun depends on the reader knowing Milton and reading Newton's fall as a modern secular counterpart. The cross-reference is light but precise.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book IX, Eve's fall",
        targetBookId: "paradise-lost",
        targetChapterNumber: 8,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "dj-10-london-shooters-hill",
    bookId: "don-juan",
    chapterNumber: 11,
    anchorText: "Shooter's Hill",
    anchorOccurrence: 1,
    title: "Shooter's Hill — Juan's first sight of London",
    quotedPassage:
      "Don Juan had got out on Shooter's Hill; / Sunset the time, the place the same declivity / Which looks along that vale of Good and Ill / Where London streets ferment in full activity.",
    passageReference: "Canto X, stanza 82 · DJ X.82",
    commentary: `Shooter's Hill is in southeast London (now Greenwich/Woolwich border), and historically the first high ground a traveller approaching London from Dover reached — the classic "first view of the city" prospect. In Byron's day the hill was still semi-rural, with a gibbet cage that had held the remains of executed highwaymen through the late 18c. The descent from Shooter's Hill into the Kent Road was the opening move of every coach journey into London.

Byron's "vale of Good and Ill" is a pun on *Vale of Kent* plus *Valley of the Shadow*; the English cantos he is about to open will be morally mixed, and the description of London as a ferment is his standard term (see his own letters, where London in the 1820s is "an anthill fired at the bottom"). The satirical register of the English cantos (XI–XVII) begins from this stanza: Byron is the English poet returning — in imagination — to the city that exiled him, and the tone is a mixture of fondness, disgust, and something very close to grief.

This is also the stanza where *Don Juan* as a specifically English poem begins. The previous ten cantos have been Spanish, Greek, Turkish, Russian; from here to the fragment of Canto XVII the setting is England. Readers coming to the poem for the English satire should start either here or at Canto XI's opening.`,
    crossReferences: [],
    tags: ["historical"],
  },
  {
    id: "dj-10-catherine-illness",
    bookId: "don-juan",
    chapterNumber: 11,
    anchorText: "Catherine look a little grim",
    anchorOccurrence: 1,
    title: "Juan's illness and the end of the Catherine episode",
    quotedPassage:
      "Catherine look a little grim, / Who did not like at first to lose her minion: / But when she saw his dazzling eye wax dim, / And drooping like an eagle's with clipt pinion, / She then resolved to send him on a mission.",
    passageReference: "Canto X, stanza 37 · DJ X.37",
    commentary: `Byron's handling of the end of the Catherine-favorite episode is brisk. Juan has fallen ill — a plausible physiological consequence of the court's lifestyle — and the empress, rather than risk her young favorite's death, arranges for him to be sent as ambassador to England with a complicated set of state papers. The diplomatic posting is a pretext; the actual function is to move Juan out of the empress's bedchamber before his illness becomes inconvenient.

The image in this stanza — Catherine looking "a little grim" as she registers the loss, Juan "drooping like an eagle's with clipt pinion" as his illness advances — is one of the canto's cleanest pieces of comic observation. The empress is never so recognisably human as when she realises a favourite is about to leave her. The diminutive *a little grim* does the work of the whole satirical portrait: the autocrat who has thousands of lives at her disposal is nevertheless experiencing the ordinary grief of a lover about to lose a partner, and the narrator grants her the recognition.

Catherine will not return in the poem. Her role across Cantos IX–X has been to embody the satirical portrait of power-as-appetite; her palette (imperial gold with a sharp edge) has done its work; she closes, in Byron's schema, with the same diagnostic as Wellington — a figure whose glory was for sale and whose private conduct the comic verse has dismantled.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },
]
