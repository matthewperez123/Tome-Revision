// ── Semester Plan Timeline Data ──

export type EventType = "book_reading" | "trial" | "essay_assignment" | "discussion" | "quiz_custom" | "essay_due" | "break" | "exam" | "milestone" | "note"

export interface SemesterPlan {
  id: string
  classroomId: string
  classroomName: string
  name: string
  startDate: string // ISO date
  endDate: string
  weekCount: number
  granularity: "week" | "biweekly" | "month" | "custom"
  theme: string | null
  colorAccent: string
}

export interface PlanEvent {
  id: string
  planId: string
  eventType: EventType
  title: string
  description: string
  startDate: string
  endDate: string | null // null = single day
  bookId: string | null
  bookTitle: string | null
  unitStart: number | null
  unitEnd: number | null
  color: string | null // override lane default
  lane: number
  sortOrder: number
}

export interface SemesterTemplate {
  id: string
  name: string
  description: string
  eventsSnapshot: Omit<PlanEvent, "planId">[]
  isShared: boolean
}

export interface PlanConflict {
  eventId: string
  message: string
  severity: "warning" | "info"
}

// ── Lane Configuration ──

export const LANES = [
  { index: 0, label: "Reading", color: "#78716C", bgClass: "bg-stone-100 dark:bg-stone-800", textClass: "text-stone-700 dark:text-stone-300" },
  { index: 1, label: "Trials", color: "#6366F1", bgClass: "bg-indigo-100 dark:bg-indigo-950/30", textClass: "text-indigo-700 dark:text-indigo-400" },
  { index: 2, label: "Essays", color: "#D4AF37", bgClass: "bg-amber-100 dark:bg-amber-950/30", textClass: "text-amber-700 dark:text-amber-400" },
  { index: 3, label: "Discussions", color: "#22C55E", bgClass: "bg-green-100 dark:bg-green-950/30", textClass: "text-green-700 dark:text-green-400" },
  { index: 4, label: "Milestones", color: "#A855F7", bgClass: "bg-purple-100 dark:bg-purple-950/30", textClass: "text-purple-700 dark:text-purple-400" },
]

export const EVENT_TYPE_TO_LANE: Record<EventType, number> = {
  book_reading: 0,
  trial: 1,
  essay_assignment: 2,
  essay_due: 2,
  discussion: 3,
  quiz_custom: 3,
  break: 4,
  exam: 4,
  milestone: 4,
  note: 4,
}

export const LANE_TO_DEFAULT_TYPE: Record<number, EventType> = {
  0: "book_reading",
  1: "trial",
  2: "essay_assignment",
  3: "discussion",
  4: "milestone",
}

// ── Demo Data ──

export const DEMO_SEMESTER_PLANS: SemesterPlan[] = [
  { id: "sp-1", classroomId: "class-1", classroomName: "AP Literature — Period 3", name: "Spring 2026 — The Epic Tradition", startDate: "2026-01-20", endDate: "2026-05-29", weekCount: 18, granularity: "week", theme: "The Epic Tradition", colorAccent: "#6366F1" },
  { id: "sp-2", classroomId: "class-2", classroomName: "World Literature — 10th Grade", name: "Spring 2026 — Voices Across Cultures", startDate: "2026-01-20", endDate: "2026-05-29", weekCount: 18, granularity: "week", theme: "Voices Across Cultures", colorAccent: "#0EA5E9" },
]

