"use client"

import { useState } from "react"
import {
  MyClassesIcon,
  myClassesMeta,
} from "@/components/sidebar/animations/student"
import {
  HomeIcon,
  DashboardIcon,
  LibraryIcon,
  BookmarksIcon,
  ShelvesIcon,
  AuthorsIcon,
  ReadingIcon,
  TrialsIcon,
  ExploreIcon,
  TimelinesIcon,
  ProfileIcon,
  homeMeta,
  dashboardMeta,
  libraryMeta,
  bookmarksMeta,
  shelvesMeta,
  authorsMeta,
  readingMeta,
  trialsMeta,
  exploreMeta,
  timelinesMeta,
  profileMeta,
} from "@/components/sidebar/animations/shared"
import type { AnimatedIconMeta, AnimatedIconComponent } from "@/components/sidebar/animations/types"

const studentIcons: { Component: AnimatedIconComponent; meta: AnimatedIconMeta }[] = [
  { Component: MyClassesIcon, meta: myClassesMeta },
]

const sharedIcons: { Component: AnimatedIconComponent; meta: AnimatedIconMeta }[] = [
  { Component: HomeIcon, meta: homeMeta },
  { Component: DashboardIcon, meta: dashboardMeta },
  { Component: LibraryIcon, meta: libraryMeta },
  { Component: BookmarksIcon, meta: bookmarksMeta },
  { Component: ShelvesIcon, meta: shelvesMeta },
  { Component: AuthorsIcon, meta: authorsMeta },
  { Component: ReadingIcon, meta: readingMeta },
  { Component: TrialsIcon, meta: trialsMeta },
  { Component: ExploreIcon, meta: exploreMeta },
  { Component: TimelinesIcon, meta: timelinesMeta },
  { Component: ProfileIcon, meta: profileMeta },
]

function IconCard({
  Component,
  meta,
  globalHover,
}: {
  Component: AnimatedIconComponent
  meta: AnimatedIconMeta
  globalHover: boolean
}) {
  const [localHover, setLocalHover] = useState(false)
  const isHovered = globalHover || localHover

  return (
    <div className="rounded-lg border border-border bg-background p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{meta.name}</h3>
          <p className="text-xs text-muted-foreground">{meta.label}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{meta.animationDuration}ms</span>
          {meta.hasLoop && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">loops</span>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{meta.description}</p>

      <div className="flex items-end gap-6 py-3">
        {[16, 32, 64].map((size) => (
          <div key={size} className="flex flex-col items-center gap-1">
            <div
              style={{ width: size, height: size }}
              onMouseEnter={() => setLocalHover(true)}
              onMouseLeave={() => setLocalHover(false)}
              className="cursor-pointer"
            >
              <Component
                isHovered={isHovered}
                isActive={false}
                className="w-full h-full"
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{size}px</span>
          </div>
        ))}
      </div>

      <button
        className="text-xs rounded border border-border px-2 py-1 hover:bg-muted transition-colors"
        onMouseDown={() => setLocalHover(true)}
        onMouseUp={() => setLocalHover(false)}
        onMouseLeave={() => setLocalHover(false)}
      >
        Hold to hover
      </button>
    </div>
  )
}

export default function StudentSidebarDemo() {
  const [globalHover, setGlobalHover] = useState(false)

  return (
    <div className="p-6 space-y-8 max-w-3xl">
      <div>
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          Student Sidebar Icons
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          &ldquo;The Reader&rsquo;s Journey&rdquo; — animated hover states for student navigation
        </p>
      </div>

      <div className="flex gap-3">
        <button
          className="text-sm rounded border border-border px-3 py-1.5 hover:bg-muted transition-colors"
          onMouseDown={() => setGlobalHover(true)}
          onMouseUp={() => setGlobalHover(false)}
          onMouseLeave={() => setGlobalHover(false)}
        >
          Hold to play all
        </button>
        <button
          className="text-sm rounded border border-border px-3 py-1.5 hover:bg-muted transition-colors"
          onClick={() => setGlobalHover((v) => !v)}
        >
          {globalHover ? "Stop all" : "Toggle all"}
        </button>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-3">Student-Specific</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentIcons.map(({ Component, meta }) => (
            <IconCard
              key={meta.name}
              Component={Component}
              meta={meta}
              globalHover={globalHover}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-3">Shared Icons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sharedIcons.map(({ Component, meta }) => (
            <IconCard
              key={meta.name}
              Component={Component}
              meta={meta}
              globalHover={globalHover}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
