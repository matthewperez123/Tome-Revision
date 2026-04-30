"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import Link from "next/link"
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "next-themes"
import {
  X,
  BookOpen,
  Globe2,
  Users,
  ChevronRight,
  ArrowLeft,
  ArrowUpDown,
} from "lucide-react"
import {
  getAuthorsByCountry,
  getCountriesWithAuthors,
  COUNTRY_NAMES,
  CONTINENT_COUNTRIES,
  AUTHOR_COUNTRIES,
  type AuthorCountryData,
} from "@/data/author-countries"
import { getCountryColor } from "@/lib/country-colors"
import { BOOKS } from "@/data/books"
import { authorSlug } from "@/data/authors"

// ── Constants ────────────────────────────────────────────────────────────────

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

// ── ISO numeric → alpha-3 mapping (for world-atlas@2 which uses numeric IDs) ─

const NUMERIC_TO_ISO3: Record<string, string> = {
  "300": "GRC", "380": "ITA", "826": "GBR", "372": "IRL", "250": "FRA",
  "643": "RUS", "840": "USA", "276": "DEU", "040": "AUT", "203": "CZE",
  "348": "HUN", "724": "ESP", "578": "NOR", "752": "SWE", "246": "FIN",
  "756": "CHE", "616": "POL", "356": "IND", "156": "CHN", "392": "JPN",
  "364": "IRN", "422": "LBN", "124": "CAN",
  // Additional common countries for geographic context
  "032": "ARG", "036": "AUS", "076": "BRA", "818": "EGY", "404": "KEN",
  "484": "MEX", "566": "NGA", "710": "ZAF", "792": "TUR", "804": "UKR",
  // Countries with authors in our catalog
  "012": "DZA", "388": "JAM", "608": "PHL", "554": "NZL", "620": "PRT",
  "170": "COL", "152": "CHL", "604": "PER", "686": "SEN", "288": "GHA",
  "208": "DNK", "442": "LUX",
}

const NAME_TO_ISO3: Record<string, string> = {
  "Greece": "GRC", "Italy": "ITA", "United Kingdom": "GBR", "Ireland": "IRL",
  "France": "FRA", "Russia": "RUS", "United States of America": "USA",
  "Germany": "DEU", "Austria": "AUT", "Czechia": "CZE", "Czech Rep.": "CZE",
  "Hungary": "HUN", "Spain": "ESP", "Norway": "NOR", "Sweden": "SWE",
  "Finland": "FIN", "Switzerland": "CHE", "Poland": "POL", "India": "IND",
  "China": "CHN", "Japan": "JPN", "Iran": "IRN", "Lebanon": "LBN",
  "Canada": "CAN", "Algeria": "DZA", "Jamaica": "JAM", "Philippines": "PHL", "Portugal": "PRT",
  "Australia": "AUS", "New Zealand": "NZL", "Nigeria": "NGA",
  "South Africa": "ZAF", "Kenya": "KEN", "Ghana": "GHA", "Senegal": "SEN",
  "Colombia": "COL", "Chile": "CHL", "Peru": "PER",
  "Brazil": "BRA", "Argentina": "ARG", "Mexico": "MEX",
  "Egypt": "EGY", "Turkey": "TUR", "Ukraine": "UKR",
  "Denmark": "DNK", "Luxembourg": "LUX",
}

function resolveISO3(geo: { id?: string; properties: Record<string, unknown> }): string {
  // Try ISO_A3 first (some TopoJSON sources have it)
  const isoA3 = geo.properties.ISO_A3 as string | undefined
  if (isoA3 && isoA3 !== "-99") return isoA3

  const isoA3EH = geo.properties.ISO_A3_EH as string | undefined
  if (isoA3EH && isoA3EH !== "-99") return isoA3EH

  // Try numeric ID (world-atlas@2 uses this)
  if (geo.id) {
    const fromNumeric = NUMERIC_TO_ISO3[geo.id]
    if (fromNumeric) return fromNumeric
  }

  // Try name as fallback
  const name = geo.properties.name as string | undefined
  if (name) {
    const fromName = NAME_TO_ISO3[name]
    if (fromName) return fromName
  }

  return ""
}

