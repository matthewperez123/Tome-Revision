"use client"

import { useState, useTransition } from "react"
import { Trash2, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { deleteAccount } from "@/app/(app)/account/actions"

const CONFIRMATION_WORD = "DELETE"

/**
 * Account deletion confirmation modal.
 *
 * Hard-deletes the user's data + auth record via the `deleteAccount` server
 * action. Requires the user to type "DELETE" exactly to enable the button.
 */
export function DeleteAccountDialog() {
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const canSubmit = confirmText === CONFIRMATION_WORD && !isPending

  function handleConfirm() {
    if (!canSubmit) return
    setError(null)
    startTransition(async () => {
      const result = await deleteAccount()
      if (!result.success) {
        setError(result.error ?? "Something went wrong. Please try again.")
        return
      }
      // Hard navigate so the (now-stale) Supabase session cookies are cleared
      // by the middleware on the way to /goodbye.
      window.location.href = "/goodbye"
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isPending) return
        setOpen(next)
        if (!next) {
          setConfirmText("")
          setError(null)
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="gap-2 border-rose-500/40 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
          />
        }
      >
        <Trash2 className="size-4" />
        Delete my account
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="size-5" />
            Delete your Tome account
          </DialogTitle>
          <DialogDescription>
            This permanently deletes your account, library, annotations, and
            all associated data. This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            To confirm, type{" "}
            <span className="font-mono font-semibold text-foreground">
              {CONFIRMATION_WORD}
            </span>{" "}
            below.
          </p>
          <Input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={CONFIRMATION_WORD}
            autoComplete="off"
            disabled={isPending}
          />
          {error && <p className="text-sm text-rose-500">{error}</p>}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!canSubmit}
            className="bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {isPending ? "Deleting…" : "Permanently delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
