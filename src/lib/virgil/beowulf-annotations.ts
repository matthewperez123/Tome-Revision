// ── Beowulf Annotations ──
// Scholarly annotations for the anonymous Old English epic in John Lesslie
// Hall's 1892 alliterative-verse translation (Standard Ebooks, 2019).
// Anchors are text-exact against the line-anchored HTML in
// public/content/beowulf/ch-*.json.
//
// Density per spec Part 4: the five Opus clusters (opening, Grendel fight,
// the mere, Hrothgar's sermon, dragon + death + lament) each carry the
// spec's required high-density scholarly apparatus:
//   - The manuscript and its survival
//   - Hall's translation note
//   - The alliterative form
//   - The kenning system
//   - Tolkien's 1936 interpretive frame
//   - Grendel as descendant of Cain
//   - The Christian frame on pagan material
//   - The heroic code (wyrd, comitatus, lof, ofermōd)
//   - The ring composition of the two funerals
//   - The dragon-fight's elegiac turn
//   - The Geatish-Swedish dynastic doom
//
// Sonnet-density annotations for the intervening material are deferred
// per the spec's Part 4 pause point.
//
// This file is merged into the global annotation list by
// getAnnotationsForChapter() in ./annotations.ts.

import type { Annotation } from "./types"

import { BEOWULF_OPENING } from "./beowulf/opening"
import { BEOWULF_GRENDEL_FIGHT } from "./beowulf/grendel-fight"
import { BEOWULF_MERE } from "./beowulf/mere"
import { BEOWULF_HROTHGARS_SERMON } from "./beowulf/hrothgars-sermon"
import { BEOWULF_DRAGON } from "./beowulf/dragon"
import { BEOWULF_SONNET } from "./beowulf/sonnet-pass"

export const GENERATED_BEOWULF_ANNOTATIONS: Annotation[] = [
  ...BEOWULF_OPENING,
  ...BEOWULF_GRENDEL_FIGHT,
  ...BEOWULF_MERE,
  ...BEOWULF_HROTHGARS_SERMON,
  ...BEOWULF_DRAGON,
  ...BEOWULF_SONNET,
]
