// ─────────────────────────────────────────────
// The Living Archive — Motion Primitives
// ─────────────────────────────────────────────
// Motion vocabulary for Framer Motion / Motion. Follows the
// repo's existing animation-token pattern (see
// src/lib/animations/trial-tokens.ts): plain data + typed
// Variants, every preset ships a reduced-motion alternative.
//
// Choreography specs per moment (durations, curves, elements,
// sound/haptic mapping) are documented in
// docs/design/motion-vocabulary.md — keep the two in sync.
// ─────────────────────────────────────────────

import { useReducedMotion } from "framer-motion"
import type { Transition, Variants } from "framer-motion"

// ── Durations (ms) ───────────────────────────

export const laDurations = {
  press: 120,
  release: 240,
  instant: 100,
  fast: 160,
  normal: 280,
  slow: 480,
  reveal: 720,
  ceremony: 1200,
  portal: 900,
} as const

// ── Easings (tuple form for framer-motion) ───

export const laEasings = {
  /** Default literary ease — matches design-tokens `scholarly`. */
  scholarly: [0.25, 0.46, 0.45, 0.94] as const,
  /** Fast exit, long settle — reveals and count-ups. */
  outExpo: [0.16, 1, 0.3, 1] as const,
  /** Sheet/drawer physics — matches design-tokens `sheet`. */
  sheet: [0.32, 0.72, 0, 1] as const,
  /** Anticipation dip before a pop. */
  anticipate: [0.36, 0, 0.66, -0.56] as const,
  /** Gentle settle after overshoot. */
  settle: [0.34, 1.56, 0.64, 1] as const,
} as const

// ── Spring configs ───────────────────────────

export const laSprings = {
  /** Tactile press/release on buttons and nodes. */
  press: { type: "spring" as const, stiffness: 500, damping: 30, mass: 0.8 },
  /** Standard interactive response. */
  interactive: { type: "spring" as const, stiffness: 300, damping: 25 },
  /** Slow, calm ambient motion (Virgil, portals). */
  gentle: { type: "spring" as const, stiffness: 120, damping: 20 },
  /** Ceremonial reveals — seals, medallions. Overshoots once. */
  medallion: { type: "spring" as const, stiffness: 180, damping: 14, mass: 1.1 },
  /** Bottom sheets and drawers. */
  sheet: { type: "spring" as const, stiffness: 260, damping: 28 },
  /** Drag snap-back for match cards. */
  dragSnap: { type: "spring" as const, stiffness: 400, damping: 22 },
} as const

// ── Stagger helpers ──────────────────────────

/** Container variants that stagger children by `interval` ms. */
export function staggerContainer(intervalMs: number, delayMs = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: intervalMs / 1000,
        delayChildren: delayMs / 1000,
      },
    },
  }
}

/** Standard stagger child: rise + fade. */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: laDurations.normal / 1000, ease: laEasings.outExpo as unknown as Transition["ease"] },
  },
}

// ── Reduced-motion hook ──────────────────────

/**
 * SSR-safe reduced-motion preference.
 * Wraps framer-motion's useReducedMotion; returns `false` during
 * SSR/first paint (no motion preference assumed) and the real
 * preference after hydration. Components should treat `true` as
 * "opacity-only, no transforms, no keyframes".
 */
export function useReducedMotionSafe(): boolean {
  const prefers = useReducedMotion()
  return prefers === true
}

/** Pick the full or reduced variant set for a tactile moment. */
export function pickTactile(name: LaTactileMomentName, reducedMotion: boolean): Variants {
  return reducedMotion ? tactileMomentsReduced[name].variants : tactileMoments[name].variants
}

// ── Tactile moment metadata ──────────────────

export type LaTactileMomentMeta = {
  /** Total choreography length in ms. */
  durationMs: number;
  /** Named curve/spring from laEasings/laSprings. */
  curve: string;
  /** Elements involved, in animation order. */
  elements: string[];
  /** Reduced-motion alternative, one line. */
  reducedMotion: string;
  /** Sound-pack cue id, or null when silent. */
  sound: string | null;
  /** Haptic pattern id, or null when none. */
  haptic: string | null;
}

export type LaTactileMoment = {
  variants: Variants;
  meta: LaTactileMomentMeta;
}

// ═══ The 20 tactile moments (Master Plan §9) ═══════════════
// Variant state naming convention: hidden/visible for enter-exit,
// rest/hover/pressed for direct manipulation, plus moment-specific
// states (e.g. "correct", "nearMiss", "revealed").

