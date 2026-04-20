/**
 * Victorian context annotations for Idylls of the King.
 *
 * Modern readers often find the cycle's Victorian moral-political
 * framing uncomfortable or reductive — the Arthur-as-ideal-sovereign
 * reading dedicated to Prince Albert, the judgment of Guinevere's
 * adultery as the kingdom's unmaking, the discomfort with Vivien,
 * the hand-wringing about religious doubt in the Grail idyll. These
 * discomforts are legitimate. The poem is part of what it is; the
 * annotations orient modern readers without presuming they share the
 * frame and without editing it out.
 *
 * Context entries exist for four structural moments where Victorian
 * context is load-bearing: the Dedication (Albert, the frame itself),
 * the Holy Grail (religious doubt, In Memoriam), Guinevere (the
 * "woman question," Victorian fallen-woman ideology), and To the
 * Queen (the coda reframed after the cycle darkened).
 *
 * Hand-authored at the Part 3D pause-point; will be supplemented by
 * the Part 4 Opus annotation clusters on those same chapters, not
 * replaced. These are orientation-notes, not the annotation clusters
 * themselves.
 */

export interface VictorianContextEntry {
  chapterIndex: number
  title: string
  body: string
}

export const VICTORIAN_CONTEXT: Record<number, VictorianContextEntry> = {
  0: {
    chapterIndex: 0,
    title: "The Dedication and Victorian moral-political reading",
    body:
      "Tennyson published the Dedication in 1862, the year after Prince Albert's death. Victoria had asked him (through intermediaries) for verse that honored the Prince Consort; the Dedication is his answer. The passage frames the entire cycle as a moral analogue — Arthur as the figure of ideal sovereignty, Albert as Arthur's modern recognition, the Round Table as the civilization-in-making that both figures presided over. The stated reading is Tennyson's own, printed at the front of the collected editions from 1862 onward. Modern readers often feel the frame is reductive: treating the poem as moral allegory for Victorian England narrows what the cycle actually does in its best idylls, where Tennyson's practice exceeds his stated intention. The annotations below don't endorse or dismiss the Victorian frame — they surface it, because the cycle was written inside it, and step aside where the poem outgrows it. Read the Dedication as what it is: a public-political act of mourning, addressed to a real widow, by a poet serving as Laureate during the deepest year of her grief.",
  },
  8: {
    chapterIndex: 8,
    title: "The Holy Grail and Victorian religious doubt",
    body:
      "Tennyson wrote 'The Holy Grail' in 1869, more than a decade into his sustained meditation on faith and doubt that had produced 'In Memoriam A.H.H.' (1850), the elegy for Arthur Hallam. 'In Memoriam' contains the famous line 'There lives more faith in honest doubt / Believe me, than in half the creeds' — a formulation that became a touchstone for Victorian religious ambivalence. By 'The Holy Grail' Tennyson is writing in an England whose cultural confidence in Christianity is visibly eroding — Matthew Arnold's 'Dover Beach' (composed ca. 1851, published 1867) names it: 'The Sea of Faith / Was once, too, at the full… but now I only hear / Its melancholy, long, withdrawing roar.' Tennyson knew Arnold. The Grail idyll reads differently in this context — Percivale's Grail quest is not simply pious; it is a question addressed to a reader who is no longer sure. Galahad's visionary success, Arthur's skepticism of the quest, Percivale's retreat to the cloister: the idyll holds three distinct positions without resolving them. Scholars have read it as a defense of faith and as a document of faith's failure. Both readings are available inside the text.",
  },
  11: {
    chapterIndex: 11,
    title: "Guinevere and the Victorian 'woman question'",
    body:
      "The idyll in Guinevere's own name is the cycle's emotional climax and its most morally contested passage. Tennyson writes it across the period (1859) in which the 'woman question' was publicly active in England — the Matrimonial Causes Act of 1857 had just liberalized divorce; John Stuart Mill's 'The Subjection of Women' was composed in 1861 and published in 1869; Queen Victoria herself wrote privately in 1870 that women's rights advocates should be 'whipped' for their 'mad, wicked folly.' Victorian ideology held the fallen woman both as tragic figure and as moral warning; literature of the period (Hardy's later Tess, Eliot's Hetty Sorrel, many others) depicted her with sympathy inside a framework of condemnation. Tennyson's Guinevere belongs to this structure, but the idyll's practice often exceeds the frame he sets for her. Arthur's long speech of forgiveness-with-judgment — the idyll's centerpiece — has struck some readers, then and now, as disproportionate, paternalistic, cruel. Others have found it moving. The disagreement is the idyll's critical history. Tennyson's own interior Guinevere — the psychological sustained-passages of her consciousness — is one of the most humane portraits of a fallen woman in Victorian verse. Read both: the frame that judges her, and the depiction that cannot help seeing her whole.",
  },
  13: {
    chapterIndex: 13,
    title: "To the Queen — the coda after the cycle darkened",
    body:
      "'To the Queen' was added in 1872, a decade after the Dedication, and after the cycle had reached its darker completed form. The mood is different from the Dedication's public mourning. Here Tennyson addresses Victoria directly — his sovereign, a living widow — and defends the poem against charges that its moral has been merely allegorical (specifically, a review by the Spectator accused the cycle of having 'lowered the tone of English chivalry'). The coda closes with a meditation on the imperial crisis of his moment — the 1860s–70s brought the Morant Bay rebellion (1865), the Fenian bombings, questions about the Empire's coherence that the Dedication of 1862 had not yet reckoned with. The ten-year difference between the two framing poems shows a Poet Laureate thinking his way through a harder decade, and settling the cycle into an image of civilizational change it had earlier tried to resist. Read 'To the Queen' as the older, more tired voice of the Dedication — the same poet, after the idylls had gone all the way to ruin.",
  },
}
