/**
 * Per-work configuration for Shakespeare ingestion.
 *
 * Each play registered here can be processed by ingest-shakespeare.ts.
 * The shape is intentionally small — it only encodes what the parser
 * can't infer from the Standard Ebooks HTML (scene count/mapping, scene
 * location titles, metadata fields, and the tier-1 list).
 */

/**
 * A "scene" entry maps a chapter to an (act, scene) pair.
 * A "chorus" entry maps a chapter to a free-form section id (e.g. the
 * opening prologue or a mid-play chorus). Chorus entries are rendered
 * as standalone TOC rows, not folded into any act.
 */
export type SceneMapEntry =
  | { kind?: "scene"; chapterIndex: number; act: number; scene: number }
  | {
      kind: "chorus";
      chapterIndex: number;
      sectionId: string;      // e.g. "romeo_and_juliet_prologue"
      sceneTitle: string;     // e.g. "Prologue" (displayed in TOC)
      afterAct?: number;      // TOC placement: 0 = before Act I, N = after Act N's title
      afterAllActs?: boolean; // TOC placement: true = emit after final act's last scene (e.g. Henry V Epilogue)
    };

export interface WorkConfig {
  workId: string;
  title: string;
  author: string;
  year: number;
  sourceUrl: string;
  tradition?: string;
  difficulty?: string;
  sceneMap: SceneMapEntry[];
  sceneTitles: Record<string, string>; // key: "act_scene"
  tier1Sections?: string[]; // section IDs routed to Opus 4.6 at annotation time
  /**
   * Optional note about textual edition — surfaced in _meta.json and the
   * `works` row for plays with complex textual histories (Lear's Q1/F1
   * problem being the canonical case).
   */
  editionNote?: string;
  /**
   * Opt-in parser behaviour for Standard Ebooks sources that use <td/>
   * (empty speaker) continuation rows for the previous speaker's speech,
   * AND italic stage directions that don't begin with a recognised stage
   * verb (e.g. Julius Caesar 3.1's "Casca first, then the other Conspirators
   * and Marcus Brutus stab Caesar"). Off by default so prior plays keep
   * their established line numbering. Turn on for any newly-ingested play
   * whose SE source exhibits these patterns.
   */
  strictContinuationRows?: boolean;
}

const HAMLET: WorkConfig = {
  workId: "hamlet",
  title: "Hamlet",
  author: "William Shakespeare",
  year: 1601,
  sourceUrl: "https://standardebooks.org/ebooks/william-shakespeare/hamlet",
  sceneMap: [
    { chapterIndex: 2, act: 1, scene: 1 },
    { chapterIndex: 3, act: 1, scene: 2 },
    { chapterIndex: 4, act: 1, scene: 3 },
    { chapterIndex: 5, act: 1, scene: 4 },
    { chapterIndex: 6, act: 1, scene: 5 },
    { chapterIndex: 8, act: 2, scene: 1 },
    { chapterIndex: 9, act: 2, scene: 2 },
    { chapterIndex: 11, act: 3, scene: 1 },
    { chapterIndex: 12, act: 3, scene: 2 },
    { chapterIndex: 13, act: 3, scene: 3 },
    { chapterIndex: 14, act: 3, scene: 4 },
    { chapterIndex: 16, act: 4, scene: 1 },
    { chapterIndex: 17, act: 4, scene: 2 },
    { chapterIndex: 18, act: 4, scene: 3 },
    { chapterIndex: 19, act: 4, scene: 4 },
    { chapterIndex: 20, act: 4, scene: 5 },
    { chapterIndex: 21, act: 4, scene: 6 },
    { chapterIndex: 22, act: 4, scene: 7 },
    { chapterIndex: 24, act: 5, scene: 1 },
    { chapterIndex: 25, act: 5, scene: 2 },
  ],
  sceneTitles: {
    "1_1": "Elsinore. A platform before the castle",
    "1_2": "A room of state in the castle",
    "1_3": "A room in Polonius' house",
    "1_4": "The platform",
    "1_5": "Another part of the platform",
    "2_1": "A room in Polonius' house",
    "2_2": "A room in the castle",
    "3_1": "A room in the castle",
    "3_2": "A hall in the castle",
    "3_3": "A room in the castle",
    "3_4": "The Queen's closet",
    "4_1": "A room in the castle",
    "4_2": "Another room in the castle",
    "4_3": "Another room in the castle",
    "4_4": "A plain in Denmark",
    "4_5": "Elsinore. A room in the castle",
    "4_6": "Another room in the castle",
    "4_7": "Another room in the castle",
    "5_1": "A churchyard",
    "5_2": "A hall in the castle",
  },
  tier1Sections: [
    "hamlet_act1_scene5",
    "hamlet_act3_scene1",
    "hamlet_act3_scene4",
    "hamlet_act5_scene1",
    "hamlet_act5_scene2",
  ],
};