export const tactileMoments = {
  /** 1. Pressing a primary action — squash, release, settle. */
  pressPrimary: {
    variants: {
      rest: { scale: 1, y: 0 },
      hover: { scale: 1.02, transition: { duration: laDurations.fast / 1000 } },
      pressed: { scale: 0.96, y: 2, transition: laSprings.press },
    } satisfies Variants,
    meta: {
      durationMs: 360,
      curve: "springs.press",
      elements: ["button body", "edge shadow"],
      reducedMotion: "Background-color shift only; no transform.",
      sound: "soft-press",
      haptic: "tap-light",
    },
  },

  /** 2. Opening a book portal — cover breathes, door of light opens. */
  openBookPortal: {
    variants: {
      hidden: { opacity: 0, scale: 0.94, rotateX: 6 },
      visible: {
        opacity: 1,
        scale: 1,
        rotateX: 0,
        transition: { duration: laDurations.portal / 1000, ease: laEasings.outExpo as unknown as Transition["ease"] },
      },
      exit: { opacity: 0, scale: 1.06, transition: { duration: laDurations.normal / 1000 } },
    } satisfies Variants,
    meta: {
      durationMs: 900,
      curve: "easings.outExpo",
      elements: ["portal frame", "cover", "interior glow"],
      reducedMotion: "Crossfade portal in over 200ms; no perspective tilt.",
      sound: "page-turn",
      haptic: null,
    },
  },

  /** 3. Cover → Stoa/book world — shared-element zoom into the diorama. */
  coverToWorld: {
    variants: {
      hidden: { opacity: 0, scale: 0.85, borderRadius: "22px" },
      visible: {
        opacity: 1,
        scale: 1,
        borderRadius: "0px",
        transition: { duration: laDurations.reveal / 1000, ease: laEasings.outExpo as unknown as Transition["ease"] },
      },
    } satisfies Variants,
    meta: {
      durationMs: 720,
      curve: "easings.outExpo",
      elements: ["shared cover", "world backdrop", "parallax layers (3)"],
      reducedMotion: "Simple crossfade between routes; parallax static.",
      sound: null,
      haptic: null,
    },
  },

  /** 4. Opening the reader — page slides up, chrome dissolves away. */
  openReader: {
    variants: {
      hidden: { opacity: 0, y: 24 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: laDurations.slow / 1000, ease: laEasings.scholarly as unknown as Transition["ease"] },
      },
      exit: { opacity: 0, y: 12, transition: { duration: laDurations.fast / 1000 } },
    } satisfies Variants,
    meta: {
      durationMs: 480,
      curve: "easings.scholarly",
      elements: ["page canvas", "reader chrome (counter-fade)"],
      reducedMotion: "Instant swap; text must never wait on animation.",
      sound: "page-turn",
      haptic: null,
    },
  },

  /** 5. Highlighting a phrase — ink wash settles under the words. */
  highlightPhrase: {
    variants: {
      hidden: { scaleX: 0, originX: 0, opacity: 0.4 },
      visible: {
        scaleX: 1,
        opacity: 1,
        transition: { duration: laDurations.normal / 1000, ease: laEasings.scholarly as unknown as Transition["ease"] },
      },
    } satisfies Variants,
    meta: {
      durationMs: 280,
      curve: "easings.scholarly",
      elements: ["highlight wash (scaleX)", "phrase text (unchanged)"],
      reducedMotion: "Highlight appears instantly with final color.",
      sound: null,
      haptic: null,
    },
  },

  /** 6. Summoning Virgil — lantern glow precedes him. */
  summonVirgil: {
    variants: {
      hidden: { opacity: 0, y: 16, scale: 0.9 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: laSprings.gentle,
      },
      exit: { opacity: 0, y: 8, scale: 0.95, transition: { duration: laDurations.fast / 1000 } },
    } satisfies Variants,
    meta: {
      durationMs: 520,
      curve: "springs.gentle",
      elements: ["lantern glow (leads 80ms)", "Virgil figure", "speech bubble (stagger 90ms)"],
      reducedMotion: "Fade in 150ms; glow and bubble appear together.",
      sound: "virgil-lantern",
      haptic: null,
    },
  },

  /** 7. Dragging a Trial answer — lift, shadow, snap-back. */
  dragTrialAnswer: {
    variants: {
      rest: { scale: 1, boxShadow: "var(--la-shadow-raised)" },
      dragging: { scale: 1.05, boxShadow: "var(--la-shadow-portal)", transition: { duration: laDurations.fast / 1000 } },
      dropped: { scale: 1, transition: laSprings.dragSnap },
      rejected: { x: [0, -8, 8, -4, 4, 0], transition: { duration: 0.4, ease: "easeInOut" } },
    } satisfies Variants,
    meta: {
      durationMs: 400,
      curve: "springs.dragSnap",
      elements: ["match card", "drop-slot pulse", "edge shadow"],
      reducedMotion: "No lift or shake; selection shown by border + icon only.",
      sound: "soft-press",
      haptic: "tap-light",
    },
  },

  /** 8. Submitting an answer — button compresses, ring draws. */
  submitAnswer: {
    variants: {
      rest: { scale: 1 },
      pressed: { scale: 0.94, transition: laSprings.press },
      loading: { opacity: 0.85, scale: 0.99, transition: { duration: laDurations.fast / 1000 } },
      resolved: { scale: 1, transition: laSprings.interactive },
    } satisfies Variants,
    meta: {
      durationMs: 500,
      curve: "springs.press",
      elements: ["submit button", "progress ring (stroke draw 300ms)"],
      reducedMotion: "Spinner replaced by static 'checking…' label.",
      sound: "soft-press",
      haptic: "tap-medium",
    },
  },

  /** 9. Near-miss response — warm amber lean-in, no punishment shake. */
  nearMissResponse: {
    variants: {
      hidden: { opacity: 0, x: 0 },
      visible: {
        opacity: 1,
        x: [0, 6, 0],
        transition: { duration: laDurations.slow / 1000, ease: laEasings.settle as unknown as Transition["ease"] },
      },
    } satisfies Variants,
    meta: {
      durationMs: 480,
      curve: "easings.settle",
      elements: ["answer card (single gentle sway)", "near-miss chip", "Virgil hint line"],
      reducedMotion: "Amber chip fades in; card stays still.",
      sound: "near-miss-tone",
      haptic: null,
    },
  },

  /** 10. Correct answer — jade pulse, one confidant pop. */
  correctAnswerResponse: {
    variants: {
      hidden: { opacity: 0, scale: 0.97 },
      visible: {
        opacity: 1,
        scale: [1, 1.03, 1],
        transition: { duration: laDurations.slow / 1000, times: [0, 0.4, 1], ease: laEasings.outExpo as unknown as Transition["ease"] },
      },
    } satisfies Variants,
    meta: {
      durationMs: 480,
      curve: "easings.outExpo",
      elements: ["answer card (pop)", "jade wash pulse", "check glyph draw"],
      reducedMotion: "Jade wash + check appear without scale.",
      sound: "correct-tone",
      haptic: "success-double",
    },
  },

  /** 11. Trial completion — results stagger up like shelved books. */
  trialCompletion: {
    variants: {
      hidden: {},
      visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
    } satisfies Variants,
    meta: {
      durationMs: 1200,
      curve: "stagger 90ms + easings.outExpo",
      elements: ["results hero", "score rows (stagger)", "Wisdom chip", "CTA (last)"],
      reducedMotion: "All rows fade in together over 200ms.",
      sound: null,
      haptic: null,
    },
  },

  /** 12. Wisdom count-up — digits roll, gold sparkle on land. */
  wisdomCountUp: {
    variants: {
      hidden: { opacity: 0, y: 8 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: laDurations.reveal / 1000, ease: laEasings.outExpo as unknown as Transition["ease"] },
      },
      sparkle: { scale: [1, 1.12, 1], transition: { duration: 0.3 } },
    } satisfies Variants,
    meta: {
      durationMs: 1000,
      curve: "easings.outExpo (counter tween) + pop",
      elements: ["wisdom counter (720ms roll)", "gold sparkle (on land)"],
      reducedMotion: "Final value shown immediately; no roll.",
      sound: "wisdom-sparkle",
      haptic: "tap-light",
    },
  },

  /** 13. Flame secured — ember catches, hearth glows, steady. */
  flameSecured: {
    variants: {
      unlit: { opacity: 0.5, scale: 0.9 },
      lit: {
        opacity: 1,
        scale: [0.9, 1.08, 1],
        transition: { duration: laDurations.reveal / 1000, times: [0, 0.5, 1], ease: laEasings.settle as unknown as Transition["ease"] },
      },
    } satisfies Variants,
    meta: {
      durationMs: 720,
      curve: "easings.settle",
      elements: ["ember dot", "flame shape (draw + pop)", "hearth glow ring"],
      reducedMotion: "Flame swaps to lit artwork instantly.",
      sound: "flame-ignition",
      haptic: "success-double",
    },
  },

  /** 14. Seal reveal — medallion turns, catches the light once. */
  sealReveal: {
    variants: {
      hidden: { opacity: 0, rotateY: 90, scale: 0.8 },
      visible: {
        opacity: 1,
        rotateY: 0,
        scale: 1,
        transition: laSprings.medallion,
      },
    } satisfies Variants,
    meta: {
      durationMs: 900,
      curve: "springs.medallion",
      elements: ["medallion (coin-turn)", "gold rim highlight sweep", "name plate (fade, delayed 250ms)"],
      reducedMotion: "Medallion fades in front-on; no rotation.",
      sound: "seal-resonance",
      haptic: "success-double",
    },
  },

  /** 15. Stoa restoration — tile lifts into the colonnade. */
  stoaRestoration: {
    variants: {
      hidden: { opacity: 0, y: 28, scale: 0.92 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: laDurations.ceremony / 1000, ease: laEasings.outExpo as unknown as Transition["ease"] },
      },
    } satisfies Variants,
    meta: {
      durationMs: 1200,
      curve: "easings.outExpo",
      elements: ["restored tile", "dust motes (opacity)", "gallery light shift", "plaque (stagger 300ms)"],
      reducedMotion: "Tile fades into place; plaque appears with it.",
      sound: "stoa-restoration",
      haptic: null,
    },
  },

  /** 16. Path-node unlock — dormant node wakes, ring draws. */
  pathNodeUnlock: {
    variants: {
      locked: { opacity: 0.55, scale: 0.94 },
      unlocking: { scale: [0.94, 1.1, 1], opacity: 1, transition: { duration: 0.6, times: [0, 0.6, 1], ease: laEasings.settle as unknown as Transition["ease"] } },
      unlocked: { scale: 1, opacity: 1 },
    } satisfies Variants,
    meta: {
      durationMs: 600,
      curve: "easings.settle",
      elements: ["node disc", "progress ring (stroke draw)", "connecting trail segment"],
      reducedMotion: "Node swaps to unlocked state; ring appears drawn.",
      sound: "hint-chime",
      haptic: "tap-light",
    },
  },

  /** 17. Chapter completion — bookmark settles, next chapter peeks. */
  chapterCompletion: {
    variants: {
      hidden: { opacity: 0, y: -14 },
      visible: {
        opacity: 1,
        y: 0,
        transition: laSprings.gentle,
      },
      peek: { x: [0, 10, 0], transition: { duration: 0.5, delay: 0.3 } },
    } satisfies Variants,
    meta: {
      durationMs: 800,
      curve: "springs.gentle",
      elements: ["bookmark ribbon (drops in)", "chapter mark", "next-chapter card (peek)"],
      reducedMotion: "Bookmark fades in; no peek motion.",
      sound: "page-turn",
      haptic: null,
    },
  },

  /** 18. Level up — crest rises, single restrained burst. */
  levelUp: {
    variants: {
      hidden: { opacity: 0, scale: 0.7, y: 20 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: laSprings.medallion,
      },
      burst: { opacity: [0.8, 0], scale: [1, 1.6], transition: { duration: 0.6, ease: laEasings.outExpo as unknown as Transition["ease"] } },
    } satisfies Variants,
    meta: {
      durationMs: 1100,
      curve: "springs.medallion",
      elements: ["level crest", "single expanding ring (not confetti)", "label (fade, delayed 200ms)"],
      reducedMotion: "Crest + label fade in; no expanding ring.",
      sound: "seal-resonance",
      haptic: "success-double",
    },
  },

  /** 19. Returning after absence — hearth rekindles, warm not guilty. */
  returnAfterAbsence: {
    variants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: laDurations.reveal / 1000, ease: laEasings.scholarly as unknown as Transition["ease"] },
      },
      glow: { opacity: [0, 1, 0.6], transition: { duration: 0.9, times: [0, 0.5, 1] } },
    } satisfies Variants,
    meta: {
      durationMs: 900,
      curve: "easings.scholarly",
      elements: ["welcome line (fade)", "hearth glow (rises once)", "continue card (settle)"],
      reducedMotion: "Static welcome state; glow shown at final level.",
      sound: "virgil-lantern",
      haptic: null,
    },
  },

  /** 20. Device Lab switch — frame morphs between form factors. */
  deviceLabSwitch: {
    variants: {
      hidden: { opacity: 0.4, scale: 0.96 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: laDurations.slow / 1000, ease: laEasings.sheet as unknown as Transition["ease"] },
      },
    } satisfies Variants,
    meta: {
      durationMs: 480,
      curve: "easings.sheet",
      elements: ["device frame (width/height tween)", "viewport content (crossfade)"],
      reducedMotion: "Frame resizes instantly; content crossfades.",
      sound: null,
      haptic: null,
    },
  },
} as const satisfies Record<string, LaTactileMoment>

