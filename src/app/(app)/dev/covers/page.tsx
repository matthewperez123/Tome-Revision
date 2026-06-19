import Link from "next/link"
import { ArrowUpRight, Palette } from "lucide-react"
import { BOOKS } from "@/data/books"
import { getTomeGeneratedCoverPaths } from "@/data/generated/tome-generated-cover-paths"
import { ClassicsCover } from "@/components/tome/ClassicsCover"

const COVER_TEST_IDS = [
  "don-quixote",
  "the-divine-comedy",
  "the-odyssey",
  "the-iliad",
  "macbeth",
  "frankenstein",
  "moby-dick",
  "pride-and-prejudice",
  "hamlet",
  "jane-eyre",
  "wuthering-heights",
  "dracula",
  "the-count-of-monte-cristo",
  "treasure-island",
  "alices-adventures-in-wonderland",
  "the-great-gatsby",
  "war-and-peace",
  "anna-karenina",
  "crime-and-punishment",
  "les-miserables",
  "a-tale-of-two-cities",
  "a-christmas-carol",
  "middlemarch",
  "great-expectations",
  "oliver-twist",
  "the-time-machine",
  "the-war-of-the-worlds",
  "the-origin-of-species",
  "the-republic",
  "meditations",
  "the-aeneid",
  "beowulf",
  "the-canterbury-tales",
  "le-morte-darthur",
  "paradise-lost",
  "the-tempest",
  "the-faerie-queene",
  "orlando-furioso",
  "don-juan",
  "gullivers-travels",
  "candide",
  "heart-of-darkness",
  "the-art-of-war",
  "the-call-of-the-wild",
  "a-dolls-house",
  "the-secret-garden",
  "siddhartha",
  "the-picture-of-dorian-gray",
]

export default function DevCoversPage() {
  const books = COVER_TEST_IDS
    .map((id) => BOOKS.find((book) => book.id === id))
    .filter((book): book is NonNullable<typeof book> => Boolean(book))

  const generatedCount = books.filter((book) => getTomeGeneratedCoverPaths(book.id)).length

  return (
    <main className="min-h-full bg-[var(--tome-bg)]">
      <section className="border-b border-border bg-[var(--tome-surface-elevated)] px-5 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--tome-accent)]">
              <Palette className="size-3.5" />
              Monumental Literary Paths
            </div>
            <h1 className="font-serif text-2xl font-semibold text-foreground">
              Cover System Review
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {generatedCount} generated covers in this test set, rendered through Tome&apos;s live cover component.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/covers/tome/generated/review-sheet.jpg"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              Review sheet
              <ArrowUpRight className="size-3.5" />
            </Link>
            <Link
              href="/art-factory/generated/monumental-literary-paths-v1/review-sheet.jpg"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              Source sheet
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {books.map((book) => {
            const generated = getTomeGeneratedCoverPaths(book.id)

            return (
              <article
                key={book.id}
                className="rounded-md border border-border bg-[var(--tome-surface-elevated)] p-2 shadow-sm"
              >
                <ClassicsCover
                  bookId={book.id}
                  title={book.title}
                  author={book.author}
                  tradition={book.tradition}
                  fallbackColors={book.coverColors}
                  hideBand={false}
                  showTomeWordmark={false}
                  className="w-full"
                />
                <div className="mt-2 min-h-14">
                  <p className="line-clamp-2 text-xs font-semibold leading-snug text-foreground">
                    {book.title}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {book.author}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {generated ? "Generated" : "Fallback"}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
