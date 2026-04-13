"use client"

import { useState, useRef, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen, ScrollText, PenLine, MessagesSquare, Calendar, Coffee,
  Bookmark, StickyNote, ZoomIn, ZoomOut, List, LayoutGrid, FileText,
  ChevronLeft, ChevronRight, X, Plus, Sparkles, AlertTriangle, Save,
  Check, Trash2, Wand2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  getSemesterPlan, getPlanEvents, getConflicts, autoDistributeBook,
  LANES, EVENT_TYPE_TO_LANE, LANE_TO_DEFAULT_TYPE,
  dateToX, xToDate, daysBetween, addDays, isWeekend,
  type PlanEvent, type EventType, type SemesterPlan, type PlanConflict
} from "@/lib/semester-plan-data"

// ── Event type icons ──
const EVENT_ICONS: Record<EventType, React.ReactNode> = {
  book_reading: <BookOpen className="size-3" />,
  trial: <ScrollText className="size-3" />,
  essay_assignment: <PenLine className="size-3" />,
  essay_due: <PenLine className="size-3" />,
  discussion: <MessagesSquare className="size-3" />,
  quiz_custom: <ScrollText className="size-3" />,
  break: <Coffee className="size-3" />,
  exam: <Calendar className="size-3" />,
  milestone: <Bookmark className="size-3" />,
  note: <StickyNote className="size-3" />,
}

type ZoomLevel = "year" | "month" | "week"
type ViewMode = "timeline" | "calendar" | "list" | "syllabus"

// ── Main Component ──

