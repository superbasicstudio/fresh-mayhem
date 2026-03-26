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
