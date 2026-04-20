import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

/**
 * Return work meta + TOC for a structured-content work.
 * GET /api/structured/hamlet
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ workId: string }> }
) {
  const { workId } = await params
  const dir = path.join(process.cwd(), "content", workId)

  if (!fs.existsSync(dir)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const meta = JSON.parse(fs.readFileSync(path.join(dir, "_meta.json"), "utf-8"))
  const toc = JSON.parse(fs.readFileSync(path.join(dir, "toc.json"), "utf-8"))

  return NextResponse.json({ meta, toc })
}
