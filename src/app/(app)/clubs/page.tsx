"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Users, Plus, BookOpen, Search, Globe, Lock, Mail, BookHeart, Check } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { springs } from "@/lib/design-tokens"
import { BlurFade } from "@/components/ui/blur-fade"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { getClubs, getUserClubs, getDiscoverClubs, type ClubDetail } from "@/lib/clubs-data"

export default function ClubsPage() {
  const [clubs, setClubs] = useState<ClubDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "book" | "theme" | "popular">("all")

  // Create club form state
  const [createName, setCreateName] = useState("")
  const [createDesc, setCreateDesc] = useState("")
  const [createBook, setCreateBook] = useState("")
  const [createVisibility, setCreateVisibility] = useState("public")
  const [createMax, setCreateMax] = useState(50)
  const [created, setCreated] = useState(false)

  useEffect(() => {
    async function fetchClubs() {
      const { data } = await supabase
        .from("book_clubs")
        .select("*")
        .order("member_count", { ascending: false })
      if (data && data.length > 0) {
        setClubs(data.map((c: any) => ({
          id: c.id, name: c.name, description: c.description ?? "", bookId: null, bookTitle: null,
          theme: null, visibility: "public" as const, maxMembers: 50, memberCount: c.member_count,
          coverColor: c.cover_color, createdBy: "", createdAt: "", rules: ""
        })))
      } else {
        // Fallback to demo data
        setClubs(getClubs())
      }
      setLoading(false)
    }
    fetchClubs()
  }, [])

  const discoverClubs = getDiscoverClubs()
  const userClubs = getUserClubs()

  const filteredDiscover = discoverClubs.filter(c => {
    if (search) {
      const q = search.toLowerCase()
      if (!c.name.toLowerCase().includes(q) && !(c.description ?? "").toLowerCase().includes(q)) return false
    }
    if (filter === "book") return !!c.bookId
    if (filter === "theme") return !!c.theme && !c.bookId
    if (filter === "popular") return c.memberCount >= 20
    return true
  })

  const handleCreate = () => {
    setCreated(true)
    setTimeout(() => { setCreated(false); setCreateName(""); setCreateDesc(""); setCreateBook(""); setCreateVisibility("public"); setCreateMax(50) }, 1500)
  }

  const visibilityIcon = (v: string) => v === "public" ? <Globe className="size-3" /> : v === "private" ? <Lock className="size-3" /> : <Mail className="size-3" />

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Book Clubs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Join a club and read together.</p>
        </div>

        <Tabs defaultValue="discover">
        <TabsList>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="my-clubs">My Clubs</TabsTrigger>
          <TabsTrigger value="create">Create a Club</TabsTrigger>
        </TabsList>

        {/* ── Discover Tab ── */}
        <TabsContent value="discover">
          <div className="space-y-4 pt-4">
            {/* Featured carousel */}
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
              {discoverClubs.slice(0, 3).map(club => (
                <Link key={club.id} href={`/clubs/${club.id}`} className="shrink-0 w-64 snap-start">
                  <div className="rounded-xl border border-border overflow-hidden hover:bg-accent/20 transition-colors">
                    <div className="h-20 flex items-center justify-center" style={{ backgroundColor: club.coverColor }}>
                      <BookHeart className="size-8 text-white/80" />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold truncate">{club.name}</h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{club.memberCount} members · {club.bookTitle ?? club.theme}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Search + filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input type="text" placeholder="Search clubs..." value={search} onChange={e => setSearch(e.target.value)} className="w-full h-8 rounded-md border bg-background pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex gap-1 p-1 bg-muted rounded-lg">
                {(["all", "book", "theme", "popular"] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={cn("px-2.5 py-1 rounded-md text-xs font-medium transition-colors capitalize", filter === f ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                    {f === "all" ? "All" : f === "book" ? "Book-based" : f === "theme" ? "Theme-based" : "Popular"}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDiscover.map((club, i) => (
                <BlurFade key={club.id} delay={0.05 * i} inView>
                  <Link href={`/clubs/${club.id}`}>
                    <motion.div whileHover={{ scale: 1.02 }} transition={springs.interactive} className="flex gap-4 rounded-xl border border-border bg-card p-4 cursor-pointer transition-colors hover:bg-accent/20 motion-reduce:hover:scale-100">
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: club.coverColor }}>
                        <BookOpen className="size-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-semibold truncate">{club.name}</h3>
                          {visibilityIcon(club.visibility)}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{club.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Users className="size-3" />{club.memberCount}</span>
                          {club.bookTitle && <Badge variant="outline" className="text-[8px]">{club.bookTitle}</Badge>}
                          {club.theme && !club.bookTitle && <Badge variant="secondary" className="text-[8px]">{club.theme}</Badge>}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </BlurFade>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ── My Clubs Tab ── */}
        <TabsContent value="my-clubs">
          <div className="space-y-3 pt-4">
            {userClubs.length === 0 ? (
              <div className="text-center py-12">
                <BookHeart className="size-10 text-muted-foreground/20 mx-auto" />
                <p className="text-sm text-muted-foreground mt-3">You haven't joined any clubs yet</p>
                <p className="text-xs text-muted-foreground mt-1">Explore the Discover tab to find clubs</p>
              </div>
            ) : (
              userClubs.map(club => (
                <Link key={club.id} href={`/clubs/${club.id}`}>
                  <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:bg-accent/20 transition-colors">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg text-white" style={{ backgroundColor: club.coverColor }}>
                      <BookOpen className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{club.name}</p>
                      <p className="text-[10px] text-muted-foreground">{club.bookTitle ?? club.theme} · {club.memberCount} members</p>
                    </div>
                    <Badge variant="outline" className="text-[9px] shrink-0">Active</Badge>
                  </div>
                </Link>
              ))
            )}
          </div>
        </TabsContent>

        {/* ── Create Tab ── */}
        <TabsContent value="create">
          <div className="max-w-md mx-auto pt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Club Name *</label>
              <input type="text" value={createName} onChange={e => setCreateName(e.target.value)} placeholder="e.g. The Odyssey Circle" className="w-full h-8 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
              <textarea value={createDesc} onChange={e => setCreateDesc(e.target.value)} placeholder="What's your club about?" className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]" rows={3} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Book or Theme</label>
              <input type="text" value={createBook} onChange={e => setCreateBook(e.target.value)} placeholder="e.g. The Odyssey or Victorian Literature" className="w-full h-8 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Visibility</label>
                <select value={createVisibility} onChange={e => setCreateVisibility(e.target.value)} className="w-full h-8 rounded-md border bg-background px-2 text-xs">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="invite_only">Invite Only</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Max Members</label>
                <input type="number" value={createMax} onChange={e => setCreateMax(Number(e.target.value))} min={2} max={100} className="w-full h-8 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <button
              onClick={handleCreate}
              disabled={!createName || created}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity disabled:pointer-events-none disabled:opacity-50"
            >
              {created ? <><Check className="size-3.5" /> Club Created!</> : <><Plus className="size-3.5" /> Create Club</>}
            </button>
          </div>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