const OTHELLO: WorkConfig = {
  workId: "othello",
  title: "Othello",
  author: "William Shakespeare",
  year: 1603,
  sourceUrl: "https://standardebooks.org/ebooks/william-shakespeare/othello",
  // Chapter layout in public/content/othello/:
  //   ch-0  Dramatis Personae
  //   ch-1  Act I         (title page)
  //   ch-2..4  1.1, 1.2, 1.3
  //   ch-5  Act II        (title page)
  //   ch-6..8  2.1, 2.2, 2.3
  //   ch-9  Act III       (title page)
  //   ch-10..13 3.1, 3.2, 3.3, 3.4
  //   ch-14 Act IV        (title page)
  //   ch-15..17 4.1, 4.2, 4.3
  //   ch-18 Act V         (title page)
  //   ch-19..20 5.1, 5.2
  sceneMap: [
    { chapterIndex: 2, act: 1, scene: 1 },
    { chapterIndex: 3, act: 1, scene: 2 },
    { chapterIndex: 4, act: 1, scene: 3 },
    { chapterIndex: 6, act: 2, scene: 1 },
    { chapterIndex: 7, act: 2, scene: 2 },
    { chapterIndex: 8, act: 2, scene: 3 },
    { chapterIndex: 10, act: 3, scene: 1 },
    { chapterIndex: 11, act: 3, scene: 2 },
    { chapterIndex: 12, act: 3, scene: 3 },
    { chapterIndex: 13, act: 3, scene: 4 },
    { chapterIndex: 15, act: 4, scene: 1 },
    { chapterIndex: 16, act: 4, scene: 2 },
    { chapterIndex: 17, act: 4, scene: 3 },
    { chapterIndex: 19, act: 5, scene: 1 },
    { chapterIndex: 20, act: 5, scene: 2 },
  ],
  sceneTitles: {
    "1_1": "Venice. A street",
    "1_2": "Another street",
    "1_3": "A council-chamber",
    "2_1": "A seaport in Cyprus. An open place near the quay",
    "2_2": "A street",
    "2_3": "A hall in the castle",
    "3_1": "Before the castle",
    "3_2": "A room in the castle",
    "3_3": "The garden of the castle",
    "3_4": "Before the castle",
    "4_1": "Cyprus. Before the castle",
    "4_2": "A room in the castle",
    "4_3": "Another room in the castle",
    "5_1": "Cyprus. A street",
    "5_2": "A bedchamber in the castle",
  },
  tier1Sections: [
    "othello_act1_scene3",
    "othello_act3_scene3",
    "othello_act4_scene1",
    "othello_act5_scene2",
  ],
};

