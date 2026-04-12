"use client"

import { useState } from "react"
import { BookOpen, ChevronLeft, ChevronRight, ChevronDown, CheckCircle2, FileText, ScrollText, BookMarked, Library, Layers, Scroll } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { springs } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"
import { getUnitLabel } from "@/lib/structural-units"
import type { StructuralUnitType } from "@/data/books"

// ── Chapter type classification ──

export type ChapterType = "front-matter" | "chapter" | "back-matter"

const FRONT_MATTER_KEYWORDS = [
  "preface", "introduction", "introductory", "foreword", "dedication",
  "prologue", "epigraph", "letter", "note to", "author's note",
  "translator's", "dramatis personae", "the story", "frontispiece",
  "acknowledgment", "our raison", "characters in the play",
]

const BACK_MATTER_KEYWORDS = [
  "afterword", "appendix", "postscript",
  "endnotes", "glossary", "bibliography", "colophon",
]

// Patterns that indicate a structural container (not a leaf chapter)
const CONTAINER_PATTERNS = [
  /^(part|book|volume|act|division|section)\s+[ivxlcdm\d]+/i,
  /^(part|book|volume|act)\s+(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)/i,
  /^(first|second|third|fourth|fifth)\s+(part|book|volume|act|epilogue)/i,
  /^(part|book|volume)\s*:/i,
  /^epilogue$/i,
  /^(first|second|third)\s+epilogue/i,
]

// Patterns for scene-level items (nest under acts)
const SCENE_PATTERNS = [
  /^scene\s+[ivxlcdm\d]+/i,
  /^scene\s+(one|two|three|four|five|six|seven|eight|nine|ten)/i,
]

function isContainerTitle(title: string): boolean {
  const t = title.trim()
  return CONTAINER_PATTERNS.some(p => p.test(t))
}

// Level 1 containers: Book, Volume (top-level grouping)
const LEVEL1_PATTERNS = [
  /^(book|volume)\s+[ivxlcdm\d]+/i,
  /^(book|volume)\s+(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)/i,
  /^(first|second|third|fourth|fifth)\s+(book|volume)/i,
  /^(book|volume)\s*:/i,
]

function isLevel1Container(title: string): boolean {
  return LEVEL1_PATTERNS.some(p => p.test(title.trim()))
}

function isSceneTitle(title: string): boolean {
  const t = title.trim()
  return SCENE_PATTERNS.some(p => p.test(t))
}

export function classifyChapter(title: string): ChapterType {
  const lower = title.toLowerCase().trim()
  if (FRONT_MATTER_KEYWORDS.some(kw => lower.startsWith(kw) || lower.includes(kw))) return "front-matter"
  if (BACK_MATTER_KEYWORDS.some(kw => lower.startsWith(kw) || lower.includes(kw))) return "back-matter"
  return "chapter"
}

function getChapterTypeIcon(type: ChapterType) {
  switch (type) {
    case "front-matter": return ScrollText
    case "chapter": return BookOpen
    case "back-matter": return FileText
  }
}

type ContainerType = "part" | "book" | "volume" | "act" | "section"

function getContainerType(title: string): ContainerType {
  const t = title.toLowerCase().trim()
  if (/^volume\b/i.test(t) || /\bvolume\b/i.test(t)) return "volume"
  if (/^book\b/i.test(t) || /\bbook\b/i.test(t)) return "book"
  if (/^act\b/i.test(t) || /\bact\b/i.test(t)) return "act"
  if (/^part\b/i.test(t) || /\bpart\b/i.test(t)) return "part"
  return "section"
}

function getContainerIcon(containerType: ContainerType) {
  switch (containerType) {
    case "part": return BookOpen
    case "book": return Library
    case "volume": return Layers
    case "act": return Scroll
    case "section": return BookOpen
  }
}

function getChapterTypeLabel(type: ChapterType, unitType?: StructuralUnitType): string {
  switch (type) {
    case "front-matter": return "Front Matter"
    case "chapter": return getUnitLabel(unitType ?? 'chapter', true)
    case "back-matter": return "Back Matter"
  }
}

// ── Tree node types ──

interface LeafNode {
  kind: "leaf"
  index: number
  title: string
  type: ChapterType
}

interface ContainerNode {
  kind: "container"
  index: number
  title: string
  children: (LeafNode | ContainerNode)[]
}

type TOCNode = LeafNode | ContainerNode

