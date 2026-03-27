"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smokeWebTest = void 0;
const core_actions_1 = require("../../core/core-actions");
exports.smokeWebTest = {
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
        const actions = new core_actions_1.CoreActions(page);
        await actions.runAccessibilityAudit();
    }
};
