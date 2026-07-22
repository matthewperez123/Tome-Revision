"use client"

/**
 * MatchPairsTrial — drag-and-drop matching with a full button/keyboard path.
 *
 * Pointer users drag right-hand cards onto left-hand slots (dnd-kit).
 * Keyboard and click users get the equivalent flow with plain buttons:
 * activate a card to pick it up (aria-pressed), then activate a slot to
 * place it. Both paths feed the same assignment model; matched pairs lock
 * visually and can be un-paired by re-activating the slot. Card order is
 * shuffled deterministically from the session seed.
 */
import { useMemo, useState } from "react"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import { pickTactile, useReducedMotionSafe } from "@/lib/design/motion"
import { normalizeText } from "@/lib/trials/question-types"
import { seededShuffle } from "@/lib/trials/engine"
import type { FamilyRendererProps } from "../shared"
import { TrialActionButton, la } from "../shared"

function DraggableCard({
  id,
  text,
  disabled,
  pickedUp,
  correct,
  wrong,
  isReduced,
  onPick,
}: {
  id: string
  text: string
  disabled: boolean
  pickedUp: boolean
  correct: boolean | null
  wrong: boolean
  isReduced: boolean
  onPick: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id, disabled })
  const variants = pickTactile("dragTrialAnswer", isReduced)
  return (
    <motion.button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      onClick={onPick}
      disabled={disabled}
      aria-pressed={pickedUp}
      aria-label={`Match card: ${text}. Activate to pick up, then choose a term.`}
      variants={variants}
      animate={
        disabled
          ? "rest"
          : isDragging
            ? "dragging"
            : "rest"
      }
      className="min-h-[44px] w-full border-2 px-4 py-2 text-left font-serif focus-visible:outline-2 disabled:cursor-default"
      style={{
        transform: CSS.Translate.toString(transform),
        borderRadius: la.radiusM,
        outlineColor: la.focus,
        touchAction: "none",
        borderColor: correct === true ? la.success : wrong ? la.error : pickedUp ? la.wisdom : la.primary,
        background: correct === true ? la.successSoft : wrong ? la.errorSoft : pickedUp ? la.wisdomSoft : la.surfaceRaised,
        color: la.ink,
        boxShadow: pickedUp ? la.shadowRaised : undefined,
      }}
    >
      {text}
    </motion.button>
  )
}

function DroppableSlot({
  id,
  label,
  assignedText,
  correct,
  wrong,
  disabled,
  onPlace,
}: {
  id: string
  label: string
  assignedText: string | null
  correct: boolean | null
  wrong: boolean
  disabled: boolean
  onPlace: () => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id, disabled })
  return (
    <div ref={setNodeRef} className="flex items-stretch gap-2">
      <button
        type="button"
        onClick={onPlace}
        disabled={disabled && !assignedText}
        aria-label={
          assignedText
            ? `${label} — matched with ${assignedText}. Activate to un-match.`
            : `${label} — empty slot. Activate to place the picked-up card.`
        }
        className="flex flex-1 items-center justify-between gap-3 border-2 px-4 py-3 text-left focus-visible:outline-2 disabled:cursor-default"
        style={{
          borderRadius: la.radiusM,
          outlineColor: la.focus,
          borderStyle: assignedText ? "solid" : "dashed",
          borderColor: correct === true ? la.success : wrong ? la.error : isOver ? la.wisdom : la.surfaceSunken,
          background: correct === true ? la.successSoft : wrong ? la.errorSoft : isOver ? la.wisdomSoft : la.surface,
          color: la.ink,
          minHeight: 56,
        }}
      >
        <span className="font-serif text-base font-semibold">{label}</span>
        <span
          className="font-serif text-sm"
          style={{ color: assignedText ? la.ink : la.inkFaint }}
        >
          {assignedText ?? "drop here"}
        </span>
      </button>
    </div>
  )
}

export function MatchPairsTrial({
  item,
  seed,
  answered,
  lastResponse,
  onSubmit,
  reduced,
}: FamilyRendererProps<"match-pairs">) {
  const { content } = item
  const [pairs, setPairs] = useState<Record<string, string>>(() => lastResponse?.pairs ?? {})
  const [pickedUp, setPickedUp] = useState<string | null>(null)
  const systemReduced = useReducedMotionSafe()
  const isReduced = reduced || systemReduced

  const rights = useMemo(
    () => seededShuffle(content.pairs.map((p) => p.right), seed, `pairs:${item.id}`),
    [content.pairs, seed, item.id]
  )

  const assignedRights = useMemo(() => new Set(Object.values(pairs)), [pairs])
  const allAssigned = content.pairs.every((p) => pairs[p.left])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor)
  )

  const assign = (left: string, right: string) => {
    setPairs((prev) => {
      const next = { ...prev }
      // A right card belongs to at most one slot.
      for (const k of Object.keys(next)) if (next[k] === right) delete next[k]
      next[left] = right
      return next
    })
    setPickedUp(null)
  }

  const unassign = (left: string) =>
    setPairs((prev) => {
      const next = { ...prev }
      delete next[left]
      return next
    })

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const right = String(active.id).replace(/^right:/, "")
    const left = String(over.id).replace(/^left:/, "")
    assign(left, right)
  }

  const pairCorrect = (left: string): boolean | null => {
    if (!answered) return null
    const expected = content.pairs.find((p) => p.left === left)?.right
    return normalizeText(pairs[left] ?? "") === normalizeText(expected ?? "")
  }

  return (
    <div className="space-y-5">
      <p className="font-sans text-sm" style={{ color: la.inkMuted }}>
        Drag a card onto its match — or activate a card, then activate the slot.
      </p>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2" role="group" aria-label="Terms to match">
            {content.pairs.map((p) => (
              <DroppableSlot
                key={p.left}
                id={`left:${p.left}`}
                label={p.left}
                assignedText={pairs[p.left] ?? null}
                correct={pairCorrect(p.left)}
                wrong={answered && pairCorrect(p.left) === false}
                disabled={answered}
                onPlace={() => {
                  if (answered) return
                  if (pairs[p.left]) return unassign(p.left)
                  if (pickedUp) assign(p.left, pickedUp)
                }}
              />
            ))}
          </div>
          <div className="space-y-2" role="group" aria-label="Match cards">
            {rights.map((right) => {
              const placed = assignedRights.has(right)
              return (
                <DraggableCard
                  key={right}
                  id={`right:${right}`}
                  text={right}
                  disabled={answered || placed}
                  pickedUp={pickedUp === right}
                  correct={null}
                  wrong={false}
                  isReduced={isReduced}
                  onPick={() => !answered && !placed && setPickedUp(pickedUp === right ? null : right)}
                />
              )
            })}
          </div>
        </div>
      </DndContext>

      {!answered && (
        <TrialActionButton onClick={() => onSubmit({ pairs })} disabled={!allAssigned}>
          Check the matches
        </TrialActionButton>
      )}
    </div>
  )
}
