"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { springs } from "@/lib/design-tokens"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

interface ClassroomTab {
  id: string
  name: string
  studentCount: number
}

export function ClassroomTabBar({
  selectedId,
  onSelect,
}: {
  selectedId: string | null
  onSelect: (id: string | null) => void
}) {
  const { user, isDemoMode } = useAuth()
  const [classrooms, setClassrooms] = useState<ClassroomTab[]>([])

  useEffect(() => {
    if (isDemoMode || !user) {
      setClassrooms([])
      return
    }

    async function fetchClassrooms() {
      const supabase = createClient()

      const { data } = await supabase
        .from("classrooms")
        .select("id, name")
        .eq("teacher_id", user!.id)
        .eq("archived", false)
        .order("created_at", { ascending: true })

      if (!data?.length) {
        setClassrooms([])
        return
      }

      const withCounts = await Promise.all(
        data.map(async (c) => {
          const { count } = await supabase
            .from("classroom_members")
            .select("*", { count: "exact", head: true })
            .eq("classroom_id", c.id)
          return { ...c, studentCount: count ?? 0 }
        }),
      )

      setClassrooms(withCounts)
    }

    fetchClassrooms()
  }, [user, isDemoMode])

  if (classrooms.length <= 1) return null

  const tabs = [
    { id: null, label: "All Classes" },
    ...classrooms.map((c) => ({ id: c.id, label: c.name })),
  ]

  return (
    <div className="flex gap-1 overflow-x-auto rounded-lg bg-muted/50 p-1">
      {tabs.map((tab) => {
        const isActive = selectedId === tab.id
        return (
          <button
            key={tab.id ?? "all"}
            onClick={() => onSelect(tab.id)}
            className={`relative whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/70"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="classroom-tab"
                className="absolute inset-0 rounded-md bg-background shadow-sm"
                transition={springs.interactive}
              />
            )}
            <span className="relative">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
