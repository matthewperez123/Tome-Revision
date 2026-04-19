/**
 * The Ten Days — day-by-day metadata for the Decameron's frame.
 *
 * Each day has a governor (king or queen), a theme announced by that
 * governor at the close of the previous day, a mood epigraph for the
 * reader, and flat-chapter pointers into public/content/the-decameron/
 * for day-introduction and day-stub chapters.
 *
 * Day numbers are 1-indexed (matching the work's own numbering). Flat
 * chapter indices follow meta.json:
 *
 *   ch-0 Proem
 *   ch-1 "Day the First" stub
 *   ch-2 Day I Introduction (plague + brigata formation)
 *   ch-3..12 Day I tales 1–10
 *   ch-13 "Day the Second" stub
 *   ch-14 Day II Introduction
 *   ch-15..24 Day II tales
 *   ...
 *   ch-121 Conclusion of the Author
 *   ch-122 Glossary
 *
 * The day-stub chapters (ch-1, ch-13, ch-25, ...) are 3-word title cards
 * from Standard Ebooks; we keep them in the flow but surface the day-
 * introduction chapter as the meaningful entry point for each day.
 */

import type { BrigataId } from "./brigata"

export interface DayTheme {
  day: number
  governor: BrigataId
  governorTitle: "King" | "Queen"
  theme: string
  moodEpigraph: string
  dayStubChapter: number
  introChapter: number
  firstTaleChapter: number
  lastTaleChapter: number
}

export const DAYS: DayTheme[] = [
  {
    day: 1,
    governor: "pampinea",
    governorTitle: "Queen",
    theme: "Free subject — each may speak as they please",
    moodEpigraph: "Fleeing the plague, the brigata gathers in the countryside. No theme yet binds them — they are finding their voices.",
    dayStubChapter: 1,
    introChapter: 2,
    firstTaleChapter: 3,
    lastTaleChapter: 12,
  },
  {
    day: 2,
    governor: "filomena",
    governorTitle: "Queen",
    theme: "Those who have been brought by divers chances to a happy issue beyond their hope",
    moodEpigraph: "Fortune's reversals — but, this day, ending well. A day of shipwreck and rescue, captivity and freedom.",
    dayStubChapter: 13,
    introChapter: 14,
    firstTaleChapter: 15,
    lastTaleChapter: 24,
  },
  {
    day: 3,
    governor: "neifile",
    governorTitle: "Queen",
    theme: "Those who by dint of industry have acquired some much-desired thing or recovered some lost one",
    moodEpigraph: "Desire made practical. The brigata has moved to a second garden; the tales turn to stratagem.",
    dayStubChapter: 25,
    introChapter: 26,
    firstTaleChapter: 27,
    lastTaleChapter: 36,
  },
  {
    day: 4,
    governor: "filostrato",
    governorTitle: "King",
    theme: "Those whose loves have an unhappy ending",
    moodEpigraph: "Filostrato, the melancholy lover, compels the company into tragedy. The work's darkest day, opened by Boccaccio himself breaking the frame.",
    dayStubChapter: 37,
    introChapter: 38, // NOTE: this chapter contains both the frame opening AND Boccaccio's extended author-intervention self-defense. Rendered with a distinct register.
    firstTaleChapter: 39,
    lastTaleChapter: 48,
  },
  {
    day: 5,
    governor: "fiammetta",
    governorTitle: "Queen",
    theme: "Those whose loves, after divers cruel and miserable chances, attained to a happy end",
    moodEpigraph: "Fiammetta answers Filostrato: love survives. A day of reconciliations — and of Federigo's falcon.",
    dayStubChapter: 49,
    introChapter: 50,
    firstTaleChapter: 51,
    lastTaleChapter: 60,
  },
  {
    day: 6,
    governor: "elisa",
    governorTitle: "Queen",
    theme: "Those who with a witty saying have repulsed an attack or escaped peril or discomfiture",
    moodEpigraph: "The shortest day and the fastest: ten tales, each turning on a single ready reply. Boccaccio's exhibition of motto.",
    dayStubChapter: 61,
    introChapter: 62,
    firstTaleChapter: 63,
    lastTaleChapter: 72,
  },
  {
    day: 7,
    governor: "dioneo",
    governorTitle: "King",
    theme: "The tricks which wives have played on their husbands, whether for the sake of love or for their own preservation, without or with their being perceived",
    moodEpigraph: "Dioneo's only day as king, and he chooses farce. A day of wine-casks, cradles, and quick-thinking wives.",
    dayStubChapter: 73,
    introChapter: 74,
    firstTaleChapter: 75,
    lastTaleChapter: 84,
  },
  {
    day: 8,
    governor: "lauretta",
    governorTitle: "Queen",
    theme: "The tricks which, every day, one man plays on another, or women on men, or men on one another",
    moodEpigraph: "Lauretta widens Dioneo's theme to all tricksters. The Calandrino tales begin; the comedy turns sharper.",
    dayStubChapter: 85,
    introChapter: 86,
    firstTaleChapter: 87,
    lastTaleChapter: 96,
  },
  {
    day: 9,
    governor: "emilia",
    governorTitle: "Queen",
    theme: "Free subject — each may speak as they please (second free day)",
    moodEpigraph: "Emilia lets the company choose. The brigata is easy with one another now; the tales unwind at a relaxed rhythm before Day X's gravity.",
    dayStubChapter: 97,
    introChapter: 98,
    firstTaleChapter: 99,
    lastTaleChapter: 108,
  },
  {
    day: 10,
    governor: "pamfilo",
    governorTitle: "King",
    theme: "Those who have wrought magnificently or liberally in matters of love or otherwise",
    moodEpigraph: "Pamfilo closes the work on the theme of greatness. The noblest tales come here — and then Dioneo ends everything with Griselda.",
    dayStubChapter: 109,
    introChapter: 110,
    firstTaleChapter: 111,
    lastTaleChapter: 120,
  },
]

export function getDay(dayNumber: number): DayTheme | undefined {
  return DAYS.find((d) => d.day === dayNumber)
}

/** Flat chapter index 0..122 → the day it belongs to, or null for chapters
 * outside the ten days (Proem, Author's Conclusion, Glossary). */
export function dayForChapter(chapterIndex: number): DayTheme | null {
  for (const d of DAYS) {
    if (chapterIndex >= d.dayStubChapter && chapterIndex <= d.lastTaleChapter) {
      return d
    }
  }
  return null
}
