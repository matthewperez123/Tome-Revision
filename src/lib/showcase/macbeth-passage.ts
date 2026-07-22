/**
 * The showcase passage — Macbeth, Act I, Scene VII.
 *
 * REAL public-domain text, curated from the repo's own chapter JSON
 * (public/content/macbeth/ch-8.json, 734 words — inside the 600–900-word
 * showcase window; the dagger scene, Act II Scene I, runs only 570 words,
 * so the ambition scene anchors the slice instead). Stage directions are
 * rendered as captions; every quotable paragraph carries a stable anchor id
 * (`mac-1-7-p#`) used by the Trial items, Virgil's citations, and the
 * highlight feature.
 *
 * The scene: alone at the banquet, Macbeth counts the reasons not to kill
 * Duncan and finds only "vaulting ambition" on the other side of the
 * ledger — then Lady Macbeth dismantles each objection.
 */

export interface PassageLine {
  /** Speaker label for dramatic dialogue, omitted for soliloquy/stage text. */
  speaker?: string
  text: string
}

export interface PassageParagraph {
  /** Stable anchor id referenced by Trial items and Virgil citations. */
  id: string
  /** "soliloquy" | "dialogue" | "stage" */
  kind: "soliloquy" | "dialogue" | "stage"
  lines: PassageLine[]
}

export interface ShowcasePassage {
  bookTitle: string
  author: string
  citation: string
  sourceNote: string
  wordCount: number
  paragraphs: PassageParagraph[]
}