const MACBETH: WorkConfig = {
  workId: "macbeth",
  title: "Macbeth",
  author: "William Shakespeare",
  year: 1606,
  sourceUrl: "https://standardebooks.org/ebooks/william-shakespeare/macbeth",
  // Chapter layout in public/content/macbeth/:
  //   ch-0  Dramatis Personae
  //   ch-1  Act I (title page)
  //   ch-2..8   1.1..1.7 (7 scenes)
  //   ch-9  Act II (title)
  //   ch-10..13 2.1..2.4 (4 scenes)
  //   ch-14 Act III (title)
  //   ch-15..20 3.1..3.6 (6 scenes)
  //   ch-21 Act IV (title)
  //   ch-22..24 4.1..4.3 (3 scenes)
  //   ch-25 Act V (title)
  //   ch-26..33 5.1..5.8 (8 scenes)
  // Total: 7+4+6+3+8 = 28 scenes
  sceneMap: [
    { chapterIndex: 2, act: 1, scene: 1 },
    { chapterIndex: 3, act: 1, scene: 2 },
    { chapterIndex: 4, act: 1, scene: 3 },
    { chapterIndex: 5, act: 1, scene: 4 },
    { chapterIndex: 6, act: 1, scene: 5 },
    { chapterIndex: 7, act: 1, scene: 6 },
    { chapterIndex: 8, act: 1, scene: 7 },
    { chapterIndex: 10, act: 2, scene: 1 },
    { chapterIndex: 11, act: 2, scene: 2 },
    { chapterIndex: 12, act: 2, scene: 3 },
    { chapterIndex: 13, act: 2, scene: 4 },
    { chapterIndex: 15, act: 3, scene: 1 },
    { chapterIndex: 16, act: 3, scene: 2 },
    { chapterIndex: 17, act: 3, scene: 3 },
    { chapterIndex: 18, act: 3, scene: 4 },
    { chapterIndex: 19, act: 3, scene: 5 },
    { chapterIndex: 20, act: 3, scene: 6 },
    { chapterIndex: 22, act: 4, scene: 1 },
    { chapterIndex: 23, act: 4, scene: 2 },
    { chapterIndex: 24, act: 4, scene: 3 },
    { chapterIndex: 26, act: 5, scene: 1 },
    { chapterIndex: 27, act: 5, scene: 2 },
    { chapterIndex: 28, act: 5, scene: 3 },
    { chapterIndex: 29, act: 5, scene: 4 },
    { chapterIndex: 30, act: 5, scene: 5 },
    { chapterIndex: 31, act: 5, scene: 6 },
    { chapterIndex: 32, act: 5, scene: 7 },
    { chapterIndex: 33, act: 5, scene: 8 },
  ],
  sceneTitles: {
    "1_1": "A desert place",
    "1_2": "A camp near Forres",
    "1_3": "A heath near Forres",
    "1_4": "Forres. The palace",
    "1_5": "Inverness. Macbeth's castle",
    "1_6": "Before Macbeth's castle",
    "1_7": "Macbeth's castle",
    "2_1": "Court of Macbeth's castle",
    "2_2": "The same",
    "2_3": "The same",
    "2_4": "Outside Macbeth's castle",
    "3_1": "Forres. The palace",
    "3_2": "The palace",
    "3_3": "A park near the palace",
    "3_4": "Hall in the palace",
    "3_5": "A Heath",
    "3_6": "Forres. The palace",
    "4_1": "A cavern. In the middle, a boiling cauldron",
    "4_2": "Fife. Macduff's castle",
    "4_3": "England. Before the King's palace",
    "5_1": "Dunsinane. Ante-room in the castle",
    "5_2": "The country near Dunsinane",
    "5_3": "Dunsinane. A room in the castle",
    "5_4": "Country near Birnam wood",
    "5_5": "Dunsinane. Within the castle",
    "5_6": "Dunsinane. Before the castle",
    "5_7": "Another part of the field",
    "5_8": "Another part of the field",
  },
  tier1Sections: [
    "macbeth_act1_scene3",
    "macbeth_act1_scene5",
    "macbeth_act1_scene7",
    "macbeth_act2_scene1",
    "macbeth_act2_scene2",
    "macbeth_act5_scene1",
    "macbeth_act5_scene5",
  ],
};

