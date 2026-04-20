"use client"

import { useMemo } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps"
import { motion, AnimatePresence } from "motion/react"
import { useTheme } from "next-themes"
import { BookOpen } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import {
  getAuthorsByCountry,
  getCountriesWithAuthors,
  COUNTRY_NAMES,
  CONTINENT_COUNTRIES,
} from "@/data/author-countries"
import { getCountryColor } from "@/lib/country-colors"
import { useAnimationLoop } from "./useAnimationLoop"

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const NUMERIC_TO_ISO3: Record<string, string> = {
  "300": "GRC", "380": "ITA", "826": "GBR", "372": "IRL", "250": "FRA",
  "643": "RUS", "840": "USA", "276": "DEU", "040": "AUT", "203": "CZE",
  "348": "HUN", "724": "ESP", "578": "NOR", "752": "SWE", "246": "FIN",
  "756": "CHE", "616": "POL", "356": "IND", "156": "CHN", "392": "JPN",
  "364": "IRN", "422": "LBN", "124": "CAN",
  "032": "ARG", "036": "AUS", "076": "BRA", "818": "EGY", "404": "KEN",
  "484": "MEX", "566": "NGA", "710": "ZAF", "792": "TUR", "804": "UKR",
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
  "Canada": "CAN", "Algeria": "DZA", "Jamaica": "JAM", "Philippines": "PHL",
  "Australia": "AUS", "New Zealand": "NZL", "Nigeria": "NGA",
  "South Africa": "ZAF", "Kenya": "KEN", "Ghana": "GHA", "Senegal": "SEN",
  "Colombia": "COL", "Chile": "CHL", "Peru": "PER",
  "Brazil": "BRA", "Argentina": "ARG", "Mexico": "MEX",
  "Egypt": "EGY", "Turkey": "TUR", "Ukraine": "UKR",
  "Denmark": "DNK", "Portugal": "PRT", "Luxembourg": "LUX",
}

function resolveISO3(geo: { id?: string; properties: Record<string, unknown> }): string {
  const isoA3 = geo.properties.ISO_A3 as string | undefined
  if (isoA3 && isoA3 !== "-99") return isoA3
  const isoA3EH = geo.properties.ISO_A3_EH as string | undefined
  if (isoA3EH && isoA3EH !== "-99") return isoA3EH
  if (geo.id) {
    const fromNumeric = NUMERIC_TO_ISO3[geo.id]
    if (fromNumeric) return fromNumeric
  }
  const name = geo.properties.name as string | undefined
  if (name) {
    const fromName = NAME_TO_ISO3[name]
    if (fromName) return fromName
  }
  return ""
}

// ── Projection configs matching in-app ──────────────────────────────────────

const WORLD_VIEW = { center: [0, 20] as [number, number], scale: 155 }
const EUROPE_VIEW = { center: [15, 54] as [number, number], scale: 700 }

