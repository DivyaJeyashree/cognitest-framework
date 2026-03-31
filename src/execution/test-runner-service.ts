import fs from "node:fs/promises";
import path from "node:path";
import { ApiDriver } from "../core/drivers/api-driver";
import { MobileDriver } from "../core/drivers/mobile-driver";
import { WebDriver } from "../core/drivers/web-driver";
import type { HybridTestCase, TestContext } from "../core/base-test";
import { SkipTestError, makeResult } from "../core/base-test";
import type { ExecutionRequest, TestArtifact, TestResult } from "../types";
import { logger } from "../utils/logger";

const isInfraDependencyError = (message: string): boolean =>
  message.includes("playwright install") ||
  message.includes("Executable doesn't exist") ||
  message.includes("Unable to connect to \"http://127.0.0.1:4723/wd/hub\"");


// ✅ ✅ ADD THIS HELPER FUNCTION
async function writeAllureResult(
  testId: string,
  name: string,
  status: string,
  start: number,
  stop: number
) {
  const uuid = `${testId}-${Date.now()}`;

  const allureResult = {
    uuid,
    name,
    status,
    start,
    stop
  };

  await fs.mkdir("allure-results", { recursive: true });

  await fs.writeFile(
    path.join("allure-results", `${uuid}-result.json`),
    JSON.stringify(allureResult, null, 2)
  );
}


export class TestRunnerService {
  constructor(
    private readonly webDriver = new WebDriver(),
    private readonly apiDriver = new ApiDriver(),
    private readonly mobileDriver = new MobileDriver()
  ) {}

  async runTests(tests: HybridTestCase[], request: ExecutionRequest): Promise<TestResult[]> {
    const parallelism = Math.max(1, request.parallelism ?? 2);
    const queue = [...tests];
    const results: TestResult[] = [];
    let shouldStop = false;

    const worker = async (): Promise<void> => {
      while (queue.length > 0) {
        if (request.failFast && shouldStop) return;

        const test = queue.shift();
        if (!test) return;

        const result = await this.runSingleTest(test, request);
        results.push(result);

        if (request.failFast && result.status === "failed") {
          shouldStop = true;
          return;
        }
      }
    };

    await Promise.all(Array.from({ length: parallelism }, () => worker()));
    return results;
  }

  private async runSingleTest(test: HybridTestCase, request: ExecutionRequest): Promise<TestResult> {
    const retries = Math.max(0, request.retries ?? 1);
    let attempt = 0;
    let finalResult: TestResult | undefined;

    while (attempt <= retries) {
      finalResult = await this.executeAttempt(test, request, attempt);

      if (finalResult.status === "passed" || finalResult.status === "skipped") {
        return finalResult;
      }

      attempt += 1;
    }

    return finalResult ?? makeResult(test, "failed", Date.now(), Date.now(), retries, [], "Unknown");
  }

  private async executeAttempt(
    test: HybridTestCase,
    request: ExecutionRequest,
    attempt: number
  ): Promise<TestResult> {

    const startedAt = Date.now();

    logger.info({
      event: "test_start",
      testId: test.id,
      name: test.name,
    });

    const artifacts: TestArtifact[] = [];

    const context: TestContext = {
      env: request.env,
      baseUrl: request.baseUrl,
    };

    const runId = `${test.id}-${Date.now()}-${attempt}`;

    try {
      // 🔹 Start drivers
      if (test.platform === "web") {
        const webSession = await this.webDriver.startSession(runId);
        context.browser = webSession.browser;
        context.browserContext = webSession.context;
        context.page = webSession.page;
      }

      if (test.platform === "api") {
        context.apiContext = await this.apiDriver.startSession("https://jsonplaceholder.typicode.com");
      }

      if (test.platform === "mobile") {
        context.mobileDriver = await this.mobileDriver.startSession(request.env);
      }

      // 🔹 Run test
      await test.run(context);

      const endedAt = Date.now();

      // ✅ WRITE ALLURE RESULT
      await writeAllureResult(test.id, test.name, "passed", startedAt, endedAt);

      return makeResult(test, "passed", startedAt, endedAt, attempt, artifacts);

    } catch (error) {
      const endedAt = Date.now();

      if (error instanceof SkipTestError) {
        await writeAllureResult(test.id, test.name, "skipped", startedAt, endedAt);

        return makeResult(test, "skipped", startedAt, endedAt, attempt, artifacts, error.message);
      }

      const errorMessage =
        error instanceof Error
          ? `[${test.id}] ${error.message}`
          : `[${test.id}] unknown error`;

      if (isInfraDependencyError(errorMessage)) {
        await writeAllureResult(test.id, test.name, "skipped", startedAt, endedAt);

        return makeResult(test, "skipped", startedAt, endedAt, attempt, artifacts, errorMessage);
      }

      // Screenshot
      if (context.page) {
        const screenshotPath = path.join(process.cwd(), "reports", `${runId}.png`);
        await fs.mkdir(path.dirname(screenshotPath), { recursive: true });

        await context.page.screenshot({ path: screenshotPath, fullPage: true });

        artifacts.push({ type: "screenshot", path: screenshotPath });
      }

      logger.error({
        event: "test_failure",
        testId: test.id,
        attempt,
        message: errorMessage
      });

      // ✅ WRITE ALLURE RESULT
      await writeAllureResult(test.id, test.name, "failed", startedAt, endedAt);

      return makeResult(
        test,
        "failed",
        startedAt,
        endedAt,
        attempt,
        artifacts,
        errorMessage
      );

    } finally {
      if (context.apiContext) {
        await this.apiDriver.stopSession(context.apiContext);
      }

      if (context.mobileDriver) {
        await this.mobileDriver.stopSession(context.mobileDriver);
      }

      if (context.browser && context.browserContext && context.page) {
        const video = context.page.video();

        if (video) {
          const videoPath = await video.path();
          logger.info({ event: "video_captured", path: videoPath, testId: test.id });
        }

        await this.webDriver.stopSession({
          browser: context.browser,
          context: context.browserContext,
          page: context.page
        });
      }
    }
  }
}