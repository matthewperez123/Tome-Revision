import { createHash } from "node:crypto"

export type CoverJobStatus =
  | "queued"
  | "claimed"
  | "generating"
  | "retry_scheduled"
  | "provider_unavailable"
  | "budget_paused"
  | "failed"
  | "dead_letter"
  | "completed"
  | "cancelled"
  | "paused"

export interface CoverQueueJob {
  id: string
  batchId: string
  bookId: string
  briefVersion: number
  styleVersion: string
  promptVersion: string
  provider: "google-imagen" | "mock-cover"
  modelId: string
  requestMode: "concept" | "production" | "featured"
  idempotencyKey: string
  status: CoverJobStatus
  attemptCount: number
  maxAttempts: number
  leaseOwner?: string
  leaseExpiresAt?: number
  heartbeatAt?: number
  estimatedCostUsd: number
  recordedCostUsd?: number
  createdAt: number
  startedAt?: number
  completedAt?: number
  lastError?: string
  retryAt?: number
}

export interface QueueClaimOptions {
  owner: string
  now?: number
  leaseMs?: number
  concurrency?: number
  providerAvailable?: boolean
  budgetAvailable?: boolean
}

export class InMemoryCoverJobQueue {
  private readonly jobs = new Map<string, CoverQueueJob>()

  enqueue(input: Omit<CoverQueueJob, "id" | "status" | "attemptCount" | "createdAt"> & { id?: string }): CoverQueueJob {
    const id = input.id ?? createHash("sha256").update(input.idempotencyKey).digest("hex")
    const existing = this.jobs.get(id)
    if (existing) return existing
    const job: CoverQueueJob = {
      ...input,
      id,
      status: "queued",
      attemptCount: 0,
      createdAt: Date.now(),
    }
    this.jobs.set(job.id, job)
    return job
  }

  claim(options: QueueClaimOptions): CoverQueueJob[] {
    const now = options.now ?? Date.now()
    const leaseMs = options.leaseMs ?? 1000 * 60 * 5
    const concurrency = options.concurrency ?? 1

    if (options.providerAvailable === false) {
      this.markQueued("provider_unavailable")
      return []
    }
    if (options.budgetAvailable === false) {
      this.markQueued("budget_paused")
      return []
    }

    const claimable = Array.from(this.jobs.values())
      .filter((job) => {
        if (job.status === "queued") return true
        if (job.status === "retry_scheduled" && (job.retryAt ?? 0) <= now) return true
        if (job.status === "claimed" && (job.leaseExpiresAt ?? 0) <= now) return true
        return false
      })
      .sort((a, b) => a.createdAt - b.createdAt)
      .slice(0, concurrency)

    for (const job of claimable) {
      job.status = "claimed"
      job.leaseOwner = options.owner
      job.leaseExpiresAt = now + leaseMs
      job.heartbeatAt = now
      job.startedAt ??= now
    }

    return claimable.map((job) => ({ ...job }))
  }

  heartbeat(jobId: string, owner: string, now = Date.now(), leaseMs = 1000 * 60 * 5): boolean {
    const job = this.jobs.get(jobId)
    if (!job || job.leaseOwner !== owner) return false
    job.heartbeatAt = now
    job.leaseExpiresAt = now + leaseMs
    return true
  }

  complete(jobId: string, owner: string, recordedCostUsd = 0): CoverQueueJob {
    const job = this.requireOwned(jobId, owner)
    job.status = "completed"
    job.completedAt = Date.now()
    job.recordedCostUsd = recordedCostUsd
    job.leaseOwner = undefined
    job.leaseExpiresAt = undefined
    return { ...job }
  }

  fail(jobId: string, owner: string, error: string, now = Date.now()): CoverQueueJob {
    const job = this.requireOwned(jobId, owner)
    job.attemptCount += 1
    job.lastError = redact(error)
    job.leaseOwner = undefined
    job.leaseExpiresAt = undefined
    if (job.attemptCount >= job.maxAttempts) {
      job.status = "dead_letter"
    } else {
      job.status = "retry_scheduled"
      job.retryAt = now + retryDelayMs(job.attemptCount, job.idempotencyKey)
    }
    return { ...job }
  }

  list(): CoverQueueJob[] {
    return Array.from(this.jobs.values()).map((job) => ({ ...job }))
  }

  recoverExpiredLeases(now = Date.now()): number {
    let recovered = 0
    for (const job of this.jobs.values()) {
      if (job.status === "claimed" && (job.leaseExpiresAt ?? 0) <= now) {
        job.status = "queued"
        job.leaseOwner = undefined
        job.leaseExpiresAt = undefined
        recovered += 1
      }
    }
    return recovered
  }

  private markQueued(status: CoverJobStatus) {
    for (const job of this.jobs.values()) {
      if (job.status === "queued" || job.status === "retry_scheduled") {
        job.status = status
      }
    }
  }

  private requireOwned(jobId: string, owner: string): CoverQueueJob {
    const job = this.jobs.get(jobId)
    if (!job) throw new Error(`Unknown cover job ${jobId}.`)
    if (job.leaseOwner !== owner) throw new Error(`Cover job ${jobId} is not leased by ${owner}.`)
    return job
  }
}

export function retryDelayMs(attempt: number, seed: string): number {
  const base = Math.min(1000 * 60 * 30, 1000 * 2 ** attempt)
  const jitter = (hashJitter(seed) % 1000) / 1000
  return Math.round(base * (1 + jitter))
}

function hashJitter(seed: string): number {
  return createHash("sha256").update(seed).digest().readUInt32BE(0)
}

function redact(error: string): string {
  return error.replace(/[A-Za-z0-9_-]{24,}/g, "[redacted-token]").slice(0, 1000)
}
