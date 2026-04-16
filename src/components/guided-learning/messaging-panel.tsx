"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Send, Feather, Bell, Megaphone, Award, Info, ChevronDown, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MessageType, SessionMessage, ParticipantWithProfile } from "@/lib/guided-learning-types"

const MESSAGE_TYPES: { value: MessageType; label: string; icon: typeof Feather }[] = [
  { value: "hint", label: "Hint", icon: Feather },
  { value: "nudge", label: "Nudge", icon: Bell },
  { value: "announcement", label: "Announcement", icon: Megaphone },
  { value: "praise", label: "Praise", icon: Award },
  { value: "instruction", label: "Instruction", icon: Info },
]

const QUICK_TEMPLATES = [
  "Take your time on this passage.",
  "Remember to consider the historical context.",
  "Five minutes left on this station.",
  "Excellent work.",
  "Reread the previous paragraph carefully.",
  "Focus on the key themes here.",
  "Almost there — keep going.",
]

interface Props {
  sessionId: string
  participants: ParticipantWithProfile[]
  messages: SessionMessage[]
  selectedStudentIds?: Set<string>
  onSend: (params: {
    message_type: MessageType
    content: string
    recipient_id: string | null
  }) => Promise<void>
}

export function MessagingPanel({
  sessionId,
  participants,
  messages,
  selectedStudentIds,
  onSend,
}: Props) {
  const [messageType, setMessageType] = useState<MessageType>("hint")
  const [content, setContent] = useState("")
  const [recipient, setRecipient] = useState<"all" | "selected" | string>("all")
  const [isSending, setIsSending] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)

  // Auto-scroll message log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [messages.length])

  const handleSend = useCallback(async () => {
    if (!content.trim()) return
    setIsSending(true)
    try {
      if (recipient === "all") {
        await onSend({ message_type: messageType, content, recipient_id: null })
      } else if (recipient === "selected" && selectedStudentIds) {
        // Send to each selected student
        for (const studentId of selectedStudentIds) {
          await onSend({ message_type: messageType, content, recipient_id: studentId })
        }
      } else {
        await onSend({ message_type: messageType, content, recipient_id: recipient })
      }
      setContent("")
    } finally {
      setIsSending(false)
    }
  }, [content, messageType, recipient, selectedStudentIds, onSend])

  const resolveRecipientName = (id: string | null): string => {
    if (!id) return "All Students"
    const p = participants.find((pp) => pp.student_id === id)
    return p?.profiles?.display_name ?? p?.profiles?.username ?? "Student"
  }

  return (
    <div className="flex h-full flex-col border-l" style={{ borderColor: "rgba(128,128,128,0.12)" }}>
      {/* Header */}
      <div className="border-b px-4 py-3" style={{ borderColor: "rgba(128,128,128,0.08)" }}>
        <p className="text-sm font-semibold">Messages</p>
      </div>

      {/* Recipient selector */}
      <div className="border-b px-4 py-2" style={{ borderColor: "rgba(128,128,128,0.08)" }}>
        <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40">
          Send to
        </label>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <RecipientChip
            active={recipient === "all"}
            onClick={() => setRecipient("all")}
            label="All"
            icon={<Users className="h-3 w-3" />}
          />
          {selectedStudentIds && selectedStudentIds.size > 0 && (
            <RecipientChip
              active={recipient === "selected"}
              onClick={() => setRecipient("selected")}
              label={`Selected (${selectedStudentIds.size})`}
            />
          )}
        </div>
      </div>

      {/* Message type selector */}
      <div className="border-b px-4 py-2" style={{ borderColor: "rgba(128,128,128,0.08)" }}>
        <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40">
          Type
        </label>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {MESSAGE_TYPES.map((mt) => {
            const Icon = mt.icon
            return (
              <button
                key={mt.value}
                onClick={() => setMessageType(mt.value)}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors"
                style={{
                  backgroundColor: messageType === mt.value ? "rgba(99,102,241,0.08)" : "transparent",
                  color: messageType === mt.value ? "var(--tome-indigo, #6366F1)" : "inherit",
                  opacity: messageType === mt.value ? 1 : 0.5,
                }}
              >
                <Icon className="h-3 w-3" />
                {mt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Compose area */}
      <div className="border-b px-4 py-3" style={{ borderColor: "rgba(128,128,128,0.08)" }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a message..."
          rows={2}
          className="w-full resize-none rounded-lg border border-transparent bg-[var(--tome-surface-elevated)] px-3 py-2 text-xs focus:border-[var(--tome-accent)] focus:outline-none"
        />
        <div className="mt-2 flex items-center justify-between">
          <div className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-1 text-[10px] font-medium opacity-40 hover:opacity-60 transition-opacity"
            >
              Quick templates
              <ChevronDown className="h-2.5 w-2.5" />
            </button>
            {showTemplates && (
              <div
                className="absolute left-0 top-full z-10 mt-1 w-64 rounded-lg border bg-card p-1 shadow-lg"
                style={{ borderColor: "rgba(128,128,128,0.12)" }}
              >
                {QUICK_TEMPLATES.map((t) => (
                  <button
                    key={t}
                    onClick={() => { setContent(t); setShowTemplates(false) }}
                    className="block w-full rounded px-2 py-1.5 text-left text-xs hover:bg-muted/50 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button
            onClick={handleSend}
            disabled={isSending || !content.trim()}
            size="sm"
            className="gap-1.5 text-xs text-white"
            style={{ backgroundColor: "var(--tome-indigo, #6366F1)" }}
          >
            <Send className="h-3 w-3" />
            Send
          </Button>
        </div>
      </div>

      {/* Message log */}
      <div ref={logRef} className="flex-1 overflow-y-auto px-4 py-2">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-xs opacity-30">No messages yet</p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => {
              const typeConfig = MESSAGE_TYPES.find((mt) => mt.value === msg.message_type)
              const Icon = typeConfig?.icon ?? Info
              return (
                <div key={msg.id} className="rounded-lg bg-muted/30 px-3 py-2">
                  <div className="flex items-center gap-2 text-[10px] opacity-50">
                    <Icon className="h-2.5 w-2.5" />
                    <span className="capitalize">{msg.message_type}</span>
                    <span>&rarr; {resolveRecipientName(msg.recipient_id)}</span>
                    <span className="ml-auto">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="mt-1 text-xs">{msg.content}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function RecipientChip({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean
  onClick: () => void
  label: string
  icon?: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors"
      style={{
        backgroundColor: active ? "rgba(99,102,241,0.1)" : "rgba(128,128,128,0.06)",
        color: active ? "var(--tome-indigo, #6366F1)" : "inherit",
        opacity: active ? 1 : 0.5,
      }}
    >
      {icon}
      {label}
    </button>
  )
}
