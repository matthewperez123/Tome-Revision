// ── Study Groups Demo Data ──

export interface StudyGroup {
  id: string
  name: string
  classroomId: string
  classroomName: string
  assignmentId: string | null
  assignmentTitle: string | null
  bookId: string | null
  bookTitle: string | null
  targetExamDate: string | null
  createdBy: string
  maxMembers: number
  memberCount: number
  createdAt: string
}

export interface StudyGroupMember {
  id: string
  groupId: string
  studentId: string
  studentName: string
  avatarColor: string
  wisdomXP: number
  readingProgress: number
  joinedAt: string
}

export interface StudySession {
  id: string
  groupId: string
  scheduledAt: string
  durationMinutes: number
  location: string
  agenda: string
  attendance: string[]
  status: "upcoming" | "completed" | "cancelled"
}

export interface StudyNote {
  id: string
  groupId: string
  authorId: string
  authorName: string
  avatarColor: string
  body: string
  anchorUnit: string | null
  anchorQuote: string | null
  isPinned: boolean
  createdAt: string
}

export interface PracticeQuiz {
  id: string
  groupId: string
  title: string
  questionCount: number
  createdBy: string
  createdAt: string
  attempts: { studentName: string; score: number; date: string }[]
  questionResults: { question: string; correctRate: number }[]
}

// ── Demo Data ──

export const DEMO_STUDY_GROUPS: StudyGroup[] = [
  { id: "sg-1", name: "Odyssey Exam Prep", classroomId: "class-1", classroomName: "AP Literature — Period 3", assignmentId: "assign-1", assignmentTitle: "The Odyssey — Books 1–6", bookId: "the-odyssey", bookTitle: "The Odyssey", targetExamDate: "2026-04-20", createdBy: "s1", maxMembers: 8, memberCount: 5, createdAt: "2026-04-01" },
  { id: "sg-2", name: "Meditations Study Squad", classroomId: "class-1", classroomName: "AP Literature — Period 3", assignmentId: "assign-2", assignmentTitle: "Meditations — Full Book", bookId: "meditations", bookTitle: "Meditations", targetExamDate: "2026-05-05", createdBy: "s3", maxMembers: 6, memberCount: 3, createdAt: "2026-04-05" },
  { id: "sg-3", name: "Pride & Prejudice Final Review", classroomId: "class-1", classroomName: "AP Literature — Period 3", assignmentId: "assign-3", assignmentTitle: "Pride and Prejudice — Chapters 1–12", bookId: "pride-and-prejudice", bookTitle: "Pride and Prejudice", targetExamDate: null, createdBy: "s6", maxMembers: 10, memberCount: 4, createdAt: "2026-03-10" },
  { id: "sg-4", name: "Republic Readers", classroomId: "class-2", classroomName: "World Literature — 10th Grade", assignmentId: "assign-4", assignmentTitle: "The Republic — Books I–IV", bookId: "the-republic", bookTitle: "The Republic", targetExamDate: "2026-04-25", createdBy: "s2", maxMembers: 6, memberCount: 4, createdAt: "2026-04-08" },
]

