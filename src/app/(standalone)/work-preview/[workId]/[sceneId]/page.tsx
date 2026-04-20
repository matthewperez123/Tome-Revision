/**
 * Generic scene viewer for the /work-preview/[workId]/[sceneId] debug route.
 * Mirrors hamlet-preview's scene page but parameterized for any workId.
 */
import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"
import { SceneClient } from "./scene-client"

interface Line {
  number: number
  speaker?: string
  text: string
}
interface StageDirection {
  after_line: number
  text: string
}
interface Gloss {
  id: string
  line: number
  phrase: string
  definition: string
}
interface Annotation {
  id: string
  line_start: number
  line_end: number
  citation_display: string
  category: string
  title: string
  body: string
  sources: string[]
}
interface Trial {
  id: string
  kind: string
  prompt: string
  options: string[]
  answer_index: number
  wisdom_reward: number
  anchor_line_start: number
  anchor_line_end: number
}
interface Section {
  section_id: string
  act: number | null
  scene: number | null
  scene_title: string
  sequence: number
  line_count: number
  word_count: number
  est_read_minutes: number
  lines: Line[]
  stage_directions: StageDirection[]
  glosses: Gloss[]
  annotations: Annotation[]
  trials: Trial[]
}

export default async function WorkScenePage({
  params,
}: {
  params: Promise<{ workId: string; sceneId: string }>
}) {
  const { workId, sceneId } = await params
  const contentDir = path.join(process.cwd(), "content", workId)
  const filePath = path.join(contentDir, `${sceneId}.json`)

  if (!fs.existsSync(filePath)) {
    notFound()
  }

  const section: Section = JSON.parse(fs.readFileSync(filePath, "utf-8"))

  // Find prev/next from toc
  const toc = JSON.parse(
    fs.readFileSync(path.join(contentDir, "toc.json"), "utf-8")
  )
  const scenes = toc.entries.filter(
    (e: { type: string }) => e.type === "scene" || e.type === "chorus"
  )
  const idx = scenes.findIndex(
    (s: { section_id: string }) => s.section_id === sceneId
  )
  const prev = idx > 0 ? scenes[idx - 1] : null
  const next = idx < scenes.length - 1 ? scenes[idx + 1] : null

  return <SceneClient section={section} prev={prev} next={next} workId={workId} />
}