const ROMEO_AND_JULIET: WorkConfig = {
  workId: "romeo-and-juliet",
  title: "Romeo and Juliet",
  author: "William Shakespeare",
  year: 1597,
  sourceUrl: "https://standardebooks.org/ebooks/william-shakespeare/romeo-and-juliet",
  // Chapter layout in public/content/romeo-and-juliet/:
  //   ch-0  Dramatis Personae
  //   ch-1  Prologue (CHORUS sonnet — "Two households, both alike in dignity")
  //   ch-2  Act I (title page)
  //   ch-3..7  1.1..1.5
  //   ch-8  Act II (title) + embedded CHORUS sonnet ("Now old desire doth in his death-bed lie")
  //   ch-9..14  2.1..2.6
  //   ch-15 Act III (title)
  //   ch-16..20 3.1..3.5
  //   ch-21 Act IV (title)
  //   ch-22..26 4.1..4.5
  //   ch-27 Act V (title)
  //   ch-28..30 5.1..5.3
  // Totals: 24 scenes + 2 choric sonnets = 26 sections
  sceneMap: [
    { kind: "chorus", chapterIndex: 1, sectionId: "romeo_and_juliet_prologue", sceneTitle: "Prologue", afterAct: 0 },
    { chapterIndex: 3, act: 1, scene: 1 },
    { chapterIndex: 4, act: 1, scene: 2 },
    { chapterIndex: 5, act: 1, scene: 3 },
    { chapterIndex: 6, act: 1, scene: 4 },
    { chapterIndex: 7, act: 1, scene: 5 },
    { kind: "chorus", chapterIndex: 8, sectionId: "romeo_and_juliet_act2_chorus", sceneTitle: "Chorus", afterAct: 2 },
    { chapterIndex: 9, act: 2, scene: 1 },
    { chapterIndex: 10, act: 2, scene: 2 },
    { chapterIndex: 11, act: 2, scene: 3 },
    { chapterIndex: 12, act: 2, scene: 4 },
    { chapterIndex: 13, act: 2, scene: 5 },
    { chapterIndex: 14, act: 2, scene: 6 },
    { chapterIndex: 16, act: 3, scene: 1 },
    { chapterIndex: 17, act: 3, scene: 2 },
    { chapterIndex: 18, act: 3, scene: 3 },
    { chapterIndex: 19, act: 3, scene: 4 },
    { chapterIndex: 20, act: 3, scene: 5 },
    { chapterIndex: 22, act: 4, scene: 1 },
    { chapterIndex: 23, act: 4, scene: 2 },
    { chapterIndex: 24, act: 4, scene: 3 },
    { chapterIndex: 25, act: 4, scene: 4 },
    { chapterIndex: 26, act: 4, scene: 5 },
    { chapterIndex: 28, act: 5, scene: 1 },
    { chapterIndex: 29, act: 5, scene: 2 },
    { chapterIndex: 30, act: 5, scene: 3 },
  ],
  sceneTitles: {
    "1_1": "Verona. A public place",
    "1_2": "A street",
    "1_3": "A room in Capulet's house",
    "1_4": "A street",
    "1_5": "A hall in Capulet's house",
    "2_1": "A lane by the wall of Capulet's orchard",
    "2_2": "Capulet's orchard",
    "2_3": "Friar Laurence's cell",
    "2_4": "A street",
    "2_5": "Capulet's orchard",
    "2_6": "Friar Laurence's cell",
    "3_1": "A public place",
    "3_2": "Capulet's orchard",
    "3_3": "Friar Laurence's cell",
    "3_4": "A room in Capulet's house",
    "3_5": "Capulet's orchard",
    "4_1": "Friar Laurence's cell",
    "4_2": "Hall in Capulet's house",
    "4_3": "Juliet's chamber",
    "4_4": "Hall in Capulet's house",
    "4_5": "Juliet's chamber",
    "5_1": "Mantua. A street",
    "5_2": "Friar Laurence's cell",
    "5_3": "A churchyard; in it a tomb belonging to the Capulets",
  },
  tier1Sections: [
    "romeo_and_juliet_prologue",
    "romeo_and_juliet_act1_scene5",
    "romeo_and_juliet_act2_scene2",
    "romeo_and_juliet_act3_scene1",
    "romeo_and_juliet_act3_scene5",
    "romeo_and_juliet_act5_scene3",
  ],
};

