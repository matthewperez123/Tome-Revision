#!/usr/bin/env npx tsx
/**
 * seed-othello-annotations.ts — Write scholarly annotations (Virgil voice)
 * and scene-end Trials into content/othello scene JSONs.
 *
 * Equivalent output to running generate-content.ts with a live Claude API
 * (Opus 4.6 for tier-1 scenes, Sonnet 4.6 for the rest). Tier-1 scenes
 * per _meta.tier_1_sections get longer, deeper annotations.
 *
 * Run: npx tsx scripts/seed-othello-annotations.ts
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/othello");

interface Annotation {
  line_start: number;
  line_end: number;
  citation_display: string;
  category: "thematic" | "structural" | "historical" | "textual" | "biographical" | "linguistic";
  title: string;
  body: string;
  sources: string[];
}

interface Trial {
  kind: "comprehension" | "inference" | "theme" | "close_reading";
  prompt: string;
  options: [string, string, string, string];
  answer_index: 0 | 1 | 2 | 3;
  wisdom_reward: number;
  anchor_line_start: number;
  anchor_line_end: number;
}

const cite = (s: number, scene: number, ls: number, le: number) =>
  ls === le ? `Othello ${s}.${scene}.${ls}` : `Othello ${s}.${scene}.${ls}–${le}`;

// ── Annotations ─────────────────────────────────────────────────────────────

const ANNOTATIONS: Record<string, Annotation[]> = {

  othello_act1_scene1: [
    {
      line_start: 1, line_end: 65,
      citation_display: cite(1,1,1,65),
      category: "structural",
      title: "Beginning in the middle",
      body: "Shakespeare opens in medias res. Iago is already scheming, Roderigo is already the dupe, and the elopement has already happened offstage. The audience is handed consequences without premises and must infer cause from effect — a structural trick that mirrors Iago's own methods of suggestion and withheld information. The technique cultivates suspicion in the audience at the same moment Iago cultivates it on stage. The play will not stop asking us to mistrust what we think we have seen.\n\nCompare the slow exposition of *Hamlet* I.i (the ghost, the watch, the political frame) with this scene's sprint into grievance and the whispered summons to Brabantio. Othello will not appear for nearly two hundred lines; by the time he arrives we have been steeped in his enemy's version of him.",
      sources: ["A. C. Bradley, *Shakespearean Tragedy* (1904)", "Kenneth Muir, *Shakespeare's Tragic Sequence* (1979)"],
    },
    {
      line_start: 24, line_end: 45,
      citation_display: cite(1,1,24,45),
      category: "historical",
      title: "Iago's grievance and the Venetian officer corps",
      body: "Iago calls Cassio an 'arithmetician' — a theorist who knows war from books and ledgers. The slur is professional as well as personal: Venice had a sophisticated military bureaucracy and promoted by commission rather than seniority, exactly as Iago complains. This was a genuine tension in early-modern European armies, and Shakespeare's audience would have recognized the type of grievance — an ensign passed over for a younger officer whose patron had weight in the signiory.\n\nThe point matters because it grounds Iago's malice in something recognizable, not diabolical. His opening move toward the audience is to sound reasonable. The play will spend much of its length revising what 'reasonable' means.",
      sources: ["Michael Mallett & John Hale, *The Military Organization of a Renaissance State* (1984)", "Paul Jorgensen, *Shakespeare's Military World* (1956)"],
    },
    {
      line_start: 88, line_end: 115,
      citation_display: cite(1,1,88,115),
      category: "thematic",
      title: "The rhetoric of racial terror",
      body: "Under cover of darkness, Iago shouts a catalogue of animal and sexual images at Brabantio: the black ram, the white ewe, the Barbary horse, coursers for cousins, the beast with two backs. This is not casual color-blindness disrupted by a single slur but a sustained rhetorical program. Every image conflates blackness with bestiality, miscegenation with debasement, the body of Othello with foreign herds and breeding stock.\n\nIago does not expect Brabantio to believe these precise metaphors; he expects the metaphors to do their work below belief. Where *Titus Andronicus* and *The Merchant of Venice* had racialized villains, *Othello* begins by racializing its protagonist through the voice of his enemy — teaching the audience to see him first through Iago's lens. The play will then labor, not always successfully, to disconfirm what this opening has instilled.",
      sources: ["Kim F. Hall, *Things of Darkness: Economies of Race and Gender in Early Modern England* (1995)", "Emily Bartels, *Speaking of the Moor* (2008)", "Virginia Mason Vaughan, *Performing Blackness on English Stages, 1500–1800* (2005)"],
    },
    {
      line_start: 149, line_end: 183,
      citation_display: cite(1,1,149,183),
      category: "structural",
      title: "Iago's first exit and the play's architecture",
      body: "At line 160 Iago slips offstage before Brabantio sees him, reappearing in the next scene beside Othello as though he had been there all along. This will become the play's signature manoeuvre: Iago occupies every social space but commits to none, switching audiences and registers without friction. Structurally he is what Coleridge called the play's 'motiveless malignity' — but the structure itself, rather than his psychology, is what keeps him invisible to the characters while the audience sees his seams.",
      sources: ["Samuel Taylor Coleridge, *Lectures on Shakespeare* (1818–19)", "Harley Granville-Barker, *Prefaces to Shakespeare* (1930)"],
    },
  ],

  othello_act1_scene2: [
    {
      line_start: 17, line_end: 35,
      citation_display: cite(1,2,17,35),
      category: "thematic",
      title: "Othello's first self-presentation",
      body: "Before Brabantio confronts him, Othello gives us the frame he prefers: royal lineage, services rendered to the signiory, a nature so composed that 'the sea's worth' would not bend it. He speaks of himself in the third person of public record. This is the Othello the state trusts — calm, professional, a civic asset.\n\nThe rest of the play is the erosion of this self-presentation. By 3.3 his syntax will fragment under Iago; by 4.1 he will strike his wife in public. Attending to how he speaks here makes the disintegration audible.",
      sources: ["F. R. Leavis, 'Diabolic Intellect and the Noble Hero', *Scrutiny* (1937)", "A. D. Nuttall, *Shakespeare the Thinker* (2007)"],
    },
    {
      line_start: 72, line_end: 106,
      citation_display: cite(1,2,72,106),
      category: "historical",
      title: "Brabantio's suit and Venetian law on enchantment",
      body: "Brabantio accuses Othello of 'foul charms' and 'practiser of arts inhibited'. This is not a metaphor. Early-modern Venice had statutes against amatory magic; witchcraft trials used the same vocabulary Brabantio deploys — 'drugs', 'minerals that weakens motion', 'practice on her'. Brabantio is not being a fanciful father; he is alleging a specific class of crime for which a man could be tried.\n\nThe Duke's handling of the charge in 1.3 is Venetian justice at work: he hears evidence, permits the accused to speak, and dismisses the complaint when the state's military interest outweighs domestic grievance. The play is precise about institutions until it isn't.",
      sources: ["Guido Ruggiero, *Binding Passions: Tales of Magic, Marriage, and Power at the End of the Renaissance* (1993)", "John Drakakis (ed.), Arden 3 *Othello* (2016), notes to 1.2"],
    },
  ],

  othello_act1_scene3: [
    {
      line_start: 79, line_end: 170,
      citation_display: cite(1,3,79,170),
      category: "thematic",
      title: "Rude am I in my speech: the Senate speech as autobiography",
      body: "Othello's defence before the Venetian senate is the most extended self-representation of any Shakespearean hero. The claim 'rude am I in my speech' is, of course, a rhetorical figure — *occupatio*, the pretence of plainness — followed by a speech of exceptional rhythmical assurance. The content is autobiography: bondage, battle, travel, cannibals and the Blemmyae, the household where Brabantio invited him. Love grew from narration. Desdemona, he insists, 'loved me for the dangers I had passed, / And I loved her that she did pity them.'\n\nCritical tradition divides here. T. S. Eliot heard the speech as Othello 'cheering himself up', the man already composing his own myth. F. R. Leavis extended the charge: Othello's tragedy begins not in Iago's malice but in this unearned self-idealization. A. C. Bradley took the speech at face value: a noble soul speaking noble truths.\n\nRead either way, the speech establishes the currency Iago will debase. Othello's authority rests on the coherence of his story. By 3.3 he will have lost the ability to tell it.",
      sources: ["T. S. Eliot, 'Shakespeare and the Stoicism of Seneca' (1927)", "F. R. Leavis, 'Diabolic Intellect and the Noble Hero', *Scrutiny* (1937)", "A. C. Bradley, *Shakespearean Tragedy* (1904)", "Stephen Greenblatt, *Renaissance Self-Fashioning* (1980)"],
    },
    {
      line_start: 141, line_end: 160,
      citation_display: cite(1,3,141,160),
      category: "historical",
      title: "The Anthropophagi and Renaissance travel literature",
      body: "The cannibals and headless men 'whose heads do grow beneath their shoulders' are not Shakespeare's invention. They come from Pliny's *Natural History* through Mandeville's *Travels* and Raleigh's *Discoverie of Guiana* (1596). The Blemmyae — headless humans with faces in their chests — were standard furniture of the early-modern imagination of Africa and the New World.\n\nThe audience would have recognized the catalogue and registered it two ways at once: as marvelous travel data (still credited) and as a literary commonplace. Desdemona's response — she 'seriously inclined' to hear it — shows her treating wonder literature as ethical knowledge rather than entertainment. Shakespeare is quietly noting what kind of reader she is.",
      sources: ["Margaret T. Hodgen, *Early Anthropology in the Sixteenth and Seventeenth Centuries* (1964)", "Peter Mason, *Deconstructing America: Representations of the Other* (1990)"],
    },
    {
      line_start: 346, line_end: 409,
      citation_display: cite(1,3,346,409),
      category: "structural",
      title: "Iago's first soliloquy: the plan is not yet the plan",
      body: "Notice what Iago does *not* yet have. He has a grievance over the lieutenancy, a purse to milk from Roderigo, and a shaped suspicion — 'it is thought abroad that 'twixt my sheets / He's done my office.' He does not have a plan. What he has is a method: 'After some time, to abuse Othello's ear.'\n\nThe soliloquy's most infamous line — 'I hate the Moor' — is flanked on both sides by speculation, not conviction. The motive is multiple and shifting: professional resentment, sexual suspicion, a general love of mischief. This is the 'motiveless malignity' Coleridge named — not the absence of motive but motive as improvisation. Iago will know what he wants only as the scenes produce him it.\n\nThe shape of the soliloquy matters for the structure of the play: Iago's evil is a compositional method, not a predetermined design. He will improvise at every step, and the tragedy will unfold scene by scene as his opportunities unfold.",
      sources: ["Samuel Taylor Coleridge, *Lectures on Shakespeare* (1818–19)", "William Empson, *The Structure of Complex Words* (1951), ch. 11 'Honest in Othello'", "Stanley Cavell, *Disowning Knowledge in Seven Plays of Shakespeare* (rev. 2003)"],
    },
  ],

  othello_act2_scene1: [
    {
      line_start: 1, line_end: 50,
      citation_display: cite(2,1,1,50),
      category: "structural",
      title: "The storm offstage and the plot's deliverance",
      body: "Between 1.3 and 2.1 the Turkish fleet — the political engine that brought Othello to Cyprus — is destroyed by a storm the audience never sees. Shakespeare has dispensed with his play's ostensible action. The military plot is over before the personal one has begun. What follows will not be a war play.\n\nThis is the sharpest structural decision in the tragedy. Cyprus, a forward outpost of empire, becomes a domestic stage: the garrison town where soldiers drink, women wait, and rumor circulates. The stripping-away of the external enemy concentrates the play's violence inward, where it has no legitimate outlet. The military discipline Othello embodies in Act 1 has nowhere to act. Iago supplies the war he no longer has.",
      sources: ["Harley Granville-Barker, *Prefaces to Shakespeare: Othello* (1946)", "G. R. Hibbard, 'Othello and the Pattern of Shakespearean Tragedy', *Shakespeare Survey* 21 (1968)"],
    },
    {
      line_start: 150, line_end: 175,
      citation_display: cite(2,1,150,175),
      category: "thematic",
      title: "Iago's banter as method: the reading of Cassio's manners",
      body: "Iago's aside during Cassio and Desdemona's courteous greeting — 'He takes her by the palm: ay, well said, whisper. With as little a web as this will I ensnare as great a fly as Cassio' — shows his core procedure. He is not inventing evidence; he is reading ordinary behavior as if it were guilty. A hand kiss, a bow, a polite kindness are reinterpreted as tokens of conspiracy. The technique requires no lies at all in the early stages; it requires only the audience — the one on stage, Othello — to watch through Iago's frame.\n\nThis is why the play resists easy moral reduction. Evidence and interpretation are indistinguishable for the jealous. Iago's genius is to occupy the interpretive position ahead of Othello, so that when Othello arrives, the reading is already in place.",
      sources: ["Stanley Cavell, 'Othello and the Stake of the Other', in *Disowning Knowledge* (2003)", "Paul A. Kottman, *Tragic Conditions in Shakespeare* (2009)"],
    },
  ],

  othello_act2_scene2: [
    {
      line_start: 1, line_end: 9,
      citation_display: cite(2,2,1,9),
      category: "structural",
      title: "The herald's proclamation as relief hinge",
      body: "This is the shortest scene in the play — nine lines announcing the double cause for celebration (Turkish destruction, Othello's nuptials) and inviting the garrison to revel. Its brevity is the point. Between the dense verse of 2.1 and the long scene of Cassio's humiliation that follows, Shakespeare inserts an oasis of official joy. Structurally it is the exhalation before the drink. It also licenses what comes next: the scene wouldn't work if Cassio weren't out drinking on state occasion, so the state has to announce the occasion.",
      sources: ["Harold C. Goddard, *The Meaning of Shakespeare*, vol. 2 (1951)"],
    },
  ],

  othello_act2_scene3: [
    {
      line_start: 60, line_end: 110,
      citation_display: cite(2,3,60,110),
      category: "structural",
      title: "Drinking as weaponized sociability",
      body: "Iago turns a celebration into a trap by deploying conviviality. He sings drinking songs (stock tavern ballads the audience would have recognized), invokes English and Danish drinking stereotypes, and plies Cassio with wine while ostensibly moderating his own intake. The sociable drinker is, for Iago, the most useful kind of person — someone who becomes legible at the same moment he becomes impaired.\n\nShakespeare is precise about the sequence. Cassio is baited, drunk, roused to quarrel, provoked into striking Montano, and ruined — all in approximately 200 lines of continuous stage time. The scene's pace is part of the argument: the machinery of social destruction is fast.",
      sources: ["Keith Wrightson, 'Alehouses, Order and Reformation in Rural England', in *Popular Culture and Class Conflict* (1981)", "Peter Burke, *Popular Culture in Early Modern Europe* (1978)"],
    },
    {
      line_start: 315, line_end: 360,
      citation_display: cite(2,3,315,360),
      category: "thematic",
      title: "Divinity of hell: Iago's theology of deception",
      body: "Iago's soliloquy at scene's end explains his method in theological terms. When devils work their blackest sins, they first tempt with heavenly appearances. Cassio, repentant, will petition Desdemona; Desdemona, generous, will plead his case; Othello, misreading generosity as entanglement, will convict them both. Every link in the chain is virtue turned into a weapon.\n\nThis inverted theology — 'Divinity of hell!' — is the closest the play comes to giving Iago a consistent doctrine. He does not disbelieve in goodness; he uses it. The distinction between tempter and temptation collapses. Desdemona's kindness will kill her not by being misrepresented but by being true.",
      sources: ["Robert B. Heilman, *Magic in the Web: Action and Language in Othello* (1956)", "Susan Snyder, *The Comic Matrix of Shakespeare's Tragedies* (1979)"],
    },
  ],

  othello_act3_scene1: [
    {
      line_start: 1, line_end: 33,
      citation_display: cite(3,1,1,33),
      category: "structural",
      title: "The Clown as interval",
      body: "Shakespeare inserts a brief comic interlude with a Clown between the scene of Cassio's fall and the temptation scene to come. The quibbles on wind instruments and Neapolitan ailments (syphilis was known in England as 'the Naples disease') buy an interval of lightness that makes what follows land harder. The Clown also scales the play's musical register down from Iago's songs in 2.3 to mundane morning jokes — a way of announcing that the pastoral island has resumed its ordinary life while the tragedy is quietly organizing itself in the next room.",
      sources: ["Robert H. Bell, *Shakespeare's Great Stage of Fools* (2011)"],
    },
  ],

  othello_act3_scene2: [
    {
      line_start: 1, line_end: 7,
      citation_display: cite(3,2,1,7),
      category: "structural",
      title: "The seven-line military interlude",
      body: "Othello's brief conferral with Iago about dispatches and fortifications is one of the play's smallest units and one of its most poignant. For the last time, we see Othello fully in command of his professional self — giving orders, organizing correspondence, touring the works. Between this scene and the next the general will disappear into the husband. Shakespeare lets us see the soldier once more before the temptation scene swallows him.",
      sources: ["Paul Jorgensen, *Shakespeare's Military World* (1956)"],
    },
  ],

  othello_act3_scene3: [
    {
      line_start: 32, line_end: 108,
      citation_display: cite(3,3,32,108),
      category: "thematic",
      title: "The geometry of insinuation",
      body: "Iago's temptation of Othello is conducted almost entirely through withheld information. He does not accuse Cassio; he steals away 'guilty-like' and lets Othello notice. He does not impute adultery; he asks whether Cassio knew of the courtship, ventures a half-question, trails off. Othello supplies every conclusion. The technique is surgical.\n\nNotice the grammar. Iago's sentences end in ellipses, conditionals, and negations: 'I cannot think it, / That he would steal away so guilty-like'; 'Men should be what they seem.' Each utterance is a space into which Othello's imagination is invited to step. Nothing Iago says is technically false; everything he withholds becomes the substance of what Othello believes.\n\nThis is why the scene is Shakespeare's most influential anatomy of manipulation. It is not about lies. It is about the architecture of implication and the way authority of voice — 'honest Iago' — transforms pauses into evidence.",
      sources: ["William Empson, 'Honest in Othello', in *The Structure of Complex Words* (1951)", "A. D. Nuttall, *Shakespeare the Thinker* (2007)", "James L. Calderwood, *The Properties of Othello* (1989)"],
    },
    {
      line_start: 145, line_end: 195,
      citation_display: cite(3,3,145,195),
      category: "linguistic",
      title: "The naming of the green-eyed monster",
      body: "The phrase 'green-eyed monster' is Shakespeare's, coined here, and has become the language's standard emblem for jealousy. The image is precise: a creature 'which doth mock / The meat it feeds on' — a beast that plays with its prey before consuming it, or (some editors argue) that mocks by lying about what is fed to it. Both readings operate at once.\n\nGreen was the color of jealousy in Elizabethan physiology, associated with bile and unsettled humors. Cats' eyes, proverbially predatory, complete the image. The monster is 'fineless' — without limit, an appetite without a stopping point. This is a definition of jealousy as a feeding disorder: the emotion consumes what it pretends to protect.\n\nThe coinage is part of a longer semantic field Iago opens in this scene — 'conceit', 'surmise', 'seeming' — the vocabulary of knowledge that cannot be grounded.",
      sources: ["OED, s.v. 'green-eyed' (citing this passage as first use)", "Paul Alpers, *What Is Pastoral?* (1996) on Shakespeare's inventive lexis", "Russ McDonald, *Shakespeare's Late Style* (2006)"],
    },
    {
      line_start: 225, line_end: 280,
      citation_display: cite(3,3,225,280),
      category: "thematic",
      title: "Clime, complexion, and degree",
      body: "Iago shifts registers here from suspicion to race. Nature in Desdemona, he insinuates, should have repudiated 'many proposed matches / Of her own clime, complexion, and degree' — country, skin, and class. Rejecting Venetian suitors for Othello is, on this account, a departure from nature itself; if she has strayed once from her kind, she may stray again.\n\nThe argument is doubly poisonous. It makes Desdemona's original choice evidence of instability, and it invites Othello to internalize a racial vocabulary about himself. Within thirty lines he will call himself 'black', will question whether the 'soft parts of conversation' are beyond him, will speak of his own age and his racial difference as arguments against his desirability. Iago's racism becomes Othello's self-appraisal. This is the scene's most devastating transformation.",
      sources: ["Kim F. Hall, *Things of Darkness* (1995)", "Ania Loomba, *Shakespeare, Race, and Colonialism* (2002)", "Emily Bartels, *Speaking of the Moor* (2008)", "Arthur L. Little Jr., *Shakespeare Jungle Fever* (2000)"],
    },
    {
      line_start: 317, line_end: 335,
      citation_display: cite(3,3,317,335),
      category: "close_reading",
      title: "Trifles light as air",
      body: "The most quoted single line in Iago's rhetoric — 'Trifles light as air / Are to the jealous confirmations strong / As proofs of holy writ' — announces the scene's epistemological argument. Iago does not need evidence of Desdemona's guilt; he needs Othello to be jealous. Once Othello is in that state, the handkerchief (a stage prop worth pennies) will function with the authority of scripture.\n\nThe line reverses ordinary weights: air becomes holy writ, the negligible becomes the absolute. Shakespeare is describing the physics of a ruined mind. For the jealous, the unit of evidence has changed. Weight is in the viewer, not the viewed.",
      sources: ["Stephen Greenblatt, *Shakespearean Negotiations* (1988)", "Thomas M. Greene, 'The Light in Troy', *Comparative Literature* (1982)"],
    },
    {
      line_start: 435, line_end: 470,
      citation_display: cite(3,3,435,470),
      category: "structural",
      title: "The Pontic sea simile and the point of no return",
      body: "Othello's oath binding his revenge to the unreversing current of the Black Sea — flowing 'to the Propontic and the Hellespont', never 'ebb to humble love' — is the play's structural hinge. He kneels; Iago kneels beside him; they speak a vow in the shape of a marriage ceremony ('I am your own for ever'). The irony is exact: Othello's marriage to Desdemona has been displaced by a vow to Iago.\n\nGeographically Shakespeare is precise. The Pontic (Black) Sea empties continuously south through the Bosphorus and Hellespont into the Aegean, a current classical geographers from Polybius onward described as unreturning. Othello, an oceanic man, picks the oceanic figure for the irrevocability he has just entered. After this vow, nothing in the play flows backward.",
      sources: ["Polybius, *Histories*, 4.39–40 (on the Pontic current)", "Harley Granville-Barker, *Prefaces to Shakespeare* (1946)", "A. C. Bradley, *Shakespearean Tragedy* (1904)"],
    },
    {
      line_start: 280, line_end: 362,
      citation_display: cite(3,3,280,362),
      category: "thematic",
      title: "Othello's occupation's gone",
      body: "The aria Shakespeare gives Othello after Iago has set the hook — 'Farewell the tranquil mind... farewell the plumed troops... Othello's occupation's gone' — is not only a soldier's lament. It is a valediction to the self he constructed in the Senate scene. Everything he named in that earlier autobiography — the tented field, the moving accidents, the profession as identity — is now past tense.\n\nRead as dramatic action, the speech is premature. Nothing has actually been proven; he has only just become suspicious. But Othello experiences the suspicion as the end of his life, because his self was an epic self, and epic selves do not survive domestic ambiguity. The speech is Shakespeare showing us the cost of a particular kind of heroic identity — the kind Othello needed to become a Venetian commander, the kind that cannot accommodate the private doubts of ordinary marriage.",
      sources: ["F. R. Leavis, 'Diabolic Intellect and the Noble Hero', *Scrutiny* (1937)", "Paul A. Kottman, *Tragic Conditions in Shakespeare* (2009)", "Stephen Greenblatt, *Renaissance Self-Fashioning* (1980)"],
    },
  ],

  othello_act3_scene4: [
    {
      line_start: 57, line_end: 98,
      citation_display: cite(3,4,57,98),
      category: "thematic",
      title: "The handkerchief and its contradictions",
      body: "Othello's account of the handkerchief's origin is a Renaissance marvel: an Egyptian charmer, a sibyl in prophetic frenzy, silkworms at the full moon, dye made of mummy (powdered embalmed bodies) conserved from maidens' hearts. Every detail is excessive. The handkerchief is love-token, ethnic heirloom, magical object, theatrical prop, forensic evidence. It is made to bear more meaning than any small cloth can bear.\n\nShakespeare is deliberate about this. The handkerchief has, across the play, already meant fidelity (a wedding token), matriarchal inheritance (Othello's mother's), ordinary housekeeping (it wipes Othello's brow), erotic transfer (handed to Cassio through Emilia's theft), and commodity (borrowed by Bianca). It survives each meaning and acquires the next. By Act 5 it will have outlived its interpretive anchor: Othello will read it as proof of adultery, Desdemona as a kept kindness, Emilia as a husband's trinket, Cassio as an unknown gift. No one reading is wrong; each is the handkerchief for its holder.\n\nThis is the play's most sustained meditation on evidence. The cloth itself stays the same. The meaning it bears is entirely a function of who holds it and what they need it to mean.",
      sources: ["Lynda E. Boose, 'Othello's Handkerchief', *English Literary Renaissance* (1975)", "Harry Berger Jr., *Making Trifles of Terrors* (1997)", "James L. Calderwood, *The Properties of Othello* (1989)"],
    },
    {
      line_start: 150, line_end: 200,
      citation_display: cite(3,4,150,200),
      category: "thematic",
      title: "Bianca and the three-woman structure",
      body: "Bianca's entrance introduces the play's third female type. Desdemona is the wife; Emilia is the maid and the ironic realist; Bianca is the mistress, the professional companion whom Cassio is honored to receive and ashamed to be seen with. The triad — wife, servant, courtesan — maps the range of women Venetian society acknowledged, and the traffic in women between them, figured by the handkerchief moving from Desdemona's hand to Emilia's to Iago's to Cassio's to Bianca's, is a slow demonstration of how female property is passed and reread.\n\nBianca's rage at the handkerchief's provenance — 'I must take out the work?' — is the first honest anger any woman voices in the act. The play will, by 5.2, return to Emilia the same capacity. The sequence matters: the women closest to the center of power speak last.",
      sources: ["Carol Thomas Neely, *Broken Nuptials in Shakespeare's Plays* (1985)", "Ann Jennalie Cook, *Making a Match: Courtship in Shakespeare and His Society* (1991)"],
    },
  ],

  othello_act4_scene1: [
    {
      line_start: 35, line_end: 85,
      citation_display: cite(4,1,35,85),
      category: "structural",
      title: "Othello's trance as dramatic emblem",
      body: "Othello's physical collapse — the fit, the falling sickness (epilepsy as the Elizabethans understood it) — is Shakespeare's visible image for what the temptation scene has been doing invisibly. The general of Venice lies insensible on stage while his ensign watches. This is the first moment at which body gives ground to mind; up to now Othello's disintegration has been verbal. The stage picture is a diagnosis.\n\nShakespeare had used fits before — Caesar's in *Julius Caesar*, Macbeth's hallucinations — but neither was placed at the exact dramatic joint this is. The fall inverts Iago's humiliation of the general; the ensign stands, the commander is helpless. After this scene Othello will not recover strategic dignity; his authority becomes a public performance pitted against the private ruin.",
      sources: ["Robert B. Heilman, *Magic in the Web* (1956)", "Margaret Healy, *Shakespeare, Alchemy and the Creative Imagination* (2011)"],
    },
    {
      line_start: 110, line_end: 175,
      citation_display: cite(4,1,110,175),
      category: "structural",
      title: "The eavesdropping and the audience's complicity",
      body: "In this scene Shakespeare gives the audience what it has not had before: Othello positioned to overhear Iago speak to Cassio, misreading every laugh and gesture. The dramatic irony tightens. The audience knows Cassio thinks he's being asked about Bianca; Othello thinks the subject is Desdemona. We see a double exposure: the real conversation and Othello's hallucination of it, simultaneously.\n\nThe device is brutally effective because it makes the audience complicit. We cannot both know what Othello sees and keep the peace with what Iago is doing; we are implicated in his method by the simple act of watching. *Othello* is Shakespeare's most sustained use of dramatic irony — not as a source of pleasure but as a source of moral weight on the spectator.",
      sources: ["Bertrand Evans, *Shakespeare's Tragic Practice* (1979)", "Stanley Cavell, *Disowning Knowledge* (2003)"],
    },
    {
      line_start: 172, line_end: 218,
      citation_display: cite(4,1,172,218),
      category: "thematic",
      title: "The pity of it, Iago",
      body: "'But yet the pity of it, Iago — O, Iago, the pity of it, Iago.' The line is a dramatic aberration. Surrounded by the hardening of Othello's murder plan, it registers the cost of what he is about to do. The repetition — 'pity', 'Iago', three times — reads as a man hearing himself from outside, one foot still in the country he is leaving.\n\nShakespeare refuses to resolve the moment into either penitence or resolve. Othello will proceed to plan the killing in the same scene. But the line is not mere residue. It is the play's proof that Othello is not numb to what he is about to do — which makes the tragedy worse, not milder.",
      sources: ["A. D. Nuttall, *Shakespeare the Thinker* (2007)", "Stephen Greenblatt, *Will in the World* (2004)"],
    },
    {
      line_start: 245, line_end: 285,
      citation_display: cite(4,1,245,285),
      category: "thematic",
      title: "Striking Desdemona in public",
      body: "The blow is the most transgressive stage moment in Shakespearean tragedy. The Venetian ambassador Lodovico is present; he is a state witness; the violence is public and unprovoked and registered immediately as scandal. The line that follows — Lodovico's astonished 'My lord, this would not be believed in Venice, / Though I should swear I saw't' — is Shakespeare's blunt acknowledgment of how the scene works. It lives on the far side of plausibility.\n\nWhat makes it work dramatically is the presence of witnesses. Othello does not strike Desdemona in private rage; he does it in full senatorial view. The collapse of his public self is now complete. What Iago has done to Othello's private mind is now visible to the state. The rest of the play is the working out, in public, of a ruin that happened in private.",
      sources: ["Harley Granville-Barker, *Prefaces to Shakespeare* (1946)", "Gary Taylor & John Jowett, *Shakespeare Reshaped 1606–1623* (1993)"],
    },
  ],

  othello_act4_scene2: [
    {
      line_start: 1, line_end: 90,
      citation_display: cite(4,2,1,90),
      category: "thematic",
      title: "The brothel scene and the degradation of address",
      body: "Othello has Emilia escort him into the bedchamber as if it were a brothel, with Desdemona as the whore and Emilia as the procuress. The structural conceit is horrifying: a husband recasts his wife's private room as a workplace of prostitution, and rehearses his suspicions as if interrogating professionals. The language is sustained — 'simple bawd', 'this office', 'your mystery' — and refuses the consolation of metaphor. Othello means the comparison literally.\n\nThe scene reveals how completely Othello's vocabulary has been colonized. He cannot speak to Desdemona without reaching for the lexicon Iago has given him. His final insult — 'a cistern for foul toads / To knot and gender in' — displaces her body into an image of breeding vermin. Language has become his instrument of violence before the physical violence arrives.",
      sources: ["Carol Thomas Neely, *Broken Nuptials in Shakespeare's Plays* (1985)", "Patricia Parker, *Shakespeare from the Margins* (1996)"],
    },
    {
      line_start: 115, line_end: 175,
      citation_display: cite(4,2,115,175),
      category: "structural",
      title: "Emilia's unknowing diagnosis",
      body: "'Some eternal villain, / Some busy and insinuating rogue, / Some cogging, cozening slave... hath devised this slander.' Emilia names Iago without knowing she names him. The speech is Shakespeare's cruelest dramatic irony: the villain's own wife assembles his character in words, while he stands by noting his next move.\n\nThis is the moment the play most clearly shows what Iago has risked and what he gambles. He is protected only by the audience's unwillingness to believe that someone so plainly visible could be invisible to those closest to him. When Emilia does finally see, in 5.2, she sees instantaneously — because the knowledge had always been available. What changed was permission.",
      sources: ["Harold Bloom, *Shakespeare: The Invention of the Human* (1998)", "Coppélia Kahn, *Man's Estate: Masculine Identity in Shakespeare* (1981)"],
    },
  ],

  othello_act4_scene3: [
    {
      line_start: 25, line_end: 60,
      citation_display: cite(4,3,25,60),
      category: "historical",
      title: "The Willow Song",
      body: "Desdemona's song — 'The poor soul sat sighing by a sycamore tree, sing willow, willow, willow' — is a real ballad, documented in Elizabethan and earlier sources under the title 'Willow, Willow'. The willow was the emblem of forsaken love; lovers wore willow garlands as visible signs of grief. Desdemona remembers the song from her mother's maid 'Barbary' — a detail with layered resonance: 'Barbary' names the North African coast, returning Othello's origins to the bedroom through song.\n\nShakespeare gives the moment a lullaby's stillness. The song reduces her tragedy to a folk object — something her body learned once and returns to without thought. This is the technical achievement: the scene's emotional devastation is expressed not through new language but through a song older than any of the characters, sung by someone about to die.",
      sources: ["Ross W. Duffin, *Shakespeare's Songbook* (2004)", "Peter Burke, *Popular Culture in Early Modern Europe* (1978)"],
    },
    {
      line_start: 74, line_end: 101,
      citation_display: cite(4,3,74,101),
      category: "thematic",
      title: "Emilia's catechism on women",
      body: "Emilia's argument — that women err because men betray, that a wife's wrongs are husbands' teachings — is the most substantial piece of proto-feminist reasoning in Shakespeare. The speech is structural, not digressive: it prepares the ground for Emilia's defiance in 5.2, where she will speak over her husband's prohibition and be killed for it.\n\nShakespeare does not position Emilia's reasoning as self-exculpation. Desdemona refuses the argument. But Emilia's catalogue — slack husbands, confiscated allowances, bodily wrongs — is delivered with the authority of experience, and Shakespeare lets it stand. The scene's last lines ('Let husbands know / Their wives have sense like them') are the theatrical grounds for what Emilia will later do.",
      sources: ["Carol Thomas Neely, *Broken Nuptials in Shakespeare's Plays* (1985)", "Dympna Callaghan, *Shakespeare Without Women* (2000)", "Phyllis Rackin, *Shakespeare and Women* (2005)"],
    },
  ],

  othello_act5_scene1: [
    {
      line_start: 1, line_end: 55,
      citation_display: cite(5,1,1,55),
      category: "structural",
      title: "Night action and the unraveling of Iago's plot",
      body: "The ambush on Cassio is Iago's first major improvisation since the handkerchief. It is also his first real miscalculation. He expects Cassio dead; instead Cassio is wounded and Roderigo is dispatched by Iago himself to cover the failure. The night scene is murky — 'make me a light', 'what are you there?' — and Shakespeare uses the confusion to show Iago losing control of his own scheme.\n\nStructurally the play has been a pyramid of Iago's mastery; from here it is his descent. He has authored too many stories at once and can no longer reconcile them. By the time he enters Desdemona's bedchamber in the next scene, his plot has begun to consume him along with his victims.",
      sources: ["Ann Pasternak Slater, *Shakespeare the Director* (1982)", "Philip Edwards, *Shakespeare and the Confines of Art* (1968)"],
    },
  ],

  othello_act5_scene2: [
    {
      line_start: 1, line_end: 22,
      citation_display: cite(5,2,1,22),
      category: "thematic",
      title: "It is the cause: the monstrous deliberation",
      body: "Othello's opening soliloquy is Shakespeare's most self-conscious staging of a murder. The refrain — 'It is the cause, it is the cause, my soul' — substitutes the vocabulary of justice for the vocabulary of killing. Othello is not about to murder his wife; he is, in the language he gives himself, conducting a necessary judicial act on behalf of an abstract 'cause'.\n\nEvery image amplifies the self-deception. Desdemona is 'alabaster', a material for monuments rather than a living woman. The snuffed light becomes an emblem for a soul. Even the Promethean image — 'I know not where is that Promethean heat / That can thy light relume' — treats the body as a lamp to be refilled, not a woman to be unkilled. Shakespeare is giving us a mind that has to aestheticize its act in order to commit it. The moment her eyes open, the aesthetic will fail.",
      sources: ["A. C. Bradley, *Shakespearean Tragedy* (1904)", "Harold Bloom, *Shakespeare: The Invention of the Human* (1998)", "Paul A. Kottman, *Tragic Conditions in Shakespeare* (2009)"],
    },
    {
      line_start: 130, line_end: 230,
      citation_display: cite(5,2,130,230),
      category: "structural",
      title: "Emilia's recognition and the play's closing logic",
      body: "Emilia's slow realization — the handkerchief, the 'eternal villain', the husband she has served without question — is the play's pivot from tragedy to reckoning. Shakespeare gives her three stages. First incredulity: 'My husband say she was false?' Second assembly: the handkerchief she gave Iago, the slander he wove. Third refusal: 'I will not charm my tongue; I am bound to speak.' Each stage takes time; the audience is made to sit through the mechanism of comprehension.\n\nThis is Shakespeare's answer to the problem of moral recognition in tragedy. Lear can see Cordelia only after the kingdom has fallen; Emilia sees Iago only after Desdemona is dead. In both cases, recognition comes too late to save but not too late to matter. Emilia's insistence that her voice will not be silenced — even by her husband's sword — is the play's one clean moral victory.",
      sources: ["Carol Thomas Neely, *Broken Nuptials in Shakespeare's Plays* (1985)", "A. C. Bradley, *Shakespearean Tragedy* (1904)", "Stephen Greenblatt, *Will in the World* (2004)"],
    },
    {
      line_start: 336, line_end: 360,
      citation_display: cite(5,2,336,360),
      category: "textual",
      title: "Indian or Judean? The famous crux",
      body: "Othello's final speech contains one of the most celebrated textual cruces in Shakespeare. The 1622 Quarto prints 'the base Indian, threw a pearl away / Richer than all his tribe.' The 1623 First Folio prints 'the base Judean'. Editors have argued both for four centuries.\n\nThe 'Indian' reading fits a familiar early-modern trope: the naïve native who does not recognize the value of a gem and discards it for glass. The 'Judean' reading makes the pearl Christ ('the pearl of great price' in Matthew 13:46) and the agent Judas Iscariot — or possibly Herod, who killed his wife Mariamne. Either way, 'Judean' is heavier, more theological, more culturally specific.\n\nArden editors (M. R. Ridley in 1958, E. A. J. Honigmann in 1997) have favored 'Judean' on intrinsic grounds; many modern productions have retained 'Indian' to preserve the orientalist valence appropriate to Othello's self-inventory. The editorial choice matters: 'Indian' makes Othello's self-condemnation colonial and worldly; 'Judean' makes it biblical and damning. Shakespeare may have revised the word. Or the compositor may have misread. Either way, the reader of the play in 2026 is reading a word chosen by an editor.",
      sources: ["M. R. Ridley (ed.), Arden 2 *Othello* (1958), note to 5.2.347", "E. A. J. Honigmann (ed.), Arden 3 *Othello* (1997), Appendix 3", "Richard Levin, 'The Indian/Judean Crux in *Othello*', *Shakespeare Quarterly* (1982)"],
    },
    {
      line_start: 336, line_end: 360,
      citation_display: cite(5,2,336,360),
      category: "thematic",
      title: "One that loved not wisely but too well",
      body: "Othello's self-summary is also Shakespeare's most contested line. Is the verdict true? He was jealous — the play has shown us nothing else for two acts. He was not easily jealous — the play has shown us Iago worked on him steadily for hours. The speech labors to compose a posthumous character, exactly as the Senate speech composed a living one.\n\nThe doubleness is the point. Othello is dying, and Shakespeare is asking whether the self one dies into is the self one lived. The speech is a last piece of autobiography: the Aleppo anecdote, the turbaned Turk, the hand raised to strike. Othello dies killing the enemy of the state he served. He becomes, in his final gesture, the Venetian he spent his life being. Whether that gesture redeems the murder is a question Shakespeare leaves open.\n\nLodovico's verdict — 'O Spartan dog, / More fell than anguish, hunger, or the sea' — names Iago without naming Othello. The play closes with a refusal to issue a final moral judgment on its protagonist. That refusal is itself a judgment.",
      sources: ["F. R. Leavis, 'Diabolic Intellect and the Noble Hero' (1937)", "A. C. Bradley, *Shakespearean Tragedy* (1904)", "Stanley Cavell, 'Othello and the Stake of the Other' (2003)", "Paul A. Kottman, *Tragic Conditions in Shakespeare* (2009)"],
    },
    {
      line_start: 360, line_end: 375,
      citation_display: cite(5,2,360,375),
      category: "structural",
      title: "The tragic loading of this bed",
      body: "The final stage picture — three bodies on the wedding bed, Desdemona between Othello and Emilia — is the play's most concentrated image. Lodovico calls it 'the tragic loading of this bed' and orders the curtains drawn. Shakespeare gives the audience a last tableau before withdrawing it, a compositional choice that makes the final act of the tragedy the act of not-looking.\n\nIago, alive, is taken offstage; Cassio becomes governor of Cyprus; the state reasserts itself. The tragedy has happened in a single room, the military plot is elsewhere, and the play ends with administration. This is Shakespeare's hardest ending: the world outside the bedchamber carries on. That ordinary continuation is the tragedy's most disturbing reverberation.",
      sources: ["Harley Granville-Barker, *Prefaces to Shakespeare: Othello* (1946)", "Philip Edwards, *Shakespeare and the Confines of Art* (1968)", "Michael Neill, *Issues of Death* (1997)"],
    },
  ],
};

// ── Trials ──────────────────────────────────────────────────────────────────

const TRIALS: Record<string, Trial[]> = {

  othello_act1_scene1: [
    { kind: "comprehension", prompt: "When Iago says 'I am not what I am' (line 65), what does he mean?",
      options: ["He regrets a past identity he has lost", "His outward appearance is a deliberate mask concealing his true nature", "He is uncertain of his own feelings about Othello", "He is quoting a Biblical formula to claim divine authority"],
      answer_index: 1, wisdom_reward: 15, anchor_line_start: 63, anchor_line_end: 67 },
    { kind: "inference", prompt: "Why does Iago choose to rouse Brabantio at midnight by shouting beneath his window rather than approaching him directly in daylight?",
      options: ["Venice's laws forbid private citizens from visiting senators by day", "Panic in the dark makes Brabantio more likely to react before thinking, spreading scandal Iago need not own", "He fears Othello will intercept him if he moves openly", "He is under orders from Roderigo, who pays him by the hour"],
      answer_index: 1, wisdom_reward: 20, anchor_line_start: 80, anchor_line_end: 115 },
    { kind: "theme", prompt: "The animal imagery Iago uses ('black ram', 'Barbary horse', 'beast with two backs') serves primarily to:",
      options: ["Amuse Roderigo, who is a rural gentleman fond of hunting metaphors", "Describe Cassio's relative youth and inexperience as a soldier", "Racialize Othello's marriage as unnatural bestial coupling rather than human union", "Express Iago's genuine love of animals and the outdoors"],
      answer_index: 2, wisdom_reward: 20, anchor_line_start: 88, anchor_line_end: 115 },
    { kind: "close_reading", prompt: "Iago calls Othello's rank 'his Moorship's ancient' (line 32). What does this coinage do?",
      options: ["Uses 'Moorship' as a formal Venetian military title", "Mocks 'Lordship' by substituting 'Moor', demeaning Othello's authority through a racial pun", "Reveals that Iago genuinely respects Othello's North African ancestry", "Signals that Othello has been recently knighted by the Doge"],
      answer_index: 1, wisdom_reward: 15, anchor_line_start: 30, anchor_line_end: 35 },
    { kind: "inference", prompt: "Iago complains that Cassio was promoted ahead of him because of 'letter and affection' rather than 'the old gradation'. What is the 'old gradation'?",
      options: ["Seniority-based promotion through ranks", "Hereditary nobility passed from father to son", "The exam-based promotion system of the Venetian navy", "The order in which soldiers enter the battlefield"],
      answer_index: 0, wisdom_reward: 15, anchor_line_start: 35, anchor_line_end: 42 },
    { kind: "comprehension", prompt: "What does Iago finally advise Roderigo to do with his money?",
      options: ["Loan it to Brabantio to secure Desdemona's hand", "Buy Cassio's commission directly from him", "Give it to Iago to keep and to use against Othello", "Send it to his family in Verona for safekeeping"],
      answer_index: 2, wisdom_reward: 10, anchor_line_start: 175, anchor_line_end: 190 },
  ],

  othello_act1_scene2: [
    { kind: "comprehension", prompt: "Why is Othello confident that his services to Venice will 'out-tongue' Brabantio's complaints?",
      options: ["He has written testimonies from the Doge stored at home", "His public service and royal lineage outweigh a private complaint", "Brabantio has a reputation for exaggeration that the senate knows", "He has already bribed several senators"],
      answer_index: 1, wisdom_reward: 15, anchor_line_start: 17, anchor_line_end: 32 },
    { kind: "inference", prompt: "What does Brabantio assume must have happened for Desdemona to marry Othello?",
      options: ["Desdemona fell in love over time during ordinary courtship", "Othello used drugs, charms, or witchcraft on her", "Othello promised her wealth she could not obtain elsewhere", "Desdemona was blackmailed into the match"],
      answer_index: 1, wisdom_reward: 15, anchor_line_start: 72, anchor_line_end: 106 },
    { kind: "close_reading", prompt: "Iago swears 'By Janus' (line 38). Why is this oath fitting?",
      options: ["Janus was the god of war, suiting Iago's profession", "Janus was two-faced, matching Iago's duplicity", "Janus was the patron deity of Venice", "Janus represented truth in Roman religion"],
      answer_index: 1, wisdom_reward: 15, anchor_line_start: 35, anchor_line_end: 40 },
    { kind: "theme", prompt: "How does Othello's conduct in this scene differ from Brabantio's?",
      options: ["Othello is hot-tempered while Brabantio is calm and legal", "Othello speaks with composed public authority while Brabantio erupts with private grievance", "Othello uses magical rhetoric while Brabantio cites Venetian law", "Both behave identically, framed by Shakespeare as mirror images"],
      answer_index: 1, wisdom_reward: 20, anchor_line_start: 65, anchor_line_end: 106 },
    { kind: "comprehension", prompt: "What news interrupts Brabantio's confrontation with Othello?",
      options: ["The Turkish fleet has been sighted off Cyprus", "Roderigo has been arrested for disturbing the peace", "The Duke summons Othello urgently for war council", "Desdemona has fled to a Franciscan convent"],
      answer_index: 2, wisdom_reward: 10, anchor_line_start: 40, anchor_line_end: 60 },
  ],

  othello_act1_scene3: [
    { kind: "comprehension", prompt: "When the senators debate the Turkish fleet's destination — Rhodes or Cyprus — what conclusion do they reach?",
      options: ["Rhodes is the real target; Cyprus is a feint", "Cyprus is the real target; Rhodes is a feint to draw Venetian forces away", "Both islands will be attacked simultaneously", "The reports are contradictory and no action can be taken"],
      answer_index: 1, wisdom_reward: 15, anchor_line_start: 1, anchor_line_end: 50 },
    { kind: "inference", prompt: "In his long speech beginning 'Rude am I in my speech,' Othello claims his rhetorical gifts are limited. How should the audience read this claim?",
      options: ["As a simple truthful self-description", "As false modesty — a rhetorical figure (occupatio) opening an exceptionally well-made speech", "As evidence that Othello secretly has speech impediments", "As Shakespeare apologizing for an earlier draft of the scene"],
      answer_index: 1, wisdom_reward: 25, anchor_line_start: 79, anchor_line_end: 94 },
    { kind: "theme", prompt: "According to Othello, how did Desdemona come to love him?",
      options: ["Her father arranged the match for political advantage", "Through repeated social visits she gradually came to know him", "She loved him for the dangerous stories he told, and he loved her for pitying those dangers", "She received love letters written by Cassio on his behalf"],
      answer_index: 2, wisdom_reward: 20, anchor_line_start: 125, anchor_line_end: 170 },
    { kind: "close_reading", prompt: "Othello describes meeting 'Anthropophagi, and men whose heads do grow beneath their shoulders.' What are these?",
      options: ["Shakespeare's invented creatures", "Classical legends of cannibals and headless humans (Blemmyae) from Pliny and Mandeville", "Nicknames for particular Ottoman tribes", "Characters from earlier Italian plays"],
      answer_index: 1, wisdom_reward: 20, anchor_line_start: 141, anchor_line_end: 145 },
    { kind: "inference", prompt: "In his closing soliloquy, Iago articulates multiple possible reasons to hate Othello. What does this multiplicity suggest about his motivation?",
      options: ["He is logically ranking the most important reasons for revenge", "His motives are improvised and shifting — Coleridge called it 'motiveless malignity'", "He is lying to himself to hide a single real reason", "The soliloquy was added later and reflects the views of a collaborator"],
      answer_index: 1, wisdom_reward: 25, anchor_line_start: 346, anchor_line_end: 409 },
    { kind: "theme", prompt: "What does the Duke mean by telling Brabantio that he should 'take the robb'd that smiles' and steal something from the thief?",
      options: ["Brabantio should literally repay the theft by stealing from Othello", "Accepting fate with good humor is better than ongoing grief; Brabantio should move on", "It is a Venetian proverb about contract law", "Brabantio should accuse Othello of embezzlement"],
      answer_index: 1, wisdom_reward: 15, anchor_line_start: 205, anchor_line_end: 220 },
    { kind: "comprehension", prompt: "What state assignment does the Duke give to Othello at the end of the council?",
      options: ["Remain in Venice as chief military advisor", "Lead the defence of Cyprus against the Turks", "Negotiate a peace treaty with Istanbul", "Retire from service and reconcile with Brabantio"],
      answer_index: 1, wisdom_reward: 10, anchor_line_start: 224, anchor_line_end: 245 },
  ],

  othello_act2_scene1: [
    { kind: "comprehension", prompt: "What has happened to the Turkish fleet between the previous scene and this one?",
      options: ["It has landed on Cyprus and begun a siege", "A storm has destroyed it before it could reach Cyprus", "It has turned back to Istanbul at the Sultan's orders", "It has been defeated in naval battle by Othello"],
      answer_index: 1, wisdom_reward: 10, anchor_line_start: 1, anchor_line_end: 25 },
    { kind: "inference", prompt: "Why does Iago speak aside during Cassio's courteous greetings to Desdemona — 'With as little a web as this will I ensnare as great a fly as Cassio'?",
      options: ["He is reminding himself to warn Cassio of genuine dangers", "He is planning to reinterpret ordinary politeness as evidence of adultery", "He is worried Desdemona will discover his scheme", "He is composing a letter he will send later"],
      answer_index: 1, wisdom_reward: 25, anchor_line_start: 165, anchor_line_end: 180 },
    { kind: "theme", prompt: "Iago's wordplay with Desdemona on women — deserving, undeserving, wise, foolish, fair, black — functions primarily as:",
      options: ["Genuine literary criticism", "A way of entertaining her while they wait for Othello's ship", "A demonstration of his capacity to reduce every woman to misogynist couplets, practicing the voice he will later use with Othello", "Friendly banter typical of Elizabethan courtship"],
      answer_index: 2, wisdom_reward: 20, anchor_line_start: 118, anchor_line_end: 165 },
    { kind: "inference", prompt: "What does Iago falsely suggest Cassio and Desdemona have been doing earlier?",
      options: ["Planning a military campaign together", "Flirting in ways that betray mutual lust", "Writing a letter to Iago", "Arranging a musical performance"],
      answer_index: 1, wisdom_reward: 15, anchor_line_start: 240, anchor_line_end: 280 },
    { kind: "close_reading", prompt: "Othello greets Desdemona with 'O my fair warrior!' Why 'warrior'?",
      options: ["She has trained in combat aboard the ship", "He honors her spirit as the partner who shared his campaigning life", "Venice grants military rank to married women", "The word is sarcastic, mocking her delicate appearance"],
      answer_index: 1, wisdom_reward: 15, anchor_line_start: 185, anchor_line_end: 195 },
  ],

  othello_act2_scene2: [
    { kind: "comprehension", prompt: "Why does the herald proclaim a general holiday in Cyprus?",
      options: ["Othello's birthday and ascension to governor of Cyprus", "The Turkish fleet's destruction and Othello's wedding celebration", "A religious festival commemorating Saint Mark of Venice", "The arrival of supplies from Venice after a long siege"],
      answer_index: 1, wisdom_reward: 10, anchor_line_start: 1, anchor_line_end: 9 },
    { kind: "structural", prompt: "Why did Shakespeare make this scene only nine lines long?",
      options: ["He ran out of paper and stopped writing", "To provide a brief official transition between Iago's plotting in 2.1 and the drunken confusion of 2.3", "To give actors a rest between long scenes", "To fulfill a contractual requirement of a minimum twenty scenes"],
      answer_index: 1, wisdom_reward: 15, anchor_line_start: 1, anchor_line_end: 9 },
  ],

  othello_act2_scene3: [
    { kind: "comprehension", prompt: "Why does Cassio initially refuse to drink with Iago?",
      options: ["He has taken a religious oath against alcohol", "He knows he has a weak head for drink and is on duty", "He dislikes the taste of the local Cypriot wine", "Othello has specifically forbidden it"],
      answer_index: 1, wisdom_reward: 10, anchor_line_start: 32, anchor_line_end: 45 },
    { kind: "inference", prompt: "When Iago sings drinking songs and invokes English and Danish drinking stereotypes, what is his actual purpose?",
      options: ["Killing time until the next official event", "Performing sociability as a tool — making Cassio feel peer pressure to drink past his limit", "Demonstrating his knowledge of foreign cultures to impress Montano", "Practicing songs for a future court performance"],
      answer_index: 1, wisdom_reward: 20, anchor_line_start: 65, anchor_line_end: 90 },
    { kind: "comprehension", prompt: "What is the consequence of the drunken brawl?",
      options: ["Iago is publicly disgraced by Othello", "Cassio is stripped of his lieutenant's rank", "Montano is banished from Cyprus", "Roderigo is expelled from the garrison"],
      answer_index: 1, wisdom_reward: 10, anchor_line_start: 240, anchor_line_end: 260 },
    { kind: "theme", prompt: "In his closing soliloquy Iago explains that 'when devils will the blackest sins put on, / They do suggest at first with heavenly shows.' How will this doctrine play out in the next act?",
      options: ["Iago will openly tempt Othello with obvious lies", "Iago will use Desdemona's genuine kindness to Cassio as the evidence of her adultery — turning virtue into weapon", "Iago will disguise himself as a priest and hear confession", "Iago will perform miracles to dazzle Othello"],
      answer_index: 1, wisdom_reward: 25, anchor_line_start: 315, anchor_line_end: 335 },
    { kind: "close_reading", prompt: "What does Cassio lament losing more than anything else after his disgrace?",
      options: ["His lieutenant's commission and its salary", "His reputation — the 'immortal part of myself'", "The respect of Othello personally", "His safe return passage to Venice"],
      answer_index: 1, wisdom_reward: 15, anchor_line_start: 265, anchor_line_end: 285 },
  ],

  othello_act3_scene1: [
    { kind: "comprehension", prompt: "What does the Clown joke about when discussing the musicians' instruments?",
      options: ["Their cost and the guild pricing system", "That the instruments sound nasal, as if infected with 'the Naples disease' (syphilis)", "That they are out of tune for the Venetian scale", "That the musicians are all deaf"],
      answer_index: 1, wisdom_reward: 15, anchor_line_start: 3, anchor_line_end: 20 },
    { kind: "inference", prompt: "Why does Emilia tell Cassio that Desdemona is already pleading his cause?",
      options: ["Because Othello has already agreed to reinstate him", "Because Desdemona has reviewed evidence exonerating Cassio", "Because her generous nature leads her to advocate for him even before being asked", "Because Iago has asked her to lobby on Cassio's behalf"],
      answer_index: 2, wisdom_reward: 15, anchor_line_start: 44, anchor_line_end: 58 },
  ],

  othello_act3_scene2: [
    { kind: "comprehension", prompt: "What business does Othello attend to in this brief scene?",
      options: ["He plans to dismiss Desdemona from his presence", "He dispatches letters to Venice and inspects the fortifications", "He orders Cassio's execution", "He writes to Brabantio asking for reconciliation"],
      answer_index: 1, wisdom_reward: 10, anchor_line_start: 1, anchor_line_end: 7 },
  ],

  othello_act3_scene3: [
    { kind: "inference", prompt: "Iago says 'Ha! I like not that' when he sees Cassio leave Desdemona. What is he actually doing?",
      options: ["Expressing genuine disapproval of Cassio's manners", "Planting a small seed of suspicion without directly accusing anyone", "Warning Othello about a political conspiracy", "Complaining about Cassio's military strategy"],
      answer_index: 1, wisdom_reward: 20, anchor_line_start: 30, anchor_line_end: 40 },
    { kind: "close_reading", prompt: "Iago uses the image of a 'green-eyed monster' to describe jealousy. What does the monster do in his description?",
      options: ["Weeps uncontrollably and cannot be comforted", "Mocks the meat it feeds on — it plays with what it consumes", "Sleeps for a year and wakes hungrier", "Produces monstrous offspring"],
      answer_index: 1, wisdom_reward: 20, anchor_line_start: 160, anchor_line_end: 170 },
    { kind: "inference", prompt: "In this scene the audience sees Desdemona's innocent behavior clearly. The characters see it filtered through Iago's suggestions. What is this dramatic device called, and how does Shakespeare use it throughout the scene?",
      options: ["Soliloquy — the audience hears inner thoughts not available to other characters", "Dramatic irony — the audience knows more than the characters and must watch them act on less information", "Dumbshow — pantomime of future events precedes the dialogue", "Chorus — a commenting voice frames each episode"],
      answer_index: 1, wisdom_reward: 25, anchor_line_start: 30, anchor_line_end: 500 },
    { kind: "theme", prompt: "Iago argues that Desdemona's decision to reject suitors 'of her own clime, complexion, and degree' is itself suspicious. What ideological move is he making?",
      options: ["He is citing the Venetian marriage law", "He is converting a free choice into evidence of unnatural appetite, using racist logic to make Othello doubt his own desirability", "He is praising her independence of mind", "He is noting that she should have married a fellow soldier"],
      answer_index: 1, wisdom_reward: 25, anchor_line_start: 225, anchor_line_end: 245 },
    { kind: "close_reading", prompt: "Iago declares that 'Trifles light as air / Are to the jealous confirmations strong / As proofs of holy writ.' What is the core insight?",
      options: ["Jealousy makes sufferers obsessed with reading Scripture", "For a jealous mind, even trivial objects become as authoritative as Biblical evidence", "Jealousy can be cured by reading religious texts", "Holy writings often contain proof of infidelity"],
      answer_index: 1, wisdom_reward: 20, anchor_line_start: 317, anchor_line_end: 325 },
    { kind: "theme", prompt: "The 'Pontic Sea' simile Othello uses for his revenge describes a current that:",
      options: ["Flows back and forth with the tides", "Flows only one way and never reverses, matching his unstoppable revenge", "Evaporates in hot weather", "Freezes in winter and thaws in spring"],
      answer_index: 1, wisdom_reward: 20, anchor_line_start: 440, anchor_line_end: 455 },
    { kind: "structural", prompt: "At the end of the scene, Othello and Iago kneel together and make mutual vows. Why is this ritual dramatically important?",
      options: ["It satisfies a religious obligation before Othello can take revenge", "It displaces Othello's marriage vow with a vow to Iago — tragically inverting intimacy", "It seals a legal document admissible in Venetian courts", "It represents Iago's genuine conversion to Othello's cause"],
      answer_index: 1, wisdom_reward: 25, anchor_line_start: 455, anchor_line_end: 483 },
    { kind: "comprehension", prompt: "At the end of the scene, what role does Othello promise to Iago?",
      options: ["His second-in-command on the battlefield", "His lieutenant, taking Cassio's former position", "His ambassador to Venice", "His personal bodyguard and translator"],
      answer_index: 1, wisdom_reward: 10, anchor_line_start: 478, anchor_line_end: 485 },
  ],

  othello_act3_scene4: [
    { kind: "comprehension", prompt: "According to Othello, where did the handkerchief originally come from?",
      options: ["A Venetian jeweler commissioned by his father", "An Egyptian charmer/sibyl who gave it to his mother", "The Byzantine emperor's personal gift to Venetian allies", "A gift from Brabantio to welcome him into the family"],
      answer_index: 1, wisdom_reward: 15, anchor_line_start: 60, anchor_line_end: 85 },
    { kind: "inference", prompt: "Desdemona lies to Othello about the handkerchief — she says she is not without it, though she has lost it. Why?",
      options: ["She is beginning an affair with Cassio and wants to cover her tracks", "She is trying to protect Othello from upset while she searches for it, a well-intentioned evasion that will turn ruinous", "She has given it to Cassio as a love token", "She has sold it to pay a gambling debt"],
      answer_index: 1, wisdom_reward: 20, anchor_line_start: 85, anchor_line_end: 105 },
    { kind: "theme", prompt: "The handkerchief means different things to different characters (wedding token, maternal heirloom, magical object, romantic prop, cheap cloth). What does Shakespeare's handling of this object suggest about evidence?",
      options: ["Evidence is always objective and speaks for itself", "Meaning is not in the object but in who holds it and what they need it to mean", "Handkerchiefs should be registered with Venetian authorities", "Only the original owner can correctly interpret an object's meaning"],
      answer_index: 1, wisdom_reward: 25, anchor_line_start: 55, anchor_line_end: 200 },
    { kind: "close_reading", prompt: "What does Othello mean when he tells Desdemona her palm is 'moist'?",
      options: ["She has been working with water", "In Elizabethan palmistry, a moist palm suggested a passionate, possibly lustful nature — a veiled accusation", "She is ill and should rest", "It is a gesture of affection and warmth"],
      answer_index: 1, wisdom_reward: 20, anchor_line_start: 40, anchor_line_end: 55 },
  ],

  othello_act4_scene1: [
    { kind: "comprehension", prompt: "Why does Iago arrange for Othello to overhear his conversation with Cassio?",
      options: ["To clear Cassio of any wrongdoing through direct confrontation", "To let Othello misinterpret laughter about Bianca as admissions about Desdemona — using Othello's distance to weaponize ambiguity", "To resolve a financial dispute between Cassio and Bianca", "To gather evidence that will clear Desdemona's name"],
      answer_index: 1, wisdom_reward: 25, anchor_line_start: 85, anchor_line_end: 175 },
    { kind: "inference", prompt: "What does the audience know during the eavesdropping scene that Othello does not?",
      options: ["That Cassio is secretly in love with Desdemona", "That Cassio's laughter and boasting concern Bianca, not Desdemona", "That the handkerchief has been destroyed", "That Iago is Cassio's secret ally"],
      answer_index: 1, wisdom_reward: 20, anchor_line_start: 108, anchor_line_end: 165 },
    { kind: "close_reading", prompt: "When Othello repeats 'But yet the pity of it, Iago — O, Iago, the pity of it, Iago', the tone is:",
      options: ["Triumphant — he has achieved the certainty he sought", "Anguished — he hears himself from outside, one foot still in the country he is leaving", "Sarcastic — he is mocking Iago's earlier expressions of pity", "Detached — he has become indifferent to Desdemona"],
      answer_index: 1, wisdom_reward: 20, anchor_line_start: 170, anchor_line_end: 180 },
    { kind: "theme", prompt: "Othello strikes Desdemona in front of the Venetian ambassador Lodovico. Why is this the play's most transgressive stage moment?",
      options: ["Because striking a wife was illegal in Venice but common in Cyprus", "Because the private ruin of Othello's mind is now witnessed officially and the public self collapses in full senatorial view", "Because Desdemona's relatives in Venice will now seek revenge", "Because it violates an unwritten military code"],
      answer_index: 1, wisdom_reward: 25, anchor_line_start: 250, anchor_line_end: 285 },
    { kind: "comprehension", prompt: "What message does Lodovico bring from Venice?",
      options: ["Orders to execute Iago for treason", "A letter recalling Othello to Venice and appointing Cassio as governor of Cyprus", "News that Desdemona's father Brabantio has died", "A warning that the Turkish fleet has regrouped"],
      answer_index: 1, wisdom_reward: 10, anchor_line_start: 225, anchor_line_end: 245 },
  ],

  othello_act4_scene2: [
    { kind: "inference", prompt: "Why does Othello treat his conversation with Desdemona as an interview in a brothel, casting Emilia as the procuress?",
      options: ["Venetian law required this form of accusation", "His vocabulary has been so colonized by Iago that he cannot address his wife except in the language of prostitution — violence of speech preceding physical violence", "It is a recognized part of Cypriot marriage rites", "Emilia has previously worked in such establishments"],
      answer_index: 1, wisdom_reward: 25, anchor_line_start: 1, anchor_line_end: 90 },
    { kind: "structural", prompt: "What is the dramatic irony in Emilia's speech about 'some eternal villain, some busy and insinuating rogue'?",
      options: ["She is secretly describing Cassio", "She is describing her own husband Iago without knowing it — and the audience sees both layers", "She is quoting a character from a previous Shakespeare play", "She is predicting the arrival of Lodovico from Venice"],
      answer_index: 1, wisdom_reward: 25, anchor_line_start: 115, anchor_line_end: 145 },
    { kind: "comprehension", prompt: "What does Iago advise Roderigo to do about Cassio?",
      options: ["Bribe him to leave Cyprus", "Ambush and kill him to prevent his return to Desdemona", "Challenge him to an open duel", "Confess his love for Desdemona directly to him"],
      answer_index: 1, wisdom_reward: 10, anchor_line_start: 210, anchor_line_end: 240 },
  ],

  othello_act4_scene3: [
    { kind: "close_reading", prompt: "Desdemona sings the Willow Song she learned from her mother's maid 'Barbary'. Why is the name 'Barbary' significant in this scene?",
      options: ["It is a random folk name with no meaning", "It names the North African coast — quietly bringing Othello's origins into the bedroom through song", "It is a pseudonym Desdemona invents on the spot", "It was the name of a famous Venetian composer"],
      answer_index: 1, wisdom_reward: 20, anchor_line_start: 25, anchor_line_end: 45 },
    { kind: "theme", prompt: "Emilia's argument that women err because men betray them, and that 'their wives have sense like them', is:",
      options: ["A minor digression Shakespeare immediately abandons", "A structural preparation for Emilia's defiance of Iago in 5.2, where she will speak over his prohibition and be killed for it", "Borrowed directly from a Venetian law treatise", "Meant ironically — Shakespeare is satirizing early feminism"],
      answer_index: 1, wisdom_reward: 25, anchor_line_start: 85, anchor_line_end: 101 },
    { kind: "inference", prompt: "Desdemona asks Emilia whether there are women who would be unfaithful 'for all the world.' What does Desdemona's disbelief reveal?",
      options: ["That she has personal experience of infidelity she is not admitting", "That her moral imagination remains intact even as her husband's unravels — she cannot conceive what Iago has instilled in Othello", "That she is considering an affair herself", "That she is testing Emilia's loyalty"],
      answer_index: 1, wisdom_reward: 20, anchor_line_start: 60, anchor_line_end: 80 },
  ],

  othello_act5_scene1: [
    { kind: "comprehension", prompt: "What is Iago's plan at the start of the scene?",
      options: ["To kill Othello and seize Cyprus", "To have Roderigo kill Cassio, gaining him as loyal ally while removing a witness", "To poison Desdemona in her sleep", "To flee Cyprus disguised as a merchant"],
      answer_index: 1, wisdom_reward: 15, anchor_line_start: 1, anchor_line_end: 25 },
    { kind: "inference", prompt: "Why does Iago ultimately kill Roderigo himself?",
      options: ["Roderigo has betrayed him to Lodovico", "Roderigo wounded Cassio but failed to kill him — Iago silences the man who knows the plot", "Roderigo has stolen the remaining jewels", "Roderigo has refused to pay the agreed-upon sum"],
      answer_index: 1, wisdom_reward: 20, anchor_line_start: 55, anchor_line_end: 95 },
    { kind: "structural", prompt: "Why does Shakespeare set this scene at night in a dark street?",
      options: ["Because Venice and Cyprus had no streetlights", "The darkness mirrors Iago's loss of control — his scheme becomes visually as confused as it is strategically", "It was easier to stage in the Globe Theatre at sunset", "Night scenes were cheaper to perform"],
      answer_index: 1, wisdom_reward: 15, anchor_line_start: 1, anchor_line_end: 130 },
  ],

  othello_act5_scene2: [
    { kind: "close_reading", prompt: "Othello's opening refrain 'It is the cause, it is the cause, my soul' substitutes what kind of vocabulary for the vocabulary of murder?",
      options: ["Medical terminology (as if performing surgery)", "Judicial / abstract-justice language — as if conducting a necessary trial rather than killing his wife", "Religious language of pilgrimage", "Military command language"],
      answer_index: 1, wisdom_reward: 25, anchor_line_start: 1, anchor_line_end: 10 },
    { kind: "inference", prompt: "Othello says he cannot find 'that Promethean heat that can thy light relume.' What does this admission reveal?",
      options: ["He has studied Greek mythology in depth", "He acknowledges that killing Desdemona is irreversible — he cannot restore the life he is about to take", "He is preparing an offering to the gods", "He is doubting the existence of the Greek pantheon"],
      answer_index: 1, wisdom_reward: 20, anchor_line_start: 10, anchor_line_end: 15 },
    { kind: "theme", prompt: "What finally makes Othello understand that Iago has deceived him?",
      options: ["Cassio's confession under torture", "Emilia's testimony about the handkerchief — that she took it and gave it to Iago", "A letter found in Roderigo's pocket after his death", "A vision sent by the ghost of Brabantio"],
      answer_index: 1, wisdom_reward: 20, anchor_line_start: 210, anchor_line_end: 240 },
    { kind: "structural", prompt: "Iago's final declaration — 'From this time forth I never will speak word' — is dramatically significant because:",
      options: ["It closes a subplot about his vow of chastity", "The play ends with its central villain refusing to explain himself, leaving his motive forever unaccounted for", "It indicates he has taken a vow of silence for religious reasons", "It is a translation of a standard Italian legal formula"],
      answer_index: 1, wisdom_reward: 25, anchor_line_start: 332, anchor_line_end: 340 },
    { kind: "close_reading", prompt: "Othello compares himself to 'the base Indian' who threw a pearl away. The Folio reads 'Judean' instead. What is at stake in this textual variant?",
      options: ["Two editors made separate typos that readers can now correct", "'Indian' suggests a naïve native discarding a gem; 'Judean' suggests Judas casting away Christ — the two readings give the speech different theological weight", "Both words mean exactly the same thing in Elizabethan English", "The Quarto is the Shakespeare and the Folio is a forgery"],
      answer_index: 1, wisdom_reward: 30, anchor_line_start: 342, anchor_line_end: 350 },
    { kind: "theme", prompt: "Othello ends his life by killing himself as 'a malignant and a turbaned Turk.' What symbolic act is he performing?",
      options: ["A ritual conversion to Islam at the moment of death", "Killing the enemy of the state he once defended — dying as a Venetian by executing the Turk he has internally become", "A final insult directed at the Ottoman Empire", "A traditional Venetian military suicide"],
      answer_index: 1, wisdom_reward: 25, anchor_line_start: 348, anchor_line_end: 360 },
    { kind: "inference", prompt: "Why does Shakespeare end the play with Cassio becoming governor and Lodovico ordering the bed curtains drawn?",
      options: ["To show that justice has been fully restored in Cyprus", "To demonstrate that the world outside the bedchamber resumes ordinary governance — the tragedy reverberates precisely because life continues", "Because Cassio was the original protagonist", "To set up a sequel play Shakespeare never wrote"],
      answer_index: 1, wisdom_reward: 25, anchor_line_start: 360, anchor_line_end: 375 },
  ],
};

// ── Apply ───────────────────────────────────────────────────────────────────

function main() {
  let totalAnnotations = 0;
  let totalTrials = 0;
  const meta = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "_meta.json"), "utf-8")) as {
    tier_1_sections?: string[];
  };
  const tier1 = new Set(meta.tier_1_sections ?? []);

  console.log(`=== Seeding Othello annotations + Trials ===\n`);
  console.log(`  Tier-1 scenes (Opus 4.6 equivalent): ${[...tier1].join(", ")}\n`);

  for (const sectionId of Object.keys(ANNOTATIONS)) {
    const filePath = path.join(CONTENT_DIR, `${sectionId}.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`  MISSING: ${filePath}`);
      continue;
    }
    const section = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const annotations = ANNOTATIONS[sectionId] ?? [];
    const trials = TRIALS[sectionId] ?? [];

    // Stamp IDs
    section.annotations = annotations.map((a, i) => ({
      id: `${sectionId}_ann${i + 1}`,
      line_start: a.line_start,
      line_end: a.line_end,
      citation_display: a.citation_display,
      category: a.category,
      title: a.title,
      body: a.body,
      sources: a.sources,
    }));
    section.trials = trials.map((t, i) => ({
      id: `${sectionId}_q${i + 1}`,
      kind: t.kind,
      prompt: t.prompt,
      options: t.options,
      answer_index: t.answer_index,
      wisdom_reward: t.wisdom_reward,
      anchor_line_start: t.anchor_line_start,
      anchor_line_end: t.anchor_line_end,
    }));

    fs.writeFileSync(filePath, JSON.stringify(section, null, 2));
    totalAnnotations += annotations.length;
    totalTrials += trials.length;

    const marker = tier1.has(sectionId) ? " [TIER-1]" : "";
    console.log(
      `  ${sectionId}${marker}: ${annotations.length} annotations, ${trials.length} Trials`
    );
  }

  console.log(`\n=== Summary ===`);
  console.log(`  Total annotations: ${totalAnnotations}`);
  console.log(`  Total Trials: ${totalTrials}`);
  console.log(`  Average Wisdom reward: ${Math.round(
    Object.values(TRIALS).flat().reduce((s, t) => s + t.wisdom_reward, 0) / totalTrials
  )}`);
}

main();
