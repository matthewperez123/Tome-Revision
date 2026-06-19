#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const WIDTH = 1024
const HEIGHT = 1536
const DEFAULT_SOURCE_DIR = "public/covers/tome/source"
const DEFAULT_ART_DIR = "public/art-factory/generated/monumental-literary-paths-v1"

const PALETTES = {
  ochrePlain: {
    paper: "#f3e4c7",
    sky: "#f7e8cc",
    pale: "#fff4d6",
    path: "#f8edcf",
    deep: "#0f2632",
    mid: "#2f5661",
    land: "#c49235",
    land2: "#a97328",
    sun: "#d69b35",
    accent: "#c9563d",
    shadow: "#071821",
  },
  inkSea: {
    paper: "#e9d7b7",
    sky: "#102e39",
    pale: "#f1dfbd",
    path: "#ead6aa",
    deep: "#071c26",
    mid: "#174452",
    land: "#203f45",
    land2: "#112b35",
    sun: "#d7a64a",
    accent: "#dd704d",
    shadow: "#041017",
  },
  alpineBlue: {
    paper: "#eee2cc",
    sky: "#dae0d8",
    pale: "#f7efd8",
    path: "#efe7d4",
    deep: "#17313d",
    mid: "#466674",
    land: "#74828a",
    land2: "#344b59",
    sun: "#d09a3c",
    accent: "#d85f43",
    shadow: "#0b1a22",
  },
  cypressEstate: {
    paper: "#f4e5c8",
    sky: "#f4e5c8",
    pale: "#fbf0d5",
    path: "#fff3d3",
    deep: "#173a3a",
    mid: "#537260",
    land: "#789066",
    land2: "#314f43",
    sun: "#d6a13a",
    accent: "#bb5b3d",
    shadow: "#0a2223",
  },
  moonCastle: {
    paper: "#e6d7bc",
    sky: "#102635",
    pale: "#f1dfbd",
    path: "#e9d7b4",
    deep: "#071722",
    mid: "#1c3b47",
    land: "#21333c",
    land2: "#0e222e",
    sun: "#f0dfb9",
    accent: "#d85e42",
    shadow: "#030b11",
  },
  stormMoor: {
    paper: "#eadbbf",
    sky: "#d9d3bf",
    pale: "#f4e7ca",
    path: "#f1dfb9",
    deep: "#102831",
    mid: "#315760",
    land: "#486b61",
    land2: "#203c3c",
    sun: "#dfb34d",
    accent: "#d45d45",
    shadow: "#07161b",
  },
  oxbloodCity: {
    paper: "#ead6b5",
    sky: "#efdcb8",
    pale: "#f8eacb",
    path: "#f6e8c7",
    deep: "#25151b",
    mid: "#5e2428",
    land: "#873334",
    land2: "#3e2026",
    sun: "#d49a37",
    accent: "#e15c41",
    shadow: "#11080b",
  },
  frostRussia: {
    paper: "#efe4d1",
    sky: "#dce2de",
    pale: "#f8f1df",
    path: "#f8f0df",
    deep: "#142638",
    mid: "#536d79",
    land: "#88969a",
    land2: "#334958",
    sun: "#d7a643",
    accent: "#b94d3d",
    shadow: "#091520",
  },
  emberNight: {
    paper: "#e6d4b4",
    sky: "#0c1b28",
    pale: "#ead8b5",
    path: "#e7d1a9",
    deep: "#06111b",
    mid: "#1f4050",
    land: "#283944",
    land2: "#111f2b",
    sun: "#d5a144",
    accent: "#e0673f",
    shadow: "#02070d",
  },
  mossGarden: {
    paper: "#efe0c3",
    sky: "#efe0c3",
    pale: "#f8ecd1",
    path: "#faefd4",
    deep: "#102f2a",
    mid: "#456953",
    land: "#71895d",
    land2: "#28463b",
    sun: "#d4a13c",
    accent: "#c85c42",
    shadow: "#071a17",
  },
  mineralTeal: {
    paper: "#eadbbe",
    sky: "#cdd6cc",
    pale: "#f3e7ca",
    path: "#f3e4c3",
    deep: "#0b2a31",
    mid: "#25606a",
    land: "#6f8170",
    land2: "#2a4a4e",
    sun: "#d49b37",
    accent: "#d36a48",
    shadow: "#041417",
  },
  plumDusk: {
    paper: "#ead8bf",
    sky: "#e2d2bd",
    pale: "#f4e4c9",
    path: "#f2dfbd",
    deep: "#21192e",
    mid: "#4e3b5d",
    land: "#716177",
    land2: "#2f263d",
    sun: "#d7a045",
    accent: "#cf6148",
    shadow: "#0d0a14",
  },
  roseFog: {
    paper: "#efd9c0",
    sky: "#ead2c4",
    pale: "#f7e8d4",
    path: "#f8e7ca",
    deep: "#23313b",
    mid: "#6f5962",
    land: "#9b7467",
    land2: "#4a3e46",
    sun: "#d49c3c",
    accent: "#c24f4a",
    shadow: "#10161d",
  },
  slateGold: {
    paper: "#eadcc0",
    sky: "#d5d8cc",
    pale: "#f6e8c9",
    path: "#f2e1bc",
    deep: "#162232",
    mid: "#3d5865",
    land: "#68716a",
    land2: "#2a3840",
    sun: "#d6a13d",
    accent: "#cb5c43",
    shadow: "#090f17",
  },
  lampBlack: {
    paper: "#e8d6b5",
    sky: "#081620",
    pale: "#ecd9b6",
    path: "#e9d4ab",
    deep: "#040b12",
    mid: "#13303c",
    land: "#1b3336",
    land2: "#0b1c25",
    sun: "#e2b652",
    accent: "#e46d43",
    shadow: "#010509",
  },
  saffronJade: {
    paper: "#f0dfbd",
    sky: "#f0dfbd",
    pale: "#f8ebca",
    path: "#fbefcc",
    deep: "#0f3430",
    mid: "#31665a",
    land: "#b98d39",
    land2: "#516b45",
    sun: "#d8a23c",
    accent: "#c9503f",
    shadow: "#061a17",
  },
}