export const MACBETH_PASSAGE: ShowcasePassage = {
  bookTitle: "Macbeth",
  author: "William Shakespeare",
  citation: "Act I, Scene VII",
  sourceNote:
    "Public-domain text (Globe edition), curated from Tome's chapter data. 734 words.",
  wordCount: 734,
  paragraphs: [
    {
      id: "mac-1-7-p1",
      kind: "stage",
      lines: [
        {
          text:
            "Macbeth's castle. Hautboys and torches. The feast passes over the stage; " +
            "then Macbeth enters alone, and the room empties of every voice but his own.",
        },
      ],
    },
    {
      id: "mac-1-7-p2",
      kind: "soliloquy",
      lines: [
        {
          speaker: "Macbeth",
          text:
            "If it were done when ’tis done, then ’twere well\n" +
            "It were done quickly: if the assassination\n" +
            "Could trammel up the consequence, and catch\n" +
            "With his surcease success; that but this blow\n" +
            "Might be the be-all and the end-all here,\n" +
            "But here, upon this bank and shoal of time,\n" +
            "We’ld jump the life to come.",
        },
      ],
    },
    {
      id: "mac-1-7-p3",
      kind: "soliloquy",
      lines: [
        {
          speaker: "Macbeth",
          text:
            "But in these cases\n" +
            "We still have judgment here; that we but teach\n" +
            "Bloody instructions, which, being taught, return\n" +
            "To plague the inventor: this even-handed justice\n" +
            "Commends the ingredients of our poison’d chalice\n" +
            "To our own lips. He’s here in double trust;\n" +
            "First, as I am his kinsman and his subject,\n" +
            "Strong both against the deed; then, as his host,\n" +
            "Who should against his murderer shut the door,\n" +
            "Not bear the knife myself.",
        },
      ],
    },
    {
      id: "mac-1-7-p4",
      kind: "soliloquy",
      lines: [
        {
          speaker: "Macbeth",
          text:
            "Besides, this Duncan\n" +
            "Hath borne his faculties so meek, hath been\n" +
            "So clear in his great office, that his virtues\n" +
            "Will plead like angels, trumpet-tongued, against\n" +
            "The deep damnation of his taking-off;\n" +
            "And pity, like a naked new-born babe,\n" +
            "Striding the blast, or heaven’s cherubim, horsed\n" +
            "Upon the sightless couriers of the air,\n" +
            "Shall blow the horrid deed in every eye,\n" +
            "That tears shall drown the wind.",
        },
      ],
    },
    {
      id: "mac-1-7-p5",
      kind: "soliloquy",
      lines: [
        {
          speaker: "Macbeth",
          text:
            "I have no spur\n" +
            "To prick the sides of my intent, but only\n" +
            "Vaulting ambition, which o’erleaps itself\n" +
            "And falls on the other.",
        },
      ],
    },
    {
      id: "mac-1-7-p6",
      kind: "dialogue",
      lines: [
        { speaker: "Lady Macbeth", text: "He has almost supp’d: why have you left the chamber?" },
        { speaker: "Macbeth", text: "Hath he ask’d for me?" },
        { speaker: "Lady Macbeth", text: "Know you not he has?" },
        {
          speaker: "Macbeth",
          text:
            "We will proceed no further in this business:\n" +
            "He hath honour’d me of late; and I have bought\n" +
            "Golden opinions from all sorts of people,\n" +
            "Which would be worn now in their newest gloss,\n" +
            "Not cast aside so soon.",
        },
        {
          speaker: "Lady Macbeth",
          text:
            "Was the hope drunk\n" +
            "Wherein you dress’d yourself? hath it slept since?\n" +
            "And wakes it now, to look so green and pale\n" +
            "At what it did so freely? From this time\n" +
            "Such I account thy love. Art thou afeard\n" +
            "To be the same in thine own act and valour\n" +
            "As thou art in desire? Wouldst thou have that\n" +
            "Which thou esteem’st the ornament of life,\n" +
            "And live a coward in thine own esteem,\n" +
            "Letting “I dare not” wait upon “I would,”\n" +
            "Like the poor cat i’ the adage?",
        },
        {
          speaker: "Macbeth",
          text: "Prithee, peace:\nI dare do all that may become a man;\nWho dares do more is none.",
        },
        {
          speaker: "Lady Macbeth",
          text:
            "What beast was’t, then,\n" +
            "That made you break this enterprise to me?\n" +
            "When you durst do it, then you were a man;\n" +
            "And, to be more than what you were, you would\n" +
            "Be so much more the man. I have given suck, and know\n" +
            "How tender ’tis to love the babe that milks me:\n" +
            "I would, while it was smiling in my face,\n" +
            "Have pluck’d my nipple from his boneless gums,\n" +
            "And dash’d the brains out, had I so sworn as you\n" +
            "Have done to this.",
        },
        { speaker: "Macbeth", text: "If we should fail?" },
        {
          speaker: "Lady Macbeth",
          text:
            "We fail!\n" +
            "But screw your courage to the sticking-place,\n" +
            "And we’ll not fail. When Duncan is asleep —\n" +
            "Whereto the rather shall his day’s hard journey\n" +
            "Soundly invite him — his two chamberlains\n" +
            "Will I with wine and wassail so convince\n" +
            "That memory, the warder of the brain,\n" +
            "Shall be a fume: when in swinish sleep\n" +
            "Their drenched natures lie as in a death,\n" +
            "What cannot you and I perform upon\n" +
            "The unguarded Duncan? what not put upon\n" +
            "His spongy officers, who shall bear the guilt\n" +
            "Of our great quell?",
        },
        {
          speaker: "Macbeth",
          text:
            "Bring forth men-children only;\n" +
            "For thy undaunted mettle should compose\n" +
            "Nothing but males. Will it not be received,\n" +
            "When we have mark’d with blood those sleepy two\n" +
            "Of his own chamber and used their very daggers,\n" +
            "That they have done’t?",
        },
        {
          speaker: "Lady Macbeth",
          text:
            "Who dares receive it other,\n" +
            "As we shall make our griefs and clamour roar\n" +
            "Upon his death?",
        },
        {
          speaker: "Macbeth",
          text:
            "I am settled, and bend up\n" +
            "Each corporal agent to this terrible feat.\n" +
            "Away, and mock the time with fairest show:\n" +
            "False face must hide what the false heart doth know.",
        },
      ],
    },
    {
      id: "mac-1-7-p7",
      kind: "stage",
      lines: [{ text: "Exeunt." }],
    },
  ],
}

/** The line Virgil steers the reader toward (keyboard alternative to selection). */
export const SUGGESTED_HIGHLIGHT = {
  paragraphId: "mac-1-7-p5",
  quote:
    "I have no spur\nTo prick the sides of my intent, but only\nVaulting ambition, which o’erleaps itself\nAnd falls on the other.",
}

/** Look up a passage paragraph by anchor id. */
export function getPassageParagraph(id: string): PassageParagraph | undefined {
  return MACBETH_PASSAGE.paragraphs.find((p) => p.id === id)
}
