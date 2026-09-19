/**
 * Single source of truth for the FAQ page. Both the visible accordions and
 * the FAQPage JSON-LD are generated from this data so they never drift.
 *
 * Answers are authored verbatim from the product brief. Items still awaiting
 * confirmation carry `confirm: true` (and a short note) — surfaced before
 * launch, never invented beyond the brief.
 */
import {
  SEAT_PRICE_USD_PER_YEAR,
  SCHOOL_ANNUAL_MINIMUM_USD,
  FAMILY_PRICE_USD_PER_YEAR,
  FAMILY_STUDENT_LIMIT,
  FREE_TEACHER_STUDENT_LIMIT,
} from "./billing/config"
import {
  catalogSummary,
  formatBookCount,
  formatTraditionCount,
  type CatalogStats,
} from "./marketing/catalog-stats"

export interface FaqItem {
  /** Stable slug for deep links, e.g. /faq#who-is-virgil. */
  id: string
  q: string
  a: string
  /** True when the answer contains a [CONFIRM] placeholder pending sign-off. */
  confirm?: boolean
}

export interface FaqCategory {
  id: string
  label: string
  items: FaqItem[]
}

/**
 * FAQ copy is a function of the live catalog stats so the book/tradition
 * numbers never drift from the homepage and pricing surfaces. Pass the
 * server-resolved `CatalogStats`; everything else is static copy.
 */
