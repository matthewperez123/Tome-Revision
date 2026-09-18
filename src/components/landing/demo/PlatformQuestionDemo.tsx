"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { CheckCircle2, XCircle, Feather } from "lucide-react"
import { cn } from "@/lib/utils"
import { checkAnswer, type Question, type QuestionType } from "@/lib/quiz-engine"
import {
  QUESTION_RENDERERS,
  QUESTION_TYPE_ICONS,
  QUESTION_TYPE_LABELS,
} from "@/components/trials/questions"

/**
 * [3.7] Marketing demo of the THIRTEEN live platform question types — the
 * same renderers, engine `Question` shape, and deterministic grader
 * (`checkAnswer` → src/lib/questions/grade.ts) the reader's chapter Trials
 * use. One grounded sample question per type, each from a different book in
 * the canon. Nothing here is a mock renderer: if it works in this demo, it
 * works in the product, because it IS the product code.
 */

// One question per platform type, in the launch type-ladder order
// (Apprentice row, Scholar row, Master row).
export const PLATFORM_DEMO_QUESTIONS: Question[] = [
  // ── Apprentice ladder ──
  {
    id: "pd-multiple_choice",
    quiz_id: "platform-demo",
    order: 0,
    type: "multiple_choice",
    prompt: "In The Odyssey, why does Odysseus tell the Cyclops his name is \u201cNobody\u201d?",
    options: [
      "So the other Cyclopes will ignore Polyphemus when he cries that \u201cNobody\u201d is hurting him",
      "Because he has forgotten his own name after ten years of war",
      "To honor a vow of silence he made to Athena",
      "Because Polyphemus demands a name before sharing his food",
    ],
    correct_answer:
      "So the other Cyclopes will ignore Polyphemus when he cries that \u201cNobody\u201d is hurting him",
    explanation:
      "The trick pays off exactly as planned: when the blinded Polyphemus roars that \u201cNobody\u201d is killing him, his neighbors shrug and go home — cunning defeating strength, the poem's signature move.",
    citation: "The Odyssey, Book IX",
  },
  {
    id: "pd-true_false",
    quiz_id: "platform-demo",
    order: 1,
    type: "true_false",
    prompt:
      "In Pride and Prejudice, Elizabeth Bennet accepts Mr. Darcy's first proposal of marriage.",
    options: ["true", "false"],
    correct_answer: "false",
    explanation:
      "She refuses him outright — \u201cyou were the last man in the world whom I could ever be prevailed on to marry\u201d — and the rest of the novel is the slow undoing of that sentence.",
    citation: "Pride and Prejudice, Chapter 34",
  },
  {
    id: "pd-fill_blank",
    quiz_id: "platform-demo",
    order: 2,
    type: "fill_blank",
    prompt: "Complete the most famous opening line in American literature: \u201cCall me ____.\u201d",
    options: [],
    correct_answer: "Ishmael",
    acceptedVariants: ["ishmael"],
    explanation:
      "Moby-Dick opens with an instruction, not an introduction — the narrator asks to be called Ishmael, the Biblical outcast, and never confirms it is his real name.",
    citation: "Moby-Dick, Chapter 1",
  },
  {
    id: "pd-identification",
    quiz_id: "platform-demo",
    order: 3,
    type: "identification",
    prompt: "\u201cReader, I married him.\u201d",
    identificationSubject: "speaker",
    options: ["Jane Eyre", "Bertha Mason", "Blanche Ingram", "Mrs. Fairfax"],
    correct_answer: "Jane Eyre",
    explanation:
      "Jane speaks the novel's most famous sentence — active voice, her verb, her choice. She marries him; she is not married off.",
    citation: "Jane Eyre, Chapter 38",
  },
  {
    id: "pd-ordering",
    quiz_id: "platform-demo",
    order: 4,
    type: "ordering",
    prompt: "Put these events of Great Expectations in the order they happen.",
    options: [
      "Pip learns his secret benefactor is the convict Magwitch",
      "Pip meets the convict on the marshes",
      "Pip is told he has \u201cgreat expectations\u201d and leaves for London",
      "Pip is summoned to Satis House to play for Miss Havisham",
    ],
    correctOrder: [
      "Pip meets the convict on the marshes",
      "Pip is summoned to Satis House to play for Miss Havisham",
      "Pip is told he has \u201cgreat expectations\u201d and leaves for London",
      "Pip learns his secret benefactor is the convict Magwitch",
    ],
    correct_answer: JSON.stringify([
      "Pip meets the convict on the marshes",
      "Pip is summoned to Satis House to play for Miss Havisham",
      "Pip is told he has \u201cgreat expectations\u201d and leaves for London",
      "Pip learns his secret benefactor is the convict Magwitch",
    ]),
    explanation:
      "The whole novel turns on that last reveal: the fortune Pip assumed came from Miss Havisham came from the marshes all along.",
    citation: "Great Expectations",
  },

  // ── Scholar ladder ──
  {
    id: "pd-vocabulary_in_context",
    quiz_id: "platform-demo",
    order: 5,
    type: "vocabulary_in_context",
    prompt: "As Pope uses it here, what does \u201cwrath\u201d mean?",
    vocabWord: "wrath",
    etymology: "Old English wr\u01e3ththu, from wr\u0101th, \u201cangry\u201d",
    passage:
      "Achilles' wrath, to Greece the direful spring / Of woes unnumber'd, heavenly goddess, sing!",
    options: [
      "Sustained, consuming anger",
      "Grief for a fallen friend",
      "Courage in battle",
      "A god's blessing",
    ],
    correct_answer: "Sustained, consuming anger",
    explanation:
      "\u201cWrath\u201d is the Iliad's first word and its whole subject — not a flash of temper but an anger that burns for books at a time and costs armies.",
    citation: "The Iliad, Book I (Pope)",
  },
  {
    id: "pd-passage_id",
    quiz_id: "platform-demo",
    order: 6,
    type: "passage_id",
    prompt: "Which novel opens with this passage?",
    passage:
      "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness\u2026",
    options: [
      "A Tale of Two Cities",
      "Great Expectations",
      "Wuthering Heights",
      "Vanity Fair",
    ],
    correct_answer: "A Tale of Two Cities",
    explanation:
      "Dickens opens his novel of the French Revolution with a drumroll of paired opposites — London and Paris, calm and terror — announced in the rhythm of the very first sentence.",
    citation: "A Tale of Two Cities, Book I, Chapter 1",
  },
  {
    id: "pd-matching",
    quiz_id: "platform-demo",
    order: 7,
    type: "matching",
    prompt: "Match each figure of The Odyssey to their part in the story.",
    options: [],
    matchingLeft: ["Penelope", "Telemachus", "Circe", "Polyphemus"],
    matchingRight: [
      "The Cyclops blinded by Odysseus",
      "Weaves and unweaves a shroud to hold off the suitors",
      "The enchantress who turns sailors to swine",
      "Sails in search of news of his father",
    ],
    correctPairs: {
      Penelope: "Weaves and unweaves a shroud to hold off the suitors",
      Telemachus: "Sails in search of news of his father",
      Circe: "The enchantress who turns sailors to swine",
      Polyphemus: "The Cyclops blinded by Odysseus",
    },
    correct_answer: JSON.stringify({
      Penelope: "Weaves and unweaves a shroud to hold off the suitors",
      Telemachus: "Sails in search of news of his father",
      Circe: "The enchantress who turns sailors to swine",
      Polyphemus: "The Cyclops blinded by Odysseus",
    }),
    explanation:
      "Each figure tests a different virtue: Penelope's cunning patience, Telemachus's coming of age, Circe's transformation, Polyphemus's brute strength undone by wit.",
    citation: "The Odyssey",
  },
  {
    id: "pd-close_reading",
    quiz_id: "platform-demo",
    order: 8,
    type: "close_reading",
    prompt: "In this passage, going to sea functions for Ishmael as\u2026",
    passage:
      "Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul\u2026 then, I account it high time to get to sea as soon as I can. This is my substitute for pistol and ball.",
    options: [
      "A remedy against despair — his \u201csubstitute for pistol and ball\u201d",
      "A path to wealth in the whale fishery",
      "An escape from creditors ashore",
      "A patriotic duty to the young republic",
    ],
    correct_answer: "A remedy against despair — his \u201csubstitute for pistol and ball\u201d",
    explanation:
      "The metaphor is startlingly dark: \u201cpistol and ball\u201d means suicide. The sea is Ishmael's cure for the \u201cdamp, drizzly November in my soul\u201d — the voyage begins as therapy.",
    citation: "Moby-Dick, Chapter 1",
  },
  {
    id: "pd-tf_with_reason",
    quiz_id: "platform-demo",
    order: 9,
    type: "tf_with_reason",
    prompt: "In Plato's Republic, the ideal city is to be ruled by philosopher-kings.",
    options: ["true", "false"],
    tfReasons: [
      "Because only those who know the Form of the Good can steer the city toward it",
      "Because philosophers are the wealthiest and can fund the state",
      "Because the guardians elect them by popular vote",
    ],
    tfCorrectReason: 0,
    correct_answer: "true|0",
    explanation:
      "True — and for Socrates the reason is everything: rule belongs to those who know the Good itself, not to the rich or the merely popular. Cities will have no rest from evils, he says, until philosophers rule.",
    citation: "The Republic, Book V",
  },

  // ── Master ladder ──
  {
    id: "pd-theme_analysis",
    quiz_id: "platform-demo",
    order: 10,
    type: "theme_analysis",
    prompt:
      "The red-room, the madwoman in the attic, and Jane's flight from Thornfield all develop which theme of Jane Eyre?",
    options: [
      "Confinement against the self's demand for freedom and dignity",
      "The superiority of wealth to love",
      "The healing power of the English countryside",
      "Loyalty to one's employer above all else",
    ],
    correct_answer: "Confinement against the self's demand for freedom and dignity",
    explanation:
      "Bront\u00eb keeps building rooms that hold women — the red-room, the attic, the prospect of a loveless marriage — and keeps having Jane walk out of them. The novel's argument is that a self is not a thing that can be kept.",
    citation: "Jane Eyre",
  },
  {
    id: "pd-cross_reference",
    quiz_id: "platform-demo",
    order: 11,
    type: "cross_reference",
    prompt:
      "Dante chooses Virgil as his guide through Hell. Which earlier epic — with its own journey into the underworld — made Virgil the natural choice?",
    options: ["The Aeneid", "The Iliad", "Metamorphoses", "Beowulf"],
    correct_answer: "The Aeneid",
    crossRefBookId: "the-aeneid",
    crossRefLabel: "The Aeneid, Book VI",
    explanation:
      "In Aeneid VI, Virgil had already sent Aeneas down among the dead. Dante recruits the poet who drew the first map — and then spends a hundred cantos redrawing it.",
    citation: "Inferno, Canto I",
  },
  {
    id: "pd-reflection",
    quiz_id: "platform-demo",
    order: 12,
    type: "reflection",
    prompt: "Reflect on Frankenstein.",
    reflectionPrompt:
      "Victor Frankenstein flees the creature the moment it opens its eyes. Who bears more responsibility for what follows — the creator or the created? Argue from the novel.",
    reflectionWordMin: 30,
    reflectionWordMax: 200,
    reflectionExpectedThemes: ["responsibility", "abandonment", "creation"],
    options: [],
    correct_answer: "",
    explanation:
      "In the app, Tome Assistant reads the reflection against a rubric and returns a score with feedback — visible to the student and, in classrooms, to the teacher.",
    citation: "Frankenstein",
  },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * Chip switcher + live renderer + grade feedback. Unstyled shell — mount it
 * inside a SectionShell / TeacherShowcaseShell.
 */
export function PlatformQuestionDemoInner() {
  const [idx, setIdx] = useState(0)
  const question = PLATFORM_DEMO_QUESTIONS[idx]

  return (
    <div>
      <div
        className="mb-4 flex flex-wrap justify-center gap-1.5"
        role="tablist"
        aria-label="Platform question types"
      >
        {PLATFORM_DEMO_QUESTIONS.map((q, i) => {
          const Icon = QUESTION_TYPE_ICONS[q.type]
          const active = i === idx
          return (
            <button
              key={q.type}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setIdx(i)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              <Icon className="size-3.5 shrink-0" />
              {QUESTION_TYPE_LABELS[q.type]}
            </button>
          )
        })}
      </div>

      {/* key resets answer state when the type switches */}
      <PlatformDemoStage
        key={question.id}
        question={question}
        onNext={() => setIdx((n) => (n + 1) % PLATFORM_DEMO_QUESTIONS.length)}
      />
    </div>
  )
}

function PlatformDemoStage({
  question,
  onNext,
}: {
  question: Question
  onNext: () => void
}) {
  const reduced = useReducedMotion() ?? false
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState(false)

  const Renderer = QUESTION_RENDERERS[question.type]
  const TypeIcon = QUESTION_TYPE_ICONS[question.type]
  const isReflection = question.type === "reflection"

  const handleSubmit = (answer: string) => {
    if (answered) return
    setSelectedAnswer(answer)
    setIsCorrect(checkAnswer(question, answer))
    setAnswered(true)
  }

  // These renderers own their prompt display (mirrors ChapterQuizOverlay).
  const rendererOwnsPrompt =
    question.type === "fill_blank" ||
    question.type === "passage_id" ||
    question.type === "close_reading" ||
    question.type === "vocabulary_in_context" ||
    question.type === "reflection"

  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-xl border border-border bg-card">
      <div className="max-h-[520px] overflow-y-auto p-5">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <TypeIcon className="size-3.5" />
          {QUESTION_TYPE_LABELS[question.type]}
          {question.citation && (
            <span className="ml-auto normal-case tracking-normal font-normal">
              {question.citation}
            </span>
          )}
        </div>

        {!rendererOwnsPrompt && (
          <p className="mb-4 font-serif text-lg font-semibold leading-snug text-foreground">
            {question.prompt}
          </p>
        )}

        <Renderer
          question={question}
          answered={answered}
          isCorrect={isCorrect}
          isWrong={answered && !isCorrect && !isReflection}
          selectedAnswer={selectedAnswer}
          onSubmit={handleSubmit}
          reduced={reduced}
        />
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className={cn(
              "border-t-2 px-5 py-3.5",
              isReflection
                ? "border-[#6B2C4E]/40 bg-[#6B2C4E]/5"
                : isCorrect
                  ? "border-[#3E7C6A]/50 bg-[#3E7C6A]/8"
                  : "border-[#D7472F]/50 bg-[#D7472F]/8",
            )}
            role="status"
            aria-live="polite"
          >
            <div
              className={cn(
                "mb-1 flex items-center gap-1.5 text-sm font-bold",
                isReflection
                  ? "text-[#6B2C4E]"
                  : isCorrect
                    ? "text-[#3E7C6A]"
                    : "text-[#D7472F]",
              )}
            >
              {isReflection ? (
                <Feather className="size-4" />
              ) : isCorrect ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <XCircle className="size-4" />
              )}
              {isReflection ? "Submitted for review" : isCorrect ? "Correct" : "Not quite"}
            </div>
            {question.explanation && (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {question.explanation}
              </p>
            )}
            <button
              type="button"
              onClick={onNext}
              className="mt-2.5 inline-flex items-center rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Next type
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