const RECIPES = [
  { bookId: "don-quixote", title: "Don Quixote", palette: "ochrePlain", motif: "windmills", celestial: "sun" },
  { bookId: "the-divine-comedy", title: "The Divine Comedy", palette: "alpineBlue", motif: "terracedMountain", celestial: "star" },
  { bookId: "the-odyssey", title: "The Odyssey", palette: "inkSea", motif: "moonSea", celestial: "moon" },
  { bookId: "the-iliad", title: "The Iliad", palette: "roseFog", motif: "shoreWall", celestial: "sun" },
  { bookId: "macbeth", title: "Macbeth", palette: "moonCastle", motif: "battlement", celestial: "moon" },
  { bookId: "frankenstein", title: "Frankenstein", palette: "alpineBlue", motif: "alpineLaboratory", celestial: "lightning" },
  { bookId: "moby-dick", title: "Moby-Dick", palette: "inkSea", motif: "whaleCurve", celestial: "none" },
  { bookId: "pride-and-prejudice", title: "Pride and Prejudice", palette: "cypressEstate", motif: "estateRoad", celestial: "sun" },
  { bookId: "hamlet", title: "Hamlet", palette: "moonCastle", motif: "elsinore", celestial: "moon" },
  { bookId: "jane-eyre", title: "Jane Eyre", palette: "stormMoor", motif: "moorHouse", celestial: "window" },
  { bookId: "wuthering-heights", title: "Wuthering Heights", palette: "stormMoor", motif: "moorRidge", celestial: "moon" },
  { bookId: "dracula", title: "Dracula", palette: "emberNight", motif: "gothicRoad", celestial: "moon" },
  { bookId: "the-count-of-monte-cristo", title: "The Count of Monte Cristo", palette: "inkSea", motif: "islandFortress", celestial: "window" },
  { bookId: "treasure-island", title: "Treasure Island", palette: "saffronJade", motif: "tropicalCove", celestial: "compass" },
  { bookId: "alices-adventures-in-wonderland", title: "Alice's Adventures in Wonderland", palette: "mossGarden", motif: "hedgeDoor", celestial: "key" },
  { bookId: "the-great-gatsby", title: "The Great Gatsby", palette: "lampBlack", motif: "bayLight", celestial: "beacon" },
  { bookId: "war-and-peace", title: "War and Peace", palette: "frostRussia", motif: "warPlain", celestial: "sun" },
  { bookId: "anna-karenina", title: "Anna Karenina", palette: "roseFog", motif: "winterStation", celestial: "lamp" },
  { bookId: "crime-and-punishment", title: "Crime and Punishment", palette: "frostRussia", motif: "canalCity", celestial: "lamp" },
  { bookId: "les-miserables", title: "Les Miserables", palette: "oxbloodCity", motif: "barricadeCity", celestial: "sun" },
  { bookId: "a-tale-of-two-cities", title: "A Tale of Two Cities", palette: "oxbloodCity", motif: "twoCities", celestial: "sun" },
  { bookId: "a-christmas-carol", title: "A Christmas Carol", palette: "frostRussia", motif: "winterStreet", celestial: "star" },
  { bookId: "middlemarch", title: "Middlemarch", palette: "mossGarden", motif: "provincialRoads", celestial: "sun" },
  { bookId: "great-expectations", title: "Great Expectations", palette: "slateGold", motif: "marshHouse", celestial: "moon" },
  { bookId: "oliver-twist", title: "Oliver Twist", palette: "oxbloodCity", motif: "workhouseLane", celestial: "window" },
  { bookId: "the-time-machine", title: "The Time Machine", palette: "mineralTeal", motif: "timePortal", celestial: "portal" },
  { bookId: "the-war-of-the-worlds", title: "The War of the Worlds", palette: "emberNight", motif: "redPlanetRoad", celestial: "planet" },
  { bookId: "the-origin-of-species", title: "The Origin of Species", palette: "mossGarden", motif: "evolutionTree", celestial: "sun" },
  { bookId: "the-republic", title: "The Republic", palette: "slateGold", motif: "caveRoad", celestial: "sun" },
  { bookId: "meditations", title: "Meditations", palette: "saffronJade", motif: "stoicColumn", celestial: "sun" },
  { bookId: "the-aeneid", title: "The Aeneid", palette: "roseFog", motif: "romanHarbor", celestial: "star" },
  { bookId: "beowulf", title: "Beowulf", palette: "lampBlack", motif: "meadHall", celestial: "fire" },
  { bookId: "the-canterbury-tales", title: "The Canterbury Tales", palette: "mossGarden", motif: "pilgrimRoad", celestial: "sun" },
  { bookId: "le-morte-darthur", title: "Le Morte d'Arthur", palette: "plumDusk", motif: "arthurLake", celestial: "moon" },
  { bookId: "paradise-lost", title: "Paradise Lost", palette: "emberNight", motif: "cosmicGate", celestial: "star" },
  { bookId: "the-tempest", title: "The Tempest", palette: "inkSea", motif: "stormIsland", celestial: "lightning" },
  { bookId: "the-faerie-queene", title: "The Faerie Queene", palette: "plumDusk", motif: "fairyTower", celestial: "star" },
  { bookId: "orlando-furioso", title: "Orlando Furioso", palette: "mineralTeal", motif: "moonValley", celestial: "moon" },
  { bookId: "don-juan", title: "Don Juan", palette: "saffronJade", motif: "satireSea", celestial: "sun" },
  { bookId: "gullivers-travels", title: "Gulliver's Travels", palette: "saffronJade", motif: "giantCoast", celestial: "sun" },
  { bookId: "candide", title: "Candide", palette: "ochrePlain", motif: "gardenWorld", celestial: "sun" },
  { bookId: "heart-of-darkness", title: "Heart of Darkness", palette: "lampBlack", motif: "riverMouth", celestial: "sun" },
  { bookId: "the-art-of-war", title: "The Art of War", palette: "slateGold", motif: "militaryPass", celestial: "sun" },
  { bookId: "the-call-of-the-wild", title: "The Call of the Wild", palette: "frostRussia", motif: "snowTrail", celestial: "moon" },
  { bookId: "a-dolls-house", title: "A Doll's House", palette: "roseFog", motif: "houseDoor", celestial: "window" },
  { bookId: "the-secret-garden", title: "The Secret Garden", palette: "mossGarden", motif: "gardenWall", celestial: "key" },
  { bookId: "siddhartha", title: "Siddhartha", palette: "saffronJade", motif: "riverTree", celestial: "sun" },
  { bookId: "the-picture-of-dorian-gray", title: "The Picture of Dorian Gray", palette: "plumDusk", motif: "portraitHall", celestial: "window" },
]

function parseArgs(argv) {
  const options = {
    source: DEFAULT_SOURCE_DIR,
    artDir: DEFAULT_ART_DIR,
    overwrite: false,
    ids: undefined,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    const next = argv[i + 1]
    if ((arg === "--source" || arg === "-s") && next) {
      options.source = next
      i += 1
    } else if (arg === "--art-dir" && next) {
      options.artDir = next
      i += 1
    } else if (arg === "--ids" && next) {
      options.ids = new Set(next.split(",").map((id) => id.trim()).filter(Boolean))
      i += 1
    } else if (arg === "--overwrite") {
      options.overwrite = true
    } else if (arg === "--help" || arg === "-h") {
      printHelp()
      process.exit(0)
    }
  }

  return options
}

function printHelp() {
  console.log(`Generate textless Monumental Literary Paths source covers.

Usage:
  node scripts/generate-monumental-path-covers.mjs [options]

Options:
  --source <dir>   Output source PNG folder. Default: ${DEFAULT_SOURCE_DIR}
  --art-dir <dir>  Review sheet and manifest folder. Default: ${DEFAULT_ART_DIR}
  --ids <list>     Comma-separated book ids to generate.
  --overwrite      Replace existing source PNGs.
`)
}

function seededRandom(seed) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return function next() {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function n(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2)
}

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function tag(name, attrs = {}, children = "") {
  const attr = Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([key, value]) => ` ${key}="${esc(value)}"`)
    .join("")
  return children ? `<${name}${attr}>${children}</${name}>` : `<${name}${attr}/>`
}

function pathEl(d, attrs = {}) {
  return tag("path", { d, ...attrs })
}

function poly(points, attrs = {}) {
  return tag("polygon", { points: points.map(([x, y]) => `${n(x)},${n(y)}`).join(" "), ...attrs })
}

function rect(x, y, width, height, attrs = {}) {
  return tag("rect", { x: n(x), y: n(y), width: n(width), height: n(height), ...attrs })
}

function circle(cx, cy, r, attrs = {}) {
  return tag("circle", { cx: n(cx), cy: n(cy), r: n(r), ...attrs })
}

function line(x1, y1, x2, y2, attrs = {}) {
  return tag("line", { x1: n(x1), y1: n(y1), x2: n(x2), y2: n(y2), ...attrs })
}