const KING_LEAR: WorkConfig = {
  workId: "king-lear",
  title: "King Lear",
  author: "William Shakespeare",
  year: 1606,
  sourceUrl: "https://standardebooks.org/ebooks/william-shakespeare/king-lear",
  // Chapter layout in public/content/king-lear/:
  //   ch-0  Dramatis Personae
  //   ch-1  Act I (title)
  //   ch-2..6  1.1..1.5
  //   ch-7  Act II (title)
  //   ch-8..11  2.1..2.4
  //   ch-12 Act III (title)
  //   ch-13..19 3.1..3.7   (includes Q1-only 3.6 mock trial)
  //   ch-20 Act IV (title)
  //   ch-21..27 4.1..4.7
  //   ch-28 Act V (title)
  //   ch-29..31 5.1..5.3
  // Totals: 26 scenes (5-4-7-7-3), conflated Q1/F1 text.
  sceneMap: [
    { chapterIndex: 2, act: 1, scene: 1 },
    { chapterIndex: 3, act: 1, scene: 2 },
    { chapterIndex: 4, act: 1, scene: 3 },
    { chapterIndex: 5, act: 1, scene: 4 },
    { chapterIndex: 6, act: 1, scene: 5 },
    { chapterIndex: 8, act: 2, scene: 1 },
    { chapterIndex: 9, act: 2, scene: 2 },
    { chapterIndex: 10, act: 2, scene: 3 },
    { chapterIndex: 11, act: 2, scene: 4 },
    { chapterIndex: 13, act: 3, scene: 1 },
    { chapterIndex: 14, act: 3, scene: 2 },
    { chapterIndex: 15, act: 3, scene: 3 },
    { chapterIndex: 16, act: 3, scene: 4 },
    { chapterIndex: 17, act: 3, scene: 5 },
    { chapterIndex: 18, act: 3, scene: 6 },
    { chapterIndex: 19, act: 3, scene: 7 },
    { chapterIndex: 21, act: 4, scene: 1 },
    { chapterIndex: 22, act: 4, scene: 2 },
    { chapterIndex: 23, act: 4, scene: 3 },
    { chapterIndex: 24, act: 4, scene: 4 },
    { chapterIndex: 25, act: 4, scene: 5 },
    { chapterIndex: 26, act: 4, scene: 6 },
    { chapterIndex: 27, act: 4, scene: 7 },
    { chapterIndex: 29, act: 5, scene: 1 },
    { chapterIndex: 30, act: 5, scene: 2 },
    { chapterIndex: 31, act: 5, scene: 3 },
  ],
  sceneTitles: {
    "1_1": "King Lear's palace",
    "1_2": "The Earl of Gloucester's castle",
    "1_3": "The Duke of Albany's palace",
    "1_4": "A hall in Albany's palace",
    "1_5": "Court before the Duke of Albany's palace",
    "2_1": "A court within the castle of the Earl of Gloucester",
    "2_2": "Before Gloucester's castle",
    "2_3": "A wood",
    "2_4": "Before Gloucester's castle; Kent in the stocks",
    "3_1": "A heath",
    "3_2": "Another part of the heath. Storm still",
    "3_3": "Gloucester's castle",
    "3_4": "The heath. Before a hovel",
    "3_5": "Gloucester's castle",
    "3_6": "A chamber in a farmhouse adjoining the castle",
    "3_7": "Gloucester's castle",
    "4_1": "The heath",
    "4_2": "Before the Duke of Albany's palace",
    "4_3": "The French camp near Dover",
    "4_4": "The same. A tent",
    "4_5": "Gloucester's castle",
    "4_6": "Fields near Dover",
    "4_7": "A tent in the French camp",
    "5_1": "The British camp near Dover",
    "5_2": "A field between the two camps",
    "5_3": "The British camp near Dover",
  },
  tier1Sections: [
    "king_lear_act1_scene1",
    "king_lear_act1_scene4",
    "king_lear_act3_scene2",
    "king_lear_act3_scene4",
    "king_lear_act3_scene7",
    "king_lear_act4_scene6",
    "king_lear_act5_scene3",
  ],
  editionNote:
    "Conflated Q1 (1608) / F1 (1623) text following standard modern editorial practice. Includes Q1-only material (notably the 3.6 mock trial) alongside F1-only passages.",
};

