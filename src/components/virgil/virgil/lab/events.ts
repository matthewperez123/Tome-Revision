/**
 * The Lab event deck: one button per meaningful product event, grouped by
 * category. Dispatched into useVirgilMachine on the stage.
 */

import type { VirgilCategory, VirgilEvent } from "@/lib/virgil/types"

export interface LabEventButton {
  label: string
  event: VirgilEvent
}

export interface LabEventGroup {
  category: VirgilCategory
  label: string
  buttons: LabEventButton[]
}

export const LAB_EVENT_GROUPS: LabEventGroup[] = [
  {
    category: "ambient",
    label: "Ambient",
    buttons: [
      { label: "App enter", event: { type: "APP_ENTER" } },
      { label: "App enter (returning)", event: { type: "APP_ENTER", context: { returning: true } } },
      { label: "Greet", event: { type: "GREET" } },
      { label: "Glance", event: { type: "GLANCE", direction: "right" } },
      { label: "Read along", event: { type: "READ_ALONG_STARTED" } },
      {
        label: "Text highlighted",
        event: { type: "TEXT_HIGHLIGHTED", quote: "It is a truth universally acknowledged…", paragraphId: "p1" },
      },
      { label: "Page peek", event: { type: "PAGE_PEEK" } },
      { label: "Tab hidden → sleep", event: { type: "APP_HIDDEN" } },
      { label: "Tab visible → wake", event: { type: "APP_VISIBLE" } },
      { label: "Back to idle", event: { type: "IDLE" } },
    ],
  },
  {
    category: "conversational",
    label: "Conversational",
    buttons: [
      { label: "Ask started → listen", event: { type: "ASK_STARTED" } },
      { label: "Stream: thinking", event: { type: "ASK_STREAMING", phase: "thinking" } },
      { label: "Stream: retrieving", event: { type: "ASK_STREAMING", phase: "retrieving" } },
      { label: "Stream: answering", event: { type: "ASK_STREAMING", phase: "answering" } },
      { label: "Search text", event: { type: "SEARCH_TEXT" } },
      { label: "Explain", event: { type: "EXPLAIN" } },
      { label: "Compare two ideas", event: { type: "COMPARE_IDEAS" } },
      { label: "Point to evidence", event: { type: "POINT_TO_EVIDENCE", paragraphId: "p12" } },
      { label: "Whisper aside", event: { type: "WHISPER_ASIDE" } },
      { label: "Socratic question", event: { type: "SOCRATIC_QUESTION" } },
      { label: "Wait for user", event: { type: "WAIT_FOR_USER" } },
      { label: "Acknowledge", event: { type: "ACKNOWLEDGE" } },
      { label: "Cite paragraph", event: { type: "CITE_PARAGRAPH", paragraphId: "p7" } },
    ],
  },
  {
    category: "hint",
    label: "Hint ladder",
    buttons: [
      { label: "Hint 1 · nudge", event: { type: "HINT_USED", level: 1 } },
      { label: "Hint 2 · narrow", event: { type: "HINT_USED", level: 2 } },
      { label: "Hint 3 · evidence", event: { type: "HINT_USED", level: 3 } },
      { label: "Final explanation", event: { type: "FINAL_EXPLANATION" } },
    ],
  },
  {
    category: "assessment",
    label: "Assessment",
    buttons: [
      { label: "Correct", event: { type: "ANSWER_CORRECT", streak: 1 } },
      { label: "Correct ×4 → streak", event: { type: "ANSWER_CORRECT", streak: 4 } },
      { label: "Elegant answer", event: { type: "ANSWER_ELEGANT" } },
      { label: "Near miss", event: { type: "ANSWER_NEAR_MISS" } },
      { label: "Incorrect (encouraging)", event: { type: "ANSWER_INCORRECT" } },
      { label: "Timeout", event: { type: "ANSWER_TIMEOUT" } },
      { label: "Answer revised", event: { type: "ANSWER_REVISED" } },
      { label: "Mastery achieved", event: { type: "MASTERY_ACHIEVED" } },
    ],
  },
  {
    category: "reward",
    label: "Rewards",
    buttons: [
      { label: "Wisdom +25", event: { type: "WISDOM_EARNED", amount: 25 } },
      { label: "Daily goal advanced", event: { type: "DAILY_GOAL_ADVANCED", progress: 0.6 } },
      { label: "Flame at risk", event: { type: "FLAME_AT_RISK" } },
      { label: "Flame secured", event: { type: "FLAME_SECURED" } },
      { label: "Chapter complete", event: { type: "CHAPTER_COMPLETE" } },
      { label: "Level up", event: { type: "LEVEL_UP", level: 7 } },
      { label: "Seal unlocked", event: { type: "SEAL_UNLOCKED", sealId: "seal-storm" } },
      { label: "Stoa restored", event: { type: "STOA_RESTORED", rewardId: "tile-04" } },
      { label: "Book complete", event: { type: "BOOK_COMPLETE" } },
      { label: "Journey complete", event: { type: "JOURNEY_COMPLETE" } },
    ],
  },
  {
    category: "system",
    label: "System",
    buttons: [
      { label: "Loading", event: { type: "LOADING" } },
      { label: "Offline", event: { type: "OFFLINE" } },
      { label: "Back online", event: { type: "ONLINE_RESTORED" } },
      { label: "Rate-limited", event: { type: "RATE_LIMITED" } },
      { label: "Content unavailable", event: { type: "CONTENT_UNAVAILABLE" } },
      { label: "Safe boundary", event: { type: "SAFE_BOUNDARY" } },
      { label: "Sound off", event: { type: "SOUND_TOGGLED", muted: true } },
      { label: "Teacher mode", event: { type: "MODE_CHANGED", mode: "teacher" } },
      { label: "Parent mode", event: { type: "MODE_CHANGED", mode: "parent" } },
      { label: "Reader mode", event: { type: "MODE_CHANGED", mode: "reader" } },
      { label: "Error (recoverable)", event: { type: "ERROR", recoverable: true } },
      { label: "Error (fatal)", event: { type: "ERROR", recoverable: false } },
      { label: "Welcome back", event: { type: "WELCOME_BACK", daysAway: 6 } },
      { label: "Reset", event: { type: "RESET" } },
    ],
  },
]
