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

  it("uses a neutral elevated surface and restrained interaction for outbound summary cards", () => {
    const statCardRule = getRuleBody(".outbound-stat-card");
    const statCardHoverRule = getRuleBody(".outbound-stat-card:hover");

    expect(statCardRule).toContain("--outbound-stat-accent: var(--accent)");
    expect(statCardRule).toContain("background: var(--surface-elevated)");
    expect(statCardRule).toContain("border: 1px solid var(--border-subtle)");
    expect(statCardRule).not.toContain("linear-gradient");
    expect(statCardHoverRule).toContain("border-color: var(--border-strong)");
    expect(statCardHoverRule).toContain("box-shadow:");
    expect(statCardHoverRule).not.toContain("transform: translateY");
  });

  it("keeps the readiness panel compact and collapses it in two responsive stages", () => {
    const readinessPanelRule = getRuleBody(".outbound-readiness-panel");
    const mediumContainer = getBlockBody(sharedStyles, "@container (max-width: 980px)");
    const smallContainer = getBlockBody(sharedStyles, "@container (max-width: 640px)");

    expect(readinessPanelRule).toContain("gap: 10px");
    expect(readinessPanelRule).toContain("padding: 12px");
    expect(readinessPanelRule).toContain("border-radius: 8px");
    expect(readinessPanelRule).toContain("background: color-mix");
    expect(getRuleBodyFrom(mediumContainer, ".outbound-command-strip")).toContain("grid-template-columns: 1fr");
    expect(getRuleBodyFrom(mediumContainer, ".outbound-stat-grid")).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))");
    expect(getRuleBodyFrom(mediumContainer, ".outbound-readiness-columns")).toContain("grid-template-columns: 1fr");
    expect(getRuleBodyFrom(smallContainer, ".outbound-stat-grid,\n  .outbound-readiness-grid")).toContain("grid-template-columns: 1fr");
  });
});