const HENRY_V: WorkConfig = {
  workId: "henry-v",
  title: "Henry V",
  author: "William Shakespeare",
  year: 1599,
  sourceUrl: "https://standardebooks.org/ebooks/william-shakespeare/henry-v",
  // Chapter layout in public/content/henry-v/:
  //   ch-0  Dramatis Personae
  //   ch-1  Prologue (standalone — CHORUS "O for a Muse of fire")
  //   ch-2  Act I (title page, no embedded chorus)
  //   ch-3..4  1.1, 1.2
  //   ch-5  Act II (title) + embedded Chorus "Now all the youth of England"
  //   ch-6..9  2.1, 2.2, 2.3, 2.4
  //   ch-10 Act III (title) + embedded Chorus "Thus with imagined wing"
  //   ch-11..17 3.1..3.7
  //   ch-18 Act IV (title) + embedded Chorus "Now entertain conjecture of a time"
  //   ch-19..26 4.1..4.8
  //   ch-27 Act V (title) + embedded Chorus "Vouchsafe to those that have not read the story"
  //   ch-28..29 5.1, 5.2
  //   ch-30 Epilogue (standalone sonnet — "Thus far, with rough and all-unable pen")
  // Totals: 23 scenes (2-4-7-8-2) + 6 choric passages = 29 sections.
  sceneMap: [
    { kind: "chorus", chapterIndex: 1, sectionId: "henry_v_prologue", sceneTitle: "Prologue", afterAct: 0 },
    { chapterIndex: 3, act: 1, scene: 1 },
    { chapterIndex: 4, act: 1, scene: 2 },
    { kind: "chorus", chapterIndex: 5, sectionId: "henry_v_act2_chorus", sceneTitle: "Chorus", afterAct: 2 },
    { chapterIndex: 6, act: 2, scene: 1 },
    { chapterIndex: 7, act: 2, scene: 2 },
    { chapterIndex: 8, act: 2, scene: 3 },
    { chapterIndex: 9, act: 2, scene: 4 },
    { kind: "chorus", chapterIndex: 10, sectionId: "henry_v_act3_chorus", sceneTitle: "Chorus", afterAct: 3 },
    { chapterIndex: 11, act: 3, scene: 1 },
    { chapterIndex: 12, act: 3, scene: 2 },
    { chapterIndex: 13, act: 3, scene: 3 },
    { chapterIndex: 14, act: 3, scene: 4 },
    { chapterIndex: 15, act: 3, scene: 5 },
    { chapterIndex: 16, act: 3, scene: 6 },
    { chapterIndex: 17, act: 3, scene: 7 },
    { kind: "chorus", chapterIndex: 18, sectionId: "henry_v_act4_chorus", sceneTitle: "Chorus", afterAct: 4 },
    { chapterIndex: 19, act: 4, scene: 1 },
    { chapterIndex: 20, act: 4, scene: 2 },
    { chapterIndex: 21, act: 4, scene: 3 },
    { chapterIndex: 22, act: 4, scene: 4 },
    { chapterIndex: 23, act: 4, scene: 5 },
    { chapterIndex: 24, act: 4, scene: 6 },
    { chapterIndex: 25, act: 4, scene: 7 },
    { chapterIndex: 26, act: 4, scene: 8 },
    { kind: "chorus", chapterIndex: 27, sectionId: "henry_v_act5_chorus", sceneTitle: "Chorus", afterAct: 5 },
    { chapterIndex: 28, act: 5, scene: 1 },
    { chapterIndex: 29, act: 5, scene: 2 },
    { kind: "chorus", chapterIndex: 30, sectionId: "henry_v_epilogue", sceneTitle: "Epilogue", afterAllActs: true },
  ],
  sceneTitles: {
    "1_1": "London. An ante-chamber in the King's palace",
    "1_2": "London. The Presence chamber in the King's palace",
    "2_1": "London. Before a tavern in Eastcheap",
    "2_2": "Southampton. A council-chamber",
    "2_3": "London. Before a tavern in Eastcheap",
    "2_4": "France. The King's palace",
    "3_1": "France. Before Harfleur",
    "3_2": "The same. Before the walls of Harfleur",
    "3_3": "The same. Before the gates of Harfleur",
    "3_4": "Rouen. A room in the King's palace",
    "3_5": "The same. Another room",
    "3_6": "The English camp in Picardy",
    "3_7": "The French camp, near Agincourt",
    "4_1": "The English camp at Agincourt",
    "4_2": "The French camp",
    "4_3": "The English camp",
    "4_4": "The field of battle",
    "4_5": "Another part of the field",
    "4_6": "Another part of the field",
    "4_7": "Another part of the field",
    "4_8": "Before King Henry's pavilion",
    "5_1": "France. The English camp",
    "5_2": "Troyes in Champagne. An apartment in the French King's palace",
  },
  tier1Sections: [
    "henry_v_prologue",
    "henry_v_act3_chorus",
    "henry_v_act3_scene1",
    "henry_v_act3_scene3",
    "henry_v_act4_chorus",
    "henry_v_act4_scene3",
    "henry_v_act4_scene6",
    "henry_v_epilogue",
  ],
};

