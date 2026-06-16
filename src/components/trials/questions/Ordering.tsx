"use client"

import { useMemo, useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { QuestionRendererProps } from "./shared"
import { norm } from "./shared"

/**
 * Ordering — user drags items into chronological / logical order.
 * Uses @dnd-kit/core + /sortable (already installed).
 */
function SortableItem({
  id,
  index,
  text,
  state,
  reduced: _reduced,
}: {
  id: string
  index: number
  text: string
  state: "idle" | "correct" | "wrong"
  reduced: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 2 : 1,
  }

  const stateStyle: React.CSSProperties =
    state === "correct"
      ? { borderColor: "var(--codex-success)", background: "var(--codex-success-soft)" }
      : state === "wrong"
        ? { borderColor: "var(--codex-danger)", background: "var(--codex-danger-soft)" }
        : { borderColor: "var(--codex-border)", background: "var(--card)" }

  const badgeStyle: React.CSSProperties =
    state === "correct"
      ? { background: "var(--codex-success)", color: "var(--codex-success-on)" }
      : state === "wrong"
        ? { background: "var(--codex-danger)", color: "var(--codex-danger-on)" }
        : { background: "var(--muted)", color: "var(--muted-foreground)" }

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...stateStyle, borderRadius: "var(--codex-radius-btn)" }}
      className={`flex items-center gap-3 border-2 px-4 py-3.5 min-h-[44px] ${
        isDragging ? "shadow-lg scale-[1.02]" : "shadow-sm"
      }`}
    >
      <button
        type="button"
        className="flex-shrink-0 h-11 w-11 sm:h-8 sm:w-8 -ml-1 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:[--tw-ring-color:var(--codex-primary)]"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5" aria-hidden />
      </button>
      <span className="flex-1 font-serif text-ink">{text}</span>
      <span
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-sans"
        style={badgeStyle}
        aria-label={`Position ${index + 1}`}
      >
        {state === "correct" ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : state === "wrong" ? (
          <XCircle className="w-4 h-4" />
        ) : (
          index + 1
        )}
      </span>
    </div>
  )
}

export function Ordering({
  question,
  answered,
  onSubmit,
  reduced,
}: QuestionRendererProps) {
  // Use options as the initial (shuffled) order the user sees.
  const [items, setItems] = useState<string[]>(() => [...question.options])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const correctOrder = question.correctOrder ?? []
  const correctOrderNormed = useMemo(
    () => correctOrder.map(norm),
    [correctOrder]
  )

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIndex = items.indexOf(active.id as string)
    const newIndex = items.indexOf(over.id as string)
    if (oldIndex === -1 || newIndex === -1) return
    setItems((prev) => arrayMove(prev, oldIndex, newIndex))
  }

  function submit() {
    onSubmit(JSON.stringify(items))
  }

  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        Drag to reorder
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={answered ? undefined : handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item, i) => {
              const state: "idle" | "correct" | "wrong" = answered
                ? norm(item) === correctOrderNormed[i]
                  ? "correct"
                  : "wrong"
                : "idle"
              return (
                <SortableItem
                  key={item}
                  id={item}
                  index={i}
                  text={item}
                  state={state}
                  reduced={reduced}
                />
              )
            })}
          </div>
        </SortableContext>
      </DndContext>

      {!answered && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={submit}
            className="codex-pressable min-h-[48px] px-8 font-bold rounded-[var(--codex-radius-btn)]"
            style={{ background: "var(--codex-primary)", color: "var(--codex-on-primary)", border: "var(--codex-border-w) solid var(--codex-primary)" }}
          >
            Check Order
          </Button>
        </div>
      )}
    </div>
  )
}
