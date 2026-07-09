"use client"

import { useMemo, useState } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps"
import { AnimatePresence, motion } from "motion/react"
import { useTheme } from "next-themes"
import { BookOpen } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { DemoFrame } from "@/components/demo/DemoFrame"
import {
  getAuthorsByCountry,
  getCountriesWithAuthors,
  COUNTRY_NAMES,
  CONTINENT_COUNTRIES,
} from "@/data/author-countries"
import { getCountryColor } from "@/lib/country-colors"
import { formatBookCount } from "@/lib/marketing/catalog-stats"
import { useCatalogStats } from "@/lib/marketing/catalog-stats-context"
import { cn } from "@/lib/utils"

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

// ── Projection configs (world + one per continent) ──────────────────────────

type MapView = { center: [number, number]; scale: number }

const WORLD_VIEW: MapView = { center: [0, 20], scale: 155 }

const CONTINENT_VIEWS: Record<string, MapView> = {
  Europe: { center: [15, 54], scale: 700 },
  "North America": { center: [-100, 45], scale: 320 },
  Asia: { center: [90, 35], scale: 300 },
  Africa: { center: [20, 3], scale: 330 },
  Oceania: { center: [145, -25], scale: 520 },
  "South America": { center: [-60, -20], scale: 360 },
}

const CONTINENTS = Object.keys(CONTINENT_COUNTRIES)
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

function formatYear(year?: number): string {
  if (year === undefined) return "?"
  if (year < 0) return `${Math.abs(year)} BCE`
  return `${year}`
}

/** First continent that lists a given country (RUS falls to Europe). */
function continentOf(iso3: string): string | null {
  for (const [continent, codes] of Object.entries(CONTINENT_COUNTRIES)) {
    if (codes.includes(iso3)) return continent
  }
  return null
}

