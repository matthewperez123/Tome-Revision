// ── Parent Contacts & Messaging Demo Data ──

export interface ParentContact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  preferredContact: "email" | "sms" | "both"
  linkedStudents: { studentId: string; studentName: string; relationship: string; isPrimary: boolean }[]
  createdAt: string
}

export type MessageType = "general" | "progress_report" | "grade_notification" | "concern" | "celebration"

export interface ParentMessage {
  id: string
  teacherId: string
  parentId: string
  studentId: string | null
  studentName: string | null
  subject: string
  body: string
  messageType: MessageType
  sentAt: string
  readAt: string | null
  deliveryStatus: "queued" | "sent" | "delivered" | "failed"
  attachments: { type: string; label: string }[]
  isDraft?: boolean
}

export interface MessageTemplate {
  id: string
  name: string
  type: MessageType
  subjectTemplate: string
  bodyTemplate: string
}

// ── Message Type Styling ──

export const MESSAGE_TYPE_STYLES: Record<MessageType, { label: string; bg: string; text: string }> = {
  general: { label: "General", bg: "bg-stone-100 dark:bg-stone-800", text: "text-stone-700 dark:text-stone-300" },
  progress_report: { label: "Progress Report", bg: "bg-indigo-50 dark:bg-indigo-950/30", text: "text-indigo-700 dark:text-indigo-400" },
  grade_notification: { label: "Grade", bg: "bg-indigo-50 dark:bg-indigo-950/30", text: "text-indigo-700 dark:text-indigo-400" },
  concern: { label: "Concern", bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400" },
  celebration: { label: "Celebration", bg: "bg-[color-mix(in_srgb,var(--tome-accent)_15%,transparent)]", text: "text-[var(--tome-accent)]" },
}

// ── Demo Data ──

export const DEMO_PARENTS: ParentContact[] = [
  { id: "p1", firstName: "David", lastName: "Chen", email: "david.chen@email.com", phone: "555-0101", preferredContact: "email", linkedStudents: [{ studentId: "s1", studentName: "Emma Chen", relationship: "father", isPrimary: true }], createdAt: "2026-01-16" },
  { id: "p2", firstName: "Li", lastName: "Chen", email: "li.chen@email.com", phone: "555-0102", preferredContact: "email", linkedStudents: [{ studentId: "s1", studentName: "Emma Chen", relationship: "mother", isPrimary: false }], createdAt: "2026-01-16" },
  { id: "p3", firstName: "Michael", lastName: "Williams", email: "m.williams@email.com", phone: null, preferredContact: "email", linkedStudents: [{ studentId: "s2", studentName: "Marcus Williams", relationship: "father", isPrimary: true }], createdAt: "2026-01-17" },
  { id: "p4", firstName: "Carmen", lastName: "Rodriguez", email: "carmen.r@email.com", phone: "555-0104", preferredContact: "both", linkedStudents: [{ studentId: "s3", studentName: "Sofia Rodriguez", relationship: "mother", isPrimary: true }], createdAt: "2026-01-16" },
  { id: "p5", firstName: "Patrick", lastName: "O'Brien", email: "patrick.ob@email.com", phone: "555-0105", preferredContact: "email", linkedStudents: [{ studentId: "s4", studentName: "James O'Brien", relationship: "father", isPrimary: true }], createdAt: "2026-01-21" },
  { id: "p6", firstName: "Siobhan", lastName: "O'Brien", email: "siobhan.ob@email.com", phone: "555-0106", preferredContact: "email", linkedStudents: [{ studentId: "s4", studentName: "James O'Brien", relationship: "mother", isPrimary: false }], createdAt: "2026-01-21" },
  { id: "p7", firstName: "Ravi", lastName: "Patel", email: "ravi.patel@email.com", phone: "555-0107", preferredContact: "email", linkedStudents: [{ studentId: "s5", studentName: "Aisha Patel", relationship: "father", isPrimary: true }], createdAt: "2026-01-16" },
  { id: "p8", firstName: "Thomas", lastName: "Foster", email: "tom.foster@email.com", phone: null, preferredContact: "email", linkedStudents: [{ studentId: "s6", studentName: "Liam Foster", relationship: "father", isPrimary: true }], createdAt: "2026-01-16" },
  { id: "p9", firstName: "Soo-Jin", lastName: "Kim", email: "soojin.kim@email.com", phone: "555-0109", preferredContact: "both", linkedStudents: [{ studentId: "s7", studentName: "Olivia Kim", relationship: "mother", isPrimary: true }], createdAt: "2026-02-02" },
  { id: "p10", firstName: "Angela", lastName: "Davis", email: "angela.d@email.com", phone: "555-0110", preferredContact: "email", linkedStudents: [{ studentId: "s8", studentName: "Noah Davis", relationship: "guardian", isPrimary: true }], createdAt: "2026-01-16" },
]

export const DEMO_PARENT_MESSAGES: ParentMessage[] = [
  // Draft celebration for Sofia's perfect score
  { id: "m0", teacherId: "teacher-1", parentId: "p4", studentId: "s3", studentName: "Sofia Rodriguez", subject: "Celebrating Sofia's Perfect Score!", body: "Dear Carmen,\n\nI'm thrilled to share that Sofia achieved a **perfect score** on her Sage-level Trial for The Odyssey! This is an exceptional accomplishment that reflects her deep engagement with the text.\n\nSofia's analytical thinking and dedication continue to impress me. She earned the \"Perfect Score\" seal — a rare achievement.\n\nPlease congratulate her at home!\n\nBest,\nMs. Johnson", messageType: "celebration", sentAt: "2026-04-10T12:10:00Z", readAt: null, deliveryStatus: "queued", attachments: [{ type: "trial_result", label: "The Odyssey — Sage Trial: 100%" }], isDraft: true },
  // Draft celebration for Emma finishing a book
  { id: "m00", teacherId: "teacher-1", parentId: "p1", studentId: "s1", studentName: "Emma Chen", subject: "Emma Finished The Odyssey!", body: "Dear David,\n\nI wanted to let you know that Emma has completed **The Odyssey** — a major milestone in our AP Literature curriculum. Her consistent reading habit (14-day streak!) shows real dedication.\n\nShe's now ready to move on to our next unit.\n\nBest,\nMs. Johnson", messageType: "celebration", sentAt: "2026-04-08T15:00:00Z", readAt: null, deliveryStatus: "queued", attachments: [], isDraft: true },
  // Sent messages
  { id: "m1", teacherId: "teacher-1", parentId: "p1", studentId: "s1", studentName: "Emma Chen", subject: "Weekly Progress Update — Emma", body: "Dear Mr. Chen,\n\nEmma has had an excellent week in AP Literature. She completed Books 4–6 of The Odyssey with a 95% Trial score. Her annotations show deep analytical thinking.\n\nShe's maintaining a 14-day reading streak!\n\nBest,\nMs. Johnson", messageType: "progress_report", sentAt: "2026-04-05T16:00:00Z", readAt: "2026-04-05T18:30:00Z", deliveryStatus: "delivered", attachments: [{ type: "progress_report", label: "Weekly Progress — Apr 1–5" }] },
  { id: "m2", teacherId: "teacher-1", parentId: "p5", studentId: "s4", studentName: "James O'Brien", subject: "Concern: Trial Performance", body: "Dear Mr. O'Brien,\n\nI wanted to reach out about James's recent Trial performance. He scored 55% on the Books 1–3 Trial, which is below our class benchmark. He's also fallen behind on the reading pace.\n\nI'd like to discuss strategies to support him. Would you be available for a brief call this week?\n\nBest,\nMs. Johnson", messageType: "concern", sentAt: "2026-04-03T15:30:00Z", readAt: "2026-04-03T20:00:00Z", deliveryStatus: "delivered", attachments: [{ type: "trial_result", label: "Odyssey Trial: 55%" }] },
  { id: "m3", teacherId: "teacher-1", parentId: "p6", studentId: "s4", studentName: "James O'Brien", subject: "Concern: Trial Performance", body: "Dear Mrs. O'Brien,\n\nPlease see the same update I sent to Mr. O'Brien regarding James's Trial performance. I'd appreciate your support in encouraging more consistent reading at home.\n\nBest,\nMs. Johnson", messageType: "concern", sentAt: "2026-04-03T15:35:00Z", readAt: null, deliveryStatus: "delivered", attachments: [] },
  { id: "m4", teacherId: "teacher-1", parentId: "p4", studentId: "s3", studentName: "Sofia Rodriguez", subject: "Semester Progress Report — Sofia", body: "Dear Carmen,\n\nSofia continues to excel in AP Literature. She has completed 2 books, maintains a 28-day reading streak, and her Trial average is 97%.\n\nShe's one of the most engaged students in our class.\n\nBest,\nMs. Johnson", messageType: "progress_report", sentAt: "2026-04-01T14:00:00Z", readAt: "2026-04-01T19:00:00Z", deliveryStatus: "delivered", attachments: [{ type: "progress_report", label: "Semester Report — Spring 2026" }] },
  { id: "m5", teacherId: "teacher-1", parentId: "p9", studentId: "s7", studentName: "Olivia Kim", subject: "Checking In — Olivia's Progress", body: "Dear Ms. Kim,\n\nI wanted to check in about Olivia. As a transfer student, she's still catching up on earlier material. She hasn't been active on Tome for 3 days.\n\nWould it help if I assigned her a lighter reading load while she adjusts?\n\nBest,\nMs. Johnson", messageType: "concern", sentAt: "2026-04-08T10:00:00Z", readAt: null, deliveryStatus: "delivered", attachments: [] },
  { id: "m6", teacherId: "teacher-1", parentId: "p10", studentId: "s8", studentName: "Noah Davis", subject: "Inactivity Notice — Noah", body: "Dear Ms. Davis,\n\nNoah hasn't started any assignments on Tome yet. He's been inactive for over a week.\n\nCould we schedule a brief check-in to discuss how to get him started?\n\nBest,\nMs. Johnson", messageType: "concern", sentAt: "2026-04-09T09:00:00Z", readAt: null, deliveryStatus: "sent", attachments: [] },
  { id: "m7", teacherId: "teacher-1", parentId: "p3", studentId: "s2", studentName: "Marcus Williams", subject: "Marcus is Making Great Progress", body: "Dear Mr. Williams,\n\nJust a quick note — Marcus is doing well. He's 83% through The Odyssey and earned an 85% on his recent Trial. His discussion contributions are thoughtful.\n\nBest,\nMs. Johnson", messageType: "general", sentAt: "2026-03-29T14:00:00Z", readAt: "2026-03-30T08:00:00Z", deliveryStatus: "delivered", attachments: [] },
  { id: "m8", teacherId: "teacher-1", parentId: "p7", studentId: "s5", studentName: "Aisha Patel", subject: "Grade Update — Aisha", body: "Dear Mr. Patel,\n\nAisha scored 78% on her latest Odyssey Trial. She's making steady progress and I'd like to encourage her to write more annotations.\n\nBest,\nMs. Johnson", messageType: "grade_notification", sentAt: "2026-04-04T16:00:00Z", readAt: "2026-04-04T21:00:00Z", deliveryStatus: "delivered", attachments: [{ type: "trial_result", label: "Odyssey Trial: 78%" }] },
  { id: "m9", teacherId: "teacher-1", parentId: "p8", studentId: "s6", studentName: "Liam Foster", subject: "Liam Earned the \"Annotator\" Seal!", body: "Dear Mr. Foster,\n\nExciting news — Liam earned the \"Annotator\" seal for his thoughtful engagement with the texts. His latest annotation on Pride and Prejudice showed real literary insight.\n\nBest,\nMs. Johnson", messageType: "celebration", sentAt: "2026-04-10T16:00:00Z", readAt: null, deliveryStatus: "sent", attachments: [{ type: "seal", label: "Annotator Seal" }] },
]

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  { id: "tmpl-1", name: "Weekly progress update", type: "general", subjectTemplate: "Weekly Progress Update — {studentFirstName}", bodyTemplate: "Dear {parentName},\n\n{studentFirstName} has had a productive week in {className}.\n\n**Reading:** {studentFirstName} is currently reading {currentBook} and is {progress}% through.\n**Trials:** [summary of recent trial performance]\n**Engagement:** [annotations and discussion activity]\n\nPlease let me know if you have any questions.\n\nBest,\n{teacherName}" },
  { id: "tmpl-2", name: "Concern: missing assignments", type: "concern", subjectTemplate: "Concern: {studentFirstName}'s Assignment Progress", bodyTemplate: "Dear {parentName},\n\nI'm writing because {studentFirstName} has fallen behind on assignments in {className}. Specifically:\n\n- [describe what's missing or late]\n- [current reading progress]\n- [trial scores if relevant]\n\nI'd like to work together to support {studentFirstName}. Would you be available for a brief conversation this week?\n\nBest,\n{teacherName}" },
  { id: "tmpl-3", name: "Celebration: Seal earned", type: "celebration", subjectTemplate: "Celebrating {studentFirstName}'s Achievement!", bodyTemplate: "Dear {parentName},\n\nI'm excited to share that {studentFirstName} earned the **\"{sealName}\"** seal in {className}! This recognizes their {achievement}.\n\nPlease congratulate {studentFirstName} — they've earned it!\n\nBest,\n{teacherName}" },
  { id: "tmpl-4", name: "Grade notification", type: "grade_notification", subjectTemplate: "Grade Update: {studentFirstName} — {assignmentName}", bodyTemplate: "Dear {parentName},\n\n{studentFirstName} recently completed a Trial in {className}:\n\n- **Assignment:** {assignmentName}\n- **Score:** {score}%\n- **Wisdom Earned:** {wisdomEarned} XP\n\n[Optional teacher commentary]\n\nBest,\n{teacherName}" },
  { id: "tmpl-5", name: "End-of-unit progress report", type: "progress_report", subjectTemplate: "Progress Report: {studentFirstName} — {unitName}", bodyTemplate: "Dear {parentName},\n\nAs we wrap up our unit on {unitName}, here's a summary of {studentFirstName}'s progress:\n\n**Reading:** {booksCompleted} books completed, {readingMinutes} minutes total reading time\n**Trials:** {trialsCompleted} Trials taken, {avgScore}% average score\n**Engagement:** {annotationCount} annotations, {discussionCount} discussion posts\n**Wisdom (XP):** {wisdomTotal}\n\n[Teacher commentary]\n\nBest,\n{teacherName}" },
  { id: "tmpl-6", name: "Blank message", type: "general", subjectTemplate: "", bodyTemplate: "" },
]

// ── Helpers ──

export function getParents() {
  return DEMO_PARENTS
}

export function getParent(id: string) {
  return DEMO_PARENTS.find(p => p.id === id) ?? null
}

export function getParentsForStudent(studentId: string) {
  return DEMO_PARENTS.filter(p => p.linkedStudents.some(ls => ls.studentId === studentId))
}

export function getMessagesForParent(parentId: string) {
  return DEMO_PARENT_MESSAGES.filter(m => m.parentId === parentId).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
}

export function getMessagesForStudent(studentId: string) {
  return DEMO_PARENT_MESSAGES.filter(m => m.studentId === studentId).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
}

export function getDraftMessages() {
  return DEMO_PARENT_MESSAGES.filter(m => m.isDraft).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
}

export function getLastMessageDate(parentId: string): string | null {
  const msgs = getMessagesForParent(parentId).filter(m => !m.isDraft)
  return msgs.length > 0 ? msgs[0].sentAt : null
}
