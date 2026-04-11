"use client"

import { useRef } from "react"
import { useInView } from "motion/react"
import { Safari } from "@/components/ui/safari"
import { Iphone } from "@/components/ui/iphone"

interface FeatureCardProps {
  title: string
  description: string
  frame: "safari" | "iphone"
  children: (playing: boolean) => React.ReactNode
}

export function FeatureCard({ title, description, frame, children }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { margin: "-100px", once: false })

  const Frame = frame === "safari" ? Safari : Iphone

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-[#111111] border border-[rgba(255,255,255,0.06)] p-6 flex flex-col"
    >
      <div className={frame === "iphone" ? "max-w-[200px] mx-auto w-full" : "w-full"}>
        <Frame mode="simple" url="tome.app">
          {children(isInView)}
        </Frame>
      </div>
      <div className="mt-5">
        <h3 className="font-[var(--font-display)] text-lg font-bold text-[#FAF7F2]">
          {title}
        </h3>
        <p className="text-sm text-[#7A756D] mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}
