"use client"

import { motion } from "motion/react"
import { Flame, Trophy } from "lucide-react"
import { TeacherShowcaseShell } from "./teacher/TeacherShowcaseShell"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const DAYS = [
  { day: "Mon", mins: 35 },
  { day: "Tue", mins: 28 },
  { day: "Wed", mins: 42 },
  { day: "Thu", mins: 15 },
  { day: "Fri", mins: 50 },
  { day: "Sat", mins: 38 },
  { day: "Sun", mins: 25 },
]

const SEALS = [
  { name: "First Trial", color: "#6366F1" },
  { name: "Book Worm", color: "#22C55E" },
  { name: "Flame Keeper", color: "#F59E0B" },
]

export function ReadingInsightsShowcase() {
  return (
    <TeacherShowcaseShell
      heading="Know your reading life."
      subcopy="Time on the page, books finished, Flames kept, Seals earned. Your reading, made visible."
      layout="mockup-right"
      bgClass="bg-muted"
    >
      <div className="bg-card rounded-xl border border-border p-5 min-h-[260px]">
        <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-wider font-medium">This Week</p>

        {/* Bar chart — grows once when scrolled into view, then rests */}
        <div className="flex items-end gap-1.5 h-20 mb-4">
          {DAYS.map((d, i) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-0.5">
              <motion.div
                className="w-full rounded-t bg-indigo-500/70"
                initial={{ height: "0px" }}
                whileInView={{ height: `${(d.mins / 50) * 60}px` }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}
              />
              <span className="text-[7px] text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>

        {/* Streak */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5">
            <Flame className="size-4 text-orange-500" />
            <span className="text-lg font-bold">14</span>
            <span className="text-[10px] text-muted-foreground">day Flame</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-lg font-bold">233</span>
            <span className="text-[10px] text-muted-foreground">min this week</span>
          </div>
        </div>

        {/* Seals */}
        <div>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-2">Recent Seals</p>
          <div className="flex gap-2">
            {SEALS.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
                style={{ backgroundColor: `${s.color}15` }}
              >
                <Trophy className="size-3" style={{ color: s.color }} />
                <span className="text-[9px] font-medium" style={{ color: s.color }}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TeacherShowcaseShell>
  )
}