function road(points, width, color, opacity = 1) {
  const [start, ...rest] = points
  let d = `M${n(start[0])},${n(start[1])}`
  for (let i = 0; i < rest.length; i += 1) {
    const prev = i === 0 ? start : rest[i - 1]
    const current = rest[i]
    const cx1 = prev[0] + (current[0] - prev[0]) * 0.36
    const cy1 = prev[1] + (current[1] - prev[1]) * 0.08
    const cx2 = prev[0] + (current[0] - prev[0]) * 0.64
    const cy2 = current[1] - (current[1] - prev[1]) * 0.08
    d += ` C${n(cx1)},${n(cy1)} ${n(cx2)},${n(cy2)} ${n(current[0])},${n(current[1])}`
  }
  return pathEl(d, {
    fill: "none",
    stroke: color,
    "stroke-width": width,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    opacity,
  })
}

function tinyFigure(x, y, scale, p, attrs = {}) {
  const color = attrs.color ?? p.shadow
  return tag("g", { opacity: attrs.opacity ?? 0.9 }, [
    circle(x, y - 22 * scale, 6 * scale, { fill: color }),
    pathEl(`M${n(x)},${n(y - 16 * scale)} L${n(x - 8 * scale)},${n(y + 18 * scale)} L${n(x + 8 * scale)},${n(y + 18 * scale)} Z`, { fill: color }),
    line(x - 5 * scale, y + 16 * scale, x - 10 * scale, y + 36 * scale, { stroke: color, "stroke-width": 3 * scale, "stroke-linecap": "round" }),
    line(x + 5 * scale, y + 16 * scale, x + 10 * scale, y + 36 * scale, { stroke: color, "stroke-width": 3 * scale, "stroke-linecap": "round" }),
  ].join(""))
}

function tinyRider(x, y, scale, p) {
  return tag("g", {}, [
    pathEl(`M${n(x - 36 * scale)},${n(y)} Q${n(x)},${n(y - 26 * scale)} ${n(x + 48 * scale)},${n(y)} Q${n(x + 26 * scale)},${n(y + 18 * scale)} ${n(x - 28 * scale)},${n(y + 13 * scale)} Z`, { fill: p.shadow, opacity: 0.86 }),
    tinyFigure(x + 4 * scale, y - 22 * scale, 0.78 * scale, p),
    line(x + 14 * scale, y - 44 * scale, x + 34 * scale, y - 64 * scale, { stroke: p.accent, "stroke-width": 3 * scale, "stroke-linecap": "round" }),
  ].join(""))
}

function smallBoat(x, y, scale, p, sail = true) {
  const parts = [
    pathEl(`M${n(x - 78 * scale)},${n(y)} Q${n(x)},${n(y + 34 * scale)} ${n(x + 78 * scale)},${n(y)} L${n(x + 42 * scale)},${n(y + 30 * scale)} L${n(x - 42 * scale)},${n(y + 30 * scale)} Z`, { fill: p.shadow, opacity: 0.92 }),
    line(x, y - 78 * scale, x, y + 8 * scale, { stroke: p.shadow, "stroke-width": 5 * scale, "stroke-linecap": "round" }),
  ]
  if (sail) {
    parts.push(poly([[x + 5 * scale, y - 72 * scale], [x + 5 * scale, y - 10 * scale], [x + 54 * scale, y - 18 * scale]], { fill: p.pale, opacity: 0.85 }))
    parts.push(poly([[x - 5 * scale, y - 62 * scale], [x - 5 * scale, y - 12 * scale], [x - 42 * scale, y - 20 * scale]], { fill: p.mid, opacity: 0.65 }))
  }
  return tag("g", {}, parts.join(""))
}

function house(x, y, w, h, p, attrs = {}) {
  const color = attrs.color ?? p.deep
  return tag("g", { opacity: attrs.opacity ?? 0.94 }, [
    rect(x, y, w, h, { fill: color }),
    poly([[x - w * 0.08, y], [x + w * 0.5, y - h * 0.42], [x + w * 1.08, y]], { fill: attrs.roof ?? p.shadow }),
    rect(x + w * 0.62, y + h * 0.3, w * 0.12, h * 0.18, { fill: p.sun, opacity: 0.86 }),
  ].join(""))
}

function castle(x, y, w, h, p, attrs = {}) {
  const color = attrs.color ?? p.deep
  const parts = [
    rect(x, y + h * 0.28, w, h * 0.72, { fill: color }),
    rect(x + w * 0.07, y + h * 0.04, w * 0.16, h * 0.96, { fill: color }),
    rect(x + w * 0.73, y + h * 0.13, w * 0.19, h * 0.87, { fill: color }),
    rect(x + w * 0.37, y, w * 0.22, h, { fill: color }),
  ]
  for (let i = 0; i < 8; i += 1) {
    parts.push(rect(x + i * (w / 8), y + h * 0.22, w / 18, h * 0.08, { fill: color }))
  }
  if (attrs.window !== false) parts.push(rect(x + w * 0.48, y + h * 0.54, w * 0.06, h * 0.12, { fill: p.sun, opacity: 0.75 }))
  return tag("g", { opacity: attrs.opacity ?? 0.94 }, parts.join(""))
}

function cypress(x, y, height, p, color = p.deep) {
  return pathEl(`M${n(x)},${n(y)} C${n(x - height * 0.16)},${n(y - height * 0.45)} ${n(x - height * 0.08)},${n(y - height * 0.92)} ${n(x)},${n(y - height)} C${n(x + height * 0.1)},${n(y - height * 0.72)} ${n(x + height * 0.16)},${n(y - height * 0.34)} ${n(x)},${n(y)} Z`, { fill: color, opacity: 0.92 })
}

function windmill(x, y, scale, p) {
  const towerW = 110 * scale
  const towerH = 330 * scale
  const cx = x
  const cy = y - towerH + 72 * scale
  const blade = (rotation) => rect(cx - 9 * scale, cy - 150 * scale, 18 * scale, 300 * scale, {
    fill: p.pale,
    opacity: 0.8,
    transform: `rotate(${rotation} ${n(cx)} ${n(cy)})`,
    stroke: p.deep,
    "stroke-width": 5 * scale,
  })
  return tag("g", {}, [
    pathEl(`M${n(x - towerW * 0.62)},${n(y)} L${n(x - towerW * 0.38)},${n(y - towerH)} L${n(x + towerW * 0.38)},${n(y - towerH)} L${n(x + towerW * 0.62)},${n(y)} Z`, { fill: p.deep, opacity: 0.9 }),
    poly([[x - towerW * 0.54, y - towerH], [x, y - towerH - 105 * scale], [x + towerW * 0.54, y - towerH]], { fill: p.shadow, opacity: 0.94 }),
    blade(35),
    blade(125),
    circle(cx, cy, 18 * scale, { fill: p.shadow }),
    rect(x - 14 * scale, y - 130 * scale, 28 * scale, 58 * scale, { fill: p.shadow, opacity: 0.8 }),
  ].join(""))
}

function mountain(points, fill, opacity = 1) {
  return poly(points, { fill, opacity })
}

function seaLines(rand, p, yStart = 805, count = 22) {
  const lines = []
  for (let i = 0; i < count; i += 1) {
    const y = yStart + i * 31 + rand() * 8
    const d = `M0,${n(y)} C${n(160 + rand() * 80)},${n(y - 24)} ${n(300 + rand() * 60)},${n(y + 20)} ${n(470 + rand() * 70)},${n(y)} S${n(850 + rand() * 90)},${n(y - 22)} 1024,${n(y + 4)}`
    lines.push(pathEl(d, { fill: "none", stroke: p.pale, "stroke-width": 3 + rand() * 3, opacity: 0.18 + rand() * 0.14 }))
  }
  return lines.join("")
}

