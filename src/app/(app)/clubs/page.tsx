"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookHeart,
  BookOpen,
  Check,
  Globe,
  Lock,
  Mail,
  Plus,
  Search,
  Users,
} from "lucide-react"
import { toast } from "sonner"
import { BlurFade } from "@/components/ui/blur-fade"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useClubs, type ClubSummary } from "@/hooks/use-clubs"
import {
  createGroup,
  joinGroup,
  joinGroupByCode,
  type GroupPrivacy,
} from "@/lib/actions/groups"
import { getBooks } from "@/lib/content"
import { cn } from "@/lib/utils"

const LAPIS = "#2A4B8D"

function privacyIcon(p: GroupPrivacy) {
  if (p === "public") return <Globe className="size-3" />
  if (p === "invite") return <Mail className="size-3" />
  return <Lock className="size-3" />
}

export default function ClubsPage() {
  const router = useRouter()
  const clubs = useClubs()
  const [search, setSearch] = useState("")

  const filteredDiscover = clubs.discover.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      (c.description ?? "").toLowerCase().includes(q) ||
      (c.bookTitle ?? "").toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen pb-20">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex items-center gap-2.5">
          <BookHeart className="size-6 shrink-0 text-foreground" />
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Book Clubs
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Join a club and read together.
            </p>
          </div>
        </div>

        {clubs.mode === "demo" ? (
          <EmptyState
            title="Sign in to join book clubs"
            body="Read alongside others, follow a shared schedule, and discuss chapter by chapter."
          />
        ) : (
          <Tabs defaultValue="discover">
            <TabsList>
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="my-clubs">My Clubs</TabsTrigger>
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="join">Join by Code</TabsTrigger>
            </TabsList>

            {/* ── Discover ── */}
            <TabsContent value="discover">
              <div className="space-y-4 pt-4">
                <div className="relative max-w-sm">
                  <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search clubs…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8 w-full rounded-md border bg-background pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {clubs.loading ? (
                  <ClubGridSkeleton />
                ) : filteredDiscover.length === 0 ? (
                  <EmptyState
                    title="No public clubs yet"
                    body="Be the first — create a club around a book you love."
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredDiscover.map((club, i) => (
                      <BlurFade key={club.id} delay={0.04 * i} inView>
                        <DiscoverCard
                          club={club}
                          onJoined={() => clubs.refresh()}
                        />
                      </BlurFade>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ── My Clubs ── */}
            <TabsContent value="my-clubs">
              <div className="space-y-3 pt-4">
                {clubs.loading ? (
                  <ClubGridSkeleton />
                ) : clubs.myClubs.length === 0 ? (
                  <EmptyState
                    title="You haven't joined any clubs yet"
                    body="Explore the Discover tab or create your own."
                  />
                ) : (
                  clubs.myClubs.map((club) => (
                    <Link key={club.id} href={`/clubs/${club.id}`}>
                      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/20">
                        <div
                          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-white"
                          style={{ backgroundColor: club.cover ?? LAPIS }}
                        >
                          <BookOpen className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {club.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {club.bookTitle ?? "No book set"} · {club.memberCount}{" "}
                            members
                          </p>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-[9px]">
                          {club.privacy}
                        </Badge>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </TabsContent>

            {/* ── Create ── */}
            <TabsContent value="create">
              <CreateClubForm
                onCreated={(id) => {
                  clubs.refresh()
                  router.push(`/clubs/${id}`)
                }}
              />
            </TabsContent>

            {/* ── Join by code ── */}
            <TabsContent value="join">
              <JoinByCodeForm
                onJoined={(id) => {
                  clubs.refresh()
                  router.push(`/clubs/${id}`)
                }}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

function DiscoverCard({
  club,
  onJoined,
}: {
  club: ClubSummary
  onJoined: () => void
}) {
  const [joining, setJoining] = useState(false)
  const full =
    club.memberLimit !== null && club.memberCount >= club.memberLimit

  async function handleJoin() {
    setJoining(true)
    const r = await joinGroup(club.id)
    setJoining(false)
    if (r.ok) {
      toast.success(`Joined ${club.name}`)
      onJoined()
    } else {
      toast.error(r.error ?? "Could not join.")
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex gap-3">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ backgroundColor: club.cover ?? LAPIS }}
        >
          <BookOpen className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/clubs/${club.id}`}
              className="truncate text-sm font-semibold hover:underline"
            >
              {club.name}
            </Link>
            {privacyIcon(club.privacy)}
          </div>
          <p className="mt-0.5 line-clamp-2 text-[10px] text-muted-foreground">
            {club.description ?? "No description yet."}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Users className="size-3" />
            {club.memberCount}
            {club.memberLimit !== null && `/${club.memberLimit}`}
          </span>
          {club.bookTitle && (
            <Badge variant="outline" className="text-[8px]">
              {club.bookTitle}
            </Badge>
          )}
        </div>
        <button
          type="button"
          onClick={handleJoin}
          disabled={joining || full}
          className="rounded-full bg-foreground px-3 py-1 text-[11px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {full ? "Full" : joining ? "Joining…" : "Join"}
        </button>
      </div>
    </div>
  )
}

function CreateClubForm({ onCreated }: { onCreated: (id: string) => void }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [bookId, setBookId] = useState("")
  const [privacy, setPrivacy] = useState<GroupPrivacy>("public")
  const [memberLimit, setMemberLimit] = useState("")
  const [pending, setPending] = useState(false)

  // Book picker sourced from the real catalog.
  const books = getBooks().slice(0, 400)

  async function handleCreate() {
    setPending(true)
    const r = await createGroup({
      kind: "book_club",
      name: name.trim(),
      description: description.trim() || undefined,
      bookId: bookId || undefined,
      privacy,
      memberLimit: memberLimit ? Number(memberLimit) : undefined,
    })
    setPending(false)
    if (r.ok) {
      toast.success("Club created")
      onCreated(r.data.id)
    } else {
      toast.error(r.error ?? "Could not create club.")
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4 pt-6">
      <Field label="Club name *">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. The Odyssey Circle"
          className="h-8 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </Field>
      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's your club about?"
          rows={3}
          className="min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </Field>
      <Field label="Book">
        <select
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          className="h-8 w-full rounded-md border bg-background px-2 text-xs"
        >
          <option value="">No book (theme club)</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} — {b.author}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Privacy">
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value as GroupPrivacy)}
            className="h-8 w-full rounded-md border bg-background px-2 text-xs"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="invite">Invite only</option>
          </select>
        </Field>
        <Field label="Max members">
          <input
            type="number"
            value={memberLimit}
            onChange={(e) => setMemberLimit(e.target.value)}
            min={2}
            placeholder="No limit"
            className="h-8 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>
      </div>
      <button
        type="button"
        onClick={handleCreate}
        disabled={!name.trim() || pending}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
      >
        {pending ? (
          <>
            <Check className="size-3.5" /> Creating…
          </>
        ) : (
          <>
            <Plus className="size-3.5" /> Create club
          </>
        )}
      </button>
    </div>
  )
}

function JoinByCodeForm({ onJoined }: { onJoined: (id: string) => void }) {
  const [code, setCode] = useState("")
  const [pending, setPending] = useState(false)

  async function handleJoin() {
    setPending(true)
    const r = await joinGroupByCode(code.trim())
    setPending(false)
    if (r.ok) {
      toast.success("Joined the club")
      onJoined(r.data.groupId)
    } else {
      toast.error(r.error ?? "Could not join.")
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4 pt-6">
      <Field label="Invite code">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="XXXX-XXXX"
          className="h-9 w-full rounded-md border bg-background px-3 text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </Field>
      <button
        type="button"
        onClick={handleJoin}
        disabled={!code.trim() || pending}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
      >
        {pending ? "Joining…" : "Join club"}
      </button>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  )
}

function ClubGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-xl border border-border bg-muted/30"
        />
      ))}
    </div>
  )
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-12 text-center">
      <BookHeart className="size-6 text-muted-foreground/40" />
      <p className="text-sm font-medium">{title}</p>
      <p className="max-w-xs text-xs text-muted-foreground">{body}</p>
    </div>
  )
}
