/**
 * Single source of truth for the FAQ page. Both the visible accordions and
 * the FAQPage JSON-LD are generated from this data so they never drift.
 *
 * Answers are authored verbatim from the product brief. Items still awaiting
 * confirmation carry `confirm: true` (and a short note) — surfaced before
 * launch, never invented beyond the brief.
 */
import {
  CANONICAL_BOOK_COUNT,
  HOUSEHOLD_ENABLED,
  HOUSEHOLD_SEATS,
  SOLO_ANNUAL_PRICE,
  TRADITIONS_LABEL,
} from "./pricing"

export interface FaqItem {
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

export const faqCategories: FaqCategory[] = [
  {
    id: "readers",
    label: "Reading & getting started",
    items: [
      {
        q: "What is Tome?",
        a: "Tome is a guided reading platform for the canon of world literature. You read complete, unabridged texts alongside Virgil — an AI scholar in the margin who annotates passages, answers questions, and grades your reflections — while earning Wisdom, keeping a daily Flame, and collecting Seals as you go.",
      },
      {
        q: "How is this different from reading free public-domain books elsewhere?",
        a: "The texts are free; the scholarship, structure, and accountability are what Tome adds. Margin-by-margin annotation, end-of-chapter Trials, progress tracking, and Circles (book clubs) are built to help you actually finish the hard books instead of abandoning them on chapter three.",
      },
      {
        q: "Who is Virgil, and is he accurate?",
        a: "Virgil is Tome's AI reading companion, named for Dante's guide. His annotations are generated against the specific passage in front of you and kept close to the text; he's a scholarly aid, not an infallible authority, so treat him as a brilliant tutor rather than a citation.",
        confirm: true,
      },
      {
        q: "Are the texts complete?",
        a: "Yes — every book is the full, unabridged work. No summaries, no excerpts, rendered in Literata and formatted to its form, whether that's prose, verse, drama, or Middle English.",
      },
      {
        q: "How many books are in the library?",
        a: `${CANONICAL_BOOK_COUNT} books spanning every major literary tradition — roughly three thousand years and every continent, browsable by tradition on a single map.`,
      },
      {
        q: "What are Trials, Wisdom, Flames, and Seals?",
        a: "Trials are short assessments at the end of each chapter — comprehension, vocabulary, critical thinking, and a Virgil-graded reflection. Completing them earns Wisdom (which raises your level), reading daily keeps your Flame (your streak) alive, and milestones earn Seals (badges).",
      },
      {
        q: "Do I need a credit card to start?",
        a: "No. The Free plan is free forever and needs no card — you only add payment if you choose to upgrade.",
      },
      {
        q: "Can I read offline?",
        a: "Offline reading is included on Pro, Scholar, and Household.",
        confirm: true,
      },
      {
        q: "What devices does Tome work on?",
        a: "Tome runs in any modern browser on desktop, tablet, and phone.",
        confirm: true,
      },
      {
        q: "Is my reading private?",
        a: "Yes. Public profiles and Circles are opt-in; by default everything you read, highlight, and note stays private to you.",
      },
    ],
  },
  {
    id: "billing",
    label: "Plans & billing",
    items: [
      {
        q: "How does annual billing work?",
        a: `Solo is ${SOLO_ANNUAL_PRICE} per year when you switch the billing toggle to annual — the same plan as monthly Solo, just billed yearly for roughly two months free.`,
      },
      {
        q: "Is there a free trial?",
        a: "Yes. Every paid plan starts with a 7-day free trial of Pro. Cancel before it ends and you won't be charged.",
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes, right from your account settings. You keep full access through the end of the period you've already paid for.",
      },
      {
        q: "What happens to my library and progress if I cancel?",
        a: "Nothing is deleted. Your highlights, notes, Wisdom, and reading history stay on your account — you just return to Free-plan access until you resubscribe.",
      },
      {
        q: "Is there a household or family plan?",
        a: HOUSEHOLD_ENABLED
          ? `Yes — the Family plan covers up to ${HOUSEHOLD_SEATS} readers under one subscription, built for families reading the Great Books together.`
          : "Not yet — family plans are coming soon. For now, each reader needs their own account.",
      },
      {
        q: "What payment methods do you accept?",
        a: "All major credit and debit cards, processed securely through Stripe.",
        confirm: true,
      },
      {
        q: "Do you offer refunds?",
        a: "If something isn't right, contact us within 14 days of a charge and we'll make it right.",
        confirm: true,
      },
      {
        q: "Do you offer student or educator discounts?",
        a: "Individual teachers use Tome free in their classroom — see the Educators section below.",
        confirm: true,
      },
    ],
  },
  {
    id: "educators",
    label: "For educators",
    items: [
      {
        q: "Is Tome really free for individual teachers?",
        a: "Yes. The Classroom plan is free forever for one teacher with up to 30 students — real assignments, auto-graded Trials, and a gradebook export, no credit card required.",
      },
      {
        q: "How do students join my class?",
        a: "You share a join code (for example, TOME-7Q4) and students enter it to land directly in your roster — no manual account setup.",
      },
      {
        q: "What can I assign?",
        a: "Five assignment types: chapter readings, Trials, Virgil-graded reflections, annotation prompts, and quote collections — each with due dates and the option to scope to a whole class or a single student.",
      },
      {
        q: "How does grading work?",
        a: "Trials auto-grade instantly. On paid plans, Virgil drafts grades and feedback for written reflections, which you review and adjust before they're final.",
      },
      {
        q: "Does Tome integrate with my LMS or Google Classroom?",
        a: "Gradebook and LMS export are available on the School plan; automatic roster sync with Clever, ClassLink, and Google Classroom, plus single sign-on, comes with District.",
      },
      {
        q: "Is student data safe?",
        a: "Protecting student data is a priority. We follow FERPA- and COPPA-aligned practices and never sell student data.",
        confirm: true,
      },
      {
        q: "How do I bring Tome to my whole department or school?",
        a: "The School and District plans add unlimited classes, every assignment type, co-teacher sharing, dashboards, and integrations. Book a demo and we'll set up a pilot for your team.",
      },
    ],
  },
  {
    id: "about",
    label: "The texts & trust",
    items: [
      {
        q: "Where do the books come from?",
        a: "Every text is in the public domain, sourced and cleaned from high-quality digital editions and reformatted for Tome's reader so the typography and structure do the work justice.",
      },
      {
        q: "How do you decide which books are chosen for readers?",
        a: `Every title belongs to the established canon of world literature, chosen for its lasting influence across traditions — and every book is in the public domain, sourced from high-quality digital editions. The library spans ${CANONICAL_BOOK_COUNT} works across ${TRADITIONS_LABEL}, and Virgil can suggest where to start based on what you already love.`,
      },
      {
        q: "Is Tome tied to a particular religion or school of thought?",
        a: "Tome is for anyone serious about the canon of world literature — used by independent readers, homeschoolers, and both faith-based and secular schools alike.",
        confirm: true,
      },
    ],
  },
  {
    id: "support",
    label: "Support",
    items: [
      {
        q: "How do I get support?",
        a: "Reach a person anytime through the messenger in the corner of the app — real help, not just docs. [CONFIRM: also list a support email.]",
        confirm: true,
      },
    ],
  },
]

/** Strip markdown/HTML so JSON-LD answer strings are plain text. */
export function plainText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim()
}

/** schema.org FAQPage structured data generated from the visible copy. */
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqCategories.flatMap((category) =>
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
