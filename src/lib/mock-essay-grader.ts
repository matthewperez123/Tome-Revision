// ── Mock Essay Grading Engine ──
// Generates realistic-looking AI grading suggestions using template pools.
// Feature flag: NEXT_PUBLIC_USE_MOCK_ESSAY_GRADER (default: true)

export interface EssayRubricCriterion {
  criterion: string
  maxPoints: number
  description: string
}

export interface EssayAssignment {
  id: string
  classroomId: string
  assignmentId: string
  prompt: string
  rubric: EssayRubricCriterion[]
  totalPoints: number
  wordCountTarget: number
}

export interface EssaySubmission {
  id: string
  essayAssignmentId: string
  studentId: string
  studentName: string
  body: string
  wordCount: number
  submittedAt: string
}

export interface AISuggestion {
  suggestedScore: number
  perCriterionScores: { criterion: string; score: number; maxPoints: number; justification: string }[]
  overallFeedback: string
  strengths: string[]
  areasForImprovement: string[]
  suggestedMarginNotes: { quotedText: string; note: string }[]
  confidence: "high" | "medium" | "low"
  modelVersion: string
}

// ── Template Pools ──

const THESIS_FEEDBACK = [
  "The essay presents a clear and well-defined thesis that guides the entire argument.",
  "The central argument is articulated effectively in the introduction, providing a strong foundation.",
  "The thesis statement could be more specific — it currently reads as a broad observation rather than an arguable claim.",
  "While the thesis is present, it appears midway through the essay rather than in the opening paragraph.",
  "The argument evolves naturally throughout the essay, building toward a nuanced conclusion.",
  "The thesis demonstrates original thinking by connecting the text to broader themes.",
  "Consider refining the thesis to make a more decisive claim — hedging language weakens the argument.",
  "The essay would benefit from a thesis that directly engages with the author's rhetorical strategies.",
  "Strong thesis that takes a clear interpretive stance on the text.",
  "The argument is implicit rather than stated — making it explicit would strengthen the essay significantly.",
  "The thesis effectively synthesizes multiple elements of the text into a cohesive interpretive framework.",
  "A more focused thesis would help guide the reader through the subsequent analysis.",
  "The controlling idea is compelling but needs sharper articulation in the opening.",
  "Excellent thesis — it sets up a productive tension that the essay explores thoughtfully.",
  "The thesis attempts too much; narrowing the scope would allow for deeper analysis.",
  "The central claim is well-supported throughout but could be stated more directly at the outset.",
  "The argument demonstrates genuine engagement with the text rather than surface-level summary.",
  "Consider repositioning the thesis earlier to orient the reader from the start.",
  "The thesis effectively challenges a common reading of the text.",
  "A strong, arguable thesis anchors the essay's analytical work.",
  "The central argument lacks the specificity needed to sustain a focused analysis.",
]

const EVIDENCE_FEEDBACK = [
  "Excellent use of direct textual evidence — quotes are well-chosen and effectively integrated.",
  "The essay relies heavily on paraphrase rather than direct quotation; more specific textual references would strengthen the analysis.",
  "Quotations are present but not always analyzed — remember to explain how each quote supports your argument.",
  "Strong evidence selection that demonstrates close reading skills.",
  "The essay would benefit from more varied evidence — currently most quotes come from the same section.",
  "Each body paragraph anchors its claims in specific textual moments, which is excellent practice.",
  "Consider embedding shorter quotes within your sentences rather than using block quotes for every reference.",
  "The relationship between evidence and argument is clear and well-articulated.",
  "Some claims in the third paragraph lack supporting evidence from the text.",
  "Impressive integration of textual evidence — the quotes feel natural within the prose.",
  "The evidence is well-selected but the analysis after each quote could go deeper.",
  "Multiple pieces of evidence are marshaled effectively to build a cumulative argument.",
  "The essay cites the text frequently but occasionally misconstrues the context of quoted passages.",
  "Evidence from different sections of the text is woven together skillfully.",
  "The argument would be stronger with evidence that addresses potential counterarguments.",
  "Textual evidence is used not just to support but to complicate the argument — showing real analytical sophistication.",
  "Some paragraphs rely on assertion without supporting evidence.",
  "The chosen passages are among the most significant in the text — showing excellent judgment.",
  "Consider incorporating evidence from secondary sources to add scholarly context.",
  "The essay's strongest paragraphs are those with the most specific textual references.",
  "Evidence is plentiful but occasionally redundant — variety would strengthen the argument.",
]

