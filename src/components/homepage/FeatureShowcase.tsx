"use client"

import { BlurFade } from "@/components/ui/blur-fade"
import { FeatureCard } from "./FeatureCard"

import { VirgilAnnotationDemo } from "./demos/features/VirgilAnnotationDemo"
import { CrossReferenceDemo } from "./demos/features/CrossReferenceDemo"
import { QuizDemo } from "./demos/features/QuizDemo"
import { ReadingPathDemo } from "./demos/features/ReadingPathDemo"
import { DailyGoalsDemo } from "./demos/features/DailyGoalsDemo"
import { XPLeaderboardDemo } from "./demos/features/XPLeaderboardDemo"
import { ClassroomDemo } from "./demos/features/ClassroomDemo"
import { ShopDemo } from "./demos/features/ShopDemo"
import { BookmarkDemo } from "./demos/features/BookmarkDemo"
import { WordStudyDemo } from "./demos/features/WordStudyDemo"
import { BookCompletionDemo } from "./demos/features/BookCompletionDemo"
import { SealsDemo } from "./demos/features/SealsDemo"

const FEATURES: {
  title: string
  description: string
  frame: "safari" | "iphone"
  Component: React.ComponentType<{ playing?: boolean }>
}[] = [
  {
    title: "Virgil AI Annotations",
    description: "Scholarly footnotes appear as you read, explaining context, vocabulary, and literary devices.",
    frame: "safari",
    Component: VirgilAnnotationDemo,
  },
  {
    title: "Cross-Book References",
    description: "Jump between books that reference each other. Bookmark your place and return instantly.",
    frame: "safari",
    Component: CrossReferenceDemo,
  },
  {
    title: "Quizzes & Trials",
    description: "Every chapter ends with a Trial. Three difficulty tiers adapt to your level.",
    frame: "safari",
    Component: QuizDemo,
  },
  {
    title: "Reading Paths",
    description: "Curated journeys through traditions, themes, and eras. Complete the path, earn the reward.",
    frame: "iphone",
    Component: ReadingPathDemo,
  },
  {
    title: "Daily Goals & Streaks",
    description: "Set daily reading goals. Build a Flame streak. Miss a day and it resets.",
    frame: "iphone",
    Component: DailyGoalsDemo,
  },
  {
    title: "Wisdom XP & Leaderboard",
    description: "Earn Wisdom for correct answers and completed chapters. Compete in weekly leagues.",
    frame: "iphone",
    Component: XPLeaderboardDemo,
  },
  {
    title: "Classrooms",
    description: "Teachers assign books, track reading in real time, and build custom quizzes.",
    frame: "safari",
    Component: ClassroomDemo,
  },
  {
    title: "Shop & Cosmetics",
    description: "Earn coins by reading. Spend on streak freezes, themes, and Virgil outfits.",
    frame: "iphone",
    Component: ShopDemo,
  },
  {
    title: "Bookmarks & Shelves",
    description: "Heart a book to save it. Organize into shelves: Favorites, Reading, Want to Read.",
    frame: "iphone",
    Component: BookmarkDemo,
  },
  {
    title: "Word Study",
    description: "Hover any word for definition, etymology, and pronunciation. Save to your vocabulary.",
    frame: "safari",
    Component: WordStudyDemo,
  },
  {
    title: "Book Completion",
    description: "Finish a book and celebrate with stats, ratings, and personalized recommendations.",
    frame: "iphone",
    Component: BookCompletionDemo,
  },
  {
    title: "Seals & Achievements",
    description: "21 achievement seals across 6 categories. Unlock them by reading across traditions.",
    frame: "iphone",
    Component: SealsDemo,
  },
]

export function FeatureShowcase() {
  return (
    <section className="bg-[#0A0A0A] py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <BlurFade delay={0.1} inView>
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-center text-[#FAF7F2] mb-4">
            Everything you need to master the canon.
          </h2>
          <p className="text-center text-sm text-[#7A756D] mb-12 max-w-lg mx-auto">
            Twelve features designed around the way great literature should be read, studied, and remembered.
          </p>
        </BlurFade>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feat, i) => (
            <BlurFade key={feat.title} delay={0.05 + i * 0.03} inView>
              <FeatureCard title={feat.title} description={feat.description} frame={feat.frame}>
                {(playing) => <feat.Component playing={playing} />}
              </FeatureCard>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
