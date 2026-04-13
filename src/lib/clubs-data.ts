// ── Extended Book Club Demo Data ──

export interface ClubDetail {
  id: string
  name: string
  description: string
  bookId: string | null
  bookTitle: string | null
  theme: string | null
  visibility: "public" | "private" | "invite_only"
  maxMembers: number
  memberCount: number
  coverColor: string
  createdBy: string
  createdAt: string
  rules: string
}

export interface ClubMember {
  id: string
  clubId: string
  userId: string
  username: string
  avatarColor: string
  role: "owner" | "moderator" | "member"
  joinedAt: string
}

export interface ClubDiscussion {
  id: string
  clubId: string
  authorId: string
  authorName: string
  avatarColor: string
  parentId: string | null
  anchorQuote: string | null
  anchorUnit: string | null
  body: string
  createdAt: string
  isPinned: boolean
  isVirgil: boolean
  reactions: { emoji: string; count: number }[]
}

export interface ClubReadingPace {
  id: string
  clubId: string
  unit: string
  targetDate: string
  notes: string
  groupProgress: number
}

// ── Demo Clubs ──

export const DEMO_CLUBS: ClubDetail[] = [
  { id: "club-1", name: "The Odyssey Circle", description: "A deep-dive reading group for Homer's epic. We discuss themes of homecoming, heroism, and the ancient Greek worldview. All experience levels welcome.", bookId: "the-odyssey", bookTitle: "The Odyssey", theme: null, visibility: "public", maxMembers: 50, memberCount: 23, coverColor: "#0EA5E9", createdBy: "user-1", createdAt: "2026-01-20", rules: "Be respectful. Spoiler warnings for chapters ahead of the pace. One post per thread per day." },
  { id: "club-2", name: "Stoic Readers", description: "Exploring Marcus Aurelius, Seneca, and Epictetus. We read one meditation per week and discuss how ancient philosophy applies to modern life.", bookId: "meditations", bookTitle: "Meditations", theme: "Stoic Philosophy", visibility: "public", maxMembers: 30, memberCount: 15, coverColor: "#6366F1", createdBy: "user-2", createdAt: "2026-02-05", rules: "Stay on topic. Practice the virtues we read about." },
  { id: "club-3", name: "Victorian Lit Society", description: "From Dickens to the Brontës, we explore the rich world of Victorian literature together.", bookId: null, bookTitle: null, theme: "Victorian Literature", visibility: "public", maxMembers: 40, memberCount: 31, coverColor: "#A855F7", createdBy: "user-3", createdAt: "2026-01-10", rules: "All Victorian works welcome. No gatekeeping on reading pace." },
  { id: "club-4", name: "AP Lit Study Circle", description: "Collaborative reading group for AP Literature students preparing for the exam.", bookId: "pride-and-prejudice", bookTitle: "Pride and Prejudice", theme: null, visibility: "invite_only", maxMembers: 20, memberCount: 12, coverColor: "#F43F5E", createdBy: "user-4", createdAt: "2026-03-01", rules: "Members only. Exam-focused discussions encouraged." },
  { id: "club-5", name: "World Myths & Epics", description: "Comparing myths across cultures — Greek, Norse, Eastern, and beyond. Currently reading the Iliad alongside the Mahabharata.", bookId: null, bookTitle: null, theme: "Comparative Mythology", visibility: "public", maxMembers: 50, memberCount: 38, coverColor: "#FB923C", createdBy: "user-5", createdAt: "2025-12-15", rules: "Respect all cultural traditions. Comparative analysis encouraged." },
  { id: "club-6", name: "Russian Novel Marathon", description: "Tackling the great Russian novels one at a time. Currently on Crime and Punishment.", bookId: "crime-and-punishment", bookTitle: "Crime and Punishment", theme: "Russian Literature", visibility: "public", maxMembers: 25, memberCount: 19, coverColor: "#3B82F6", createdBy: "user-6", createdAt: "2026-02-20", rules: "One chapter per week. Discussion posts due by Sunday." },
]

