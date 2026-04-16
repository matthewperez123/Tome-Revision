"use client"

import { BookOpen, Brain, PenTool } from "lucide-react"
import type { Station, StationType } from "@/lib/guided-learning-types"
import { STATION_TYPE_LABELS } from "@/lib/guided-station-utils"

const ICONS: Record<StationType, typeof BookOpen> = {
  reading: BookOpen,
  quiz: Brain,
  reflection: PenTool,
}

interface Props {
  sessionTitle: string
  teacherName?: string
  currentStation: Station
  totalStations: number
}

export function SessionHeaderBar({
  sessionTitle,
  teacherName,
  currentStation,
  totalStations,
}: Props) {
  const Icon = ICONS[currentStation.type]

  return (
    <div
      className="sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-2.5"
      style={{
        borderBottomColor: "var(--gold-default, #B8924A)",
        borderBottomWidth: "2px",
        backgroundColor: "var(--background)",
      }}
    >
      <Icon
        className="h-4 w-4 shrink-0"
        style={{ color: "var(--gold-default, #B8924A)" }}
      />
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold">{sessionTitle}</p>
        <p className="text-xs opacity-50">
          Station {currentStation.station_index + 1} of {totalStations}
          {currentStation.title && ` — ${currentStation.title}`}
          {teacherName && ` · ${teacherName}`}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalStations }, (_, i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor:
                i < currentStation.station_index
                  ? "var(--tome-success, #2D9A47)"
                  : i === currentStation.station_index
                    ? "var(--gold-default, #B8924A)"
                    : "rgba(128, 128, 128, 0.2)",
            }}
          />
        ))}
      </div>
    </div>
  )
}
