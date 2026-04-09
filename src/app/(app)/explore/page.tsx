"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "next-themes"
import { X, BookOpen, Globe2, Users, ChevronRight } from "lucide-react"
import {
  getAuthorsByCountry,
  getCountriesWithAuthors,
  COUNTRY_NAMES,
  CONTINENT_COUNTRIES,
  type AuthorCountryData,
} from "@/data/author-countries"
import { BOOKS } from "@/data/books"

// ── Constants ────────────────────────────────────────────────────────────────

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

/** Approximate center coordinates for continent label placement (lon, lat) */
const CONTINENT_POSITIONS: Record<string, { x: number; y: number }> = {
  Europe: { x: 15, y: 50 },
  "North America": { x: -100, y: 45 },
  Asia: { x: 85, y: 40 },
}

// ── Palette ──────────────────────────────────────────────────────────────────

const PALETTE = {
  light: {
    ocean: "#faf7f2",
    inactive: "#d6d3cd",
    active: "#a5b4fc",
    continentHighlight: "#818cf8",
    hovered: "#6366f1",
    selected: "#4f46e5",
    stroke: "#94a3b8",
    activeStroke: "#4f46e5",
  },
  dark: {
    ocean: "#0f172a",
    inactive: "#78716c",
    active: "#92826a",
    continentHighlight: "#c9943e",
    hovered: "#e2b85c",
    selected: "#D4A04C",
    stroke: "#475569",
    activeStroke: "#D4A04C",
  },
} as const

// ── Helpers ──────────────────────────────────────────────────────────────────

function getBookCountForAuthor(authorName: string): number {
  return BOOKS.filter((b) => b.author === authorName).length
}

function formatYear(year?: number): string {
  if (year === undefined) return "?"
  if (year < 0) return `${Math.abs(year)} BCE`
  return `${year}`
}

