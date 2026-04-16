/**
 * Default quick message templates for teacher messaging during guided sessions.
 * Teachers can customize these in their settings (future feature).
 */

export const DEFAULT_TEMPLATES = [
  "Take your time on this passage.",
  "Remember to consider the historical context.",
  "Five minutes left on this station.",
  "Excellent work.",
  "Reread the previous paragraph carefully.",
  "Focus on the key themes here.",
  "Almost there — keep going.",
  "Consider how this connects to what we discussed in class.",
  "Pay attention to the author's word choices here.",
  "Don't rush — quality over speed.",
] as const

export type QuickTemplate = (typeof DEFAULT_TEMPLATES)[number]

/**
 * Get templates for a session. Currently returns defaults;
 * in the future, will load teacher-customized templates.
 */
export function getTemplatesForTeacher(_teacherId?: string): string[] {
  return [...DEFAULT_TEMPLATES]
}
