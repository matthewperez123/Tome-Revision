"use client"

import { useEffect } from "react"
import { createPortal } from "react-dom"
import type { BadgePrintCard } from "@/lib/actions/student-badges"

// ─── Bookplate badge print sheet (Design B) ─────────────────────────────────
// A print-optimized "Ex Libris" bookplate per student: the child's first name,
// the class name, a scannable QR (rendered server-side — see issueBadge), and
// the typed code as a fallback. Laid out on US Letter with dashed cut lines.
//
// The QR encodes only an opaque token (no name/email/id). Each print run mints
// fresh tokens, so anything printed earlier stops scanning — an old printout
// can never silently keep working.

const LAPIS = "#2A4B8D"
const GOLD = "#C8A24B"

export function BadgePrintSheet({
  cards,
  className,
  onClose,
}: {
  cards: BadgePrintCard[]
  className: string
  onClose: () => void
}) {
  // Close on Escape for keyboard users.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const sheet = (
    <div className="tome-bp-portal" role="dialog" aria-label="Print student badges">
      <style>{`
        .tome-bp-portal {
          position: fixed; inset: 0; z-index: 9999;
          background: #f4f2ec; overflow: auto;
          font-family: var(--font-serif, Georgia, serif);
          color: #1c1917;
        }
        .tome-bp-bar {
          position: sticky; top: 0; display: flex; gap: 12px; align-items: center;
          justify-content: flex-end; padding: 12px 20px;
          background: #fff; border-bottom: 1px solid #e5e1d8;
        }
        .tome-bp-bar p { margin-right: auto; font-size: 13px; color: #6b675e; }
        .tome-bp-btn {
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 13px; font-weight: 600; padding: 8px 16px; border-radius: 8px;
          border: 1px solid #d6d1c6; background: #fff; cursor: pointer;
        }
        .tome-bp-btn.primary { background: ${LAPIS}; color: #fff; border-color: ${LAPIS}; }
        .tome-bp-grid {
          display: grid; grid-template-columns: repeat(2, 3.4in);
          gap: 0.3in; justify-content: center; padding: 0.4in;
        }
        .tome-bp-card {
          width: 3.4in; height: 2.55in;
          border: 1px dashed #c9c3b6; padding: 0.12in;
          box-sizing: border-box;
        }
        .tome-bp-frame {
          height: 100%; box-sizing: border-box;
          border: 2px solid ${LAPIS}; border-radius: 6px;
          padding: 0.14in 0.16in; text-align: center;
          display: flex; flex-direction: column; align-items: center;
          justify-content: space-between;
        }
        .tome-bp-exlibris {
          font-family: var(--font-display, var(--font-serif, Georgia), serif);
          letter-spacing: 0.18em; text-transform: uppercase;
          font-size: 9px; font-weight: 700; color: ${GOLD}; margin: 0;
        }
        .tome-bp-name {
          font-family: var(--font-display, var(--font-serif, Georgia), serif);
          font-size: 19px; font-weight: 700; line-height: 1.1; margin: 2px 0 0;
          color: #1c1917;
        }
        .tome-bp-class { font-size: 10px; color: #6b675e; margin: 1px 0 0; }
        .tome-bp-qr { width: 1.05in; height: 1.05in; margin: 2px 0; }
        .tome-bp-qr svg { width: 100%; height: 100%; display: block; }
        .tome-bp-code {
          font-family: var(--font-sans, ui-monospace, monospace);
          font-variant-numeric: tabular-nums; letter-spacing: 0.06em;
          font-size: 14px; font-weight: 700; margin: 0; color: ${LAPIS};
        }
        .tome-bp-hint { font-size: 8px; color: #8a857b; margin: 1px 0 0; }

        @media print {
          body > *:not(.tome-bp-portal) { display: none !important; }
          .tome-bp-portal { position: static; background: #fff; overflow: visible; }
          .tome-bp-bar { display: none !important; }
          .tome-bp-grid { padding: 0; gap: 0.25in; }
          .tome-bp-card { break-inside: avoid; }
          @page { size: letter; margin: 0.5in; }
        }
      `}</style>

      <div className="tome-bp-bar">
        <p>
          {cards.length} badge{cards.length === 1 ? "" : "s"} · fresh codes — any
          earlier printout for these students no longer scans.
        </p>
        <button className="tome-bp-btn" onClick={onClose}>
          Close
        </button>
        <button className="tome-bp-btn primary" onClick={() => window.print()}>
          Print
        </button>
      </div>

      <div className="tome-bp-grid">
        {cards.map((c) => (
          <div key={c.userId} className="tome-bp-card">
            <div className="tome-bp-frame">
              <div>
                <p className="tome-bp-exlibris">Ex Libris</p>
                <p className="tome-bp-name">{c.displayName}</p>
                <p className="tome-bp-class">{className}</p>
              </div>
              <div
                className="tome-bp-qr"
                // Server-rendered QR SVG (opaque token, no PII).
                dangerouslySetInnerHTML={{ __html: c.qrSvg }}
              />
              <div>
                <p className="tome-bp-code">{c.code}</p>
                <p className="tome-bp-hint">Scan to enter · or type your code</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return createPortal(sheet, document.body)
}
