# Paperclip Design System Changelog

Versioned history for the brand and product design system. The live guide at `/brand` is the current spec; [`/brand/versions/v0.13.html`](/brand/versions/v0.13.html) is a navigable prior snapshot.

---

## v1.0 — Brand & product unification

**Date:** 22 Nov 2026  
**Status:** Current

First named release. Synthesis of paperclip.ing's editorial light palette with v0.13's product systems. Warm-neutral light mode, signal-green accent, full task-state vocabulary, and a single token model that covers both brand and product.

### Added

- Signal Green `#22C55E` replaces cobalt as the brand accent.
- Light-mode bg → `--bond` (pure white). Steel removed from light defaults.
- Task state vocabulary: backlog · todo · in progress · in review · done · canceled · blocked.
- Graphic generator embedded — six templates × six palettes × six backgrounds.
- Tone-of-voice rewriter (Claude-powered).
- Tailwind + JSON token exports alongside CSS.

### Documented

- Logo: stroke-based paperclip mark formalized with sizing ramp and clear-space.
- Midjourney `--sref 9mlaok7` documented for AI-generated imagery.

### Dropped

- Cobalt as brand accent (still in agent palette).

### Typography (corrected)

Early v1.0 drafts listed **Instrument Serif** as the display face (replacing Inter Tight). That direction was **removed before v1.0 shipped**.

- **DROP** Instrument Serif as display face.
- **Current** display face: **Inter Tight at weight 600** for all display roles.
- Body and labels: Inter. Mono: JetBrains Mono.

The inline changelog section in the design guide incorrectly recorded Instrument Serif as added at v1.0; this file is the corrected record.

---

## v0.13 — Material vocabulary & warm-neutral ramp

**Date:** 15 May 2026  
**Snapshot:** [`/brand/versions/v0.13.html`](/brand/versions/v0.13.html)

Pre-rebrand snapshot. Steel/linen/parchment/manila/vellum brand tokens become real CSS variables; semantic tokens reference them. Capsule motif + agent palette + heartbeats + traces + goal hierarchy all stable.

- Added linen, parchment, vellum to the warm ramp.
- Display face: Inter Tight at 600.
- Accent: Cobalt `#1F4DD6`.
- Light bg: Steel `#D8DCDF`.

---

## Decisions log

| Date | Ver | Decision | Rationale |
|------|-----|----------|-----------|
| 2026‑11‑22 | v1.0 | Display face → Inter Tight (Instrument Serif removed) | Instrument Serif was trialed for editorial gravity but dropped. Inter Tight at 600 keeps display and product surfaces aligned — tighter, more product-native, less magazine. |
| 2026‑11‑22 | v1.0 | Light bg → bond (#FFF), not steel | Steel was a strong opinion that didn't survive contact with real content. White + warm neutrals reads cleaner without losing the editorial feel. |
| 2026‑11‑22 | v1.0 | Brand accent → signal green | "Active" is the most important state in an agent OS. Aligning the brand accent with "alive" makes every active surface read at a glance. |
| 2026‑11‑22 | v1.0 | 7 task states fixed | Linear-style fixed vocabulary. Each state has a fixed icon + color so a "Done" chip on the board reads the same in a row, in a chip, in a trace. |
| 2026‑11‑22 | v1.0 | Radius scale collapses to 5 steps | 10/16/24 + pill + capsule. Brand-level shape vocabulary stays small and decisive. |
| 2026‑05‑15 | v0.13 | +linen, +parchment, +vellum warm tokens | Expanded warm end of the neutral ramp. |
| 2026‑05‑14 | v0.12 | Material tokens become CSS variables | Material vocabulary exists in code, not just docs. |
| 2026‑05‑13 | v0.09 | Dark-mode `--ink` = manila | Every "cream" surface in dark mode resolves to one hex. |
| 2026‑05‑13 | v0.06 | Primary hover committed → pure white (light) / cream-bordered pill (dark) | Five-option grid replaced with single committed states. Stronger state change telegraphs "this is the action." |
| 2026‑05‑13 | v0.03 | Agent palette → 12 presets + custom | Six wasn't enough headroom for real fleets. |
| 2026‑05‑13 | v0.01 | Capsule motif declared as the brand asset | Smooth gradient. 1:2 minimum. Reserved for agent representation — never on chrome. |

---

## Open questions (carry forward to v1.1)

- Should the agent capsule's *orientation* carry meaning? Vertical = "running"; horizontal = "asleep"?
- Does shadcn theme map cleanly to our semantic token names, or do we ship our own primitives?
- Storybook integration: should the design system page *be* the storybook, or live alongside it?
- "Heartbeats" vs. "agent liveness" — confirm naming for technical docs.
- Mobile choreography for the capsule field and bot bloom (poster fallback vs. simplified motion).

---

## Guide maintenance

The following were removed from the live design system page and archived here:

- **Section 15 · Changelog** (versions, decisions log, open questions) → this file
- **Design tokens · Live playground** (interactive token editor) → removed; edit tokens in `tokens.css` / regenerate exports directly
