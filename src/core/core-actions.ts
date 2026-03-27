import type { Page } from "playwright";
import axe from "axe-core";
import { resolveLocator } from "./locator-healing";

export class CoreActions {
  constructor(private readonly page: Page) {}

  async clickWithHealing(locators: string[]): Promise<void> {
    const locator = await resolveLocator(this.page, locators);
    await locator.click();
  }

  async typeWithHealing(locators: string[], value: string): Promise<void> {
    const locator = await resolveLocator(this.page, locators);
    await locator.fill(value);
  }

  async runAccessibilityAudit(): Promise<unknown> {
    await this.page.addScriptTag({ content: axe.source });
    return this.page.evaluate(async () => {
      const engine = (window as unknown as { axe: { run: () => Promise<unknown> } }).axe;
      return engine.run();
    });
  }
}
