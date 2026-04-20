import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

/**
 * Return a single section's full content (lines, stage directions, glosses,
 * annotations, trials).
 * GET /api/structured/hamlet/hamlet_act3_scene1
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ workId: string; sectionId: string }> }
) {
  const { workId, sectionId } = await params
  const filePath = path.join(process.cwd(), "content", workId, `${sectionId}.json`)

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const section = JSON.parse(fs.readFileSync(filePath, "utf-8"))
  return NextResponse.json(section)
}
