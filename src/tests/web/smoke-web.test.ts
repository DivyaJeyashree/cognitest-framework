import { CoreActions } from "../../core/core-actions";
import type { HybridTestCase } from "../../core/base-test";

export const smokeWebTest: HybridTestCase = {
  id: "WEB-001",
  name: "Example home page smoke validation",
  suite: "smoke",
  platform: "web",
  tags: ["login", "smoke"],
  run: async ({ page }) => {
    if (!page) {
      throw new Error("Web page context missing");
    }
    await page.goto("https://example.com");
    await page.waitForLoadState("domcontentloaded");
    const heading = page.locator("h1");
    const text = await heading.textContent();
    if (!text?.includes("Example Domain")) {
      throw new Error("Expected heading was not found");
    }
    const actions = new CoreActions(page);
    await actions.runAccessibilityAudit();
  }
};
