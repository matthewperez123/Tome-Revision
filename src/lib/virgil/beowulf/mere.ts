import type { Annotation } from "../types"

// ── Beowulf Opus Cluster C — The Mere (Fitts XX–XXIV) ──────────────────
// The second monster-fight, and the poem's most atmospheric stretch.
// Grendel's mother's revenge-raid on Heorot, Hrothgar's description of
// the haunted mere, Beowulf's descent, the failure of Hrunting, the
// giants' sword on the wall, the beheading, the melting blade, the rise
// back to the surface bearing the hilt.
// Anchors: ch-21 (XX) through ch-25 (XXIV).

export const BEOWULF_MERE: Annotation[] = [
  {
    id: "beowulf-20-mothers-revenge",
    bookId: "beowulf",
    chapterNumber: 21,
    anchorText: "The Mother of Grendel",
    anchorOccurrence: 1,
    title: "Grendel's mother: grief weaponized",
    quotedPassage: "They sank then to slumber. With sorrow one paid for / His evening repose, as often betid them / While Grendel was holding the gold-bedecked palace…",
    passageReference: "Fitt XX, opening",
    commentary: `The second monster arrives not out of predation but out of grief. Grendel's mother — unnamed in the poem, only ever *Grendles mōdor* — comes to Heorot to take revenge for her son. She kills exactly one man: Æschere, Hrothgar's dearest counselor. She is not hunting indiscriminately like Grendel. She is operating under the same Germanic logic of feud-vengeance that governs every named warrior-society in the poem. She takes one life for one life, as the *wergild* (man-price) code requires, and she leaves.

This distinction matters interpretively. Grendel is appetite, an exile's malevolence toward the human fellowship that excluded him. His mother is *justice*, or the nearest thing to justice that the pre-Christian feud-world recognizes. Tolkien's reading — which has become canonical — is that the mother is the *more formidable* adversary of the two, precisely because her violence is not monstrous but *lawful*. She is what the Germanic feud-world looks like when it meets an implacable avenger.

That she is also described with feminine pronouns, but fights with the tactics of a warrior, strains the medieval grammatical categories of the poem. Her very existence asks: whose grief counts, in a society whose morality is built on vengeance?`,
    crossReferences: [],
    tags: ["philosophical", "mythological", "historical"],
  },
  {
    id: "beowulf-21-the-mere",
    bookId: "beowulf",
    chapterNumber: 22,
    anchorText: "Hrothgar rejoined, helm of the Scyldings",
    anchorOccurrence: 1,
    title: "Hrothgar describes the mere: the poem's most haunted passage",
    quotedPassage: "Hrothgar rejoined, helm of the Scyldings: / 'Ask not of joyance! Grief is renewed to / The folk of the Danemen. Dead is Æschere…'",
    passageReference: "Fitt XXI",
    commentary: `Hrothgar's description of the mere — the underwater lair where Grendel and his mother live — is one of the most atmospherically intense passages in all of Old English literature. He tells Beowulf that the mere is deep and dark, surrounded by cliffs and black trees whose roots hang over the water. Deer pursued by hunters will die at the edge rather than swim in. At night, men sometimes see a strange fire burning on the surface of the water.

Scholars have debated the source for centuries. The description resembles one in an earlier apocryphal text, the *Visio Sancti Pauli*, which describes a hellish landscape with fiery waters. The Beowulf-poet may have known that text; he may have borrowed the landscape. Or the horror of the mere may be indigenous Germanic imagination, the kind of pre-Christian fear of drowning-places that the Christian frame grafts onto.

What the passage does in the poem is convert Heorot's warm interior into a contrasting image: everything the hall is, the mere is not. The hall is bright, loud, communal, above ground. The mere is dark, silent, solitary, below water. Grendel's kin live in the exact opposite of civilization, and Beowulf is about to go down into it — into the *antithesis* of the hall he has just defended.`,
    crossReferences: [],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "beowulf-22-hrunting-fails",
    bookId: "beowulf",
    chapterNumber: 23,
    anchorText: "Beowulf answered, Ecgtheow’s son",
    anchorOccurrence: 1,
    title: "Hrunting — Unferth's sword — fails",
    quotedPassage: "Beowulf answered, Ecgtheow's son: 'Grieve not, O wise one! for each it is better, / His friend to avenge than with vehemence wail him.'",
    passageReference: "Fitt XXII",
    commentary: `Before the descent, a remarkable moment of reconciliation: Unferth — the thane who insulted Beowulf at the feast before the Grendel fight — gives him his famous sword *Hrunting*, an heirloom weapon reputed to have never failed its wielder. This is the older, prouder man acknowledging the younger hero's worth. Warrior-culture rhetoric absorbed and passed the torch.

In the underwater fight with Grendel's mother, Hrunting fails. Beowulf strikes the mother's head with its blade and the sword rings harmlessly. It is the first time Hrunting has ever failed in battle, and the moment is narratively devastating: this is the poem telling us that *no inherited virtue is enough* for the depths. The heirlooms, the boasts, the Geatish strength — none of it works here. Beowulf must find something new.

This is also the moment where the poem begins its long argument with the heroic code itself. A heroic weapon is supposed to carry its lineage's virtue. Hrunting is famous, well-forged, well-blooded. It fails. What, the poem is beginning to ask, happens when virtue runs out? That question, asked in small here, will be asked again — with the dragon, with the kingdom, with Beowulf's own life — at enormous scale in the final third.`,
    crossReferences: [],
    tags: ["philosophical", "mythological"],
  },
  {
    id: "beowulf-23-giants-sword",
    bookId: "beowulf",
    chapterNumber: 25,
    anchorText: "ancient giant-sword",
    anchorOccurrence: 1,
    title: "The giants' sword: a weapon older than the monsters",
    quotedPassage: "Then he saw mid the war-gems a weapon of victory, / An ancient giant-sword, of edges a-doughty, / Glory of warriors: of weapons 'twas choicest.",
    passageReference: "Fitt XXIV",
    commentary: `Beowulf, losing the fight, reaches up — we are underwater, in the mother's lair — and sees hanging on the wall an enormous sword. The poet tells us this is an *eald-sweord eotenisc*: an "ancient-sword giant-work," forged before the biblical Flood by the race of giants (in the poem's frame, descendants of Cain like Grendel himself). It is so heavy that no ordinary warrior can lift it. Beowulf can.

With it he kills Grendel's mother, and then — the poem is very specific here — walks to the corpse of Grendel, which has been rotting in the lair since his wounded flight a few days earlier, and *beheads him*. This is the kill the Grendel fight in Heorot did not have. It is posthumous, ceremonial, corpse-vengeance. The poem reports it in flat, practical prose, the way a hunting party reports stripping a carcass.

Then the sword melts. The poet tells us the blade dissolved in the heat of Grendel's venomous blood like an ice-dagger in spring thaw — another of the poem's extraordinary concrete images. Beowulf returns to the surface with only the *hilt* of the giants' sword, which Hrothgar will later examine and read the runes engraved on it. The blade is gone; what remains is the grip and the script. History with its cutting edge melted off.`,
    crossReferences: [],
    tags: ["mythological", "literary-influence", "linguistic"],
  },
  {
    id: "beowulf-24-emerges-with-hilt",
    bookId: "beowulf",
    chapterNumber: 25,
    anchorText: "weapon of victory",
    anchorOccurrence: 1,
    title: "Rising with the hilt",
    quotedPassage: "Then he saw mid the war-gems a weapon of victory…",
    passageReference: "Fitt XXIV",
    commentary: `Beowulf rises out of the mere at dawn, bearing Grendel's head and the melted-down hilt of the giants' sword. The Danes who were keeping watch above — many of whom had given him up for dead, seeing the water boiling with gore — see the hero breach the surface.

Two details of the return matter. First: the Geats (Beowulf's own men, not the Danes) have *stayed at the mere's edge the whole time*, loyal past hope. This is a small act of the comitatus code — the warrior-bond between lord and thane — quietly honored. Second: Grendel's severed head is so large it requires four Geats, each holding a corner, to carry it on a spear-shaft back to Heorot. The poem's images of Grendel's body have been growing larger and more specific as the creature moves from threat to corpse.

When the procession arrives at Heorot, Hrothgar examines the giant-sword's hilt and reads the runes on it — and is seized, spontaneously, with a speech. That speech, the next fitt, is the poem's moral heart. The mere sequence ends here; Hrothgar's sermon begins.`,
    crossReferences: [],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "beowulf-20-wergild",
    bookId: "beowulf",
    chapterNumber: 21,
    anchorText: "Dead is Aeschere",
    anchorOccurrence: 1,
    title: "Æschere and wergild: the feud economy",
    quotedPassage: "Dead is Æschere, of Yrmenlaf / The elder brother…",
    passageReference: "Fitt XXI",
    commentary: `Hrothgar's lament for Æschere introduces the concept of *wergild* — literally "man-price," the legal compensation owed for a killing in Germanic society. In the feud economy, every human life has a set price in gold; the killer (or his kin-group) pays it to the victim's kin-group, and peace is restored. This is a legal-moral system older than Christianity, and the poem's social world is organized around it.

Grendel and his mother cannot be reached by wergild. That is what makes them monstrous in the specific legal sense: they are outside the economy. You cannot buy off their grievance because they have no kin-group to negotiate with, no gold that means anything to them, no price. This is a technical-legal dimension of their monstrosity that modern readers miss. The poet's audience would have recognized at once that a feud with Grendel-kin *cannot end*, because the feud-peace machinery has no traction.

The Freawaru-Ingeld digression Beowulf narrates later, at Hygelac's court, is about the limits of this system even among humans — a Danish princess married to a Heathobard prince to end a feud, and the feud breaking out anyway when an old man sees his enemy's son wearing his dead companion's sword. Wergild works until it doesn't. The monsters are just the clearest case of the outside-the-system killing that wergild cannot settle.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },
]