export function getFaqCategories(stats: CatalogStats): FaqCategory[] {
  return [
  {
    id: "readers",
    label: "Reading & getting started",
    items: [
      {
        id: "what-is-tome",
        q: "What is Tome?",
        a: "Tome is a guided reading platform for the canon of world literature. You read complete, unabridged texts alongside the Tome Assistant — an AI scholar in the margin that annotates passages, answers questions, and grades your reflections — while earning Wisdom, keeping a daily Flame, and collecting Seals as you go.",
      },
      {
        id: "how-tome-is-different",
        q: "How is this different from reading free public-domain books elsewhere?",
        a: "The texts are free; the scholarship, structure, and accountability are what Tome adds. Margin-by-margin annotation, end-of-chapter Trials, and progress tracking are built to help you actually finish the hard books instead of abandoning them on chapter three.",
      },
      {
        id: "who-is-virgil",
        q: "What is the Tome Assistant, and is it accurate?",
        a: "The Tome Assistant is Tome's AI reading companion. Its annotations are generated against the specific passage in front of you and kept close to the text; it is a scholarly aid, not an infallible authority, so treat it as a brilliant tutor rather than a citation.",
        confirm: true,
      },
      {
        id: "are-texts-complete",
        q: "Are the texts complete?",
        a: "Yes — every book is the full, unabridged work. No summaries, no excerpts, rendered in Literata and formatted to its form, whether that's prose, verse, drama, or Middle English.",
      },
      {
        id: "how-many-books",
        q: "How many books are in the library?",
        a: `${formatBookCount(stats.bookCount)} books spanning ${formatTraditionCount(
          stats.traditionCount,
        )} — roughly three thousand years and every continent, browsable by tradition on a single map.`,
      },
      {
        id: "trials-wisdom-flames-seals",
        q: "What are Trials, Wisdom, Flames, and Seals?",
        a: "Trials are short assessments at the end of each chapter — comprehension, vocabulary, critical thinking, and an assistant-graded reflection. Completing them earns Wisdom (which raises your level), reading daily keeps your Flame (your streak) alive, and milestones earn Seals (badges).",
      },
      {
        id: "need-credit-card",
        q: "Do I need a credit card to start?",
        a: "No. Teachers use Tome free forever with no card on file — payment only enters the picture when a classroom, school, or homeschool family buys student seats.",
      },
      {
        id: "supported-devices",
        q: "What devices does Tome work on?",
        a: "Tome runs in any modern browser on desktop, tablet, and phone.",
        confirm: true,
      },
      {
        id: "reading-privacy",
        q: "Is my reading private?",
        a: "Yes. By default everything you read, highlight, and note stays private to you — students' work is visible only to their teacher.",
      },
      {
        id: "trial-difficulties",
        q: "What are the Trial difficulty tiers?",
        a: "Every chapter Trial comes in three tiers — Apprentice for comprehension, Scholar for close reading, and Master for genuine critical analysis. Start where you're comfortable and climb as the text opens up.",
      },
      {
        id: "highlights-and-notes",
        q: "Can I highlight and take notes while I read?",
        a: "Yes. Highlight any passage, attach a note, and everything is saved to your account — your marginalia follows you across devices and stays private unless you choose to share it.",
      },
      {
        id: "daily-reading-goal",
        q: "How do daily reading goals work?",
        a: "When you join, you pick a pace — from casual to ambitious — and Tome tracks it. Reading on any day keeps your Flame alive; your goal is a rhythm to keep, not a deadline to miss.",
      },
      {
        id: "multiple-books-at-once",
        q: "Can I read more than one book at a time?",
        a: "Absolutely. Progress, highlights, and Trials are tracked per book, so you can keep an epic, a novel, and a play going at once and pick up each exactly where you left off.",
      },
      {
        id: "wisdom-ranks",
        q: "What are the reader ranks?",
        a: "Wisdom accumulates as you read and pass Trials, carrying you up the ladder from Novice through Reader, Scholar, Sage, and Luminary to Laureate. Rank is a record of the work you've done — it never gates what you can read.",
      },
      {
        id: "hard-books-help",
        q: "What if a book is too hard for me?",
        a: "That's the point of the margin. The Tome Assistant explains difficult passages in context, annotations unpack archaic language and allusions, and Apprentice-tier Trials let you build confidence before attempting deeper analysis.",
      },
    ],
  },
  {
    id: "billing",
    label: "Plans & billing",
    items: [
      {
        id: "how-pricing-works",
        q: "How is Tome priced?",
        a: `Teachers are free forever. Classrooms pay $${SEAT_PRICE_USD_PER_YEAR} per student per year, schools get volume pricing with a $${SCHOOL_ANNUAL_MINIMUM_USD.toLocaleString("en-US")} annual minimum, and homeschool families have the Family plan at $${FAMILY_PRICE_USD_PER_YEAR} per year. All billing is annual.`,
      },
      {
        id: "cancel-anytime",
        q: "Can I cancel anytime?",
        a: "Yes, right from your account settings. You keep full access through the end of the year you've already paid for.",
      },
      {
        id: "keep-progress-after-cancel",
        q: "What happens to my library and progress if I cancel?",
        a: "Nothing is deleted. Your highlights, notes, Wisdom, and reading history stay on your account — teachers simply return to the free teacher plan until you resubscribe.",
      },
      {
        id: "household-plan",
        q: "Is there a household or family plan?",
        a: `Yes — the Family plan covers up to ${FAMILY_STUDENT_LIMIT} students under one subscription at $${FAMILY_PRICE_USD_PER_YEAR} per year, built for homeschool families reading the Great Books together.`,
      },
      {
        id: "payment-methods",
        q: "What payment methods do you accept?",
        a: "All major credit and debit cards, processed securely through Stripe.",
        confirm: true,
      },
      {
        id: "refunds",
        q: "Do you offer refunds?",
        a: "If something isn't right, contact us within 14 days of a charge and we'll make it right.",
        confirm: true,
      },
      {
        id: "student-educator-discounts",
        q: "Do you offer student or educator discounts?",
        a: "Individual teachers use Tome free in their classroom — see the Educators section below.",
        confirm: true,
      },
      {
        id: "whats-in-free",
        q: "What exactly do free teachers get?",
        a: `The full library, the reader, pre-built quizzes, assignments, and the live gradebook for one classroom of up to ${FREE_TEACHER_STUDENT_LIMIT} students — free forever. Paid student seats add unlimited classrooms and a larger pool of Questions.`,
      },
      {
        id: "switch-plans",
        q: "Can I add seats later?",
        a: "Yes — you can add student seats at any time from your account settings, and the change is prorated automatically for the rest of your billing year.",
        confirm: true,
      },
      {
        id: "esa-funds",
        q: "Can I pay with ESA or education funds?",
        a: "Yes — Tome is distributed through education savings account (ESA) marketplaces in participating states, so eligible families can use education funds toward a subscription. Contact us if you don't see Tome in your state's marketplace.",
        confirm: true,
      },
      {
        id: "school-plan-pricing",
        q: "How is the School plan priced?",
        a: `School pricing is $${SEAT_PRICE_USD_PER_YEAR} per student per year with a $${SCHOOL_ANNUAL_MINIMUM_USD.toLocaleString("en-US")} annual minimum, billed annually by card, invoice, or purchase order. Teachers are always free. Get a quote and we'll set up a pilot for your team.`,
      },
    ],
  },
  {
    id: "educators",
    label: "For educators",
    items: [
      {
        id: "free-for-teachers",
        q: "Is Tome really free for individual teachers?",
        a: `Yes. Tome is free forever for individual teachers — one classroom with up to ${FREE_TEACHER_STUDENT_LIMIT} students, real assignments, auto-graded Trials, and a live gradebook, no credit card required.`,
      },
      {
        id: "how-students-join",
        q: "How do students join my class?",
        a: "You share a join code (for example, TOME-7Q4) and students enter it to land directly in your roster — no manual account setup.",
      },
      {
        id: "what-can-i-assign",
        q: "What can I assign?",
        a: "Five assignment types: chapter readings, Trials, assistant-graded reflections, annotation prompts, and quote collections — each with due dates and the option to scope to a whole class or a single student.",
      },
      {
        id: "how-grading-works",
        q: "How does grading work?",
        a: "Trials auto-grade instantly. On paid plans, the Tome Assistant drafts grades and feedback for written reflections, which you review and adjust before they're final.",
      },
      {
        id: "lms-integration",
        q: "Does Tome integrate with my LMS or Google Classroom?",
        a: "Not yet — LMS export is on the roadmap for the School plan, and automatic roster sync with Clever, ClassLink, and Google Classroom, plus single sign-on, is on the roadmap for District. Today you can run a full classroom with join codes, assignments, and the live gradebook.",
        confirm: true,
      },
      {
        id: "student-data-safe",
        q: "Is student data safe?",
        a: "Protecting student data is a priority. We follow FERPA- and COPPA-aligned practices, never sell student data, and never use it for advertising. See our Privacy & Security for Schools page for what we collect, our sub-processors, data deletion, and a DPA for schools.",
      },
      {
        id: "bring-tome-to-school",
        q: "How do I bring Tome to my whole department or school?",
        a: "The School and District plans add unlimited classes, every assignment type, co-teacher sharing, dashboards, and integrations. Book a demo and we'll set up a pilot for your team.",
      },
      {
        id: "students-without-email",
        q: "Can young students use Tome without an email address?",
        a: "Yes. Teachers can issue short access codes so students sign in with a code alone — no email address, no personal account setup — which keeps the youngest readers COPPA-safe by design.",
      },
      {
        id: "homeschool-use",
        q: "Does Tome work for homeschooling?",
        a: "Very well — the Family plan gives a homeschooling parent the full teacher toolset: assignments, Trials, assistant-drafted feedback, and a gradebook for every reader in the household.",
      },
      {
        id: "build-own-quizzes",
        q: "Can I write my own quizzes?",
        a: "Yes. Build quizzes question-by-question in the quiz builder, or have the Tome Assistant draft a grounded quiz from the assigned chapters that you edit and approve before students ever see it.",
      },
      {
        id: "see-student-progress",
        q: "Can I see what my students are reading in real time?",
        a: "Yes — the classroom dashboard shows live reading progress, submitted work, and Trial results as they happen, and the gradebook rolls it all up per student.",
      },
      {
        id: "students-and-ai",
        q: "Do students talk to the AI directly?",
        a: "AI features that touch student work run through you. The assistant drafts, explains, and grades under teacher control — Tome does not offer children an unsupervised chatbot.",
      },
    ],
  },
  {
    id: "about",
    label: "The texts & trust",
    items: [
      {
        id: "where-books-come-from",
        q: "Where do the books come from?",
        a: "Every text is in the public domain, sourced and cleaned from high-quality digital editions and reformatted for Tome's reader so the typography and structure do the work justice.",
      },
      {
        id: "how-books-are-chosen",
        q: "How do you decide which books are chosen for readers?",
        a: `Every title belongs to the established canon of world literature, chosen for its lasting influence across traditions — and every book is in the public domain, sourced from high-quality digital editions. The library spans ${catalogSummary(
          stats,
        )}, and the Tome Assistant can suggest where to start based on what you already love.`,
      },
      {
        id: "religious-affiliation",
        q: "Is Tome tied to a particular religion or school of thought?",
        a: "Tome is for anyone serious about the canon of world literature — used by independent readers, homeschoolers, and both faith-based and secular schools alike.",
        confirm: true,
      },
      {
        id: "works-in-translation",
        q: "Are non-English works available in translation?",
        a: "Yes — Homer, Dante, Cervantes, and the rest of the world canon appear in respected public-domain translations, while English-language works are presented in their original text, Middle English included.",
      },
      {
        id: "new-books-added",
        q: "Do you add new books?",
        a: "Continuously. The library grows as we source, clean, and typeset new public-domain editions — and reader requests genuinely shape what we ingest next.",
      },
      {
        id: "ai-and-my-data",
        q: "Is my reading data used to train AI models?",
        a: "No. Your highlights, notes, and conversations with the assistant are used to serve you, not to train models — and student data is never sold or used for advertising.",
        confirm: true,
      },
    ],
  },
  {
    id: "support",
    label: "Support",
    items: [
      {
        id: "how-to-get-support",
        q: "How do I get support?",
        a: "Reach a real person from the Support link in the app, or email support@usetome.app — real help, not just docs.",
      },
      {
        id: "accessibility",
        q: "Is Tome accessible?",
        a: "Accessibility is part of the reading experience: keyboard navigation, screen-reader labels, reduced-motion support, and adjustable reader typography. See our Accessibility page for the full statement.",
      },
      {
        id: "delete-account",
        q: "Can I delete my account and data?",
        a: "Yes — you can delete your account from settings, which removes your personal data and reading history. Schools can additionally request deletion for their students under our DPA.",
      },
    ],
  },
  ]
}

/** Strip markdown/HTML so JSON-LD answer strings are plain text. */
export function plainText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim()
}

/** schema.org FAQPage structured data generated from the visible copy. */
export function faqJsonLd(categories: FaqCategory[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((category) =>
      category.items.map((item) => ({
        "@type": "Question",
        name: plainText(item.q),
        acceptedAnswer: {
          "@type": "Answer",
          text: plainText(item.a),
        },
      }))
    ),
  }
}
