# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Context (Read First)
- **Project**: Fresh Mayhem — Interactive HackRF + PortaPack H4M learning dashboard
- **Tech Stack**: React 18, Vite 5, Tailwind CSS 3, DaisyUI 4, D3.js 7, p5.js, react-router-dom
- **Dev Server**: `npm run dev` (http://localhost:3022)
- **Build**: `npm run build` then `npm run preview`
- **Test**: `npm test` (Vitest) or `npm run test:coverage`
- **License**: GPL-3.0
- **Framework**: Claude Anchor v1.3 (behavioral context framework)

## Claude Anchor — Session Load Order

This project uses [Claude Anchor](https://github.com/superbasicstudio/claude-anchor) for persistent memory, enforceable rules, and session continuity. **On every session start, follow this load order:**

```
0. _RAM.md                       ← IF EXISTS: recover interrupted session state
1. _SHORT-TERM-MEMORY.md         ← IF EXISTS: active multi-session context
2. _VOICE-AND-TONE.md            ← Personality and language style
3. _GOLDEN-RULES.md              ← BINDING rules — MUST FOLLOW every session
4. _TODOS.md                     ← Know what's pending
5. _LESSONS-LEARNED.md           ← Avoid past mistakes
6. _LONG-TERM-MEMORY.md          ← Persistent knowledge
7. _CONVERSATION-PREFERENCES.md  ← Output formatting
8. _DESIGN-PREFERENCES.md        ← Visual design and UX rules
9. _GOLDEN-RULES.md              ← Re-read (reinforce — prevent context decay)
10. CLAUDE.md (this file)         ← Full project context
11. BEGIN conversation
```

### Anchor Files Reference

| File | Purpose | Priority |
|------|---------|----------|
| `_RAM.md` | Single-session crash recovery (volatile, gitignored) | **RECOVERY** |
| `_VOICE-AND-TONE.md` | Personality and communication style | **FIRST** |
| `_GOLDEN-RULES.md` | Immutable rules — MUST FOLLOW | **BINDING** |
| `_TODOS.md` | Active tasks and priorities | High |
| `_LESSONS-LEARNED.md` | Past mistakes and fixes | High |
| `_LONG-TERM-MEMORY.md` | Persistent knowledge (NEVER delete) | High |
| `_CONVERSATION-PREFERENCES.md` | Output formatting | Medium |
| `_DESIGN-PREFERENCES.md` | Visual design and UX rules | High |
| `_SHORT-TERM-MEMORY.md` | Multi-session temporary context | Conditional |
| `_SYSTEM_ARCHITECTURE.md` | Technical diagrams and data flow | Reference |

## Git Identity (VIP — MUST FOLLOW)

**All commits, PRs, merges, and any git operations MUST use this identity:**

```
git config user.name "Super Basic Studio, LLC"
git config user.email "hello@superbasic.studio"
```

- NEVER commit as a personal name or local hostname identity
- The public-facing identity for this repo is **superbasicstudio**
- Verify with `git config user.name` before committing
- This applies to all Co-Authored-By trailers as well

## Project Structure

```
fresh-mayhem/
├── src/                    React application source
│   ├── main.jsx            Entry point (HashRouter + Analytics)
│   ├── App.jsx             Routes (9 pages)
│   ├── index.css            Global styles (Tailwind)
│   ├── layouts/             DashboardLayout (sidebar + content)
│   └── pages/               9 page components
├── components/              Reusable UI components
│   ├── charts/              D3.js visualizations
│   └── viz/                 p5.js / interactive visualizations
├── data/                    Static data modules (apps, tools, safety, frequencies)
├── public/                  Static assets (screenshots, favicon, robots.txt)
├── tests/                   Vitest test suite
│   ├── data/                Data integrity tests
│   ├── components/          Component rendering tests
│   ├── app/                 Routing tests
│   ├── security/            PII/secret scanning tests
│   └── anchor/              Anchor framework validation tests
├── vitest.config.js         Test configuration
├── vite.config.js           Vite dev/build configuration
├── tailwind.config.cjs      Tailwind CSS configuration
└── postcss.config.cjs       PostCSS configuration
```

## Pages

10 interactive pages: Overview, Controls, RX Apps, TX Apps, Tools, Safety, Frequencies, Learn, Quick Start, Where to Buy

## Data Files

| File | Contents | Count |
|------|----------|-------|
| `data/rxApps.js` | Receive applications | 30 apps |
| `data/txApps.js` | Transmit applications with danger ratings | 23 apps |
| `data/tools.js` | Tools, settings, games | 19 + 18 + 10 |
| `data/safety.js` | Damage scenarios, stories, frequency data | 10 + 7 + 3 arrays |
| `data/frequencyMap.js` | Frequency allocation data | — |
| `data/vendors.js` | Where to buy — vendor listings and buying tips | 11 vendors |
| `data/links.js` | External resource links | — |
| `data/videos.js` | Educational video references | — |
| `data/appDetails.js` | Detailed app documentation | — |

## UI Component Patterns

### Visual Distinction: Screenshots vs Interactive Elements

Two wrapper components enforce a clear visual language so users know what they're looking at:

- **`ExpandableImage`** (screenshots) — Purple treatment
  - Purple left border (`border-l-4 border-l-secondary`)
  - Floating "SCREENSHOT" badge with camera icon (top-left)
  - Purple-tinted hover overlay; click expands to full-screen modal
  - Used for: HackRF device photos, spectrum captures, app screenshots

- **`ExpandableCard`** (interactive visualizations) — Cyan treatment
  - Cyan left border (`border-l-4 border-l-primary`)
  - Inline "INTERACTIVE" badge with cursor icon next to the title
  - Click expand button to open full-size modal
  - Used for: PortaPackMockup, GainChain, WaterfallSim, FrequencySpectrum

**Color rule:** Purple (`secondary`) = static image. Cyan (`primary`) = interactive experience. Maintain this when adding new content.

### Command Palette (Global Search)

- **`CommandPalette`** — Ctrl+K / Cmd+K spotlight search
  - Searches across all data: RX apps, TX apps, tools, settings, games, safety scenarios, frequency bands, videos, and resource links
  - Scored multi-term matching (all terms must match; title matches rank higher)
  - Shows all 9 pages as quick-nav when query is empty
  - Color-coded type badges per result (RX App, TX App, Tool, Frequency, etc.)
  - Arrow keys to navigate, Enter to select, Esc to close
  - Trigger: `Ctrl+K` / `Cmd+K`, sidebar search button (desktop), search icon (mobile top bar)
  - Lives in `components/CommandPalette.jsx`, integrated via `DashboardLayout.jsx`

### Sidebar Download Link

- Desktop app (BETA) download link in both desktop and mobile sidebars
- Points to GitHub releases: `superbasicstudio/fresh-mayhem-PUBLIC/releases/tag/v0.9.3`
- Umami event tracking: `desktop-app-download` with `version` and `source` properties
- Shows download icon, "Desktop App BETA" label, "Linux · v0.9.3" subtext
- When updating the release version, update both sidebar links and the Umami event version property

## Testing

Test suite uses Vitest + @testing-library/react. Run with:

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With V8 coverage
```

### Test Categories

| Category | Files | What it Tests |
|----------|-------|---------------|
| Data integrity | `tests/data/*.test.js` | All data arrays have required fields, valid values, no duplicates |
| Components | `tests/components/*.test.jsx` | SafetyBadge, ErrorBoundary rendering and behavior |
| Routing | `tests/app/routing.test.jsx` | All 10 routes render without crashing |
| Security | `tests/security/pii.test.js` | No PII, secrets, or credentials in source files |
| Anchor | `tests/anchor/framework.test.js` | All Anchor files exist, have correct content, no PII |

---

## Maintenance Mode

Toggle a clean "updating" page for production during deploys or downtime.

```bash
bash scripts/maintenance-on.sh    # Enable: redirects all traffic to maintenance.html, pushes to Vercel
bash scripts/maintenance-off.sh   # Disable: removes redirect, pushes to Vercel
```

The maintenance page is a standalone HTML file at `public/maintenance.html` with no JS dependencies. It shows a simple dark themed page matching the site aesthetic with a pulsing status indicator.

## Git Commit Style

Never use em dashes, en dashes, or emojis in commit messages or code comments. Use semicolons sparingly. Write commits as a human developer would. Never reference AI, agents, or automated generation in commit messages or comments.

---

## GOLDEN RULE — NEVER BLAME HARDWARE FIRST

**When something isn't working, NEVER jump to "hardware issue", "bad wiring", or "damaged component" as a conclusion.**

- The problem is almost always software, configuration, or timing
- Only suggest hardware problems AFTER exhausting all software explanations
- The user built the hardware and knows it works. Trust that.
- Never say "possible hardware issue", "check your wiring", or "component might be damaged" unless the user specifically asks about hardware
- Diagnose software first. Always.

## Project Promotion (REMIND THOMAS)

**Fresh Mayhem is ready to promote.** When the topic comes up or when new features ship, remind Thomas about promotion opportunities.

- **Live URL:** https://freshmayhem.com
- **Promotion plan:** See `_PROJECT-PROMOTION-IDEAS.md` for full strategy
- **Target subreddits:** r/hackrf (best fit), r/RTLSDR (large SDR community), r/hacking (educational angle)
- **Skip:** r/amateurradio (off-topic risk), r/cybersecurity (strict promo rules)
- **Other channels:** Hackaday.io, RTL-SDR.com blog tip, Mayhem GitHub Discussions, Show HN, Discord servers
- **Key rule:** Lead with value, be genuine, space posts 2-3 days apart, engage with comments
- **After any major feature or visual update:** Suggest that this would be a good time to post/share

<!-- Claude Anchor v1.3 — Fresh Mayhem -->
