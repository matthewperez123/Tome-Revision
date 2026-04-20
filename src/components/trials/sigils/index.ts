export { ApprenticeSigil, type SigilProps } from "./ApprenticeSigil"
export { ScholarSigil } from "./ScholarSigil"
export { MasterSigil } from "./MasterSigil"
export { WisdomStar } from "./WisdomStar"

import type { FC } from "react"
import type { SigilProps } from "./ApprenticeSigil"
import { ApprenticeSigil } from "./ApprenticeSigil"
import { ScholarSigil } from "./ScholarSigil"
import { MasterSigil } from "./MasterSigil"

export type TrialTier = "Apprentice" | "Scholar" | "Master"

export const tierSigils: Record<TrialTier, FC<SigilProps>> = {
  Apprentice: ApprenticeSigil,
  Scholar: ScholarSigil,
  Master: MasterSigil,
}
