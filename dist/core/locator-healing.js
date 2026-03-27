"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveLocator = void 0;
const calculateDomSimilarity = async (_page, _selector) => {
    return 0;
};
const resolveLocator = async (page, selectors) => {
    for (const selector of selectors) {
        const candidate = page.locator(selector).first();
        if ((await candidate.count()) > 0) {
            return candidate;
        }
    }
    let highestScore = -1;
    let healedSelector = selectors[0];
    for (const selector of selectors) {
        const score = await calculateDomSimilarity(page, selector);
        if (score > highestScore) {
            highestScore = score;
            healedSelector = selector;
        }
    }
    return page.locator(healedSelector).first();
};
exports.resolveLocator = resolveLocator;