export const DEMO_PLAN_EVENTS: PlanEvent[] = [
  // ── Plan 1 (AP Lit) — Reading Lane ──
  { id: "pe-1", planId: "sp-1", eventType: "book_reading", title: "The Odyssey — Books 1–6", description: "Telemachy and opening", startDate: "2026-01-20", endDate: "2026-02-07", bookId: "the-odyssey", bookTitle: "The Odyssey", unitStart: 1, unitEnd: 6, color: null, lane: 0, sortOrder: 1 },
  { id: "pe-2", planId: "sp-1", eventType: "book_reading", title: "The Odyssey — Books 7–12", description: "Phaeacia and the great wanderings", startDate: "2026-02-10", endDate: "2026-02-28", bookId: "the-odyssey", bookTitle: "The Odyssey", unitStart: 7, unitEnd: 12, color: null, lane: 0, sortOrder: 2 },
  { id: "pe-3", planId: "sp-1", eventType: "book_reading", title: "The Odyssey — Books 13–18", description: "Return and disguise", startDate: "2026-03-03", endDate: "2026-03-21", bookId: "the-odyssey", bookTitle: "The Odyssey", unitStart: 13, unitEnd: 18, color: null, lane: 0, sortOrder: 3 },
  { id: "pe-4", planId: "sp-1", eventType: "book_reading", title: "The Odyssey — Books 19–24", description: "Recognition, revenge, reunion", startDate: "2026-03-24", endDate: "2026-04-04", bookId: "the-odyssey", bookTitle: "The Odyssey", unitStart: 19, unitEnd: 24, color: null, lane: 0, sortOrder: 4 },
  { id: "pe-5", planId: "sp-1", eventType: "book_reading", title: "Pride and Prejudice — Ch 1–24", description: "First half: pride, prejudice, and misunderstanding", startDate: "2026-04-07", endDate: "2026-04-25", bookId: "pride-and-prejudice", bookTitle: "Pride and Prejudice", unitStart: 1, unitEnd: 24, color: null, lane: 0, sortOrder: 5 },
  { id: "pe-6", planId: "sp-1", eventType: "book_reading", title: "Pride and Prejudice — Ch 25–61", description: "Second half: revelation and resolution", startDate: "2026-04-28", endDate: "2026-05-16", bookId: "pride-and-prejudice", bookTitle: "Pride and Prejudice", unitStart: 25, unitEnd: 61, color: null, lane: 0, sortOrder: 6 },

  // ── Trials Lane ──
  { id: "pe-7", planId: "sp-1", eventType: "trial", title: "Odyssey Midpoint Trial", description: "Books 1–12 assessment", startDate: "2026-03-02", endDate: null, bookId: "the-odyssey", bookTitle: "The Odyssey", unitStart: 1, unitEnd: 12, color: null, lane: 1, sortOrder: 7 },
  { id: "pe-8", planId: "sp-1", eventType: "trial", title: "Odyssey Final Trial", description: "Full book assessment — all difficulties", startDate: "2026-04-07", endDate: null, bookId: "the-odyssey", bookTitle: "The Odyssey", unitStart: 1, unitEnd: 24, color: null, lane: 1, sortOrder: 8 },
  { id: "pe-9", planId: "sp-1", eventType: "trial", title: "P&P Midpoint Trial", description: "Chapters 1–24", startDate: "2026-04-28", endDate: null, bookId: "pride-and-prejudice", bookTitle: "Pride and Prejudice", unitStart: 1, unitEnd: 24, color: null, lane: 1, sortOrder: 9 },
  { id: "pe-10", planId: "sp-1", eventType: "trial", title: "P&P Final Trial", description: "Full novel assessment", startDate: "2026-05-19", endDate: null, bookId: "pride-and-prejudice", bookTitle: "Pride and Prejudice", unitStart: 1, unitEnd: 61, color: null, lane: 1, sortOrder: 10 },

  // ── Essays Lane ──
  { id: "pe-11", planId: "sp-1", eventType: "essay_assignment", title: "Metis vs. Bie Essay", description: "Analyze cunning vs. strength in The Odyssey", startDate: "2026-03-24", endDate: "2026-04-04", bookId: "the-odyssey", bookTitle: "The Odyssey", unitStart: null, unitEnd: null, color: null, lane: 2, sortOrder: 11 },
  { id: "pe-12", planId: "sp-1", eventType: "essay_assignment", title: "Irony Analysis Essay", description: "Austen's use of verbal and situational irony in P&P", startDate: "2026-05-05", endDate: "2026-05-16", bookId: "pride-and-prejudice", bookTitle: "Pride and Prejudice", unitStart: null, unitEnd: null, color: null, lane: 2, sortOrder: 12 },

  // ── Discussions Lane ──
  { id: "pe-13", planId: "sp-1", eventType: "discussion", title: "Xenia Discussion", description: "How does hospitality function as a moral framework?", startDate: "2026-02-03", endDate: "2026-02-07", bookId: "the-odyssey", bookTitle: "The Odyssey", unitStart: 1, unitEnd: 6, color: null, lane: 3, sortOrder: 13 },
  { id: "pe-14", planId: "sp-1", eventType: "discussion", title: "Heroism Debate", description: "Is Odysseus a hero or a flawed survivor?", startDate: "2026-03-17", endDate: "2026-03-21", bookId: "the-odyssey", bookTitle: "The Odyssey", unitStart: null, unitEnd: null, color: null, lane: 3, sortOrder: 14 },
  { id: "pe-15", planId: "sp-1", eventType: "discussion", title: "Marriage in P&P", description: "Economic vs. romantic marriage in Regency England", startDate: "2026-04-21", endDate: "2026-04-25", bookId: "pride-and-prejudice", bookTitle: "Pride and Prejudice", unitStart: null, unitEnd: null, color: null, lane: 3, sortOrder: 15 },

  // ── Milestones Lane ──
  { id: "pe-16", planId: "sp-1", eventType: "milestone", title: "Semester Start", description: "First day of Spring semester", startDate: "2026-01-20", endDate: null, bookId: null, bookTitle: null, unitStart: null, unitEnd: null, color: "#6366F1", lane: 4, sortOrder: 16 },
  { id: "pe-17", planId: "sp-1", eventType: "break", title: "Spring Break", description: "No classes", startDate: "2026-03-09", endDate: "2026-03-13", bookId: null, bookTitle: null, unitStart: null, unitEnd: null, color: "#94A3B8", lane: 4, sortOrder: 17 },
  { id: "pe-18", planId: "sp-1", eventType: "break", title: "Teacher PD Day", description: "Professional development — no classes", startDate: "2026-02-17", endDate: null, bookId: null, bookTitle: null, unitStart: null, unitEnd: null, color: "#94A3B8", lane: 4, sortOrder: 18 },
  { id: "pe-19", planId: "sp-1", eventType: "exam", title: "Midterm Exam", description: "Covers The Odyssey and literary analysis skills", startDate: "2026-03-06", endDate: null, bookId: null, bookTitle: null, unitStart: null, unitEnd: null, color: "#EF4444", lane: 4, sortOrder: 19 },
  { id: "pe-20", planId: "sp-1", eventType: "milestone", title: "AP Exam Deadline", description: "AP Literature exam registration deadline", startDate: "2026-04-15", endDate: null, bookId: null, bookTitle: null, unitStart: null, unitEnd: null, color: "#F59E0B", lane: 4, sortOrder: 20 },
  { id: "pe-21", planId: "sp-1", eventType: "exam", title: "Final Exam", description: "Comprehensive exam covering both texts", startDate: "2026-05-27", endDate: null, bookId: null, bookTitle: null, unitStart: null, unitEnd: null, color: "#EF4444", lane: 4, sortOrder: 21 },
  { id: "pe-22", planId: "sp-1", eventType: "note", title: "Grade reports due", description: "Submit mid-semester progress reports to office", startDate: "2026-03-14", endDate: null, bookId: null, bookTitle: null, unitStart: null, unitEnd: null, color: null, lane: 4, sortOrder: 22 },
  { id: "pe-23", planId: "sp-1", eventType: "milestone", title: "Semester End", description: "Last day of instruction", startDate: "2026-05-29", endDate: null, bookId: null, bookTitle: null, unitStart: null, unitEnd: null, color: "#6366F1", lane: 4, sortOrder: 23 },

  // ── Plan 2 (World Lit) — fewer events ──
  { id: "pe-24", planId: "sp-2", eventType: "book_reading", title: "The Republic — Books I–IV", description: "Justice and the ideal state", startDate: "2026-01-20", endDate: "2026-02-14", bookId: "the-republic", bookTitle: "The Republic", unitStart: 1, unitEnd: 4, color: null, lane: 0, sortOrder: 1 },
  { id: "pe-25", planId: "sp-2", eventType: "trial", title: "Republic Trial", description: "Books I–IV assessment", startDate: "2026-02-17", endDate: null, bookId: "the-republic", bookTitle: "The Republic", unitStart: 1, unitEnd: 4, color: null, lane: 1, sortOrder: 2 },
  { id: "pe-26", planId: "sp-2", eventType: "milestone", title: "Semester Start", description: "", startDate: "2026-01-20", endDate: null, bookId: null, bookTitle: null, unitStart: null, unitEnd: null, color: "#0EA5E9", lane: 4, sortOrder: 3 },
]

