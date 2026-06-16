/**
 * Optional answer-feedback tones for the trial QuestionCard.
 *
 * Pure Web Audio — no asset files, no dependency. Opt-in: the card only
 * calls these when its `sound` prop is true. Safe to call on the server
 * (guards on `window`/AudioContext) and silently no-ops if audio is blocked.
 */

let ctx: AudioContext | null = null

function audioContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!Ctor) return null
  if (!ctx) ctx = new Ctor()
  return ctx
}

/** Play a short tone (or two-note chime). Frequencies in Hz, step in seconds. */
function tone(freqs: number[], step = 0.12): void {
  const ac = audioContext()
  if (!ac) return
  if (ac.state === "suspended") void ac.resume()

  freqs.forEach((freq, i) => {
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    const start = ac.currentTime + i * step
    osc.type = "sine"
    osc.frequency.setValueAtTime(freq, start)
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + step)
    osc.connect(gain).connect(ac.destination)
    osc.start(start)
    osc.stop(start + step)
  })
}

/** Rising major-third chime on a correct answer. */
export function playCorrect(): void {
  tone([523.25, 659.25, 783.99]) // C5 → E5 → G5
}

/** Soft descending two-note on a wrong answer. */
export function playWrong(): void {
  tone([311.13, 233.08]) // E♭4 → B♭3
}
