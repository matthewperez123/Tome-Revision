/**
 * One-off link audit: validates static-data-driven navigation targets against
 * the actual data modules (books, authors, living-archive, stoa). Run with tsx.
 */
import { BOOKS } from "../src/data/books"
import { AUTHORS, authorSlug, getAuthorById } from "../src/data/authors"
import { TOME_LIVING_ARCHIVE_BOOKS } from "../src/data/living-archive"
import { STOA_COLLECTION } from "../src/data/stoa-collection"

const bookIds = new Set(BOOKS.map((b) => b.id))
const authorIds = new Set(AUTHORS.map((a) => a.id))

let problems = 0
const log = (s: string) => console.log(s)

// 1. Every book.authorId resolves to an author row
const danglingAuthorId = BOOKS.filter((b) => b.authorId && !authorIds.has(b.authorId))
log(`\n[1] books with authorId not in AUTHORS: ${danglingAuthorId.length}`)
danglingAuthorId.slice(0, 30).forEach((b) => log(`    ${b.id} -> authorId="${b.authorId}" (${b.author})`))
problems += danglingAuthorId.length

// 2. AuthorLink builds /author/${authorSlug(name)} from a display name.
//    The /author/[id] page resolves an id via getAuthorById(id) OR
//    deriveAuthorFromBooks(id), where derivation matches books on
//    authorIdFromName(book.author) === id. A link is only truly broken when
//    authorSlug(name) resolves via NEITHER path (else it redirects/derives).
// deriveAuthorFromBooks now uses authorSlug (same as AuthorLink), so model that.
const derivableIds = new Set(BOOKS.map((b) => authorSlug(b.author)))
const trulyBroken = new Map<string, { name: string; slug: string }>()
for (const b of BOOKS) {
  if (!b.author) continue
  const slug = authorSlug(b.author)
  const resolves = !!getAuthorById(slug) || derivableIds.has(slug)
  if (!resolves && !trulyBroken.has(slug)) trulyBroken.set(slug, { name: b.author, slug })
}
log(`\n[2] distinct book.author names whose /author/${"$"}{authorSlug(name)} resolves via NEITHER getAuthorById NOR deriveAuthorFromBooks (true 404→redirect): ${trulyBroken.size}`)
;[...trulyBroken.values()].slice(0, 80).forEach((m) => log(`    "${m.name}" -> /author/${m.slug}`))
problems += trulyBroken.size

// 3. Living-archive slugs used by StoaHero for /read/${slug} and /book/${slug}
const laDangling = TOME_LIVING_ARCHIVE_BOOKS.filter((b) => !bookIds.has(b.slug))
// 2b. Curated authors must be REACHED by authorSlug(name)/fullName (else the
//     link silently routes to a derived stub instead of the curated profile).
const curatedMiss = AUTHORS.filter((a: any) => {
  const candidates = [a.name, a.fullName].filter(Boolean).map((n: string) => authorSlug(n))
  return !candidates.includes(a.id)
})
log(`\n[2b] curated authors NOT reached by authorSlug(name|fullName) (link lands on derived stub, not curated page): ${curatedMiss.length}`)
curatedMiss.slice(0, 40).forEach((a: any) => log(`    id="${a.id}" name="${a.name}" -> authorSlug="${authorSlug(a.name)}"`))
problems += curatedMiss.length

log(`\n[3] living-archive slugs with no matching book id (StoaHero /read & /book): ${laDangling.length}`)
laDangling.slice(0, 30).forEach((b) => log(`    slug="${b.slug}"`))
problems += laDangling.length

// 4. Stoa unlockingBookId -> book id (PaintingCard /read, PaintingMetadata /read)
const stoaDangling = STOA_COLLECTION.filter((e: any) => e.unlockingBookId && !bookIds.has(e.unlockingBookId))
log(`\n[4] stoa entries whose unlockingBookId has no matching book id: ${stoaDangling.length}`)
stoaDangling.slice(0, 30).forEach((e: any) => log(`    ${e.id ?? e.title} -> unlockingBookId="${e.unlockingBookId}"`))
problems += stoaDangling.length

log(`\n==== TOTAL static-data problems: ${problems} ====`)
log(`(books=${BOOKS.length}, authors=${AUTHORS.length}, living-archive=${TOME_LIVING_ARCHIVE_BOOKS.length}, stoa=${STOA_COLLECTION.length})`)
