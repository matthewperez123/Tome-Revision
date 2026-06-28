import "server-only"

import { revalidatePath } from "next/cache"
import type { SupabaseClient } from "@supabase/supabase-js"
import { createAdminClient as createBaseAdminClient } from "@/lib/supabase/admin"
import { BOOKS } from "@/data/books"
import { DeterministicSemanticBriefGenerator } from "../briefs/semantic-brief"
import { rebalanceAssignments, diversityStats, type DiversityAssignment } from "../briefs/diversity"
import { createImageGenerationProvider } from "../providers"
import type { CoverBrief } from "../schemas/cover-brief"
import { layoutCoverTypography } from "../rendering/typography"

// The cover_* tables are not yet in the generated database types, so the
// service-role client is treated permissively here for these table operations.
function createAdminClient(): SupabaseClient<any, "public", any> {
  return createBaseAdminClient() as unknown as SupabaseClient<any, "public", any>
}

export async function createBatch(input: { name: string; bookIds: string[]; mode?: "concept" | "production" | "featured" }) {
  const admin = createAdminClient()
  const payload = {
    name: input.name,
    status: "draft",
    generation_mode: input.mode ?? "production",
    book_count: input.bookIds.length,
    import_payload: { bookIds: input.bookIds },
  }
  const { data, error } = await admin.from("cover_batches").insert(payload).select("id").single()
  if (error) throw error
  revalidatePath("/admin/covers")
  return data
}

export async function importBooks(bookIds: string[]) {
  return BOOKS.filter((book) => bookIds.includes(book.id))
}

export async function generateBriefs(input: { batchId?: string; bookIds: string[]; seed?: string }): Promise<CoverBrief[]> {
  const generator = new DeterministicSemanticBriefGenerator()
  return BOOKS
    .filter((book) => input.bookIds.includes(book.id))
    .map((book) => {
      const brief = generator.generate(book, { batchSeed: input.seed ?? input.batchId ?? "manual" })
      brief.provenance.batchId = input.batchId
      return brief
    })
}

export async function rebalanceBriefs(assignments: DiversityAssignment[]) {
  const rebalanced = rebalanceAssignments(assignments)
  return { assignments: rebalanced, stats: diversityStats(rebalanced) }
}

export async function approveBriefs(briefIds: string[]) {
  const admin = createAdminClient()
  const { error } = await admin.from("cover_briefs").update({ status: "approved_for_generation" }).in("id", briefIds)
  if (error) throw error
  revalidatePath("/admin/covers")
}

export async function queueImagenGeneration(briefIds: string[]) {
  const admin = createAdminClient()
  const { error } = await admin.from("cover_jobs").insert(briefIds.map((briefId) => ({
    brief_id: briefId,
    status: "queued",
    provider: "google-imagen",
  })))
  if (error) throw error
}

export async function pauseBatch(batchId: string) {
  return setBatchStatus(batchId, "paused")
}

export async function resumeBatch(batchId: string) {
  return setBatchStatus(batchId, "queued")
}

export async function cancelBatch(batchId: string) {
  return setBatchStatus(batchId, "cancelled")
}

export async function retrieveProgress(batchId: string) {
  const admin = createAdminClient()
  const { data, error } = await admin.from("cover_jobs").select("status").eq("batch_id", batchId)
  if (error) throw error
  return (data ?? []).reduce<Record<string, number>>((acc, row: { status: string }) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1
    return acc
  }, {})
}

export async function approveCandidate(candidateId: string, reviewerId?: string) {
  return reviewCandidate(candidateId, "approved", reviewerId)
}

export async function rejectCandidate(candidateId: string, reviewerId?: string, notes?: string) {
  return reviewCandidate(candidateId, "rejected", reviewerId, notes)
}

export async function regenerateCandidate(candidateId: string, note: string) {
  const admin = createAdminClient()
  const { error } = await admin.from("cover_audit_events").insert({
    entity_type: "cover_candidate",
    entity_id: candidateId,
    event_type: "regenerate_requested",
    payload: { note },
  })
  if (error) throw error
}

export async function renderTypography(input: { title: string; author: string; template: "open-sky-top" | "quiet-bottom" | "vertical-edge" | "archive-band" | "art-only" }) {
  return layoutCoverTypography(input)
}

export async function publishCover(candidateId: string) {
  const admin = createAdminClient()
  const { error } = await admin.from("cover_publications").insert({
    candidate_id: candidateId,
    publication_state: "published",
    version: 1,
  })
  if (error) throw error
  revalidatePath("/admin/covers")
}

export async function rollbackCover(publicationId: string, targetPublicationId: string) {
  const admin = createAdminClient()
  const { error } = await admin.from("cover_audit_events").insert({
    entity_type: "cover_publication",
    entity_id: publicationId,
    event_type: "rollback",
    payload: { targetPublicationId },
  })
  if (error) throw error
}

export async function providerStatus() {
  const provider = createImageGenerationProvider()
  return provider.healthCheck()
}

async function setBatchStatus(batchId: string, status: string) {
  const admin = createAdminClient()
  const { error } = await admin.from("cover_batches").update({ status }).eq("id", batchId)
  if (error) throw error
  revalidatePath("/admin/covers")
}

async function reviewCandidate(candidateId: string, state: "approved" | "rejected", reviewerId?: string, notes?: string) {
  const admin = createAdminClient()
  const { error } = await admin.from("cover_reviews").insert({
    candidate_id: candidateId,
    review_state: state,
    reviewer_id: reviewerId,
    notes,
  })
  if (error) throw error
  revalidatePath("/admin/covers")
}
