/**
 * Showcase Trial bank — the four-part Macbeth Trial.
 *
 * Authored against the REAL passage in ./macbeth-passage (Act I, Scene VII),
 * one item per required family in the plan's slice order:
 *
 *   1. word-in-context    — "surcease" in the soliloquy's opening gambit
 *   2. find-the-evidence  — locate the "no spur but vaulting ambition" lines
 *   3. who-said-it        — "screw your courage to the sticking-place"
 *   4. reflection         — weigh Macbeth's strongest objection (never punished)
 *
 * Every item carries the full pedagogical apparatus the Trial engine
 * renders: passage anchors, rationale, evidence anchor, and a 3-level hint
 * ladder (gentle nudge → narrow the field → point to evidence). Pair with
 * SHOWCASE_SEED on TrialPlayer and the session replays identically.
 */

import type { TrialItem } from "@/lib/trials/types"

export const MACBETH_TRIAL_ITEMS: TrialItem[] = [
  {
    id: "showcase-mac-1-7-word-1",
    family: "word-in-context",
    prompt: "In the soliloquy, what does “surcease” mean?",
    anchors: [{ paragraphId: "mac-1-7-p2" }],
    rationale:
      "Macbeth wishes the assassination could “trammel up the consequence, and catch / With his surcease success” — that Duncan’s death (surcease, from the Old French sursis, a cessation) could be the clean end of the matter, with no consequence following. The whole soliloquy proves him wrong: judgment, he admits, is never so contained.",
    evidenceAnchor: { paragraphId: "mac-1-7-p2", quote: "With his surcease success" },
    hints: [
      { level: 1, text: "Macbeth is imagining the murder as a full stop — an ending with nothing after it." },
      { level: 2, text: "The word names what he hopes Duncan’s death will be: the last word on the matter." },
      { level: 3, text: "Read “catch / With his surcease success” — surcease pairs with success as the ending he hopes to catch." },
    ],
    wisdom: 10,
    difficulty: "scholar",
    content: {
      sentence:
        "If the assassination / Could trammel up the consequence, and catch / With his surcease success…",
      targetWord: "surcease",
      choices: [
        { text: "Cessation — an ending or death", correct: true },
        { text: "A sudden surplus of fortune", correct: false },
        { text: "A solemn promise", correct: false },
        { text: "A surprise attack", correct: false },
      ],
    },
  },
  {
    id: "showcase-mac-1-7-evidence-1",
    family: "find-the-evidence",
    prompt: "Find the lines that prove the claim.",
    anchors: [{ paragraphId: "mac-1-7-p5" }],
    rationale:
      "After three paragraphs of reasons not to act — kinship, the duties of a host, Duncan’s spotless reign — Macbeth names his only motive in plain terms: no spur but “vaulting ambition, which o’erleaps itself.” The lines are the fulcrum of the soliloquy and of the play.",
    evidenceAnchor: { paragraphId: "mac-1-7-p5", quote: "Vaulting ambition, which o’erleaps itself" },
    hints: [
      { level: 1, text: "The proof is in the soliloquy’s final four lines." },
      { level: 2, text: "Look for where Macbeth stops listing objections and names what drives him." },
      { level: 3, text: "The last two segments — the spur and the ambition that overleaps itself." },
    ],
    wisdom: 15,
    difficulty: "scholar",
    content: {
      claim: "Macbeth admits that ambition — not justice, loyalty, or grievance — is his only motive.",
      segments: [
        "Besides, this Duncan hath borne his faculties so meek…",
        "…that his virtues will plead like angels, trumpet-tongued, against the deep damnation of his taking-off;",
        "And pity, like a naked new-born babe, striding the blast…",
        "…shall blow the horrid deed in every eye, that tears shall drown the wind.",
        "I have no spur to prick the sides of my intent, but only",
        "Vaulting ambition, which o’erleaps itself and falls on the other.",
      ],
      correctRange: [4, 5],
    },
  },
  {
    id: "showcase-mac-1-7-who-1",
    family: "who-said-it",
    prompt: "Who speaks this line?",
    anchors: [{ paragraphId: "mac-1-7-p6" }],
    rationale:
      "Lady Macbeth answers “If we should fail?” with “We fail! / But screw your courage to the sticking-place” — turning his fear of failure into contempt for hesitation, and laying out the plot against the chamberlains in the same breath.",
    evidenceAnchor: { paragraphId: "mac-1-7-p6", quote: "screw your courage to the sticking-place" },
    hints: [
      { level: 1, text: "The line answers Macbeth’s fearful question, “If we should fail?”" },
      { level: 2, text: "The speaker is the one who mocked his courage a moment earlier — “the poor cat i’ the adage.”" },
      { level: 3, text: "The same speaker proposes drugging Duncan’s chamberlains in the next breath." },
    ],
    wisdom: 10,
    difficulty: "apprentice",
    content: {
      quote: "But screw your courage to the sticking-place, / And we’ll not fail.",
      choices: [
        { name: "Macbeth", correct: false },
        { name: "Lady Macbeth", correct: true },
        { name: "Banquo", correct: false },
        { name: "The First Witch", correct: false },
      ],
    },
  },
  {
    id: "showcase-mac-1-7-reflection-1",
    family: "reflection",
    prompt:
      "Macbeth gives three reasons not to kill Duncan: he is Duncan’s kinsman and subject, he is Duncan’s host, and Duncan “hath been / So clear in his great office.” Which argument do you find strongest, and why? Quote or paraphrase a phrase from the scene.",
    anchors: [{ paragraphId: "mac-1-7-p3" }, { paragraphId: "mac-1-7-p4" }],
    rationale:
      "There is no wrong answer here — the Trial rewards the weighing, not the verdict. Strong responses name one objection, anchor it in the text (“as I am his kinsman and his subject,” “Not bear the knife myself,” “his virtues / Will plead like angels”), and say why it binds or fails to bind. Macbeth himself concedes all three are real; only “vaulting ambition” outweighs them.",
    evidenceAnchor: { paragraphId: "mac-1-7-p3", quote: "Not bear the knife myself" },
    hints: [
      { level: 1, text: "Pick one of the three objections — kinship, hospitality, or Duncan’s goodness — and start there." },
      { level: 2, text: "Anchor it: quote a short phrase, then explain what obligation it creates." },
      { level: 3, text: "Consider which objection Macbeth himself spends the most lines on — the count tells you what he fears most." },
    ],
    wisdom: 15,
    difficulty: "scholar",
    content: {
      minWords: 40,
      guidance: [
        "I find the strongest argument to be… because…",
        "Shakespeare gives it away in the phrase “…”",
        "This obligation matters because a host / a kinsman / a subject…",
      ],
      rubric: [
        { id: "names-one", label: "I named one of Macbeth’s three objections" },
        { id: "anchors-text", label: "I quoted or paraphrased a phrase from the scene" },
        { id: "explains-why", label: "I explained why that objection is strong (or why it fails)" },
      ],
    },
  },
]

export const MACBETH_TRIAL_TITLE = "The Trial of the Vaulting Ambition"
export const MACBETH_TRIAL_INSTRUCTION =
  "Four proofs from the scene you just read. Answer from the passage — hints (H) cost a little Wisdom, wrong answers cost nothing."
