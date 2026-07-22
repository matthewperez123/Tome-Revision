// ─────────────────────────────────────────────
// Tome procedural sound pack (src/lib/game/sound.ts)
// ─────────────────────────────────────────────
// Original cues synthesized with the Web Audio API — no external
// samples, no network, no copyrighted material. Cue ids match the
// sound mapping in docs/design/motion-vocabulary.md §3.
//
// Policy (non-negotiable):
//  - Muted by default. Sound plays only after the reader explicitly
//    enables it, and the preference persists in localStorage.
//  - The AudioContext unlocks on the first user gesture
//    (pointerdown/keydown) — installSoundGesturePriming() wires that.
//  - playSound() is a total no-op when muted, before any gesture,
//    during SSR, or where Web Audio is unavailable. It never throws.
//  - No harsh failure buzz: near-miss is a warm suspended tone.
// ─────────────────────────────────────────────

export type SoundCueId =
  | "soft-press"
  | "page-turn"
  | "hint-chime"
  | "correct-tone"
  | "near-miss-tone"
  | "wisdom-sparkle"
  | "flame-ignition"
  | "seal-resonance"
  | "stoa-restoration"
  | "virgil-lantern"
  | "notification"

export const SOUND_CUE_IDS: readonly SoundCueId[] = [
  "soft-press",
  "page-turn",
  "hint-chime",
  "correct-tone",
  "near-miss-tone",
  "wisdom-sparkle",
  "flame-ignition",
  "seal-resonance",
  "stoa-restoration",
  "virgil-lantern",
  "notification",
] as const

const STORAGE_KEY = "tome.sound.muted"

// ── Mute preference ──────────────────────────

/** `true` unless the reader has explicitly enabled sound. */
export function isSoundMuted(): boolean {
  if (typeof window === "undefined") return true
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "false"
  } catch {
    return true
  }
}

/** Persist the reader's sound preference. */
export function setSoundMuted(muted: boolean): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, muted ? "true" : "false")
  } catch {
    /* storage unavailable — preference simply won't persist */
  }
  if (muted && ctx) {
    void ctx.suspend().catch(() => undefined)
  }
}

/** Subscribe to preference changes (for settings UIs). */
export function onSoundMutedChange(listener: (muted: boolean) => void): () => void {
  if (typeof window === "undefined") return () => undefined
  const handler = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener(event.newValue !== "false")
  }
  window.addEventListener("storage", handler)
  return () => window.removeEventListener("storage", handler)
}

// ── AudioContext lifecycle ───────────────────

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null
let noiseBuffer: AudioBuffer | null = null
let primed = false

function ensureContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!ctx) {
    try {
      ctx = new Ctor()
      masterGain = ctx.createGain()
      masterGain.gain.value = 0.5 // gentle overall level
      masterGain.connect(ctx.destination)
    } catch {
      return null
    }
  }
  return ctx
}

