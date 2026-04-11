import { BlurFade } from "@/components/ui/blur-fade"

interface TeacherShowcaseShellProps {
  children: React.ReactNode
  heading: string
  subcopy: string
  layout: "mockup-left" | "mockup-right"
  bgClass?: string
}

export function TeacherShowcaseShell({
  children,
  heading,
  subcopy,
  layout,
  bgClass = "bg-background",
}: TeacherShowcaseShellProps) {
  const isLeft = layout === "mockup-left"

  return (
    <section className={`${bgClass} py-24 px-6 md:px-12`}>
      <div
        className={`max-w-5xl mx-auto grid grid-cols-1 ${
          isLeft ? "md:grid-cols-[3fr_2fr]" : "md:grid-cols-[2fr_3fr]"
        } gap-10 items-center`}
      >
        <BlurFade delay={0.1} inView>
          <div className={isLeft ? "" : "order-2 md:order-1"}>
            {isLeft ? children : (
              <>
                <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {heading}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                  {subcopy}
                </p>
              </>
            )}
          </div>
        </BlurFade>
        <BlurFade delay={0.15} inView>
          <div className={isLeft ? "" : "order-1 md:order-2"}>
            {isLeft ? (
              <>
                <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {heading}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                  {subcopy}
                </p>
              </>
            ) : children}
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
