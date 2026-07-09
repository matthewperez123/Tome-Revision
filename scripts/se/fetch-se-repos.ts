#!/usr/bin/env tsx
/**
 * fetch-se-repos.ts — cache the full standardebooks GitHub org repo list.
 *
 * SE publishes one repo per ebook, named `{author}_{title}[_{translator}...]`.
 * We fetch the paginated org repo list (100/page) and cache the repo names to
 * reports/se-repo-index.json so the mapper can validate slugs against ground
 * truth without re-hitting the API. Uses GITHUB_TOKEN if present (higher rate
 * limit); unauthenticated is sufficient for a one-shot listing.
 */
import { writeFileSync, existsSync, readFileSync } from "node:fs"

const OUT = "reports/se-repo-index.json"
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN

interface Repo {
  name: string
  html_url: string
  archived: boolean
  fork: boolean
}

async function main() {
  if (existsSync(OUT) && !process.argv.includes("--force")) {
    const cached = JSON.parse(readFileSync(OUT, "utf8"))
    console.log(`cache hit: ${OUT} has ${cached.repos.length} repos (pass --force to refetch)`)
    return
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "tome-se-mapper",
  }
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`

  const repos: string[] = []
  let page = 1
  for (;;) {
    const url = `https://api.github.com/orgs/standardebooks/repos?per_page=100&page=${page}&type=public`
    const res = await fetch(url, { headers })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`GitHub API ${res.status} on page ${page}: ${body.slice(0, 300)}`)
    }
    const batch = (await res.json()) as Repo[]
    if (batch.length === 0) break
    for (const r of batch) {
      // Book repos are `author_title[...]` (contain an underscore). Skip tooling
      // repos (web, tools, manual, es, ci, etc. — no underscore) and forks.
      if (r.fork) continue
      if (!r.name.includes("_")) continue
      repos.push(r.name)
    }
    process.stdout.write(`\rpage ${page}: ${repos.length} book repos so far`)
    page++
    if (batch.length < 100) break
  }
  process.stdout.write("\n")

  repos.sort()
  writeFileSync(OUT, JSON.stringify({ fetchedAt: new Date().toISOString(), count: repos.length, repos }, null, 0))
  console.log(`wrote ${OUT}: ${repos.length} book repos`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