// ── Projection configs per view ──────────────────────────────────────────────

type ViewKey = "world" | "europe" | "asia" | "northAmerica" | "africa" | "oceania" | "southAmerica"

interface ProjectionView {
  center: [number, number]
  scale: number
  label: string
}

const VIEWS: Record<ViewKey, ProjectionView> = {
  world:        { center: [0, 20],    scale: 155, label: "World" },
  europe:       { center: [15, 54],   scale: 700, label: "Europe" },
  asia:         { center: [95, 35],   scale: 380, label: "Asia" },
  northAmerica: { center: [-100, 45], scale: 420, label: "North America" },
  africa:       { center: [20, 5],    scale: 380, label: "Africa" },
  oceania:      { center: [135, -28], scale: 500, label: "Oceania" },
  southAmerica: { center: [-60, -15], scale: 350, label: "South America" },
}

// Map continent labels to ViewKey + approximate screen position (% of map)
const CONTINENT_BUTTONS: { continent: string; viewKey: ViewKey; top: string; left: string }[] = [
  { continent: "Europe",        viewKey: "europe",       top: "28%", left: "52%" },
  { continent: "Asia",          viewKey: "asia",         top: "32%", left: "72%" },
  { continent: "North America", viewKey: "northAmerica", top: "30%", left: "22%" },
  { continent: "South America", viewKey: "southAmerica", top: "58%", left: "32%" },
  { continent: "Africa",        viewKey: "africa",       top: "52%", left: "52%" },
  { continent: "Oceania",       viewKey: "oceania",      top: "65%", left: "82%" },
]

const CONTINENT_TO_VIEW: Record<string, ViewKey> = {
  Europe: "europe",
  Asia: "asia",
  "North America": "northAmerica",
  "South America": "southAmerica",
  Africa: "africa",
  Oceania: "oceania",
}

// ── Sort options ─────────────────────────────────────────────────────────────

type SortMode = "chronological" | "alphabetical" | "bookCount"

const SORT_LABELS: Record<SortMode, string> = {
  chronological: "Chronological",
  alphabetical: "Alphabetical",
  bookCount: "Book count",
}

const SORT_ORDER: SortMode[] = ["chronological", "alphabetical", "bookCount"]

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