function formatLifespan(author: AuthorCountryData): string {
  if (!author.birthYear && !author.deathYear) return ""
  return `${formatYear(author.birthYear)} \u2013 ${formatYear(author.deathYear)}`
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const palette = isDark ? PALETTE.dark : PALETTE.light

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [hoveredGeo, setHoveredGeo] = useState<string | null>(null)

  // ── Derived data ─────────────────────────────────────────────────────────

  const countriesWithAuthors = useMemo(() => {
    return new Set(getCountriesWithAuthors())
  }, [])

  const selectedAuthors = useMemo(() => {
    if (!selectedCountry) return []
    return getAuthorsByCountry(selectedCountry).sort((a, b) => {
      const aYear = a.birthYear ?? 9999
      const bYear = b.birthYear ?? 9999
      return aYear - bYear
    })
  }, [selectedCountry])

  const continentCountryCodes = useMemo(() => {
    if (!selectedContinent) return new Set<string>()
    return new Set(CONTINENT_COUNTRIES[selectedContinent] ?? [])
  }, [selectedContinent])

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleCountryClick = useCallback(
    (iso3: string) => {
      if (!countriesWithAuthors.has(iso3)) return
      setSelectedCountry(iso3)
      setPanelOpen(true)
    },
    [countriesWithAuthors]
  )

  const handleContinentClick = useCallback(
    (continent: string) => {
      if (selectedContinent === continent) {
        setSelectedContinent(null)
      } else {
        setSelectedContinent(continent)
      }
      setSelectedCountry(null)
      setPanelOpen(false)
    },
    [selectedContinent]
  )

  const closePanel = useCallback(() => {
    setPanelOpen(false)
    setSelectedCountry(null)
  }, [])

  // ── Fill resolver ────────────────────────────────────────────────────────

  const getFill = useCallback(
    (iso3: string): string => {
      const isActive = countriesWithAuthors.has(iso3)
      const isSelected = selectedCountry === iso3
      const isHovered = hoveredGeo === iso3
      const isInContinent = continentCountryCodes.has(iso3)

      if (isSelected) return palette.selected
      if (isHovered && isActive) return palette.hovered
      if (isInContinent && isActive) return palette.continentHighlight
      if (isActive) return palette.active
      return palette.inactive
    },
    [countriesWithAuthors, selectedCountry, hoveredGeo, continentCountryCodes, palette]
  )

  const getStroke = useCallback(
    (iso3: string): string => {
      const isActive = countriesWithAuthors.has(iso3)
      const isSelected = selectedCountry === iso3

      if (isSelected) return palette.activeStroke
      return palette.stroke
    },
    [countriesWithAuthors, selectedCountry, palette]
  )

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-full relative overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe2 className="size-4 text-[#D4A04C]" />
            <h1 className="text-sm font-serif font-semibold leading-none tracking-tight">
              Explore the World of Literature
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {countriesWithAuthors.size} countries
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="size-3" />
              {BOOKS.length} books
            </span>
          </div>
        </div>
      </div>

      {/* ── Map container ──────────────────────────────────────────────── */}
      <div className="flex-1 relative" style={{ backgroundColor: palette.ocean }}>
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{
            scale: 160,
            center: [0, 5],
          }}
          className="w-full h-full"
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const iso3: string =
                    (geo.properties.ISO_A3 as string) ??
                    (geo.properties.ISO_A3_EH as string) ??
                    ""
                  const isValid = iso3 && iso3 !== "-99"
                  const isActive = isValid && countriesWithAuthors.has(iso3)

                  const fill = isValid ? getFill(iso3) : palette.inactive
                  const stroke = isValid ? getStroke(iso3) : palette.stroke
                  const hoverFill = isActive ? palette.hovered : fill
                  const hoverStroke = isActive ? palette.activeStroke : stroke

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        if (isValid) setHoveredGeo(iso3)
                      }}
                      onMouseLeave={() => setHoveredGeo(null)}
                      onClick={() => {
                        if (isValid) handleCountryClick(iso3)
                      }}
                      className="outline-none"
                      style={{
                        default: {
                          fill,
                          stroke,
                          strokeWidth: 0.4,
                          cursor: isActive ? "pointer" : "default",
                          transition: "fill 0.2s ease, stroke 0.2s ease",
                        },
                        hover: {
                          fill: hoverFill,
                          stroke: hoverStroke,
                          strokeWidth: isActive ? 1.2 : 0.4,
                          cursor: isActive ? "pointer" : "default",
                          transition: "fill 0.2s ease, stroke 0.2s ease",
                        },
                        pressed: {
                          fill: isActive ? palette.selected : fill,
                          stroke,
                          strokeWidth: 0.4,
                        },
                      }}
                    />
                  )
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* ── Continent gateway buttons ──────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none">
          {Object.entries(CONTINENT_POSITIONS).map(([continent, pos]) => {
            const isSelected = selectedContinent === continent
            const authorCount = (CONTINENT_COUNTRIES[continent] ?? []).reduce(
              (sum, code) => sum + getAuthorsByCountry(code).length,
              0
            )

            return (
              <button
                key={continent}
                onClick={() => handleContinentClick(continent)}
                className={`
                  pointer-events-auto absolute
                  px-3 py-1.5 rounded-full
                  font-serif text-xs font-semibold
                  backdrop-blur-sm border transition-all duration-200
                  shadow-sm hover:shadow-md
                  ${
                    isSelected
                      ? "bg-[#D4A04C]/90 text-white border-[#D4A04C] dark:bg-[#D4A04C]/90"
                      : "bg-white/80 dark:bg-slate-900/80 text-foreground border-border hover:border-[#D4A04C]/50"
                  }
                `}
                style={{
                  left: `${((pos.x + 180) / 360) * 100}%`,
                  top: `${((90 - pos.y) / 180) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
                title={`${continent}: ${authorCount} authors`}
              >
                {continent}
                <span className="ml-1.5 text-[10px] opacity-70">
                  {authorCount}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Hover tooltip ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {hoveredGeo && countriesWithAuthors.has(hoveredGeo) && (
            <motion.div
              key="tooltip"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-4 left-4 z-10 pointer-events-none"
            >
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-border shadow-lg">
                <p className="font-serif font-semibold text-sm text-foreground">
                  {COUNTRY_NAMES[hoveredGeo] ?? hoveredGeo}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getAuthorsByCountry(hoveredGeo).length} author
                  {getAuthorsByCountry(hoveredGeo).length !== 1 ? "s" : ""}{" "}
                  &mdash; Click to explore
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Legend ─────────────────────────────────────────────────────── */}
        <div className="absolute bottom-4 right-4 z-10">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border text-[10px] text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: palette.active }}
              />
              <span>Has authors</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: palette.selected }}
              />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: palette.inactive }}
              />
              <span>No authors yet</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel (author list) ────────────────────────────────────── */}
      <AnimatePresence>
        {panelOpen && selectedCountry && (
          <motion.div
            key="author-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="absolute top-0 right-0 bottom-0 w-full sm:w-96 z-30
              bg-background/95 backdrop-blur-md border-l border-border
              flex flex-col shadow-2xl"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div>
                <h2 className="font-serif font-bold text-lg text-foreground">
                  {COUNTRY_NAMES[selectedCountry] ?? selectedCountry}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {selectedAuthors.length} author
                  {selectedAuthors.length !== 1 ? "s" : ""} in the Tome catalog
                </p>
              </div>
              <button
                onClick={closePanel}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                aria-label="Close panel"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Author cards */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {selectedAuthors.map((author, i) => {
                const bookCount = getBookCountForAuthor(author.name)

                return (
                  <motion.div
                    key={author.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={`/library?author=${encodeURIComponent(author.name)}`}
                      className="block group"
                    >
                      <div
                        className="rounded-xl border border-border p-3
                          hover:border-[#D4A04C]/50 hover:bg-muted/50
                          transition-all duration-200"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-serif font-semibold text-sm text-foreground group-hover:text-[#D4A04C] transition-colors">
                              {author.name}
                            </h3>
                            {(author.birthYear || author.deathYear) && (
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {formatLifespan(author)}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {author.oneLine}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 mt-0.5">
                            <BookOpen className="size-3 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground">
                              {bookCount}
                            </span>
                            <ChevronRight className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}

              {selectedAuthors.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No authors found for this country.
                </div>
              )}
            </div>

            {/* Panel footer */}
            <div className="px-4 py-3 border-t border-border">
              <Link
                href="/library"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg
                  bg-[#D4A04C] text-white font-semibold text-sm
                  hover:bg-[#c99540] transition-colors"
              >
                <BookOpen className="size-3.5" />
                Browse Full Library
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Backdrop when panel is open (mobile) ──────────────────────── */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePanel}
            className="absolute inset-0 bg-black/20 z-20 sm:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
