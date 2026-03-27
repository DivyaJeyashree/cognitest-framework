"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebDriver = void 0;
const playwright_1 = require("playwright");
class WebDriver {
    async startSession(runId) {
        const browser = await playwright_1.chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();
        return { browser, context, page };
    }
    async stopSession(session) {
        await session.context.close();
        await session.browser.close();
    }
}
exports.WebDriver = WebDriver;
