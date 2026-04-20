/**
 * Idylls of the King speaker palette — the voices of Tennyson's
 * Victorian Arthurian cycle in their approved reading-surface colors.
 *
 * Design rationale:
 *   - The narrator (Tennyson) is heathered gold with a green undertone —
 *     elegiac, autumnal, the tonal register of Victorian pastoral-
 *     medieval. Distinct from every other narrator palette in the
 *     catalog: Milton's absent (base text), Byron's ink-blue,
 *     Ariosto's Ferrara-red, Spenser's crimson, Beowulf's northern
 *     gold. Tennyson's voice is *autumnal* where all the others are
 *     some other season.
 *   - Arthur is white-gold with silver — sacred, distant, ideal. The
 *     "remote radiance" quality is load-bearing: Tennyson writes
 *     Arthur as the unfallen center around which the corruption of
 *     everyone else circles.
 *   - Guinevere is warm rose with silver — beautiful, fallible, the
 *     center of the moral catastrophe. The palette does *not* demonize
 *     her; Tennyson's portrait of her in her own idyll is one of the
 *     most sympathetic in Victorian poetry.
 *   - Lancelot is deep gold and shadow-crimson — noble, divided, the
 *     best of Arthur's knights and the central betrayer. Heroic-fallen.
 *   - Vivien's palette signals seductive-poisonous without editorial
 *     flattening — the critical tradition recognizes that "Merlin and
 *     Vivien" is the cycle's weakest character-handling; the color
 *     carries tone without parroting Tennyson's venom.
 *
 * Colors work in both light and dark reader themes; `darkColor` is
 * used under `.dark` in tome.css.
 */

export interface IdyllsOfTheKingSpeaker {
  id: string
  name: string
  color: string       // light-theme color
  darkColor: string   // dark-theme color
  group: "narrator" | "sovereignty" | "round-table" | "ladies" | "grail" | "villainy" | "numinous"
  note?: string
}

