import { readFile } from "node:fs/promises"
import path from "node:path"

interface ReferenceManifest {
  references: Array<{ id: string; cropPath: string }>
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const manifest = await readManifest()
  const reference = manifest.references.find((item) => item.id === id)
  if (!reference) return new Response("Not found", { status: 404 })

  const resolved = path.resolve(process.cwd(), reference.cropPath)
  const docsRoot = path.resolve(process.cwd(), "docs/cover-system/references")
  if (!resolved.startsWith(docsRoot)) {
    return new Response("Invalid reference path", { status: 400 })
  }

  const bytes = await readFile(resolved)
  return new Response(bytes, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "private, max-age=300",
    },
  })
}

async function readManifest(): Promise<ReferenceManifest> {
  const file = await readFile(path.join(process.cwd(), "docs/cover-system/reference-manifest.json"), "utf8")
  return JSON.parse(file) as ReferenceManifest
}
