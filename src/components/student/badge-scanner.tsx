"use client"

import { useEffect, useRef, useState } from "react"
import { X, Camera } from "lucide-react"
import { parseBadgeQrPayload } from "@/lib/badge-token"

// ─── Camera badge scanner (on-device, zero-upload) ──────────────────────────
// Opens the rear camera and watches for a Tome badge QR using the browser's
// native BarcodeDetector. Frames live only in the <video> element and are
// decoded on-device — nothing is captured, stored, or uploaded. Only the
// decoded token (via onDetect) leaves, straight into the same server-side
// verifyStudentAccess the typed code uses.
//
// Foreign QRs are ignored (parseBadgeQrPayload returns null), so the scanner
// keeps looking until it sees one of ours. Browsers without BarcodeDetector
// (e.g. Safari/iPad today) get a clear "type your code" message instead of a
// broken camera.

const LAPIS = "#2A4B8D"

type DetectorLike = {
  detect: (source: CanvasImageSource) => Promise<{ rawValue: string }[]>
}
type DetectorCtor = new (opts?: { formats?: string[] }) => DetectorLike

export function BadgeScanner({
  onDetect,
  onClose,
}: {
  onDetect: (payload: string) => void
  onClose: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<
    "starting" | "scanning" | "unsupported" | "denied" | "error"
  >("starting")

  useEffect(() => {
    const Ctor = (window as unknown as { BarcodeDetector?: DetectorCtor })
      .BarcodeDetector
    if (!Ctor) {
      setStatus("unsupported")
      return
    }

    let stream: MediaStream | null = null
    let timer: number | null = null
    let stopped = false
    const detector = new Ctor({ formats: ["qr_code"] })

    async function run() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        })
        if (stopped) return
        const video = videoRef.current
        if (!video) return
        video.srcObject = stream
        await video.play()
        setStatus("scanning")

        const tick = async () => {
          if (stopped || !videoRef.current) return
          try {
            const codes = await detector.detect(videoRef.current)
            for (const c of codes) {
              const token = parseBadgeQrPayload(c.rawValue)
              if (token) {
                stopped = true
                onDetect(c.rawValue)
                return
              }
            }
          } catch {
            // Transient decode hiccup — keep scanning.
          }
          timer = window.setTimeout(tick, 250)
        }
        void tick()
      } catch (e) {
        if (stopped) return
        const name = (e as { name?: string }).name
        setStatus(name === "NotAllowedError" ? "denied" : "error")
      }
    }

    void run()

    return () => {
      stopped = true
      if (timer) window.clearTimeout(timer)
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [onDetect])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 px-4"
      role="dialog"
      aria-label="Scan your badge"
    >
      <button
        onClick={onClose}
        aria-label="Close scanner"
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        <X className="size-5" />
      </button>

      {status === "unsupported" || status === "denied" || status === "error" ? (
        <div className="max-w-xs text-center text-white">
          <Camera className="mx-auto size-10 opacity-70" />
          <p className="mt-4 text-sm">
            {status === "denied"
              ? "The camera is blocked. Type your code instead."
              : status === "unsupported"
                ? "This device can't scan with the camera. Type your code instead."
                : "The camera didn't start. Type your code instead."}
          </p>
          <button
            onClick={onClose}
            className="mt-5 rounded-lg px-4 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: LAPIS }}
          >
            Type my code
          </button>
        </div>
      ) : (
        <>
          <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-2xl bg-black">
            <video
              ref={videoRef}
              playsInline
              muted
              className="size-full object-cover"
            />
            <div className="pointer-events-none absolute inset-6 rounded-xl border-2 border-white/80" />
          </div>
          <p className="mt-5 text-center text-sm text-white/90">
            {status === "starting"
              ? "Starting the camera…"
              : "Point the camera at your badge."}
          </p>
        </>
      )}
    </div>
  )
}
