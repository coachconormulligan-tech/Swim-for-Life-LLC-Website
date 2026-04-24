# Layer Inspector — Codebase Guide

MTG continuous-effects evaluator (CR 613). Single-page app, no build step, no frameworks, no external libraries. 6 files total.

## File Overview

| File | Lines | Role |
|------|-------|------|
| `index.html` | 97 | Layout skeleton; loads scripts in dependency order |
| `data.js` | 303 | Constants, effect templates, type catalog |
| `engine.js` | 2,465 | Layer evaluation engine, dependency detection |
| `cards.js` | 6,864 | Scryfall API, permanent creation, oracle text parsing |
| `ui.js` | 4,007 | All DOM rendering and event handling |
| `styles.css` | 1,646 | All styles |

**Script load order:** `data.js` → `engine.js` → `cards.js` → `ui.js`

---

## data.js

Constants only — no logic.

- `TypeCatalog` (line 14) — Scryfall type enums; async `init()` fetches from API with hardcoded fallback
- `LAYERS[]` (line 112) — Layer metadata with CR references
- `EFFECT_TYPE` (line 130) — String constants for effect types (`ADD_TYPE`, `SET_PT`, `TEXT_CHANGE`, etc.)
- `KNOWN_ABILITY_EFFECTS` (line 163) — Map of normalized oracle text → effect template arrays. This is the primary lookup used by `parseCardEffects()` in cards.js

---

## engine.js

Pure evaluation logic. No DOM. No Scryfall calls. Receives state objects, returns computed state.

**Key functions:**
- `createBaseState(perm)` line 52 — Builds mutable state object from a permanent
- `applyEffect(state, effect)` line 157 — Applies one effect to one state; handles CR 305.7 land mana ability side-effects
- `effectAppliesToPerm(effect, perm, allStates)` line 910 — Tests whether an effect targets/applies to a given permanent
- `isSourceViable(effect, allStates)` line 1079 — Checks whether the source permanent still exists and qualifies
- `doesBInfluenceA_global(A, B, allEffects, allPerms)` line 1134 — **CR 613.8 dependency detection.** Tests if applying B before A changes A's result. Has special-case logic for word-replacement effects (asymmetric), ADD_ABILITY/REMOVE_ABILITIES (same layer, no cross-dependency), and source-viability checks
- `detectDependenciesGlobal(effects, perms)` line 1379 — Builds full dependency graph
- `removeLoopDependencies(graph)` line 1395 — DFS cycle detection; emits named loop log entries
- `applyLayerGlobal(layerId, effects, perms, log)` line 1440 — **Main layer evaluator.** Applies dependency ordering, then applies effects in order
- `evaluatePermanent(perm, allPerms, allEffects, gameState, opts)` line 2111 — **Primary export.** Runs all layers, returns `{ base, layers, applicationLog }`

**Layers implemented:** 1 (copy/mutate), 2 (control), 3 (text), 4 (type + 305.7 mana recalc), 5 (color), 6 (abilities), 7a–7e (P/T: CDA, set, modify, counters, switch)

---

## cards.js

Largest file. Three concerns: Scryfall integration, permanent management (`Battlefield`), oracle text parsing.

### Battlefield (global object, line 48)

The central application state. Everything reads from and writes to this.

```
Battlefield.permanents[]         — all permanents on battlefield
Battlefield.effects[]            — all parsed effects (from all permanents)
Battlefield.nextTimestamp        — auto-incrementing, used for ordering
Battlefield.inspectedId          — which permanent is selected in inspector
Battlefield.explanationMode      — 'teaching' | 'rules'
Battlefield.gameState{}          — handSize, currentLife, isYourTurn, etc.
Battlefield.mutateStacks[]       — array of [id, id, ...] stacks
Battlefield.getAllFinalStates()  — evaluates every permanent, returns Map<id, finalState>
```

**Key methods:**
- `Battlefield.addPermanent(perm)` line 455 — Adds to `.permanents`, triggers `parseCardEffects()`, calls `updateLabels()`
- `Battlefield.updateLabels()` line 825 — Assigns A/B/C labels to same-named permanents
- `Battlefield.getStack(id)` — Returns mutate stack containing this id, or null