export function WorldMapSection() {
  const stats = useCatalogStats()
  const headline = `${formatBookCount(stats.bookCount)} books. Every continent. 3,000 years.`
  const { resolvedTheme } = useTheme()
  const mode = resolvedTheme === "dark" ? "dark" : "light"
  const countriesWithAuthors = useMemo(() => new Set(getCountriesWithAuthors()), [])

  // "world" or a continent name. A country selection focuses its continent.
  const [view, setView] = useState<"world" | string>("world")
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const isWorld = view === "world"
  const projection = isWorld ? WORLD_VIEW : CONTINENT_VIEWS[view] ?? WORLD_VIEW
  const focusCountries = useMemo(
    () => (isWorld ? null : new Set(CONTINENT_COUNTRIES[view] ?? [])),
    [isWorld, view],
  )

  const selectedAuthors = useMemo(
    () => (selectedCountry ? getAuthorsByCountry(selectedCountry) : []),
    [selectedCountry],
  )

  // Focusable country chips for the current view (keyboard-friendly selection).
  const viewCountryChips = useMemo(() => {
    const codes = isWorld
      ? Array.from(countriesWithAuthors)
      : (CONTINENT_COUNTRIES[view] ?? []).filter((c) => countriesWithAuthors.has(c))
    return codes
      .filter((c) => COUNTRY_NAMES[c])
      .sort((a, b) => (COUNTRY_NAMES[a] ?? a).localeCompare(COUNTRY_NAMES[b] ?? b))
  }, [isWorld, view, countriesWithAuthors])

  function selectCountry(iso3: string) {
    if (!countriesWithAuthors.has(iso3)) return
    setSelectedCountry(iso3)
    const continent = continentOf(iso3)
    if (continent) setView(continent)
  }

  function selectRegion(next: "world" | string) {
    setView(next)
    setSelectedCountry(null)
  }

  function reset() {
    setView("world")
    setSelectedCountry(null)
  }

  // Theme-aware map colors matching in-app
  const oceanColor = mode === "dark" ? "#0F0E1A" : "#FAF7F2"
  const inactiveColor = mode === "dark" ? "#292524" : "#e7e5e4"
  const strokeColor = mode === "dark" ? "#44403c" : "#d6d3d1"

  function getCountryFill(iso3: string): string {
    const isActive = countriesWithAuthors.has(iso3)
    if (!isActive) return inactiveColor
    // Dim active countries outside the focused continent.
    if (focusCountries && !focusCountries.has(iso3)) {
      return mode === "dark" ? "#1c1917" : "#f5f5f4"
    }
    return getCountryColor(iso3, mode) ?? (mode === "dark" ? "#818CF8" : "#6366F1")
  }

  const renderMap = (config: MapView, interactive: boolean) => (
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
            const clickable = interactive && countriesWithAuthors.has(iso3)

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                className="outline-none"
                onClick={clickable ? () => selectCountry(iso3) : undefined}
                style={{
                  default: {
                    fill,
                    stroke: isSelected ? "#D4A04C" : strokeColor,
                    strokeWidth: isSelected ? 2 : 0.4,
                    outline: "none",
                    cursor: clickable ? "pointer" : "default",
                    transition: "fill 400ms ease, stroke 300ms ease",
                  },
                  hover: {
                    fill: clickable
                      ? getCountryColor(iso3, mode) ?? fill
                      : fill,
                    stroke: isSelected ? "#D4A04C" : clickable ? "#D4A04C" : strokeColor,
                    strokeWidth: isSelected ? 2 : clickable ? 1 : 0.4,
                    outline: "none",
                    cursor: clickable ? "pointer" : "default",
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

  return (
    <section className="bg-background py-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <BlurFade delay={0.1} inView>
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-center text-foreground mb-3">
            {headline}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed text-center max-w-xl mx-auto mb-6">
            Browse the canon by tradition &mdash; from Mesopotamia to Modernism,
            every region of world literature charted on a single Ortelius-style
            map. Pick a region, then tap a country to meet its authors.
          </p>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <DemoFrame
            ariaLabel="Interactive world map of the literary canon"
            label="Live demo"
            hint="Tap a country"
            onReset={view !== "world" || selectedCountry ? reset : undefined}
          >
            {/* Region controls */}
            <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Choose a region">
              <RegionButton
                active={isWorld}
                onClick={() => selectRegion("world")}
                label="World"
              />
              {CONTINENTS.map((continent) => (
                <RegionButton
                  key={continent}
                  active={view === continent}
                  onClick={() => selectRegion(continent)}
                  label={continent}
                />
              ))}
            </div>

            <div className="relative grid gap-3 md:grid-cols-[1fr_240px]">
              {/* Map */}
              <div
                className="relative rounded-lg overflow-hidden border border-border"
                style={{ backgroundColor: oceanColor }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    style={{ willChange: "opacity" }}
                  >
                    {renderMap(projection, true)}
                  </motion.div>
                </AnimatePresence>

                {/* Selected-country pill */}
                <AnimatePresence>
                  {selectedCountry && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="absolute top-2 left-2"
                    >
                      <div className="flex items-center gap-2 rounded-lg bg-card/90 backdrop-blur-sm border border-border px-3 py-1.5 shadow-md">
                        <div
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: getCountryColor(selectedCountry, mode) ?? "#6366F1" }}
                        />
                        <span className="text-sm font-semibold text-foreground">
                          {COUNTRY_NAMES[selectedCountry]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {selectedAuthors.length} authors
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Side panel: country chips (keyboard-friendly) → authors */}
              <div className="rounded-lg border border-border bg-card/95 flex flex-col min-h-[240px] max-h-[420px]">
                <div className="flex items-center gap-1.5 px-3 pt-3 pb-2 border-b border-border shrink-0">
                  <BookOpen className="size-3.5 text-indigo-500" />
                  <span className="text-xs font-semibold text-foreground">
                    {selectedCountry
                      ? `Authors in ${COUNTRY_NAMES[selectedCountry]}`
                      : isWorld
                        ? "Pick a country"
                        : `Countries in ${view}`}
                  </span>
                  {selectedCountry && (
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      {selectedAuthors.length}
                    </span>
                  )}
                </div>

                {selectedCountry ? (
                  <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 [scrollbar-width:thin]">
                    {selectedAuthors.map((author) => (
                      <div
                        key={author.name}
                        className="rounded-md bg-muted border border-border p-2.5"
                      >
                        <p className="text-xs font-semibold text-foreground">{author.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {formatYear(author.birthYear)} &ndash; {formatYear(author.deathYear)}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                          {author.oneLine}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-3 [scrollbar-width:thin]">
                    <div className="flex flex-wrap gap-1.5">
                      {viewCountryChips.map((iso3) => (
                        <button
                          key={iso3}
                          type="button"
                          onClick={() => selectCountry(iso3)}
                          className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-[#D4A04C] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {COUNTRY_NAMES[iso3]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DemoFrame>
        </BlurFade>
      </div>
    </section>
  )
}

function RegionButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:text-foreground hover:bg-accent",
      )}
    >
      {label}
    </button>
  )
}
