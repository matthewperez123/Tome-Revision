// ─────────────────────────────────────────────
// The Living Archive — Typed Token Mirror
// ─────────────────────────────────────────────
// TypeScript mirror of src/styles/living-archive.css.
// Hex values MUST stay in sync with the stylesheet; the CSS
// custom properties are the runtime source of truth and these
// objects exist so components can reference tokens type-safely
// (docs, labs, canvas/SVG contexts where var() is awkward).
// ─────────────────────────────────────────────

// ── Theme ids ────────────────────────────────

export const laThemeIds = [
  "light",
  "dark",
  "system",
  "reader-day",
  "reader-sepia",
  "reader-night",
  "high-contrast",
] as const;

export type LaThemeId = (typeof laThemeIds)[number];

// ── Core palette (light day values) ──────────

export const laPalette = {
  paperWhite: "#FFFDF8",
  warmIvory: "#F6F1E6",
  midnightInk: "#141B2E",
  deepNavy: "#1B2745",
  luminousSky: "#7FB4E8",
  electricCobalt: "#2E5BE6",
  lanternGold: "#D9A63C",
  coral: "#F27059",
  jade: "#2E8C6A",
  violet: "#7C5CD6",
  vermilion: "#C93A2E",
} as const;

export type LaPaletteName = keyof typeof laPalette;

// ── Semantic tokens, per theme ───────────────
// Keys match the CSS var names: --la-{key}.

export type LaSemanticColors = {
  page: string;
  surface: string;
  surfaceRaised: string;
  surfaceSunken: string;
  ink: string;
  inkMuted: string;
  inkFaint: string;
  inkInverse: string;
  primary: string;
  primaryInk: string;
  primaryEdge: string;
  primarySoft: string;
  secondary: string;
  secondaryInk: string;
  secondaryEdge: string;
  secondarySoft: string;
  wisdom: string;
  wisdomDeep: string;
  wisdomInk: string;
  wisdomSoft: string;
  flame: string;
  flameDeep: string;
  flameInk: string;
  flameSoft: string;
  seal: string;
  sealDeep: string;
  sealInk: string;
  sealSoft: string;
  success: string;
  successSoft: string;
  nearMiss: string;
  nearMissSoft: string;
  error: string;
  errorSoft: string;
  focus: string;
  teacher: string;
  teacherSoft: string;
  parent: string;
  parentSoft: string;
};

export type LaThemeName = "light" | "dark" | "readerDay" | "readerSepia" | "readerNight" | "highContrast";

const laLight: LaSemanticColors = {
    page: "#F7F3EA",
    surface: "#FFFDF8",
    surfaceRaised: "#FFFFFF",
    surfaceSunken: "#EFE9DB",
    ink: "#141B2E",
    inkMuted: "#5A6478",
    inkFaint: "#8B93A6",
    inkInverse: "#FDFBF4",
    primary: "#2E5BE6",
    primaryInk: "#FFFFFF",
    primaryEdge: "#1D3FB0",
    primarySoft: "#E4EBFC",
    secondary: "#7FB4E8",
    secondaryInk: "#14233C",
    secondaryEdge: "#5A92C9",
    secondarySoft: "#E8F2FC",
    wisdom: "#D9A63C",
    wisdomDeep: "#8A6317",
    wisdomInk: "#3A2B08",
    wisdomSoft: "#F8EED3",
    flame: "#E4572E",
    flameDeep: "#B23D1B",
    flameInk: "#FFFFFF",
    flameSoft: "#FCE5DB",
    seal: "#7C5CD6",
    sealDeep: "#553AA8",
    sealInk: "#FFFFFF",
    sealSoft: "#ECE6FA",
    success: "#1F8A5B",
    successSoft: "#DFF2E8",
    nearMiss: "#B97A10",
    nearMissSoft: "#F8ECD2",
    error: "#C93A2E",
    errorSoft: "#FBE3DF",
    focus: "#2E5BE6",
    teacher: "#2F4A6E",
    teacherSoft: "#E3EAF3",
    parent: "#96506E",
    parentSoft: "#F5E6ED",
  };
const laDark: LaSemanticColors = {
    page: "#0F1420",
    surface: "#171D2C",
    surfaceRaised: "#1F2637",
    surfaceSunken: "#0B0E16",
    ink: "#ECE7DA",
    inkMuted: "#A3ABBE",
    inkFaint: "#6D7590",
    inkInverse: "#141B2E",
    primary: "#7AA2F2",
    primaryInk: "#101830",
    primaryEdge: "#4F7AD6",
    primarySoft: "#223052",
    secondary: "#8ABCE8",
    secondaryInk: "#14233C",
    secondaryEdge: "#6794C4",
    secondarySoft: "#1D2C42",
    wisdom: "#E4B95B",
    wisdomDeep: "#E9C887",
    wisdomInk: "#2E2206",
    wisdomSoft: "#3A3018",
    flame: "#F08A55",
    flameDeep: "#F5A87E",
    flameInk: "#2E1408",
    flameSoft: "#3D2216",
    seal: "#A08AE8",
    sealDeep: "#B9A8F0",
    sealInk: "#1C1236",
    sealSoft: "#2C2547",
    success: "#4CC38A",
    successSoft: "#173527",
    nearMiss: "#E0A94A",
    nearMissSoft: "#3A2F14",
    error: "#F07568",
    errorSoft: "#3F1C18",
    focus: "#8AB0F5",
    teacher: "#7D96BA",
    teacherSoft: "#20293A",
    parent: "#C98AA6",
    parentSoft: "#38222E",
  };

// Reader/day variants only override paper+ink in CSS; sepia and
// night get their own action colors, mirrored here. Everything
// not listed inherits the light values.
const laReaderDay: LaSemanticColors = {
  ...laLight,
  page: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceRaised: "#FFFFFF",
  surfaceSunken: "#F2F2EE",
  ink: "#20242E",
  inkMuted: "#565E6E",
  inkFaint: "#8A919E",
};

