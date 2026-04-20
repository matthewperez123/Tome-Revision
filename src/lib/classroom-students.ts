// ── Extended Student Demo Data for Teacher Student Profile ──

export interface StudentDetail {
  id: string
  name: string
  email: string
  gradeLevel: string
  classroomIds: string[]
  classroomNames: string[]
  avatarColor: string
  enrollmentDate: string
  notes: string
  wisdomXP: number
  rank: string
  currentStreak: number
  longestStreak: number
  sealsEarned: string[]
  currentBook: { id: string; title: string; author: string; unit: string; progress: number; lastActive: string } | null
  avgTrialScore: number
}

export interface StudentReading {
  studentId: string
  booksInProgress: { bookId: string; title: string; author: string; tradition: string; difficulty: string; progress: number; lastRead: string }[]
  booksCompleted: { bookId: string; title: string; author: string; tradition: string; difficulty: string; completedDate: string }[]
  totalMinutes: number
  dailyAverage: number
  weeklyChart: number[] // 7 days, minutes per day
  pagesPerWeek: number
  paceTrend: "up" | "down" | "steady"
}

export interface StudentTrial {
  id: string
  studentId: string
  date: string
  bookTitle: string
  unit: string
  difficulty: "Apprentice" | "Scholar" | "Master"
  score: number
  wisdomEarned: number
  attempts: number
  questions: { text: string; studentAnswer: string; correctAnswer: string; correct: boolean; explanation: string }[]
}

export interface StudentAnnotation {
  id: string
  studentId: string
  bookTitle: string
  unit: string
  passage: string
  noteText: string
  timestamp: string
}

export interface StudentDiscussion {
  id: string
  studentId: string
  bookTitle: string
  passageContext: string
  postText: string
  replyCount: number
  timestamp: string
}

export interface StudentActivityEvent {
  id: string
  studentId: string
  type: "trial_completed" | "book_finished" | "annotation_written" | "discussion_posted" | "seal_earned" | "streak_milestone"
  description: string
  timestamp: string
  meta?: Record<string, string>
}

export interface StudentFlag {
  type: "missed_days" | "failed_trials" | "no_annotations"
  message: string
  severity: "warning" | "concern"
}

// ── Demo Data ──

