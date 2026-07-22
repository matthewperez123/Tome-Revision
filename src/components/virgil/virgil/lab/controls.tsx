/**
 * Lab UI primitives — segmented controls, toggles, section shells.
 * Local to the Virgil Lab; not part of the product design system.
 */

import type { ReactNode } from "react"

export function LabSection({
  id,
  title,
  kicker,
  children,
}: {
  id: string
  title: string
  kicker: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <header className="mb-4 border-b border-[#33363F] pb-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C8A24B]">
          {kicker}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-[#EDE6D4]">{title}</h2>
      </header>
      {children}
    </section>
  )
}

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div>
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-[#9A9484]">
        {label}
      </span>
      <div
        role="group"
        aria-label={label}
        className="inline-flex overflow-hidden rounded-md border border-[#3A3D46] bg-[#1B1D24]"
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A24B] ${
              value === option.value
                ? "bg-[#C8A24B] text-[#1B1D24]"
                : "text-[#C9C3B2] hover:bg-[#262932] hover:text-[#EDE6D4]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function LabToggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  hint?: string
}) {
  return (
    <div>
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-[#9A9484]">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A24B] ${
          checked
            ? "border-[#C8A24B] bg-[#2A2517] text-[#F2C14E]"
            : "border-[#3A3D46] bg-[#1B1D24] text-[#C9C3B2] hover:text-[#EDE6D4]"
        }`}
      >
        <span
          aria-hidden
          className={`inline-block h-2 w-2 rounded-full ${checked ? "bg-[#F2C14E]" : "bg-[#4A4D56]"}`}
        />
        {checked ? "On" : "Off"}
      </button>
      {hint && <p className="mt-1 text-[11px] text-[#7C7768]">{hint}</p>}
    </div>
  )
}