const STRUCTURE_FEEDBACK = [
  "The essay follows a clear organizational pattern with smooth transitions between ideas.",
  "The paragraph structure is logical, moving from general context to specific analysis.",
  "Some paragraphs attempt to cover too many ideas — consider splitting them for clarity.",
  "The introduction effectively contextualizes the argument before presenting the thesis.",
  "Transitions between paragraphs are occasionally abrupt — consider adding connecting phrases.",
  "The conclusion does more than summarize — it extends the argument in a meaningful direction.",
  "The essay's structure mirrors the text's own narrative arc, which is an effective choice.",
  "Body paragraphs follow a clear claim-evidence-analysis pattern.",
  "The organization could be improved by grouping related ideas more tightly.",
  "The essay builds momentum effectively, with the strongest analysis in the final body paragraphs.",
  "Consider reordering paragraphs to present the argument in climactic order.",
  "The conclusion introduces new ideas that would be better developed in the body.",
  "Each paragraph has a clear topic sentence that advances the overall argument.",
  "The essay's five-paragraph structure works well for this scope of analysis.",
  "Some sections feel disconnected from the central argument — tighter organization would help.",
  "The progression from close reading to broader thematic claims is well-managed.",
  "The essay's structure allows the reader to follow the argument without difficulty.",
  "Consider whether the current paragraph order is the most persuasive arrangement.",
  "Strong use of signposting language to guide the reader through the argument.",
  "The introduction is engaging but could more quickly arrive at the thesis.",
  "The essay's conclusion effectively circles back to the opening, creating a sense of closure.",
]

const STYLE_FEEDBACK = [
  "The writing is clear, confident, and free of unnecessary jargon.",
  "Sentence variety keeps the prose engaging — a mix of complex and simple structures.",
  "Some sentences are overly complex and could be simplified for clarity.",
  "The academic tone is appropriate without being stilted or pretentious.",
  "The prose occasionally slips into informal language that undermines the analytical register.",
  "Elegant phrasing in several passages demonstrates strong command of written English.",
  "Word choice is precise and effective throughout.",
  "Some passive voice constructions could be revised for more direct expression.",
  "The writing demonstrates a mature voice that balances analysis with readability.",
  "Occasional repetition of key terms becomes noticeable — vary your vocabulary.",
  "The prose flows well and demonstrates careful revision.",
  "Consider varying sentence openings — several paragraphs start with similar constructions.",
  "Strong command of academic conventions while maintaining an engaging style.",
  "The writing is competent but could benefit from more varied sentence rhythms.",
  "Impressive vocabulary used appropriately and in context.",
  "Some sentences try to accomplish too much — breaking them apart would improve clarity.",
  "The essay reads smoothly, suggesting careful attention to revision and polish.",
  "The tone is appropriately formal without being dry.",
  "Consider tightening the prose — some passages use more words than necessary.",
  "The writing demonstrates genuine engagement with the material, not just mechanical analysis.",
]

const ENGAGEMENT_FEEDBACK = [
  "The essay demonstrates deep, thoughtful engagement with the text's themes and literary techniques.",
  "The analysis goes beyond surface-level reading to uncover meaningful connections.",
  "The essay occasionally summarizes plot rather than analyzing it — push toward interpretation.",
  "Genuine intellectual curiosity is evident throughout the essay.",
  "The essay connects the text to broader themes in a way that feels organic rather than forced.",
  "Some passages show excellent close reading skills, particularly in the analysis of imagery.",
  "The essay would benefit from engaging more directly with the author's craft — why did they make specific choices?",
  "The writer clearly finds the text meaningful, which strengthens the analysis.",
  "The essay demonstrates the kind of critical thinking we're looking for at this level.",
  "Consider what the text is doing, not just what it's saying — form and content work together.",
  "The analysis shows awareness of literary context and genre conventions.",
  "The essay's strongest moments come when the writer takes interpretive risks.",
  "More attention to the text's specific language and imagery would deepen the analysis.",
  "The essay engages with the text's complexity rather than reducing it to simple themes.",
  "The writer's own voice comes through strongly, making the analysis feel authentic.",
  "Consider how the text's structure contributes to its meaning — not just the content.",
  "The essay demonstrates empathy with the characters while maintaining analytical distance.",
  "The analysis would benefit from considering alternative interpretations before settling on one.",
  "The essay shows genuine intellectual growth in working through the text's difficulties.",
  "Strong engagement that treats the text as a living work rather than a museum piece.",
]