export const DEMO_STUDENT_DETAILS: StudentDetail[] = [
  { id: "s1", name: "Emma Chen", email: "emma.chen@school.edu", gradeLevel: "11th", classroomIds: ["class-1"], classroomNames: ["AP Literature — Period 3"], avatarColor: "#4F46E5", enrollmentDate: "2026-01-15", notes: "", wisdomXP: 2340, rank: "Scholar", currentStreak: 14, longestStreak: 21, sealsEarned: ["First Trial", "Book Worm", "Flame Keeper", "Annotator", "Discussion Leader"], currentBook: { id: "the-odyssey", title: "The Odyssey", author: "Homer", unit: "Book 6", progress: 100, lastActive: "2 hours ago" }, avgTrialScore: 92 },
  { id: "s2", name: "Marcus Williams", email: "marcus.w@school.edu", gradeLevel: "11th", classroomIds: ["class-1"], classroomNames: ["AP Literature — Period 3"], avatarColor: "#0D9488", enrollmentDate: "2026-01-15", notes: "", wisdomXP: 1880, rank: "Apprentice", currentStreak: 7, longestStreak: 12, sealsEarned: ["First Trial", "Book Worm", "Flame Keeper"], currentBook: { id: "the-odyssey", title: "The Odyssey", author: "Homer", unit: "Book 5", progress: 83, lastActive: "5 hours ago" }, avgTrialScore: 85 },
  { id: "s3", name: "Sofia Rodriguez", email: "sofia.r@school.edu", gradeLevel: "11th", classroomIds: ["class-1", "class-2"], classroomNames: ["AP Literature — Period 3", "World Literature — 10th Grade"], avatarColor: "#D4A04C", enrollmentDate: "2026-01-15", notes: "Gifted reader, consider advanced placement recommendations.", wisdomXP: 3410, rank: "Master", currentStreak: 28, longestStreak: 28, sealsEarned: ["First Trial", "Book Worm", "Flame Keeper", "Annotator", "Discussion Leader", "Speed Reader", "Perfect Score"], currentBook: { id: "meditations", title: "Meditations", author: "Marcus Aurelius", unit: "Book III", progress: 45, lastActive: "1 hour ago" }, avgTrialScore: 97 },
  { id: "s4", name: "James O'Brien", email: "james.ob@school.edu", gradeLevel: "11th", classroomIds: ["class-1"], classroomNames: ["AP Literature — Period 3"], avatarColor: "#EA580C", enrollmentDate: "2026-01-20", notes: "IEP accommodations: extra time on Trials.", wisdomXP: 620, rank: "Novice", currentStreak: 0, longestStreak: 5, sealsEarned: ["First Trial"], currentBook: { id: "the-odyssey", title: "The Odyssey", author: "Homer", unit: "Book 3", progress: 50, lastActive: "Yesterday" }, avgTrialScore: 64 },
  { id: "s5", name: "Aisha Patel", email: "aisha.p@school.edu", gradeLevel: "11th", classroomIds: ["class-1"], classroomNames: ["AP Literature — Period 3"], avatarColor: "#7C3AED", enrollmentDate: "2026-01-15", notes: "", wisdomXP: 1200, rank: "Apprentice", currentStreak: 3, longestStreak: 10, sealsEarned: ["First Trial", "Book Worm"], currentBook: { id: "the-odyssey", title: "The Odyssey", author: "Homer", unit: "Book 4", progress: 67, lastActive: "3 hours ago" }, avgTrialScore: 78 },
  { id: "s6", name: "Liam Foster", email: "liam.f@school.edu", gradeLevel: "11th", classroomIds: ["class-1"], classroomNames: ["AP Literature — Period 3"], avatarColor: "#16A34A", enrollmentDate: "2026-01-15", notes: "", wisdomXP: 2050, rank: "Scholar", currentStreak: 11, longestStreak: 15, sealsEarned: ["First Trial", "Book Worm", "Flame Keeper", "Annotator"], currentBook: { id: "pride-and-prejudice", title: "Pride and Prejudice", author: "Jane Austen", unit: "Chapter 10", progress: 42, lastActive: "30 min ago" }, avgTrialScore: 88 },
  { id: "s7", name: "Olivia Kim", email: "olivia.k@school.edu", gradeLevel: "11th", classroomIds: ["class-1"], classroomNames: ["AP Literature — Period 3"], avatarColor: "#BE185D", enrollmentDate: "2026-02-01", notes: "Transfer student. Catching up on earlier assignments.", wisdomXP: 140, rank: "Novice", currentStreak: 0, longestStreak: 2, sealsEarned: [], currentBook: { id: "the-odyssey", title: "The Odyssey", author: "Homer", unit: "Book 1", progress: 17, lastActive: "3 days ago" }, avgTrialScore: 55 },
  { id: "s8", name: "Noah Davis", email: "noah.d@school.edu", gradeLevel: "11th", classroomIds: ["class-1"], classroomNames: ["AP Literature — Period 3"], avatarColor: "#0284C7", enrollmentDate: "2026-01-15", notes: "", wisdomXP: 0, rank: "Novice", currentStreak: 0, longestStreak: 0, sealsEarned: [], currentBook: null, avgTrialScore: 0 },
]

export const DEMO_STUDENT_READING: StudentReading[] = [
  { studentId: "s1", booksInProgress: [], booksCompleted: [{ bookId: "the-odyssey", title: "The Odyssey", author: "Homer", tradition: "Ancient Greek", difficulty: "Intermediate", completedDate: "2026-04-08" }], totalMinutes: 2400, dailyAverage: 35, weeklyChart: [40, 30, 45, 20, 35, 50, 30], pagesPerWeek: 120, paceTrend: "up" },
  { studentId: "s2", booksInProgress: [{ bookId: "the-odyssey", title: "The Odyssey", author: "Homer", tradition: "Ancient Greek", difficulty: "Intermediate", progress: 83, lastRead: "5 hours ago" }], booksCompleted: [], totalMinutes: 1800, dailyAverage: 28, weeklyChart: [30, 25, 35, 20, 30, 25, 20], pagesPerWeek: 85, paceTrend: "steady" },
  { studentId: "s3", booksInProgress: [{ bookId: "meditations", title: "Meditations", author: "Marcus Aurelius", tradition: "Roman", difficulty: "Advanced", progress: 45, lastRead: "1 hour ago" }], booksCompleted: [{ bookId: "the-odyssey", title: "The Odyssey", author: "Homer", tradition: "Ancient Greek", difficulty: "Intermediate", completedDate: "2026-03-28" }, { bookId: "pride-and-prejudice", title: "Pride and Prejudice", author: "Jane Austen", tradition: "Romantic", difficulty: "Beginner", completedDate: "2026-04-05" }], totalMinutes: 4200, dailyAverage: 55, weeklyChart: [60, 50, 55, 65, 45, 70, 50], pagesPerWeek: 180, paceTrend: "up" },
  { studentId: "s4", booksInProgress: [{ bookId: "the-odyssey", title: "The Odyssey", author: "Homer", tradition: "Ancient Greek", difficulty: "Intermediate", progress: 50, lastRead: "Yesterday" }], booksCompleted: [], totalMinutes: 600, dailyAverage: 12, weeklyChart: [15, 10, 0, 20, 0, 15, 0], pagesPerWeek: 35, paceTrend: "down" },
  { studentId: "s7", booksInProgress: [{ bookId: "the-odyssey", title: "The Odyssey", author: "Homer", tradition: "Ancient Greek", difficulty: "Intermediate", progress: 17, lastRead: "3 days ago" }], booksCompleted: [], totalMinutes: 180, dailyAverage: 5, weeklyChart: [10, 0, 0, 5, 0, 0, 0], pagesPerWeek: 12, paceTrend: "down" },
]

