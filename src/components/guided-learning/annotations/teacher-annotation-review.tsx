"use client"

import "@liveblocks/react-ui/styles.css"

import { useMemo, useState } from "react"
import {
  LiveblocksProvider,
  RoomProvider,
  useThreads,
  useEditThreadMetadata,
  useDeleteThread,
} from "@liveblocks/react"
import { Thread } from "@liveblocks/react-ui"
import type { ThreadData } from "@liveblocks/client"
import type {
  GuidedSession,
  Station,
  ParticipantWithProfile,
} from "@/lib/guided-learning-types"

const LAPIS = "#2A4B8D"
const GOLD = "#C8A24B"

type AnnotationThread = ThreadData<Liveblocks["ThreadMetadata"]>

interface ReadingTarget {
  bookId: string
  chapterIndex: number
  label: string
}

interface TeacherAnnotationReviewProps {
  session: GuidedSession
  stations: Station[]
  participants: ParticipantWithProfile[]
}

/** Derive the chapters that carry annotation rooms for this session. */
function readingTargets(session: GuidedSession, stations: Station[]): ReadingTarget[] {
  const readingStations = stations.filter(
    (s) => s.type === "reading" && s.book_id && s.chapter_start != null,
  )
  if (readingStations.length > 0) {
    return readingStations.map((s, i) => ({
      bookId: s.book_id as string,
      chapterIndex: s.chapter_start as number,
      label: s.title?.trim() || `Reading ${i + 1} · ch. ${s.chapter_start}`,
    }))
  }
  // Legacy single-task chapter session.
  if (session.book_id && session.chapter_index != null) {
    return [
      {
        bookId: session.book_id,
        chapterIndex: session.chapter_index,
        label: `Chapter ${session.chapter_index}`,
      },
    ]
  }
  return []
}

/**
 * Teacher-facing moderation surface for guided-session margin annotations.
 * Lists every annotation thread for a chosen reading and lets the teacher
 * endorse, delete, resolve, or reply — reading the same Liveblocks rooms the
 * students write to (the auth endpoint grants the teacher FULL_ACCESS to each).
 *
 * In `private_to_teacher` mode each student has their own room, so we mount one
 * room per participant and group threads by student. In `collaborative` mode a
 * single shared room holds the whole class.
 */
export function TeacherAnnotationReview({
  session,
  stations,
  participants,
}: TeacherAnnotationReviewProps) {
  const targets = useMemo(
    () => readingTargets(session, stations),
    [session, stations],
  )
  const [targetIdx, setTargetIdx] = useState(0)

  if (session.annotations_enabled === false) {
    return (
      <p className="px-4 py-6 text-sm opacity-50">
        Annotations are disabled for this session.
      </p>
    )
  }
  if (targets.length === 0) {
    return (
      <p className="px-4 py-6 text-sm opacity-50">
        This session has no reading stations to annotate.
      </p>
    )
  }

  const target = targets[Math.min(targetIdx, targets.length - 1)]
  const baseRoom = `gs:${session.id}:${target.bookId}:${target.chapterIndex}`
  const isPrivate = session.annotation_visibility === "private_to_teacher"

  return (
    <div className="rubric-annotations">
      {targets.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-2 px-4 pt-4">
          {targets.map((t, i) => (
            <button
              key={`${t.bookId}:${t.chapterIndex}:${i}`}
              type="button"
              onClick={() => setTargetIdx(i)}
              className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
              style={{
                fontFamily: "var(--font-sans)",
                backgroundColor: i === targetIdx ? LAPIS : "rgba(128,128,128,0.1)",
                color: i === targetIdx ? "#fff" : "inherit",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        {isPrivate ? (
          <div className="space-y-4 px-4 pb-4">
            {participants.length === 0 && (
              <p className="text-sm opacity-50">No students enrolled yet.</p>
            )}
            {participants.map((p) => (
              <div key={p.student_id}>
                <p
                  className="mb-1 text-xs font-semibold opacity-70"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {p.profiles?.display_name ?? p.profiles?.username ?? "Student"}
                </p>
                <RoomProvider
                  id={`${baseRoom}:${p.student_id}`}
                  initialPresence={{ chapterIndex: target.chapterIndex }}
                >
                  <ThreadList chapterIndex={target.chapterIndex} />
                </RoomProvider>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 pb-4">
            <RoomProvider
              id={baseRoom}
              initialPresence={{ chapterIndex: target.chapterIndex }}
            >
              <ThreadList chapterIndex={target.chapterIndex} />
            </RoomProvider>
          </div>
        )}
      </LiveblocksProvider>
    </div>
  )
}

/** Lists every annotation thread in the current room with moderation controls. */
function ThreadList({ chapterIndex }: { chapterIndex: number }) {
  const { threads, isLoading, error } = useThreads()
  const editThreadMetadata = useEditThreadMetadata()
  const deleteThread = useDeleteThread()

  if (isLoading) {
    return <p className="text-xs opacity-40">Loading annotations…</p>
  }
  if (error) {
    return <p className="text-xs opacity-40">Couldn&rsquo;t load annotations.</p>
  }

  const list = (threads ?? []).filter(
    (t): t is AnnotationThread => t.metadata.chapterIndex === chapterIndex,
  )

  if (list.length === 0) {
    return <p className="text-xs opacity-40">No annotations yet.</p>
  }

  return (
    <div className="space-y-3">
      {list.map((thread) => {
        const endorsed = thread.metadata.endorsed === true
        return (
          <div
            key={thread.id}
            className="overflow-hidden rounded-xl border bg-white"
            style={{ borderColor: `${endorsed ? GOLD : LAPIS}33` }}
          >
            <div
              className="flex items-start justify-between gap-2 border-b px-3 py-2"
              style={{ borderColor: `${endorsed ? GOLD : LAPIS}22` }}
            >
              <p
                className="line-clamp-2 flex-1 text-xs italic text-gray-600"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                “{thread.metadata.quote}”
                {thread.resolved && (
                  <span className="ml-1 not-italic opacity-50">· resolved</span>
                )}
              </p>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    editThreadMetadata({
                      threadId: thread.id,
                      metadata: { endorsed: !endorsed },
                    })
                  }
                  className="rounded px-1.5 py-0.5 text-[11px] font-semibold hover:bg-black/5"
                  style={{
                    color: endorsed ? GOLD : LAPIS,
                    fontFamily: "var(--font-sans)",
                  }}
                  aria-label={endorsed ? "Remove endorsement" : "Endorse annotation"}
                >
                  {endorsed ? "★ Endorsed" : "☆ Endorse"}
                </button>
                <button
                  type="button"
                  onClick={() => deleteThread(thread.id)}
                  className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-gray-400 hover:bg-black/5 hover:text-red-600"
                  style={{ fontFamily: "var(--font-sans)" }}
                  aria-label="Delete annotation"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="p-1">
              <Thread thread={thread} showResolveAction />
            </div>
          </div>
        )
      })}
    </div>
  )
}