export type LaTactileMomentName = keyof typeof tactileMoments

// ═══ Reduced-motion alternatives ═══════════════════════════
// Every preset collapses to opacity/short-fade choreography.
// Transforms, keyframe arrays, springs, and parallax are removed.

const reducedFade = (durationMs = 150): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durationMs / 1000 } },
})

export const tactileMomentsReduced: Record<LaTactileMomentName, LaTactileMoment> = {
  pressPrimary: {
    variants: {
      rest: { backgroundColor: "var(--la-primary)" },
      hover: { backgroundColor: "var(--la-primary)" },
      pressed: { backgroundColor: "var(--la-primary-edge)", transition: { duration: 0.12 } },
    },
    meta: { ...tactileMoments.pressPrimary.meta, durationMs: 120 },
  },
  openBookPortal: { variants: reducedFade(200), meta: { ...tactileMoments.openBookPortal.meta, durationMs: 200 } },
  coverToWorld: { variants: reducedFade(200), meta: { ...tactileMoments.coverToWorld.meta, durationMs: 200 } },
  openReader: { variants: { hidden: {}, visible: {} }, meta: { ...tactileMoments.openReader.meta, durationMs: 0 } },
  highlightPhrase: { variants: reducedFade(0), meta: { ...tactileMoments.highlightPhrase.meta, durationMs: 0 } },
  summonVirgil: { variants: reducedFade(150), meta: { ...tactileMoments.summonVirgil.meta, durationMs: 150 } },
  dragTrialAnswer: {
    variants: {
      rest: {},
      dragging: { opacity: 0.9 },
      dropped: { opacity: 1 },
      rejected: { opacity: [1, 0.6, 1], transition: { duration: 0.2 } },
    },
    meta: { ...tactileMoments.dragTrialAnswer.meta, durationMs: 200 },
  },
  submitAnswer: { variants: reducedFade(120), meta: { ...tactileMoments.submitAnswer.meta, durationMs: 120 } },
  nearMissResponse: { variants: reducedFade(150), meta: { ...tactileMoments.nearMissResponse.meta, durationMs: 150 } },
  correctAnswerResponse: { variants: reducedFade(150), meta: { ...tactileMoments.correctAnswerResponse.meta, durationMs: 150 } },
  trialCompletion: {
    variants: { hidden: {}, visible: { transition: { staggerChildren: 0 } } },
    meta: { ...tactileMoments.trialCompletion.meta, durationMs: 200 },
  },
  wisdomCountUp: { variants: reducedFade(120), meta: { ...tactileMoments.wisdomCountUp.meta, durationMs: 120 } },
  flameSecured: { variants: { unlit: { opacity: 0.6 }, lit: { opacity: 1, transition: { duration: 0.15 } } }, meta: { ...tactileMoments.flameSecured.meta, durationMs: 150 } },
  sealReveal: { variants: reducedFade(200), meta: { ...tactileMoments.sealReveal.meta, durationMs: 200 } },
  stoaRestoration: { variants: reducedFade(250), meta: { ...tactileMoments.stoaRestoration.meta, durationMs: 250 } },
  pathNodeUnlock: {
    variants: {
      locked: { opacity: 0.6 },
      unlocking: { opacity: 1, transition: { duration: 0.15 } },
      unlocked: { opacity: 1 },
    },
    meta: { ...tactileMoments.pathNodeUnlock.meta, durationMs: 150 },
  },
  chapterCompletion: { variants: reducedFade(150), meta: { ...tactileMoments.chapterCompletion.meta, durationMs: 150 } },
  levelUp: { variants: reducedFade(200), meta: { ...tactileMoments.levelUp.meta, durationMs: 200 } },
  returnAfterAbsence: { variants: reducedFade(200), meta: { ...tactileMoments.returnAfterAbsence.meta, durationMs: 200 } },
  deviceLabSwitch: { variants: reducedFade(120), meta: { ...tactileMoments.deviceLabSwitch.meta, durationMs: 120 } },
}

// ── Aggregate ────────────────────────────────

export const livingArchiveMotion = {
  durations: laDurations,
  easings: laEasings,
  springs: laSprings,
  moments: tactileMoments,
  momentsReduced: tactileMomentsReduced,
} as const
