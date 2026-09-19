import { test, expect, type Page } from "@playwright/test"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import fs from "node:fs"
import path from "node:path"

/**
 * GATE 1 — the assignment money-loop, end to end (launch/week-1).
 *
 * Hypatia (teacher) creates reading assignments in the composer with each of
 * the three quiz modes; Beatrice (student) opens them through the canonical
 * assignment link, reads to the end of the range in the GENERAL reader, and:
 *   platform → Begin Quiz → trial overlay (no difficulty drop-up) → graded
 *   teacher  → Begin Quiz → QuizAttemptRunner overlay → teacher_quiz_results
 *   none     → Mark as read → full points
 * DB assertions ride on the service-role client (test cohort only). Every row
 * this spec creates is deleted in afterAll.
 */

// ── Env + fixtures ────────────────────────────────────────────────────────

function loadEnvLocal(): Record<string, string> {
  const file = path.resolve(__dirname, "../.env.local")
  const out: Record<string, string> = {}
  if (!fs.existsSync(file)) return out
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "")
  }
  return out
}
const env = { ...loadEnvLocal(), ...process.env } as Record<string, string>

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

const PW = "TomeTest!2026"
const TEACHER = "hypatia.teacher@tome.test"
const STUDENT = "beatrice.student@tome.test"
const CLS = "5b191168-4da0-4740-ab9a-c3b6397b5d09" // Rhetoric & Poetics 10
const BOOK = "the-odyssey"
const OTHER_BOOK = "frankenstein"
const PREFIX = "[E2E-LOOP]"

let admin: SupabaseClient
let studentId: string
let teacherId: string
let savedStudentPrefs: Record<string, unknown> | null = null
let savedReadingProgress: Record<string, unknown> | null = null
const createdAssignmentIds: string[] = []
let seededTeacherQuizId: string | null = null
const startedAt = new Date().toISOString()

test.describe.configure({ mode: "serial" })
test.setTimeout(240_000)

test.beforeAll(async () => {
  expect(SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL required").toBeTruthy()
  expect(SERVICE_KEY, "SUPABASE_SERVICE_ROLE_KEY required").toBeTruthy()
  admin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  // profiles has no email column — resolve the auth user, then confirm the profile.
  const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const authUser = users?.users.find((u) => u.email === STUDENT)
  expect(authUser?.id, "Beatrice auth user").toBeTruthy()
  const teacherUser = users?.users.find((u) => u.email === TEACHER)
  expect(teacherUser?.id, "Hypatia auth user").toBeTruthy()
  teacherId = teacherUser!.id
  const { data: prof } = await admin
    .from("profiles")
    .select("id")
    .eq("id", authUser!.id)
    .maybeSingle<{ id: string }>()
  expect(prof?.id, "Beatrice profile").toBeTruthy()
  studentId = prof!.id

  // Reader mode: the reader loads server-side reading_preferences over
  // localStorage, so pin Beatrice to scroll mode (where the persistent
  // chapter-end CTA renders); restored in afterAll.
  const { data: prevPrefs } = await admin
    .from("reading_preferences")
    .select("prefs")
    .eq("user_id", studentId)
    .maybeSingle<{ prefs: Record<string, unknown> }>()
  savedStudentPrefs = prevPrefs?.prefs ?? null
  await admin.from("reading_preferences").upsert(
    {
      user_id: studentId,
      prefs: { ...(savedStudentPrefs ?? {}), mode: "scroll" },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  )

  // Reader resume: the reader restores saved reading_progress, which can
  // override the ?ch= chapter under test (after test 4 passes a quiz once,
  // progress sits at range-end). Clear Beatrice's the-odyssey position for a
  // deterministic run; restored in afterAll.
  const { data: prevRp } = await admin
    .from("reading_progress")
    .select("*")
    .eq("user_id", studentId)
    .eq("book_id", BOOK)
    .maybeSingle<Record<string, unknown>>()
  savedReadingProgress = prevRp ?? null
  await admin.from("reading_progress").delete().eq("user_id", studentId).eq("book_id", BOOK)

  // Sweep any leftovers from a previous crashed run.
  const { data: stale } = await admin
    .from("assignments")
    .select("id")
    .eq("classroom_id", CLS)
    .like("title", `${PREFIX}%`)
  for (const a of stale ?? []) await admin.from("assignments").delete().eq("id", a.id)
  await admin.from("teacher_quizzes").delete().like("title", `${PREFIX}%`)
})

test.afterAll(async () => {
  if (!admin) return
  if (studentId) {
    if (savedStudentPrefs) {
      await admin.from("reading_preferences").upsert(
        { user_id: studentId, prefs: savedStudentPrefs, updated_at: new Date().toISOString() },
        { onConflict: "user_id" },
      )
    } else {
      await admin.from("reading_preferences").delete().eq("user_id", studentId)
    }
  }
  if (studentId) {
    await admin.from("reading_progress").delete().eq("user_id", studentId).eq("book_id", BOOK)
    if (savedReadingProgress) {
      await admin.from("reading_progress").insert(savedReadingProgress)
    }
  }
  for (const id of createdAssignmentIds) {
    await admin.from("assignments").delete().eq("id", id)
  }
  if (seededTeacherQuizId) {
    await admin.from("teacher_quizzes").delete().eq("id", seededTeacherQuizId)
  }
  // Practice-ledger rows written by the platform trial during this run.
  await admin
    .from("quiz_results")
    .delete()
    .eq("user_id", studentId)
    .eq("book_id", BOOK)
    .gte("created_at", startedAt)
})

// ── Helpers ───────────────────────────────────────────────────────────────

async function login(page: Page, email: string) {
  await page.goto("/login", { waitUntil: "networkidle" })
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', PW)
  // Retry the submit: clicking before hydration completes is a silent no-op.
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.click('button[type="submit"]')
    try {
      await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 15000 })
      break
    } catch {
      if (attempt === 2) throw new Error(`login as ${email} never left /login`)
    }
  }
  await page.waitForTimeout(1200)
}