// ── Build a two-level tree from flat chapter list ──

function buildTOCTree(chapters: string[]): { frontMatter: LeafNode[]; body: TOCNode[]; backMatter: LeafNode[] } {
  const frontMatter: LeafNode[] = []
  const backMatter: LeafNode[] = []
  const body: TOCNode[] = []
  let inBackMatter = false

  // First pass: identify containers that have actual content after them
  // A level-1 (Book/Volume) can contain level-2 (Part/Act) containers
  // A level-2 can contain leaf chapters
  const containerIndices = new Set<number>()
  for (let i = 0; i < chapters.length; i++) {
    if (!isContainerTitle(chapters[i])) continue
    const amL1 = isLevel1Container(chapters[i])
    for (let j = i + 1; j < chapters.length; j++) {
      if (classifyChapter(chapters[j]) === "back-matter") break
      if (isContainerTitle(chapters[j])) {
        // L1 container can contain L2 containers as children
        if (amL1 && !isLevel1Container(chapters[j])) {
          containerIndices.add(i)
          break
        }
        // Same-level container means this one ends — check if anything was found
        break
      }
      // Found a non-container child → this is a real container
      containerIndices.add(i)
      break
    }
  }

  let level1: ContainerNode | null = null  // Book / Volume
  let level2: ContainerNode | null = null  // Part / Act / Section

  chapters.forEach((title, i) => {
    const type = classifyChapter(title)

    // Front matter (only before body starts)
    if (type === "front-matter" && body.length === 0 && !level1 && !level2) {
      frontMatter.push({ kind: "leaf", index: i, title, type })
      return
    }

    // Back matter
    if (type === "back-matter") {
      inBackMatter = true
      level1 = null
      level2 = null
      backMatter.push({ kind: "leaf", index: i, title, type })
      return
    }
    if (inBackMatter) {
      backMatter.push({ kind: "leaf", index: i, title, type })
      return
    }

    const isReal = containerIndices.has(i)
    const isL1 = isLevel1Container(title)

    // Level-1 container with children (Book, Volume)
    if (isReal && isL1) {
      level1 = { kind: "container", index: i, title, children: [] }
      level2 = null
      body.push(level1)
      return
    }

    // Level-2 container with children (Part, Act, Section)
    if (isReal && !isL1) {
      level2 = { kind: "container", index: i, title, children: [] }
      if (level1) {
        level1.children.push(level2)
      } else {
        body.push(level2)
      }
      return
    }

    // Container title WITHOUT children → render as leaf
    if (isContainerTitle(title) && !isReal) {
      // A childless L1 resets both levels
      if (isL1) { level1 = null; level2 = null }
      else { level2 = null }
      const leaf: LeafNode = { kind: "leaf", index: i, title, type }
      if (level1 && !isL1) level1.children.push(leaf)
      else { level1 = null; level2 = null; body.push(leaf) }
      return
    }

    // Regular leaf chapter — nest in deepest container
    const leaf: LeafNode = { kind: "leaf", index: i, title, type }
    if (level2) level2.children.push(leaf)
    else if (level1) level1.children.push(leaf)
    else body.push(leaf)
  })

  return { frontMatter, body, backMatter }
}

// ── Types ──

interface ChapterSidebarProps {
  bookTitle: string
  chapters: string[]
  currentChapter: number
  onSelect: (index: number) => void
  open: boolean
  onToggle: () => void
  completedChapterIndices?: number[]
  structuralUnitType?: StructuralUnitType
}

// ── Component ──