const STRENGTHS_POOL = [
  "Strong opening that establishes the thesis clearly and engages the reader",
  "Effective use of textual evidence throughout the essay",
  "Thoughtful close reading of key passages",
  "Clear paragraph organization with effective topic sentences",
  "Sophisticated vocabulary used accurately and in context",
  "Original interpretive angle that goes beyond obvious readings",
  "Strong conclusion that extends the argument meaningfully",
  "Smooth transitions that connect ideas logically",
  "Impressive ability to synthesize multiple themes into a cohesive argument",
  "Effective use of literary terminology (imagery, symbolism, motif)",
  "The essay demonstrates genuine engagement with the text",
  "Well-chosen quotes that directly support analytical claims",
  "Confident academic voice appropriate for literary analysis",
  "Analysis that considers both form and content",
  "Strong awareness of historical and cultural context",
  "The argument builds effectively across paragraphs",
  "Excellent integration of quotes within the writer's own sentences",
  "The essay avoids plot summary in favor of sustained analysis",
  "Creative connections between different parts of the text",
  "The writer's personal voice enhances rather than undermines the analysis",
  "Clear understanding of the text's major themes and how they interconnect",
  "Effective use of comparison and contrast in the analysis",
  "The essay maintains a consistent analytical focus throughout",
  "Strong command of grammar and mechanics",
  "The interpretation challenges assumptions in a productive way",
  "Thoughtful attention to the author's deliberate craft choices",
  "The essay demonstrates the ability to sustain a complex argument",
  "Impressive analytical depth in the treatment of individual passages",
  "The writer identifies patterns in the text that strengthen the argument",
  "Well-balanced essay that addresses multiple aspects of the prompt",
]

const IMPROVEMENTS_POOL = [
  "Consider making the thesis more specific and arguable",
  "Add more direct textual evidence to support key claims",
  "Develop the analysis after each quotation more fully",
  "Strengthen transitions between paragraphs",
  "The conclusion could push the argument further rather than restating it",
  "Some paragraphs try to cover too many ideas — focus on one claim per paragraph",
  "Vary sentence structure to improve the essay's rhythm and flow",
  "Engage more with the author's specific craft choices (diction, syntax, imagery)",
  "Address potential counterarguments to strengthen the thesis",
  "The introduction could more efficiently establish context before the thesis",
  "Avoid summarizing plot when analysis is needed",
  "Consider the broader significance of your argument — why does this reading matter?",
  "Some claims are asserted without sufficient evidence",
  "Proofread for minor grammatical issues (comma splices, run-on sentences)",
  "Deepen the close reading in the middle paragraphs",
  "Connect individual observations more explicitly to the overarching thesis",
  "Reduce reliance on generalizations — be more specific",
  "The essay would benefit from a more distinctive interpretive lens",
  "Consider how the text's structure reinforces its themes",
  "Tighten the prose — some passages use more words than necessary",
  "Engage more deeply with the text's ambiguities rather than resolving them too quickly",
  "Draw on a wider range of passages from the text",
  "The argument could be organized in a more persuasive order",
  "Consider adding a paragraph that addresses the text's historical context",
  "Some quoted passages need more thorough analysis",
  "Revise for clarity — some sentences are difficult to follow",
  "The essay's voice occasionally shifts between formal and informal registers",
  "Consider whether every paragraph is doing essential work for the argument",
  "Explore the implications of your reading more fully in the conclusion",
  "Strengthen the logical connections between your evidence and your claims",
]

