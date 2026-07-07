"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import QRCode from "qrcode"
import { QrCode, Printer, X } from "lucide-react"

/**
 * Class-join QR — the projection code students scan to reach /join?code=CODE.
 *
 * The QR encodes ONLY the public join URL: no class name, no teacher name, no
 * IDs, no PII. It is rendered locally in the browser via the `qrcode` package
 * (no external QR API — the payload never leaves our infra). Because the code
 * itself is baked into the URL, rotating/disabling the join code inherently
 * invalidates every previously shown or printed QR.
 */
export function ClassJoinQr({
  classroomId,
  className,
  joinCode,
}: {
  classroomId: string
  className: string
  joinCode: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Show a QR students can scan to join"
        className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80"
      >
        <QrCode className="size-3.5" /> Show QR
      </button>
      <Link
        href={`/classroom/${classroomId}/join-poster`}
        target="_blank"
        title="Open a printable join poster"
        className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80"
      >
        <Printer className="size-3.5" /> Print join poster
      </Link>

      {open && (
        <QrModal
          className={className}
          joinCode={joinCode}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

function QrModal({
  className,
  joinCode,
  onClose,
}: {
  className: string
  joinCode: string
  onClose: () => void
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  // The join URL is the ONLY thing encoded. Prefer the configured app origin so
  // a projected code resolves on students' own devices, not localhost.
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")
  const joinUrl = `${appUrl}/join?code=${encodeURIComponent(joinCode)}`

  useEffect(() => {
    let alive = true
    QRCode.toDataURL(joinUrl, { margin: 1, width: 512, errorCorrectionLevel: "M" })
      .then((url) => {
        if (alive) setDataUrl(url)
      })
      .catch(() => {
        if (alive) setDataUrl(null)
      })
    return () => {
      alive = false
    }
  }, [joinUrl])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Join QR for ${className}`}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-card p-8 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
        >
          <X className="size-5" />
        </button>
        <h2 className="font-[var(--font-display)] text-2xl font-semibold">{className}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Scan to join this class</p>
        <div className="mt-6 flex justify-center">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dataUrl}
              alt="Class join QR code"
              className="h-auto w-full max-w-[360px] rounded-xl border bg-white p-4"
            />
          ) : (
            <div className="flex h-[360px] w-[360px] items-center justify-center rounded-xl border">
              <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
            </div>
          )}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">Or enter the code</p>
        <p className="font-mono text-3xl font-bold tracking-[0.3em]">{joinCode}</p>
      </div>
    </div>
  )
}
