#!/usr/bin/env node
/**
 * Generate real one-line bios for authors that currently have placeholder
 * "Author from X." bios in author-countries.ts.
 *
 * Uses book data (title, year, genres) to craft meaningful bios.
 */

import fs from "fs"

const BOOKS_TS = fs.readFileSync("src/data/books.ts", "utf8")
const AC_PATH = "src/data/author-countries.ts"
let acContent = fs.readFileSync(AC_PATH, "utf8")

// Build author → books map from books.ts
const authorBooks = new Map()
const bookRe = /\{\s*\n\s*id:\s*"([^"]+)",\s*\n\s*title:\s*"([^"]+)",\s*\n\s*author:\s*"([^"]+)",/g
let m
while ((m = bookRe.exec(BOOKS_TS))) {
  const [, id, title, author] = m
  // Get year, genres, country for this book
  const after = BOOKS_TS.substring(m.index, m.index + 3000)
  const yearMatch = after.match(/year:\s*(-?\d+)/)
  const genreMatch = after.match(/genres:\s*\[([^\]]+)\]/)
  const countryMatch = after.match(/country:\s*"([^"]+)"/)

  if (!authorBooks.has(author)) authorBooks.set(author, [])
  authorBooks.get(author).push({
    id, title,
    year: yearMatch ? parseInt(yearMatch[1]) : null,
    genres: genreMatch ? genreMatch[1].replace(/"/g, "").split(",").map(g => g.trim()) : [],
    country: countryMatch?.[1] || "",
  })
}

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
}

// Country demonym mapping
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

  // Get primary genre descriptor
  const allGenres = books.flatMap(b => b.genres)
  const genreCounts = {}
  allGenres.forEach(g => { genreCounts[g] = (genreCounts[g] || 0) + 1 })
  const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const descriptor = GENRE_DESC[topGenre] || "writer"

  // Get most notable book (prefer earlier works, or the one with shortest title)
  const notable = books.sort((a, b) => {
    // Prefer books with years
    if (a.year && !b.year) return -1
    if (!a.year && b.year) return 1
    return (a.year || 0) - (b.year || 0)
  })[0]

  const bookCount = books.length

  // Build bio
  if (bookCount === 1) {
    return `${demonym} ${descriptor} known for ${notable.title}.`
  } else {
    const other = books[1]
    return `${demonym} ${descriptor} whose works include ${notable.title} and ${other.title}.`
  }
}

// Find and replace generic bios
const genericRe = /oneLine:\s*"Author from [^"]+\."/g
let count = 0
let lastIdx = 0
let result = ""

while ((m = genericRe.exec(acContent))) {
  // Find the author name for this entry — look backwards for name: "..."
  const before = acContent.substring(Math.max(0, m.index - 200), m.index)
  const nameMatch = before.match(/name:\s*"([^"]+)"/)
  if (!nameMatch) continue

  const authorName = nameMatch[1]
  const books = authorBooks.get(authorName)

  if (!books || books.length === 0) {
    // No books found — keep generic but improve it
    continue
  }

  const bio = generateBio(authorName, books)
  const safeBio = bio.replace(/"/g, '\\"')

  result += acContent.substring(lastIdx, m.index) + `oneLine: "${safeBio}"`
  lastIdx = m.index + m[0].length
  count++
}

result += acContent.substring(lastIdx)

fs.writeFileSync(AC_PATH, result)
console.log(`Updated ${count} author bios`)