const MARGIN_NOTE_TEMPLATES = [
  { keyword: "thesis", notes: ["This is your thesis — consider making it more specific.", "Strong thesis placement.", "Could this claim be more arguable?"] },
  { keyword: "however", notes: ["Good transitional move — this complicates your argument effectively.", "This turn in the argument is well-placed.", "Consider developing this counterpoint more fully."] },
  { keyword: "the author", notes: ["Good awareness of authorial intent.", "Be careful about assuming the author's purpose.", "This shows strong engagement with craft."] },
  { keyword: "in chapter", notes: ["Specific textual reference — well done.", "Consider providing more context for this reference.", "This passage is well-chosen for your argument."] },
  { keyword: "therefore", notes: ["Logical conclusion, but make sure the evidence fully supports it.", "Strong logical connection.", "This follows naturally from the preceding analysis."] },
  { keyword: "symbolize", notes: ["Good attention to symbolism.", "Develop this symbolic reading further.", "Consider whether this symbol has multiple meanings in the text."] },
  { keyword: "theme", notes: ["Thematic awareness is strong here.", "How does this theme connect to the text's form?", "Consider how this theme develops across the text."] },
  { keyword: "contrast", notes: ["Effective use of comparison.", "This contrast illuminates an important aspect of the text.", "Consider whether this contrast is as clear-cut as presented."] },
  { keyword: "evidence", notes: ["Good meta-awareness of your analytical process.", "The evidence here is well-selected.", "Consider whether additional evidence would strengthen this claim."] },
  { keyword: "significant", notes: ["Why is it significant? Push this analysis further.", "Good analytical instinct — you're right to flag this.", "Develop the significance more fully."] },
]

// ── Seeded random for reproducible but varied results ──

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 }
}

function pick<T>(arr: T[], rng: () => number, count: number): T[] {
  const shuffled = [...arr].sort(() => rng() - 0.5)
  return shuffled.slice(0, count)
}

// ── Generator ──