export const DEMO_TEMPLATES: SemesterTemplate[] = [
  { id: "tmpl-1", name: "AP Literature — Epic Tradition", description: "18-week plan: The Odyssey followed by Pride and Prejudice with trials, essays, and discussions", eventsSnapshot: DEMO_PLAN_EVENTS.filter(e => e.planId === "sp-1").map(({ planId, ...rest }) => rest), isShared: false },
  { id: "tmpl-2", name: "World Literature — Comparative", description: "18-week plan: cross-cultural reading with weekly discussions", eventsSnapshot: [], isShared: true },
]

// ── Helpers ──

export function getSemesterPlan(classroomId: string) {
  return DEMO_SEMESTER_PLANS.find(p => p.classroomId === classroomId) ?? null
}

export function getPlanEvents(planId: string) {
  return DEMO_PLAN_EVENTS.filter(e => e.planId === planId).sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getEventsByLane(planId: string, lane: number) {
  return getPlanEvents(planId).filter(e => e.lane === lane)
}

export function getTemplates() { return DEMO_TEMPLATES }

// Date/pixel conversion helpers
export function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}

export function dateToX(date: string, planStart: string, planEnd: string, canvasWidth: number): number {
  const total = daysBetween(planStart, planEnd)
  const offset = daysBetween(planStart, date)
  return (offset / total) * canvasWidth
}

