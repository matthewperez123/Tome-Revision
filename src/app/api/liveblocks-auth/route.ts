import { Liveblocks } from "@liveblocks/node"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Secure Liveblocks auth endpoint — the single security boundary for every
 * Liveblocks room in the app. The browser never sees the Liveblocks secret:
 * the client posts the room it wants here, we verify the Supabase session
 * server-side, decide what (if anything) the user may do in that room, and
 * hand back a signed token scoped accordingly.
 *
 * Room families:
 *
 *  book:{bookId}
 *    Live co-reader presence in the open library. Any authenticated reader
 *    gets READ_ACCESS (read + presence:write only) — broadcast/observe
 *    presence, never mutate shared storage.
 *
 *  classroom:{classroomId}:book:{bookId}
 *    Live co-reader presence scoped to a class. Authorized ONLY if the user is
 *    a member of that classroom (SECURITY DEFINER user_is_classroom_member)
 *    AND the classroom has live_presence_enabled — otherwise 403. READ_ACCESS.
 *
 *  reader:{bookId}  (legacy)
 *    Original co-reader room prefix. Still granted READ_ACCESS for any
 *    authenticated user so older links keep working.
 *
 *  gs:{sessionId}:{bookId}:{chapterIndex}[:{studentId}]
 *    Guided-session margin annotations (Liveblocks Comments). Privacy is
 *    enforced here by room topology, not client-side hiding (Comments has no
 *    per-thread read ACL):
 *      - collaborative      -> shared room `gs:{sid}:{book}:{ch}`; every
 *                              participant + the teacher gets FULL_ACCESS.
 *      - private_to_teacher -> per-student room `gs:{sid}:{book}:{ch}:{uid}`;
 *                              only that student (their own room) + the
 *                              teacher (any student's room) get FULL_ACCESS.
 *    A student is NEVER granted another student's room. `annotations_enabled`
 *    false mints nothing. The role in userInfo is derived from session
 *    ownership server-side and is never trusted from the client.
 */
export async function POST(request: Request) {
  // Construct lazily inside the handler: the Liveblocks constructor validates
  // the secret eagerly, so a module-level instance throws during `next build`
  // page-data collection when LIVEBLOCKS_SECRET_KEY is absent (e.g. on Vercel).
  if (!process.env.LIVEBLOCKS_SECRET_KEY) {
    return new NextResponse("Liveblocks not configured", { status: 501 })
  }

  const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY,
  })

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // Which room does the client want? Liveblocks posts `{ room }`.
  let requestedRoom: string | null = null
  try {
    const json = (await request.json()) as { room?: unknown }
    if (typeof json.room === "string") requestedRoom = json.room
  } catch {
    // No/invalid body — fall through to the reader presence default grant.
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle()

  // role is set below only when authorizing a guided-annotation room.
  let role: "teacher" | "student" | undefined

  // ── Guided-session annotation rooms — the gated path ─────────────────────
  if (requestedRoom?.startsWith("gs:")) {
    const decision = await authorizeGuidedRoom(supabase, requestedRoom, user.id)
    if (!decision.ok) {
      return new NextResponse(decision.reason, { status: decision.status })
    }
    role = decision.role

    const session = liveblocks.prepareSession(user.id, {
      userInfo: {
        name: profile?.display_name ?? "Reader",
        avatar: profile?.avatar_url ?? undefined,
        role,
      },
    })
    session.allow(requestedRoom, session.FULL_ACCESS)

    const { status, body } = await session.authorize()
    return new NextResponse(body, { status })
  }

  // ── Classroom co-reader rooms — membership + live_presence_enabled gated ──
  if (requestedRoom?.startsWith("classroom:")) {
    const decision = await authorizeClassroomRoom(
      supabase,
      requestedRoom,
      user.id,
    )
    if (!decision.ok) {
      return new NextResponse(decision.reason, { status: decision.status })
    }

    const session = liveblocks.prepareSession(user.id, {
      userInfo: {
        name: profile?.display_name ?? "Reader",
        avatar: profile?.avatar_url ?? undefined,
        role: decision.role,
      },
    })
    session.allow(requestedRoom, session.READ_ACCESS)

    const { status, body } = await session.authorize()
    return new NextResponse(body, { status })
  }

  // ── Reader co-presence rooms (book:* and legacy reader:*) — READ_ACCESS ───
  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: profile?.display_name ?? "Reader",
      avatar: profile?.avatar_url ?? undefined,
    },
  })
  session.allow("book:*", session.READ_ACCESS)
  session.allow("reader:*", session.READ_ACCESS)

  const { status, body } = await session.authorize()
  return new NextResponse(body, { status })
}

type ClassroomAuthResult =
  | { ok: true; role: "teacher" | "student" }
  | { ok: false; status: number; reason: string }