function tomorrowLocal(): string {
  const d = new Date(Date.now() + 24 * 3600 * 1000)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T17:00`
}

/**
 * Drives the TeacherAssignmentComposer on /classroom/{CLS} to publish a
 * reading assignment on THE ODYSSEY spanning the first two chapter options,
 * with the requested quiz mode. Returns the created assignment row.
 */
async function composeReadingAssignment(
  page: Page,
  title: string,
  quizMode: "platform" | "teacher" | "none",
  teacherQuizTitle?: string,
) {
  await page.goto(`/classroom/${CLS}`, { waitUntil: "domcontentloaded" })
  await page.getByText("Create a new assignment…").click()
  await page.getByPlaceholder("Assignment title").fill(title)
  await page.getByPlaceholder("Search a book by title or author…").fill("Odyssey")
  await page.getByRole("button", { name: /The Odyssey/ }).first().click()

  // Chapter range: Book I → Book II. NOT the first option — The Odyssey's
  // reader chapter 0 is "Preface" (front matter), where the reader hides its
  // chapter-end CTA entirely (isFrontOrBackMatter). Option values are 0-based
  // reader indexes per the 0.3 convention.
  const fromSel = page.locator("select").nth(0)
  const throughSel = page.locator("select").nth(1)
  await expect(fromSel.locator('option[value="1"]')).toBeAttached()
  await fromSel.selectOption("1")
  await throughSel.selectOption("2")

  // Quiz mode pills.
  if (quizMode === "platform") {
    await page.getByRole("button", { name: "Tome's questions (automatic)" }).click()
    await expect(page.locator("select").filter({ hasText: "Apprentice" }).first()).toBeVisible()
  } else if (quizMode === "teacher") {
    await page.getByRole("button", { name: "One of my quizzes" }).click()
    const quizSel = page.locator("select").nth(2)
    await expect(quizSel.locator("option", { hasText: teacherQuizTitle! })).toBeAttached()
    await quizSel.selectOption({ label: teacherQuizTitle! })
  } else {
    await page.getByRole("button", { name: "No quiz", exact: true }).click()
  }

  await page.locator('input[type="datetime-local"]').fill(tomorrowLocal())
  await page.getByRole("button", { name: "Publish", exact: true }).click()
  await expect(page.getByText(/Published to|Assignment published/).first()).toBeVisible({
    timeout: 20000,
  })

  const { data: a } = await admin
    .from("assignments")
    .select(
      "id, title, classroom_id, book_id, chapter_range_start, chapter_range_end, quiz_id, quiz_mode, platform_quiz_difficulty, points_available, status",
    )
    .eq("classroom_id", CLS)
    .eq("title", title)
    .maybeSingle()
  expect(a, `assignment row for ${title}`).toBeTruthy()
  createdAssignmentIds.push(a!.id as string)
  return a! as {
    id: string
    title: string
    classroom_id: string
    book_id: string
    chapter_range_start: number
    chapter_range_end: number
    quiz_id: string | null
    quiz_mode: string
    platform_quiz_difficulty: string | null
    points_available: number
    status: string
  }
}

/** Opens the student's /assignments list and follows the canonical link. */
async function openAsStudent(page: Page, a: { id: string; title: string; chapter_range_start: number }) {
  await page.goto("/assignments", { waitUntil: "domcontentloaded" })
  const row = page.locator(`a[href*="assignment=${a.id}"]`).first()
  await expect(row).toBeVisible({ timeout: 20000 })
  const href = await row.getAttribute("href")
  expect(href).toBe(
    `/read/${BOOK}?ch=${a.chapter_range_start}&classroom=${CLS}&assignment=${a.id}`,
  )
  await row.click()
  await page.waitForURL(`**/read/${BOOK}**`, { timeout: 25000 })
  await page.waitForTimeout(2500)
}

/** The persistent chapter-end CTA button in the reader. */
function readerCta(page: Page, label: string | RegExp) {
  return page.locator("button.codex-pressable", { hasText: label }).first()
}

/**
 * Wait for a reader CTA, reloading once if it doesn't appear (the reader
 * occasionally loses its first client render to the Liveblocks SSR fallback).
 */
async function waitForReaderCta(page: Page, label: string | RegExp) {
  const cta = readerCta(page, label)
  try {
    await expect(cta).toBeVisible({ timeout: 20000 })
  } catch {
    await page.reload({ waitUntil: "domcontentloaded" })
    await page.waitForTimeout(2500)
    try {
      await expect(cta).toBeVisible({ timeout: 20000 })
    } catch (err) {
      // Diagnostics: what reader state did we actually land in?
      const buttons = await page
        .locator("button.codex-pressable")
        .allInnerTexts()
        .catch(() => [] as string[])
      const spread = await page
        .locator("[data-reader-mode], .paginated-reader, [class*=paginated]")
        .count()
        .catch(() => -1)
      await page
        .screenshot({ path: "test-results/reader-cta-miss.png", fullPage: false })
        .catch(() => {})
      throw new Error(
        `reader CTA "${label}" missing. url=${page.url()} codex-pressable=[${buttons.join(" | ")}] paginated-nodes=${spread}\n${err}`,
      )
    }
  }
  return cta
}

/**
 * Wait for the assignment ribbon (title text) — proof assignmentCtx loaded,
 * so the chapter-end CTA is assignment-aware. Reloads once on a lost first
 * render, same as waitForReaderCta.
 */
async function waitForRibbon(page: Page, title: string) {
  const ribbon = page.getByText(title).first()
  try {
    await expect(ribbon).toBeVisible({ timeout: 20000 })
  } catch {
    await page.reload({ waitUntil: "domcontentloaded" })
    await page.waitForTimeout(2500)
    await expect(ribbon).toBeVisible({ timeout: 20000 })
  }
}

/**
 * Reader prefs default to the paginated "spread" mode, where the chapter-end
 * CTA lives inside PaginatedReader. The persistent codex-pressable CTA renders
 * in scroll mode — seed that preference before the page loads (a legitimate
 * user setting mirrored to localStorage).
 */
async function forceScrollMode(page: Page) {
  await page.addInitScript(() => {
    try {
      const raw = window.localStorage.getItem("tome-reader-prefs")
      const prefs = raw ? JSON.parse(raw) : {}
      prefs.mode = "scroll"
      window.localStorage.setItem("tome-reader-prefs", JSON.stringify(prefs))
    } catch {
      window.localStorage.setItem("tome-reader-prefs", JSON.stringify({ mode: "scroll" }))
    }
  })
}

async function fetchSubmission(assignmentId: string) {
  const { data: sub } = await admin
    .from("assignment_submissions")
    .select("id, status, score")
    .eq("assignment_id", assignmentId)
    .eq("student_id", studentId)
    .maybeSingle<{ id: string; status: string; score: number | null }>()
  return sub
}

// ── Scenario 1–5: platform quiz mode ──────────────────────────────────────

let platformAssignment: Awaited<ReturnType<typeof composeReadingAssignment>>

test("teacher composes a reading assignment with Tome's questions (Apprentice)", async ({ page }) => {
  await login(page, TEACHER)
  platformAssignment = await composeReadingAssignment(
    page,
    `${PREFIX} Odyssey platform loop`,
    "platform",
  )
  expect(platformAssignment.status).toBe("active")
  expect(platformAssignment.quiz_mode).toBe("platform")
  expect(platformAssignment.platform_quiz_difficulty).toBe("Apprentice")
  expect(platformAssignment.quiz_id).toBeNull()
  expect(platformAssignment.book_id).toBe(BOOK)
  expect(platformAssignment.chapter_range_end).toBeGreaterThan(
    platformAssignment.chapter_range_start,
  )
})

test("student opens the assignment via the canonical link and sees the ribbon", async ({ page }) => {
  await login(page, STUDENT)
  await openAsStudent(page, platformAssignment)
  const rs = platformAssignment.chapter_range_start
  const re = platformAssignment.chapter_range_end
  // Ribbon: title · Chapters (display numbers = 0-based index + 1) · due …
  await expect(page.getByText(platformAssignment.title).first()).toBeVisible({ timeout: 15000 })
  await expect(page.getByText(`Chapters ${rs + 1}–${re + 1}`).first()).toBeVisible()
  await expect(page.getByText(/· due /).first()).toBeVisible()
})

test("mid-range CTA continues reading; range-end CTA is Begin Quiz (codex-pressable)", async ({ page }) => {
  await forceScrollMode(page)
  await login(page, STUDENT)
  const rs = platformAssignment.chapter_range_start
  await page.goto(
    `/read/${BOOK}?ch=${rs}&classroom=${CLS}&assignment=${platformAssignment.id}`,
    { waitUntil: "domcontentloaded" },
  )
  await page.waitForTimeout(2500)
  await waitForRibbon(page, platformAssignment.title)

  const cont = await waitForReaderCta(page, "Continue reading")
  await cont.click()
  await page.waitForTimeout(2000)

  // Now at the range end — the CTA becomes Begin Quiz.
  const begin = await waitForReaderCta(page, /^Begin (Final )?Quiz$/)
  await expect(begin).toHaveClass(/codex-pressable/)
})

test("Begin Quiz opens the Apprentice trial directly (no drop-up), student passes, chain grades", async ({ page }) => {
  // Answer key: replicate the resolver — chapter quiz in range (end-first),
  // else the book-level Apprentice bank.
  const rs = platformAssignment.chapter_range_start
  const re = platformAssignment.chapter_range_end
  let quizId: string | null = null
  const { data: chQuiz } = await admin
    .from("quizzes")
    .select("id")
    .eq("book_id", BOOK)
    .eq("difficulty", "Apprentice")
    .gte("chapter_index", rs)
    .lte("chapter_index", re)
    .order("chapter_index", { ascending: false })
    .limit(1)
    .maybeSingle<{ id: string }>()
  quizId = chQuiz?.id ?? null
  if (!quizId) {
    const { data: bookQuiz } = await admin
      .from("quizzes")
      .select("id")
      .eq("book_id", BOOK)
      .eq("difficulty", "Apprentice")
      .is("chapter_index", null)
      .limit(1)
      .maybeSingle<{ id: string }>()
    quizId = bookQuiz?.id ?? null
  }
  expect(quizId, "an Apprentice platform bank must exist for the-odyssey").toBeTruthy()
  const { data: qRows } = await admin
    .from("questions")
    .select("question_text, correct_answer, type")
    .eq("quiz_id", quizId!)
  const answerKey = (qRows ?? []) as {
    question_text: string
    correct_answer: string
    type: string | null
  }[]
  expect(answerKey.length).toBeGreaterThan(0)

  await forceScrollMode(page)
  await login(page, STUDENT)
  await page.goto(
    `/read/${BOOK}?ch=${re}&classroom=${CLS}&assignment=${platformAssignment.id}`,
    { waitUntil: "domcontentloaded" },
  )
  await page.waitForTimeout(2500)
  await waitForRibbon(page, platformAssignment.title)
  await (await waitForReaderCta(page, /^Begin (Final )?Quiz$/)).click()

  // No difficulty drop-up — the overlay opens on intro/quiz with the tier
  // preselected. (The drop-up's tier chooser never renders.)
  const beginBtn = page.getByRole("button", { name: "Begin", exact: true })
  await expect(
    page.getByText(/Question 1 of/).or(beginBtn).first(),
  ).toBeVisible({ timeout: 25000 })
  if (await beginBtn.isVisible().catch(() => false)) await beginBtn.click()
  await expect(page.getByText(/Question 1 of/).first()).toBeVisible({ timeout: 15000 })

  // Answer every question correctly from the DB key.
  const totalText = await page.getByText(/Question \d+ of \d+/).first().innerText()
  const total = parseInt(totalText.match(/of (\d+)/)![1], 10)
  for (let i = 0; i < total; i++) {
    await expect(page.getByText(`Question ${i + 1} of ${total}`).first()).toBeVisible({
      timeout: 15000,
    })
    // fill_blank renders no prompt heading — the renderer owns the prompt and
    // exposes a textbox ("Fill in the blank" inline / "Your answer" below).
    const blankInput = page.getByLabel(/^(Fill in the blank|Your answer)$/).first()
    if (await blankInput.isVisible().catch(() => false)) {
      const para = await page
        .locator("p.font-serif")
        .first()
        .innerText()
        .catch(() => "")
      const blanks = answerKey.filter((q) => q.type === "fill_blank")
      const match =
        blanks.find((q) => {
          const head = q.question_text
            .replace(/^Fill in the blank:\s*/i, "")
            .split(/_{2,}/)[0]
            ?.trim()
            .slice(0, 24)
          return head ? para.includes(head) : false
        }) ?? blanks[0]
      expect(match, "fill-blank answer key row").toBeTruthy()
      await blankInput.fill(match!.correct_answer)
      await page.getByRole("button", { name: "Check Answer" }).first().click()
    } else {
      const prompt = await page.locator("p.font-serif.font-semibold").first().innerText()
      const match = answerKey.find(
        (q) =>
          prompt.includes(q.question_text.slice(0, 40)) ||
          q.question_text.includes(prompt.slice(0, 40)),
      )
      expect(match, `answer key for prompt: ${prompt.slice(0, 60)}`).toBeTruthy()
      // OptionButton renders "<badge> <text>" — match the option text exactly
      // inside the button. TrueFalse holds its label as a direct text node
      // (not a descendant element), so fall back to clicking the text itself.
      const byChild = page
        .getByRole("button")
        .filter({ has: page.getByText(match!.correct_answer, { exact: true }) })
      if ((await byChild.count()) > 0) {
        await byChild.first().click()
      } else {
        await page.getByText(match!.correct_answer, { exact: true }).first().click()
      }
    }
    // The feedback bar's Continue/See Results button rides a framer-motion
    // spring and can stay "unstable" for Playwright; the overlay also maps
    // Enter → NEXT once answered, so advance via keyboard instead.
    const nextLabel = i === total - 1 ? "See Results" : "Continue"
    await expect(
      page.getByRole("button", { name: nextLabel }).first(),
    ).toBeVisible({ timeout: 20000 })
    await page.waitForTimeout(600)
    await page.keyboard.press("Enter")
  }

  // Results: passed → "Next chapter" fires onPass → finalize.
  const pctLine = page.getByText(/% correct/).first()
  try {
    await expect(pctLine).toBeVisible({ timeout: 15000 })
  } catch {
    // Enter may have missed the final NEXT — click the button as fallback.
    await page
      .getByRole("button", { name: "See Results" })
      .first()
      .click({ force: true })
      .catch(() => {})
    await expect(pctLine).toBeVisible({ timeout: 15000 })
  }
  const heading = await page.locator("h2").first().innerText()
  const scoreLine = await pctLine.innerText()
  expect(heading, `trial results heading "${heading}" (${scoreLine})`).toMatch(
    /Flawless|Trial passed/,
  )
  await page.getByRole("button", { name: /Next chapter|Finish book/ }).first().click()
  await page.waitForTimeout(4000)

  // DB chain: submission graded, grades ≤ points, grade_history mirror,
  // gradebook RPC row, graded notification.
  const sub = await fetchSubmission(platformAssignment.id)
  expect(sub?.status).toBe("graded")
  const { data: grade } = await admin
    .from("grades")
    .select("id, score, max_score")
    .eq("submission_id", sub!.id)
    .maybeSingle<{ id: string; score: number; max_score: number }>()
  expect(grade).toBeTruthy()
  expect(grade!.score).toBeLessThanOrEqual(platformAssignment.points_available)
  expect(grade!.max_score).toBe(platformAssignment.points_available)
  const { data: hist } = await admin
    .from("grade_history")
    .select("id")
    .eq("grade_id", grade!.id)
  expect((hist ?? []).length).toBeGreaterThan(0)
  // classroom_gradebook raises NOT_AUTHENTICATED for service role (auth.uid()
  // is null) — call it as the teacher, the way the gradebook UI does.
  const teacherClient = createClient(SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { error: signInErr } = await teacherClient.auth.signInWithPassword({
    email: TEACHER,
    password: PW,
  })
  expect(signInErr, "teacher sign-in for gradebook RPC").toBeNull()
  const { data: gb, error: gbErr } = await teacherClient.rpc("classroom_gradebook", {
    p_classroom: CLS,
  })
  expect(gbErr, "classroom_gradebook RPC").toBeNull()
  await teacherClient.auth.signOut()
  const gbRow = ((gb ?? []) as Record<string, unknown>[]).find(
    (r) => r.assignment_id === platformAssignment.id && r.student_id === studentId,
  )
  expect(gbRow, "gradebook row").toBeTruthy()
  const { data: notif } = await admin
    .from("notifications")
    .select("id")
    .eq("recipient_id", studentId)
    .eq("type", "assignment_graded")
    .gte("created_at", startedAt)
  expect((notif ?? []).length).toBeGreaterThan(0)
})

// ── Scenario 6: teacher quiz mode ─────────────────────────────────────────

let teacherAssignment: Awaited<ReturnType<typeof composeReadingAssignment>>
const TEACHER_QUIZ_TITLE = `${PREFIX} Odyssey checkpoint quiz`

test("teacher quiz mode: composer attach → student QuizAttemptRunner → teacher_quiz_results", async ({ page, browser }) => {
  // Seed a small published quiz owned by Hypatia on this book.
  const { data: tq, error: tqErr } = await admin
    .from("teacher_quizzes")
    .insert({
      teacher_id: teacherId,
      title: TEACHER_QUIZ_TITLE,
      book_id: BOOK,
      status: "published",
      passing_score: 60,
      allow_retakes: true,
      randomize_order: false,
      show_answers: true,
      time_limit_minutes: null,
    })
    .select("id")
    .single<{ id: string }>()
  expect(tqErr, tqErr?.message).toBeNull()
  seededTeacherQuizId = tq!.id
  await admin.from("teacher_quiz_questions").insert([
    {
      quiz_id: tq!.id,
      question_type: "multiple_choice",
      question_text: "Who is the hero of the Odyssey?",
      options: ["Odysseus", "Achilles", "Hector", "Aeneas"],
      correct_answer: "Odysseus",
      points: 1,
      sort_order: 0,
    },
    {
      quiz_id: tq!.id,
      question_type: "multiple_choice",
      question_text: "Odysseus is king of which island?",
      options: ["Ithaca", "Crete", "Delos", "Samos"],
      correct_answer: "Ithaca",
      points: 1,
      sort_order: 1,
    },
  ])

  await login(page, TEACHER)
  teacherAssignment = await composeReadingAssignment(
    page,
    `${PREFIX} Odyssey teacher-quiz loop`,
    "teacher",
    TEACHER_QUIZ_TITLE,
  )
  expect(teacherAssignment.quiz_mode).toBe("teacher")
  expect(teacherAssignment.quiz_id).toBe(seededTeacherQuizId)

  // Student takes it in a fresh context.
  const studentCtx = await browser.newContext()
  const sp = await studentCtx.newPage()
  await forceScrollMode(sp)
  await login(sp, STUDENT)
  await sp.goto(
    `/read/${BOOK}?ch=${teacherAssignment.chapter_range_end}&classroom=${CLS}&assignment=${teacherAssignment.id}`,
    { waitUntil: "domcontentloaded" },
  )
  await sp.waitForTimeout(2500)
  // Ribbon visible = assignmentCtx loaded; without it "Begin Quiz" falls
  // through to the plain platform trial path.
  await waitForRibbon(sp, teacherAssignment.title)
  await (await waitForReaderCta(sp, /^Begin (Final )?Quiz$/)).click()

  // QuizAttemptRunner overlay: answer both, submit.
  await expect(sp.getByText("Who is the hero of the Odyssey?").first()).toBeVisible({
    timeout: 25000,
  })
  await sp.getByRole("button", { name: "Odysseus", exact: true }).click()
  await sp.getByRole("button", { name: "Ithaca", exact: true }).click()
  await sp.getByRole("button", { name: "Submit quiz" }).click()
  await sp.waitForTimeout(5000)

  const { data: result } = await admin
    .from("teacher_quiz_results")
    .select("id, score")
    .eq("quiz_id", seededTeacherQuizId!)
    .eq("student_id", studentId)
    .maybeSingle<{ id: string; score: number }>()
  expect(result, "teacher_quiz_results row").toBeTruthy()
  const sub = await fetchSubmission(teacherAssignment.id)
  expect(sub?.status).toBe("graded")
  await studentCtx.close()
})

// ── Scenario 7: no-quiz mode ──────────────────────────────────────────────

test("no-quiz mode: Mark as read finalizes at full points", async ({ page, browser }) => {
  await login(page, TEACHER)
  const a = await composeReadingAssignment(page, `${PREFIX} Odyssey no-quiz loop`, "none")
  expect(a.quiz_mode).toBe("none")

  const studentCtx = await browser.newContext()
  const sp = await studentCtx.newPage()
  await forceScrollMode(sp)
  await login(sp, STUDENT)
  await sp.goto(
    `/read/${BOOK}?ch=${a.chapter_range_end}&classroom=${CLS}&assignment=${a.id}`,
    { waitUntil: "domcontentloaded" },
  )
  await sp.waitForTimeout(3500)
  await waitForRibbon(sp, a.title)

  // Either the ambient finalizer already fired (mode 'none' is in its default
  // scope) or the CTA reads "Mark as read" — accept both, then assert DB.
  const marked = sp.getByText(/Assignment complete|Reading assignment complete/).first()
  const cta = readerCta(sp, "Mark as read")
  await expect(marked.or(cta).first()).toBeVisible({ timeout: 20000 })
  if (await cta.isVisible().catch(() => false)) {
    await cta.click()
  }

  // The finalize write is async — poll the DB rather than trusting a fixed wait.
  let sub = await fetchSubmission(a.id)
  for (let i = 0; i < 20 && sub?.status !== "graded"; i++) {
    await sp.waitForTimeout(1500)
    sub = await fetchSubmission(a.id)
  }
  expect(sub?.status).toBe("graded")
  const { data: grade } = await admin
    .from("grades")
    .select("score, max_score")
    .eq("submission_id", sub!.id)
    .maybeSingle<{ score: number; max_score: number }>()
  expect(grade?.score).toBe(a.points_available)
  await studentCtx.close()
})

// ── Scenario 8: stale assignment param ────────────────────────────────────

test("stale ?assignment= for another book shows no ribbon", async ({ page }) => {
  await login(page, STUDENT)
  await page.goto(
    `/read/${OTHER_BOOK}?ch=0&classroom=${CLS}&assignment=${platformAssignment.id}`,
    { waitUntil: "domcontentloaded" },
  )
  await page.waitForTimeout(3500)
  await expect(page.getByText(platformAssignment.title)).toHaveCount(0)
  await expect(page.getByText(/· due /)).toHaveCount(0)
})
