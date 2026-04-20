/**
 * Paradise Lost speaker palette — the theological and dramatic voices
 * of the poem in their approved reading-surface colors.
 *
 * Design rationale:
 *   - God the Father is deliberately colorless (pure base text); Milton's
 *     theology refuses sensory description of the Father, and the palette
 *     honors that refusal by not decorating his speeches.
 *   - Satan is crimson with an ember undertone — royal, dangerous,
 *     seductive — because the poem's moral pedagogy depends on the
 *     reader experiencing his rhetorical magnetism and learning to see
 *     through it. The color does not preempt the annotations' work.
 *   - Mulciber / Mammon-as-architect carries a deliberate forge-orange,
 *     a palette echo of Vulcan/Hephaestus in the Classical Triad — a
 *     cross-epic callback that is Milton's, not ours.
 *   - Sin and Death are ash-gray and bone-white: allegorical rather than
 *     dramatic figures; their colors read as abstraction.
 *   - Adam is earth-brown with a gold undertone (Adamah — of the earth);
 *     Eve is dawn-rose with a green undertone (the garden she is
 *     identified with, and the dawn that is hers in Book V).
 *
 * Colors are chosen to work in both light and dark reader themes; the
 * `darkColor` field is the version used under `.dark` in tome.css.
 */

export interface ParadiseLostSpeaker {
  id: string
  name: string
  color: string       // light-theme color
  darkColor: string   // dark-theme color
  group: "narrator" | "heaven" | "hell" | "humanity" | "allegory"
  note?: string
}

export const PARADISE_LOST_SPEAKERS: ParadiseLostSpeaker[] = [
  // ── Narrator (Milton) ─────────────────────────────────────────────
  // Base text uses the foreground color; invocations are styled
  // separately (subtle indigo accent) via `data-pl-invocation`.
  { id: "Milton",    name: "Milton (narrator)", color: "inherit", darkColor: "inherit", group: "narrator",
    note: "Base text; invocations get a subtle indigo accent via data-pl-invocation." },

  // ── Heaven ─────────────────────────────────────────────────────────
  { id: "Father",    name: "God the Father",    color: "#44403C", darkColor: "#E7E5E4", group: "heaven",
    note: "Deliberately restrained — near-colorless, austere. Milton's theology refuses sensory description of the Father." },
  { id: "Son",       name: "The Son",           color: "#B8862C", darkColor: "#E8C778", group: "heaven",
    note: "Warm pale gold — Milton's vehicle of mercy and action." },
  { id: "Raphael",   name: "Raphael",           color: "#B8642E", darkColor: "#E09060", group: "heaven",
    note: "Warm rose-gold — the affable Archangel, the sociable visitor." },
  { id: "Michael",   name: "Michael",           color: "#4E5A6E", darkColor: "#9AA6BC", group: "heaven",
    note: "Steel with a gold undertone — martial, final." },
  { id: "Gabriel",   name: "Gabriel",           color: "#6B7A6E", darkColor: "#A8B8AC", group: "heaven" },
  { id: "Uriel",     name: "Uriel",             color: "#A8965A", darkColor: "#D4C080", group: "heaven" },
  { id: "Abdiel",    name: "Abdiel",            color: "#8A7A3C", darkColor: "#BFA860", group: "heaven",
    note: "The single loyal angel in Satan's camp — laurel gold." },
  { id: "Zephon",    name: "Zephon",            color: "#8C8A6A", darkColor: "#BAB690", group: "heaven" },
  { id: "Ithuriel",  name: "Ithuriel",          color: "#8E8962", darkColor: "#BEB788", group: "heaven" },
  { id: "Uzziel",    name: "Uzziel",            color: "#8E8E72", darkColor: "#BCBCA0", group: "heaven" },

  // ── Hell ───────────────────────────────────────────────────────────
  // Satan's crimson is the load-bearing palette choice in the book.
  { id: "Satan",     name: "Satan",             color: "#8B1A1A", darkColor: "#DD5252", group: "hell",
    note: "Crimson with ember undertone — royal, dangerous, seductive. Not visually ugly; the moral pedagogy depends on magnetism." },
  { id: "Beelzebub", name: "Beelzebub",         color: "#7A2828", darkColor: "#C85E5E", group: "hell" },
  { id: "Moloch",    name: "Moloch",            color: "#6B1818", darkColor: "#B84040", group: "hell",
    note: "Deeper crimson — violence." },
  { id: "Belial",    name: "Belial",            color: "#A86268", darkColor: "#D48A90", group: "hell",
    note: "Dusky rose — eloquence without substance." },
  { id: "Mammon",    name: "Mammon",            color: "#A05828", darkColor: "#D98A58", group: "hell",
    note: "Gold-leaning crimson / forge-orange — avarice, and the echo of Mulciber-as-Hephaestus." },
  { id: "Mulciber",  name: "Mulciber",          color: "#B8652A", darkColor: "#E09050", group: "hell",
    note: "Forge-orange — deliberate palette echo of Vulcan/Hephaestus in the Classical Triad." },
  { id: "Serpent",   name: "The Serpent (Satan)", color: "#3E6B3E", darkColor: "#70A070", group: "hell",
    note: "Sickly iridescent green shifting toward the crimson under it — signals the identity without collapsing it." },

  // ── Allegorical figures (Chaos, Night, Sin, Death) ────────────────
  { id: "Chaos",     name: "Chaos",             color: "#4E5568", darkColor: "#8E96AC", group: "allegory",
    note: "Slate." },
  { id: "Night",     name: "Night",             color: "#2C3048", darkColor: "#7078A0", group: "allegory",
    note: "Midnight blue." },
  { id: "Sin",       name: "Sin",               color: "#7A7770", darkColor: "#BAB6AD", group: "allegory",
    note: "Ash-gray — allegorical, not dramatic." },
  { id: "Death",     name: "Death",             color: "#9C988C", darkColor: "#D6D1C0", group: "allegory",
    note: "Bone-white — allegorical, not dramatic." },

  // ── Humanity ───────────────────────────────────────────────────────
  { id: "Adam",      name: "Adam",              color: "#7A5A2E", darkColor: "#C49860", group: "humanity",
    note: "Earth-brown with a gold undertone — Adamah, of the earth, made for it." },
  { id: "Eve",       name: "Eve",               color: "#A85E6E", darkColor: "#D88898", group: "humanity",
    note: "Dawn-rose; the green undertone in her dark-theme variant reaches toward the garden she is identified with." },
]

export const SPEAKERS_BY_ID: Record<string, ParadiseLostSpeaker> = Object.fromEntries(
  PARADISE_LOST_SPEAKERS.map((s) => [s.id, s]),
)

/** Legend ordering for the in-reader palette panel. */
export const LEGEND_GROUPS: { heading: string; ids: string[] }[] = [
  { heading: "Hell",        ids: ["Satan", "Beelzebub", "Moloch", "Belial", "Mammon", "Mulciber", "Serpent"] },
  { heading: "Heaven",      ids: ["Father", "Son", "Raphael", "Michael", "Gabriel", "Uriel", "Abdiel"] },
  { heading: "Humanity",    ids: ["Adam", "Eve"] },
  { heading: "Allegorical", ids: ["Sin", "Death", "Chaos", "Night"] },
]
