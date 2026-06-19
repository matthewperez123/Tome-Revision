import path from "node:path"
import { mkdir } from "node:fs/promises"
import sharp from "sharp"

const outputRoot = path.join(process.cwd(), "public", "living-archive", "assets")

const books = [
  {
    slug: "macbeth",
    family: "emblem",
    accent: "#D9A03C",
    palette: ["#171B26", "#21304B", "#D9A03C", "#AE4656", "#33584C"],
  },
  {
    slug: "moby-dick",
    family: "horizon",
    accent: "#D9A03C",
    palette: ["#21304B", "#5C7AA6", "#3E7B72", "#F2EAD8", "#D9A03C"],
  },
  {
    slug: "alices-adventures-in-wonderland",
    family: "constellation",
    accent: "#E2684A",
    palette: ["#A9A3CC", "#F2EAD8", "#E2684A", "#D9A03C", "#7C5A77"],
  },
]

const coverOutputs = [
  {
    name: "cover-master-2x3",
    width: 1600,
    height: 2400,
    viewBox: "0 0 100 150",
    formats: ["png", "webp"],
  },
  {
    name: "cover-app-3x4",
    width: 1200,
    height: 1600,
    viewBox: "0 8 100 133.333",
    formats: ["png", "webp"],
  },
  {
    name: "cover-square",
    width: 1200,
    height: 1200,
    viewBox: "0 24 100 100",
    formats: ["png", "webp"],
  },
  {
    name: "cover-thumbnail-96x144",
    width: 96,
    height: 144,
    viewBox: "0 0 100 150",
    formats: ["png"],
  },
]

const stoaOutputs = [
  {
    name: "stoa-desktop-16x9",
    width: 1920,
    height: 1080,
    viewBox: "0 0 160 90",
  },
  {
    name: "stoa-tablet-4x3",
    width: 1600,
    height: 1200,
    viewBox: "10 -15 140 105",
  },
  {
    name: "stoa-mobile-3x4",
    width: 1200,
    height: 1600,
    viewBox: "30 -20 90 120",
  },
]

function texture(seed, color = "#F2EAD8") {
  const marks = []
  for (let i = 0; i < 38; i += 1) {
    const x = (seed * 13 + i * 17) % 100
    const y = (seed * 19 + i * 23) % 150
    const opacity = 0.03 + ((i + seed) % 5) * 0.01
    marks.push(`<circle cx="${x}" cy="${y}" r="${1 + (i % 3) * 0.55}" fill="${color}" opacity="${opacity}" />`)
  }
  return marks.join("")
}

