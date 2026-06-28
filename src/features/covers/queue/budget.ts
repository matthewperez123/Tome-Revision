export interface BudgetState {
  dailyBudgetUsd: number
  spentTodayUsd: number
  estimatedCostPerImageUsd: number
  maxImagesPerBatch?: number
}

export interface BudgetDecision {
  allowed: boolean
  estimatedCostUsd: number
  reason?: string
}

export function evaluateBudget(state: BudgetState, imageCount: number): BudgetDecision {
  const estimatedCostUsd = imageCount * state.estimatedCostPerImageUsd
  if (state.maxImagesPerBatch !== undefined && imageCount > state.maxImagesPerBatch) {
    return { allowed: false, estimatedCostUsd, reason: `Image count ${imageCount} exceeds batch cap ${state.maxImagesPerBatch}.` }
  }
  if (state.dailyBudgetUsd <= 0) {
    return { allowed: false, estimatedCostUsd, reason: "Daily paid-generation budget is zero." }
  }
  if (state.spentTodayUsd + estimatedCostUsd > state.dailyBudgetUsd) {
    return {
      allowed: false,
      estimatedCostUsd,
      reason: `Estimated spend ${estimatedCostUsd.toFixed(2)} would exceed daily budget ${state.dailyBudgetUsd.toFixed(2)}.`,
    }
  }
  return { allowed: true, estimatedCostUsd }
}
