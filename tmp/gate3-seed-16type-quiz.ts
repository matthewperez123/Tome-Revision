#!/usr/bin/env npx tsx
// Gate 3 e2e fixture: seed ONE published teacher quiz containing all 16
// canonical question types, assigned to the RHET10 test classroom, so the
// browser e2e can prove the attempt runner renders/submits every type and
// the results view shows objective scores + awaiting-review pendings.
//
// Test-cohort data only (hypatia.teacher@tome.test / RHET10). Idempotent:
// re-running deletes the prior "Gate 3 —" quiz first.
//
// Run: npx tsx tmp/gate3-seed-16type-quiz.ts

import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

// .env.local loader (no dotenv dep needed)
for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, '')
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
const db = createClient(url, key, { auth: { persistSession: false } })

const TITLE = 'Gate 3 — All Sixteen Types'

async function main() {
  // Resolve the test teacher + classroom.
  // profiles carries no email — hypatia.teacher@tome.test is username 'hypatia'.
  const { data: teacher } = await db
    .from('profiles')
    .select('id, username')
    .eq('username', 'hypatia')
    .single()
  if (!teacher) throw new Error('test teacher not found')
  const { data: classroom } = await db
    .from('classrooms')
    .select('id, name')
    .eq('teacher_id', teacher.id)
    .limit(1)
    .single()
  if (!classroom) throw new Error('test classroom not found')

  // Idempotency: remove a prior run's quiz (+ its assignment via FK SET NULL).
  const { data: old } = await db
    .from('teacher_quizzes')
    .select('id')
    .eq('teacher_id', teacher.id)
    .like('title', 'Gate 3 —%')
  for (const q of old ?? []) {
    await db.from('assignments').delete().eq('quiz_id', q.id)
    await db.from('teacher_quiz_responses').delete().eq('quiz_id', q.id)
    await db.from('teacher_quiz_results').delete().eq('quiz_id', q.id)
    await db.from('teacher_quiz_questions').delete().eq('quiz_id', q.id)
    await db.from('teacher_quizzes').delete().eq('id', q.id)
  }

  const { data: quiz, error: qErr } = await db
    .from('teacher_quizzes')
    .insert({
      teacher_id: teacher.id,
      title: TITLE,
      status: 'published',
      difficulty: 'scholar',
      passing_score: 60,
      allow_retakes: true,
      randomize_order: false, // deterministic order for the e2e
      show_answers: true,
      hints_enabled: false,
    })
    .select('id')
    .single()
  if (qErr || !quiz) throw new Error('quiz insert failed: ' + qErr?.message)

  type Q = {
    question_type: string
    question_text: string
    options?: string[] | null
    correct_answer?: string | null
    points?: number
    max_points?: number
    meta?: Record<string, unknown> | null
    rubric?: unknown
    reference_answer?: string | null
  }
  const questions: Q[] = [
    { question_type: 'multiple_choice', question_text: 'Who leads the Greek host at Troy?',
      options: ['Agamemnon', 'Priam', 'Aeneas', 'Laertes'], correct_answer: 'Agamemnon' },
    { question_type: 'true_false', question_text: 'The Odyssey opens on Ithaca.',
      options: ['True', 'False'], correct_answer: 'True' },
    { question_type: 'fill_blank', question_text: 'Sing, O ___, of the rage of Achilles.',
      options: [], correct_answer: 'muse', meta: { acceptedVariants: ['goddess'] } },
    { question_type: 'multiple_select', question_text: 'Select every Greek warrior below.',
      options: ['Achilles', 'Ajax', 'Hector', 'Odysseus'], correct_answer: 'Achilles, Ajax, Odysseus' },
    { question_type: 'identification', question_text: 'Who says "I am no man"?',
      options: ['Odysseus', 'Telemachus', 'Polyphemus', 'Eumaeus'], correct_answer: 'Odysseus',
      meta: { identificationSubject: 'speaker' } },
    { question_type: 'ordering', question_text: 'Order these events of the Odyssey.',
      options: ['Cyclops', 'Circe', 'Underworld', 'Sirens'],
      correct_answer: JSON.stringify(['Cyclops', 'Circe', 'Underworld', 'Sirens']),
      meta: { items: ['Circe', 'Sirens', 'Cyclops', 'Underworld'],
        correctOrder: ['Cyclops', 'Circe', 'Underworld', 'Sirens'] } },
    { question_type: 'matching', question_text: 'Match each figure to their island.',
      options: [], correct_answer: JSON.stringify({ Circe: 'Aeaea', Calypso: 'Ogygia', Polyphemus: 'Sicily' }),
      meta: { matchingLeft: ['Circe', 'Calypso', 'Polyphemus'],
        matchingRight: ['Aeaea', 'Ogygia', 'Sicily'],
        correctPairs: { Circe: 'Aeaea', Calypso: 'Ogygia', Polyphemus: 'Sicily' } } },
    { question_type: 'vocabulary_in_context', question_text: 'What does "wine-dark" describe?',
      options: ['the sea', 'the sky', 'a shield', 'a robe'], correct_answer: 'the sea',
      meta: { vocabWord: 'wine-dark', passage: 'He sailed upon the wine-dark sea toward home.' } },
    { question_type: 'passage_id', question_text: 'Which work opens with this line?',
      options: ['The Odyssey', 'The Iliad', 'The Aeneid', 'Beowulf'], correct_answer: 'The Odyssey',
      meta: { passage: 'Tell me, O muse, of that ingenious hero…' } },
    { question_type: 'close_reading', question_text: 'What does the shroud symbolize?',
      options: ['delay', 'grief', 'wealth', 'war'], correct_answer: 'delay',
      meta: { passage: 'By day she wove at the great web, by night she unravelled it.' } },
    { question_type: 'tf_with_reason', question_text: 'Penelope recognizes Odysseus at once.',
      options: ['True', 'False'], correct_answer: 'false|1',
      meta: { tfReasons: ['She fears the gods deceive her', 'She tests him with the bed', 'She never doubts'],
        tfCorrectReason: 1 } },
    { question_type: 'theme_analysis', question_text: 'The suitors chiefly embody which failing?',
      options: ['violated hospitality', 'cowardice in battle', 'excess piety', 'wanderlust'],
      correct_answer: 'violated hospitality' },
    { question_type: 'cross_reference', question_text: 'Which later epic reworks the descent to the dead?',
      options: ['The Aeneid', 'Le Morte d\u2019Arthur', 'Paradise Lost', 'Beowulf'],
      correct_answer: 'The Aeneid', meta: { crossRefBookId: 'the-aeneid', crossRefLabel: 'The Aeneid' } },
    { question_type: 'short_answer', question_text: 'Name the island Odysseus rules.',
      options: [], correct_answer: null, meta: { acceptedAnswers: ['Ithaca', 'the island of Ithaca'] } },
    { question_type: 'reflection', question_text: 'Reflect on homecoming in the poem.',
      options: [], correct_answer: null, points: 4, max_points: 4,
      meta: { reflectionPrompt: 'Reflect on what homecoming costs Odysseus.', reflectionWordMin: 20, reflectionWordMax: 200 } },
    { question_type: 'free_response', question_text: 'How does disguise drive the second half of the epic?',
      options: [], correct_answer: null, points: 4, max_points: 4,
      reference_answer: 'Disguise lets Odysseus test loyalty before revealing himself.',
      rubric: { max_points: 4, criteria: [
        { name: 'Thesis', points: 1, descriptor: 'Clear claim about disguise' },
        { name: 'Evidence', points: 2, descriptor: 'Cites beggar scenes or tests' },
        { name: 'Insight', points: 1, descriptor: 'Connects disguise to recognition' } ] } },
  ]

  const rows = questions.map((q, idx) => ({
    quiz_id: quiz.id,
    question_type: q.question_type,
    question_text: q.question_text,
    options: q.options ?? null,
    correct_answer: q.correct_answer ?? null,
    explanation: null,
    points: q.points ?? 1,
    max_points: q.max_points ?? q.points ?? 1,
    sort_order: idx,
    meta: q.meta ?? {},
    rubric: q.rubric ?? null,
    reference_answer: q.reference_answer ?? null,
  }))
  const { error: insErr } = await db.from('teacher_quiz_questions').insert(rows)
  if (insErr) throw new Error('questions insert failed: ' + insErr.message)

  const { data: assignment, error: aErr } = await db
    .from('assignments')
    .insert({
      classroom_id: classroom.id,
      teacher_id: teacher.id,
      type: 'quiz',
      quiz_id: quiz.id,
      title: TITLE,
      scope: 'classroom',
      status: 'active',
      points_available: 100,
    })
    .select('id')
    .single()
  if (aErr || !assignment) throw new Error('assignment insert failed: ' + aErr?.message)

  console.log('quiz:', quiz.id)
  console.log('classroom:', classroom.id, classroom.name)
  console.log('assignment:', assignment.id)
  console.log('take URL: /classroom/' + classroom.id + '/quiz/' + quiz.id)
  console.log('results URL: /classroom/quiz-builder/' + quiz.id + '/results')
}

main().catch((e) => { console.error(e); process.exit(1) })