export function SemesterPlanTab({ classroomId }: { classroomId: string }) {
  const plan = getSemesterPlan(classroomId)
  const [events, setEvents] = useState<PlanEvent[]>(() => plan ? getPlanEvents(plan.id) : [])
  const [zoom, setZoom] = useState<ZoomLevel>("month")
  const [view, setView] = useState<ViewMode>("timeline")
  const [selectedEvent, setSelectedEvent] = useState<PlanEvent | null>(null)
  const [createMode, setCreateMode] = useState<{ lane: number; date: string } | null>(null)
  const [scrollOffset, setScrollOffset] = useState(0)
  const canvasRef = useRef<HTMLDivElement>(null)

  const conflicts = useMemo(() => plan ? getConflicts(events, plan.endDate) : [], [events, plan])
  const conflictIds = useMemo(() => new Set(conflicts.map(c => c.eventId)), [conflicts])

  if (!plan) {
    return (
      <div className="text-center py-12">
        <Calendar className="size-10 text-muted-foreground/20 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No semester plan set up for this classroom</p>
        <p className="text-xs text-muted-foreground mt-1">Semester planning coming soon</p>
      </div>
    )
  }

  const totalDays = daysBetween(plan.startDate, plan.endDate)
  const pixelsPerDay = zoom === "year" ? 3 : zoom === "month" ? 10 : 45
  const canvasWidth = totalDays * pixelsPerDay

  const handleAutoDistribute = () => {
    const newEvents = autoDistributeBook("Meditations", 12, addDays(plan.endDate, -42), plan.endDate, plan.id, { includeTrials: true, includeDiscussions: true })
    setEvents(prev => [...prev, ...newEvents])
  }

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id))
    setSelectedEvent(null)
  }

  const handleSaveEvent = (updated: PlanEvent) => {
    setEvents(prev => prev.map(e => e.id === updated.id ? updated : e))
    setSelectedEvent(null)
  }

  const handleCreateEvent = (ev: PlanEvent) => {
    setEvents(prev => [...prev, ev])
    setCreateMode(null)
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 14rem)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-serif font-semibold">{plan.name}</h2>
          {plan.theme && <p className="text-[10px] text-muted-foreground">{plan.theme}</p>}
        </div>

        {/* View toggles */}
        <div className="flex gap-0.5 rounded-lg bg-muted p-0.5">
          {([["timeline", LayoutGrid], ["calendar", Calendar], ["list", List], ["syllabus", FileText]] as const).map(([v, Icon]) => (
            <button key={v} onClick={() => setView(v as ViewMode)} className={cn("rounded-md px-2 py-1 text-[10px] font-medium capitalize transition-colors", view === v ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              {v}
            </button>
          ))}
        </div>

        {/* Zoom (timeline only) */}
        {view === "timeline" && (
          <div className="flex gap-0.5 rounded-lg bg-muted p-0.5">
            {(["year", "month", "week"] as const).map(z => (
              <button key={z} onClick={() => setZoom(z)} className={cn("rounded-md px-2 py-1 text-[10px] font-medium capitalize transition-colors", zoom === z ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                {z}
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={handleAutoDistribute}>
          <Wand2 className="size-3" /> Auto-distribute
        </Button>
      </div>

      {/* Conflicts banner */}
      {conflicts.filter(c => c.severity === "warning").length > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 px-3 py-1.5 mb-2">
          <AlertTriangle className="size-3.5 text-amber-500 shrink-0" />
          <p className="text-[10px] text-amber-700 dark:text-amber-400 truncate">
            {conflicts.filter(c => c.severity === "warning").length} scheduling conflict{conflicts.filter(c => c.severity === "warning").length !== 1 ? "s" : ""} detected
          </p>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden rounded-xl border">
        <div className="flex-1 overflow-hidden flex flex-col">
          {view === "timeline" && (
            <TimelineView
              plan={plan}
              events={events}
              zoom={zoom}
              canvasWidth={canvasWidth}
              pixelsPerDay={pixelsPerDay}
              totalDays={totalDays}
              conflictIds={conflictIds}
              onSelectEvent={setSelectedEvent}
              onClickLane={(lane, date) => setCreateMode({ lane, date })}
              canvasRef={canvasRef}
              scrollOffset={scrollOffset}
              onScroll={setScrollOffset}
            />
          )}
          {view === "calendar" && <CalendarView plan={plan} events={events} onSelectEvent={setSelectedEvent} />}
          {view === "list" && <ListView events={events} onSelectEvent={setSelectedEvent} />}
          {view === "syllabus" && <SyllabusView plan={plan} events={events} />}
        </div>

        {/* Edit panel */}
        <AnimatePresence>
          {(selectedEvent || createMode) && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l overflow-hidden shrink-0"
            >
              <EventEditPanel
                event={selectedEvent}
                createDefaults={createMode}
                planId={plan.id}
                onSave={handleSaveEvent}
                onCreate={handleCreateEvent}
                onDelete={handleDeleteEvent}
                onClose={() => { setSelectedEvent(null); setCreateMode(null) }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mini-map */}
      {view === "timeline" && (
        <MiniMap plan={plan} events={events} canvasWidth={canvasWidth} scrollOffset={scrollOffset} viewportWidth={canvasRef.current?.clientWidth ?? 600} onJump={(x) => { if (canvasRef.current) canvasRef.current.scrollLeft = x }} />
      )}
    </div>
  )
}

// ── Timeline View ──

function TimelineView({ plan, events, zoom, canvasWidth, pixelsPerDay, totalDays, conflictIds, onSelectEvent, onClickLane, canvasRef, scrollOffset, onScroll }: {
  plan: SemesterPlan; events: PlanEvent[]; zoom: ZoomLevel; canvasWidth: number; pixelsPerDay: number; totalDays: number; conflictIds: Set<string>
  onSelectEvent: (e: PlanEvent) => void; onClickLane: (lane: number, date: string) => void
  canvasRef: React.RefObject<HTMLDivElement | null>; scrollOffset: number; onScroll: (x: number) => void
}) {
  const laneHeight = 52
  const axisHeight = 28
  const labelWidth = 80
  const today = new Date().toISOString().split("T")[0]
  const todayX = dateToX(today, plan.startDate, plan.endDate, canvasWidth)

  // Generate month/week markers
  const markers = useMemo(() => {
    const result: { date: string; label: string; x: number; isMajor: boolean }[] = []
    const start = new Date(plan.startDate)
    const end = new Date(plan.endDate)
    const d = new Date(start)

    if (zoom === "year" || zoom === "month") {
      // Month markers
      d.setDate(1)
      if (d < start) d.setMonth(d.getMonth() + 1)
      while (d <= end) {
        const dateStr = d.toISOString().split("T")[0]
        result.push({ date: dateStr, label: d.toLocaleDateString("en-US", { month: "short" }), x: dateToX(dateStr, plan.startDate, plan.endDate, canvasWidth), isMajor: true })
        d.setMonth(d.getMonth() + 1)
      }
    }
    if (zoom === "week" || zoom === "month") {
      // Week markers (Mondays)
      const wd = new Date(start)
      while (wd.getDay() !== 1) wd.setDate(wd.getDate() + 1)
      while (wd <= end) {
        const dateStr = wd.toISOString().split("T")[0]
        result.push({ date: dateStr, label: `W${Math.ceil(daysBetween(plan.startDate, dateStr) / 7)}`, x: dateToX(dateStr, plan.startDate, plan.endDate, canvasWidth), isMajor: false })
        wd.setDate(wd.getDate() + 7)
      }
    }
    return result
  }, [plan, canvasWidth, zoom])

  // Weekend columns for week zoom
  const weekendCols = useMemo(() => {
    if (zoom !== "week") return []
    const cols: { x: number; width: number }[] = []
    for (let i = 0; i < totalDays; i++) {
      const d = addDays(plan.startDate, i)
      if (isWeekend(d)) {
        cols.push({ x: i * pixelsPerDay, width: pixelsPerDay })
      }
    }
    return cols
  }, [plan, totalDays, pixelsPerDay, zoom])

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Canvas with lane labels */}
      <div className="flex flex-1 overflow-hidden">
        {/* Lane labels */}
        <div className="shrink-0 flex flex-col border-r bg-muted/30" style={{ width: labelWidth }}>
          <div style={{ height: axisHeight }} className="border-b flex items-center justify-center text-[8px] text-muted-foreground font-medium">DATE</div>
          {LANES.map(lane => (
            <div key={lane.index} style={{ height: laneHeight }} className="flex items-center px-2 border-b">
              <span className="text-[9px] font-medium text-muted-foreground truncate">{lane.label}</span>
            </div>
          ))}
        </div>

        {/* Scrollable canvas */}
        <div ref={canvasRef} className="flex-1 overflow-x-auto overflow-y-hidden" onScroll={(e) => onScroll((e.target as HTMLDivElement).scrollLeft)}>
          <div className="relative" style={{ width: canvasWidth, height: axisHeight + LANES.length * laneHeight }}>
            {/* Date axis */}
            <div className="sticky top-0 z-10 border-b bg-background" style={{ height: axisHeight }}>
              {markers.map((m, i) => (
                <span key={i} className={cn("absolute text-muted-foreground", m.isMajor ? "text-[9px] font-medium" : "text-[7px]")} style={{ left: m.x, top: m.isMajor ? 4 : 14 }}>
                  {m.label}
                </span>
              ))}
            </div>

            {/* Weekend shading */}
            {weekendCols.map((col, i) => (
              <div key={i} className="absolute bg-stone-50 dark:bg-stone-900/20" style={{ left: col.x, width: col.width, top: axisHeight, height: LANES.length * laneHeight }} />
            ))}

            {/* Today indicator */}
            {todayX >= 0 && todayX <= canvasWidth && (
              <div className="absolute w-px bg-indigo-500 z-20" style={{ left: todayX, top: 0, height: axisHeight + LANES.length * laneHeight }}>
                <div className="absolute -top-0 -left-[14px] rounded-b bg-indigo-500 px-1 py-0.5 text-[7px] font-bold text-white">TODAY</div>
              </div>
            )}

            {/* Lane rows */}
            {LANES.map(lane => (
              <div
                key={lane.index}
                className="absolute border-b cursor-pointer hover:bg-muted/20 transition-colors"
                style={{ top: axisHeight + lane.index * laneHeight, height: laneHeight, width: canvasWidth }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const relX = e.clientX - rect.left
                  const date = xToDate(relX, plan.startDate, plan.endDate, canvasWidth)
                  onClickLane(lane.index, date)
                }}
              />
            ))}

            {/* Event cards */}
            {events.map(ev => {
              const x = dateToX(ev.startDate, plan.startDate, plan.endDate, canvasWidth)
              const endDate = ev.endDate ?? ev.startDate
              const w = Math.max(80 * (pixelsPerDay / 10), dateToX(endDate, plan.startDate, plan.endDate, canvasWidth) - x + pixelsPerDay)
              const lane = LANES[ev.lane]
              const hasConflict = conflictIds.has(ev.id)

              return (
                <button
                  key={ev.id}
                  onClick={(e) => { e.stopPropagation(); onSelectEvent(ev) }}
                  className={cn(
                    "absolute rounded-md border px-1.5 py-1 text-left transition-shadow hover:shadow-md overflow-hidden group",
                    hasConflict && "ring-1 ring-amber-400"
                  )}
                  style={{
                    left: x,
                    top: axisHeight + ev.lane * laneHeight + 4,
                    width: Math.min(w, canvasWidth - x),
                    height: laneHeight - 8,
                    backgroundColor: ev.color ?? lane?.color ?? "#6366F1",
                    opacity: ev.eventType === "break" ? 0.4 : 0.85,
                    borderColor: ev.color ?? lane?.color ?? "#6366F1",
                  }}
                >
                  <div className="flex items-center gap-1 text-white">
                    {EVENT_ICONS[ev.eventType]}
                    <span className="text-[8px] font-medium truncate">{ev.title}</span>
                  </div>
                  {zoom !== "year" && ev.bookTitle && (
                    <p className="text-[7px] text-white/70 truncate">{ev.bookTitle}</p>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Mini Map ──

function MiniMap({ plan, events, canvasWidth, scrollOffset, viewportWidth, onJump }: {
  plan: SemesterPlan; events: PlanEvent[]; canvasWidth: number; scrollOffset: number; viewportWidth: number; onJump: (x: number) => void
}) {
  const miniWidth = 400
  const scale = miniWidth / canvasWidth

  return (
    <div className="mt-2 rounded-lg bg-muted/30 border p-1 relative overflow-hidden" style={{ width: miniWidth, height: 24 }} onClick={(e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / miniWidth) * canvasWidth - viewportWidth / 2
      onJump(Math.max(0, x))
    }}>
      {/* Event blocks */}
      {events.map(ev => {
        const x = dateToX(ev.startDate, plan.startDate, plan.endDate, canvasWidth) * scale
        const endDate = ev.endDate ?? ev.startDate
        const w = Math.max(2, (dateToX(endDate, plan.startDate, plan.endDate, canvasWidth) - dateToX(ev.startDate, plan.startDate, plan.endDate, canvasWidth)) * scale + 2)
        const lane = LANES[ev.lane]
        return (
          <div key={ev.id} className="absolute rounded-sm" style={{ left: x, top: ev.lane * 4 + 2, width: w, height: 3, backgroundColor: ev.color ?? lane?.color ?? "#6366F1", opacity: 0.7 }} />
        )
      })}
      {/* Viewport indicator */}
      <div className="absolute top-0 bottom-0 border border-foreground/30 bg-foreground/5 rounded-sm" style={{ left: scrollOffset * scale, width: viewportWidth * scale }} />
    </div>
  )
}

// ── Calendar View ──

function CalendarView({ plan, events, onSelectEvent }: { plan: SemesterPlan; events: PlanEvent[]; onSelectEvent: (e: PlanEvent) => void }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date()
    return { year: today.getFullYear(), month: today.getMonth() }
  })

  const daysInMonth = new Date(currentMonth.year, currentMonth.month + 1, 0).getDate()
  const firstDayOfWeek = new Date(currentMonth.year, currentMonth.month, 1).getDay()
  const monthLabel = new Date(currentMonth.year, currentMonth.month).toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const eventsInMonth = events.filter(ev => {
    const start = new Date(ev.startDate)
    const end = ev.endDate ? new Date(ev.endDate) : start
    const monthStart = new Date(currentMonth.year, currentMonth.month, 1)
    const monthEnd = new Date(currentMonth.year, currentMonth.month + 1, 0)
    return start <= monthEnd && end >= monthStart
  })

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return eventsInMonth.filter(ev => {
      const end = ev.endDate ?? ev.startDate
      return ev.startDate <= dateStr && end >= dateStr
    })
  }

  return (
    <div className="flex-1 overflow-y-auto p-3">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCurrentMonth(m => m.month === 0 ? { year: m.year - 1, month: 11 } : { year: m.year, month: m.month - 1 })} className="p-1 hover:bg-muted rounded"><ChevronLeft className="size-4" /></button>
        <h3 className="text-sm font-medium">{monthLabel}</h3>
        <button onClick={() => setCurrentMonth(m => m.month === 11 ? { year: m.year + 1, month: 0 } : { year: m.year, month: m.month + 1 })} className="p-1 hover:bg-muted rounded"><ChevronRight className="size-4" /></button>
      </div>
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} className="bg-muted/50 px-1 py-1 text-center text-[9px] font-medium text-muted-foreground">{d}</div>
        ))}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-background min-h-[60px]" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dayEvents = getEventsForDay(day)
          const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth.month && new Date().getFullYear() === currentMonth.year
          return (
            <div key={day} className={cn("bg-background min-h-[60px] p-1", isToday && "ring-1 ring-inset ring-indigo-500")}>
              <span className={cn("text-[9px]", isToday ? "font-bold text-indigo-600" : "text-muted-foreground")}>{day}</span>
              <div className="space-y-0.5 mt-0.5">
                {dayEvents.slice(0, 3).map(ev => {
                  const lane = LANES[ev.lane]
                  return (
                    <button key={ev.id} onClick={() => onSelectEvent(ev)} className="w-full rounded px-1 py-0.5 text-[7px] text-white truncate text-left" style={{ backgroundColor: ev.color ?? lane?.color ?? "#6366F1", opacity: 0.85 }}>
                      {ev.title}
                    </button>
                  )
                })}
                {dayEvents.length > 3 && <span className="text-[7px] text-muted-foreground">+{dayEvents.length - 3}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── List View ──

function ListView({ events, onSelectEvent }: { events: PlanEvent[]; onSelectEvent: (e: PlanEvent) => void }) {
  const sorted = [...events].sort((a, b) => a.startDate.localeCompare(b.startDate))

  return (
    <div className="flex-1 overflow-y-auto p-3">
      <div className="space-y-1">
        {sorted.map(ev => {
          const lane = LANES[ev.lane]
          return (
            <button key={ev.id} onClick={() => onSelectEvent(ev)} className="flex items-center gap-3 w-full rounded-lg border bg-card px-3 py-2 text-left hover:bg-muted/30 transition-colors">
              <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: ev.color ?? lane?.color }} />
              <span className="text-xs text-muted-foreground w-20 shrink-0">{new Date(ev.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}{ev.endDate ? ` – ${new Date(ev.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}</span>
              <span className="flex items-center gap-1 text-xs flex-1 min-w-0 truncate">{EVENT_ICONS[ev.eventType]} {ev.title}</span>
              <Badge variant="outline" className="text-[8px] shrink-0">{ev.eventType.replace("_", " ")}</Badge>
              {ev.bookTitle && <span className="text-[9px] text-muted-foreground truncate max-w-24">{ev.bookTitle}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Syllabus View ──

function SyllabusView({ plan, events }: { plan: SemesterPlan; events: PlanEvent[] }) {
  // Group events by week
  const weeks = useMemo(() => {
    const result: { weekNum: number; startDate: string; endDate: string; events: PlanEvent[] }[] = []
    const totalWeeks = Math.ceil(daysBetween(plan.startDate, plan.endDate) / 7)
    for (let w = 0; w < totalWeeks; w++) {
      const wStart = addDays(plan.startDate, w * 7)
      const wEnd = addDays(plan.startDate, w * 7 + 6)
      const weekEvents = events.filter(ev => {
        const end = ev.endDate ?? ev.startDate
        return ev.startDate <= wEnd && end >= wStart
      })
      if (weekEvents.length > 0) {
        result.push({ weekNum: w + 1, startDate: wStart, endDate: wEnd, events: weekEvents })
      }
    }
    return result
  }, [plan, events])

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-lg font-serif font-bold">{plan.name}</h2>
          <p className="text-xs text-muted-foreground">{plan.classroomName}</p>
          <p className="text-xs text-muted-foreground">{new Date(plan.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })} – {new Date(plan.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </div>
        {weeks.map(week => (
          <div key={week.weekNum} className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b">
              <span className="text-xs font-bold">Week {week.weekNum}</span>
              <span className="text-[10px] text-muted-foreground">{new Date(week.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {new Date(week.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            </div>
            <div className="space-y-1.5">
              {week.events.map(ev => {
                const lane = LANES[ev.lane]
                return (
                  <div key={ev.id} className="flex items-start gap-2 text-xs">
                    <span className="mt-0.5">{EVENT_ICONS[ev.eventType]}</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">{ev.title}</span>
                      {ev.description && <span className="text-muted-foreground"> — {ev.description}</span>}
                    </div>
                    <span className="text-[9px] text-muted-foreground shrink-0">{new Date(ev.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Event Edit Panel ──

function EventEditPanel({ event, createDefaults, planId, onSave, onCreate, onDelete, onClose }: {
  event: PlanEvent | null
  createDefaults: { lane: number; date: string } | null
  planId: string
  onSave: (ev: PlanEvent) => void
  onCreate: (ev: PlanEvent) => void
  onDelete: (id: string) => void
  onClose: () => void
}) {
  const isCreate = !event
  const defaultType = createDefaults ? (LANE_TO_DEFAULT_TYPE[createDefaults.lane] ?? "note") : "note"

  const [title, setTitle] = useState(event?.title ?? "")
  const [description, setDescription] = useState(event?.description ?? "")
  const [eventType, setEventType] = useState<EventType>(event?.eventType ?? defaultType)
  const [startDate, setStartDate] = useState(event?.startDate ?? createDefaults?.date ?? "")
  const [endDate, setEndDate] = useState(event?.endDate ?? "")
  const [bookTitle, setBookTitle] = useState(event?.bookTitle ?? "")
  const [unitStart, setUnitStart] = useState(event?.unitStart ?? "")
  const [unitEnd, setUnitEnd] = useState(event?.unitEnd ?? "")
  const [saved, setSaved] = useState(false)

  const handleSubmit = () => {
    const ev: PlanEvent = {
      id: event?.id ?? `pe-new-${Date.now()}`,
      planId,
      eventType,
      title,
      description,
      startDate,
      endDate: endDate || null,
      bookId: null,
      bookTitle: bookTitle || null,
      unitStart: unitStart ? Number(unitStart) : null,
      unitEnd: unitEnd ? Number(unitEnd) : null,
      color: event?.color ?? null,
      lane: EVENT_TYPE_TO_LANE[eventType],
      sortOrder: event?.sortOrder ?? 999,
    }
    if (isCreate) onCreate(ev)
    else onSave(ev)
    setSaved(true)
    setTimeout(() => setSaved(false), 1000)
  }

  return (
    <div className="w-[360px] h-full overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">{isCreate ? "Create Event" : "Edit Event"}</h3>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded"><X className="size-4" /></button>
      </div>

      <div className="space-y-3">
        {/* Event type */}
        <div>
          <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Type</label>
          <div className="flex flex-wrap gap-1">
            {(Object.keys(EVENT_TYPE_TO_LANE) as EventType[]).map(type => (
              <button key={type} onClick={() => setEventType(type)} className={cn("rounded-full px-2 py-0.5 text-[9px] font-medium capitalize transition-colors", eventType === type ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground")}>
                {type.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Event title" className="w-full h-8 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Start</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-[10px] font-medium text-muted-foreground mb-1 block">End</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        {/* Book (for reading, trial, essay, discussion) */}
        {["book_reading", "trial", "essay_assignment", "discussion"].includes(eventType) && (
          <>
            <div>
              <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Book</label>
              <input type="text" value={bookTitle} onChange={e => setBookTitle(e.target.value)} placeholder="e.g. The Odyssey" className="w-full h-8 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            {eventType === "book_reading" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Unit Start</label>
                  <input type="number" value={unitStart} onChange={e => setUnitStart(e.target.value as any)} min={1} className="w-full h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Unit End</label>
                  <input type="number" value={unitEnd} onChange={e => setUnitEnd(e.target.value as any)} min={1} className="w-full h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
            )}
          </>
        )}

        {/* Description */}
        <div>
          <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Details..." className="w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[60px] focus:outline-none focus:ring-2 focus:ring-ring" rows={3} />
        </div>

        {/* Essay-specific */}
        {eventType === "essay_assignment" && (
          <div>
            <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Essay Prompt</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What should students write about?" className="w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[80px] focus:outline-none focus:ring-2 focus:ring-ring" rows={4} />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleSubmit} disabled={!title || !startDate || saved} className="flex-1 gap-1.5 text-xs">
            {saved ? <><Check className="size-3" /> Saved!</> : isCreate ? <><Plus className="size-3" /> Create</> : <><Save className="size-3" /> Save</>}
          </Button>
          {!isCreate && (
            <Button variant="ghost" size="sm" onClick={() => onDelete(event!.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
