# TODOs - Fresh Mayhem

**Planned improvements and tasks.**

---

## Instructions for Claude

**Read this file at session start (step 4 of the load order)** to understand what work is pending, in progress, or blocked.

- Before starting new work, check if a relevant task already exists here
- When user completes a task, move it to the Completed section with a completion date
- When new tasks emerge during a session, add them to the appropriate priority section
- Always ask before reprioritizing existing tasks
- If a task reveals a non-obvious issue, also document it in [_LESSONS-LEARNED.md](./_LESSONS-LEARNED.md)

**When to update this file:**
- After completing any task
- When new work is identified
- When priorities shift
- When blockers are discovered or resolved

---

## High Priority (Active)

### i18n — Full Internationalization (13 languages)
**Started:** 2026-03-27 | **Status:** In progress

#### Infrastructure (DONE)
- [x] Install react-i18next, i18next, i18next-browser-languagedetector
- [x] Create i18n config (`src/i18n.js`) with browser detection + localStorage
- [x] Create English master locale (`locales/en.json`)
- [x] Generate 12 translated locale files (cs, da, de, es, fi, fr, it, ja, nl, pt, pt-BR, sv)
- [x] Create custom LanguageSwitcher component (dark theme, no native select)
- [x] Add switcher to desktop + mobile sidebar
- [x] Wire i18n into main.jsx entry point

#### UI Chrome Translation (DONE)
- [x] Sidebar nav labels, brand text
- [x] DashboardLayout footer (all text + locale-formatted dates)
- [x] All 10 page titles, subtitles, section headers
- [x] SafetyBadge labels + tooltips
- [x] AppCard "Learn more" / "Less" / "Wiki" / "Utility"
- [x] Controls page — all instructions, emergency stop steps
- [x] QuickStart page — title, subtitle, clear button
- [x] Where to Buy — disclaimers, filters, tips labels
- [x] Frequencies — table headers, disclaimers
- [x] Safety — tabs, section headers, amp insight content
- [x] Learn — tabs, resources heading, links subtitle
- [x] Tools — section titles
- [x] 404 page — all text
- [x] Command palette — placeholder, hints, type labels

#### Data Content Translation (IN PROGRESS)
- [ ] DangerDonut chart labels (Extreme, Danger, etc.)
- [ ] TX apps — descriptions, legal, learn text (22 apps × 12 languages)
- [ ] RX apps — descriptions, learn text (30 apps × 12 languages)
- [ ] Vendor data — descriptions, notes, buying tips (11 vendors × 12 languages)
- [ ] Safety data — mistakes, stories content
- [ ] QuickStart step text (26 steps × 12 languages)
- [ ] Frequency band names, services, penalties
- [ ] Overview page card descriptions + stats
- [ ] HeroHeader stats
- [ ] Link/video titles + descriptions

#### Final QA
- [ ] Test all 13 languages end-to-end
- [ ] Verify no missing keys (console warnings)
- [ ] Mobile responsive test with longer translated strings
- [ ] Commit + push to prod

---

## High Priority

- [ ] **Strip EXIF metadata from all screenshots**
  - Run `exiftool -all= public/screenshots/*.png` before publishing
  - Prevents any hidden metadata leaks
  - **Added:** 2026-02-28

---

## Medium Priority

- [ ] **Add more interactive visualizations**
  - Consider: signal modulation demo, antenna radiation pattern viz
  - Follow ExpandableCard (cyan) pattern for new interactive content
  - **Added:** 2026-02-28

- [ ] **Expand test coverage to 80%+**
  - Focus on component rendering, data integrity, routing
  - **Added:** 2026-02-28

---

## Low Priority

- [ ] **Add dark/light theme toggle**
  - DaisyUI supports theme switching
  - **Added:** 2026-02-28

---

## Completed

- [x] Set up Claude Anchor framework — **Completed:** 2026-02-28
- [x] Implement Vitest testing suite — **Completed:** 2026-02-28
- [x] Security/PII audit — **Completed:** 2026-02-28
- [x] Comprehensive .gitignore — **Completed:** 2026-02-28

---

## Ideas for Future

- PWA support for offline use
- ~~Search across all apps/frequencies~~ **Done** — CommandPalette (Ctrl+K) added 2026-03-26
- User-contributed damage stories submission
- Comparison tool: HackRF vs other SDRs

---

## Maintenance

- **Review** this file at each session start — remove stale items, update priorities
- **Archive** completed tasks quarterly if the list grows long
- **Cross-reference** with `_LESSONS-LEARNED.md` when tasks reveal gotchas

**Add new items as they come up. Move to Completed when done.**

<!-- Claude Anchor v1.3 — Customized for Fresh Mayhem -->
