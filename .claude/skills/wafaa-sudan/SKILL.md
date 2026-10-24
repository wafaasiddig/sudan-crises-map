---
name: wafaa-sudan
description: Implement new features or edit existing ones in the Sudan crisis map project (React + ArcGIS + MUI charts + framer-motion). Always gives Wafaa a brief /explain-style plan first, uses framer-motion for any animation, and keeps every component small (50–200 lines) and in its own folder. Use when the user runs /wafaa-sudan or asks to add, change, or fix something in this project.
argument-hint: <what to build or change, e.g. "animate the KPI cards when the tab changes">
---

# /wafaa-sudan — build & edit features in this project

The request is in `$ARGUMENTS`. If it is empty, ask what Wafaa wants to add or change.

Wafaa knows **Power BI** well and is newer to React / JavaScript / ArcGIS.

## Workflow (always in this order)

### 1. Investigate
Read the files the change touches before planning. Check:
- `src/App.jsx` (top-level state, layout), `src/config/*` (views, filters, web map ids),
  `src/components/**` (UI), `src/hooks/*`, `src/services/*`.
- Existing patterns to copy (e.g. `src/components/TopBar/TopBar.jsx` for framer-motion usage).

### 2. Explain the plan first — brief version
Before writing any code, invoke the **`explain`** skill (via the Skill tool) with a
description of the planned change, and ask for the **brief version**. The plan must be short:

- **🧠 In one sentence** — what will change.
- **📊 Power BI way** — one-line analogy (skip if it doesn't fit).
- **📁 Files** — a small table: file (clickable link) · new / edit · what changes.
- **⚠️ Gotchas** — only if there are any.

No long before/after code dumps at this stage. Then **stop and wait for Wafaa's OK**
(unless they already said "just do it" / "go ahead"). Adjust the plan if they ask.

### 3. Implement
Follow the rules below, then run `npm run lint` and `npm run build` and fix anything they report.

### 4. Wrap up
Short summary: which files were created/edited (clickable links), how to see it
(`npm run dev` → what to click), and anything left undone or not verified.

## Rules

### Components
- **One component per file, 50–200 lines.** If a component would pass ~200 lines,
  split it into child components, a custom hook (`src/hooks/useX.js`), or a helper
  (`src/utils/` / `src/services/`). Tiny pure helpers may be under 50 lines; don't pad files.
- Each component lives in its own folder with its CSS next to it:
  `src/components/Feature/Feature.jsx` + `Feature.css` (charts go in `src/components/charts/`,
  shared bits in `src/components/common/`).
- Keep `App.jsx` as the wiring layer (state + layout). Don't put feature logic in it — move it
  into a hook or component.
- Data/config goes in `src/config/`, ArcGIS queries in `src/services/`, not inside components.
- Match the existing style: function components, named props, plain CSS files, same naming.

### Motion → framer-motion only
- Every animation or transition uses **framer-motion** (`motion`, `AnimatePresence`,
  `LayoutGroup`, `layout`, `variants`). No CSS `@keyframes`/`transition` for new motion and no
  other animation libraries. (Simple hover colour changes in CSS are fine.)
- Import from `'framer-motion'`, like `TopBar.jsx` does.
- Respect accessibility: use `useReducedMotion()` and disable/shorten motion when it returns true.
- Keep motion subtle and quick (≈150–400 ms). Use `AnimatePresence` for things that mount/unmount
  (tab content, panels, tooltips); use `layout` for things that move/resize.
- If variants are reused across components, put them in `src/utils/motion.js`.

### Safety
- Don't change `WEBMAP_ID` or layer ids in `src/config/webmap.js` unless asked — the map
  breaks if ids don't match the web map.
- Don't add new dependencies without saying so in the plan.
- Don't commit unless Wafaa asks.
