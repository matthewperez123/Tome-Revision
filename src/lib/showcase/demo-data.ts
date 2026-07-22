/**
 * Seeded role-view demo data — Teacher and Parent.
 *
 * All names, scores, and dates are fixed showcase fixtures, clearly labeled
 * as demo data in the UI. Nothing here touches Supabase; the CSV export is
 * generated locally from this same fixture so the download is byte-for-byte
 * deterministic on every run.
 */

export interface DemoStudent {
  id: string
  name: string
  /** 0..100 completion of the current assignment. */
  completion: number
  /** 0..100 Trial mastery average. */
  mastery: number
  /** Consecutive reading days (Flame). */
  flameDays: number
  lastActive: string
  needsHelp: boolean
  helpNote?: string
}

export const DEMO_ASSIGNMENT = {
  title: "Macbeth — Act I",
  dueLabel: "Due Fri, Jul 24",
  assignedLabel: "Assigned Mon, Jul 20",
  chapterTarget: "Scenes I–VII",
}

export const DEMO_STUDENTS: DemoStudent[] = [
  { id: "st-ava", name: "Ava R.", completion: 100, mastery: 92, flameDays: 7, lastActive: "Today", needsHelp: false },
  { id: "st-marcus", name: "Marcus L.", completion: 86, mastery: 78, flameDays: 4, lastActive: "Today", needsHelp: false },
  { id: "st-priya", name: "Priya S.", completion: 71, mastery: 84, flameDays: 9, lastActive: "Yesterday", needsHelp: false },
  { id: "st-jonah", name: "Jonah K.", completion: 43, mastery: 51, flameDays: 1, lastActive: "2 days ago", needsHelp: true, helpNote: "Trial “word in context” missed twice — likely vocabulary gap, not effort." },
  { id: "st-elena", name: "Elena V.", completion: 29, mastery: 0, flameDays: 0, lastActive: "5 days ago", needsHelp: true, helpNote: "No Trial attempt yet; Flame unlit. A nudge before Friday." },
]

/** One teacher-review thread: a student reflection with the teacher's reply. */
export const DEMO_REVIEW = {
  student: "Ava R.",
  submittedLabel: "Submitted Tue, Jul 21",
  prompt: "Which of Macbeth’s objections to the murder is strongest, and why?",
  response:
    "The host argument is the strongest. Macbeth says a host “should against his murderer shut the door, / Not bear the knife myself.” Kinship is about blood, but hospitality is a promise you make to a guest under your own roof — he breaks it with his own hands.",
  teacherReply: {
    author: "Ms. Okafor",
    label: "Returned Wed, Jul 22",
    body:
      "Strong close reading, Ava — you quoted the exact hinge of the line. Push it one step further in your next reflection: why does Shakespeare give Macbeth this argument and then have him abandon it in fifteen lines? What does that speed tell us?",
  },
}

/** CSV export of the assignment roster — built locally, no server. */
export function buildAssignmentCsv(students: DemoStudent[]): string {
  const header = "student,assignment,completion_pct,mastery_pct,flame_days,last_active,needs_help,note"
  const rows = students.map((s) =>
    [
      s.name,
      DEMO_ASSIGNMENT.title,
      String(s.completion),
      String(s.mastery),
      String(s.flameDays),
      s.lastActive,
      s.needsHelp ? "yes" : "no",
      s.helpNote ? `"${s.helpNote.replace(/"/g, '""')}"` : "",
    ].join(","),
  )
  return [header, ...rows].join("\n")
}

// ── Parent view ──────────────────────────────

export const DEMO_CHILD = {
  name: "Ava R.",
  weekLabel: "Week of Jul 20 – Jul 26",
}

/** Minutes read per day, Mon → Sun. Fixed. */
export const DEMO_WEEK_MINUTES = [
  { day: "Mon", minutes: 24 },
  { day: "Tue", minutes: 31 },
  { day: "Wed", minutes: 18 },
  { day: "Thu", minutes: 0 },
  { day: "Fri", minutes: 26 },
  { day: "Sat", minutes: 12 },
  { day: "Sun", minutes: 22 },
]

export const DEMO_CHILD_BOOK = {
  title: "Macbeth",
  status: "Act I complete · Act II unlocked",
  progressPct: 68,
  currentPlace: "Act II, Scene I — the dagger soliloquy",
  trialsPassed: 3,
  wisdomThisWeek: 146,
}

export const PARENT_PRIVACY_NOTE =
  "This summary shows progress, streaks, and earned rewards only. Reading " +
  "journals, Virgil conversations, and reflection text stay private to the " +
  "learner — parents see the shape of the habit, never its contents."
