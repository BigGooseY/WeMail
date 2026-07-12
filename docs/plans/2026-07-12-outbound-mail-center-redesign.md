# Outbound Mail Center Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the outbound mail center card as a quiet, compact control surface with a balanced identity-and-statistics strip and a condensed readiness panel.

**Architecture:** Keep the existing outbound data flow and interactions intact. Restructure only the page-level JSX composition and the existing outbound CSS rules, reusing current shared controls and preserving all API contracts.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, shared CSS design tokens.

---

### Task 1: Lock the new layout contract in tests

**Files:**
- Modify: `apps/web/src/test/outbound-styles.test.ts`
- Modify: `apps/web/src/test/integration/outbound-page.test.tsx`

**Step 1: Write the failing style tests**

Update the desktop command-strip expectation to require a wider identity column and quiet neutral stat cards. Add assertions for the compact readiness summary and responsive two-stage collapse.

```ts
expect(commandStripRule).toContain("grid-template-columns: minmax(300px, 1.35fr) minmax(0, 2.65fr)");
expect(statCardRule).toContain("background: var(--surface-elevated)");
expect(readinessPanelRule).toContain("background: color-mix");
```

**Step 2: Write the failing integration assertions**

Change the readiness heading expectation from `身份、DNS 与模板` to `发信准备状态`. Assert that identity, statistics, DNS checks, and templates remain present and interactive.

**Step 3: Run tests to verify they fail**

Run:

```bash
pnpm --dir apps/web exec vitest run src/test/outbound-styles.test.ts src/test/integration/outbound-page.test.tsx
```

Expected: FAIL because the current layout and heading still use the old design.

**Step 4: Commit the test contract**

```bash
git add apps/web/src/test/outbound-styles.test.ts apps/web/src/test/integration/outbound-page.test.tsx
git commit -m "test: define outbound mail center layout"
```

### Task 2: Restructure the mail center content

**Files:**
- Modify: `apps/web/src/features/outbound/OutboundPage.tsx:470-630`

**Step 1: Rename and condense readiness copy**

Replace the readiness heading with `发信准备状态`. Derive a concise status label from the existing maturity status without changing the payload.

**Step 2: Preserve the four-part command strip**

Keep the mailbox trigger as the first and wider item. Keep the three `StatCard` items, but remove copy that duplicates labels or implies unsupported actions.

**Step 3: Recompose readiness content**

Keep the three readiness metrics and three detail columns, but group them under one visually quieter panel. Preserve template button handlers and all status data attributes.

**Step 4: Run the focused tests**

```bash
pnpm --dir apps/web exec vitest run src/test/outbound-styles.test.ts src/test/integration/outbound-page.test.tsx
```

Expected: integration assertions pass; style assertions may still fail until Task 3.

**Step 5: Commit the JSX structure**

```bash
git add apps/web/src/features/outbound/OutboundPage.tsx apps/web/src/test/integration/outbound-page.test.tsx
git commit -m "refactor: simplify outbound mail center"
```

### Task 3: Apply the quiet console visual system

**Files:**
- Modify: `apps/web/src/shared/styles/index.css:12238-12760`
- Modify: `apps/web/src/test/outbound-styles.test.ts`

**Step 1: Update the command strip grid**

Use a stable four-item information band:

```css
.outbound-command-strip {
  grid-template-columns: minmax(300px, 1.35fr) minmax(0, 2.65fr);
  gap: 12px;
}
```

The nested stat grid remains three equal columns.

**Step 2: Quiet the mailbox and stat surfaces**

Use neutral elevated backgrounds, 8px radii, restrained borders, and subtle state accents. Remove large tinted gradients and strong hover lifting. Keep stable heights and ellipsis behavior.

**Step 3: Condense the readiness panel**

Reduce visual weight by using one neutral panel background, smaller internal gaps, compact metric rows, and simple separators. Status colors remain semantic and localized.

**Step 4: Add responsive rules**

- Medium container: mailbox identity spans the full row and statistics remain three columns.
- Small container: statistics and readiness columns become one column.
- Actions wrap without overlap and long addresses remain truncated.

**Step 5: Run focused tests**

```bash
pnpm --dir apps/web exec vitest run src/test/outbound-styles.test.ts src/test/integration/outbound-page.test.tsx
```

Expected: PASS.

**Step 6: Commit the visual redesign**

```bash
git add apps/web/src/shared/styles/index.css apps/web/src/test/outbound-styles.test.ts
git commit -m "style: redesign outbound mail center"
```

### Task 4: Verify responsive rendering and release readiness

**Files:**
- Modify: `CHANGELOG.md`

**Step 1: Add the changelog entry**

Document the redesigned outbound mail center under `[Unreleased] / Changed`.

**Step 2: Run full verification**

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Expected: all commands pass.

**Step 3: Run browser verification**

Start the local web preview and capture desktop and mobile views. Confirm:

- identity and three statistics align on desktop;
- no text or buttons overlap;
- medium and small layouts collapse as specified;
- template actions and mailbox switching remain clickable;
- the card visually matches the quiet system workspace style.

**Step 4: Commit verification metadata**

```bash
git add CHANGELOG.md
git commit -m "docs: record outbound mail center redesign"
```