export const DEMO_CLUB_MEMBERS: ClubMember[] = [
  // Odyssey Circle members
  { id: "cm-1", clubId: "club-1", userId: "user-1", username: "Emma Chen", avatarColor: "#4F46E5", role: "owner", joinedAt: "2026-01-20" },
  { id: "cm-2", clubId: "club-1", userId: "user-2", username: "Marcus Williams", avatarColor: "#0D9488", role: "moderator", joinedAt: "2026-01-21" },
  { id: "cm-3", clubId: "club-1", userId: "user-3", username: "Sofia Rodriguez", avatarColor: "#D4A04C", role: "member", joinedAt: "2026-01-22" },
  { id: "cm-4", clubId: "club-1", userId: "user-4", username: "Liam Foster", avatarColor: "#16A34A", role: "member", joinedAt: "2026-01-25" },
  { id: "cm-5", clubId: "club-1", userId: "user-5", username: "Aisha Patel", avatarColor: "#7C3AED", role: "member", joinedAt: "2026-02-01" },
  // Stoic Readers members
  { id: "cm-6", clubId: "club-2", userId: "user-2", username: "Marcus Williams", avatarColor: "#0D9488", role: "owner", joinedAt: "2026-02-05" },
  { id: "cm-7", clubId: "club-2", userId: "user-3", username: "Sofia Rodriguez", avatarColor: "#D4A04C", role: "member", joinedAt: "2026-02-06" },
  { id: "cm-8", clubId: "club-2", userId: "user-6", username: "James O'Brien", avatarColor: "#EA580C", role: "member", joinedAt: "2026-02-10" },
  // Victorian Lit members
  { id: "cm-9", clubId: "club-3", userId: "user-3", username: "Sofia Rodriguez", avatarColor: "#D4A04C", role: "owner", joinedAt: "2026-01-10" },
  { id: "cm-10", clubId: "club-3", userId: "user-1", username: "Emma Chen", avatarColor: "#4F46E5", role: "member", joinedAt: "2026-01-12" },
]

export const DEMO_CLUB_DISCUSSIONS: ClubDiscussion[] = [
  { id: "cd-1", clubId: "club-1", authorId: "user-1", authorName: "Emma Chen", avatarColor: "#4F46E5", parentId: null, anchorQuote: "Tell me, O Muse, of that ingenious hero who travelled far and wide...", anchorUnit: "Book 1", body: "The opening invocation sets up the entire poem's themes. Odysseus is described as \"ingenious\" — his defining trait isn't strength but **metis** (cunning intelligence). How does this compare to Achilles in the Iliad?", createdAt: "2026-04-10T14:00:00Z", isPinned: false, isVirgil: false, reactions: [{ emoji: "clap", count: 5 }, { emoji: "idea", count: 3 }] },
  { id: "cd-2", clubId: "club-1", authorId: "user-2", authorName: "Marcus Williams", avatarColor: "#0D9488", parentId: "cd-1", anchorQuote: null, anchorUnit: null, body: "Great point! Achilles is defined by **bie** (brute strength) while Odysseus by **metis**. The Odyssey is really about a different kind of heroism — one that values survival and adaptability over glory in battle.", createdAt: "2026-04-10T14:30:00Z", isPinned: false, isVirgil: false, reactions: [{ emoji: "idea", count: 4 }] },
  { id: "cd-3", clubId: "club-1", authorId: "user-3", authorName: "Sofia Rodriguez", avatarColor: "#D4A04C", parentId: null, anchorQuote: "My name is Nobody", anchorUnit: "Book 9", body: "The Polyphemus episode is my favorite part of the entire epic. Odysseus's trick with the name \"Nobody\" is the perfect example of his cunning — but his hubris in revealing his real name afterward is what brings Poseidon's curse. His greatest strength is also his fatal flaw.", createdAt: "2026-04-09T10:00:00Z", isPinned: false, isVirgil: false, reactions: [{ emoji: "fire", count: 7 }, { emoji: "book", count: 2 }] },
  { id: "cd-v1", clubId: "club-1", authorId: "virgil", authorName: "Virgil", avatarColor: "#D4A04C", parentId: null, anchorQuote: null, anchorUnit: null, body: "**Virgil's Response** 🪶\n\nExcellent discussion on metis vs. bie! The ancient Greeks distinguished between two types of excellence: the raw power of warriors like Achilles and the practical wisdom of figures like Odysseus. In the Odyssey, Homer argues that **adaptability and endurance** are more valuable than sheer force — a revolutionary idea in a warrior culture.\n\nConsider how this maps onto modern values: we tend to celebrate the \"self-made\" person who overcomes obstacles through cleverness rather than the strongest competitor. Homer was ahead of his time.", createdAt: "2026-04-10T15:00:00Z", isPinned: true, isVirgil: true, reactions: [{ emoji: "idea", count: 12 }, { emoji: "love", count: 8 }] },
  // Stoic Readers
  { id: "cd-4", clubId: "club-2", authorId: "user-2", authorName: "Marcus Williams", avatarColor: "#0D9488", parentId: null, anchorQuote: "Begin the morning by saying to thyself, I shall meet with the busybody, the ungrateful, arrogant, deceitful...", anchorUnit: "Book II", body: "This passage is basically ancient CBT (Cognitive Behavioral Therapy). Marcus is practicing **negative visualization** — preparing for difficult people so he won't be caught off guard. Anyone else find this surprisingly practical?", createdAt: "2026-04-08T09:00:00Z", isPinned: false, isVirgil: false, reactions: [{ emoji: "idea", count: 6 }] },
]

