"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users, MessageSquare, BookOpen, Send, SmilePlus, ThumbsUp, Lightbulb, Heart, Flame,
  ChevronLeft, Calendar, Crown, Shield, UserMinus, Feather, Pin
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { springs } from "@/lib/design-tokens"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  getClub, getClubMembers, getClubDiscussions, getClubReadingPace,
  USER_CLUB_IDS, type ClubDiscussion
} from "@/lib/clubs-data"

const QUICK_EMOJIS: { id: string; icon: React.ReactNode }[] = [
  { id: "clap", icon: <ThumbsUp className="size-3.5" /> },
  { id: "idea", icon: <Lightbulb className="size-3.5" /> },
  { id: "love", icon: <Heart className="size-3.5" /> },
  { id: "fire", icon: <Flame className="size-3.5" /> },
  { id: "book", icon: <BookOpen className="size-3.5" /> },
]

export default function ClubDetailPage() {
  const params = useParams()
  const clubId = params.clubId as string

  // Try Supabase first, fall back to demo
  const demoClub = getClub(clubId)
  const demoMembers = getClubMembers(clubId)
  const demoDiscussions = getClubDiscussions(clubId)
  const readingPace = getClubReadingPace(clubId)
  const isMember = USER_CLUB_IDS.includes(clubId)

  const [discussions, setDiscussions] = useState<ClubDiscussion[]>(demoDiscussions)
  const [newMessage, setNewMessage] = useState("")
  const [joined, setJoined] = useState(isMember)

  const club = demoClub

  const handleSend = useCallback(() => {
    if (!newMessage.trim()) return
    const newDisc: ClubDiscussion = {
      id: `cd-new-${Date.now()}`,
      clubId,
      authorId: "you",
      authorName: "You",
      avatarColor: "var(--tome-accent)",
      parentId: null,
      anchorQuote: null,
      anchorUnit: null,
      body: newMessage.trim(),
      createdAt: new Date().toISOString(),
      isPinned: false,
      isVirgil: false,
      reactions: [],
    }
    setDiscussions(prev => [newDisc, ...prev.filter(d => !d.isPinned), ...prev.filter(d => d.isPinned)].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }))
    setNewMessage("")
  }, [newMessage, clubId])

  const handleAskVirgil = () => {
    const virgilPost: ClubDiscussion = {
      id: `cd-virgil-${Date.now()}`,
      clubId,
      authorId: "virgil",
      authorName: "Virgil",
      avatarColor: "#D4A04C",
      parentId: null,
      anchorQuote: null,
      anchorUnit: null,
      body: "**Virgil's Response**\n\nGreat question! Let me offer some context from the broader literary tradition. The themes you're discussing connect to fundamental questions about human nature that writers have explored for millennia. Consider how this passage reflects the cultural values of its time while also speaking to universal experiences.\n\nI'd encourage everyone to look closely at the specific language choices the author makes here — they reveal much about the intended meaning.",
      createdAt: new Date().toISOString(),
      isPinned: true,
      isVirgil: true,
      reactions: [{ emoji: "idea", count: 1 }],
    }
    setDiscussions(prev => [virgilPost, ...prev])
  }

  if (!club) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-sm text-muted-foreground">Club not found</p>
        <Link href="/clubs" className="text-xs text-muted-foreground hover:text-foreground">← Back to clubs</Link>
      </div>
    )
  }

  const roleIcons: Record<string, React.ReactNode> = {
    owner: <Crown className="size-3 text-amber-500" />,
    moderator: <Shield className="size-3 text-indigo-500" />,
    member: null,
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="shrink-0 border-b border-border p-4 md:p-6">
        <Link href="/clubs" className="mb-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-3.5" /> Back to clubs
        </Link>
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: club.coverColor }}>
            <BookOpen className="size-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-serif font-semibold tracking-tight">{club.name}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {club.bookTitle ?? club.theme} · {club.memberCount} members
            </p>
          </div>
          <Button
            variant={joined ? "outline" : "default"}
            size="sm"
            onClick={() => setJoined(!joined)}
          >
            {joined ? "Leave" : "Join"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs defaultValue="discussions" className="flex-1 flex flex-col overflow-hidden">
          <div className="shrink-0 px-4 pt-2">
            <TabsList>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="reading-pace">Reading Pace</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
          </div>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {discussions.map((disc, i) => (
                <motion.div
                  key={disc.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springs.gentle, delay: Math.min(i, 10) * 0.03 }}
                  className={cn("flex gap-3", disc.isPinned && "bg-amber-50/50 dark:bg-amber-950/10 rounded-lg p-2 -m-2 border border-amber-200/30")}
                >
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-white mt-0.5" style={{ backgroundColor: disc.avatarColor }}>
                    {disc.isVirgil ? "V" : disc.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{disc.authorName}</span>
                      {disc.isVirgil && <Badge variant="outline" className="text-[8px] border-amber-300 text-amber-600">AI Tutor</Badge>}
                      {disc.isPinned && <Pin className="size-2.5 text-amber-500" />}
                      <span className="text-[9px] text-muted-foreground">{formatTime(disc.createdAt)}</span>
                    </div>
                    {disc.anchorQuote && (
                      <blockquote className="border-l-2 border-muted pl-2 mt-1 text-[11px] text-muted-foreground italic">"{disc.anchorQuote}" — {disc.anchorUnit}</blockquote>
                    )}
                    <div className="text-sm text-foreground/90 mt-1 leading-relaxed whitespace-pre-line">{disc.body}</div>
                    {disc.reactions.length > 0 && (
                      <div className="flex gap-1 mt-1.5">
                        {disc.reactions.map((r, ri) => (
                          <span key={ri} className="inline-flex items-center gap-0.5 rounded-full border bg-muted px-1.5 py-0.5 text-[10px]">
                            {r.emoji} <span className="text-muted-foreground tabular-nums">{r.count}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {discussions.length === 0 && (
                <div className="flex flex-col items-center py-16 text-center">
                  <MessageSquare className="size-8 text-muted-foreground/20 mb-3" />
                  <p className="text-sm text-muted-foreground">No discussions yet. Start the conversation!</p>
                </div>
              )}
            </div>
            {/* Input + Virgil */}
            <div className="shrink-0 border-t border-border p-3">
              <div className="flex gap-2">
                <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Share your thoughts…" className="flex-1 h-9 text-sm" onKeyDown={(e) => { if (e.key === "Enter" && newMessage.trim()) handleSend() }} />
                <Button size="sm" variant="outline" onClick={handleAskVirgil} className="gap-1 text-xs shrink-0">
                  <Feather className="size-3" /> Ask Virgil
                </Button>
                <Button size="icon-sm" disabled={!newMessage.trim()} onClick={handleSend}>
                  <Send className="size-3.5" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {demoMembers.map(member => (
                <div key={member.id} className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: member.avatarColor }}>
                    {member.username.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.username}</p>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      {roleIcons[member.role]}
                      <span className="text-[10px] text-muted-foreground capitalize">{member.role}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Joined {new Date(member.joinedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                </div>
              ))}
            </div>
            {demoMembers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No members yet</p>
            )}
          </TabsContent>

          {/* Reading Pace Tab */}
          <TabsContent value="reading-pace" className="flex-1 overflow-y-auto p-4">
            {readingPace.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="size-8 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No reading schedule set</p>
                <p className="text-xs text-muted-foreground mt-1">Club owners can create a shared reading pace</p>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Shared Reading Schedule</h3>
                {readingPace.map(rp => {
                  const isPast = new Date(rp.targetDate) < new Date()
                  return (
                    <div key={rp.id} className={cn("rounded-xl border bg-card p-4", isPast && rp.groupProgress === 100 && "border-green-200 dark:border-green-800")}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">{rp.unit}</p>
                        <span className={cn("text-[10px]", isPast ? "text-muted-foreground" : "text-foreground")}>{new Date(rp.targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>
                      {rp.notes && <p className="text-xs text-muted-foreground mb-2">{rp.notes}</p>}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${rp.groupProgress}%`, backgroundColor: rp.groupProgress === 100 ? "#22C55E" : "var(--tome-accent)" }} />
                        </div>
                        <span className="text-xs text-muted-foreground w-10 text-right">{rp.groupProgress}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="flex-1 overflow-y-auto p-4">
            <div className="max-w-lg space-y-6">
              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Description</h3>
                <p className="text-sm leading-relaxed">{club.description}</p>
              </div>
              {club.bookTitle && (
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Book</h3>
                  <p className="text-sm">{club.bookTitle}</p>
                </div>
              )}
              {club.theme && (
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Theme</h3>
                  <p className="text-sm">{club.theme}</p>
                </div>
              )}
              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Club Rules</h3>
                <p className="text-sm leading-relaxed">{club.rules || "No specific rules set."}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">Created</span>
                  <p>{new Date(club.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Visibility</span>
                  <p className="capitalize">{club.visibility.replace("_", " ")}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Max Members</span>
                  <p>{club.maxMembers}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Members</span>
                  <p>{club.memberCount}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