export function ChapterSidebar({
  bookTitle,
  chapters,
  currentChapter,
  onSelect,
  open,
  onToggle,
  completedChapterIndices = [],
  structuralUnitType,
}: ChapterSidebarProps) {
  const { frontMatter, body, backMatter } = buildTOCTree(chapters)

  // Track which containers are expanded — auto-expand the one containing the current chapter
  const [expandedContainers, setExpandedContainers] = useState<Set<number>>(() => {
    const set = new Set<number>()
    // Recursively find and expand all containers that hold the current chapter
    function expandAncestors(nodes: TOCNode[]) {
      for (const node of nodes) {
        if (node.kind !== "container") continue
        function hasChapter(n: ContainerNode): boolean {
          return n.children.some(c =>
            c.kind === "leaf" ? c.index === currentChapter :
            c.index === currentChapter || hasChapter(c)
          )
        }
        if (node.index === currentChapter || hasChapter(node)) {
          set.add(node.index)
          // Also expand nested containers
          node.children.forEach(c => { if (c.kind === "container") expandAncestors([c]) })
        }
      }
    }
    expandAncestors(body)
    return set
  })

  function toggleContainer(containerIndex: number) {
    setExpandedContainers(prev => {
      const next = new Set(prev)
      if (next.has(containerIndex)) next.delete(containerIndex)
      else next.add(containerIndex)
      return next
    })
  }

  // Auto-expand the container of the current chapter when it changes
  // (handled by initialState above + key mechanism below is simpler: just check on render)

  const hasGroups = frontMatter.length > 0 || backMatter.length > 0
  const hasContainers = body.some(n => n.kind === "container")

  function renderLeaf(leaf: LeafNode, numberInGroup?: number) {
    const isActive = leaf.index === currentChapter
    const isCompleted = completedChapterIndices.includes(leaf.index)
    const Icon = getChapterTypeIcon(leaf.type)

    return (
      <button
        key={leaf.index}
        onClick={() => { onSelect(leaf.index); if (open) onToggle() }}
        className={cn(
          "relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-[color,opacity] duration-[var(--tome-duration-fast)]",
          isActive
            ? "text-foreground font-medium"
            : "text-muted-foreground hover:text-foreground hover:opacity-70"
        )}
      >
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="chapter-indicator"
            className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-foreground"
            transition={springs.interactive}
          />
        )}
        {isCompleted && !isActive ? (
          <CheckCircle2 className="size-3 shrink-0 text-emerald-500" />
        ) : leaf.type !== "chapter" ? (
          <Icon className={cn("size-3 shrink-0", isActive ? "text-foreground" : "text-muted-foreground")} />
        ) : numberInGroup != null ? (
          <span
            className={cn(
              "size-4 shrink-0 flex items-center justify-center rounded text-[9px] tabular-nums",
              isActive
                ? "bg-foreground text-background font-semibold"
                : "bg-muted text-muted-foreground"
            )}
          >
            {numberInGroup}
          </span>
        ) : (
          <Icon className={cn("size-3 shrink-0", isActive ? "text-foreground" : "text-muted-foreground")} />
        )}
        <span className="truncate">{leaf.title}</span>
      </button>
    )
  }

  function renderContainer(node: ContainerNode) {
    const isExpanded = expandedContainers.has(node.index)
    // Check recursively if any descendant is the current chapter
    function containsCurrentChapter(n: ContainerNode): boolean {
      if (n.index === currentChapter) return true
      return n.children.some(c => c.kind === "container" ? containsCurrentChapter(c) : c.index === currentChapter)
    }
    const containsCurrent = containsCurrentChapter(node)
    // Check if all leaf descendants are completed
    function allLeavesCompleted(n: ContainerNode): boolean {
      return n.children.every(c => c.kind === "container" ? allLeavesCompleted(c) : completedChapterIndices.includes(c.index))
    }
    const allCompleted = node.children.length > 0 && allLeavesCompleted(node)

    return (
      <div key={node.index} className="mb-1">
        {/* Container header — clickable to expand/collapse */}
        <button
          onClick={() => toggleContainer(node.index)}
          className={cn(
            "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs font-medium transition-colors",
            containsCurrent
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ChevronDown
            className={cn(
              "size-3 shrink-0 transition-transform duration-150",
              !isExpanded && "-rotate-90"
            )}
          />
          {(() => {
            const ContainerIcon = getContainerIcon(getContainerType(node.title))
            return allCompleted ? (
              <CheckCircle2 className="size-3 shrink-0 text-emerald-500" />
            ) : (
              <ContainerIcon className={cn("size-3 shrink-0", isExpanded ? "text-[var(--tome-accent)]" : "text-muted-foreground")} />
            )
          })()}
          <span className="truncate">{node.title}</span>
          <span className="ml-auto text-[9px] text-muted-foreground/60 tabular-nums shrink-0">
            {node.children.length}
          </span>
        </button>

        {/* Children — collapsible */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="ml-3 border-l border-border/50 pl-1 space-y-0.5">
                {node.children.map((child, ci) =>
                  child.kind === "container"
                    ? renderContainer(child)
                    : renderLeaf(child, ci + 1)
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Build a flat list of leaf indices for the peek rail when collapsed
  const allLeaves: { index: number; label: string }[] = []
  function collectLeaves(nodes: TOCNode[]) {
    for (const n of nodes) {
      if (n.kind === "leaf") allLeaves.push({ index: n.index, label: String(n.index + 1) })
      else n.children.forEach(c => { if (c.kind === "leaf") allLeaves.push({ index: c.index, label: String(allLeaves.length + 1) }); else if (c.kind === "container") collectLeaves([c]) })
    }
  }
  collectLeaves([...frontMatter, ...body, ...backMatter])

  return (
    <div
      className={cn(
        "relative shrink-0 border-r border-border bg-background transition-[width] duration-[var(--tome-duration-fast)] ease-[var(--tome-ease-scholarly)] overflow-hidden z-20",
        open ? "w-56" : "w-10"
      )}
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        aria-label={open ? "Collapse chapter sidebar" : "Expand chapter sidebar"}
        className="absolute top-3 right-0 z-10 flex size-6 items-center justify-center rounded-l-md border border-r-0 border-border bg-background text-muted-foreground hover:text-foreground transition-colors"
        style={{ right: open ? "0" : "auto", left: open ? "auto" : "2px" }}
      >
        {open ? <ChevronLeft className="size-3" /> : <ChevronRight className="size-3" />}
      </button>

      {/* Collapsed peek rail — always visible when sidebar is collapsed */}
      {!open && (
        <div className="flex h-full w-10 flex-col items-center pt-10 pb-3 overflow-y-auto gap-0.5">
          {allLeaves.map(leaf => {
            const isActive = leaf.index === currentChapter
            const isCompleted = completedChapterIndices.includes(leaf.index)
            return (
              <button
                key={leaf.index}
                onClick={() => onSelect(leaf.index)}
                title={chapters[leaf.index] ?? leaf.label}
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded text-[9px] tabular-nums transition-colors",
                  isActive
                    ? "bg-foreground text-background font-bold"
                    : isCompleted
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {leaf.label}
              </button>
            )
          })}
        </div>
      )}

      {open && (
        <div className="flex h-full min-w-[220px] flex-col p-3">
          {/* Book title */}
          <div className="flex items-center gap-2 mb-4 px-1">
            <BookMarked className="size-3.5 shrink-0 text-muted-foreground" />
            <p className="text-xs font-medium truncate">{bookTitle}</p>
          </div>

          {/* Chapter list — tree structure */}
          <nav className="flex-1 overflow-y-auto">
            {/* Front Matter section */}
            {frontMatter.length > 0 && (hasGroups || hasContainers) && (
              <div className="mb-3">
                <div className="flex items-center gap-1.5 px-2 mb-1.5">
                  <ScrollText className="size-3 text-muted-foreground/60" />
                  <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                    Front Matter
                  </span>
                </div>
                <div className="space-y-0.5">
                  {frontMatter.map(leaf => renderLeaf(leaf))}
                </div>
              </div>
            )}

            {/* Body — flat chapters or container → children tree */}
            {body.length > 0 && (
              <div className="mb-3">
                {(hasGroups || hasContainers) && !hasContainers && (
                  <div className="flex items-center gap-1.5 px-2 mb-1.5">
                    <BookOpen className="size-3 text-muted-foreground/60" />
                    <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                      {getChapterTypeLabel("chapter", structuralUnitType)}
                    </span>
                  </div>
                )}
                <div className="space-y-0.5">
                  {body.map((node, bi) => {
                    if (node.kind === "container") return renderContainer(node)
                    // Count only leaf nodes for numbering
                    const leafIndex = body.slice(0, bi).filter(n => n.kind === "leaf").length + 1
                    return renderLeaf(node, leafIndex)
                  })}
                </div>
              </div>
            )}

            {/* Back Matter section */}
            {backMatter.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1.5 px-2 mb-1.5">
                  <FileText className="size-3 text-muted-foreground/60" />
                  <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                    Back Matter
                  </span>
                </div>
                <div className="space-y-0.5">
                  {backMatter.map(leaf => renderLeaf(leaf))}
                </div>
              </div>
            )}
          </nav>

          {/* Progress */}
          <div className="mt-3 border-t border-border pt-3 px-1">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
              <span>Progress</span>
              <span className="tabular-nums">
                {Math.round(((currentChapter + 1) / chapters.length) * 100)}%
              </span>
            </div>
            <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-foreground"
                animate={{
                  width: `${((currentChapter + 1) / chapters.length) * 100}%`,
                }}
                transition={springs.gentle}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