export function xToDate(x: number, planStart: string, planEnd: string, canvasWidth: number): string {
  const total = daysBetween(planStart, planEnd)
  const dayOffset = Math.round((x / canvasWidth) * total)
  const d = new Date(planStart)
  d.setDate(d.getDate() + dayOffset)
  return d.toISOString().split("T")[0]
}

export function addDays(date: string, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().split("T")[0]
}

export function isWeekend(date: string): boolean {
  const d = new Date(date).getDay()
  return d === 0 || d === 6
}

// Conflict detection
export function getConflicts(events: PlanEvent[], planEnd: string): PlanConflict[] {
  const conflicts: PlanConflict[] = []
  const dueDates = new Map<string, PlanEvent[]>()

  for (const ev of events) {
    const date = ev.endDate ?? ev.startDate
    const existing = dueDates.get(date) ?? []
    existing.push(ev)
    dueDates.set(date, existing)
  }

  // Multiple heavy items on same day
  for (const [date, evs] of dueDates) {
    const heavy = evs.filter(e => ["trial", "essay_assignment", "essay_due", "exam"].includes(e.eventType))
    if (heavy.length >= 2) {
      heavy.forEach(e => conflicts.push({ eventId: e.id, message: `Heavy load on ${new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}: ${heavy.map(h => h.title).join(" + ")}`, severity: "warning" }))
    }
  }

  // Events after plan end
  const breakEvents = events.filter(e => e.eventType === "break")
  for (const ev of events) {
    if (ev.startDate > planEnd) {
      conflicts.push({ eventId: ev.id, message: `"${ev.title}" is scheduled after the semester ends`, severity: "warning" })
    }
    // Reading during break
    if (ev.eventType === "book_reading") {
      for (const brk of breakEvents) {
        const brkEnd = brk.endDate ?? brk.startDate
        if (ev.startDate <= brkEnd && (ev.endDate ?? ev.startDate) >= brk.startDate) {
          conflicts.push({ eventId: ev.id, message: `"${ev.title}" overlaps with "${brk.title}"`, severity: "info" })
        }
      }
    }
  }

  return conflicts
}

// Auto-distribute a book across a date range
export function autoDistributeBook(
  bookTitle: string,
  totalUnits: number,
  startDate: string,
  endDate: string,
  planId: string,
  options: { includeTrials?: boolean; includeDiscussions?: boolean } = {}
): PlanEvent[] {
  const events: PlanEvent[] = []
  const totalDays = daysBetween(startDate, endDate)
  const blockCount = Math.ceil(totalUnits / 6) // ~6 units per block
  const daysPerBlock = Math.floor(totalDays / blockCount)

  let unitCursor = 1
  for (let i = 0; i < blockCount; i++) {
    const blockStart = addDays(startDate, i * daysPerBlock)
    const blockEnd = addDays(startDate, Math.min((i + 1) * daysPerBlock - 1, totalDays))
    const blockUnitsEnd = Math.min(unitCursor + 5, totalUnits)

    events.push({
      id: `auto-${Date.now()}-${i}`,
      planId,
      eventType: "book_reading",
      title: `${bookTitle} — Units ${unitCursor}–${blockUnitsEnd}`,
      description: "",
      startDate: blockStart,
      endDate: blockEnd,
      bookId: null,
      bookTitle,
      unitStart: unitCursor,
      unitEnd: blockUnitsEnd,
      color: null,
      lane: 0,
      sortOrder: 100 + i,
    })

    if (options.includeTrials) {
      events.push({
        id: `auto-trial-${Date.now()}-${i}`,
        planId,
        eventType: "trial",
        title: `${bookTitle} Trial — Units ${unitCursor}–${blockUnitsEnd}`,
        description: "",
        startDate: addDays(blockEnd, 1),
        endDate: null,
        bookId: null,
        bookTitle,
        unitStart: unitCursor,
        unitEnd: blockUnitsEnd,
        color: null,
        lane: 1,
        sortOrder: 200 + i,
      })
    }

    if (options.includeDiscussions) {
      events.push({
        id: `auto-disc-${Date.now()}-${i}`,
        planId,
        eventType: "discussion",
        title: `${bookTitle} Discussion — Units ${unitCursor}–${blockUnitsEnd}`,
        description: "",
        startDate: addDays(blockEnd, -2),
        endDate: blockEnd,
        bookId: null,
        bookTitle,
        unitStart: unitCursor,
        unitEnd: blockUnitsEnd,
        color: null,
        lane: 3,
        sortOrder: 300 + i,
      })
    }

    unitCursor = blockUnitsEnd + 1
  }

  return events
}