function grain(rand, p) {
  const specks = []
  for (let i = 0; i < 520; i += 1) {
    const r = 0.7 + rand() * 2.7
    specks.push(circle(rand() * WIDTH, rand() * HEIGHT, r, {
      fill: rand() > 0.52 ? p.shadow : p.pale,
      opacity: 0.035 + rand() * 0.08,
    }))
  }
  for (let i = 0; i < 70; i += 1) {
    const x = rand() * WIDTH
    const y = rand() * HEIGHT
    specks.push(line(x, y, x + 12 + rand() * 32, y - 3 + rand() * 6, {
      stroke: p.shadow,
      "stroke-width": 1,
      opacity: 0.035,
    }))
  }
  return tag("g", { "mix-blend-mode": "multiply" }, specks.join(""))
}

function celestial(recipe, p) {
  if (recipe.celestial === "none") return ""
  if (recipe.celestial === "moon") return circle(718, 214, 112, { fill: p.pale, opacity: 0.94 })
  if (recipe.celestial === "star") {
    return poly([[512, 94], [542, 168], [620, 168], [556, 214], [580, 288], [512, 244], [444, 288], [468, 214], [404, 168], [482, 168]], { fill: p.sun, opacity: 0.88 })
  }
  if (recipe.celestial === "compass") {
    return tag("g", { opacity: 0.56 }, [
      circle(760, 260, 72, { fill: "none", stroke: p.sun, "stroke-width": 5 }),
      line(760, 170, 760, 350, { stroke: p.sun, "stroke-width": 4 }),
      line(670, 260, 850, 260, { stroke: p.sun, "stroke-width": 4 }),
      poly([[760, 184], [776, 260], [760, 336], [744, 260]], { fill: p.sun, opacity: 0.72 }),
    ].join(""))
  }
  if (recipe.celestial === "key") {
    return tag("g", { opacity: 0.82 }, [
      circle(732, 992, 26, { fill: "none", stroke: p.sun, "stroke-width": 9 }),
      line(758, 992, 840, 992, { stroke: p.sun, "stroke-width": 10, "stroke-linecap": "round" }),
      line(812, 992, 812, 1028, { stroke: p.sun, "stroke-width": 8 }),
      line(842, 992, 842, 1014, { stroke: p.sun, "stroke-width": 8 }),
    ].join(""))
  }
  if (recipe.celestial === "lightning") {
    return poly([[552, 72], [488, 346], [558, 326], [500, 596], [666, 266], [584, 292]], { fill: p.accent, opacity: 0.78 })
  }
  if (recipe.celestial === "beacon") {
    return tag("g", {}, [
      line(770, 712, 846, 520, { stroke: p.sun, "stroke-width": 4, opacity: 0.7 }),
      circle(852, 504, 18, { fill: p.sun }),
    ].join(""))
  }
  if (recipe.celestial === "portal") return circle(512, 386, 120, { fill: "none", stroke: p.sun, "stroke-width": 14, opacity: 0.72 })
  if (recipe.celestial === "planet") return circle(718, 270, 88, { fill: p.accent, opacity: 0.78 })
  if (recipe.celestial === "fire") return circle(512, 810, 36, { fill: p.accent, opacity: 0.88 })
  if (recipe.celestial === "lamp") return circle(566, 640, 28, { fill: p.sun, opacity: 0.78 })
  if (recipe.celestial === "window") return ""
  return circle(748, 244, 78, { fill: p.sun, opacity: 0.82 })
}

function baseGround(p, horizon = 810) {
  return [
    rect(0, horizon, WIDTH, HEIGHT - horizon, { fill: p.land, opacity: 0.86 }),
    pathEl(`M0,${n(horizon + 130)} C220,${n(horizon + 55)} 382,${n(horizon + 186)} 604,${n(horizon + 94)} C778,${n(horizon + 24)} 914,${n(horizon + 48)} 1024,${n(horizon + 8)} L1024,1536 L0,1536 Z`, { fill: p.land2, opacity: 0.56 }),
  ].join("")
}

