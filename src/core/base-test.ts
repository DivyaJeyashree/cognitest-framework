import type { APIRequestContext, BrowserContext, Page } from "playwright";
import type { Browser } from "playwright";
import type { Browser as WDIOBrowser } from "webdriverio";
import type { Platform, TestArtifact, TestResult } from "../types";

export interface TestContext {
  env: string;
  baseUrl?: string;
  browser?: Browser;
  browserContext?: BrowserContext;
  page?: Page;
  apiContext?: APIRequestContext;
  mobileDriver?: WDIOBrowser;
}

export interface HybridTestCase {
  id: string;
  name: string;
  suite: string;
  platform: Platform;
  tags: string[];
  run: (context: TestContext) => Promise<void>;
}

export class SkipTestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SkipTestError";
  }
}

export const makeResult = (
  test: HybridTestCase,
  status: TestResult["status"],
  startedAt: number,
  endedAt: number,
  retries: number,
  artifacts: TestArtifact[],
  error?: string
): TestResult => ({
  id: test.id,
  name: test.name,
  suite: test.suite,
  platform: test.platform,
  tags: test.tags,
  status,
  startedAt: new Date(startedAt).toISOString(),
  endedAt: new Date(endedAt).toISOString(),
  durationMs: endedAt - startedAt,
  retries,
  artifacts,
  error
});
