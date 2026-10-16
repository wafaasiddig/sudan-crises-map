---
name: explain
description: Explain a question about this codebase to Wafaa in simple terms, using Power BI analogies where they fit, and show the related files with a "what if I want to change this" example. Use when the user runs /explain or asks to have something in this project explained simply.
argument-hint: <your question, e.g. "how does the Security tab decide which layers to show?">
---

# /explain — simple explanations for Wafaa

Wafaa knows **Power BI** very well and is newer to React / JavaScript / ArcGIS.
Answer the question in `$ARGUMENTS` so it makes sense to someone who thinks in Power BI terms.
If no question was given, ask what they want explained.

## How to answer

1. **Investigate first.** Read the actual files involved before explaining. Never guess how the code works.
2. **Answer in this structure** (keep each part short, plain words, no jargon without a translation):

   ### 🧠 In one sentence
   The answer in one simple sentence.

   ### 📊 The Power BI way to think about it
   Map the idea to the closest Power BI concept (see the cheat sheet below).
   Example: "This is like a slicer: when you pick a value, every visual on the page re-filters."
   If there is **no honest Power BI equivalent**, say so in one line and instead give an
   everyday "outside the hood" analogy (a restaurant, a light switch, a recipe…). Don't force a bad comparison.

   ### 🔄 How it flows (step by step)
   A short numbered list, or a small text diagram, of what happens from the user's click to what they see.
   Example:
   ```
   Click "Security" tab → App remembers active tab → Map shows security layers → Charts reload
   (like: click slicer)  (like: filter context)    (like: visual-level filter) (like: visuals refresh)
   ```

   ### 📁 Related files
   A table with one row per relevant file, using clickable markdown links (e.g. [views.js](src/config/views.js)):

   | File | What it does (simple words) | Power BI equivalent |
   |------|-----------------------------|---------------------|

   ### ✏️ What if I want to change it?
   1–3 realistic, concrete change examples tied to the question. For each one:
   - **Goal** in plain words ("Change the Security tab colour to orange")
   - **File + line** as a clickable link
   - **Before → After** code snippet (only the few lines that change)
   - **What you'll see** after the change
   - ⚠️ Any gotcha (e.g. "the id must match the web map's layer id, or the layer won't show")

   ### 💡 Words to know (optional)
   Only if new technical terms came up: term → one-line meaning → Power BI equivalent.

3. **Tone:** friendly, short, no walls of text. Prefer examples over theory.
   Explain *what* and *why* before *how*. Don't dump whole files.
4. **Don't edit files** unless Wafaa explicitly asks — this command is for understanding. Offer to make the change at the end.

## Power BI ↔ this project cheat sheet

Use these as starting points; verify against the current code before relying on them.

| This project | What it is | Power BI equivalent |
|---|---|---|
| ArcGIS **Web Map** (`src/config/webmap.js` → `WEBMAP_ID`) | The online map with all layers, hosted on ArcGIS Online | The **published dataset / semantic model** in the Service |
| **Feature layer** | A table of rows that also have a location | A **table** in the model (with a geography column) |
| Layer ids (`L`, `POP` in `webmap.js`) | Names/keys used to find a layer | Table names you reference in DAX |
| **Views / tabs** (`src/config/views.js`) | Each tab = which layers are visible + colour + icon | **Report pages** |
| `groups` / `on` in a view | Which layers are switched on for that tab | **Page-level filters** / visual visibility (bookmarks) |
| **FilterBar** (country, map view vs whole region) | Lets user narrow what's shown | **Slicers** |
| `filters.js` (`COUNTRIES`, `SCOPES`) | The list of options in the slicers | The **slicer's values** |
| React **state** (`useState` in `App.jsx`) | Remembers the current selection | **Filter context** / current slicer selection |
| **Props** | Values passed from a parent component to a child | A visual inheriting the page's filters |
| **Component** (`src/components/...`) | A reusable piece of the screen | A **visual** on the canvas |
| `KpiRow` | The big-number tiles | **Card** visuals |
| `charts/Donut`, `charts/Columns`, `ChartList` | The charts | **Donut / column chart / table** visuals |
| `services/statsQuery.js` (`outStatistics`, `groupBy`) | Asks the server to sum/count grouped by a field | A **DAX measure** with `SUMMARIZE` / `GROUPBY` (or Power Query Group By) |
| `services/statsLoaders.js` | The set of calculations per tab | The **measures table** for each page |
| `hooks/useStats.js` | Re-runs the calculations when tab/map/scope changes | **Visual refresh** when filter context changes |
| Map `extent` (scope = "Map view") | Only count what's visible on the map | Cross-filtering from a map visual |
| `utils/format.js` | Number formatting (e.g. 1.2M) | **Format string** / display units |
| CSS files (`*.css`) | Colours, sizes, spacing | **Format pane** / report theme JSON |
| `styles/index.css` | Global look | The **report theme** |
| `npm run dev` | Runs the app locally | **Power BI Desktop** preview |
| `npm run build` | Packages the app for publishing | **Publish to Service** |