export const DEMO_STUDENT_TRIALS: StudentTrial[] = [
  { id: "t1", studentId: "s1", date: "2026-04-08", bookTitle: "The Odyssey", unit: "Books 1–3", difficulty: "Scholar", score: 90, wisdomEarned: 45, attempts: 1, questions: [{ text: "What is the primary conflict in Book 1?", studentAnswer: "Telemachus seeking his father", correctAnswer: "Telemachus seeking his father", correct: true, explanation: "Book 1 introduces Telemachus's journey to find Odysseus." }, { text: "Who does Athena disguise herself as?", studentAnswer: "Mentes", correctAnswer: "Mentes", correct: true, explanation: "Athena takes the form of Mentes to encourage Telemachus." }, { text: "What is the suitors' main demand?", studentAnswer: "To marry Helen", correctAnswer: "To marry Penelope", correct: false, explanation: "The suitors seek Penelope's hand in marriage." }] },
  { id: "t2", studentId: "s1", date: "2026-04-05", bookTitle: "The Odyssey", unit: "Books 4–6", difficulty: "Scholar", score: 95, wisdomEarned: 48, attempts: 1, questions: [{ text: "What is the significance of Calypso's island?", studentAnswer: "It represents temptation and stasis", correctAnswer: "It represents temptation and stasis", correct: true, explanation: "Ogygia is where Odysseus is detained for 7 years." }] },
  { id: "t3", studentId: "s3", date: "2026-04-10", bookTitle: "The Odyssey", unit: "Full Book", difficulty: "Master", score: 100, wisdomEarned: 100, attempts: 1, questions: [{ text: "Analyze the theme of nostos across the epic.", studentAnswer: "Homecoming as spiritual transformation", correctAnswer: "Homecoming as spiritual transformation", correct: true, explanation: "Nostos (homecoming) is the central theme." }] },
  { id: "t4", studentId: "s4", date: "2026-04-02", bookTitle: "The Odyssey", unit: "Books 1–3", difficulty: "Apprentice", score: 55, wisdomEarned: 10, attempts: 2, questions: [{ text: "Where does the story begin?", studentAnswer: "Troy", correctAnswer: "Ithaca/Mount Olympus", correct: false, explanation: "The story opens on Olympus with the gods discussing Odysseus." }, { text: "Who is Odysseus's son?", studentAnswer: "Telemachus", correctAnswer: "Telemachus", correct: true, explanation: "Telemachus is introduced in Book 1." }] },
  { id: "t5", studentId: "s4", date: "2026-03-28", bookTitle: "The Odyssey", unit: "Books 1–3", difficulty: "Apprentice", score: 45, wisdomEarned: 5, attempts: 3, questions: [{ text: "Who is the king of Ithaca?", studentAnswer: "Agamemnon", correctAnswer: "Odysseus", correct: false, explanation: "Odysseus is the rightful king of Ithaca." }] },
  { id: "t6", studentId: "s7", date: "2026-04-01", bookTitle: "The Odyssey", unit: "Book 1", difficulty: "Apprentice", score: 50, wisdomEarned: 5, attempts: 2, questions: [{ text: "Who narrates the story?", studentAnswer: "Homer", correctAnswer: "The poet (Homer) via the Muse", correct: false, explanation: "The poem begins with an invocation to the Muse." }] },
]

