"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Brain,
  Check,
  Globe,
  Lock,
  Mail,
  Plus,
  Search,
  Users,
  UsersRound,
} from "lucide-react"
import { toast } from "sonner"
import { BlurFade } from "@/components/ui/blur-fade"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  useStudyGroups,
  type StudyGroupSummary,
} from "@/hooks/use-study-groups"
import {
  createGroup,
  joinGroup,
  joinGroupByCode,
  type GroupPrivacy,
} from "@/lib/actions/groups"
import { getBooks } from "@/lib/content"

const LAPIS = "#2A4B8D"

function privacyIcon(p: GroupPrivacy) {
  if (p === "public") return <Globe className="size-3" />
  if (p === "invite") return <Mail className="size-3" />
  return <Lock className="size-3" />
}

export default function StudyGroupsPage() {
  const router = useRouter()
  const groups = useStudyGroups()
  const [search, setSearch] = useState("")

  const filteredDiscover = groups.discover.filter((g) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      g.name.toLowerCase().includes(q) ||
      (g.description ?? "").toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen pb-20">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex items-center gap-2.5">
          <UsersRound className="size-6 shrink-0 text-foreground" />
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Study Groups
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Set shared goals, take Trials together, and keep collaborative
              notes.
            </p>
          </div>
        </div>

        {groups.mode === "demo" ? (
          <EmptyState
            title="Sign in to join study groups"
            body="Track shared study goals, climb a group Trials leaderboard, and write notes together."
          />
        ) : (
          <Tabs defaultValue="discover">
            <TabsList>
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="my-groups">My Groups</TabsTrigger>
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
                    placeholder="Search groups…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8 w-full rounded-md border bg-background pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {groups.loading ? (
                  <GroupGridSkeleton />
                ) : filteredDiscover.length === 0 ? (
                  <EmptyState
                    title="No public study groups yet"
                    body="Be the first — start a group around a book or exam you're preparing for."
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredDiscover.map((group, i) => (
                      <BlurFade key={group.id} delay={0.04 * i} inView>
                        <DiscoverCard
                          group={group}
                          onJoined={() => groups.refresh()}
                        />
                      </BlurFade>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ── My Groups ── */}
            <TabsContent value="my-groups">
              <div className="space-y-3 pt-4">
                {groups.loading ? (
                  <GroupGridSkeleton />
                ) : groups.myGroups.length === 0 ? (
                  <EmptyState
                    title="You haven't joined any groups yet"
                    body="Explore the Discover tab or create your own."
                  />
                ) : (
                  groups.myGroups.map((group) => (
                    <Link key={group.id} href={`/study-groups/${group.id}`}>
                      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/20">
                        <div
                          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-white"
                          style={{ backgroundColor: LAPIS }}
                        >
                          <Brain className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {group.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {group.memberCount} members
                          </p>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-[9px]">
                          {group.privacy}
                        </Badge>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </TabsContent>

            {/* ── Create ── */}
            <TabsContent value="create">
              <CreateGroupForm
                onCreated={(id) => {
                  groups.refresh()
                  router.push(`/study-groups/${id}`)
                }}
              />
            </TabsContent>

            {/* ── Join by code ── */}
            <TabsContent value="join">
              <JoinByCodeForm
                onJoined={(id) => {
                  groups.refresh()
                  router.push(`/study-groups/${id}`)
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
  group,
  onJoined,
}: {
  group: StudyGroupSummary
  onJoined: () => void
}) {
  const [joining, setJoining] = useState(false)
  const full =
    group.memberLimit !== null && group.memberCount >= group.memberLimit

  async function handleJoin() {
    setJoining(true)
    const r = await joinGroup(group.id)
    setJoining(false)
    if (r.ok) {
      toast.success(`Joined ${group.name}`)
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
          style={{ backgroundColor: LAPIS }}
        >
          <Brain className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/study-groups/${group.id}`}
              className="truncate text-sm font-semibold hover:underline"
            >
              {group.name}
            </Link>
            {privacyIcon(group.privacy)}
          </div>
          <p className="mt-0.5 line-clamp-2 text-[10px] text-muted-foreground">
            {group.description ?? "No description yet."}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Users className="size-3" />
          {group.memberCount}
          {group.memberLimit !== null && `/${group.memberLimit}`}
        </span>
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

function CreateGroupForm({ onCreated }: { onCreated: (id: string) => void }) {
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
      kind: "study_group",
      name: name.trim(),
      description: description.trim() || undefined,
      bookId: bookId || undefined,
      privacy,
      memberLimit: memberLimit ? Number(memberLimit) : undefined,
    })
    setPending(false)
    if (r.ok) {
      toast.success("Study group created")
      onCreated(r.data.id)
    } else {
      toast.error(r.error ?? "Could not create group.")
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4 pt-6">
      <Field label="Group name *">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Odyssey Exam Prep"
          className="h-8 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </Field>
      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What are you studying together?"
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
          <option value="">No book (theme group)</option>
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
            <Plus className="size-3.5" /> Create group
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
      toast.success("Joined the group")
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
        {pending ? "Joining…" : "Join group"}
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

function GroupGridSkeleton() {
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
      <UsersRound className="size-6 text-muted-foreground/40" />
      <p className="text-sm font-medium">{title}</p>
      <p className="max-w-xs text-xs text-muted-foreground">{body}</p>
    </div>
  )
}