const RENDERERS = {
  windmills: ({ p }) => [
    baseGround(p, 850),
    road([[420, 1510], [374, 1248], [486, 1050], [414, 890], [548, 730]], 64, p.path, 0.92),
    windmill(708, 782, 1.45, p),
    windmill(314, 872, 0.63, p),
    windmill(132, 920, 0.35, p),
    tinyRider(406, 1078, 1.1, p),
    tinyFigure(320, 1158, 1.02, p),
  ].join(""),

  terracedMountain: ({ p }) => [
    mountain([[72, 1240], [500, 225], [954, 1240]], p.deep, 0.9),
    mountain([[210, 1180], [500, 300], [798, 1180]], p.mid, 0.5),
    road([[512, 1220], [414, 1058], [588, 902], [436, 754], [576, 610], [482, 472], [520, 350]], 54, p.path, 0.9),
    tinyFigure(500, 982, 1.05, p),
    tinyFigure(546, 976, 0.98, p),
  ].join(""),

  moonSea: ({ rand, p }) => [
    rect(0, 640, WIDTH, 896, { fill: p.deep }),
    seaLines(rand, p, 700, 26),
    road([[524, 1394], [550, 1210], [520, 1000], [566, 820], [712, 430]], 58, p.sun, 0.56),
    smallBoat(520, 1070, 0.86, p),
  ].join(""),

  shoreWall: ({ p }) => [
    rect(0, 790, WIDTH, 220, { fill: p.mid, opacity: 0.62 }),
    pathEl("M0,948 C160,914 290,948 416,912 C604,858 794,856 1024,818 L1024,1536 L0,1536 Z", { fill: p.land, opacity: 0.88 }),
    castle(600, 474, 370, 450, p, { color: p.deep, window: false }),
    road([[472, 1510], [534, 1250], [628, 1080], [724, 902]], 60, p.path, 0.84),
    smallBoat(224, 910, 0.48, p),
    smallBoat(338, 884, 0.42, p),
    tinyFigure(690, 984, 0.8, p),
    tinyFigure(724, 982, 0.74, p),
  ].join(""),

  battlement: ({ p }) => [
    rect(0, 912, WIDTH, 624, { fill: p.deep }),
    castle(76, 618, 450, 430, p, { color: p.shadow, window: false }),
    road([[780, 1518], [704, 1308], [642, 1134], [558, 942]], 42, p.path, 0.28),
    tinyFigure(286, 870, 1.2, p, { color: p.shadow }),
    circle(690, 884, 18, { fill: p.accent }),
  ].join(""),

  alpineLaboratory: ({ p }) => [
    mountain([[-90, 1340], [280, 440], [520, 1340]], p.mid, 0.72),
    mountain([[260, 1320], [596, 350], [1110, 1320]], p.deep, 0.86),
    mountain([[438, 1100], [688, 480], [914, 1100]], p.pale, 0.72),
    house(254, 850, 145, 92, p, { color: p.shadow }),
    road([[402, 1510], [470, 1280], [406, 1084], [342, 930]], 48, p.path, 0.8),
    tinyFigure(430, 1220, 1.08, p),
  ].join(""),

  whaleCurve: ({ rand, p }) => [
    rect(0, 560, WIDTH, 976, { fill: p.deep }),
    seaLines(rand, p, 700, 24),
    pathEl("M520,1040 C650,610 918,400 990,212 C910,682 864,1026 688,1248 C570,1326 466,1200 520,1040 Z", { fill: p.pale, opacity: 0.92 }),
    pathEl("M650,1088 C746,994 776,802 820,610", { fill: "none", stroke: p.mid, "stroke-width": 5, opacity: 0.42 }),
    smallBoat(332, 1214, 0.58, p, false),
    circle(260, 1164, 17, { fill: p.accent }),
  ].join(""),

  estateRoad: ({ p }) => [
    baseGround(p, 820),
    road([[522, 1514], [498, 1240], [584, 1030], [512, 842], [654, 664]], 66, p.path, 0.94),
    house(648, 554, 210, 96, p, { color: p.mid }),
    cypress(206, 914, 310, p, p.deep),
    cypress(286, 880, 252, p, p.deep),
    cypress(812, 894, 248, p, p.deep),
    tinyFigure(502, 1190, 1.0, p),
    tinyFigure(544, 1020, 0.86, p),
  ].join(""),

  elsinore: ({ p }) => [
    rect(0, 828, WIDTH, 708, { fill: p.deep }),
    pathEl("M0,856 C184,792 348,864 520,806 C724,746 874,786 1024,734 L1024,1536 L0,1536 Z", { fill: p.land2, opacity: 0.66 }),
    castle(76, 472, 420, 516, p, { color: p.shadow, window: false }),
    road([[802, 1522], [694, 1270], [602, 1084], [442, 920]], 36, p.path, 0.24),
    tinyFigure(360, 655, 0.85, p, { color: p.shadow }),
  ].join(""),

  moorHouse: ({ p }) => [
    baseGround(p, 730),
    pathEl("M0,808 C220,690 424,830 652,714 C778,650 894,664 1024,606 L1024,1536 L0,1536 Z", { fill: p.land2, opacity: 0.72 }),
    road([[480, 1510], [436, 1284], [472, 1080], [576, 872], [690, 704]], 54, p.path, 0.9),
    house(638, 636, 194, 96, p, { color: p.deep }),
    pathEl("M328,726 C280,604 322,514 284,408 M328,724 C366,638 436,600 474,520", { fill: "none", stroke: p.mid, "stroke-width": 8, "stroke-linecap": "round" }),
    tinyFigure(480, 1178, 1.04, p),
  ].join(""),

  moorRidge: ({ p }) => [
    baseGround(p, 760),
    pathEl("M0,936 C210,704 420,856 574,746 C728,636 864,664 1024,548 L1024,1536 L0,1536 Z", { fill: p.land2, opacity: 0.78 }),
    house(594, 642, 204, 116, p, { color: p.shadow }),
    road([[494, 1512], [590, 1260], [566, 1058], [694, 780]], 44, p.path, 0.68),
    tinyFigure(458, 1060, 0.9, p),
  ].join(""),

  gothicRoad: ({ p }) => [
    mountain([[-70, 1240], [512, 486], [1094, 1240]], p.deep, 0.84),
    castle(412, 348, 236, 410, p, { color: p.shadow, window: false }),
    road([[518, 1520], [610, 1260], [492, 1078], [590, 892], [514, 696]], 50, p.path, 0.78),
    pathEl("M282,1250 L338,1190 L398,1250 Z", { fill: p.shadow }),
    circle(358, 1205, 13, { fill: p.sun }),
  ].join(""),

  islandFortress: ({ rand, p }) => [
    rect(0, 778, WIDTH, 758, { fill: p.deep }),
    seaLines(rand, p, 870, 17),
    mountain([[150, 1110], [506, 522], [872, 1110]], p.land2, 0.94),
    castle(362, 482, 280, 278, p, { color: p.shadow }),
    smallBoat(308, 1220, 0.52, p, false),
    circle(270, 1182, 16, { fill: p.accent }),
  ].join(""),

  tropicalCove: ({ p }) => [
    rect(0, 752, WIDTH, 784, { fill: p.mid, opacity: 0.7 }),
    pathEl("M0,1048 C230,936 430,1018 646,874 C806,768 914,770 1024,730 L1024,1536 L0,1536 Z", { fill: p.land, opacity: 0.88 }),
    pathEl("M0,1204 C190,1134 362,1238 568,1124 C718,1042 882,1060 1024,998 L1024,1536 L0,1536 Z", { fill: p.land2, opacity: 0.76 }),
    smallBoat(548, 842, 0.78, p),
    road([[422, 1516], [464, 1290], [574, 1104], [704, 932]], 52, p.path, 0.72),
    pathEl("M158,1030 C146,780 196,572 258,430", { fill: "none", stroke: p.deep, "stroke-width": 22, "stroke-linecap": "round" }),
    pathEl("M252,438 C156,510 110,602 76,706 M254,438 C330,510 376,602 398,714 M254,438 C204,546 210,624 214,732", { fill: "none", stroke: p.deep, "stroke-width": 16, "stroke-linecap": "round" }),
  ].join(""),

  hedgeDoor: ({ p }) => [
    baseGround(p, 780),
    rect(132, 606, 294, 620, { fill: p.deep, opacity: 0.94, rx: 22 }),
    rect(598, 566, 294, 690, { fill: p.deep, opacity: 0.94, rx: 22 }),
    road([[476, 1518], [520, 1288], [502, 1060], [512, 820], [512, 650]], 82, p.path, 0.9),
    rect(472, 676, 80, 132, { fill: p.sun, opacity: 0.88, rx: 38 }),
  ].join(""),

  bayLight: ({ rand, p }) => [
    rect(0, 702, WIDTH, 834, { fill: p.deep }),
    seaLines(rand, p, 830, 18),
    pathEl("M0,890 C230,820 392,886 580,832 C762,778 884,806 1024,762 L1024,900 L0,984 Z", { fill: p.land2, opacity: 0.64 }),
    rect(128, 778, 240, 72, { fill: p.shadow, opacity: 0.8 }),
    circle(218, 802, 8, { fill: p.sun }),
    circle(282, 802, 8, { fill: p.sun }),
    line(142, 1240, 142, 1514, { stroke: p.shadow, "stroke-width": 12 }),
    line(142, 1240, 360, 1280, { stroke: p.shadow, "stroke-width": 10 }),
    tinyFigure(214, 1212, 0.82, p),
  ].join(""),

  warPlain: ({ p }) => [
    baseGround(p, 760),
    road([[510, 1514], [584, 1288], [486, 1108], [580, 918], [508, 740]], 58, p.path, 0.72),
    pathEl("M0,970 C220,870 336,938 518,830 C688,730 832,738 1024,640 L1024,1536 L0,1536 Z", { fill: p.land2, opacity: 0.62 }),
    line(132, 930, 238, 814, { stroke: p.deep, "stroke-width": 10 }),
    line(240, 928, 132, 814, { stroke: p.deep, "stroke-width": 10 }),
    line(732, 862, 820, 766, { stroke: p.deep, "stroke-width": 9 }),
    line(820, 862, 732, 766, { stroke: p.deep, "stroke-width": 9 }),
    tinyFigure(502, 1056, 0.82, p),
  ].join(""),

  winterStation: ({ p }) => [
    rect(0, 752, WIDTH, 784, { fill: p.land, opacity: 0.62 }),
    road([[520, 1516], [528, 1280], [512, 1050], [526, 780]], 88, p.path, 0.86),
    rect(632, 662, 250, 132, { fill: p.deep, opacity: 0.9 }),
    rect(662, 602, 46, 60, { fill: p.deep }),
    line(158, 1010, 908, 820, { stroke: p.shadow, "stroke-width": 12, opacity: 0.7 }),
    line(172, 1062, 922, 872, { stroke: p.shadow, "stroke-width": 8, opacity: 0.5 }),
    tinyFigure(462, 1080, 0.9, p),
  ].join(""),

  canalCity: ({ p }) => [
    rect(0, 742, WIDTH, 794, { fill: p.land, opacity: 0.62 }),
    pathEl("M0,1034 C260,956 448,1004 604,918 C770,826 884,810 1024,762 L1024,1536 L0,1536 Z", { fill: p.deep, opacity: 0.86 }),
    road([[406, 1512], [480, 1260], [536, 1054], [596, 846]], 50, p.path, 0.58),
    castle(104, 512, 310, 364, p, { color: p.mid, opacity: 0.82 }),
    circle(650, 836, 18, { fill: p.sun }),
    tinyFigure(448, 1200, 0.94, p),
  ].join(""),

  barricadeCity: ({ p }) => [
    rect(0, 760, WIDTH, 776, { fill: p.land2, opacity: 0.72 }),
    rect(0, 452, 244, 832, { fill: p.deep, opacity: 0.9 }),
    rect(780, 420, 244, 870, { fill: p.deep, opacity: 0.9 }),
    road([[514, 1514], [514, 1260], [516, 1000], [514, 668]], 96, p.path, 0.76),
    pathEl("M300,1086 L722,990 L752,1118 L286,1202 Z", { fill: p.shadow, opacity: 0.82 }),
    line(520, 1010, 520, 872, { stroke: p.accent, "stroke-width": 10 }),
    poly([[520, 872], [600, 902], [520, 932]], { fill: p.accent }),
  ].join(""),

  twoCities: ({ p }) => [
    rect(0, 798, WIDTH, 738, { fill: p.land, opacity: 0.64 }),
    rect(0, 604, 330, 420, { fill: p.deep, opacity: 0.88 }),
    rect(700, 560, 324, 464, { fill: p.deep, opacity: 0.88 }),
    road([[512, 1514], [456, 1260], [562, 1050], [484, 850], [512, 640]], 70, p.path, 0.76),
    circle(364, 760, 16, { fill: p.sun }),
    circle(812, 730, 16, { fill: p.sun }),
  ].join(""),

  winterStreet: ({ p }) => [
    rect(0, 790, WIDTH, 746, { fill: p.land, opacity: 0.52 }),
    rect(90, 600, 310, 470, { fill: p.deep, opacity: 0.88 }),
    rect(672, 560, 270, 510, { fill: p.deep, opacity: 0.82 }),
    road([[514, 1516], [518, 1290], [506, 1038], [514, 710]], 110, p.path, 0.88),
    rect(198, 734, 50, 72, { fill: p.sun, opacity: 0.84 }),
    tinyFigure(520, 1102, 0.92, p),
  ].join(""),

  provincialRoads: ({ p }) => [
    baseGround(p, 750),
    road([[510, 1512], [514, 1250], [488, 1034], [518, 812]], 64, p.path, 0.9),
    road([[80, 1180], [308, 1064], [516, 908], [904, 722]], 34, p.path, 0.62),
    house(640, 652, 158, 86, p, { color: p.mid }),
    house(232, 804, 124, 72, p, { color: p.deep }),
    circle(764, 622, 12, { fill: p.sun }),
    tinyFigure(506, 1110, 0.82, p),
  ].join(""),

  marshHouse: ({ p }) => [
    rect(0, 780, WIDTH, 756, { fill: p.land, opacity: 0.66 }),
    pathEl("M0,1020 C160,934 344,1008 520,914 C714,810 836,848 1024,750 L1024,1536 L0,1536 Z", { fill: p.land2, opacity: 0.68 }),
    road([[450, 1518], [430, 1280], [480, 1040], [650, 784]], 54, p.path, 0.8),
    house(642, 700, 190, 108, p, { color: p.deep }),
    tinyFigure(456, 1186, 0.88, p),
  ].join(""),

  workhouseLane: ({ p }) => [
    rect(0, 760, WIDTH, 776, { fill: p.land2, opacity: 0.72 }),
    rect(96, 492, 832, 482, { fill: p.deep, opacity: 0.88 }),
    rect(456, 360, 112, 132, { fill: p.deep }),
    road([[512, 1518], [514, 1278], [512, 1030], [512, 760]], 86, p.path, 0.76),
    rect(486, 760, 54, 100, { fill: p.sun, opacity: 0.78 }),
    tinyFigure(510, 1140, 0.76, p),
  ].join(""),

  timePortal: ({ p }) => [
    baseGround(p, 820),
    road([[512, 1518], [514, 1290], [516, 1048], [514, 642], [512, 386]], 46, p.path, 0.78),
    circle(512, 386, 174, { fill: "none", stroke: p.deep, "stroke-width": 22, opacity: 0.72 }),
    circle(512, 386, 96, { fill: "none", stroke: p.mid, "stroke-width": 9, opacity: 0.62 }),
    rect(454, 1020, 116, 70, { fill: p.shadow, opacity: 0.86, rx: 8 }),
    circle(474, 1094, 18, { fill: p.shadow }),
    circle(550, 1094, 18, { fill: p.shadow }),
  ].join(""),

  redPlanetRoad: ({ p }) => [
    rect(0, 800, WIDTH, 736, { fill: p.land2, opacity: 0.78 }),
    road([[512, 1516], [480, 1280], [538, 1050], [510, 780]], 60, p.path, 0.5),
    line(244, 916, 394, 1180, { stroke: p.shadow, "stroke-width": 12, opacity: 0.88 }),
    line(780, 906, 628, 1186, { stroke: p.shadow, "stroke-width": 12, opacity: 0.88 }),
    circle(512, 920, 42, { fill: p.shadow, opacity: 0.9 }),
    tinyFigure(430, 1232, 0.82, p),
  ].join(""),

  evolutionTree: ({ p }) => [
    baseGround(p, 810),
    road([[512, 1514], [518, 1260], [512, 1060], [512, 830]], 58, p.path, 0.8),
    line(512, 950, 512, 514, { stroke: p.deep, "stroke-width": 34, "stroke-linecap": "round" }),
    pathEl("M512,660 C390,574 312,520 254,414 M512,642 C616,560 692,512 774,392 M512,752 C410,748 318,734 214,682 M512,738 C640,730 748,704 856,632", { fill: "none", stroke: p.deep, "stroke-width": 21, "stroke-linecap": "round" }),
    circle(248, 406, 20, { fill: p.mid }),
    circle(774, 392, 20, { fill: p.mid }),
    circle(214, 682, 17, { fill: p.mid }),
    circle(856, 632, 17, { fill: p.mid }),
  ].join(""),

  caveRoad: ({ p }) => [
    rect(0, 710, WIDTH, 826, { fill: p.land2, opacity: 0.78 }),
    pathEl("M0,420 C270,168 732,168 1024,420 L1024,1536 L0,1536 Z", { fill: p.deep, opacity: 0.92 }),
    circle(512, 468, 152, { fill: p.pale, opacity: 0.9 }),
    road([[512, 1514], [514, 1250], [512, 1000], [512, 610]], 84, p.path, 0.82),
    tinyFigure(506, 1102, 0.95, p),
  ].join(""),

  stoicColumn: ({ p }) => [
    baseGround(p, 830),
    road([[512, 1514], [510, 1272], [512, 1050], [512, 790]], 64, p.path, 0.76),
    rect(376, 520, 272, 66, { fill: p.deep, opacity: 0.9 }),
    rect(410, 586, 48, 374, { fill: p.deep, opacity: 0.88 }),
    rect(488, 586, 48, 374, { fill: p.deep, opacity: 0.88 }),
    rect(566, 586, 48, 374, { fill: p.deep, opacity: 0.88 }),
    rect(360, 960, 304, 64, { fill: p.deep, opacity: 0.9 }),
    tinyFigure(512, 1160, 0.84, p),
  ].join(""),

  romanHarbor: ({ rand, p }) => [
    rect(0, 800, WIDTH, 736, { fill: p.mid, opacity: 0.62 }),
    seaLines(rand, p, 900, 12),
    pathEl("M0,1050 C210,936 400,990 590,900 C762,820 902,824 1024,770 L1024,1536 L0,1536 Z", { fill: p.land, opacity: 0.82 }),
    castle(628, 568, 270, 270, p, { color: p.deep, window: false }),
    road([[490, 1512], [562, 1280], [648, 1042], [738, 786]], 56, p.path, 0.78),
    smallBoat(298, 850, 0.74, p),
  ].join(""),

  meadHall: ({ p }) => [
    rect(0, 806, WIDTH, 730, { fill: p.land2, opacity: 0.84 }),
    road([[512, 1514], [518, 1290], [512, 1080], [512, 852]], 66, p.path, 0.48),
    house(310, 624, 404, 206, p, { color: p.deep, roof: p.shadow }),
    rect(488, 742, 48, 82, { fill: p.accent, opacity: 0.84 }),
    pathEl("M0,1122 C220,1040 394,1124 560,1010 C740,884 880,944 1024,850 L1024,1536 L0,1536 Z", { fill: p.shadow, opacity: 0.52 }),
  ].join(""),

  pilgrimRoad: ({ p }) => [
    baseGround(p, 780),
    road([[512, 1514], [492, 1240], [560, 1030], [478, 850], [630, 612]], 68, p.path, 0.88),
    castle(676, 410, 190, 300, p, { color: p.deep, window: false }),
    tinyFigure(452, 1152, 0.78, p),
    tinyFigure(502, 1106, 0.74, p),
    tinyFigure(552, 1074, 0.7, p),
  ].join(""),

  arthurLake: ({ rand, p }) => [
    rect(0, 780, WIDTH, 756, { fill: p.deep, opacity: 0.72 }),
    seaLines(rand, p, 910, 12),
    castle(610, 450, 250, 350, p, { color: p.shadow }),
    road([[512, 1516], [530, 1280], [568, 1070], [702, 772]], 46, p.path, 0.42),
    line(300, 1040, 382, 880, { stroke: p.sun, "stroke-width": 10, "stroke-linecap": "round" }),
    line(338, 906, 420, 946, { stroke: p.sun, "stroke-width": 7, "stroke-linecap": "round" }),
  ].join(""),

  cosmicGate: ({ p }) => [
    rect(0, 0, WIDTH, HEIGHT, { fill: p.deep }),
    circle(512, 504, 286, { fill: p.shadow, opacity: 0.74 }),
    circle(512, 504, 180, { fill: p.pale, opacity: 0.16 }),
    road([[512, 1514], [512, 1260], [512, 960], [512, 620]], 76, p.path, 0.32),
    pathEl("M248,830 C294,620 392,502 512,392 C634,504 732,620 776,830", { fill: "none", stroke: p.sun, "stroke-width": 16, opacity: 0.72 }),
    tinyFigure(476, 1148, 0.78, p),
    tinyFigure(548, 1148, 0.78, p),
  ].join(""),

  stormIsland: ({ rand, p }) => [
    rect(0, 736, WIDTH, 800, { fill: p.deep }),
    seaLines(rand, p, 820, 20),
    mountain([[246, 1130], [512, 620], [792, 1130]], p.land2, 0.9),
    road([[512, 1518], [480, 1280], [552, 1084], [512, 820]], 50, p.path, 0.44),
    smallBoat(318, 1010, 0.62, p),
  ].join(""),

  fairyTower: ({ p }) => [
    baseGround(p, 780),
    road([[512, 1514], [534, 1280], [488, 1050], [528, 820], [512, 548]], 62, p.path, 0.82),
    castle(426, 314, 210, 430, p, { color: p.deep }),
    cypress(210, 1010, 350, p, p.mid),
    cypress(820, 950, 300, p, p.mid),
    tinyFigure(506, 1138, 0.82, p),
  ].join(""),

  moonValley: ({ p }) => [
    baseGround(p, 820),
    road([[512, 1514], [562, 1270], [470, 1064], [586, 838], [512, 618]], 54, p.path, 0.84),
    mountain([[68, 1200], [326, 580], [580, 1200]], p.land2, 0.58),
    mountain([[456, 1210], [724, 500], [1030, 1210]], p.deep, 0.78),
    circle(506, 474, 80, { fill: p.pale, opacity: 0.86 }),
    tinyFigure(512, 1180, 0.84, p),
  ].join(""),

  satireSea: ({ rand, p }) => [
    rect(0, 760, WIDTH, 776, { fill: p.mid, opacity: 0.68 }),
    seaLines(rand, p, 860, 18),
    pathEl("M0,1108 C180,1018 368,1100 540,1002 C724,898 872,916 1024,824 L1024,1536 L0,1536 Z", { fill: p.land, opacity: 0.78 }),
    road([[488, 1518], [540, 1270], [610, 1050], [750, 842]], 54, p.path, 0.78),
    smallBoat(358, 912, 0.62, p),
  ].join(""),

  giantCoast: ({ p }) => [
    rect(0, 760, WIDTH, 776, { fill: p.mid, opacity: 0.6 }),
    pathEl("M0,1072 C200,956 402,1026 578,928 C760,826 884,812 1024,762 L1024,1536 L0,1536 Z", { fill: p.land, opacity: 0.86 }),
    road([[512, 1518], [504, 1260], [540, 1040], [618, 842]], 54, p.path, 0.74),
    pathEl("M700,930 C722,760 740,650 768,520 C800,648 812,760 832,930 Z", { fill: p.deep, opacity: 0.82 }),
    smallBoat(300, 922, 0.44, p),
  ].join(""),

  gardenWorld: ({ p }) => [
    baseGround(p, 790),
    road([[512, 1514], [506, 1280], [560, 1050], [508, 812]], 64, p.path, 0.88),
    circle(512, 768, 230, { fill: p.mid, opacity: 0.24 }),
    house(642, 662, 156, 82, p, { color: p.deep }),
    cypress(236, 1010, 272, p, p.deep),
    tinyFigure(510, 1110, 0.78, p),
  ].join(""),

  riverMouth: ({ p }) => [
    rect(0, 712, WIDTH, 824, { fill: p.deep, opacity: 0.9 }),
    pathEl("M0,734 C220,660 390,720 512,660 C680,580 850,620 1024,500 L1024,1536 L0,1536 Z", { fill: p.land2, opacity: 0.72 }),
    road([[514, 1514], [508, 1270], [540, 1040], [512, 780], [520, 540]], 78, p.mid, 0.5),
    circle(512, 340, 94, { fill: p.sun, opacity: 0.62 }),
    smallBoat(512, 1110, 0.5, p, false),
  ].join(""),

  militaryPass: ({ p }) => [
    mountain([[-40, 1290], [294, 520], [590, 1290]], p.land2, 0.64),
    mountain([[404, 1290], [730, 430], [1080, 1290]], p.deep, 0.78),
    road([[512, 1514], [574, 1280], [474, 1050], [612, 820], [512, 610]], 54, p.path, 0.78),
    line(220, 1030, 344, 880, { stroke: p.deep, "stroke-width": 10 }),
    line(344, 1030, 220, 880, { stroke: p.deep, "stroke-width": 10 }),
    tinyFigure(512, 1130, 0.8, p),
  ].join(""),

  snowTrail: ({ p }) => [
    rect(0, 792, WIDTH, 744, { fill: p.land, opacity: 0.58 }),
    mountain([[-40, 1220], [282, 500], [596, 1220]], p.mid, 0.56),
    mountain([[376, 1240], [742, 430], [1080, 1240]], p.deep, 0.76),
    road([[512, 1514], [492, 1280], [548, 1050], [510, 820]], 58, p.path, 0.86),
    tinyFigure(518, 1162, 0.64, p),
  ].join(""),

  houseDoor: ({ p }) => [
    rect(0, 762, WIDTH, 774, { fill: p.land, opacity: 0.5 }),
    house(252, 492, 520, 400, p, { color: p.deep }),
    rect(468, 716, 88, 176, { fill: p.path, opacity: 0.86, rx: 44 }),
    road([[512, 1514], [512, 1280], [512, 1050], [512, 842]], 72, p.path, 0.76),
    tinyFigure(512, 1124, 0.8, p),
  ].join(""),

  gardenWall: ({ p }) => [
    baseGround(p, 780),
    rect(0, 650, 1024, 420, { fill: p.deep, opacity: 0.84 }),
    rect(468, 728, 88, 148, { fill: p.sun, opacity: 0.82, rx: 44 }),
    road([[512, 1514], [520, 1280], [494, 1050], [512, 806]], 80, p.path, 0.88),
    circle(724, 982, 20, { fill: p.sun, opacity: 0.8 }),
  ].join(""),

  riverTree: ({ p }) => [
    rect(0, 760, WIDTH, 776, { fill: p.mid, opacity: 0.56 }),
    pathEl("M0,1080 C180,988 360,1078 512,970 C704,834 852,870 1024,760 L1024,1536 L0,1536 Z", { fill: p.land, opacity: 0.84 }),
    road([[512, 1514], [500, 1280], [550, 1050], [512, 820]], 72, p.path, 0.72),
    line(706, 1016, 706, 600, { stroke: p.deep, "stroke-width": 26, "stroke-linecap": "round" }),
    circle(706, 586, 110, { fill: p.deep, opacity: 0.86 }),
    tinyFigure(514, 1128, 0.76, p),
  ].join(""),

  portraitHall: ({ p }) => [
    rect(0, 742, WIDTH, 794, { fill: p.land2, opacity: 0.72 }),
    road([[512, 1514], [512, 1280], [512, 1030], [512, 720]], 84, p.path, 0.64),
    rect(340, 410, 344, 472, { fill: p.deep, opacity: 0.9 }),
    rect(386, 462, 252, 360, { fill: p.paper, opacity: 0.62, stroke: p.sun, "stroke-width": 12 }),
    circle(512, 612, 72, { fill: p.mid, opacity: 0.52 }),
    tinyFigure(512, 1114, 0.78, p),
  ].join(""),
}

