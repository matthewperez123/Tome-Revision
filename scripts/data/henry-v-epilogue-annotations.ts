/**
 * Henry V — Epilogue — annotations + Trials.
 * The 14-line sonnet that closes the play by naming the collapse it leaves out.
 */
interface Annotation { line_start: number; line_end: number; citation_display: string; category: "thematic"|"structural"|"historical"|"textual"|"biographical"|"linguistic"|"close_reading"; title: string; body: string; sources: string[]; }
interface Trial { kind: "comprehension"|"inference"|"theme"|"close_reading"|"structural"; prompt: string; options: [string,string,string,string]; answer_index: 0|1|2|3; wisdom_reward: number; anchor_line_start: number; anchor_line_end: number; }

module.exports = function (ANNOTATIONS: Record<string, Annotation[]>, TRIALS: Record<string, Trial[]>, cite: (label: string, ls: number, le: number) => string) {

  ANNOTATIONS.henry_v_epilogue = [
    {
      line_start: 1, line_end: 14,
      citation_display: cite("Epilogue", 1, 14),
      category: "structural",
      title: "The Epilogue is a sonnet — the play's final formal choice",
      body: "The Epilogue is a complete English sonnet: three quatrains rhymed ABAB CDCD EFEF and a closing couplet GG. Shakespeare has chosen the sonnet form for his most loaded exit in the whole play. The form matters because a sonnet is a closed, resolved, satisfying poetic unit — it arrives at a couplet that ties it off. By using this form, the Epilogue claims the authority of aesthetic completion. But the content of the sonnet is the opposite of aesthetic completion: it announces that everything Henry built will be unmade within a generation. The formal closure and the historical dis-closure pull against each other. The result is that the play ends with a structure that says 'finished' and a content that says 'collapsed.' Readers should hear both at once. The choice of sonnet form also recalls the opening Chorus's epic-invocation (lines 1–8) and the Prologue/Epilogue symmetry that frames the whole play: it begins with an aspiration to epic and ends with a sonnet naming dynastic failure. The arc from 'O for a Muse of fire' to 'made his England bleed' is deliberately undone.",
      sources: ["Frank Kermode, Shakespeare's Language (2000)", "Helen Vendler, The Art of Shakespeare's Sonnets (1997)"]
    },
    {
      line_start: 5, line_end: 12,
      citation_display: cite("Epilogue", 5, 12),
      category: "historical",
      title: "The future-tense undoing — Henry VI and the loss of France",
      body: "The sonnet's eight middle lines describe what happens after the play ends. 'Small time' — Henry V died in 1422, aged 35, nine years after Agincourt. 'Fortune made his sword' — his victories are retrospectively attributed to luck (a less flattering gloss than the play has previously offered). 'The world's best garden he achieved' — echoes Burgundy's image from 5.2, now tinged with bitter irony. 'And of it left his son imperial lord. / Henry the Sixth, in infant bands crown'd King / Of France and England, did this king succeed' — the baby Henry VI inherited both crowns at nine months old. 'Whose state so many had the managing' — refers to the factional regency, with multiple protectors jockeying for power. 'That they lost France and made his England bleed' — the loss of France (complete by 1453) and the Wars of the Roses (1455–1485) that followed. The Epilogue compresses thirty years of civil-war collapse into two lines. The play's triumph is systematically undone.",
      sources: ["Peter Saccio, Shakespeare's English Kings (2nd ed., 2000)", "Anne Curry, The Hundred Years War (2nd ed., 2003)", "Bertrand Wolffe, Henry VI (1981)"]
    },
    {
      line_start: 13, line_end: 14,
      citation_display: cite("Epilogue", 13, 14),
      category: "biographical",
      title: "'Which oft our stage hath shown' — Shakespeare cross-referencing himself",
      body: "The Epilogue's penultimate line — 'Which oft our stage hath shown' — is a direct reference to Shakespeare's own earlier work. The Henry VI plays (Parts 1, 2, and 3) and Richard III were written in the early 1590s, years before Henry V (1599). Shakespeare had, in other words, already dramatized everything the Epilogue says will happen. The first tetralogy (Henry VI 1–3 and Richard III) showed the Wars of the Roses in considerable detail; the second tetralogy (Richard II, Henry IV 1–2, Henry V) now ends by pointing at the first. The chronological arc of the composition was reverse of the historical arc: Shakespeare had already written the later history, and Henry V is thus the prequel to a story whose ending he and his audience already knew. This is not an incidental detail. The Epilogue is effectively telling the audience: you know how this ends; you've seen it; accept the play's triumph knowing what follows. It is the play's final, quiet admission that the Agincourt victory it has just celebrated was historically followed by catastrophe — and that the playwright's own earlier work testifies to that catastrophe.",
      sources: ["Gary Taylor (ed.), The Oxford Shakespeare: Henry V (1982), introduction", "Jean E. Howard & Phyllis Rackin, Engendering a Nation (1997)", "Norman Rabkin, 'Either/Or' (1981)"]
    },
  ];

  TRIALS.henry_v_epilogue = [
    {
      kind: "structural",
      prompt: "What verse form is the Epilogue?",
      options: [
        "Free verse",
        "An English sonnet (three quatrains plus a couplet) — the form's closure pulls against the sonnet's content, which is the collapse of Henry's achievement",
        "A ballad stanza",
        "Heroic couplets"
      ],
      answer_index: 1, wisdom_reward: 25,
      anchor_line_start: 1, anchor_line_end: 14
    },
    {
      kind: "historical",
      prompt: "What historical future does the Epilogue announce?",
      options: [
        "Henry V's long and successful reign",
        "Henry V's early death; the succession of his infant son Henry VI to both crowns; the factional regency; the loss of France; the Wars of the Roses that 'made his England bleed'",
        "A crusade to reconquer Jerusalem",
        "A peaceful transition to the Tudor dynasty"
      ],
      answer_index: 1, wisdom_reward: 30,
      anchor_line_start: 5, anchor_line_end: 12
    },
    {
      kind: "theme",
      prompt: "Why does the Epilogue mention 'Which oft our stage hath shown' (line 13)?",
      options: [
        "As a general allusion to Elizabethan theatre",
        "As a direct cross-reference to Shakespeare's own Henry VI plays (1–3) and Richard III — written years earlier. Henry V is thus the prequel to a catastrophe the audience has already seen dramatized",
        "To advertise a forthcoming play",
        "As a line added by a later editor"
      ],
      answer_index: 1, wisdom_reward: 35,
      anchor_line_start: 13, anchor_line_end: 13
    },
    {
      kind: "inference",
      prompt: "What is the effect of ending the play this way?",
      options: [
        "Pure triumphalism — the Epilogue celebrates Henry's victory",
        "A deliberate undoing: the sonnet's formal closure frames content that says everything Henry built collapsed within a generation. The patriotic reading cannot be cleanly sustained against the Epilogue's future-tense dis-closure",
        "An uplifting glimpse of the Tudor future",
        "A factual error by Shakespeare"
      ],
      answer_index: 1, wisdom_reward: 35,
      anchor_line_start: 5, anchor_line_end: 14
    },
  ];
};
