/**
 * Trial session system — public surface.
 *
 * TrialPlayer is the drop-in component; the shell pieces are exported for
 * hosts that want to compose their own chrome around the engine.
 */
export { TrialPlayer } from "./TrialPlayer"
export type { TrialPlayerProps } from "./TrialPlayer"
export { TrialShell } from "./TrialShell"
export type { TrialShellProps } from "./TrialShell"
export { HintDrawer } from "./HintDrawer"
export { FeedbackPanel } from "./FeedbackPanel"
export { WisdomChip } from "./WisdomChip"
export { VirgilCompanion } from "./VirgilCompanion"
export type { VirgilCompanionHandle } from "./VirgilCompanion"
export { FAMILY_LABELS } from "./shared"
export type { FamilyRendererProps } from "./shared"

// Family renderers (for direct composition / labs)
export { ChoiceTrial } from "./families/ChoiceTrial"
export { FillTheLineTrial } from "./families/FillTheLineTrial"
export { FindTheEvidenceTrial } from "./families/FindTheEvidenceTrial"
export { MatchPairsTrial } from "./families/MatchPairsTrial"
export { OrderingTrial } from "./families/OrderingTrial"
export { TrueFalseReasonTrial } from "./families/TrueFalseReasonTrial"
export { WritingTrial } from "./families/WritingTrial"
export { RecitationTrial } from "./families/RecitationTrial"