// Animation: world → zoom Europe → select Greece → show authors → reset
const PHASES = [
  { name: "world", duration: 1200 },
  { name: "zoomEurope", duration: 1050 },
  { name: "selectGreece", duration: 1050 },
  { name: "showAuthors", duration: 1500 },
  { name: "reset", duration: 200 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const FEATURED_COUNTRY = "GRC"

function formatYear(year?: number): string {
  if (year === undefined) return "?"
  if (year < 0) return `${Math.abs(year)} BCE`
  return `${year}`
}

export function WorldMapSection() {
  const { resolvedTheme } = useTheme()
  const mode = resolvedTheme === "dark" ? "dark" : "light"
  const countriesWithAuthors = useMemo(() => new Set(getCountriesWithAuthors()), [])
  const europeCountries = useMemo(() => new Set(CONTINENT_COUNTRIES.Europe ?? []), [])
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const greekAuthors = useMemo(() => getAuthorsByCountry(FEATURED_COUNTRY), [])

  // Determine current view state
  const isZoomed = phase === "zoomEurope" || phase === "selectGreece" || phase === "showAuthors"
  const selectedCountry = (phase === "selectGreece" || phase === "showAuthors") ? FEATURED_COUNTRY : null
  const showPanel = phase === "showAuthors"
  const projection = isZoomed ? EUROPE_VIEW : WORLD_VIEW

  // Theme-aware map colors matching in-app
  const oceanColor = mode === "dark" ? "#0F0E1A" : "#FAF7F2"
  const inactiveColor = mode === "dark" ? "#292524" : "#e7e5e4"
  const strokeColor = mode === "dark" ? "#44403c" : "#d6d3d1"

  function getCountryFill(iso3: string): string {
    const isActive = countriesWithAuthors.has(iso3)
    if (!isActive) return inactiveColor
    if (isZoomed && !europeCountries.has(iso3)) {
      return mode === "dark" ? "#1c1917" : "#f5f5f4"
    }
    return getCountryColor(iso3, mode) ?? (mode === "dark" ? "#818CF8" : "#6366F1")
  }

  // Shared map renderer
  const renderMap = (config: { center: [number, number]; scale: number }) => (
    <ComposableMap
      projection="geoEqualEarth"
      projectionConfig={{ scale: config.scale, center: config.center }}
      width={1000}
      height={500}
      style={{ width: "100%", height: "auto" }}
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const iso3 = resolveISO3(geo as { id?: string; properties: Record<string, unknown> })
            const isSelected = iso3 === selectedCountry
            const fill = getCountryFill(iso3)

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                className="outline-none"
                style={{
                  default: {
                    fill,
                    stroke: isSelected ? "#D4A04C" : strokeColor,
                    strokeWidth: isSelected ? 2 : 0.4,
                    outline: "none",
                    transition: "fill 400ms ease, stroke 300ms ease",
                  },
                  hover: {
                    fill,
                    stroke: isSelected ? "#D4A04C" : strokeColor,
                    strokeWidth: isSelected ? 2 : 0.4,
                    outline: "none",
                  },
                  pressed: {
                    fill,
                    stroke: strokeColor,
                    strokeWidth: 0.4,
                    outline: "none",
                  },
                }}
              />
            )
          })
        }
      </Geographies>
    </ComposableMap>
  )

  if (isReduced) {
    return (
      <section className="bg-background py-24 px-6 md:px-12 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <BlurFade delay={0.1} inView>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-center text-foreground mb-6">
              36 traditions. Every continent. 3,000 years.
            </h2>
          </BlurFade>
          <div className="rounded-xl overflow-hidden border border-border" style={{ backgroundColor: oceanColor }}>
            {renderMap(WORLD_VIEW)}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-background py-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <BlurFade delay={0.1} inView>
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-center text-foreground mb-6">
            36 traditions. Every continent. 3,000 years.
          </h2>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <div
            ref={containerRef}
            className="relative rounded-xl overflow-hidden border border-border"
            style={{ backgroundColor: oceanColor }}
            aria-label="Animated world map demonstration"
          >
            {/* Cross-fade between world and Europe projections */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isZoomed ? "europe" : "world"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  style={{ willChange: "opacity" }}
                >
                  {renderMap(projection)}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Continent label during world phase */}
            <AnimatePresence>
              {phase === "world" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="absolute top-[28%] left-[52%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ willChange: "opacity" }}
                >
                  <div className="rounded-full bg-indigo-500/90 px-3 py-1.5 text-white text-xs font-semibold shadow-md whitespace-nowrap">
                    Europe &middot; {(CONTINENT_COUNTRIES.Europe ?? []).length} countries
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Country label when selected */}
            <AnimatePresence>
              {selectedCountry && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="absolute top-3 left-3"
                  style={{ willChange: "transform, opacity" }}
                >
                  <div className="flex items-center gap-2 rounded-lg bg-card/90 backdrop-blur-sm border border-border px-3 py-2 shadow-md">
                    <div
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: getCountryColor(FEATURED_COUNTRY, mode) ?? "#6366F1" }}
                    />
                    <span className="text-sm font-semibold text-foreground">
                      {COUNTRY_NAMES[FEATURED_COUNTRY]}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {greekAuthors.length} authors
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Author panel slides in from right — auto-scrolling demo */}
            <AnimatePresence>
              {showPanel && (
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="absolute top-2 right-2 bottom-2 w-[240px] rounded-lg bg-card/95 backdrop-blur-sm border border-border shadow-lg flex flex-col pointer-events-none select-none"
                  style={{ willChange: "transform, opacity" }}
                >
                  <div className="flex items-center gap-1.5 px-3 pt-3 pb-2 border-b border-border shrink-0">
                    <BookOpen className="size-3.5 text-indigo-500" />
                    <span className="text-xs font-semibold text-foreground">
                      Authors in {COUNTRY_NAMES[FEATURED_COUNTRY]}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{greekAuthors.length}</span>
                  </div>
                  <div className="flex-1 overflow-hidden relative">
                    {/* Top/bottom fade masks */}
                    <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-card/95 to-transparent z-10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card/95 to-transparent z-10 pointer-events-none" />
                    {/* Auto-scrolling content */}
                    <motion.div
                      className="px-3 py-2 space-y-2"
                      initial={{ y: 0 }}
                      animate={{ y: "-45%" }}
                      transition={{ duration: 3, ease: "linear" }}
                      style={{ willChange: "transform" }}
                    >
                      {greekAuthors.map((author, i) => (
                        <motion.div
                          key={author.name}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06, duration: 0.2, ease: EASE }}
                          className="rounded-md bg-muted border border-border p-2.5"
                          style={{ willChange: "transform, opacity" }}
                        >
                          <p className="text-xs font-semibold text-foreground">{author.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {formatYear(author.birthYear)} &ndash; {formatYear(author.deathYear)}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                            {author.oneLine}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </BlurFade>
      </div>
    </section>
  )
}