export const DEMO_STUDY_GROUP_MEMBERS: StudyGroupMember[] = [
  // Odyssey Exam Prep
  { id: "sgm-1", groupId: "sg-1", studentId: "s1", studentName: "Emma Chen", avatarColor: "#4F46E5", wisdomXP: 2340, readingProgress: 100, joinedAt: "2026-04-01" },
  { id: "sgm-2", groupId: "sg-1", studentId: "s2", studentName: "Marcus Williams", avatarColor: "#0D9488", wisdomXP: 1880, readingProgress: 83, joinedAt: "2026-04-01" },
  { id: "sgm-3", groupId: "sg-1", studentId: "s5", studentName: "Aisha Patel", avatarColor: "#7C3AED", wisdomXP: 1200, readingProgress: 67, joinedAt: "2026-04-02" },
  { id: "sgm-4", groupId: "sg-1", studentId: "s6", studentName: "Liam Foster", avatarColor: "#16A34A", wisdomXP: 2050, readingProgress: 100, joinedAt: "2026-04-02" },
  { id: "sgm-5", groupId: "sg-1", studentId: "s4", studentName: "James O'Brien", avatarColor: "#EA580C", wisdomXP: 620, readingProgress: 50, joinedAt: "2026-04-03" },
  // Meditations
  { id: "sgm-6", groupId: "sg-2", studentId: "s3", studentName: "Sofia Rodriguez", avatarColor: "#D4A04C", wisdomXP: 3410, readingProgress: 45, joinedAt: "2026-04-05" },
  { id: "sgm-7", groupId: "sg-2", studentId: "s1", studentName: "Emma Chen", avatarColor: "#4F46E5", wisdomXP: 2340, readingProgress: 20, joinedAt: "2026-04-06" },
  { id: "sgm-8", groupId: "sg-2", studentId: "s6", studentName: "Liam Foster", avatarColor: "#16A34A", wisdomXP: 2050, readingProgress: 15, joinedAt: "2026-04-07" },
  // P&P Review
  { id: "sgm-9", groupId: "sg-3", studentId: "s6", studentName: "Liam Foster", avatarColor: "#16A34A", wisdomXP: 2050, readingProgress: 42, joinedAt: "2026-03-10" },
  { id: "sgm-10", groupId: "sg-3", studentId: "s1", studentName: "Emma Chen", avatarColor: "#4F46E5", wisdomXP: 2340, readingProgress: 100, joinedAt: "2026-03-11" },
  { id: "sgm-11", groupId: "sg-3", studentId: "s3", studentName: "Sofia Rodriguez", avatarColor: "#D4A04C", wisdomXP: 3410, readingProgress: 100, joinedAt: "2026-03-11" },
  { id: "sgm-12", groupId: "sg-3", studentId: "s5", studentName: "Aisha Patel", avatarColor: "#7C3AED", wisdomXP: 1200, readingProgress: 60, joinedAt: "2026-03-15" },
]

export const DEMO_STUDY_SESSIONS: StudySession[] = [
  { id: "ss-1", groupId: "sg-1", scheduledAt: "2026-04-14T16:00:00Z", durationMinutes: 60, location: "Library Room B", agenda: "Review Books 5–6, practice trial questions, discuss Calypso's role", attendance: ["s1", "s2", "s5"], status: "upcoming" },
  { id: "ss-2", groupId: "sg-1", scheduledAt: "2026-04-07T16:00:00Z", durationMinutes: 45, location: "Online", agenda: "Books 1–4 recap, character mapping exercise", attendance: ["s1", "s2", "s5", "s6", "s4"], status: "completed" },
  { id: "ss-3", groupId: "sg-1", scheduledAt: "2026-04-21T16:00:00Z", durationMinutes: 90, location: "Library Room B", agenda: "Pre-exam review: themes, symbols, essay practice", attendance: [], status: "upcoming" },
  { id: "ss-4", groupId: "sg-2", scheduledAt: "2026-04-15T15:00:00Z", durationMinutes: 45, location: "Online", agenda: "Books I–III discussion, Stoic journaling exercise", attendance: [], status: "upcoming" },
  { id: "ss-5", groupId: "sg-3", scheduledAt: "2026-03-18T15:00:00Z", durationMinutes: 60, location: "Classroom 204", agenda: "Chapters 1–6, Darcy character analysis", attendance: ["s6", "s1", "s3"], status: "completed" },
]

export const DEMO_STUDY_NOTES: StudyNote[] = [
  { id: "sn-1", groupId: "sg-1", authorId: "s1", authorName: "Emma Chen", avatarColor: "#4F46E5", body: "**Key Themes for Exam**\n\n1. **Nostos** (homecoming) — the central theme\n2. **Xenia** (guest-friendship) — violated by suitors\n3. **Metis** (cunning) vs. **Bie** (strength)\n4. **Kleos** (glory) — how Odysseus earns it differently than Achilles\n5. **Divine intervention** — role of Athena throughout", anchorUnit: "Full Book", anchorQuote: null, isPinned: true, createdAt: "2026-04-07T17:00:00Z" },
  { id: "sn-2", groupId: "sg-1", authorId: "s2", authorName: "Marcus Williams", avatarColor: "#0D9488", body: "The suitors aren't just villains — they represent a **breakdown of social order**. In ancient Greece, xenia was sacred law. The suitors abuse Odysseus's hospitality while he's away, which makes their eventual punishment not just personal revenge but **divine justice**.", anchorUnit: "Book 1", anchorQuote: "the suitors sat feasting on his oxen", isPinned: false, createdAt: "2026-04-08T10:30:00Z" },
  { id: "sn-3", groupId: "sg-1", authorId: "s5", authorName: "Aisha Patel", avatarColor: "#7C3AED", body: "Calypso's island = **stasis**. She offers immortality but Odysseus chooses mortality + home. This is the core human question of the epic: would you trade everything for eternal comfort?\n\nExam tip: compare this to Circe's island for a contrast essay.", anchorUnit: "Book 5", anchorQuote: null, isPinned: false, createdAt: "2026-04-09T14:00:00Z" },
  { id: "sn-4", groupId: "sg-2", authorId: "s3", authorName: "Sofia Rodriguez", avatarColor: "#D4A04C", body: "Marcus Aurelius isn't writing for publication — these are **private journal entries**. That changes how we read them. He's talking to himself, reminding himself to practice what he preaches. The repetition isn't laziness — it's *practice*.", anchorUnit: "Book II", anchorQuote: null, isPinned: true, createdAt: "2026-04-06T08:00:00Z" },
]

