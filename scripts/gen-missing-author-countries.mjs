#!/usr/bin/env node
/**
 * Generate AUTHOR_COUNTRIES entries for authors in BOOKS that are missing
 * from author-countries.ts. Uses the country field from books.ts to determine
 * the ISO-3 country code.
 */

import fs from "fs"

const BOOKS_TS = fs.readFileSync("src/data/books.ts", "utf8")
const AC_TS = fs.readFileSync("src/data/author-countries.ts", "utf8")

// Country name → ISO-3 mapping
const COUNTRY_TO_ISO3 = {
  "England": "GBR",
  "United Kingdom": "GBR",
  "Scotland": "GBR",
  "Wales": "GBR",
  "Ireland": "IRL",
  "France": "FRA",
  "Germany": "DEU",
  "Austria": "AUT",
  "Switzerland": "CHE",
  "Italy": "ITA",
  "Spain": "ESP",
  "Portugal": "PRT",
  "Netherlands": "NLD",
  "Belgium": "BEL",
  "Denmark": "DNK",
  "Norway": "NOR",
  "Sweden": "SWE",
  "Finland": "FIN",
  "Iceland": "ISL",
  "Russia": "RUS",
  "Poland": "POL",
  "Czech Republic": "CZE",
  "Hungary": "HUN",
  "Romania": "ROU",
  "Bulgaria": "BGR",
  "Serbia": "SRB",
  "Croatia": "HRV",
  "Greece": "GRC",
  "Turkey": "TUR",
  "USA": "USA",
  "United States": "USA",
  "Canada": "CAN",
  "Mexico": "MEX",
  "Brazil": "BRA",
  "Argentina": "ARG",
  "Colombia": "COL",
  "Chile": "CHL",
  "Peru": "PER",
  "Cuba": "CUB",
  "Jamaica": "JAM",
  "Trinidad and Tobago": "TTO",
  "Haiti": "HTI",
  "Barbados": "BRB",
  "Japan": "JPN",
  "China": "CHN",
  "India": "IND",
  "Pakistan": "PAK",
  "Bangladesh": "BGD",
  "Sri Lanka": "LKA",
  "South Korea": "KOR",
  "Vietnam": "VNM",
  "Philippines": "PHL",
  "Indonesia": "IDN",
  "Malaysia": "MYS",
  "Thailand": "THA",
  "Iran": "IRN",
  "Persia": "IRN",
  "Iraq": "IRQ",
  "Egypt": "EGY",
  "Morocco": "MAR",
  "Algeria": "DZA",
  "Tunisia": "TUN",
  "Libya": "LBY",
  "Nigeria": "NGA",
  "South Africa": "ZAF",
  "Kenya": "KEN",
  "Ghana": "GHA",
  "Ethiopia": "ETH",
  "Tanzania": "TZA",
  "Uganda": "UGA",
  "Senegal": "SEN",
  "Australia": "AUS",
  "New Zealand": "NZL",
  "Ancient Greece": "GRC",
  "Ancient Rome": "ITA",
  "Judea": "ISR",
  "Israel": "ISR",
  "Lebanon": "LBN",
  "Arabia": "SAU",
  "Ottoman Empire": "TUR",
  "Prussia": "DEU",
  "Bohemia": "CZE",
  "Saxony": "DEU",
  "Bavaria": "DEU",
  "Flanders": "BEL",
  "British India": "IND",
  "Dutch East Indies": "IDN",
  "Dominican Republic": "DOM",
  "Puerto Rico": "PRI",
  "Guatemala": "GTM",
  "Nicaragua": "NIC",
  "Uruguay": "URY",
  "Paraguay": "PRY",
  "Venezuela": "VEN",
  "Ecuador": "ECU",
  "Bolivia": "BOL",
  "Costa Rica": "CRI",
  "Panama": "PAN",
  "Honduras": "HND",
  "El Salvador": "SLV",
  "Martinique": "MTQ",
  "Guadeloupe": "GLP",
  "Soviet Union": "RUS",
  "Ukraine": "UKR",
  "Georgia": "GEO",
  "Armenia": "ARM",
  "Latvia": "LVA",
  "Lithuania": "LTU",
  "Estonia": "EST",
  "Wales": "GBR",
}

// Extract existing author keys
const existingAuthors = new Set()
const keyRe = /^\s+(?:"([^"]+)"|([A-Z\u00C0-\u024F][\w\s.'\u00C0-\u024F-]+?)):\s*\{/gm
let m
while ((m = keyRe.exec(AC_TS))) existingAuthors.add((m[1] || m[2]).trim())

// Extract authors + countries from BOOKS
const authorData = new Map()
const bookRe = /\{\s*\n\s*id:\s*"([^"]+)",\s*\n\s*title:\s*"([^"]+)",\s*\n\s*author:\s*"([^"]+)",/g
while ((m = bookRe.exec(BOOKS_TS))) {
  const [, , , author] = m
  if (!authorData.has(author)) {
    // Find country for this author
    const afterAuthor = BOOKS_TS.substring(m.index, m.index + 2000)
    const countryMatch = afterAuthor.match(/country:\s*"([^"]+)"/)
    authorData.set(author, { country: countryMatch?.[1] || "Unknown" })
  }
}

// Generate missing entries
const missing = []
for (const [author, data] of authorData) {
  if (!existingAuthors.has(author)) {
    const iso3 = COUNTRY_TO_ISO3[data.country] || "UNK"
    missing.push({ author, country: data.country, iso3 })
  }
}

console.log(`Missing authors: ${missing.length}`)

// Generate TS code
const lines = []
for (const { author, country, iso3 } of missing.sort((a, b) => a.author.localeCompare(b.author))) {
  const safeName = author.replace(/"/g, '\\"')
  const needsQuote = /[^a-zA-Z\u00C0-\u024F\s]/.test(author) || /^\d/.test(author)
  const key = needsQuote ? `"${safeName}"` : author.replace(/\s+/g, ' ')
  // Need to quote keys with spaces too
  const finalKey = key.includes(' ') || key.includes("'") || key.includes('-') || key.includes('.') || key.includes('&') ? `"${safeName}"` : key

  lines.push(`  ${finalKey}: {
    name: "${safeName}",
    country: "${iso3}",
    oneLine: "Author from ${country}.",
  },`)
}

// Find insertion point — before the closing brace of AUTHOR_COUNTRIES
const insertBefore = "\n}\n"
const insertIdx = AC_TS.lastIndexOf(insertBefore)
if (insertIdx === -1) {
  console.error("Could not find closing brace")
  process.exit(1)
}

const newContent = AC_TS.substring(0, insertIdx) +
  "\n  // ── Auto-generated from books.ts ────────────────────────────────────────\n" +
  lines.join("\n") + "\n" +
  AC_TS.substring(insertIdx)

fs.writeFileSync("src/data/author-countries.ts", newContent)
console.log(`Added ${lines.length} author entries to author-countries.ts`)

// Also report any with UNK
const unknowns = missing.filter(m => m.iso3 === "UNK")
if (unknowns.length > 0) {
  console.log(`\nWARNING: ${unknowns.length} authors with unknown country mapping:`)
  unknowns.forEach(u => console.log(`  ${u.author} (${u.country})`))
}