### Permanent object shape (from `createPermanent()`, line 1527)

```
{
  id, name, timestamp, imageUri,
  printedTypes[], printedSupertypes[], printedSubtypes[],
  printedPower, printedToughness,     // null if not creature
  printedAbilities[], printedColors[],
  oracleText,                         // self-references substituted
  counters{}, traits[],
  isToken, isManualEffect, isTransformable,
  isFaceDown, faceDownMode,           // 'morph'|'manifest'|'cloak'
  tapped, label,                      // label: null | 'A'|'B'|...
}
```

### Oracle text parsing (`parseCardEffects()`, line 2953)

Normalizes oracle text → checks `KNOWN_ABILITY_EFFECTS` → falls back to regex parsers for:
- `boostRegex` — "+N/+N" P/T pumps
- `addTypeRegex` — "is also a [type]"
- `setTypeRegex` — "becomes a [type]"
- `wordReplaceRegex` — "each [word] is [word]"
- etc.

Key helpers: `parseTypeLine()` line 1935, `extractAbilities()` line 1981, `_resolveCardFace()` line 1472

---

## ui.js

All DOM. Calls into `Battlefield` and `engine.js`. No game logic of its own.

**Global vars:**
- `_orderShowAll` (line 39) — show all effects in layer order box vs. only those affecting inspected card
- `_lastSearchQuery` (line 163), `_searchTokensMode` (line 164)

**Key rendering functions:**
- `renderAll()` line 112 — Master render; calls all sub-renders
- `renderBattlefield()` line 487 — Renders card grid; computes `finalStates` via `Battlefield.getAllFinalStates()` for SBA checks and card overlay display
  - Inner `renderCardDiv(p)` line 632 — Builds one card's HTML. Uses `_cardFs` (finalState) for type line and P/T display; falls back to `p.printed*` if unavailable
- `renderTimestampPanel()` line 838 — Drag-reorderable effect/ability list
- `renderSearchResults()` line 210 — Scryfall results dropdown
- `renderCommanderPanel()` line 284 — Commander zone

**Key event handlers:**
- `selectPermanent(id)` line 720 — Sets `Battlefield.inspectedId`, triggers re-render
- `removePermanent(id)` line 766
- `toggleTapped(id)` line 771
- `flipCard(id)` line 786 — Switches active face on transform/modal DFC cards
- `fireTriggeredAbility(id, abilityIdx)` line 947 — Creates a pseudo-permanent from a triggered ability

**Resize/drag:** `initPanelResize()` line 122 (left panel width), `initSectionResize()` line 141 (timestamp section height)

---

## styles.css

No preprocessor. CSS custom properties defined at top.

**Color palette:**
```
--bg: #0f0f11          --surface: #1a1a20     --border: #2a2a35
--accent: #7c6df0      --accent2: #5b8af0
--gold: #d4a540        --green: #4caf80       --red: #e05555
--text-dim: (muted)    --mono: (monospace font)
```

**Key class prefixes:**
- `.bf-card*` — Battlefield card and its sub-elements (overlay, label, badges, buttons)
- `.insp-*` — Layer inspector panel
- `.ts-*` — Timestamp/ordering panel
- `.modal-*` — Modal overlays
- `.search-*` — Search bar and results

---

## Data Flow

```
User adds card
  ui.js → searchScryfall() [cards.js] → Scryfall API
  ui.js → createPermanent() [cards.js] → Battlefield.addPermanent()
                                       → parseCardEffects() → Battlefield.effects[]

User inspects permanent
  ui.js → Battlefield.getAllFinalStates() [cards.js]
        → evaluatePermanent() [engine.js] for each permanent
        → detectDependencies → applyLayerGlobal → applicationLog
  renderInspector() → displays per-layer effect log with dependency reasons
```

---

## Preview Server

- Serves from `/tmp/layers_static/` (NOT directly from the Dropbox folder)
- A PostToolUse hook auto-syncs edited files to `/tmp/layers_static/` after each edit
- If styles/JS aren't updating in browser: manually `cp` the file to `/tmp/layers_static/` and force-reload with a cache-busted stylesheet URL
