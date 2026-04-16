import type { FC } from "react"

export interface AnimatedIconProps {
  className?: string
  isHovered: boolean
  isActive: boolean
}

export type AnimatedIconComponent = FC<AnimatedIconProps>

export interface AnimatedIconMeta {
  name: string
  label: string
  description: string
  animationDuration: number
  hasLoop: boolean
  svgPaths: number
  category: "student" | "teacher"
}
