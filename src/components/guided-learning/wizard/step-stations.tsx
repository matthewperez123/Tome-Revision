"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Plus, GripVertical, BookOpen, Brain, PenTool, Trash2, Clock, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DraftStation, StationType } from "@/lib/guided-learning-types"
import { getTotalStationMinutes, STATION_TYPE_LABELS } from "@/lib/guided-station-utils"
import type { WizardState } from "./create-session-wizard"
import { StationEditorModal } from "./station-editor-modal"

interface Props {
  state: WizardState
  onChange: (partial: Partial<WizardState>) => void
}

const TYPE_ICONS: Record<StationType, typeof BookOpen> = {
  reading: BookOpen,
  quiz: Brain,
  reflection: PenTool,
}

// ── Sortable Station Card ─────────────────────────────────────────────────────

function SortableStationCard({
  station,
  index,
  onEdit,
  onRemove,
}: {
  station: DraftStation
  index: number
  onEdit: () => void
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: station.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const Icon = TYPE_ICONS[station.type]

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-xl border p-3 transition-colors"
      {...attributes}
    >
      <button
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div
        className="flex h-8 w-8 items-center justify-center rounded-lg"
        style={{ backgroundColor: "rgba(99, 102, 241, 0.08)" }}
      >
        <Icon className="h-4 w-4" style={{ color: "var(--tome-indigo, #6366F1)" }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold opacity-40">#{index + 1}</span>
          <p className="truncate text-sm font-medium">
            {station.title || STATION_TYPE_LABELS[station.type]}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs opacity-50">
          <span className="capitalize">{station.type}</span>
          {station.book_title && <span>{station.book_title}</span>}
          <span className="flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            {station.target_minutes}m
          </span>
        </div>
      </div>

      <button
        onClick={onEdit}
        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Edit2 className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={onRemove}
        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export function StepStations({ state, onChange }: Props) {
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingStation, setEditingStation] = useState<DraftStation | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const totalTargetMinutes = useMemo(() => {
    return state.stations.reduce((sum, s) => sum + s.target_minutes, 0)
  }, [state.stations])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const oldIndex = state.stations.findIndex((s) => s.id === active.id)
      const newIndex = state.stations.findIndex((s) => s.id === over.id)
      onChange({ stations: arrayMove(state.stations, oldIndex, newIndex) })
    },
    [state.stations, onChange],
  )

  const handleAddStation = useCallback((type: StationType) => {
    setEditingStation({
      id: crypto.randomUUID(),
      type,
      title: "",
      book_id: null,
      chapter_start: null,
      chapter_end: null,
      section_range: null,
      quiz_id: null,
      quiz_config: null,
      reflection_prompt: null,
      min_words: null,
      target_minutes: 10,
      require_completion: false,
    })
    setEditorOpen(true)
  }, [])

  const handleEditStation = useCallback((station: DraftStation) => {
    setEditingStation({ ...station })
    setEditorOpen(true)
  }, [])

  const handleSaveStation = useCallback(
    (station: DraftStation) => {
      const exists = state.stations.find((s) => s.id === station.id)
      if (exists) {
        onChange({
          stations: state.stations.map((s) =>
            s.id === station.id ? station : s,
          ),
        })
      } else {
        onChange({ stations: [...state.stations, station] })
      }
      setEditorOpen(false)
      setEditingStation(null)
    },
    [state.stations, onChange],
  )

  const handleRemoveStation = useCallback(
    (id: string) => {
      onChange({ stations: state.stations.filter((s) => s.id !== id) })
    },
    [state.stations, onChange],
  )

  const overBudget = totalTargetMinutes > state.durationMinutes

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold">Station Queue</h2>
        <p className="text-xs opacity-50">
          Drag to reorder. Students progress through stations in order.
        </p>
      </div>

      {/* Time summary */}
      <div
        className="flex items-center justify-between rounded-lg px-3 py-2 text-xs"
        style={{
          backgroundColor: overBudget
            ? "rgba(200, 74, 82, 0.08)"
            : "rgba(99, 102, 241, 0.06)",
          color: overBudget ? "var(--tome-error, #C84A52)" : "inherit",
        }}
      >
        <span>
          Session: <strong>{state.durationMinutes}m</strong>
        </span>
        <span>
          Stations total: <strong>{totalTargetMinutes}m</strong>
          {overBudget && " — exceeds session duration"}
        </span>
      </div>

      {/* Station list */}
      {state.stations.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={state.stations.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {state.stations.map((station, i) => (
                <SortableStationCard
                  key={station.id}
                  station={station}
                  index={i}
                  onEdit={() => handleEditStation(station)}
                  onRemove={() => handleRemoveStation(station.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-10 text-center" style={{ borderColor: "rgba(128,128,128,0.2)" }}>
          <p className="text-sm opacity-40">No stations yet</p>
          <p className="text-xs opacity-30">Add reading, quiz, or reflection stations below</p>
        </div>
      )}

      {/* Add station buttons */}
      <div className="flex flex-wrap gap-2">
        {(["reading", "quiz", "reflection"] as StationType[]).map((type) => {
          const Icon = TYPE_ICONS[type]
          return (
            <Button
              key={type}
              variant="outline"
              onClick={() => handleAddStation(type)}
              className="gap-2 text-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <Icon className="h-3.5 w-3.5" />
              {STATION_TYPE_LABELS[type]}
            </Button>
          )
        })}
      </div>

      {/* Station editor modal */}
      {editorOpen && editingStation && (
        <StationEditorModal
          station={editingStation}
          onSave={handleSaveStation}
          onClose={() => { setEditorOpen(false); setEditingStation(null) }}
        />
      )}
    </div>
  )
}
