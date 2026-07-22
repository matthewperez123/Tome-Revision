"use client"

/**
 * OrderingTrial — arrange items into sequence.
 *
 * Drag-and-drop via @dnd-kit/sortable with its built-in keyboard sensor
 * (Space lifts, Arrow keys move, Space drops). Every row ALSO carries
 * explicit Move up / Move down buttons so the flow never depends on drag
 * mechanics. Initial order is shuffled deterministically from the seed;
 * rows already in their final position get a quiet jade tick pre-submit
 * only after answering (no free hints during the attempt).
 */
import { useMemo, useState } from "react"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react"
import { seededShuffle } from "@/lib/trials/engine"
import type { FamilyRendererProps } from "../shared"
import { Kbd, TrialActionButton, la } from "../shared"

function SortableRow({
  id,
  text,
  position,
  total,
  state,
  disabled,
  onMove,
}: {
  id: string
  text: string
  position: number
  total: number
  state: "idle" | "correct" | "wrong"
  disabled: boolean
  onMove: (id: string, delta: -1 | 1) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  })
  const borderColor =
    state === "correct" ? la.success : state === "wrong" ? la.error : isDragging ? la.wisdom : la.surfaceSunken
  return (
    <li
      ref={setNodeRef}
      className="flex items-center gap-2 border-2 px-3 py-2"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        borderRadius: la.radiusM,
        borderColor,
        background: state === "correct" ? la.successSoft : state === "wrong" ? la.errorSoft : la.surfaceRaised,
        color: la.ink,
        boxShadow: isDragging ? la.shadowRaised : undefined,
        zIndex: isDragging ? 10 : undefined,
        position: "relative",
      }}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        disabled={disabled}
        aria-label={`Drag handle for "${text}" — Space to lift, arrows to move, Space to drop`}
        className="cursor-grab touch-none p-1 focus-visible:outline-2 disabled:cursor-default disabled:opacity-40"
        style={{ color: la.inkFaint, outlineColor: la.focus, borderRadius: la.radiusS }}
      >
        <GripVertical size={18} aria-hidden />
      </button>
      <span
        aria-hidden
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-sans text-xs font-semibold"
        style={{ background: la.surfaceSunken, color: la.inkMuted }}
      >
        {position + 1}
      </span>
      <span className="flex-1 font-serif text-base">{text}</span>
      <span className="flex gap-1">
        <button
          type="button"
          disabled={disabled || position === 0}
          onClick={() => onMove(id, -1)}
          aria-label={`Move "${text}" up`}
          className="p-1.5 focus-visible:outline-2 disabled:opacity-30"
          style={{ color: la.inkMuted, outlineColor: la.focus, borderRadius: la.radiusS }}
        >
          <ArrowUp size={16} aria-hidden />
        </button>
        <button
          type="button"
          disabled={disabled || position === total - 1}
          onClick={() => onMove(id, 1)}
          aria-label={`Move "${text}" down`}
          className="p-1.5 focus-visible:outline-2 disabled:opacity-30"
          style={{ color: la.inkMuted, outlineColor: la.focus, borderRadius: la.radiusS }}
        >
          <ArrowDown size={16} aria-hidden />
        </button>
      </span>
    </li>
  )
}

export function OrderingTrial({
  item,
  seed,
  answered,
  lastResponse,
  onSubmit,
}: FamilyRendererProps<"ordering">) {
  const { content } = item
  const [order, setOrder] = useState<string[]>(() =>
    lastResponse
      ? lastResponse.order
      : seededShuffle(content.items.map((i) => i.id), seed, `order:${item.id}`)
  )

  const textById = useMemo(
    () => new Map(content.items.map((i) => [i.id, i.text])),
    [content.items]
  )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setOrder((prev) => {
      const from = prev.indexOf(String(active.id))
      const to = prev.indexOf(String(over.id))
      return arrayMove(prev, from, to)
    })
  }

  const move = (id: string, delta: -1 | 1) =>
    setOrder((prev) => {
      const from = prev.indexOf(id)
      const to = from + delta
      if (from < 0 || to < 0 || to >= prev.length) return prev
      return arrayMove(prev, from, to)
    })

  const rowState = (id: string, index: number): "idle" | "correct" | "wrong" => {
    if (!answered) return "idle"
    return content.correctOrder[index] === id ? "correct" : "wrong"
  }

  return (
    <div className="space-y-5">
      <p className="font-sans text-sm" style={{ color: la.inkMuted }}>
        Drag rows into order, or use the arrows. Keyboard: <Kbd>Space</Kbd> lifts a row,{" "}
        <Kbd>↑</Kbd>
        <Kbd>↓</Kbd> move it, <Kbd>Space</Kbd> drops it. <Kbd>Enter</Kbd> checks.
      </p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <ol className="space-y-2" aria-label="Items to order">
            {order.map((id, i) => (
              <SortableRow
                key={id}
                id={id}
                text={textById.get(id) ?? id}
                position={i}
                total={order.length}
                state={rowState(id, i)}
                disabled={answered}
                onMove={move}
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>

      {answered && (
        <p className="font-serif text-base" style={{ color: la.inkMuted }}>
          Correct order: {content.correctOrder.map((id) => textById.get(id) ?? id).join(" → ")}
        </p>
      )}

      {!answered && (
        <TrialActionButton onClick={() => onSubmit({ order })}>Check the order</TrialActionButton>
      )}
    </div>
  )
}
