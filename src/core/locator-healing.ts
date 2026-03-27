import type { Locator, Page } from "playwright";

const calculateDomSimilarity = async (_page: Page, _selector: string): Promise<number> => {
  return 0;
};

export const resolveLocator = async (page: Page, selectors: string[]): Promise<Locator> => {
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