function renderSvg(recipe) {
  const p = PALETTES[recipe.palette]
  const rand = seededRandom(`${recipe.bookId}:${recipe.palette}:${recipe.motif}`)
  const renderer = RENDERERS[recipe.motif]
  if (!p) throw new Error(`Unknown palette: ${recipe.palette}`)
  if (!renderer) throw new Error(`Unknown motif: ${recipe.motif}`)

  const body = renderer({ recipe, p, rand })
  const sky = rect(0, 0, WIDTH, HEIGHT, { fill: p.paper }) +
    rect(0, 0, WIDTH, HEIGHT, { fill: p.sky, opacity: 0.78 }) +
    pathEl("M0,0 L1024,0 L1024,1536 L0,1536 Z", { fill: `url(#paperGlow)`, opacity: 0.72 })

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="paperGlow" cx="50%" cy="24%" r="82%">
      <stop offset="0%" stop-color="${p.pale}" stop-opacity="0.62"/>
      <stop offset="58%" stop-color="${p.paper}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${p.shadow}" stop-opacity="0.1"/>
    </radialGradient>
    <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${p.shadow}" stop-opacity="0.03"/>
      <stop offset="64%" stop-color="${p.shadow}" stop-opacity="0.02"/>
      <stop offset="100%" stop-color="${p.shadow}" stop-opacity="0.18"/>
    </linearGradient>
  </defs>
  ${sky}
  ${celestial(recipe, p)}
  ${body}
  ${grain(rand, p)}
  <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="url(#vignette)"/>
</svg>`
}

async function exists(file) {
  try {
    await fs.access(file)
    return true
  } catch {
    return false
  }
}

function toPublicPath(file) {
  const publicDir = path.resolve("public")
  const relative = path.relative(publicDir, path.resolve(file)).split(path.sep).join("/")
  return `/${relative}`
}

async function makeReviewSheet(entries, artDir) {
  const tileWidth = 168
  const tileHeight = 252
  const labelHeight = 26
  const columns = 8
  const gap = 18
  const padding = 24
  const rows = Math.ceil(entries.length / columns)
  const width = padding * 2 + columns * tileWidth + (columns - 1) * gap
  const height = padding * 2 + rows * (tileHeight + labelHeight) + (rows - 1) * gap
  const composites = []

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index]
    const col = index % columns
    const row = Math.floor(index / columns)
    const left = padding + col * (tileWidth + gap)
    const top = padding + row * (tileHeight + labelHeight + gap)
    const thumb = await sharp(entry.sourcePath)
      .resize(tileWidth, tileHeight, { fit: "cover" })
      .toBuffer()
    const label = Buffer.from(
      `<svg width="${tileWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f2e4c8"/>
        <text x="0" y="17" font-family="Arial, sans-serif" font-size="11" fill="#172a32">${esc(entry.bookId).slice(0, 30)}</text>
      </svg>`,
    )
    composites.push({ input: thumb, left, top })
    composites.push({ input: label, left, top: top + tileHeight + 4 })
  }

  const sheetPath = path.join(artDir, "review-sheet.jpg")
  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: "#f2e4c8",
    },
  })
    .composite(composites)
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(sheetPath)
  return sheetPath
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const recipes = options.ids ? RECIPES.filter((recipe) => options.ids.has(recipe.bookId)) : RECIPES
  await fs.mkdir(options.source, { recursive: true })
  await fs.mkdir(options.artDir, { recursive: true })

  const entries = []
  for (const recipe of recipes) {
    const sourcePath = path.join(options.source, `${recipe.bookId}.png`)
    const alreadyExists = await exists(sourcePath)
    let status = "generated"

    if (alreadyExists && !options.overwrite) {
      status = "skipped-existing"
    } else {
      const svg = renderSvg(recipe)
      await sharp(Buffer.from(svg))
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(sourcePath)
    }

    entries.push({
      ...recipe,
      status,
      sourcePath,
      publicSourcePath: toPublicPath(sourcePath),
    })
  }

  const reviewSheetPath = await makeReviewSheet(entries, options.artDir)
  const manifest = {
    generatedAt: new Date().toISOString(),
    style: "Monumental Literary Paths v1",
    sourceDir: options.source,
    artDir: options.artDir,
    overwrite: options.overwrite,
    count: entries.length,
    generatedCount: entries.filter((entry) => entry.status === "generated").length,
    skippedExistingCount: entries.filter((entry) => entry.status === "skipped-existing").length,
    reviewSheetPath,
    publicReviewSheetPath: toPublicPath(reviewSheetPath),
    palettes: Object.keys(PALETTES),
    entries,
  }

  await fs.writeFile(path.join(options.artDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`Monumental Literary Paths covers: ${manifest.generatedCount} generated, ${manifest.skippedExistingCount} skipped.`)
  console.log(`Review sheet: ${reviewSheetPath}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