export const DEMO_CLUB_READING_PACE: ClubReadingPace[] = [
  { id: "rp-1", clubId: "club-1", unit: "Books 1–4", targetDate: "2026-03-15", notes: "Telemachy — Telemachus's journey", groupProgress: 100 },
  { id: "rp-2", clubId: "club-1", unit: "Books 5–8", targetDate: "2026-03-29", notes: "Odysseus leaves Calypso, arrives at Phaeacia", groupProgress: 100 },
  { id: "rp-3", clubId: "club-1", unit: "Books 9–12", targetDate: "2026-04-12", notes: "The great wanderings — Cyclops, Circe, Underworld", groupProgress: 72 },
  { id: "rp-4", clubId: "club-1", unit: "Books 13–16", targetDate: "2026-04-26", notes: "Return to Ithaca, reunion with Telemachus", groupProgress: 0 },
  { id: "rp-5", clubId: "club-1", unit: "Books 17–20", targetDate: "2026-05-10", notes: "Odysseus in disguise among the suitors", groupProgress: 0 },
  { id: "rp-6", clubId: "club-1", unit: "Books 21–24", targetDate: "2026-05-24", notes: "The bow, the slaughter, reunion with Penelope", groupProgress: 0 },
  // Stoic Readers
  { id: "rp-7", clubId: "club-2", unit: "Books I–III", targetDate: "2026-03-01", notes: "Foundations of Stoic practice", groupProgress: 100 },
  { id: "rp-8", clubId: "club-2", unit: "Books IV–VI", targetDate: "2026-04-01", notes: "Dealing with others, impermanence", groupProgress: 60 },
]

// ── User's joined clubs (for "My Clubs" tab) ──
export const USER_CLUB_IDS = ["club-1", "club-2"]

// ── Helpers ──

export function getClubs() { return DEMO_CLUBS }
export function getClub(id: string) { return DEMO_CLUBS.find(c => c.id === id) ?? null }
export function getUserClubs() { return DEMO_CLUBS.filter(c => USER_CLUB_IDS.includes(c.id)) }
export function getClubMembers(clubId: string) { return DEMO_CLUB_MEMBERS.filter(m => m.clubId === clubId) }
export function getClubDiscussions(clubId: string) { return DEMO_CLUB_DISCUSSIONS.filter(d => d.clubId === clubId).sort((a, b) => { if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1; return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() }) }
export function getClubReadingPace(clubId: string) { return DEMO_CLUB_READING_PACE.filter(r => r.clubId === clubId).sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()) }
export function getDiscoverClubs() { return DEMO_CLUBS.filter(c => c.visibility === "public") }