function getNoiseBuffer(context: AudioContext): AudioBuffer {
  if (!noiseBuffer) {
    const length = context.sampleRate * 2
    noiseBuffer = context.createBuffer(1, length, context.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1
  }
  return noiseBuffer
}

/**
 * Wire one-time pointerdown/keydown listeners so the AudioContext
 * unlocks on the reader's first gesture (autoplay policy). Safe to
 * call more than once; no-ops on the server.
 */
export function installSoundGesturePriming(): void {
  if (typeof window === "undefined" || primed) return
  primed = true
  const unlock = () => {
    const context = ensureContext()
    if (context && context.state === "suspended" && !isSoundMuted()) {
      void context.resume().catch(() => undefined)
    }
  }
  window.addEventListener("pointerdown", unlock, { passive: true })
  window.addEventListener("keydown", unlock)
}

// ── Synthesis primitives ─────────────────────

type Envelope = { attack: number; decay: number; peak: number }

function tone(
  context: AudioContext,
  opts: {
    type: OscillatorType
    frequency: number
    detune?: number
    start: number
    envelope: Envelope
    destination: AudioNode
  },
): void {
  const osc = context.createOscillator()
  const gain = context.createGain()
  osc.type = opts.type
  osc.frequency.value = opts.frequency
  if (opts.detune) osc.detune.value = opts.detune
  const t = opts.start
  const { attack, decay, peak } = opts.envelope
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.linearRampToValueAtTime(peak, t + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay)
  osc.connect(gain)
  gain.connect(opts.destination)
  osc.start(t)
  osc.stop(t + attack + decay + 0.05)
}

function noise(
  context: AudioContext,
  opts: {
    start: number
    duration: number
    peak: number
    filterType: BiquadFilterType
    filterFrom: number
    filterTo?: number
    destination: AudioNode
  },
): void {
  const source = context.createBufferSource()
  source.buffer = getNoiseBuffer(context)
  source.loop = true
  const filter = context.createBiquadFilter()
  filter.type = opts.filterType
  const t = opts.start
  filter.frequency.setValueAtTime(opts.filterFrom, t)
  if (opts.filterTo) {
    filter.frequency.exponentialRampToValueAtTime(opts.filterTo, t + opts.duration)
  }
  const gain = context.createGain()
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.linearRampToValueAtTime(opts.peak, t + Math.min(0.03, opts.duration * 0.3))
  gain.gain.exponentialRampToValueAtTime(0.0001, t + opts.duration)
  source.connect(filter)
  filter.connect(gain)
  gain.connect(opts.destination)
  source.start(t)
  source.stop(t + opts.duration + 0.05)
}

// ── The cues ─────────────────────────────────

function playCue(context: AudioContext, out: AudioNode, cue: SoundCueId): void {
  const now = context.currentTime + 0.01
  switch (cue) {
    case "soft-press": {
      // Short felted tap, <80ms.
      noise(context, { start: now, duration: 0.06, peak: 0.12, filterType: "lowpass", filterFrom: 900, destination: out })
      break
    }
    case "page-turn": {
      // Paper whisper, ~250ms.
      noise(context, { start: now, duration: 0.25, peak: 0.08, filterType: "bandpass", filterFrom: 1600, filterTo: 3200, destination: out })
      break
    }
    case "hint-chime": {
      // Single warm bell partial.
      tone(context, { type: "sine", frequency: 880, start: now, envelope: { attack: 0.005, decay: 0.9, peak: 0.1 }, destination: out })
      tone(context, { type: "sine", frequency: 1760, start: now, envelope: { attack: 0.005, decay: 0.35, peak: 0.03 }, destination: out })
      break
    }
    case "correct-tone": {
      // Rising major third, soft attack.
      tone(context, { type: "sine", frequency: 523.25, start: now, envelope: { attack: 0.02, decay: 0.28, peak: 0.11 }, destination: out })
      tone(context, { type: "sine", frequency: 659.25, start: now + 0.09, envelope: { attack: 0.02, decay: 0.5, peak: 0.11 }, destination: out })
      break
    }
    case "near-miss-tone": {
      // Gentle suspended tone — warm lean-in, never a buzz.
      tone(context, { type: "sine", frequency: 392, start: now, envelope: { attack: 0.04, decay: 0.6, peak: 0.07 }, destination: out })
      tone(context, { type: "sine", frequency: 523.25, start: now + 0.05, envelope: { attack: 0.04, decay: 0.7, peak: 0.06 }, destination: out })
      break
    }
    case "wisdom-sparkle": {
      // Light metallic shimmer: quick descending pings.
      ;[2093, 1568, 2637].forEach((frequency, i) => {
        tone(context, { type: "sine", frequency, start: now + i * 0.06, envelope: { attack: 0.003, decay: 0.22, peak: 0.055 }, destination: out })
      })
      break
    }
    case "flame-ignition": {
      // Soft whoosh + warm bed.
      noise(context, { start: now, duration: 0.45, peak: 0.09, filterType: "lowpass", filterFrom: 400, filterTo: 1400, destination: out })
      tone(context, { type: "sine", frequency: 196, start: now + 0.1, envelope: { attack: 0.1, decay: 0.7, peak: 0.06 }, destination: out })
      break
    }
    case "seal-resonance": {
      // Low chime with long tail.
      tone(context, { type: "sine", frequency: 220, start: now, envelope: { attack: 0.01, decay: 1.8, peak: 0.12 }, destination: out })
      tone(context, { type: "sine", frequency: 440, start: now, envelope: { attack: 0.01, decay: 1.1, peak: 0.05 }, destination: out })
      tone(context, { type: "sine", frequency: 553, start: now + 0.02, envelope: { attack: 0.01, decay: 0.9, peak: 0.03 }, destination: out })
      break
    }
    case "stoa-restoration": {
      // Stone-settle + air swell.
      tone(context, { type: "sine", frequency: 98, start: now, envelope: { attack: 0.005, decay: 0.35, peak: 0.12 }, destination: out })
      noise(context, { start: now + 0.05, duration: 0.8, peak: 0.05, filterType: "bandpass", filterFrom: 500, filterTo: 1800, destination: out })
      break
    }
    case "virgil-lantern": {
      // Faint glow hum.
      tone(context, { type: "sine", frequency: 180, start: now, envelope: { attack: 0.25, decay: 1.0, peak: 0.035 }, destination: out })
      tone(context, { type: "sine", frequency: 271, detune: 4, start: now + 0.1, envelope: { attack: 0.25, decay: 0.9, peak: 0.02 }, destination: out })
      break
    }
    case "notification": {
      // Subdued knock.
      tone(context, { type: "sine", frequency: 620, start: now, envelope: { attack: 0.003, decay: 0.12, peak: 0.08 }, destination: out })
      tone(context, { type: "sine", frequency: 620, start: now + 0.16, envelope: { attack: 0.003, decay: 0.18, peak: 0.05 }, destination: out })
      break
    }
  }
}

// ── Public API ───────────────────────────────

/**
 * Play a cue. No-ops silently when sound is muted, when no gesture
 * has unlocked audio yet, on the server, or without Web Audio.
 * Never throws, never blocks.
 */
export function playSound(cue: SoundCueId): void {
  if (isSoundMuted()) return
  const context = ensureContext()
  if (!context || !masterGain) return
  if (context.state === "suspended") {
    // Not yet unlocked by a gesture; resume opportunistically and
    // skip the cue if the browser still refuses.
    void context.resume().catch(() => undefined)
    if (context.state === "suspended") return
  }
  try {
    playCue(context, masterGain, cue)
  } catch {
    /* a cue must never break the UI thread that triggered it */
  }
}

/** All cues as a labelled list (for the settings sound preview). */
export function listSoundCues(): readonly { id: SoundCueId; label: string }[] {
  return SOUND_CUE_LABELS
}

const SOUND_CUE_LABELS: readonly { id: SoundCueId; label: string }[] = [
  { id: "soft-press", label: "Soft press" },
  { id: "page-turn", label: "Page turn" },
  { id: "hint-chime", label: "Hint chime" },
  { id: "correct-tone", label: "Correct answer" },
  { id: "near-miss-tone", label: "Near miss (warm)" },
  { id: "wisdom-sparkle", label: "Wisdom sparkle" },
  { id: "flame-ignition", label: "Flame ignition" },
  { id: "seal-resonance", label: "Seal resonance" },
  { id: "stoa-restoration", label: "Stoa restoration" },
  { id: "virgil-lantern", label: "Virgil's lantern" },
  { id: "notification", label: "Notification" },
] as const
