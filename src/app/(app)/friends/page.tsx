"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, UserPlus, Check, X, BookOpen, Flame, HeartHandshake } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  useFriendsData,
  type FriendProfile,
} from "@/hooks/use-friends-data"
import { cn } from "@/lib/utils"

export default function FriendsPage() {
  const {
    mode,
    friends,
    requests,
    suggested,
    searchProfiles,
    sendRequest,
    accept,
    decline,
  } = useFriendsData()

  const [tab, setTab] = useState<"friends" | "requests">("friends")
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<FriendProfile[] | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [pendingAdd, setPendingAdd] = useState<Set<string>>(new Set())

  // Debounced search. In demo mode the search hits the mock module
  // synchronously; in real mode it queries Supabase profiles by name.
  useEffect(() => {
    if (query.trim().length >= 2) {
      const timeout = setTimeout(async () => {
        const results = await searchProfiles(query)
        setSearchResults(results)
      }, 200)
      return () => clearTimeout(timeout)
    } else {
      setSearchResults(null)
    }
  }, [query, searchProfiles])

  async function handleAddFriend(userId: string) {
    setPendingAdd((s) => new Set(s).add(userId))
    try {
      await sendRequest(userId)
      // In demo mode the mock auto-accepts after 2s; in real mode the
      // recipient sees a notification and decides. Match each mode's wording.
      toast.success(mode === "demo" ? "Friend request accepted!" : "Request sent")
    } catch (err) {
      toast.error("Couldn't send friend request.")
      console.error(err)
    } finally {
      setPendingAdd((s) => {
        const n = new Set(s)
        n.delete(userId)
        return n
      })
    }
  }

  async function handleAccept(reqId: string) {
    await accept(reqId)
    toast.success("Friend request accepted!")
  }

  async function handleDecline(reqId: string) {
    await decline(reqId)
  }

  const displayList = searchResults ?? friends

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <BlurFade delay={0.04} inView>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <HeartHandshake className="size-6 shrink-0 text-foreground" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Friends
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">{friends.length} friends</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search friends..."
                className="h-8 pl-8 text-sm bg-muted/50 border-transparent focus-visible:border-[var(--tome-accent)]"
              />
            </div>
            <div className="relative">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs"
                onClick={() => setShowSuggestions(!showSuggestions)}
              >
                <UserPlus className="size-3.5" />
                Find friends
              </Button>
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border bg-card p-3 shadow-xl z-50"
                  >
                    <p className="text-[11px] text-muted-foreground mb-2 font-medium">Suggested readers</p>
                    <div className="space-y-2">
                      {suggested.map((p) => (
                        <div key={p.id} className="flex items-center gap-3">
                          <img src={p.avatarUrl} alt="" className="size-9 rounded-full border border-[#D4A04C]/20" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{p.displayName}</p>
                            <p className="text-[10px] text-muted-foreground">@{p.username}</p>
                          </div>
                          <Button
                            size="sm"
                            className="h-7 text-[10px] gap-1"
                            disabled={pendingAdd.has(p.id)}
                            onClick={() => handleAddFriend(p.id)}
                          >
                            {pendingAdd.has(p.id) ? "Adding..." : <><UserPlus className="size-3" /> Add</>}
                          </Button>
                        </div>
                      ))}
                      {suggested.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-3">No more suggestions</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-6">
        <button
          onClick={() => setTab("friends")}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
            tab === "friends" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          All Friends
        </button>
        <button
          onClick={() => setTab("requests")}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-medium transition-colors relative",
            tab === "requests" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          Requests
          {requests.length > 0 && (
            <span className="absolute -top-1 -right-1 size-4 rounded-full bg-[#D4A04C] text-[9px] font-bold text-[#1a1a2e] flex items-center justify-center">
              {requests.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      {tab === "friends" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayList.map((friend, i) => (
            <BlurFade key={friend.id} delay={0.03 * i} inView>
              <Link
                href={`/profile/${friend.username}`}
                className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-[var(--tome-accent)]/30 hover:shadow-sm"
              >
                <img
                  src={friend.avatarUrl}
                  alt={friend.displayName}
                  className="size-12 rounded-full border border-[#D4A04C]/20 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold group-hover:text-[var(--tome-accent)] transition-colors truncate">
                    {friend.displayName}
                  </p>
                  <p className="text-[10px] text-muted-foreground">@{friend.username}</p>
                  {friend.currentlyReading && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <BookOpen className="size-3 shrink-0" />
                      <span className="truncate">{friend.currentlyReading.bookTitle}</span>
                    </div>
                  )}
                  {friend.stats && (
                    <div className="mt-1 flex items-center gap-3 text-[9px] text-muted-foreground/70">
                      <span>{friend.stats.booksCompleted} books</span>
                      <span className="flex items-center gap-0.5"><Flame className="size-2.5" />{friend.stats.flames}</span>
                    </div>
                  )}
                </div>
              </Link>
            </BlurFade>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="size-12 rounded-full flex items-center justify-center text-lg font-serif font-bold mb-3" style={{ background: "rgba(212,160,76,0.1)", color: "#D4A04C" }}>
                V
              </div>
              <p className="text-sm text-muted-foreground">No pending requests</p>
            </div>
          ) : (
            requests.map((req) => (
              <BlurFade key={req.id} delay={0.05} inView>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                  <img src={req.from.avatarUrl} alt="" className="size-11 rounded-full border border-[#D4A04C]/20" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{req.from.displayName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      @{req.from.username}
                      {req.from.bio ? ` · ${req.from.bio}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button size="sm" className="h-7 text-[10px] gap-1" onClick={() => handleAccept(req.id)}>
                      <Check className="size-3" /> Accept
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => handleDecline(req.id)}>
                      <X className="size-3" />
                    </Button>
                  </div>
                </div>
              </BlurFade>
            ))
          )}
        </div>
      )}
    </div>
  )
}
