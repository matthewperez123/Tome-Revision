"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  Search, Mail, Phone, Send, Plus, X, ChevronDown,
  MessageSquare, UserCircle, Paperclip, Check, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  getParents, getParent, getMessagesForParent, getDraftMessages,
  getLastMessageDate, MESSAGE_TEMPLATES, MESSAGE_TYPE_STYLES,
  type ParentContact, type ParentMessage, type MessageType
} from "@/lib/classroom-parents"
import { DEMO_STUDENT_DETAILS } from "@/lib/classroom-students"

export default function ParentsPage() {
  const searchParams = useSearchParams()
  const initialParentId = searchParams.get("parent")
  const initialStudentFilter = searchParams.get("student")

  const allParents = getParents()
  const drafts = getDraftMessages()
  const [selectedParentId, setSelectedParentId] = useState<string | null>(initialParentId)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "unread" | "no_recent">("all")
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set())
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showBulkConfirm, setShowBulkConfirm] = useState(false)
  const [showCompose, setShowCompose] = useState(false)

  // Filter parents
  const filtered = useMemo(() => {
    let result = allParents
    if (initialStudentFilter) {
      result = result.filter(p => p.linkedStudents.some(ls => ls.studentId === initialStudentFilter))
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        p.linkedStudents.some(ls => ls.studentName.toLowerCase().includes(q))
      )
    }
    if (filter === "no_recent") {
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      result = result.filter(p => {
        const last = getLastMessageDate(p.id)
        return !last || new Date(last) < twoWeeksAgo
      })
    }
    return result
  }, [allParents, search, filter, initialStudentFilter])

  const selectedParent = selectedParentId ? getParent(selectedParentId) : null
  const selectedMessages = selectedParentId ? getMessagesForParent(selectedParentId) : []

  const toggleBulkSelect = (id: string) => {
    setBulkSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {/* ── Left Column — Parent List ── */}
      <div className="w-[360px] shrink-0 border-r border-border flex flex-col bg-background">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-lg font-serif font-bold">Parents</h1>
              <p className="text-[10px] text-muted-foreground">Keep parents in the loop.</p>
            </div>
            <Button size="sm" onClick={() => setShowAddDialog(true)} className="gap-1.5">
              <Plus className="size-3.5" /> Add
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search parents or students..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-8 rounded-md border bg-background pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Filter chips */}
          <div className="flex gap-1 mt-2">
            {(["all", "unread", "no_recent"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors", filter === f ? "bg-[var(--tome-accent)] text-[#111]" : "bg-muted text-muted-foreground hover:text-foreground")}>
                {f === "all" ? "All" : f === "unread" ? "Has unread" : "No recent contact"}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk actions */}
        {bulkSelected.size > 0 && (
          <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{bulkSelected.size} selected</span>
            <Button size="sm" variant="outline" className="ml-auto text-xs gap-1" onClick={() => {
              if (bulkSelected.size > 10) setShowBulkConfirm(true)
              else setShowCompose(true)
            }}>
              <Send className="size-3" /> Send to selected
            </Button>
            <Button size="sm" variant="ghost" className="text-xs" onClick={() => setBulkSelected(new Set())}>Clear</Button>
          </div>
        )}

        {/* Draft messages */}
        {drafts.length > 0 && (
          <div className="px-4 py-2 border-b border-border">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Draft Messages</p>
            {drafts.map(d => {
              const parent = getParent(d.parentId)
              return (
                <button key={d.id} onClick={() => { setSelectedParentId(d.parentId); setShowCompose(true) }} className="flex items-center gap-2 w-full rounded-lg px-2 py-1.5 text-left hover:bg-muted/50 transition-colors">
                  <Badge variant="outline" className="text-[8px] border-amber-300 text-amber-600 shrink-0">Draft</Badge>
                  <span className="text-xs truncate">{d.subject}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Parent list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map(p => {
            const lastDate = getLastMessageDate(p.id)
            const isSelected = selectedParentId === p.id
            return (
              <div key={p.id} className={cn("flex items-start gap-2 px-4 py-3 border-b border-border cursor-pointer transition-colors", isSelected ? "bg-muted" : "hover:bg-muted/30")}>
                <input
                  type="checkbox"
                  checked={bulkSelected.has(p.id)}
                  onChange={() => toggleBulkSelect(p.id)}
                  className="mt-1 size-3 rounded border-border accent-[var(--tome-accent)]"
                  onClick={e => e.stopPropagation()}
                />
                <div className="flex-1 min-w-0" onClick={() => setSelectedParentId(p.id)}>
                  <p className="text-sm font-medium">{p.firstName} {p.lastName}</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {p.linkedStudents.map(ls => (
                      <span key={ls.studentId} className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">{ls.studentName}</span>
                    ))}
                  </div>
                  {lastDate && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Last: {new Date(lastDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0 mt-0.5">
                  {p.preferredContact === "email" && <Mail className="size-3 text-muted-foreground" />}
                  {p.preferredContact === "sms" && <Phone className="size-3 text-muted-foreground" />}
                  {p.preferredContact === "both" && <><Mail className="size-3 text-muted-foreground" /><Phone className="size-3 text-muted-foreground" /></>}
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <UserCircle className="size-8 text-muted-foreground/30 mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">No parents found</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Right Column — Messaging Panel ── */}
      <div className="flex-1 flex flex-col bg-background">
        {!selectedParent ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <MessageSquare className="size-10 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">Select a parent to message</p>
          </div>
        ) : (
          <>
            {/* Parent header */}
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-serif font-bold">{selectedParent.firstName} {selectedParent.lastName}</h2>
                  <p className="text-xs text-muted-foreground">{selectedParent.email}{selectedParent.phone ? ` · ${selectedParent.phone}` : ""}</p>
                  <div className="flex gap-1 mt-1">
                    {selectedParent.linkedStudents.map(ls => (
                      <Link key={ls.studentId} href={`/teacher/students/${ls.studentId}`}>
                        <Badge variant="outline" className="text-[9px] hover:bg-muted cursor-pointer">{ls.studentName} ({ls.relationship})</Badge>
                      </Link>
                    ))}
                  </div>
                </div>
                <Button onClick={() => setShowCompose(true)} className="gap-1.5">
                  <Send className="size-3.5" /> Compose
                </Button>
              </div>
            </div>

            {/* Message history */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {selectedMessages.filter(m => !m.isDraft).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No messages sent yet</p>
              ) : (
                selectedMessages.filter(m => !m.isDraft).map(m => {
                  const typeStyle = MESSAGE_TYPE_STYLES[m.messageType]
                  return (
                    <div key={m.id} className="rounded-xl border bg-card p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-medium", typeStyle.bg, typeStyle.text)}>{typeStyle.label}</span>
                        <span className="text-xs font-medium flex-1">{m.subject}</span>
                        <span className="text-[10px] text-muted-foreground">{new Date(m.sentAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                      </div>
                      {m.studentName && <p className="text-[10px] text-muted-foreground mb-2">Re: {m.studentName}</p>}
                      <div className="text-sm whitespace-pre-line">{m.body}</div>
                      {m.attachments.length > 0 && (
                        <div className="flex gap-1.5 mt-3">
                          {m.attachments.map((att, i) => (
                            <span key={i} className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[10px]">
                              <Paperclip className="size-2.5" /> {att.label}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-3 pt-2 border-t border-border">
                        <span className={cn("text-[10px]", m.deliveryStatus === "delivered" ? "text-green-600" : m.deliveryStatus === "failed" ? "text-red-600" : "text-muted-foreground")}>
                          {m.deliveryStatus === "delivered" ? "✓ Delivered" : m.deliveryStatus === "sent" ? "Sent" : m.deliveryStatus === "failed" ? "✗ Failed" : "Queued"}
                        </span>
                        {m.readAt && <span className="text-[10px] text-green-600">Read {new Date(m.readAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Compose Dialog ── */}
      <ComposeDialog
        open={showCompose}
        onClose={() => setShowCompose(false)}
        prefilledParent={selectedParent}
        bulkParents={bulkSelected.size > 0 ? [...bulkSelected].map(id => getParent(id)).filter(Boolean) as ParentContact[] : undefined}
      />

      {/* ── Add Parent Dialog ── */}
      <AddParentDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} />

      {/* ── Bulk Confirm Dialog ── */}
      <Dialog open={showBulkConfirm} onOpenChange={setShowBulkConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send to {bulkSelected.size} parents?</DialogTitle>
            <DialogDescription>You're about to send a message to {bulkSelected.size} parents. This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowBulkConfirm(false)}>Cancel</Button>
            <Button onClick={() => { setShowBulkConfirm(false); setShowCompose(true) }}>Continue</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ── Compose Message Dialog ──

function ComposeDialog({ open, onClose, prefilledParent, bulkParents }: {
  open: boolean
  onClose: () => void
  prefilledParent: ParentContact | null
  bulkParents?: ParentContact[]
}) {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [messageType, setMessageType] = useState<MessageType>("general")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [sent, setSent] = useState(false)

  const recipients = bulkParents ?? (prefilledParent ? [prefilledParent] : [])

  const applyTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    const tmpl = MESSAGE_TEMPLATES.find(t => t.id === templateId)
    if (tmpl) {
      setSubject(tmpl.subjectTemplate)
      setBody(tmpl.bodyTemplate)
      setMessageType(tmpl.type)
    }
  }

  const handleSend = () => {
    setSent(true)
    setTimeout(() => { setSent(false); onClose(); setSubject(""); setBody(""); setMessageType("general"); setSelectedTemplate("") }, 1500)
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Compose Message</DialogTitle>
          <DialogDescription>Send a message to {recipients.length === 1 ? `${recipients[0].firstName} ${recipients[0].lastName}` : `${recipients.length} parents`}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {/* To */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">To</label>
            <div className="flex flex-wrap gap-1">
              {recipients.map(p => (
                <span key={p.id} className="rounded-full bg-muted px-2.5 py-0.5 text-xs">{p.firstName} {p.lastName}</span>
              ))}
            </div>
          </div>

          {/* Template */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Template</label>
            <select value={selectedTemplate} onChange={e => applyTemplate(e.target.value)} className="w-full h-8 rounded-md border bg-background px-2 text-xs">
              <option value="">Choose a template...</option>
              {MESSAGE_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          {/* Message type */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label>
            <div className="flex gap-1">
              {(Object.keys(MESSAGE_TYPE_STYLES) as MessageType[]).map(type => {
                const style = MESSAGE_TYPE_STYLES[type]
                return (
                  <button key={type} onClick={() => setMessageType(type)} className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors", messageType === type ? `${style.bg} ${style.text}` : "bg-muted text-muted-foreground hover:text-foreground")}>
                    {style.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Message subject..."
              className="w-full h-8 rounded-md border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Body */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Body <span className="text-muted-foreground/50">(supports **bold**, *italic*, - lists)</span></label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your message..."
              className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[120px]"
              rows={6}
            />
          </div>

          {/* Send */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSend} disabled={!subject || !body || sent} className="gap-1.5">
              {sent ? <><Check className="size-3.5" /> Sent!</> : <><Send className="size-3.5" /> Send</>}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Add Parent Dialog ──

function AddParentDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [preferredContact, setPreferredContact] = useState("email")
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => { setSaved(false); onClose(); setFirstName(""); setLastName(""); setEmail(""); setPhone("") }, 1200)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Parent Contact</DialogTitle>
          <DialogDescription>Add a parent or guardian contact for your students.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">First Name *</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full h-8 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Last Name *</label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full h-8 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Email *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-8 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full h-8 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Preferred Contact</label>
            <select value={preferredContact} onChange={e => setPreferredContact(e.target.value)} className="w-full h-8 rounded-md border bg-background px-2 text-xs">
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Link to Students</label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {DEMO_STUDENT_DETAILS.map(s => (
                <label key={s.id} className="flex items-center gap-2 py-0.5 cursor-pointer">
                  <input type="checkbox" className="size-3 rounded border-border accent-[var(--tome-accent)]" />
                  <span className="text-xs">{s.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={!firstName || !lastName || !email || saved} className="gap-1.5">
              {saved ? <><Check className="size-3.5" /> Saved!</> : "Save Contact"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
