import { readFile } from "node:fs/promises"
import path from "node:path"
import Link from "next/link"
import { AlertTriangle, CheckCircle2, Gauge, Images, Layers3, Palette, ShieldAlert } from "lucide-react"
import { getCurrentProfile } from "@/lib/auth"
import { COVER_PALETTES, COVER_STYLE_VERSION } from "@/features/covers/styles/palettes"
import { COMPOSITION_FAMILIES } from "@/features/covers/compositions/library"
import { diversityStats } from "@/features/covers/briefs/diversity"
import { DeterministicSemanticBriefGenerator, developmentFixtureBooks } from "@/features/covers/briefs/semantic-brief"
import { createImageGenerationProvider } from "@/features/covers/providers"
import { cn } from "@/lib/utils"

interface ReferenceManifest {
  references: Array<{
    id: string
    cropPath: string
    paletteFamily: string
    compositionFamily: string
    dominantColors: string[]
    description: string
  }>
}

export default async function CoverAdminPage() {
  const profile = await getCurrentProfile()
  const allowedAdminIds = (process.env.COVER_ADMIN_USER_IDS ?? "").split(",").map((id) => id.trim()).filter(Boolean)
  const isAllowed = profile?.role === "teacher" || (profile?.id ? allowedAdminIds.includes(profile.id) : false)
  const manifest = await readManifest()
  const provider = createImageGenerationProvider()
  const providerHealth = await provider.healthCheck()
  const generator = new DeterministicSemanticBriefGenerator()
  const fixtureBriefs = developmentFixtureBooks().map((book) => generator.generate(book, { batchSeed: "admin-preview" }))
  const stats = diversityStats(fixtureBriefs.map((brief) => ({
    bookId: brief.source.bookId,
    compositionFamily: brief.artDirection.compositionFamily,
    paletteMode: brief.artDirection.paletteMode,
  })))

  if (!isAllowed) {
    return (
      <main className="min-h-full bg-[var(--tome-bg)] px-5 py-8">
        <section className="mx-auto max-w-3xl rounded-md border border-border bg-[var(--tome-surface-elevated)] p-6">
          <div className="flex items-center gap-3 text-amber-500">
            <ShieldAlert className="size-5" />
            <h1 className="text-lg font-semibold text-foreground">Cover admin is restricted</h1>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Sign in as a teacher or add your profile id to COVER_ADMIN_USER_IDS to review cover operations.
          </p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-full bg-[var(--tome-bg)]">
      <section className="border-b border-border bg-[var(--tome-surface-elevated)] px-5 py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--tome-accent)]">
              <Images className="size-3.5" />
              Tome Luminous Minimal
            </div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">Cover Factory</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {COVER_STYLE_VERSION} Google Imagen-only production pipeline with deterministic mock mode, reference-library QA, light palette batch diversity,
              separate typography composition, and immutable publication history.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/api/covers/health" className="rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted">
              Provider JSON
            </Link>
            <Link href="/dev/covers" className="rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted">
              Existing Review
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-6 md:grid-cols-4">
        <Metric
          icon={<Gauge className="size-4" />}
          label="Provider"
          value={providerHealth.provider}
          detail={providerHealth.available ? "available" : providerHealth.error ?? "mock/fail-closed"}
          tone={providerHealth.available ? "good" : "warn"}
        />
        <Metric icon={<Images className="size-4" />} label="References" value={`${manifest?.references.length ?? 0}`} detail="expected 21 protected assets" />
        <Metric icon={<Palette className="size-4" />} label="Palettes" value={`${COVER_PALETTES.length}`} detail="versioned color modes" />
        <Metric icon={<Layers3 className="size-4" />} label="Families" value={`${COMPOSITION_FAMILIES.length}`} detail="composition library" />
      </section>

      {providerHealth.warning || providerHealth.lifecycle.warning ? (
        <section className="mx-auto max-w-7xl px-5 pb-2">
          <div className="flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p>{providerHealth.warning ?? providerHealth.lifecycle.warning}</p>
          </div>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Reference Library</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {(manifest?.references ?? []).map((reference) => (
              <article key={reference.id} className="rounded-md border border-border bg-[var(--tome-surface-elevated)] p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/covers/references/${reference.id}`} alt={`${reference.id} reference`} className="aspect-[2/3] w-full rounded-sm object-cover" />
                <div className="mt-2">
                  <p className="truncate text-xs font-semibold text-foreground">{reference.id}</p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{reference.compositionFamily}</p>
                  <div className="mt-2 flex gap-1">
                    {reference.dominantColors.slice(0, 5).map((color) => (
                      <span key={color} className="h-3 w-5 rounded-sm border border-white/10" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Diversity Preview</h2>
            <div className="rounded-md border border-border bg-[var(--tome-surface-elevated)] p-4">
              <p className="text-sm text-foreground">{fixtureBriefs.length} fixture briefs</p>
              <div className="mt-4 space-y-2">
                {Object.entries(stats.familyCounts).map(([family, count]) => (
                  <DistributionBar key={family} label={family} count={count} total={stats.total} />
                ))}
              </div>
              {stats.warnings.length > 0 ? (
                <div className="mt-4 space-y-1 text-xs text-amber-300">
                  {stats.warnings.map((warning) => <p key={warning}>{warning}</p>)}
                </div>
              ) : (
                <p className="mt-4 flex items-center gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="size-3.5" />
                  No preview diversity warnings
                </p>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Imagen Models</h2>
            <div className="rounded-md border border-border bg-[var(--tome-surface-elevated)] p-4 text-xs leading-6 text-muted-foreground">
              <p><span className="text-foreground">Active model:</span> {providerHealth.modelId ?? "mock"}</p>
              <p><span className="text-foreground">Transport:</span> {providerHealth.transport}</p>
              <p><span className="text-foreground">Retirement:</span> {providerHealth.lifecycle.retirementDate ?? "not configured"}</p>
              <p className="mt-2 text-amber-300">No non-Imagen fallback is permitted for production art.</p>
            </div>
          </section>
        </aside>
      </section>
    </main>
  )
}

function Metric({ icon, label, value, detail, tone = "neutral" }: { icon: React.ReactNode; label: string; value: string; detail: string; tone?: "neutral" | "good" | "warn" }) {
  return (
    <div className="rounded-md border border-border bg-[var(--tome-surface-elevated)] p-4">
      <div className={cn("mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]", tone === "good" ? "text-emerald-300" : tone === "warn" ? "text-amber-300" : "text-muted-foreground")}>
        {icon}
        {label}
      </div>
      <p className="truncate text-lg font-semibold text-foreground">{value}</p>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{detail}</p>
    </div>
  )
}

function DistributionBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100)
  return (
    <div>
      <div className="mb-1 flex justify-between gap-3 text-[11px] text-muted-foreground">
        <span className="truncate">{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-background">
        <div className="h-full rounded-full bg-[var(--tome-accent)]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

async function readManifest(): Promise<ReferenceManifest | null> {
  try {
    const file = await readFile(path.join(process.cwd(), "docs/cover-system/reference-manifest.json"), "utf8")
    return JSON.parse(file) as ReferenceManifest
  } catch {
    return null
  }
}
