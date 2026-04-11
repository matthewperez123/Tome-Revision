import { BlurFade } from "@/components/ui/blur-fade"

export function VirgilSection() {
  return (
    <section className="bg-background py-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <BlurFade delay={0.1} inView>
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-center text-foreground">
            Your guide through the canon.
          </h2>
        </BlurFade>
      </div>
    </section>
  )
}
