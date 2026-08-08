import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const sharedStyles = readFileSync("src/shared/styles/index.css", "utf8");

function getRuleBody(selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = sharedStyles.matchAll(new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\}`, "g"));

  return Array.from(matches, (match) => match[1]).join("\n");
}

function getBlockBody(source: string, blockStart: string) {
  const blockIndex = source.indexOf(blockStart);
  const openingBraceIndex = source.indexOf("{", blockIndex);

  if (blockIndex === -1 || openingBraceIndex === -1) return "";

  let depth = 0;

  for (let index = openingBraceIndex; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(openingBraceIndex + 1, index);
  }

  return "";
}

function getRuleBodyFrom(source: string, selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = source.match(new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\}`));

  return match?.[1] ?? "";
}

describe("outbound styles", () => {
  it("keeps the mailbox selector and summary cards balanced in the desktop command strip", () => {
    const commandStripRule = getRuleBody(".outbound-command-strip");
    const statGridRule = getRuleBody(".outbound-stat-grid");

    expect(commandStripRule).toContain("grid-template-columns: minmax(300px, 1.35fr) minmax(0, 2.65fr)");
    expect(commandStripRule).not.toContain("repeat(4");
    expect(statGridRule).toContain("display: grid");
    expect(statGridRule).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))");
  });

  it("uses the same quiet muted surface language as the rest of the workspace", () => {
    const statCardRule = getRuleBody(".outbound-stat-card");
    const statCardHoverRule = getRuleBody(".outbound-stat-card:hover");
    const toolbarRule = getRuleBody(".outbound-toolbar-card");

    expect(statCardRule).toContain("--outbound-stat-accent: var(--accent)");
    expect(statCardRule).toContain("background: var(--surface-muted)");
    expect(statCardRule).toContain("border: 1px solid var(--border-subtle)");
    expect(statCardRule).toContain("border-radius: 16px");
    expect(statCardRule).not.toContain("linear-gradient");
    expect(toolbarRule).toContain("padding: 22px 24px");
    expect(statCardHoverRule).toContain("border-color: var(--border-strong)");
    expect(statCardHoverRule).not.toContain("transform: translateY");
  });

  it("preserves a distinct keyboard focus ring on the outbound mailbox trigger", () => {
    const focusRule = getRuleBody(".outbound-mailbox-trigger.ui-button:focus-visible");

    expect(focusRule).toContain("outline: 2px solid color-mix(in srgb, var(--accent) 72%, transparent)");
    expect(focusRule).toContain("outline-offset: 2px");
    expect(focusRule).toContain("box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 16%, transparent)");
  });

  it("uses a compact delivery-route strip and collapses it in two responsive stages", () => {
    const readinessPanelRule = getRuleBody(".outbound-readiness-panel");
    const readinessRouteRule = getRuleBody(".outbound-readiness-grid::before");
    const mediumContainer = getBlockBody(sharedStyles, "@container (max-width: 980px)");
    const smallContainer = getBlockBody(sharedStyles, "@container (max-width: 640px)");

    expect(readinessPanelRule).toContain("gap: 14px");
    expect(readinessPanelRule).toContain("padding: 15px 16px");
    expect(readinessPanelRule).toContain("border-radius: 18px");
    expect(readinessPanelRule).toContain("background: var(--surface-muted)");
    expect(readinessRouteRule).toContain("height: 1px");
    expect(getRuleBodyFrom(mediumContainer, ".outbound-command-strip")).toContain("grid-template-columns: 1fr");
    expect(getRuleBodyFrom(mediumContainer, ".outbound-stat-grid")).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))");
    expect(getRuleBodyFrom(smallContainer, ".outbound-stat-grid,\n  .outbound-readiness-grid")).toContain("grid-template-columns: 1fr");
  });
});
