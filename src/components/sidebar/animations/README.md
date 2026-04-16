# Sidebar Animation System

Role-aware animated icons for the app sidebar. Each icon responds to hover and
focus states using Framer Motion, with design tokens that vary by user role.

---

## Directory Structure

```
components/sidebar/animations/
├── README.md
├── types.ts                    # AnimatedIconProps, AnimatedIconMeta, AnimatedIconComponent
├── AnimatedIconWrapper.tsx     # Hover/focus state management wrapper
├── student/                    # Student role icons ("The Reader's Journey")
│   ├── registry.ts            # Maps nav labels -> components (merges shared)
│   ├── index.ts               # Barrel exports
│   ├── LibraryIcon.tsx        # 8 original + 2 new student-only icons
│   └── ...
├── teacher/                    # Teacher role icons ("The Scholar's Desk")
│   ├── registry.ts            # Maps nav labels -> components (merges shared + nav + conceptual)
│   ├── index.ts
│   ├── ClassroomsIcon.tsx     # 5 nav-mapped + 9 conceptual icons
│   └── ...
└── shared/                     # Icons used by both roles
    ├── registry.ts
    ├── index.ts
    └── HomeIcon.tsx, etc.     # 11 shared icons
```

---

## Design Philosophy

### Student — "The Reader's Journey"

Discovery, curiosity, personal growth. Animations feel light and inviting.

- Gold-dominant color palette
- Stroke width **1.5**
- Faster animation timing
- Springs that feel bouncy and energetic

### Teacher — "The Scholar's Desk"

Authority, deliberation, instruction. Animations feel measured and precise.

- Indigo-dominant palette with gold highlights
- Stroke width **1.75**
- Slower, more deliberate timing
- Springs with controlled overshoot

### Shared

Neutral literary motifs (home, explore, bookmarks, shelves, etc.) that work
equally well in either theme. Shared icons appear in both student and teacher
registries automatically.

---

## Token System

All animation values live in `lib/animations/sidebar-tokens.ts`. Never use
magic numbers in icon components — always import from tokens.

### Student Tokens

| Token          | Purpose                                                       |
| -------------- | ------------------------------------------------------------- |
| `iconDurations`| Timing ladder: instant / fast / normal / slow / reveal / maxAnimation |
| `iconSprings`  | 6 spring configs for different motion characters              |
| `iconStagger`  | 0.04s between child element animations                        |
| `glowColors`   | Gold-dominant glow/accent palette                             |
| `pathDraw`     | Stroke-dasharray draw-on configs                              |
| `iconStroke`   | Width 1.5                                                     |
| `iconEase`     | Easing curves                                                 |

### Teacher Tokens

| Token             | Purpose                                                    |
| ----------------- | ---------------------------------------------------------- |
| `teacherDurations`| Timing ladder: recite / oration / deliberate (all slower)  |
| `teacherSprings`  | overshoot / deliberate / authoritative spring configs      |
| `teacherStagger`  | 0.08s between child element animations                     |
| `teacherColors`   | Indigo-dominant palette with gold highlights                |
| `teacherStroke`   | Width 1.75                                                 |

---

## How It Works

1. **`app-sidebar.tsx`** reads the current user role and selects the matching
   registry (student or teacher).
2. Each **registry** maps navigation item labels to animated icon components.
   Student and teacher registries both merge in the shared registry, so shared
   icons are available everywhere.
3. **`AnimatedIconWrapper`** wraps each icon and tracks hover/focus state,
   passing it down via render prop.
4. Each icon component receives `isHovered`, `isActive`, and `className` props.
5. Icons use **Framer Motion** with token-driven `variants`, `transition`, and
   style values — no inline magic numbers.

```
Sidebar  -->  Registry (by role)  -->  AnimatedIconWrapper
                                            |
                                       render prop
                                            |
                                       IconComponent
                                       (isHovered, isActive, className)
```

---

## How to Add a New Icon

### 1. Create the component file

Place it in the correct directory based on scope:

- `shared/` — used by both student and teacher
- `student/` — student-only
- `teacher/` — teacher-only

### 2. Follow the component pattern

