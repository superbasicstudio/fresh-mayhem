# System Architecture - Fresh Mayhem

**Technical reference for system design, data flow, and component interactions.**

---

## Instructions for Claude

**Reference this file when answering questions about system design, component interactions, or data flow.**

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Fresh Mayhem                                        │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              ENTRY LAYER                                    │ │
│  │                                                                             │ │
│  │   index.html ──► main.jsx ──► HashRouter ──► App.jsx                       │ │
│  │                                                                             │ │
│  └─────────────────────────────────┬───────────────────────────────────────────┘ │
│                                    │                                             │
│                                    ▼                                             │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                           LAYOUT LAYER                                      │ │
│  │                                                                             │ │
│  │   DashboardLayout ──► Sidebar (nav) + CommandPalette + Outlet (content)    │ │
│  │                                                                             │ │
│  └─────────────────────────────────┬───────────────────────────────────────────┘ │
│                                    │                                             │
│           ┌────────┬───────┬───────┼───────┬───────┬───────┬───────┬──────┐     │
│           ▼        ▼       ▼       ▼       ▼       ▼       ▼       ▼      ▼     │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                            PAGE LAYER (9 pages)                             │ │
│  │                                                                             │ │
│  │   Overview │ Controls │ Receive │ Transmit │ Tools │ Safety │ Freq │ ...   │ │
│  │                                                                             │ │
│  └─────────────────────────────────┬───────────────────────────────────────────┘ │
│                                    │                                             │
│           ┌────────┬───────┬───────┼───────┬───────┬───────┐                    │
│           ▼        ▼       ▼       ▼       ▼       ▼       ▼                    │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                          COMPONENT LAYER                                    │ │
│  │                                                                             │ │
│  │   ExpandableImage │ ExpandableCard │ SafetyBadge │ AppCard │ ...           │ │
│  │   ErrorBoundary   │ SearchFilter   │ PageSection │ VideoEmbed              │ │
│  │   CommandPalette (Ctrl+K global search across all data)                    │ │
│  │                                                                             │ │
│  │   charts/                           viz/                                    │ │
│  │   ├── CategoryBreakdown             ├── PortaPackMockup                     │ │
│  │   ├── DangerDonut                   ├── WaterfallSim                        │ │
│  │   ├── FrequencySpectrum             ├── ContextPanel                        │ │
│  │   └── GainChain                     └── ImagePlaceholder                    │ │
│  │                                                                             │ │
│  └─────────────────────────────────┬───────────────────────────────────────────┘ │
│                                    │                                             │
│                                    ▼                                             │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                            DATA LAYER                                       │ │
│  │                                                                             │ │
│  │   data/rxApps.js (30 apps) │ data/txApps.js (23 apps)                      │ │
│  │   data/tools.js (tools+settings+games) │ data/safety.js                    │ │
│  │   data/frequencyMap.js │ data/links.js │ data/videos.js                    │ │
│  │   data/appDetails.js                                                       │ │
│  │                                                                             │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
                              ┌─────────────────┐
                              │   Static Data    │
                              │   (JS modules)   │
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │   Page Component │
                              │   (imports data) │
                              └────────┬────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
           ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
           │   UI Components │ │   Charts (D3)  │ │   Viz (p5.js)  │
           │   AppCard, etc. │ │   DangerDonut  │ │   WaterfallSim │
           └────────────────┘ └────────────────┘ └────────────────┘
```

No API calls. No server state. All data is static JS exports. Pure client-side SPA.

---

## File System Layout

```
fresh-mayhem/
├── CLAUDE.md                    Project context (Anchor-enhanced)
├── _GOLDEN-RULES.md             Immutable rules
├── _TODOS.md                    Task tracking
├── _LESSONS-LEARNED.md          Past issues
├── _VOICE-AND-TONE.md           Personality/style
├── _CONVERSATION-PREFERENCES.md Output formatting
├── _DESIGN-PREFERENCES.md       Visual/UX rules
├── _LONG-TERM-MEMORY.md         Persistent memory
├── _SHORT-TERM-MEMORY.md        Multi-session context
├── _SYSTEM_ARCHITECTURE.md      This file
├── index.html                   Entry point
├── package.json                 Dependencies
├── vite.config.js               Vite configuration
├── tailwind.config.cjs          Tailwind configuration
├── postcss.config.cjs           PostCSS configuration
├── vitest.config.js             Test configuration
├── src/
│   ├── main.jsx                 React entry point
│   ├── App.jsx                  Router + routes
│   ├── index.css                Global styles
│   ├── layouts/
│   │   └── DashboardLayout.jsx  Sidebar + content layout
│   └── pages/                   9 page components
├── components/                  Reusable UI components
│   ├── charts/                  D3.js visualizations
│   └── viz/                     p5.js / interactive visualizations
├── data/                        Static data modules
├── public/
│   ├── screenshots/             App screenshots (11 PNGs)
│   ├── favicon.svg              Site icon
│   └── robots.txt               Crawler config
└── tests/                       Vitest test suite
```

---

## Routing

```
HashRouter (client-side, no server config needed)
├── / ──────────────── OverviewPage
├── /controls ──────── ControlsPage
├── /receive ───────── ReceivePage
├── /transmit ──────── TransmitPage
├── /tools ─────────── ToolsPage
├── /safety ────────── SafetyPage
├── /frequencies ───── FrequenciesPage
├── /learn ─────────── LearnPage
└── /quickstart ────── QuickStartPage
```

---

## Build & Deploy

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   npm run build  │────►│   Vite bundler   │────►│   dist/ folder   │
│   (production)   │     │   (tree-shake,   │     │   (static HTML,  │
│                  │     │    minify, etc.)  │     │    JS, CSS)      │
└──────────────────┘     └──────────────────┘     └────────┬─────────┘
                                                           │
                                                           ▼
                                                  ┌──────────────────┐
                                                  │   Vercel CDN     │
                                                  │   (auto-deploy   │
                                                  │    from GitHub)  │
                                                  └──────────────────┘
```

---

**Document Version:** 1.0
**Created:** 2026-02-28

<!-- Claude Anchor v1.3 — Customized for Fresh Mayhem -->