export const DEMO_STUDENT_ANNOTATIONS: StudentAnnotation[] = [
  { id: "a1", studentId: "s1", bookTitle: "The Odyssey", unit: "Book 1", passage: "\"Tell me, O Muse, of that ingenious hero who travelled far and wide...\"", noteText: "The invocation mirrors the structure in the Iliad — both begin by asking the Muse for inspiration. This is an epic convention.", timestamp: "2026-04-06T14:30:00Z" },
  { id: "a2", studentId: "s1", bookTitle: "The Odyssey", unit: "Book 5", passage: "\"Even so, I wish and long day by day to reach my home...\"", noteText: "Odysseus expresses nostalgia here — the concept of nostos is central to the Greek understanding of heroism.", timestamp: "2026-04-07T10:15:00Z" },
  { id: "a3", studentId: "s3", bookTitle: "The Odyssey", unit: "Book 9", passage: "\"My name is Nobody\"", noteText: "The Polyphemus encounter demonstrates Odysseus's cunning (metis) over brute strength (bie). This is what sets him apart from Achilles.", timestamp: "2026-03-25T09:00:00Z" },
  { id: "a4", studentId: "s3", bookTitle: "Pride and Prejudice", unit: "Chapter 1", passage: "\"It is a truth universally acknowledged...\"", noteText: "Austen opens with irony — the 'truth' is really society's assumption. The entire novel will challenge this premise.", timestamp: "2026-04-01T11:45:00Z" },
  { id: "a5", studentId: "s3", bookTitle: "Meditations", unit: "Book II", passage: "\"Begin the morning by saying to thyself...\"", noteText: "Marcus Aurelius practices negative visualization — preparing for difficult people as a Stoic exercise in patience.", timestamp: "2026-04-09T08:20:00Z" },
  { id: "a6", studentId: "s6", bookTitle: "Pride and Prejudice", unit: "Chapter 3", passage: "\"She is tolerable, but not handsome enough to tempt me\"", noteText: "Darcy's first impression of Elizabeth — dramatic irony since we know they'll end up together.", timestamp: "2026-04-10T15:00:00Z" },
]

export const DEMO_STUDENT_DISCUSSIONS: StudentDiscussion[] = [
  { id: "d1", studentId: "s1", bookTitle: "The Odyssey", passageContext: "Book 1 — Athena's visit to Telemachus", postText: "I think Athena's disguise as Mentes is significant because it shows the gods don't directly intervene — they work through human agency. Telemachus still has to make his own choices.", replyCount: 4, timestamp: "2026-04-06T16:00:00Z" },
  { id: "d2", studentId: "s3", bookTitle: "The Odyssey", passageContext: "Book 9 — The Cyclops", postText: "The 'Nobody' trick is brilliant but also hubristic — Odysseus later reveals his real name, which brings Poseidon's curse. His cleverness is both his greatest strength and his fatal flaw.", replyCount: 7, timestamp: "2026-03-26T14:20:00Z" },
  { id: "d3", studentId: "s3", bookTitle: "Pride and Prejudice", passageContext: "Chapter 34 — Darcy's first proposal", postText: "Elizabeth's refusal is one of the most empowering moments in Regency literature. She refuses despite the enormous economic pressure to accept.", replyCount: 5, timestamp: "2026-04-03T10:30:00Z" },
  { id: "d4", studentId: "s6", bookTitle: "The Odyssey", passageContext: "Book 5 — Calypso's island", postText: "Is Calypso a villain or a victim? She loves Odysseus genuinely but can't accept his free will. The gods force her to release him.", replyCount: 3, timestamp: "2026-04-08T13:15:00Z" },
  { id: "d5", studentId: "s2", bookTitle: "The Odyssey", passageContext: "Book 1 — The Suitors", postText: "The suitors represent everything wrong with Greek aristocracy — they abuse xenia (guest friendship) which is the most sacred social contract.", replyCount: 2, timestamp: "2026-04-05T11:00:00Z" },
]