export const DEMO_PRACTICE_QUIZZES: PracticeQuiz[] = [
  { id: "pq-1", groupId: "sg-1", title: "Odyssey Books 1–6 Practice", questionCount: 10, createdBy: "s1", createdAt: "2026-04-08", attempts: [{ studentName: "Emma Chen", score: 90, date: "2026-04-08" }, { studentName: "Marcus Williams", score: 80, date: "2026-04-09" }, { studentName: "Aisha Patel", score: 70, date: "2026-04-09" }, { studentName: "Liam Foster", score: 85, date: "2026-04-10" }], questionResults: [{ question: "What is the primary conflict in Book 1?", correctRate: 100 }, { question: "Who does Athena disguise herself as?", correctRate: 75 }, { question: "What is the suitors' main demand?", correctRate: 100 }, { question: "Describe the significance of Telemachus's journey.", correctRate: 50 }, { question: "What role does xenia play in Book 4?", correctRate: 25 }, { question: "Compare Menelaus and Nestor as hosts.", correctRate: 50 }, { question: "What is Calypso's island called?", correctRate: 75 }, { question: "Why does Odysseus weep on Ogygia?", correctRate: 100 }, { question: "What does Athena do to help Odysseus in Book 6?", correctRate: 75 }, { question: "Who is Nausicaa?", correctRate: 100 }] },
  { id: "pq-2", groupId: "sg-1", title: "Character Identification Quiz", questionCount: 8, createdBy: "s2", createdAt: "2026-04-10", attempts: [{ studentName: "Emma Chen", score: 100, date: "2026-04-10" }, { studentName: "Marcus Williams", score: 88, date: "2026-04-10" }], questionResults: [{ question: "Identify: 'rosy-fingered Dawn'", correctRate: 100 }, { question: "Identify: 'grey-eyed goddess'", correctRate: 100 }, { question: "Who is Eumaeus?", correctRate: 50 }, { question: "Who is Eurycleia?", correctRate: 50 }, { question: "What is Argos?", correctRate: 100 }, { question: "Who is Antinous?", correctRate: 100 }, { question: "Who is Penelope's father?", correctRate: 0 }, { question: "Who is Circe?", correctRate: 100 }] },
]

// ── User's study groups ──
export const USER_STUDY_GROUP_IDS = ["sg-1", "sg-2"]

// ── Helpers ──

export function getStudyGroups() { return DEMO_STUDY_GROUPS }
export function getStudyGroup(id: string) { return DEMO_STUDY_GROUPS.find(g => g.id === id) ?? null }
export function getUserStudyGroups() { return DEMO_STUDY_GROUPS.filter(g => USER_STUDY_GROUP_IDS.includes(g.id)) }
export function getStudyGroupsForClassroom(classroomId: string) { return DEMO_STUDY_GROUPS.filter(g => g.classroomId === classroomId) }
export function getStudyGroupMembers(groupId: string) { return DEMO_STUDY_GROUP_MEMBERS.filter(m => m.groupId === groupId) }
export function getStudySessions(groupId: string) { return DEMO_STUDY_SESSIONS.filter(s => s.groupId === groupId).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()) }
export function getStudyNotes(groupId: string) { return DEMO_STUDY_NOTES.filter(n => n.groupId === groupId).sort((a, b) => { if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1; return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() }) }
export function getPracticeQuizzes(groupId: string) { return DEMO_PRACTICE_QUIZZES.filter(q => q.groupId === groupId) }
export function getNextSession(groupId: string) { return DEMO_STUDY_SESSIONS.find(s => s.groupId === groupId && s.status === "upcoming") ?? null }