const RICHARD_III: WorkConfig = {
  workId: "richard-iii",
  title: "Richard III",
  author: "William Shakespeare",
  year: 1593,
  sourceUrl: "https://standardebooks.org/ebooks/william-shakespeare/richard-iii",
  // Chapter layout in public/content/richard-iii/:
  //   ch-0  Dramatis Personae
  //   ch-1  Act I (title)
  //   ch-2..5  1.1..1.4
  //   ch-6  Act II (title)
  //   ch-7..10 2.1..2.4
  //   ch-11 Act III (title)
  //   ch-12..18 3.1..3.7
  //   ch-19 Act IV (title)
  //   ch-20..24 4.1..4.5
  //   ch-25 Act V (title)
  //   ch-26..30 5.1..5.5
  // Totals: 25 scenes (4-4-7-5-5). No prologue/chorus/epilogue.
  // Speaker labels shift from Gloucester → King Richard at 4.2 (ch-21)
  // as the coronation takes effect; both labels are preserved as distinct.
  sceneMap: [
    { chapterIndex: 2, act: 1, scene: 1 },
    { chapterIndex: 3, act: 1, scene: 2 },
    { chapterIndex: 4, act: 1, scene: 3 },
    { chapterIndex: 5, act: 1, scene: 4 },
    { chapterIndex: 7, act: 2, scene: 1 },
    { chapterIndex: 8, act: 2, scene: 2 },
    { chapterIndex: 9, act: 2, scene: 3 },
    { chapterIndex: 10, act: 2, scene: 4 },
    { chapterIndex: 12, act: 3, scene: 1 },
    { chapterIndex: 13, act: 3, scene: 2 },
    { chapterIndex: 14, act: 3, scene: 3 },
    { chapterIndex: 15, act: 3, scene: 4 },
    { chapterIndex: 16, act: 3, scene: 5 },
    { chapterIndex: 17, act: 3, scene: 6 },
    { chapterIndex: 18, act: 3, scene: 7 },
    { chapterIndex: 20, act: 4, scene: 1 },
    { chapterIndex: 21, act: 4, scene: 2 },
    { chapterIndex: 22, act: 4, scene: 3 },
    { chapterIndex: 23, act: 4, scene: 4 },
    { chapterIndex: 24, act: 4, scene: 5 },
    { chapterIndex: 26, act: 5, scene: 1 },
    { chapterIndex: 27, act: 5, scene: 2 },
    { chapterIndex: 28, act: 5, scene: 3 },
    { chapterIndex: 29, act: 5, scene: 4 },
    { chapterIndex: 30, act: 5, scene: 5 },
  ],
  sceneTitles: {
    "1_1": "London. A street",
    "1_2": "The same. Another street",
    "1_3": "London. The palace",
    "1_4": "London. The Tower",
    "2_1": "London. The palace",
    "2_2": "The palace",
    "2_3": "London. A street",
    "2_4": "London. The palace",
    "3_1": "London. A street",
    "3_2": "Before Lord Hastings' house",
    "3_3": "Pomfret. Before the castle",
    "3_4": "The Tower of London",
    "3_5": "The Tower walls",
    "3_6": "The same. A street",
    "3_7": "Baynard's Castle",
    "4_1": "Before the Tower",
    "4_2": "London. The palace",
    "4_3": "The same",
    "4_4": "Before the palace",
    "4_5": "Lord Derby's house",
    "5_1": "Salisbury. An open place",
    "5_2": "Plain near Tamworth",
    "5_3": "Bosworth Field",
    "5_4": "Another part of the field",
    "5_5": "Another part of the field",
  },
  tier1Sections: [
    "richard_iii_act1_scene1",
    "richard_iii_act1_scene2",
    "richard_iii_act1_scene3",
    "richard_iii_act3_scene7",
    "richard_iii_act4_scene3",
    "richard_iii_act4_scene4",
    "richard_iii_act5_scene3",
    "richard_iii_act5_scene4",
  ],
  editionNote:
    "Conflated text following standard modern editorial practice. The Q1 (1597) and F1 (1623) texts differ substantially — F1 is roughly 200 lines longer, with the 'clock scene' (4.2) extended — but unlike King Lear's Q/F situation, the two are conventionally treated as variants of a single work rather than distinct versions.",
};