export const DEMO_STUDENT_ACTIVITY: StudentActivityEvent[] = [
  { id: "ev1", studentId: "s1", type: "trial_completed", description: "Completed Trial on The Odyssey Books 4–6 with 95%", timestamp: "2026-04-08T15:30:00Z" },
  { id: "ev2", studentId: "s1", type: "book_finished", description: "Finished reading The Odyssey", timestamp: "2026-04-08T14:00:00Z" },
  { id: "ev3", studentId: "s1", type: "annotation_written", description: "Annotated a passage in The Odyssey Book 5", timestamp: "2026-04-07T10:15:00Z" },
  { id: "ev4", studentId: "s1", type: "discussion_posted", description: "Posted in discussion on The Odyssey Book 1", timestamp: "2026-04-06T16:00:00Z" },
  { id: "ev5", studentId: "s1", type: "seal_earned", description: "Earned the \"Discussion Leader\" seal", timestamp: "2026-04-06T16:05:00Z" },
  { id: "ev6", studentId: "s3", type: "trial_completed", description: "Perfect score on The Odyssey Full Book Trial (Sage)", timestamp: "2026-04-10T12:00:00Z" },
  { id: "ev7", studentId: "s3", type: "seal_earned", description: "Earned the \"Perfect Score\" seal", timestamp: "2026-04-10T12:05:00Z" },
  { id: "ev8", studentId: "s3", type: "annotation_written", description: "Annotated Meditations Book II", timestamp: "2026-04-09T08:20:00Z" },
  { id: "ev9", studentId: "s4", type: "trial_completed", description: "Completed Trial on The Odyssey Books 1–3 with 55%", timestamp: "2026-04-02T14:00:00Z" },
  { id: "ev10", studentId: "s7", type: "trial_completed", description: "Completed Trial on The Odyssey Book 1 with 50%", timestamp: "2026-04-01T10:00:00Z" },
  { id: "ev11", studentId: "s6", type: "annotation_written", description: "Annotated Pride and Prejudice Chapter 3", timestamp: "2026-04-10T15:00:00Z" },
  { id: "ev12", studentId: "s6", type: "discussion_posted", description: "Posted in discussion on The Odyssey Book 5", timestamp: "2026-04-08T13:15:00Z" },
]

// ── Helpers ──

export function getStudentDetail(id: string) {
  return DEMO_STUDENT_DETAILS.find(s => s.id === id) ?? null
}

export function getStudentReading(studentId: string) {
  return DEMO_STUDENT_READING.find(r => r.studentId === studentId) ?? {
    studentId, booksInProgress: [], booksCompleted: [], totalMinutes: 0, dailyAverage: 0, weeklyChart: [0,0,0,0,0,0,0], pagesPerWeek: 0, paceTrend: "steady" as const
  }
}

export function getStudentTrials(studentId: string) {
  return DEMO_STUDENT_TRIALS.filter(t => t.studentId === studentId)
}

export function getStudentAnnotations(studentId: string) {
  return DEMO_STUDENT_ANNOTATIONS.filter(a => a.studentId === studentId)
}

export function getStudentDiscussions(studentId: string) {
  return DEMO_STUDENT_DISCUSSIONS.filter(d => d.studentId === studentId)
}

export function getStudentActivity(studentId: string) {
  return DEMO_STUDENT_ACTIVITY.filter(e => e.studentId === studentId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function getStudentFlags(studentId: string): StudentFlag[] {
  const flags: StudentFlag[] = []
  const student = getStudentDetail(studentId)
  if (!student) return flags

  // Missed 3+ days (streak is 0 and last active > 3 days)
  if (student.currentStreak === 0 && student.currentBook) {
    const lastActive = student.currentBook.lastActive
    if (lastActive.includes("days") || lastActive.includes("week")) {
      flags.push({ type: "missed_days", message: `Inactive for ${lastActive}. No reading streak.`, severity: "concern" })
    }
  }

  // 2+ failed trials
  const trials = getStudentTrials(studentId)
  const recentFailed = trials.filter(t => t.score < 60).slice(0, 2)
  if (recentFailed.length >= 2) {
    flags.push({ type: "failed_trials", message: `Failed ${recentFailed.length} recent Trials (scores below 60%).`, severity: "warning" })
  }

  // No annotations in 2+ weeks
  const annotations = getStudentAnnotations(studentId)
  if (annotations.length === 0) {
    flags.push({ type: "no_annotations", message: "No annotations written. May indicate low engagement with texts.", severity: "warning" })
  }

  return flags
}

export function getLetterGrade(score: number): string {
  if (score >= 93) return "A"
  if (score >= 90) return "A-"
  if (score >= 87) return "B+"
  if (score >= 83) return "B"
  if (score >= 80) return "B-"
  if (score >= 77) return "C+"
  if (score >= 73) return "C"
  if (score >= 70) return "C-"
  if (score >= 67) return "D+"
  if (score >= 60) return "D"
  return "F"
}