export const IDYLLS_OF_THE_KING_SPEAKERS: IdyllsOfTheKingSpeaker[] = [
  // ── Narrator (Tennyson) ───────────────────────────────────────────
  { id: "Tennyson", name: "Tennyson (narrator)", color: "#8C7A3A", darkColor: "#C6B273", group: "narrator",
    note: "Heathered gold with a green undertone — autumnal, elegiac. The tonal register of Victorian pastoral-medieval." },

  // ── Sovereignty: Arthur and the royal line ────────────────────────
  { id: "Arthur", name: "Arthur", color: "#B8A87A", darkColor: "#E8DAAE", group: "sovereignty",
    note: "White-gold with silver — sacred, distant, ideal. Remote radiance." },
  { id: "Guinevere", name: "Guinevere", color: "#B86878", darkColor: "#E09AA8", group: "sovereignty",
    note: "Warm rose with silver — beautiful, fallible. The palette must not demonize her." },
  { id: "Leodogran", name: "Leodogran", color: "#8E7E56", darkColor: "#BAAA88", group: "sovereignty",
    note: "Weathered gold — the old King of Cameliard, Guinevere's father." },
  { id: "Bellicent", name: "Bellicent", color: "#9A7264", darkColor: "#C8A294", group: "sovereignty",
    note: "Dusky rose — Arthur's half-sister, keeper of the mystery of his birth." },

  // ── Round Table: the knights ──────────────────────────────────────
  { id: "Lancelot", name: "Lancelot", color: "#9C5E2E", darkColor: "#D0946A", group: "round-table",
    note: "Deep gold and shadow-crimson — noble, divided, the best of Arthur's knights and the central betrayer." },
  { id: "Gareth", name: "Gareth", color: "#C8A050", darkColor: "#EACE80", group: "round-table",
    note: "Bright morning-gold — the young knight whose idyll is the cycle's most comic and hopeful." },
  { id: "Geraint", name: "Geraint", color: "#8B6038", darkColor: "#BA8E68", group: "round-table",
    note: "Bronze with shadow — jealous, loving, wronged by his own suspicion." },
  { id: "Balin", name: "Balin", color: "#8E4E3A", darkColor: "#C48676", group: "round-table",
    note: "Ember and ash — the tragic brother knight." },
  { id: "Balan", name: "Balan", color: "#7E5C4A", darkColor: "#B69684", group: "round-table",
    note: "Ash and ember — Balin's paired knight; the two die at each other's hands, unknowing." },
  { id: "Pelleas", name: "Pelleas", color: "#9E7838", darkColor: "#C8A46E", group: "round-table",
    note: "Wounded-gold shifting to bitter gray — from ideal youth to disillusioned cynic across his idyll." },
  { id: "Tristram", name: "Tristram", color: "#876B4A", darkColor: "#B69C7C", group: "round-table",
    note: "Worn gold — the tournament champion of the cycle's autumnal idyll." },
  { id: "Kay", name: "Kay", color: "#6B6E5E", darkColor: "#9EA294", group: "round-table",
    note: "Iron-gray — Arthur's sharp-tongued seneschal." },
  { id: "Bedivere", name: "Bedivere", color: "#7E7062", darkColor: "#AEA298", group: "round-table",
    note: "Weathered steel — Arthur's last companion at the end." },
  { id: "Gawain", name: "Gawain", color: "#9A7A48", darkColor: "#C8A878", group: "round-table" },
  { id: "Modred", name: "Modred", color: "#4E5852", darkColor: "#8A968E", group: "round-table",
    note: "Cold iron and venom-green — the traitor. Colorless-malevolent." },

  // ── Ladies ─────────────────────────────────────────────────────────
  { id: "Elaine", name: "Elaine of Astolat", color: "#C6B8A6", darkColor: "#E8DCC4", group: "ladies",
    note: "Pearl with dawn-gold — the Lily Maid, tragic purity. Luminous-mortal." },
  { id: "Enid", name: "Enid", color: "#C68872", darkColor: "#E8B49E", group: "ladies",
    note: "Warm dawn-rose with earth — the faithful wife of Geraint." },
  { id: "Lynette", name: "Lynette", color: "#B29AB0", darkColor: "#D4C0D6", group: "ladies",
    note: "Sharp silver-rose — Gareth's scornful lady who comes to love him. Shifts subtly across the idyll from cold to warmer." },
  { id: "Ettarre", name: "Ettarre", color: "#A66882", darkColor: "#D096AA", group: "ladies",
    note: "Harsh rose and ice — the lady who scorns Pelleas. The cycle's figure of feminine cruelty." },
  { id: "Isolt", name: "Isolt", color: "#8F6A74", darkColor: "#C49AA4", group: "ladies" },
  { id: "Yniol", name: "Yniol", color: "#8E6E52", darkColor: "#BE9E82", group: "ladies",
    note: "Old earth — Enid's dispossessed father." },

  // ── Grail knights ─────────────────────────────────────────────────
  { id: "Galahad", name: "Galahad", color: "#D8D4C0", darkColor: "#F0ECD8", group: "grail",
    note: "Pure white-silver, luminous — the spotless Grail knight. The most explicitly Christian figure in the cycle." },
  { id: "Percivale", name: "Percivale", color: "#9E9380", darkColor: "#C6BBA8", group: "grail",
    note: "Silver with earth-brown — the Grail knight who fails partially; becomes the narrator of 'The Holy Grail.'" },
  { id: "Bors", name: "Bors", color: "#8E7A4E", darkColor: "#BEA87A", group: "grail",
    note: "Steady bronze and gold — the practical Grail knight who succeeds by humility." },
  { id: "AmbrosiusTheMonk", name: "Ambrosius (the monk)", color: "#796E54", darkColor: "#AC9E80", group: "grail",
    note: "Clerical brown — the listening monk who receives Percivale's narration." },

  // ── Villainy: Merlin's fate, Vivien, dark women ───────────────────
  { id: "Merlin", name: "Merlin", color: "#6C7A96", darkColor: "#A8B6D2", group: "numinous",
    note: "Silver with storm-blue — sage, foreseen, fated. Already old and already doomed by the opening of his idyll." },
  { id: "Vivien", name: "Vivien", color: "#7A8860", darkColor: "#B0C094", group: "villainy",
    note: "Sickly-iridescent green shading to rose — seductive-poisonous. Palette signals tone without parroting Tennyson's venom." },
  { id: "MarkOfCornwall", name: "Mark of Cornwall", color: "#4A4E46", darkColor: "#848A80", group: "villainy",
    note: "Dark iron — Tristram's treacherous uncle; the cuckolded king who murders the adulterer." },

  // ── Numinous feminine — the Ladies of the Lake, the Three Queens ─
  { id: "LadyOfTheLake", name: "The Lady of the Lake", color: "#7A98A8", darkColor: "#B4CCDE", group: "numinous",
    note: "Water-pearl and silver — the numinous-feminine that gives the sword and receives it back." },
  { id: "Nimue", name: "Nimuë", color: "#84A4A8", darkColor: "#BCD6DA", group: "numinous",
    note: "Lake-silver — the mystic figure adjacent to Merlin's fate." },
  { id: "ThreeQueens", name: "The Three Queens", color: "#8994A8", darkColor: "#BEC8DC", group: "numinous",
    note: "Pale water-pearl — the mourning queens of the Avalon barge." },
]

export const SPEAKERS_BY_ID: Record<string, IdyllsOfTheKingSpeaker> =
  Object.fromEntries(IDYLLS_OF_THE_KING_SPEAKERS.map((s) => [s.id, s]))

/** Groupings for the palette legend UI. */
export const LEGEND_GROUPS: Array<{ id: string; label: string; note: string }> = [
  { id: "narrator",     label: "Narrator",                 note: "Tennyson — elegiac, autumnal." },
  { id: "sovereignty",  label: "Sovereignty",              note: "Arthur's remote radiance; Guinevere's warm rose; the royal line." },
  { id: "round-table",  label: "Round Table",              note: "The knights — heroic gold spanning morning (Gareth) through ash (Balin) to venom (Modred)." },
  { id: "ladies",       label: "Ladies",                   note: "The women of the cycle — Elaine's pearl, Enid's dawn-rose, Ettarre's harsh rose-ice." },
  { id: "grail",        label: "Grail knights",            note: "Galahad's white-silver; Percivale's silver-earth; Bors's bronze." },
  { id: "villainy",     label: "Corruption",               note: "Vivien's iridescent poison; Mark's dark iron. The cycle's moral unmaking." },
  { id: "numinous",     label: "The numinous",             note: "Merlin's storm-silver, the Lady of the Lake, the Three Queens." },
]
