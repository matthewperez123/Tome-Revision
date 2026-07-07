"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"
import { Printer } from "lucide-react"
import { TomeWordmark } from "@/components/brand/tome-wordmark"

/**
 * Printable class-join poster. The class name is rendered in Fraunces for the
 * physical print ONLY — it is never part of the QR payload, which encodes just
 * the public join URL. The typed code prints beneath the QR as a fallback for
 * anyone without a camera.
 *
 * Print scoping: a scoped print stylesheet hides all app chrome and shows only
 * this poster, so the teacher gets a clean single-page handout regardless of
 * the surrounding sidebar/nav.
 */
export function JoinPoster({
  className,
  joinCode,
}: {
  className: string
  joinCode: string
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")
  const joinUrl = `${appUrl}/join?code=${encodeURIComponent(joinCode)}`

  useEffect(() => {
    let alive = true
    QRCode.toDataURL(joinUrl, { margin: 1, width: 700, errorCorrectionLevel: "M" })
      .then((url) => alive && setDataUrl(url))
      .catch(() => alive && setDataUrl(null))
    return () => {
      alive = false
    }
  }, [joinUrl])

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .join-poster, .join-poster * { visibility: visible !important; }
          .join-poster { position: absolute; inset: 0; margin: 0; }
          .join-poster__noprint { display: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-xl px-6 py-10">
        <div className="join-poster__noprint mb-6 flex justify-end">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
          >
            <Printer className="size-4" /> Print this poster
          </button>
        </div>

        <div className="join-poster rounded-2xl border bg-white p-10 text-center text-black">
          <div className="flex justify-center">
            <TomeWordmark
              showBeta={false}
              className="font-[var(--font-display)] text-2xl font-semibold tracking-tight"
            />
          </div>

          <h1 className="mt-8 font-[var(--font-display)] text-4xl font-semibold leading-tight">
            {className}
          </h1>
          <p className="mt-2 font-[var(--font-serif)] text-lg text-neutral-600">
            Scan to join our class on Tome
          </p>

          <div className="mt-8 flex justify-center">
            {dataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dataUrl}
                alt="Class join QR code"
                className="h-auto w-full max-w-[380px]"
              />
            ) : (
              <div className="flex h-[380px] w-[380px] items-center justify-center">
                <div className="size-6 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
              </div>
            )}
          </div>

          <p className="mt-8 font-[var(--font-serif)] text-base text-neutral-600">
            No camera? Enter this code at the sign-in screen:
          </p>
          <p className="mt-1 font-mono text-4xl font-bold tracking-[0.3em]">{joinCode}</p>
        </div>
      </div>
    </>
  )
}