const laReaderSepia: LaSemanticColors = {
  ...laLight,
  page: "#F4ECDC",
  surface: "#F9F2E4",
  surfaceRaised: "#FCF7EC",
  surfaceSunken: "#E9DFC9",
  ink: "#3E3226",
  inkMuted: "#6E5F4B",
  inkFaint: "#99886E",
  primary: "#7A4E1E",
  primaryEdge: "#5A3A14",
  primarySoft: "#ECDFC6",
  focus: "#7A4E1E",
};

const laReaderNight: LaSemanticColors = {
  ...laLight,
  page: "#0D0F14",
  surface: "#14171F",
  surfaceRaised: "#1A1E28",
  surfaceSunken: "#080A0E",
  ink: "#D8D3C6",
  inkMuted: "#97928A",
  inkFaint: "#5F5B54",
  inkInverse: "#141B2E",
  primary: "#8FA8D8",
  primaryEdge: "#6C85B4",
  primarySoft: "#232B3D",
  focus: "#8FA8D8",
};

const laHighContrast: LaSemanticColors = {
  ...laLight,
  page: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceRaised: "#FFFFFF",
  surfaceSunken: "#F0F0F0",
  ink: "#000000",
  inkMuted: "#2B2B2B",
  inkFaint: "#4A4A4A",
  primary: "#0038CC",
  primaryEdge: "#002A99",
  primarySoft: "#CCD9FF",
  focus: "#0038CC",
  success: "#006B3F",
  nearMiss: "#7A4D00",
  error: "#A11212",
  wisdomDeep: "#6B4C00",
};

export const laThemes: Record<LaThemeName, LaSemanticColors> = {
  light: laLight,
  dark: laDark,
  readerDay: laReaderDay,
  readerSepia: laReaderSepia,
  readerNight: laReaderNight,
  highContrast: laHighContrast,
} as const;

// ── Book-world palette slots ─────────────────

export const laWorldIds = [
  "macbeth",
  "moby-dick",
  "alice",
  "paradise-lost",
  "divine-comedy",
  "iliad",
  "odyssey",
  "frankenstein",
  "pride-prejudice",
  "jane-eyre",
  "meditations",
  "republic",
] as const;

export type LaWorldId = (typeof laWorldIds)[number];

export type LaWorldPalette = {
  /** Display name of the world mood (e.g. "storm"). */
  mood: string;
  /** Dominant ground color of the diorama. */
  ground: string;
  /** Deep ink/shadow color of the world. */
  deep: string;
  /** Bright motif accent. */
  accent: string;
  /** Luminous highlight / glow. */
  glow: string;
};

export const laWorlds: Record<LaWorldId, LaWorldPalette> = {
  macbeth: { mood: "storm", ground: "#45506B", deep: "#232A3D", accent: "#E4B95B", glow: "#9AA7C7" },
  "moby-dick": { mood: "maritime", ground: "#2F6E8F", deep: "#12303F", accent: "#E8D9B5", glow: "#7FC4D9" },
  alice: { mood: "cabinet", ground: "#4E9BA6", deep: "#233A4A", accent: "#E05A6B", glow: "#F2D98C" },
  "paradise-lost": { mood: "threshold", ground: "#4A3F78", deep: "#1C1830", accent: "#E4C66B", glow: "#B8A9E8" },
  "divine-comedy": { mood: "ascent", ground: "#7C6BA8", deep: "#2A1E3F", accent: "#E8B23C", glow: "#9FD8E8" },
  iliad: { mood: "bronze", ground: "#A6643A", deep: "#3E2A1C", accent: "#2E5E8C", glow: "#E0A75B" },
  odyssey: { mood: "sea", ground: "#2C4E7C", deep: "#14233C", accent: "#D9C08A", glow: "#6FA8D8" },
  frankenstein: { mood: "alpine", ground: "#4A6070", deep: "#1E2A33", accent: "#63C7E0", glow: "#A8E4F0" },
  "pride-prejudice": { mood: "garden", ground: "#6E9A6B", deep: "#2E4030", accent: "#D98CA6", glow: "#F2E4BC" },
  "jane-eyre": { mood: "ember", ground: "#7A3E34", deep: "#2E1E22", accent: "#E0885B", glow: "#C9A9BC" },
  meditations: { mood: "dawn", ground: "#B8895A", deep: "#3A2E24", accent: "#A03A30", glow: "#F0D9B5" },
  republic: { mood: "geometry", ground: "#2E5BE6", deep: "#1A2340", accent: "#D9A63C", glow: "#7FB0F0" },
} as const;

// ── CSS var name helpers ─────────────────────

/** Semantic token name → CSS custom property name. */
export function laVar(name: keyof LaSemanticColors): string {
  const kebab = name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  return `--la-${kebab}`;
}

/** Semantic token name → var() expression for inline styles. */
export function laCss(name: keyof LaSemanticColors): string {
  return `var(${laVar(name)})`;
}

/** World slot → CSS custom property name. */
export function laWorldVar(world: LaWorldId, slot: keyof Omit<LaWorldPalette, "mood">): string {
  return `--la-world-${world}-${slot}`;
}

/** World slot → var() expression for inline styles. */
export function laWorldCss(world: LaWorldId, slot: keyof Omit<LaWorldPalette, "mood">): string {
  return `var(${laWorldVar(world, slot)})`;
}

// ── Aggregate ────────────────────────────────

export const livingArchive = {
  themeIds: laThemeIds,
  palette: laPalette,
  themes: laThemes,
  worldIds: laWorldIds,
  worlds: laWorlds,
} as const;
