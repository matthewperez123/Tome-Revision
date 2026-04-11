#!/usr/bin/env node
/**
 * Fix author bios by properly parsing book data.
 * Uses a more robust extraction method.
 */

import fs from "fs"

const BOOKS_TS = fs.readFileSync("src/data/books.ts", "utf8")
const AC_PATH = "src/data/author-countries.ts"
let acContent = fs.readFileSync(AC_PATH, "utf8")

// More robust: extract each book block individually
const authorBooks = new Map()
// Split on book entry boundaries
const entries = BOOKS_TS.split(/\n  \{[\s\n]+id:/)
for (let i = 1; i < entries.length; i++) {
  const block = "id:" + entries[i].split(/\n  \},?\s*(?:\n  \{|\n\])/)[0]

  const idM = block.match(/^id:\s*"([^"]+)"/)
  const titleM = block.match(/title:\s*"([^"]+)"/)
  const authorM = block.match(/\bauthor:\s*"([^"]+)"/)
  const yearM = block.match(/year:\s*(-?\d+)/)
  const genreM = block.match(/genres:\s*\[([^\]]+)\]/)
  const countryM = block.match(/country:\s*"([^"]+)"/)

  if (!authorM || !titleM) continue

  const author = authorM[1]
  const title = titleM[1]

  if (!authorBooks.has(author)) authorBooks.set(author, [])
  authorBooks.get(author).push({
    id: idM?.[1] || "",
    title,
    year: yearM ? parseInt(yearM[1]) : null,
    genres: genreM ? genreM[1].replace(/"/g, "").split(",").map(g => g.trim()) : [],
    country: countryM?.[1] || "",
  })
}

// Verify some known authors
console.log("Walter Pater books:", authorBooks.get("Walter Pater")?.map(b => b.title))
console.log("Winston Churchill books:", authorBooks.get("Winston Churchill")?.map(b => b.title))
console.log("Homer books:", authorBooks.get("Homer")?.map(b => b.title))

// Genre → descriptor mapping
const GENRE_DESC = {
  "Novel": "novelist",
  "Novella": "novelist",
  "Short Stories": "short story writer",
  "Poetry": "poet",
  "Epic Poetry": "epic poet",
  "Lyric Poetry": "lyric poet",
  "Tragedy": "dramatist",
  "Drama": "dramatist",
  "Comedy": "comic dramatist",
  "Satire": "satirist",
  "Essay": "essayist",
  "Essays": "essayist",
  "Philosophy": "philosopher",
  "History": "historian",
  "Memoir": "memoirist",
  "Autobiography": "memoirist",
  "Political Philosophy": "political philosopher",
  "Science Fiction": "science fiction writer",
  "Fantasy": "fantasy writer",
  "Horror": "horror writer",
  "Gothic Fiction": "Gothic novelist",
  "Mystery": "mystery writer",
  "Detective Fiction": "mystery writer",
  "Adventure": "adventure novelist",
  "Historical Fiction": "historical novelist",
  "Romance": "novelist",
  "Fairy Tales": "folklorist",
  "Folklore": "folklorist",
  "Travel Writing": "travel writer",
  "Journalism": "journalist",
  "Criticism": "critic",
  "Literary Criticism": "literary critic",
  "Biography": "biographer",
  "Speeches": "orator",
  "Letters": "writer",
  "Theology": "theologian",
  "Religious Text": "religious writer",
  "Children's Literature": "children's author",
  "Fable": "fabulist",
  "Noh Drama": "dramatist",
  "Diary": "diarist",
  "Allegory": "allegorist",
  "Psychological Fiction": "novelist",
  "Social Commentary": "social critic",
  "War Literature": "war writer",
  "Nature Writing": "nature writer",
  "Rhetoric": "rhetorician",
  "Political Treatise": "political writer",
  "Correspondence": "letter writer",
  "Oratory": "orator",
  "Dialogues": "philosopher",
}

const DEMONYM = {
  "England": "English",
  "Scotland": "Scottish",
  "Ireland": "Irish",
  "France": "French",
  "Germany": "German",
  "Russia": "Russian",
  "USA": "American",
  "Italy": "Italian",
  "Spain": "Spanish",
  "Japan": "Japanese",
  "China": "Chinese",
  "India": "Indian",
  "Norway": "Norwegian",
  "Sweden": "Swedish",
  "Denmark": "Danish",
  "Poland": "Polish",
  "Austria": "Austrian",
  "Czech Republic": "Czech",
  "Hungary": "Hungarian",
  "Switzerland": "Swiss",
  "Portugal": "Portuguese",
  "Brazil": "Brazilian",
  "Argentina": "Argentine",
  "Canada": "Canadian",
  "Australia": "Australian",
  "New Zealand": "New Zealand",
  "South Africa": "South African",
  "Nigeria": "Nigerian",
  "Ghana": "Ghanaian",
  "Kenya": "Kenyan",
  "Egypt": "Egyptian",
  "Algeria": "Algerian",
  "Senegal": "Senegalese",
  "Jamaica": "Jamaican",
  "Colombia": "Colombian",
  "Chile": "Chilean",
  "Peru": "Peruvian",
  "Mexico": "Mexican",
  "Cuba": "Cuban",
  "Philippines": "Filipino",
  "Ancient Greece": "ancient Greek",
  "Ancient Rome": "Roman",
  "Roman Empire": "Roman",
  "Luxembourg": "Luxembourgish",
  "Ukraine": "Ukrainian",
  "Netherlands": "Dutch",
  "Belgium": "Belgian",
  "Finland": "Finnish",
  "Iceland": "Icelandic",
  "Iran": "Persian",
  "Persia": "Persian",
  "Lebanon": "Lebanese",
  "Turkey": "Turkish",
}

function generateBio(authorName, books) {
  const country = books[0].country
  const demonym = DEMONYM[country] || country

  const allGenres = books.flatMap(b => b.genres)
  const genreCounts = {}
  allGenres.forEach(g => { genreCounts[g] = (genreCounts[g] || 0) + 1 })
  const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const descriptor = GENRE_DESC[topGenre] || "writer"

  // Sort by year for most notable
  const sorted = [...books].sort((a, b) => (a.year || 9999) - (b.year || 9999))
  const notable = sorted[0]

  if (books.length === 1) {
    return `${demonym} ${descriptor} known for ${notable.title}.`
  } else {
    return `${demonym} ${descriptor} whose works include ${notable.title} and ${sorted[1].title}.`
  }
}

// Now find ALL oneLine entries in the auto-generated section and update them
// We need to match each author entry and update the bio
const autoGenMarker = "// ── Auto-generated from books.ts"
const autoGenIdx = acContent.indexOf(autoGenMarker)
if (autoGenIdx === -1) {
  console.error("Could not find auto-generated section")
  process.exit(1)
}

// Process only the auto-generated section
const before = acContent.substring(0, autoGenIdx)
let after = acContent.substring(autoGenIdx)

// Replace each oneLine in the auto-generated section
const entryRe = /name:\s*"([^"]+)",\s*\n\s*country:\s*"([^"]+)",\s*\n\s*oneLine:\s*"([^"]+)"/g
let updated = 0

after = after.replace(entryRe, (match, name, country, oldBio) => {
  const books = authorBooks.get(name)
  if (!books || books.length === 0) return match

  const bio = generateBio(name, books).replace(/"/g, '\\"')
  updated++
  return `name: "${name}",\n    country: "${country}",\n    oneLine: "${bio}"`
})

fs.writeFileSync(AC_PATH, before + after)
console.log(`Updated ${updated} author bios in auto-generated section`)