```tsx
"use client";

import { motion } from "framer-motion";
import type { AnimatedIconProps, AnimatedIconMeta } from "../types";
// Import the appropriate tokens for this role
import { iconDurations, iconSprings, iconStroke } from "@/lib/animations/sidebar-tokens";

export const meta: AnimatedIconMeta = {
  name: "MyNewIcon",
  description: "Brief description of what this icon represents.",
};

export default function MyNewIcon({ isHovered, isActive, className }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="..."
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        animate={isHovered ? "hover" : "idle"}
        variants={{
          idle: { pathLength: 1 },
          hover: { pathLength: [0, 1] },
        }}
        transition={{ duration: iconDurations.normal, ...iconSprings.default }}
      />
    </svg>
  );
}
```

Key rules:

- `"use client"` directive at the top
- SVG `viewBox` is always `"0 0 24 24"`
- Stroke-based paths with `vectorEffect="non-scaling-stroke"`
- Export `default` function component **and** named `meta` object
- Import all timing/spring/color values from tokens

### 3. Register the icon

Add an entry to the directory's `registry.ts`:

```ts
import MyNewIcon from "./MyNewIcon";

export const studentRegistry = {
  ...sharedRegistry,
  "My Nav Label": MyNewIcon,
};
```

### 4. Add barrel export

In the directory's `index.ts`:

```ts
export { default as MyNewIcon, meta as MyNewIconMeta } from "./MyNewIcon";
```

### 5. Shared icon propagation

If your icon is in `shared/`, both the student and teacher registries will pick
it up automatically through their respective `...sharedRegistry` spread.

---

## When NOT to Add an Animation

Not every sidebar item needs a bespoke animated icon. Apply these guidelines
before creating one:

- **Rarely-seen items.** Icons for settings pages, one-time onboarding flows,
  or deep sub-menus do not benefit from animation. Use a static icon.
- **Distracting motion.** The sidebar is navigation, not entertainment. If your
  animation draws the eye away from page content, simplify or remove it.
- **Looping animations.** Do not use loops unless the icon represents a
  persistent state indicator (e.g., an active flame for streaks). Loops on hover
  create visual noise.
- **Slow animations.** If the full animation exceeds **600ms**, simplify it.
  Users should not wait for an icon to finish before it feels responsive.
- **Complex spring chains.** Do not use more than 2 keyframes with spring
  transitions. This is a Framer Motion rendering limitation that causes jank.
- **Fill-based animations.** Prefer stroke animations (pathLength, dasharray,
  dashoffset) over fill color/opacity changes. Stroke animation is the visual
  language of this system.
- **No clear narrative.** Every animated icon should tell a micro-story from
  idle to hover (a book opening, a flame flickering, a compass spinning). If
  there is no natural idle-to-hover narrative, fall back to a simple
  opacity/scale tween instead of forcing something artificial.

---

## Constraints

| Rule | Detail |
| ---- | ------ |
| SVG viewBox | Always `24 24` (24x24 pixel grid) |
| Authoring | Hand-authored SVG paths only. No icon libraries (Lucide, Heroicons, etc.) |
| Stroke style | `vectorEffect="non-scaling-stroke"` on every path |
| Max duration | 600ms per animation (persistent loops may exceed this) |
| No magic numbers | All durations, springs, colors, and stroke widths come from `sidebar-tokens.ts` |
| Meta export | Every component must export a `meta: AnimatedIconMeta` object |
| Student stroke | Width **1.5**, gold-dominant palette |
| Teacher stroke | Width **1.75**, indigo-dominant palette |

---

## File Reference

| File | Purpose |
| ---- | ------- |
| `types.ts` | `AnimatedIconProps`, `AnimatedIconMeta`, `AnimatedIconComponent` type definitions |
| `AnimatedIconWrapper.tsx` | Manages hover/focus state, passes `isHovered` via render prop |
| `lib/animations/sidebar-tokens.ts` | All design tokens (durations, springs, staggers, colors, strokes) |
| `student/registry.ts` | Student label-to-component map (merges shared) |
| `teacher/registry.ts` | Teacher label-to-component map (merges shared + nav + conceptual) |
| `shared/registry.ts` | Shared label-to-component map |
| `components/tome/app-sidebar.tsx` | Consumes the registry, renders sidebar with animated icons |