function coverMarks(book) {
  if (book.family === "horizon") {
    return `
      <path d="M66 4 C105 31 107 101 68 151 C53 126 47 99 51 72 C55 43 60 20 66 4 Z" fill="#F2EAD8" opacity="0.94" />
      <path d="M7 34 H90 M17 48 H78 M26 22 L58 58 M72 18 L33 62" stroke="#D8D8D0" stroke-width="0.45" opacity="0.25" />
      <path d="M22 82 L25 58 L28 82 M18 82 H38" fill="none" stroke="${book.accent}" stroke-width="1.8" stroke-linecap="round" />
      <path d="M12 104 C25 98 39 108 52 101 C71 91 86 102 101 94 L101 151 L0 151 L0 111 C5 110 9 107 12 104 Z" fill="${book.palette[2]}" opacity="0.7" />
      <path d="M0 125 C21 115 38 129 58 119 C77 110 93 118 108 110" fill="none" stroke="#D8D8D0" stroke-width="1.1" opacity="0.25" />
      ${[["16", "18"], ["31", "14"], ["49", "24"], ["73", "17"], ["84", "38"], ["20", "54"]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.95" fill="#F2CF8B" opacity="0.9" />`).join("")}
    `
  }

  if (book.family === "constellation") {
    return `
      <rect x="0" y="0" width="100" height="150" fill="${book.palette[0]}" />
      <ellipse cx="50" cy="74" rx="38" ry="51" fill="none" stroke="${book.palette[4]}" stroke-width="1.2" opacity="0.42" transform="rotate(-18 50 74)" />
      <path d="M42 61 H59 V93 H42 Z M48 68 H53 V86 H48 Z" fill="${book.palette[1]}" opacity="0.92" />
      <circle cx="49" cy="33" r="8" fill="${book.palette[3]}" opacity="0.92" />
      <path d="M49 28 V33 H53" stroke="${book.palette[4]}" stroke-width="1.2" fill="none" stroke-linecap="round" />
      <path d="M72 54 C78 50 81 58 76 62 L71 67" stroke="${book.accent}" stroke-width="2" fill="none" stroke-linecap="round" />
      <path d="M72 91 C76 86 83 89 83 96 C83 101 76 103 70 99 Z" fill="${book.palette[4]}" opacity="0.9" />
      <rect x="19" y="90" width="13" height="17" rx="1.5" fill="#3E7B72" opacity="0.86" />
      <path d="M21 121 H81" stroke="#171B26" stroke-width="1.6" stroke-dasharray="5 5" opacity="0.28" />
      <circle cx="23" cy="58" r="6" fill="${book.accent}" opacity="0.82" />
    `
  }

  return `
    <circle cx="65" cy="35" r="10" fill="${book.palette[3]}" opacity="0.9" />
    <path d="M35 60 L44 41 L51 60 L59 41 L68 60 Z" fill="${book.accent}" opacity="0.95" />
    <rect x="35" y="60" width="33" height="6" fill="${book.accent}" opacity="0.84" />
    <circle cx="44" cy="41" r="2.4" fill="#F2CF8B" opacity="0.88" />
    <circle cx="59" cy="41" r="2.4" fill="#F2CF8B" opacity="0.88" />
    <path d="M52 68 L58 115 L51 130 L44 115 L50 68 Z" fill="#D8D8D0" opacity="0.93" />
    <path d="M16 119 C29 103 46 111 60 123 C72 133 83 129 96 115 L100 150 L0 150 Z" fill="${book.palette[4]}" opacity="0.66" />
    <path d="M21 101 C29 92 38 91 47 100" stroke="#171B26" stroke-width="3" fill="none" opacity="0.82" />
    <path d="M70 116 H89 V104 H84 V96 H76 V104 H70 Z" fill="#171B26" opacity="0.7" />
  `
}

function coverSvg(book, viewBox) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bg-${book.slug}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${book.palette[0]}"/>
          <stop offset="0.58" stop-color="${book.palette[1]}"/>
          <stop offset="1" stop-color="${book.palette[2]}"/>
        </linearGradient>
        <radialGradient id="lamp-${book.slug}" cx="50%" cy="38%" r="48%">
          <stop offset="0" stop-color="${book.accent}" stop-opacity="0.38"/>
          <stop offset="1" stop-color="${book.accent}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect x="-8" y="-8" width="116" height="166" fill="url(#bg-${book.slug})"/>
      <rect x="-8" y="-8" width="116" height="166" fill="url(#lamp-${book.slug})"/>
      ${texture(book.slug.length)}
      ${coverMarks(book)}
    </svg>
  `
}

