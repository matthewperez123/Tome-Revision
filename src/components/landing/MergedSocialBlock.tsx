"use client"

import { Users, BookOpen, UserPlus } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"

const POSTS = [
  { author: "Sofia R.", text: "The Nobody trick is pure metis \u2014 cunning over strength." },
  { author: "Marcus W.", text: "But his hubris in revealing his name is the real lesson." },
  { author: "Aisha P.", text: "Exactly! His greatest strength is also his flaw." },
]

const PROFILE = {
  name: "Elena Petrakis",
  handle: "elena",
  color: "#8B5CF6",
  initials: "EP",
  status: "Reading Inferno, Canto V",
  books: 23,
  wisdom: "12,340",
  shelf: [
    { title: "The Odyssey", color: "#6366F1" },
    { title: "Meditations", color: "#059669" },
    { title: "Inferno", color: "#DC2626" },
  ],
}

export function MergedSocialBlock() {
  return (
    <section className="bg-background py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-10">
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-foreground mb-3">
              Read with others.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Join a Circle for the book you&rsquo;re working through, or follow a friend and see what&rsquo;s cracking them open this week. Public profiles are opt-in; everything else is quiet by default.
            </p>
          </div>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Circle / Book Club card */}
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 rounded-lg bg-[#0EA5E9] flex items-center justify-center text-white">
                  <BookOpen className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    The Odyssey Circle
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Users className="size-3" />
                    23 members
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-full px-3 py-1 text-[10px] font-medium text-white bg-indigo-500"
                >
                  Join
                </button>
              </div>

              <div className="space-y-2 border-t border-border pt-3">
                {POSTS.map((p) => (
                  <div key={p.author} className="flex gap-2">
                    <div className="size-5 rounded-full bg-muted flex items-center justify-center text-[7px] font-bold shrink-0 mt-0.5">
                      {p.author[0]}
                    </div>
                    <div>
                      <span className="text-[9px] font-semibold text-foreground">
                        {p.author}
                      </span>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        {p.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Friend profile card */}
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="size-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ backgroundColor: PROFILE.color }}
                >
                  {PROFILE.initials}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {PROFILE.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    @{PROFILE.handle}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                    <BookOpen className="size-3 text-indigo-500" />
                    {PROFILE.status}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full px-3 py-1 text-[11px] font-semibold text-white flex items-center gap-1 bg-indigo-500"
                >
                  <UserPlus className="size-3" />
                  Follow
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <Stat label="Books" value={PROFILE.books.toString()} />
                <Stat label="Wisdom" value={PROFILE.wisdom} />
                <Stat label="Seals" value="8" />
              </div>

              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                Currently reading
              </p>
              <div className="flex gap-2">
                {PROFILE.shelf.map((b) => (
                  <div
                    key={b.title}
                    className="flex-1 rounded border border-border bg-muted px-2 py-1.5"
                  >
                    <div
                      className="h-1 w-full rounded-full mb-1"
                      style={{ backgroundColor: b.color }}
                    />
                    <p className="text-[10px] font-semibold text-foreground line-clamp-1">
                      {b.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted px-2 py-1.5 text-center">
      <p className="text-sm font-bold text-foreground tabular-nums">{value}</p>
      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
    </div>
  )
}