/**
 * Decide whether `userId` may enter a `classroom:{cid}:book:{bid}` co-reader
 * room. Requires classroom membership AND live_presence_enabled. Fails closed.
 * The role placed in userInfo is derived server-side from the member row.
 */
async function authorizeClassroomRoom(
  supabase: Awaited<ReturnType<typeof createClient>>,
  room: string,
  userId: string,
): Promise<ClassroomAuthResult> {
  // classroom : classroomId : book : bookId  (bookId may itself contain no ':')
  const parts = room.split(":")
  if (parts.length !== 4 || parts[2] !== "book") {
    return { ok: false, status: 400, reason: "Malformed room" }
  }
  const classroomId = parts[1]
  const bookId = parts[3]
  if (!classroomId || !bookId) {
    return { ok: false, status: 400, reason: "Malformed room" }
  }

  const { data: isMember, error } = await supabase.rpc(
    "user_is_classroom_member",
    { p_user: userId, p_classroom: classroomId },
  )
  if (error || isMember !== true) {
    return { ok: false, status: 403, reason: "Not a classroom member" }
  }

  // Presence is a per-classroom setting; when off, mint nothing.
  const { data: classroom } = await supabase
    .from("classrooms")
    .select("live_presence_enabled")
    .eq("id", classroomId)
    .maybeSingle()
  if (classroom?.live_presence_enabled === false) {
    return { ok: false, status: 403, reason: "Live presence disabled" }
  }

  // Role is informational for the avatar UI; owner/co_teacher/ta => teacher.
  const isStaff = await supabase.rpc("user_has_classroom_role", {
    p_user_id: userId,
    p_classroom_id: classroomId,
    p_roles: ["owner", "co_teacher", "ta"],
  })
  return { ok: true, role: isStaff.data === true ? "teacher" : "student" }
}

type GuidedAuthResult =
  | { ok: true; role: "teacher" | "student" }
  | { ok: false; status: number; reason: string }

/**
 * Decide whether `userId` may enter `room` (a `gs:` annotation room) and with
 * what role. Pure authorization — no token minting. Fails closed.
 */
async function authorizeGuidedRoom(
  supabase: Awaited<ReturnType<typeof createClient>>,
  room: string,
  userId: string,
): Promise<GuidedAuthResult> {
  // gs : sessionId : bookId : chapterIndex [ : studentId ]
  const parts = room.split(":")
  if (parts.length < 4 || parts.length > 5) {
    return { ok: false, status: 400, reason: "Malformed room" }
  }
  const [, sessionId, bookId, chapterIndexRaw, roomStudentId] = parts
  const chapterIndex = Number(chapterIndexRaw)
  if (!sessionId || !bookId || !Number.isInteger(chapterIndex)) {
    return { ok: false, status: 400, reason: "Malformed room" }
  }

  const { data: gsession } = await supabase
    .from("guided_sessions")
    .select(
      "teacher_id, annotations_enabled, annotation_visibility, book_id, chapter_index",
    )
    .eq("id", sessionId)
    .maybeSingle()

  if (!gsession) {
    return { ok: false, status: 403, reason: "No such session" }
  }
  if (gsession.annotations_enabled === false) {
    return { ok: false, status: 403, reason: "Annotations disabled" }
  }
  // The room must name this session's actual chapter — don't authorize a room
  // for content the session isn't pinned to.
  if (gsession.book_id !== bookId || gsession.chapter_index !== chapterIndex) {
    return { ok: false, status: 403, reason: "Room/chapter mismatch" }
  }

  const isTeacher = gsession.teacher_id === userId
  const visibility =
    gsession.annotation_visibility === "private_to_teacher"
      ? "private_to_teacher"
      : "collaborative"

  if (isTeacher) {
    // Teacher owns the session: full access to the shared room and to every
    // per-student room within it. (Room/chapter already validated above.)
    return { ok: true, role: "teacher" }
  }

  // Otherwise the user must be an enrolled participant of this session.
  const { data: participant } = await supabase
    .from("guided_session_participants")
    .select("id")
    .eq("session_id", sessionId)
    .eq("student_id", userId)
    .maybeSingle()

  if (!participant) {
    return { ok: false, status: 403, reason: "Not a participant" }
  }

  if (visibility === "collaborative") {
    // Shared room only — a per-student room id is never valid here.
    if (roomStudentId) {
      return { ok: false, status: 403, reason: "Not a collaborative room" }
    }
    return { ok: true, role: "student" }
  }

  // private_to_teacher: a student may ONLY enter their own per-student room.
  if (roomStudentId !== userId) {
    return { ok: false, status: 403, reason: "Cross-student access denied" }
  }
  return { ok: true, role: "student" }
}
