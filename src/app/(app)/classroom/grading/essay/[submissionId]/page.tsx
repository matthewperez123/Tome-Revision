"use client"

import { use, useState, useCallback } from "react"
import Link from "next/link"
import {
  ChevronLeft, Sparkles, Check, RefreshCw, X, Save, Mail,
  AlertCircle, ChevronDown, ChevronUp, PenLine
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  getEssaySubmission, getEssayAssignment,
  generateMockEssaySuggestion,
  DEMO_ESSAY_ASSIGNMENTS, type AISuggestion
} from "@/lib/mock-essay-grader"

export default function EssayGradingPage({ params }: { params: Promise<{ submissionId: string }> }) {
  const { submissionId } = use(params)
  const submission = getEssaySubmission(submissionId)
  const assignment = submission ? (DEMO_ESSAY_ASSIGNMENTS.find(a => a.id === submission.essayAssignmentId) ?? null) : null

  const [suggestion, setSuggestion] = useState<AISuggestion | null>(null)
  const [generating, setGenerating] = useState(false)
  const [regenerateCount, setRegenerateCount] = useState(0)

  // Editable fields
  const [editedScores, setEditedScores] = useState<Record<string, number>>({})
  const [editedFeedback, setEditedFeedback] = useState("")
  const [editedStrengths, setEditedStrengths] = useState<string[]>([])
  const [editedImprovements, setEditedImprovements] = useState<string[]>([])
  const [acceptedNotes, setAcceptedNotes] = useState<Set<number>>(new Set())

  // Final grade
  const [finalScore, setFinalScore] = useState<number | "">("")
  const [finalFeedback, setFinalFeedback] = useState("")
  const [saved, setSaved] = useState(false)

  const handleGenerate = useCallback(() => {
    if (!submission || !assignment) return
    setGenerating(true)
    setTimeout(() => {
      const seed = Date.now() + regenerateCount * 12345
      const result = generateMockEssaySuggestion(submission, assignment, seed)
      setSuggestion(result)
      setEditedScores(Object.fromEntries(result.perCriterionScores.map(c => [c.criterion, c.score])))
      setEditedFeedback(result.overallFeedback)
      setEditedStrengths(result.strengths)
      setEditedImprovements(result.areasForImprovement)
      setAcceptedNotes(new Set())
      setGenerating(false)
    }, 1200)
  }, [submission, assignment, regenerateCount])

  const handleRegenerate = () => {
    setRegenerateCount(c => c + 1)
    handleGenerate()
  }

  const handleUseAll = () => {
    if (!suggestion || !assignment) return
    const totalEdited = Object.values(editedScores).reduce((s, v) => s + v, 0)
    setFinalScore(totalEdited)
    setFinalFeedback(editedFeedback)
    setAcceptedNotes(new Set(suggestion.suggestedMarginNotes.map((_, i) => i)))
  }

  const handleDismiss = () => {
    setSuggestion(null)
    setEditedScores({})
    setEditedFeedback("")
    setEditedStrengths([])
    setEditedImprovements([])
    setAcceptedNotes(new Set())
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!submission || !assignment) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-sm text-muted-foreground">Submission not found</p>
        <Link href="/classroom/grading" className="text-xs text-muted-foreground hover:text-foreground">← Back to grading</Link>
      </div>
    )
  }

  const confidenceColors: Record<string, string> = {
    high: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
    low: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="shrink-0 border-b border-border px-4 py-3">
        <Link href="/classroom/grading" className="mb-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-3.5" /> Back to grading queue
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-serif font-bold">Essay Grading</h1>
          <Badge variant="outline" className="text-[9px]">{submission.studentName}</Badge>
        </div>
      </div>

      {/* Two-column split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Student Essay */}
        <div className="flex-1 overflow-y-auto p-6 border-r border-border">
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <p className="text-sm font-medium">{submission.studentName}</p>
              <span className="text-[10px] text-muted-foreground">{new Date(submission.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
              <span className="text-[10px] text-muted-foreground">{submission.wordCount} words</span>
              {assignment.wordCountTarget && (
                <span className={cn("text-[10px]", Math.abs(submission.wordCount - assignment.wordCountTarget) / assignment.wordCountTarget > 0.2 ? "text-amber-600" : "text-muted-foreground")}>
                  (target: {assignment.wordCountTarget})
                </span>
              )}
            </div>
            <div className="rounded-xl border bg-card p-6 mb-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Prompt</p>
              <p className="text-sm italic text-muted-foreground">{assignment.prompt}</p>
            </div>
            <div className="prose prose-sm max-w-none" style={{ fontFamily: "'Literata', Georgia, serif", lineHeight: 1.8 }}>
              {submission.body.split("\n\n").map((paragraph, i) => (
                <p key={i} className="mb-4 text-sm leading-relaxed">{paragraph}</p>
              ))}
            </div>
            {/* Accepted margin notes */}
            {suggestion && acceptedNotes.size > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Applied Notes</h3>
                <div className="space-y-2">
                  {suggestion.suggestedMarginNotes.filter((_, i) => acceptedNotes.has(i)).map((note, i) => (
                    <div key={i} className="rounded-lg bg-amber-50 dark:bg-amber-950/10 p-3">
                      <p className="text-[10px] text-muted-foreground italic">"{note.quotedText}"</p>
                      <p className="text-xs mt-1">{note.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: AI Assistant */}
        <div className="w-[420px] shrink-0 overflow-y-auto p-4 bg-muted/20">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-semibold">Grading Assistant</h2>
            <span className="rounded-full bg-[var(--tome-accent)]/10 text-[var(--tome-accent)] px-2 py-0.5 text-[9px] font-medium">Preview — AI-assisted</span>
          </div>

          {!suggestion && !generating && (
            <div className="text-center py-12">
              <Sparkles className="size-8 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Generate AI suggestions for scoring, feedback, and margin notes</p>
              <p className="text-[10px] text-muted-foreground mt-1">You'll review and edit everything before saving</p>
              <Button onClick={handleGenerate} className="mt-4 gap-1.5 border-[var(--tome-accent)]/30 text-[var(--tome-accent)] hover:bg-[var(--tome-accent)]/5" variant="outline">
                <Sparkles className="size-3.5" /> Generate suggestions
              </Button>
            </div>
          )}

          {generating && (
            <div className="text-center py-12">
              <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-[var(--tome-accent)] mx-auto" />
              <p className="text-sm text-muted-foreground mt-3">Analyzing essay...</p>
            </div>
          )}

          {suggestion && !generating && (
            <div className="space-y-4">
              {/* Suggested score */}
              <div className="rounded-xl border bg-card p-4 text-center">
                <p className="text-3xl font-bold">{suggestion.suggestedScore} <span className="text-lg text-muted-foreground">/ {assignment.totalPoints}</span></p>
                <span className={cn("inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium", confidenceColors[suggestion.confidence])}>
                  {suggestion.confidence} confidence
                </span>
              </div>

              {/* Per-criterion */}
              <div className="rounded-xl border bg-card p-4">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Rubric Breakdown</h3>
                <div className="space-y-3">
                  {suggestion.perCriterionScores.map(c => (
                    <div key={c.criterion}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{c.criterion}</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editedScores[c.criterion] ?? c.score}
                            onChange={e => setEditedScores(prev => ({ ...prev, [c.criterion]: Number(e.target.value) }))}
                            min={0}
                            max={c.maxPoints}
                            className="w-10 h-6 rounded border bg-background px-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                          <span className="text-[10px] text-muted-foreground">/ {c.maxPoints}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{c.justification}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overall feedback */}
              <div className="rounded-xl border bg-card p-4">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Overall Feedback</h3>
                <textarea
                  value={editedFeedback}
                  onChange={e => setEditedFeedback(e.target.value)}
                  className="w-full rounded-md border bg-background p-2 text-xs min-h-[100px] focus:outline-none focus:ring-1 focus:ring-ring"
                  rows={5}
                />
              </div>

              {/* Strengths */}
              <div className="rounded-xl border bg-card p-4">
                <h3 className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">Strengths</h3>
                <ul className="space-y-1.5">
                  {editedStrengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs">
                      <Check className="size-3 text-green-500 mt-0.5 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for improvement */}
              <div className="rounded-xl border bg-card p-4">
                <h3 className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">Areas for Improvement</h3>
                <ul className="space-y-1.5">
                  {editedImprovements.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs">
                      <AlertCircle className="size-3 text-amber-500 mt-0.5 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Margin notes */}
              <div className="rounded-xl border bg-card p-4">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Suggested Margin Notes</h3>
                <div className="space-y-2">
                  {suggestion.suggestedMarginNotes.map((note, i) => (
                    <div key={i} className={cn("rounded-lg p-2.5 text-xs", acceptedNotes.has(i) ? "bg-green-50 dark:bg-green-950/10 border border-green-200" : "bg-muted")}>
                      <p className="text-muted-foreground italic text-[10px]">"{note.quotedText}"</p>
                      <p className="mt-1">{note.note}</p>
                      <div className="flex gap-1 mt-1.5">
                        <button
                          onClick={() => setAcceptedNotes(prev => { const next = new Set(prev); if (next.has(i)) next.delete(i); else next.add(i); return next })}
                          className={cn("rounded px-2 py-0.5 text-[9px] font-medium transition-colors", acceptedNotes.has(i) ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground hover:text-foreground")}
                        >
                          {acceptedNotes.has(i) ? "✓ Accepted" : "Accept"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={handleUseAll} className="flex-1 gap-1.5 text-xs" size="sm">
                  <Check className="size-3" /> Use all suggestions
                </Button>
                <Button onClick={handleRegenerate} variant="outline" size="sm" className="gap-1 text-xs">
                  <RefreshCw className="size-3" /> Regenerate
                </Button>
                <Button onClick={handleDismiss} variant="ghost" size="sm" className="text-xs">
                  <X className="size-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Final grade form */}
      <div className="shrink-0 border-t border-border px-6 py-4 bg-background">
        <div className="max-w-3xl mx-auto flex items-end gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Final Score</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={finalScore}
                onChange={e => setFinalScore(e.target.value === "" ? "" : Number(e.target.value))}
                min={0}
                max={assignment.totalPoints}
                placeholder="—"
                className="w-16 h-8 rounded-md border bg-background px-2 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-sm text-muted-foreground">/ {assignment.totalPoints}</span>
            </div>
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Final Feedback</label>
            <textarea
              value={finalFeedback}
              onChange={e => setFinalFeedback(e.target.value)}
              placeholder="Write your feedback to the student..."
              className="w-full h-8 rounded-md border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              rows={1}
            />
          </div>
          <Button onClick={handleSave} disabled={finalScore === "" || saved} className="gap-1.5 shrink-0">
            {saved ? <><Check className="size-3.5" /> Saved!</> : <><Save className="size-3.5" /> Save Grade</>}
          </Button>
          {saved && (
            <Link href={`/teacher/parents?student=${submission.studentId}`}>
              <Button variant="outline" size="sm" className="gap-1 text-xs shrink-0">
                <Mail className="size-3" /> Notify parent
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