export function generateMockEssaySuggestion(
  submission: EssaySubmission,
  assignment: EssayAssignment,
  seed?: number
): AISuggestion {
  const rng = seededRandom(seed ?? Date.now())

  // Word count alignment
  const wordRatio = submission.wordCount / Math.max(assignment.wordCountTarget, 1)
  const wordAligned = wordRatio >= 0.8 && wordRatio <= 1.3

  // Evidence markers
  const bodyLower = submission.body.toLowerCase()
  const hasQuotes = (submission.body.match(/"/g) || []).length >= 4
  const hasTextRef = bodyLower.includes("the author") || bodyLower.includes("in chapter") || bodyLower.includes("in book")
  const hasAnalysis = bodyLower.includes("therefore") || bodyLower.includes("significant") || bodyLower.includes("symbolize") || bodyLower.includes("theme")

  // Base score distribution (weighted toward 70-90%)
  const basePercent = 65 + Math.round(rng() * 25) + (hasQuotes ? 3 : 0) + (hasTextRef ? 3 : 0) + (hasAnalysis ? 2 : 0) + (wordAligned ? 2 : -5)
  const clampedPercent = Math.max(40, Math.min(98, basePercent))
  const suggestedScore = Math.round((clampedPercent / 100) * assignment.totalPoints)

  // Per-criterion scores with variance
  const perCriterionScores = assignment.rubric.map(criterion => {
    const variance = Math.round((rng() - 0.5) * criterion.maxPoints * 0.3)
    const criterionScore = Math.max(Math.round(criterion.maxPoints * 0.4), Math.min(criterion.maxPoints, Math.round(criterion.maxPoints * (clampedPercent / 100)) + variance))
    const justificationPools: Record<string, string[]> = {
      "Thesis": THESIS_FEEDBACK,
      "Evidence": EVIDENCE_FEEDBACK,
      "Structure": STRUCTURE_FEEDBACK,
      "Style": STYLE_FEEDBACK,
      "Engagement": ENGAGEMENT_FEEDBACK,
    }
    const pool = justificationPools[criterion.criterion] ?? THESIS_FEEDBACK
    return {
      criterion: criterion.criterion,
      score: criterionScore,
      maxPoints: criterion.maxPoints,
      justification: pick(pool, rng, 1)[0],
    }
  })

  // Overall feedback (compose from multiple categories)
  const feedbackSentences = [
    pick(THESIS_FEEDBACK, rng, 1)[0],
    pick(EVIDENCE_FEEDBACK, rng, 1)[0],
    pick(STRUCTURE_FEEDBACK, rng, 1)[0],
    pick(STYLE_FEEDBACK, rng, 1)[0],
  ]
  const overallFeedback = feedbackSentences.join("\n\n")

  // Strengths and improvements
  const strengths = pick(STRENGTHS_POOL, rng, 2 + Math.floor(rng() * 3))
  const areasForImprovement = pick(IMPROVEMENTS_POOL, rng, 2 + Math.floor(rng() * 3))

  // Margin notes by keyword scanning
  const suggestedMarginNotes: { quotedText: string; note: string }[] = []
  const sentences = submission.body.split(/[.!?]+/).filter(s => s.trim().length > 20)
  for (const template of MARGIN_NOTE_TEMPLATES) {
    const match = sentences.find(s => s.toLowerCase().includes(template.keyword))
    if (match && suggestedMarginNotes.length < 6) {
      const trimmed = match.trim().substring(0, 80) + (match.trim().length > 80 ? "..." : "")
      suggestedMarginNotes.push({
        quotedText: trimmed,
        note: pick(template.notes, rng, 1)[0],
      })
    }
  }
  // If few keyword matches, add generic notes from random sentences
  while (suggestedMarginNotes.length < 3 && sentences.length > suggestedMarginNotes.length) {
    const idx = Math.floor(rng() * sentences.length)
    const s = sentences[idx].trim()
    if (s.length > 15 && !suggestedMarginNotes.some(n => n.quotedText.startsWith(s.substring(0, 20)))) {
      suggestedMarginNotes.push({
        quotedText: s.substring(0, 80) + (s.length > 80 ? "..." : ""),
        note: clampedPercent > 75 ? "Good analytical point here." : "This claim needs more evidence to support it.",
      })
    }
  }

  // Confidence
  const confidence: "high" | "medium" | "low" = wordAligned && hasQuotes && hasTextRef ? "high" : !hasQuotes && !hasTextRef ? "low" : "medium"

  return {
    suggestedScore,
    perCriterionScores,
    overallFeedback,
    strengths,
    areasForImprovement,
    suggestedMarginNotes,
    confidence,
    modelVersion: "mock-v1",
  }
}

// ── Demo Essay Assignments ──

export const DEMO_ESSAY_ASSIGNMENTS: EssayAssignment[] = [
  {
    id: "ea-1",
    classroomId: "class-1",
    assignmentId: "assign-essay-1",
    prompt: "Analyze the role of cunning (metis) versus brute strength (bie) in The Odyssey. How does Homer use Odysseus's intelligence to redefine heroism? Use specific textual evidence from at least three episodes.",
    rubric: [
      { criterion: "Thesis", maxPoints: 20, description: "Clear, arguable thesis that directly addresses the prompt" },
      { criterion: "Evidence", maxPoints: 25, description: "Use of specific textual evidence from at least three episodes" },
      { criterion: "Structure", maxPoints: 20, description: "Logical organization with clear paragraph structure" },
      { criterion: "Style", maxPoints: 15, description: "Academic writing quality, vocabulary, and mechanics" },
      { criterion: "Engagement", maxPoints: 20, description: "Depth of analysis and engagement with literary themes" },
    ],
    totalPoints: 100,
    wordCountTarget: 800,
  },
  {
    id: "ea-2",
    classroomId: "class-1",
    assignmentId: "assign-essay-2",
    prompt: "In Pride and Prejudice, Jane Austen uses irony to critique the social norms of Regency-era England. Analyze how Austen's use of verbal and situational irony reveals her views on marriage, class, and gender roles.",
    rubric: [
      { criterion: "Thesis", maxPoints: 20, description: "Clear thesis addressing Austen's use of irony" },
      { criterion: "Evidence", maxPoints: 25, description: "Specific examples of verbal and situational irony" },
      { criterion: "Structure", maxPoints: 20, description: "Well-organized argument with logical progression" },
      { criterion: "Style", maxPoints: 15, description: "Writing quality and academic register" },
      { criterion: "Engagement", maxPoints: 20, description: "Understanding of historical context and literary technique" },
    ],
    totalPoints: 100,
    wordCountTarget: 1000,
  },
]

export const DEMO_ESSAY_SUBMISSIONS: EssaySubmission[] = [
  {
    id: "es-1",
    essayAssignmentId: "ea-1",
    studentId: "s1",
    studentName: "Emma Chen",
    body: `In Homer's Odyssey, the concept of heroism undergoes a fundamental transformation. While the Iliad celebrates warriors defined by their physical prowess — Achilles' rage, Ajax's shield — the Odyssey introduces a hero whose defining trait is his cunning intelligence, or metis. Through Odysseus's encounters with the Cyclops, Circe, and the suitors, Homer argues that true heroism lies not in brute strength but in the ability to adapt, deceive, and endure.

The most iconic demonstration of metis occurs in Book 9, when Odysseus encounters Polyphemus. Rather than attempting to overpower the Cyclops — an impossibility given the creature's size — Odysseus devises the "Nobody" trick. "My name is Nobody," he tells Polyphemus, ensuring that when the blinded giant calls for help, the other Cyclopes hear only "Nobody is hurting me." This episode encapsulates Homer's thesis: the clever hero survives where the strong hero would perish. However, Odysseus's subsequent hubris in revealing his true name demonstrates that even metis has its limits when pride intervenes.

The encounter with Circe in Book 10 presents a different facet of Odysseus's intelligence. Armed with the herb moly from Hermes, Odysseus resists Circe's transformation magic not through force but through preparation and divine alliance. His subsequent negotiation with Circe — securing the release of his men and gaining valuable information about the underworld — shows the diplomatic dimension of metis. The hero succeeds through knowledge and negotiation, not through combat.

The climactic confrontation with the suitors in Books 21-22 synthesizes both metis and bie. Odysseus's patient disguise as a beggar for several books demonstrates the endurance aspect of cunning. He gathers intelligence, tests loyalties, and only reveals himself when the strategic moment arrives. The bow contest itself is significant: only Odysseus possesses the combination of physical skill and strategic patience required to string the bow and thread the axes. The subsequent battle requires both strength and planning.

Homer's redefinition of heroism through Odysseus reflects a broader cultural evolution in ancient Greek values. The Iliad's warrior society valued kleos — glory earned through battlefield courage. The Odyssey suggests that survival, homecoming, and the preservation of community represent equally valid forms of excellence. Odysseus earns his kleos not by dying gloriously but by living cleverly, returning home, and restoring order to his household. In this, Homer anticipates a vision of heroism that resonates with modern values: the hero who adapts, who uses intelligence over force, who endures rather than merely conquers.`,
    wordCount: 378,
    submittedAt: "2026-04-10T14:30:00Z",
  },
  {
    id: "es-2",
    essayAssignmentId: "ea-1",
    studentId: "s4",
    studentName: "James O'Brien",
    body: `The Odyssey by Homer is about Odysseus trying to get home after the Trojan War. He is a smart hero who uses tricks instead of just fighting. This is different from other Greek heroes.

In the Cyclops scene, Odysseus tells the Cyclops his name is "Nobody." This tricks the Cyclops because when he yells for help nobody comes. This shows that Odysseus is smart.

Odysseus also meets Circe who turns his men into pigs. But Odysseus uses a special plant to protect himself. He makes a deal with Circe to turn his men back. This shows he can negotiate.

At the end of the book Odysseus fights the suitors. He pretends to be a beggar first so they dont know who he is. Then he shoots them with his bow. He needed to be both strong and smart to win.

In conclusion, Homer shows that being smart is more important than being strong. Odysseus is a different kind of hero than Achilles because he uses his brain. This is what makes the Odyssey different from the Iliad.`,
    wordCount: 175,
    submittedAt: "2026-04-11T09:00:00Z",
  },
  {
    id: "es-3",
    essayAssignmentId: "ea-2",
    studentId: "s3",
    studentName: "Sofia Rodriguez",
    body: `Jane Austen opens Pride and Prejudice with one of literature's most celebrated examples of verbal irony: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife." This sentence simultaneously states a social assumption and undercuts it, establishing the ironic mode that pervades the entire novel. Through systematic deployment of both verbal and situational irony, Austen constructs a devastating critique of Regency-era marriage markets, class consciousness, and gender expectations.

Austen's verbal irony operates most effectively through the character of Mr. Bennet, whose sardonic observations function as the author's own commentary on social absurdity. When Mrs. Bennet anxiously reports that Mr. Bingley has arrived at Netherfield, Mr. Bennet responds with studied indifference before revealing he has already visited. His ironic persona, however, carries its own critique: Austen shows that ironic detachment, while intellectually appealing, represents a failure of responsibility. Mr. Bennet's irony is ultimately a defense mechanism against engagement with the very real economic anxieties his family faces.

The novel's deepest situational irony lies in its central romance. Elizabeth Bennet's pride in her own judgment leads her to misjudge Darcy completely, while Darcy's pride in his social position leads him to underestimate Elizabeth. The first proposal scene in Chapter 34 represents the novel's ironic climax: Darcy's declaration of love is simultaneously an insult, his praise of Elizabeth inseparable from his contempt for her family. Elizabeth's refusal — despite the enormous economic pressure to accept any wealthy proposal — constitutes Austen's most pointed critique of the marriage market. The irony is that both characters must recognize their prejudices before genuine connection becomes possible.

Austen's treatment of marriage throughout the novel creates a spectrum of ironic commentary on the institution. The Collinses' marriage represents pragmatic surrender — Charlotte Lucas knowingly accepts an absurd husband because the alternative (spinsterhood and dependency) is worse. The Wickham-Lydia elopement ironically threatens to destroy the family through the very romantic passion that the marriage market is designed to channel. Meanwhile, the Bingley-Jane relationship, seemingly the most straightforward, is nearly destroyed by class-based interference. Each marriage illuminates a different ironic dimension of a society that treats matrimony as both the highest romantic aspiration and the most coldly financial transaction.

The novel's resolution carries its own layer of irony. Elizabeth and Darcy achieve a genuine marriage of minds and hearts — but they do so within the very system Austen has spent the entire novel critiquing. Darcy remains wealthy; Elizabeth ascends in class. The happy ending does not dismantle the social structures Austen has ironized; rather, it suggests that authentic human connection is possible even within a deeply flawed system. This is perhaps Austen's most sophisticated ironic stance: the acknowledgment that critique and participation in social structures are not mutually exclusive.

In this way, Austen's irony serves not merely as a stylistic device but as an entire philosophical framework. By revealing the gap between social performance and authentic feeling, between stated values and actual behavior, Austen constructs a vision of Regency society that is simultaneously affectionate and devastating. Her irony does not propose revolution — it proposes clear sight.`,
    wordCount: 502,
    submittedAt: "2026-04-10T16:00:00Z",
  },
  {
    id: "es-4",
    essayAssignmentId: "ea-2",
    studentId: "s7",
    studentName: "Olivia Kim",
    body: `Pride and Prejudice uses irony a lot. The first sentence is ironic because it says everyone knows a rich man needs a wife but thats not really true. Jane Austen uses irony to make fun of society.

Mr. Bennet is very ironic. He says things he doesnt mean to make fun of his wife. Elizabeth is also kind of ironic because she judges Darcy wrong at first.

The irony is that Elizabeth and Darcy both have pride and prejudice but they dont see it in themselves. The title is ironic because it applies to both main characters.

Marriage in the book is ironic because people marry for money not love. Charlotte marries Mr. Collins even though she doesnt love him because she needs financial security. This is ironic because marriage should be about love.

In the end Elizabeth and Darcy get together which shows that love can overcome prejudice.`,
    wordCount: 152,
    submittedAt: "2026-04-11T11:00:00Z",
  },
]

// ── Helpers ──

export function getEssayAssignment(id: string) { return DEMO_ESSAY_ASSIGNMENTS.find(a => a.id === id) ?? null }
export function getEssaySubmission(id: string) { return DEMO_ESSAY_SUBMISSIONS.find(s => s.id === id) ?? null }
export function getEssaySubmissionsForAssignment(assignmentId: string) { return DEMO_ESSAY_SUBMISSIONS.filter(s => s.essayAssignmentId === assignmentId) }
export function getAllEssaySubmissions() { return DEMO_ESSAY_SUBMISSIONS }
