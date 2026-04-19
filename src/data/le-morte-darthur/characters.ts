/**
 * Le Morte d'Arthur — curated Cast of Characters for the front-matter page.
 *
 * Not a concordance — a ~30-name orientation list for new readers, grouped
 * by faction/arc. One sentence each. Rendered by the Cast-of-Characters
 * unlockable front-matter UI (PART 7 deliverable).
 */

export type CharacterGroup =
  | "arthur-and-court"
  | "grail-knights"
  | "enemies"
  | "cornish-cycle"
  | "ladies-and-sorceresses"

export interface MaloryCharacter {
  id: string
  name: string
  group: CharacterGroup
  gloss: string
}

export const MALORY_CHARACTERS: readonly MaloryCharacter[] = [
  // ── Arthur's court ───────────────────────────────────────────────────
  { id: "arthur",     name: "King Arthur",          group: "arthur-and-court", gloss: "The king; center of the Round Table and of the tragedy." },
  { id: "launcelot",  name: "Sir Launcelot du Lake", group: "arthur-and-court", gloss: "Peerless knight; Guenever's lover; Galahad's father." },
  { id: "gawain",     name: "Sir Gawain",           group: "arthur-and-court", gloss: "Arthur's nephew; the grudge that drives the last war." },
  { id: "kay",        name: "Sir Kay",              group: "arthur-and-court", gloss: "Arthur's foster-brother and steward; tongue sharper than his sword." },
  { id: "bedivere",   name: "Sir Bedivere",         group: "arthur-and-court", gloss: "The last knight at Arthur's side; returns Excalibur to the lake." },
  { id: "gareth",     name: "Sir Gareth of Orkney", group: "arthur-and-court", gloss: "Gawain's youngest brother; the Fair-Unknown; killed by Launcelot by mischance — the grief that breaks Gawain." },
  { id: "bors",       name: "Sir Bors de Ganis",    group: "arthur-and-court", gloss: "Launcelot's cousin; the married Grail-knight; the moral exemplar." },
  { id: "pellinore",  name: "King Pellinore",       group: "arthur-and-court", gloss: "Arthur's early ally; hunter of the Questing Beast; Lamorak's father." },
  { id: "lamorak",    name: "Sir Lamorak",          group: "arthur-and-court", gloss: "Arthur's third-greatest knight after Launcelot and Tristram; killed by Gawain's brothers." },
  { id: "dinadan",    name: "Sir Dinadan",          group: "arthur-and-court", gloss: "The court's ironist; mocks chivalric excess from within — a proto-Cervantean voice." },

  // ── The Grail knights ────────────────────────────────────────────────
  { id: "galahad",    name: "Sir Galahad",          group: "grail-knights",    gloss: "Launcelot's son by Elaine of Corbenic; the perfect knight; translated at Sarras." },
  { id: "percivale",  name: "Sir Percivale",        group: "grail-knights",    gloss: "The second Grail knight; dies a hermit at Sarras." },

  // ── The enemies ──────────────────────────────────────────────────────
  { id: "morgan",     name: "Morgan le Fay",        group: "enemies",          gloss: "Arthur's half-sister; sorceress; the persistent antagonist through the first half." },
  { id: "mordred",    name: "Sir Mordred",          group: "enemies",          gloss: "Arthur's son by Morgause; the regent-turned-usurper; killer and killed." },
  { id: "agravaine",  name: "Sir Agravaine",        group: "enemies",          gloss: "Gawain's brother; engineers the exposure of Launcelot in the queen's chamber." },
  { id: "meliagrance",name: "Sir Meliagrance",      group: "enemies",          gloss: "Abducts the queen; Launcelot slays him as the 'knight of the cart'." },

  // ── The Cornish cycle ────────────────────────────────────────────────
  { id: "tristram",   name: "Sir Tristram",         group: "cornish-cycle",    gloss: "Cornish prince; the second-greatest knight after Launcelot; lover of Isoud." },
  { id: "isoud",      name: "La Beale Isoud",       group: "cornish-cycle",    gloss: "Queen of Cornwall; Tristram's lover; forced wife of Mark." },
  { id: "mark",       name: "King Mark",           group: "cornish-cycle",    gloss: "King of Cornwall; Tristram's uncle and persecutor; Malory's most consistent villain." },
  { id: "palomides",  name: "Sir Palomides",        group: "cornish-cycle",    gloss: "Saracen knight; loves Isoud hopelessly; Tristram's rival and friend." },

  // ── The ladies and sorceresses ───────────────────────────────────────
  { id: "guenever",   name: "Queen Guenever",       group: "ladies-and-sorceresses", gloss: "The queen; Launcelot's lover; saved from the fire, returned by the pope's peace." },
  { id: "nyneve",     name: "Nyneve",               group: "ladies-and-sorceresses", gloss: "The Damsel of the Lake who entombs Merlin; later a benign guardian of the court." },
  { id: "elaine-astolat", name: "Elaine of Astolat", group: "ladies-and-sorceresses", gloss: "The Fair Maid who loves Launcelot; dies; her body drifts to Camelot on a barge. (Tennyson's Lady of Shalott.)" },
  { id: "elaine-corbenic", name: "Elaine of Corbenic", group: "ladies-and-sorceresses", gloss: "A different Elaine. Launcelot begets Galahad on her by enchantment; drives him briefly mad." },
  { id: "lady-of-lake", name: "The Lady of the Lake", group: "ladies-and-sorceresses", gloss: "Gives Arthur Excalibur; multiple bearers of the title across the work." },
  { id: "morgause",   name: "Queen Morgause",       group: "ladies-and-sorceresses", gloss: "Gawain and Mordred's mother; Arthur begets Mordred on her unawares (she is his half-sister)." },
] as const
