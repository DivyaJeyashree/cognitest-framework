"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreActions = void 0;
const axe_core_1 = __importDefault(require("axe-core"));
const locator_healing_1 = require("./locator-healing");
class CoreActions {
    page;
    constructor(page) {
        this.page = page;
    }
    async clickWithHealing(locators) {
        const locator = await (0, locator_healing_1.resolveLocator)(this.page, locators);
        await locator.click();
    }
    async typeWithHealing(locators, value) {
        const locator = await (0, locator_healing_1.resolveLocator)(this.page, locators);
        await locator.fill(value);
    }
    async runAccessibilityAudit() {
        await this.page.addScriptTag({ content: axe_core_1.default.source });
        return this.page.evaluate(async () => {
            const engine = window.axe;
            return engine.run();
        });
    }
}
exports.CoreActions = CoreActions;