function sortAuthors(authors: AuthorCountryData[], mode: SortMode): AuthorCountryData[] {
  const sorted = [...authors]
  switch (mode) {
    case "chronological":
      return sorted.sort((a, b) => (a.birthYear ?? 9999) - (b.birthYear ?? 9999))
    case "alphabetical":
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case "bookCount":
      return sorted.sort(
        (a, b) => getBookCountForAuthor(b.name) - getBookCountForAuthor(a.name)
      )
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const mode = isDark ? "dark" : "light"

  // ── State ───────────────────────────────────────────────────────────────
  const [currentView, setCurrentView] = useState<ViewKey>("world")
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [hoveredGeo, setHoveredGeo] = useState<string | null>(null)
  const [sortMode, setSortMode] = useState<SortMode>("chronological")

  // ── Derived data ────────────────────────────────────────────────────────
  const countriesWithAuthors = useMemo(() => new Set(getCountriesWithAuthors()), [])

  const selectedAuthors = useMemo(() => {
    if (!selectedCountry) return []
    return sortAuthors(getAuthorsByCountry(selectedCountry), sortMode)
  }, [selectedCountry, sortMode])

  const panelOpen = selectedCountry !== null

  const projectionConfig = VIEWS[currentView]

  // ── Colors ──────────────────────────────────────────────────────────────
  const oceanColor = isDark ? "#0F0E1A" : "#FAF7F2"
  const inactiveColor = isDark ? "#292524" : "#e7e5e4" // stone-800 / stone-200
  const borderColor = isDark ? "#44403c" : "#d6d3d1" // stone-700 / stone-300
  const goldAccent = "#D4A04C"

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleCountryClick = useCallback(
    (iso3: string) => {
      if (!countriesWithAuthors.has(iso3)) return
      setSelectedCountry(iso3)
      setSortMode("chronological")
    },
    [countriesWithAuthors]
  )

  const handleContinentZoom = useCallback((viewKey: ViewKey) => {
    setCurrentView(viewKey)
    setSelectedCountry(null)
  }, [])

  const handleBackToWorld = useCallback(() => {
    setCurrentView("world")
    setSelectedCountry(null)
  }, [])

  const closePanel = useCallback(() => {
    setSelectedCountry(null)
  }, [])

  const cycleSortMode = useCallback(() => {
    setSortMode((prev) => {
      const idx = SORT_ORDER.indexOf(prev)
      return SORT_ORDER[(idx + 1) % SORT_ORDER.length]
    })
  }, [])

  // ── Keyboard: Escape closes panel ──────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (panelOpen) {
          closePanel()
        } else if (currentView !== "world") {
          handleBackToWorld()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [panelOpen, currentView, closePanel, handleBackToWorld])

  // ── Prevent wheel scroll on map ────────────────────────────────────────
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Do nothing — no zoom
  }, [])

  // ── Fill resolver ──────────────────────────────────────────────────────
  // Which continent's countries are currently visible (after zoom)
  const visibleContinentCountries = useMemo(() => {
    if (currentView === "world") return new Set<string>()
    // Find which continent key maps to this view
    const continent = Object.entries(CONTINENT_TO_VIEW).find(([, v]) => v === currentView)?.[0]
    if (!continent) return new Set<string>()
    return new Set(CONTINENT_COUNTRIES[continent] ?? [])
  }, [currentView])

  const getFill = useCallback(
    (iso3: string): string => {
      const isActive = countriesWithAuthors.has(iso3)
      const isSelected = selectedCountry === iso3
      const isHovered = hoveredGeo === iso3

      // World view: active countries get a muted tint, no individual colors yet
      if (currentView === "world") {
        if (!isActive) return inactiveColor
        return isDark ? "#57534e" : "#a8a29e" // subtle warm stone for "has authors" at world level
      }

      // Continent view: only countries in the zoomed continent get vivid colors
      if (!isActive) return inactiveColor
      if (!visibleContinentCountries.has(iso3)) {
        return isDark ? "#44403c" : "#d6d3cd" // dimmer for countries outside this continent
      }

      const countryColor = getCountryColor(iso3, mode) ?? inactiveColor
      if (isSelected) return countryColor
      if (isHovered) return countryColor
      return countryColor
    },
    [countriesWithAuthors, selectedCountry, hoveredGeo, mode, inactiveColor, isDark, currentView, visibleContinentCountries]
  )

  const getStrokeWidth = useCallback(
    (iso3: string): number => {
      if (selectedCountry === iso3) return 2
      if (hoveredGeo === iso3 && countriesWithAuthors.has(iso3)) return 1.5
      return 0.5
    },
    [selectedCountry, hoveredGeo, countriesWithAuthors]
  )

  const getStrokeColor = useCallback(
    (iso3: string): string => {
      if (selectedCountry === iso3) return goldAccent
      if (hoveredGeo === iso3 && countriesWithAuthors.has(iso3)) return goldAccent
      return borderColor
    },
    [selectedCountry, hoveredGeo, countriesWithAuthors, borderColor]
  )

  const getOpacity = useCallback(
    (iso3: string): number => {
      const isActive = countriesWithAuthors.has(iso3)
      const isHovered = hoveredGeo === iso3
      if (!isActive) return 1
      if (isHovered) return 0.85
      return 1
    },
    [countriesWithAuthors, hoveredGeo]
  )

  // ── Country color for the sidebar dot ──────────────────────────────────
  const selectedCountryColor = selectedCountry
    ? getCountryColor(selectedCountry, mode) ?? goldAccent
    : goldAccent

  // ── Render ─────────────────────────────────────────────────────────────

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
              <Users className="size-3" />
              {Object.keys(AUTHOR_COUNTRIES).length} authors
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="size-3" />
              {BOOKS.length} books
            </span>
          </div>
        </div>
      </div>

      {/* ── Map container ──────────────────────────────────────────────── */}
      <div
        className="flex-1 relative"
        style={{
          backgroundColor: oceanColor,
          touchAction: "pan-y",
        }}
        onWheel={handleWheel}
      >
        {/* Map with CSS transition for smooth view switching */}
        <div
          style={{
            transition: "all 700ms ease-out",
            width: "100%",
            height: "100%",
          }}
          key={currentView}
        >
          <ComposableMap
            projection="geoEqualEarth"
            projectionConfig={{
              scale: projectionConfig.scale,
              center: projectionConfig.center,
            }}
            className="w-full h-full"
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const iso3 = resolveISO3(geo as { id?: string; properties: Record<string, unknown> })
                  const isValid = iso3.length > 0
                  const isActive = isValid && countriesWithAuthors.has(iso3)

                  const fill = isValid ? getFill(iso3) : inactiveColor
                  const strokeW = isValid ? getStrokeWidth(iso3) : 0.5
                  const strokeC = isValid ? getStrokeColor(iso3) : borderColor
                  const opacity = isValid ? getOpacity(iso3) : 1

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        if (isValid) setHoveredGeo(iso3)
                      }}
                      onMouseLeave={() => setHoveredGeo(null)}
                      onClick={() => {
                        if (isValid && currentView !== "world" && visibleContinentCountries.has(iso3)) handleCountryClick(iso3)
                      }}
                      className="outline-none"
                      style={{
                        default: {
                          fill,
                          stroke: strokeC,
                          strokeWidth: strokeW,
                          opacity,
                          cursor: (isActive && currentView !== "world" && visibleContinentCountries.has(iso3)) ? "pointer" : "default",
                          transition: "fill 300ms ease, stroke 300ms ease, stroke-width 200ms ease, opacity 200ms ease",
                        },
                        hover: {
                          fill: isActive ? (getCountryColor(iso3, mode) ?? fill) : fill,
                          stroke: isActive ? goldAccent : strokeC,
                          strokeWidth: isActive ? 1.5 : 0.5,
                          opacity: isActive ? 0.85 : 1,
                          cursor: (isActive && currentView !== "world" && visibleContinentCountries.has(iso3)) ? "pointer" : "default",
                          transition: "fill 300ms ease, stroke 300ms ease, stroke-width 200ms ease, opacity 200ms ease",
                        },
                        pressed: {
                          fill: isActive ? (getCountryColor(iso3, mode) ?? fill) : fill,
                          stroke: isActive ? goldAccent : strokeC,
                          strokeWidth: isActive ? 2 : 0.5,
                        },
                      }}
                    />
                  )
                })
              }
            </Geographies>
          </ComposableMap>
        </div>

        {/* ── Continent gateway buttons — positioned ON each continent ── */}
        <AnimatePresence>
          {currentView === "world" && CONTINENT_BUTTONS.map(({ continent, viewKey, top, left }) => {
            const authorCount = (CONTINENT_COUNTRIES[continent] ?? []).reduce(
              (sum, code) => sum + getAuthorsByCountry(code).length,
              0
            )
            return (
              <motion.button
                key={continent}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleContinentZoom(viewKey)}
                className="
                  absolute z-10 -translate-x-1/2 -translate-y-1/2
                  px-3.5 py-2 rounded-xl
                  font-serif text-sm font-semibold
                  backdrop-blur-md border transition-all duration-200
                  shadow-lg hover:shadow-xl
                  bg-white/85 dark:bg-stone-900/85 text-foreground
                  border-[#D4A04C]/20 hover:border-[#D4A04C]/60
                  hover:bg-white dark:hover:bg-stone-800
                  cursor-pointer
                "
                style={{ top, left }}
              >
                <span className="block text-center">{continent}</span>
                <span className="block text-center text-[10px] text-muted-foreground mt-0.5">
                  {authorCount} authors
                </span>
              </motion.button>
            )
          })}
        </AnimatePresence>

        {/* ── Back to world button ────────────────────────────────────── */}
        <AnimatePresence>
          {currentView !== "world" && (
            <motion.button
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              onClick={handleBackToWorld}
              className="
                absolute top-4 left-4 z-10
                flex items-center gap-1.5
                px-3 py-1.5 rounded-full
                font-serif text-xs font-semibold
                backdrop-blur-sm border transition-all duration-200
                shadow-sm hover:shadow-md
                bg-white/80 dark:bg-stone-900/80 text-foreground
                border-border hover:border-[#D4A04C]/50
              "
            >
              <ArrowLeft className="size-3" />
              Back to world
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Hover tooltip ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {hoveredGeo && currentView !== "world" && countriesWithAuthors.has(hoveredGeo) && visibleContinentCountries.has(hoveredGeo) && (
            <motion.div
              key="tooltip"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-4 left-4 z-10 pointer-events-none"
            >
              <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-border shadow-lg">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: getCountryColor(hoveredGeo, mode) ?? goldAccent }}
                  />
                  <p className="font-serif font-semibold text-sm text-foreground">
                    {COUNTRY_NAMES[hoveredGeo] ?? hoveredGeo}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 ml-[18px]">
                  {getAuthorsByCountry(hoveredGeo).length} author
                  {getAuthorsByCountry(hoveredGeo).length !== 1 ? "s" : ""}{" "}
                  &mdash; Click to explore
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ── Backdrop scrim ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closePanel}
            className="absolute inset-0 bg-black/30 dark:bg-black/50 z-20"
          />
        )}
      </AnimatePresence>

      {/* ── Right panel (author sidebar) ──────────────────────────────────── */}
      <AnimatePresence>
        {panelOpen && selectedCountry && (
          <motion.div
            key="author-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="
              absolute top-0 right-0 bottom-0 z-30
              w-full sm:w-[420px]
              bg-background/95 backdrop-blur-md border-l border-border
              flex flex-col shadow-2xl
            "
          >
            {/* Panel header */}
            <div className="px-5 pt-5 pb-4 border-b border-border">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: selectedCountryColor }}
                    />
                    <h2
                      className="font-serif font-bold text-foreground truncate"
                      style={{ fontSize: "32px", lineHeight: "1.1" }}
                    >
                      {COUNTRY_NAMES[selectedCountry] ?? selectedCountry}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground ml-[22px]">
                    {selectedAuthors.length} author
                    {selectedAuthors.length !== 1 ? "s" : ""} in the Tome catalog
                  </p>
                </div>
                <button
                  onClick={closePanel}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors mt-1"
                  aria-label="Close panel"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Sort toggle */}
              {selectedAuthors.length > 1 && (
                <button
                  onClick={cycleSortMode}
                  className="
                    mt-3 ml-[22px] flex items-center gap-1.5
                    text-xs text-muted-foreground
                    hover:text-foreground transition-colors
                    px-2 py-1 rounded-md hover:bg-muted
                  "
                >
                  <ArrowUpDown className="size-3" />
                  {SORT_LABELS[sortMode]}
                </button>
              )}
            </div>

            {/* Author cards */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
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
                      href={`/author/${authorSlug(author.name)}`}
                      className="block group"
                    >
                      <div
                        className="rounded-xl border border-border p-3.5
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
            <div className="px-5 py-4 border-t border-border">
              <Link
                href="/library/browse"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg
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
    </div>
  )
}
