import { chromium, type Browser, type BrowserContext, type Page } from "playwright";
import path from "node:path";

export interface WebSession {
  browser: Browser;
  context: BrowserContext;
  page: Page;
}

export class WebDriver {
  async startSession(runId: string): Promise<WebSession> {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      recordVideo: { dir: path.join(process.cwd(), "reports", "videos", runId) }
    });
    const page = await context.newPage();
    return { browser, context, page };
  }

  async stopSession(session: WebSession): Promise<void> {
    await session.context.close();
    await session.browser.close();
  }
}
