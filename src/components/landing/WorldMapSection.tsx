"use client"

import { useMemo } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps"
import { BlurFade } from "@/components/ui/blur-fade"
import { getCountriesWithAuthors } from "@/data/author-countries"
import { getCountryColor } from "@/lib/country-colors"

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

const TRADITION_TAGS = [
  { name: "Ancient Greek", color: "#6366F1" },
  { name: "Roman", color: "#8B5CF6" },
  { name: "French", color: "#4F46E5" },
  { name: "Russian", color: "#B91C1C" },
  { name: "English", color: "#059669" },
  { name: "American", color: "#2563EB" },
  { name: "Sanskrit", color: "#D97706" },
  { name: "Chinese", color: "#DC2626" },
  { name: "Japanese", color: "#DB2777" },
  { name: "Persian", color: "#7C3AED" },
  { name: "Arabic", color: "#0284C7" },
  { name: "German", color: "#65A30D" },
]

export function WorldMapSection() {
  const countriesWithAuthors = useMemo(() => new Set(getCountriesWithAuthors()), [])

  return (
    <section className="bg-[#0A0A0A] py-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <BlurFade delay={0.1} inView>
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-center text-[#FAF7F2] mb-4">
            36 traditions. Every continent. 3,000 years.
          </h2>
        </BlurFade>

        {/* Map */}
        <BlurFade delay={0.2} inView>
          <div className="mt-8 rounded-xl overflow-hidden bg-[#0F0E1A] border border-[rgba(255,255,255,0.06)]">
            <ComposableMap
              projection="geoEqualEarth"
              projectionConfig={{ scale: 155, center: [0, 20] }}
              width={800}
              height={400}
              style={{ width: "100%", height: "auto" }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const iso3 = resolveISO3(geo as { id?: string; properties: Record<string, unknown> })
                    const isActive = countriesWithAuthors.has(iso3)
                    const fill = isActive
                      ? (getCountryColor(iso3, "dark") ?? "#D4AF37")
                      : "#1A1A2E"

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        className="outline-none"
                        style={{
                          default: {
                            fill,
                            stroke: "#2A2A3E",
                            strokeWidth: 0.4,
                            outline: "none",
                            transition: "fill 300ms ease",
                          },
                          hover: {
                            fill: isActive ? "#D4AF37" : "#1A1A2E",
                            stroke: "#2A2A3E",
                            strokeWidth: 0.4,
                            outline: "none",
                          },
                          pressed: {
                            fill,
                            stroke: "#2A2A3E",
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
          </div>
        </BlurFade>

        {/* Tradition tags */}
        <BlurFade delay={0.3} inView>
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {TRADITION_TAGS.map((tag) => (
              <div
                key={tag.name}
                className="flex items-center gap-1.5 rounded-full bg-[#161616] border border-[rgba(255,255,255,0.06)] px-3 py-1.5"
              >
                <div
                  className="size-2 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="text-xs text-[#C4BFB6]">{tag.name}</span>
              </div>
            ))}
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