function stoaMarks(book) {
  if (book.family === "horizon") {
    return `
      <path d="M0 57 C28 45 43 63 67 52 C94 40 118 58 160 42 L160 90 L0 90 Z" fill="#3E7B72" opacity="0.84"/>
      <path d="M0 69 C26 56 49 76 76 63 C103 51 129 67 160 55" fill="none" stroke="#F2EAD8" stroke-width="2" opacity="0.24"/>
      <path d="M70 76 C91 56 128 59 145 77 C122 89 92 90 70 76 Z" fill="#171B26" opacity="0.56"/>
      <path d="M52 45 L55 28 L58 45 M48 45 H70" fill="none" stroke="${book.accent}" stroke-width="2" stroke-linecap="round"/>
      ${[12, 23, 38, 64, 88, 119, 140].map((x, i) => `<circle cx="${x}" cy="${16 + (i % 3) * 5}" r="1" fill="#F2CF8B" opacity="0.85"/>`).join("")}
    `
  }

  if (book.family === "constellation") {
    return `
      <path d="M23 78 C44 54 54 24 81 13 C111 24 119 54 141 78 Z" fill="#F2EAD8" opacity="0.17"/>
      <path d="M30 82 H130" stroke="#171B26" stroke-width="3" stroke-dasharray="9 7" opacity="0.18"/>
      ${[36, 53, 74, 101, 124].map((x, i) => `<rect x="${x}" y="${30 + (i % 2) * 11}" width="${9 + i}" height="${23 + i * 2}" rx="2" fill="${i % 2 ? "#F2EAD8" : book.palette[4]}" opacity="${i % 2 ? "0.86" : "0.55"}"/>`).join("")}
      <path d="M33 68 C48 62 58 72 75 65 C92 57 108 68 127 61" fill="none" stroke="${book.accent}" stroke-width="2" opacity="0.82"/>
      <ellipse cx="116" cy="72" rx="28" ry="6" fill="${book.accent}" opacity="0.5"/>
      <circle cx="58" cy="21" r="5" fill="#F2CF8B" opacity="0.9"/>
      <circle cx="101" cy="23" r="4" fill="${book.accent}" opacity="0.8"/>
    `
  }

  return `
    <circle cx="58" cy="23" r="12" fill="${book.palette[3]}" opacity="0.88"/>
    <path d="M0 38 C28 27 49 42 78 31 C112 19 133 38 160 29 L160 0 L0 0 Z" fill="#5C7AA6" opacity="0.35"/>
    <path d="M0 70 C27 53 49 64 73 70 C97 77 124 69 160 55 L160 90 L0 90 Z" fill="${book.palette[4]}" opacity="0.7"/>
    <path d="M104 65 H145 V48 H136 V39 H121 V48 H104 Z" fill="#171B26" opacity="0.82"/>
    ${[112, 127, 141].map((x) => `<rect x="${x}" y="58" width="2" height="4" rx="1" fill="#F2CF8B" opacity="0.92"/>`).join("")}
    <path d="M34 57 L44 37 L52 57 L61 37 L71 57 Z" fill="${book.accent}" opacity="0.92"/>
    <path d="M50 61 L56 86 L49 95 L43 86 L48 61 Z" fill="#D8D8D0" opacity="0.7"/>
  `
}

function stoaSvg(book, viewBox) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="stoa-bg-${book.slug}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${book.palette[0]}"/>
          <stop offset="0.52" stop-color="${book.palette[1]}"/>
          <stop offset="1" stop-color="${book.palette[2]}"/>
        </linearGradient>
        <radialGradient id="stoa-light-${book.slug}" cx="68%" cy="46%" r="48%">
          <stop offset="0" stop-color="#F2EAD8" stop-opacity="0.32"/>
          <stop offset="1" stop-color="#F2EAD8" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect x="-40" y="-40" width="240" height="170" fill="url(#stoa-bg-${book.slug})"/>
      <rect x="-40" y="-40" width="240" height="170" fill="url(#stoa-light-${book.slug})"/>
      ${stoaMarks(book)}
    </svg>
  `
}

async function render(svg, outPath, format, width, height) {
  const image = sharp(Buffer.from(svg)).resize(width, height, { fit: "fill" })
  if (format === "webp") {
    await image.webp({ quality: 88 }).toFile(outPath)
    return
  }
  await image.png({ compressionLevel: 9 }).toFile(outPath)
}

for (const book of books) {
  const outputDir = path.join(outputRoot, book.slug)
  await mkdir(outputDir, { recursive: true })

  for (const output of coverOutputs) {
    const svg = coverSvg(book, output.viewBox)
    for (const format of output.formats) {
      await render(
        svg,
        path.join(outputDir, `${output.name}.${format}`),
        format,
        output.width,
        output.height
      )
    }
  }

  for (const output of stoaOutputs) {
    const svg = stoaSvg(book, output.viewBox)
    await render(
      svg,
      path.join(outputDir, `${output.name}.png`),
      "png",
      output.width,
      output.height
    )
    await render(
      svg,
      path.join(outputDir, `${output.name}.webp`),
      "webp",
      output.width,
      output.height
    )
  }
}

console.log(`Generated Living Archive fallback assets in ${outputRoot}`)