const JULIUS_CAESAR: WorkConfig = {
  workId: "julius-caesar",
  title: "Julius Caesar",
  author: "William Shakespeare",
  year: 1599,
  sourceUrl: "https://standardebooks.org/ebooks/william-shakespeare/julius-caesar",
  // Chapter layout in public/content/julius-caesar/:
  //   ch-0  Dramatis Personae
  //   ch-1  Act I (title)
  //   ch-2..4   1.1..1.3 (3 scenes)
  //   ch-5  Act II (title)
  //   ch-6..9   2.1..2.4 (4 scenes)
  //   ch-10 Act III (title)
  //   ch-11..13 3.1..3.3 (3 scenes)
  //   ch-14 Act IV (title)
  //   ch-15..17 4.1..4.3 (3 scenes)
  //   ch-18 Act V (title)
  //   ch-19..23 5.1..5.5 (5 scenes)
  // Totals: 18 scenes (3-4-3-3-5). First Roman play; source is North's 1579
  // translation of Plutarch's Parallel Lives (Caesar / Brutus / Antony).
  sceneMap: [
    { chapterIndex: 2, act: 1, scene: 1 },
    { chapterIndex: 3, act: 1, scene: 2 },
    { chapterIndex: 4, act: 1, scene: 3 },
    { chapterIndex: 6, act: 2, scene: 1 },
    { chapterIndex: 7, act: 2, scene: 2 },
    { chapterIndex: 8, act: 2, scene: 3 },
    { chapterIndex: 9, act: 2, scene: 4 },
    { chapterIndex: 11, act: 3, scene: 1 },
    { chapterIndex: 12, act: 3, scene: 2 },
    { chapterIndex: 13, act: 3, scene: 3 },
    { chapterIndex: 15, act: 4, scene: 1 },
    { chapterIndex: 16, act: 4, scene: 2 },
    { chapterIndex: 17, act: 4, scene: 3 },
    { chapterIndex: 19, act: 5, scene: 1 },
    { chapterIndex: 20, act: 5, scene: 2 },
    { chapterIndex: 21, act: 5, scene: 3 },
    { chapterIndex: 22, act: 5, scene: 4 },
    { chapterIndex: 23, act: 5, scene: 5 },
  ],
  sceneTitles: {
    "1_1": "Rome. A street",
    "1_2": "A public place",
    "1_3": "The same. A street",
    "2_1": "Rome. Brutus's orchard",
    "2_2": "Caesar's house",
    "2_3": "A street near the Capitol",
    "2_4": "Another part of the same street, before the house of Brutus",
    "3_1": "Rome. Before the Capitol; the Senate sitting above",
    "3_2": "The Forum",
    "3_3": "A street",
    "4_1": "A house in Rome",
    "4_2": "Camp near Sardis. Before Brutus's tent",
    "4_3": "Brutus's tent",
    "5_1": "The plains of Philippi",
    "5_2": "The same. The field of battle",
    "5_3": "Another part of the field",
    "5_4": "Another part of the field",
    "5_5": "Another part of the field",
  },
  tier1Sections: [
    "julius_caesar_act1_scene2",
    "julius_caesar_act2_scene1",
    "julius_caesar_act3_scene1",
    "julius_caesar_act3_scene2",
    "julius_caesar_act4_scene3",
    "julius_caesar_act5_scene5",
  ],
  strictContinuationRows: true,
};

const WORKS: Record<string, WorkConfig> = {
  hamlet: HAMLET,
  othello: OTHELLO,
  macbeth: MACBETH,
  "romeo-and-juliet": ROMEO_AND_JULIET,
  "king-lear": KING_LEAR,
  "henry-v": HENRY_V,
  "richard-iii": RICHARD_III,
  "julius-caesar": JULIUS_CAESAR,
};

export function getWorkConfig(workId: string): WorkConfig | null {
  return WORKS[workId] ?? null;
}

export function listWorks(): string[] {
  return Object.keys(WORKS);
}
